import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { productLines } from '../data/lines.js';
import { publicAssetFile } from '../test/publicAssetFile.js';

async function renderNext() {
  expect(existsSync('src/pages/HomeNext.jsx'), 'New homepage must be its own implementation').toBe(true);
  const pagePath = './HomeNext.jsx';
  const { default: HomeNext } = await import(/* @vite-ignore */ pagePath);
  return render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><HomeNext /></MemoryRouter>);
}

describe('new homepage preview', () => {
  it('has a fresh brand statement and separate brand and private-label entry points', async () => {
    const { container } = await renderNext();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Considered design. Everyday power.');
    expect(screen.getByRole('link', { name: 'Explore FAHINT products' })).toHaveAttribute('href', '/products');
    expect(screen.getByRole('link', { name: 'Create your own range' })).toHaveAttribute('href', '/home-next#private-label');
    expect(container.querySelector('#homepage')).toBeNull();
    expect(readFileSync('src/pages/HomeNext.jsx', 'utf8')).not.toMatch(/EditorialHomepageFront|HomeFaqInquiry|HomeCertifications/);
  });

  it('shows all seven canonical families once and updates the scene and destination on selection', async () => {
    await renderNext();
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(productLines.length);
    for (const tab of tabs) expect(document.getElementById(tab.getAttribute('aria-controls'))).not.toBeNull();
    for (const line of productLines) {
      const tab = screen.getByRole('tab', { name: line.name });
      fireEvent.click(tab);
      expect(tab).toHaveAttribute('aria-selected', 'true');
      const panel = screen.getByRole('tabpanel');
      expect(panel).toHaveAttribute('aria-labelledby', tab.id);
      expect(within(panel).getByRole('link', { name: `Explore ${line.name}` })).toHaveAttribute('href', `/products/${line.slug}`);
      expect(within(panel).getByRole('img')).toHaveAttribute('src', expect.stringContaining('/assets/'));
    }
  });

  it('supports keyboard selection without adding seven extra tab stops', async () => {
    await renderNext();
    const tabs = screen.getAllByRole('tab');
    tabs[0].focus();
    fireEvent.keyDown(tabs[0], { key: 'ArrowDown' });
    expect(tabs[1]).toHaveFocus();
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(tabs[1], { key: 'End' });
    expect(tabs.at(-1)).toHaveFocus();
    fireEvent.keyDown(tabs.at(-1), { key: 'Home' });
    expect(tabs[0]).toHaveFocus();
    expect(tabs.filter((tab) => tab.tabIndex === 0)).toHaveLength(1);
  });

  it('uses existing documents and keeps certification coverage model-specific', async () => {
    await renderNext();
    const pdfs = screen.getAllByRole('link').filter((link) => link.getAttribute('href')?.endsWith('.pdf'));
    expect(pdfs.length).toBeGreaterThanOrEqual(3);
    for (const link of pdfs) expect(existsSync(publicAssetFile(link.getAttribute('href')))).toBe(true);
    expect(screen.getByText(/Certification applies to the models named in each document/)).toBeInTheDocument();
    expect(screen.queryByText(/6.hour|10.day|ALDI|zero complaints/i)).not.toBeInTheDocument();
  });

  it('keeps this earlier design local while publishing the completed homepage', async () => {
    await renderNext();
    const entry = readFileSync('src/App.jsx', 'utf8');
    expect(entry).toContain('path="/" element={<HomeStudio />}');
    expect(entry).toContain('{import.meta.env.DEV && <Route path="/home-next" element={<HomeNext />}');
  });

  it('limits preview metadata to the new route and restores it when leaving', async () => {
    const previousTitle = document.title;
    const { unmount } = await renderNext();
    expect(document.title).toBe('FAHINT — New homepage preview');
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
    unmount();
    expect(document.title).toBe(previousTitle);
    expect(document.querySelector('meta[name="robots"]')).toBeNull();
  });
});
