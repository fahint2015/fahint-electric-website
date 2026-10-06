import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Blog from './Blog.jsx';
import BlogPost from './BlogPost.jsx';
import Resources from './Resources.jsx';
import { BuyingGuide } from '../components/products/BuyingGuide.jsx';
import { findPost } from '../data/posts.js';
import { findCatalogProduct } from '../data/catalogProducts.js';

const slug = 'dimmer-buying-guide-led-0-10v';
const path = '/blog/' + slug;
const wrap = children => <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{children}</MemoryRouter>;

describe('Researched dimmer buying guide', () => {
  it('renders the sourced guide with an accessible model table and quotation checklist', () => {
    render(<MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes><Route path="/blog/:slug" element={<BlogPost />} /></Routes>
    </MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dimmer Buying Guide: LED Loads and 0–10V Compatibility');
    const table = screen.getByRole('table', { name: 'FAHINT dimmer model comparison' });
    expect(within(table).getAllByRole('row')).toHaveLength(3);
    expect(within(table).getAllByRole('columnheader')).toHaveLength(4);
    expect(within(table).getAllByRole('rowheader')).toHaveLength(2);
    expect(screen.getByRole('region', { name: 'FAHINT dimmer model comparison' })).toHaveAttribute('tabindex', '0');
    for (const model of ['DM2010', 'DM2010S']) {
      expect(within(table).getByRole('link', { name: model })).toHaveAttribute('href', '/products/dimmers/' + model.toLowerCase());
    }
    const checklist = screen.getByRole('list', { name: 'Dimmer quotation checklist' });
    expect(within(checklist).getAllByRole('listitem')).toHaveLength(7);
    expect(screen.getByRole('link', { name: 'Browse FAHINT dimmer models' })).toHaveAttribute('href', '/products/dimmers');
    expect(screen.getByRole('link', { name: 'Review dimmer product documents' })).toHaveAttribute('href', '/resources?family=dimmers');
    expect(screen.getByRole('link', { name: 'Ask a product question' })).toHaveAttribute('href', '/contact?topic=technical');
    expect(document.title).toBe(findPost(slug).title + ' | FAHINT');
  });

  it('keeps both models and load units tied to the published catalog without inventing compatibility', () => {
    const post = findPost(slug);
    expect(post).toBeDefined();
    const table = post.body.find(block => block.type === 'table');
    expect(table.rows).toHaveLength(2);
    for (const [model, supply, control, load] of table.rows) {
      const product = findCatalogProduct('dimmers', model.href.split('/').pop());
      expect(product?.sku).toBe(model.label);
      const fields = Object.fromEntries(product.specificationGroups.flatMap(group => group.rows));
      expect(supply).toContain(fields['Operating voltage']);
      expect(supply).toContain(fields['Current rating']);
      expect(control).toContain(fields['Control method']);
      expect(control).toContain(fields['Circuit configuration']);
      for (const label of ['LED / CFL load', 'Incandescent load', 'Maximum load']) {
        if (fields[label]) expect(load).toContain(fields[label]);
      }
    }
    const text = post.body.map(block => block.text || '').join(' ');
    expect(text).toContain('600W incandescent limit is not an LED rating');
    expect(text).toContain('specified in VA, not as a 600W LED dimmer');
    expect(text).toContain('do not specify a forward-phase or reverse-phase type');
    expect(text).toContain('do not publish the control-circuit current capacity or maximum driver count');
    expect(text).toContain('not a report of tests already completed by FAHINT');
    expect(text).not.toMatch(/works with all|guaranteed flicker-free|universally compatible/i);
    expect(post.coverCaption).toMatch(/illustrat/i);
    expect(post.coverSource).toMatch(/illustrat/i);
    const sources = post.sources.filter(source => source.href.startsWith('https:'));
    expect(sources).toHaveLength(4);
    expect(new Set(sources.map(source => new URL(source.href).hostname)).size).toBe(3);
  });

  it('appears in Blog alongside the existing USB guide', () => {
    render(wrap(<Blog />));
    expect(screen.getByRole('link', { name: 'Dimmer Buying Guide: LED Loads and 0–10V Compatibility' })).toHaveAttribute('href', path);
    expect(screen.getByRole('link', { name: 'USB Wall Outlet Buying Guide: Ports, PD and Power' })).toHaveAttribute('href', '/blog/usb-wall-outlet-buying-guide');
    expect(screen.getByRole('status')).toHaveTextContent('10 articles');
  });

  it('is linked from the dimmer family buying guide', () => {
    render(wrap(<BuyingGuide line="dimmers" />));
    expect(screen.getByRole('link', { name: 'Read the dimmer buying guide' })).toHaveAttribute('href', path);
  });

  it('is linked from Resources without removing the USB guide or document downloads', () => {
    render(wrap(<Resources />));
    expect(screen.getByRole('link', { name: 'Read the dimmer buying guide' })).toHaveAttribute('href', path);
    expect(screen.getByRole('link', { name: 'Read the USB outlet buying guide' })).toHaveAttribute('href', '/blog/usb-wall-outlet-buying-guide');
    expect(screen.getAllByRole('link', { name: /^Download .* PDF$/ })).toHaveLength(8);
  });
});
