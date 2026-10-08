import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Blog from './Blog.jsx';
import BlogPost from './BlogPost.jsx';
import Resources from './Resources.jsx';
import { BuyingGuide } from '../components/products/BuyingGuide.jsx';
import { findPost } from '../data/posts.js';
import { findCatalogProduct } from '../data/catalogProducts.js';

const slug = 'usb-wall-outlet-buying-guide';
const path = '/blog/' + slug;
const wrap = children => <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{children}</MemoryRouter>;

describe('Researched USB buying guide', () => {
  it('renders the sourced guide with an accessible, linked model table', () => {
    render(<MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes><Route path="/blog/:slug" element={<BlogPost />} /></Routes>
    </MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('USB Wall Outlet Buying Guide: Ports, PD and Power');
    const table = screen.getByRole('table', { name: 'FAHINT USB outlet shortlist' });
    expect(within(table).getAllByRole('row')).toHaveLength(8);
    expect(within(table).getAllByRole('columnheader')).toHaveLength(4);
    expect(within(table).getAllByRole('rowheader')).toHaveLength(7);
    expect(screen.getByRole('region', { name: 'FAHINT USB outlet shortlist' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByText(/Do not add the two port ratings together/)).toBeVisible();
    expect(screen.getByText(/four-port USB charger without AC receptacle openings/)).toBeVisible();
    expect(screen.getByRole('list', { name: 'USB outlet quotation checklist' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Browse USB outlet models' })).toHaveAttribute('href', '/products/usb-outlets');
    expect(screen.getByRole('link', { name: 'Compare A + C configurations' })).toHaveAttribute('href', '/products/usb-outlets?ports=a-c');
    expect(screen.getByRole('link', { name: 'View 65W PD models' })).toHaveAttribute('href', '/products/usb-outlets?charging=pd-65w');
    expect(screen.getByRole('link', { name: 'Review USB product documents' })).toHaveAttribute('href', '/resources?family=usb-outlets');
    expect(screen.getByRole('link', { name: /USB-IF/ })).toHaveAttribute('href', expect.stringContaining('usb.org'));
    expect(document.title).toBe(findPost(slug).title + ' | FAHINT');
  });

  it('keeps every shortlist model and charging figure tied to the published catalog', () => {
    const post = findPost(slug);
    expect(post).toBeDefined();
    const table = post.body.find(block => block.type === 'table');
    expect(table.rows).toHaveLength(7);
    for (const [model, ports, rating, charging] of table.rows) {
      const product = findCatalogProduct('usb-outlets', model.href.split('/').pop());
      expect(product?.sku).toBe(model.label);
      const summary = Object.fromEntries(product.specificationSummary);
      expect(ports).toBe(summary.Interfaces);
      expect(rating).toContain(summary.Receptacle || summary.Input);
      expect(charging.replaceAll(' ', '')).toContain(summary.Charging.replaceAll(' ', ''));
    }
    const content = post.body.map(block => block.text || '').join(' ');
    expect(content).toMatch(/USB-C connector does not by itself establish PD support/);
    expect(content).toMatch(/simultaneous-port power sharing is not published/);
    expect(content).not.toMatch(/130W|charges all|guaranteed|USB-IF certified/i);
    expect(post.coverCaption).toMatch(/illustrat/i);
    expect(new Set(post.sources.filter(source => source.href.startsWith('https:')).map(source => new URL(source.href).hostname)).size).toBe(4);
  });

  it('appears in the existing blog', () => {
    render(wrap(<Blog />));
    expect(screen.getByRole('link', { name: 'USB Wall Outlet Buying Guide: Ports, PD and Power' })).toHaveAttribute('href', path);
    expect(screen.getByRole('status')).toHaveTextContent('11 articles');
  });

  it('is linked from the USB family buying guide', () => {
    render(wrap(<BuyingGuide line="usb-outlets" />));
    expect(screen.getByRole('link', { name: 'Read the USB outlet buying guide' })).toHaveAttribute('href', path);
  });

  it('is linked from resources without replacing any document downloads', () => {
    render(wrap(<Resources />));
    expect(screen.getByRole('link', { name: 'Read the USB outlet buying guide' })).toHaveAttribute('href', path);
    expect(screen.getAllByRole('link', { name: /^Download .* PDF$/ })).toHaveLength(8);
  });
});
