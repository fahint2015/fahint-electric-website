import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { company } from '../data/company.js';
import FloatingRail from './FloatingRail.jsx';

afterEach(() => vi.unstubAllGlobals());

describe('FloatingRail', () => {
  it('does not let Studio homepage styles hide the shared mobile contact and top actions', () => {
    const studio = readFileSync('src/styles/studio.css', 'utf8');
    expect(studio).not.toMatch(/body:has\(\.studio-(?:page|home)\)\s+\.rail\s*\{[^}]*display:\s*none/);
  });

  it('offers direct WhatsApp and email links with accessible contact names', () => {
    render(<FloatingRail />);
    const contact = within(screen.getByRole('navigation', { name: 'Quick contact' }));
    const whatsapp = contact.getByRole('link', { name: `WhatsApp ${company.phone}` });
    expect(whatsapp).toHaveAttribute('href', `https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}`);
    expect(whatsapp).toHaveAttribute('target', '_blank');
    expect(whatsapp).toHaveAttribute('rel', 'noopener noreferrer');
    expect(contact.getByRole('link', { name: `Email ${company.email}` })).toHaveAttribute('href', `mailto:${company.email}`);
  });

  it('shows the top action immediately when the page mounts already scrolled', () => {
    vi.stubGlobal('scrollY', 800);
    render(<FloatingRail />);
    expect(screen.getByRole('button', { name: 'Back to top' })).toBeInTheDocument();
  });

  it('prefills editable product inquiries, updates the model, and clears it outside product pages', () => {
    const { rerender } = render(<FloatingRail />);
    for (const product of [
      { sku: 'GF15', name: '15A Self-Test GFCI Receptacle' },
      { sku: 'FTR15C-3100', name: '15A USB-A + USB-C Outlet · 3.1A' },
      { sku: 'DS15.3', name: '15A 3-Way Paddle Switch' },
      { sku: 'TEST & 1', name: 'Encoding + # ? / 测试' },
    ]) {
      rerender(<FloatingRail product={product} />);
      const contact = within(screen.getByRole('navigation', { name: 'Quick contact' }));
      const whatsapp = new URL(contact.getByRole('link', { name: `WhatsApp ${company.phone}` }).href);
      const email = new URL(contact.getByRole('link', { name: `Email ${company.email}` }).href);
      const message = `Hi FAHINT, I'm interested in ${product.sku} (${product.name}). Could you share pricing and availability?`;
      expect(whatsapp.searchParams.get('text')).toBe(message);
      expect(email.searchParams.get('subject')).toBe(`Inquiry about ${product.sku}`);
      expect(email.searchParams.get('body')).toBe(message);
      expect(email.pathname).toBe(company.email);
      expect([...email.searchParams.keys()]).toEqual(['subject', 'body']);
    }
    rerender(<FloatingRail />);
    expect(screen.getByRole('link', { name: `WhatsApp ${company.phone}` }).href).toBe(`https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}`);
    expect(screen.getByRole('link', { name: `Email ${company.email}` }).href).toBe(`mailto:${company.email}`);
  });

  it.each([false, true])('returns to the top while honoring reduced motion: %s', (reducedMotion) => {
    vi.stubGlobal('scrollY', 0);
    vi.stubGlobal('scrollTo', vi.fn());
    vi.stubGlobal('matchMedia', () => ({ matches: reducedMotion }));
    render(<FloatingRail />);
    expect(screen.queryByRole('button', { name: 'Back to top' })).not.toBeInTheDocument();
    vi.stubGlobal('scrollY', 800);
    fireEvent.scroll(window);
    fireEvent.click(screen.getByRole('button', { name: 'Back to top' }));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    vi.stubGlobal('scrollY', 0);
    fireEvent.scroll(window);
    expect(screen.queryByRole('button', { name: 'Back to top' })).not.toBeInTheDocument();
  });
});
