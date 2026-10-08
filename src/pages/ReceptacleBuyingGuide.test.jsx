import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Blog from './Blog.jsx';
import BlogPost from './BlogPost.jsx';
import Resources from './Resources.jsx';
import { BuyingGuide, ModelBuyingChecklist } from '../components/products/BuyingGuide.jsx';
import { findPost } from '../data/posts.js';
import { findCatalogProduct } from '../data/catalogProducts.js';
import { findModelCertificate } from '../data/certificates.js';

const slug = 'standard-receptacle-buying-guide';
const path = '/blog/' + slug;
const wrap = children => <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{children}</MemoryRouter>;

describe('Researched standard receptacle buying guide', () => {
  it('renders a navigable article, model table, RFQ checklist and search metadata', () => {
    render(<MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes><Route path="/blog/:slug" element={<BlogPost />} /></Routes>
    </MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Standard receptacle buying guide: ratings, TR/WR and wiring');
    const post = findPost(slug);
    const table = screen.getByRole('table', { name: 'FAHINT 125V receptacle comparison' });
    expect(within(table).getAllByRole('row')).toHaveLength(11);
    expect(within(table).getAllByRole('columnheader')).toHaveLength(4);
    expect(screen.getByRole('region', { name: 'FAHINT 125V receptacle comparison' })).toHaveAttribute('tabindex', '0');
    expect(within(screen.getByRole('list', { name: 'Receptacle quotation checklist' })).getAllByRole('listitem')).toHaveLength(7);
    expect(screen.getByRole('link', { name: 'Review receptacle product documents' })).toHaveAttribute('href', '/resources?family=receptacles');
    expect(screen.getByRole('link', { name: 'Read the wallplate buying guide' })).toHaveAttribute('href', '/blog/wallplate-buying-guide');
    expect(screen.getByRole('link', { name: 'Ask a product question' })).toHaveAttribute('href', '/contact?topic=technical');
    expect(document.title).toBe(post.title + ' | FAHINT');
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute('content', post.excerpt);
    const graph = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)['@graph'];
    expect(graph.find(item => item['@type'] === 'Article')).toMatchObject({ headline: post.title, datePublished: '2026-10-07', dateModified: '2026-10-07' });
    for (const link of within(screen.getByRole('navigation', { name: 'In this article' })).getAllByRole('link')) {
      expect(document.getElementById(new URL(link.getAttribute('href'), 'https://example.com').hash.slice(1))).toHaveTextContent(link.textContent);
    }
    expect(screen.getByText(post.coverCaption)).toBeVisible();
    expect(post.coverCaption).toMatch(/illustrat/i);
  });

  it('matches every comparison row to its actual model and preserves the Q terminal distinction', () => {
    const post = findPost(slug);
    expect(post).toBeDefined();
    const rows = post.body.find(block => block.type === 'table').rows;
    expect(rows.map(row => row[0].label)).toEqual(['D15', 'D15Q', 'D20', 'DT15', 'DW20', 'R15', 'R15Q', 'RT20', 'RW20', 'CT15']);
    for (const [model, face, rating, terminals] of rows) {
      const product = findCatalogProduct('receptacles', model.href.split('/').pop());
      expect(product?.sku).toBe(model.label);
      const fields = Object.fromEntries(product.specificationGroups.flatMap(group => group.rows));
      expect(rating).toBe(`${fields['Device rating'].match(/\d+A/)[0]}, 125V AC`);
      expect(fields['Device rating']).toContain('125V');
      const quickWire = fields['Wiring method'].toLowerCase().includes('push-in');
      expect(terminals).toBe(quickWire ? 'Side / push-in quick wire' : 'Side / back wire');
      const protection = fields['Weather-resistant'] === 'Yes'
        ? 'TR + WR'
        : fields['Tamper-resistant'] === 'Yes' ? 'TR' : 'non-TR, non-WR';
      expect(face.split(' / ')[1]).toBe(protection);
    }
  });

  it('uses catalogue industrial ratings and commercial names without expanding certificate scope', () => {
    const post = findPost(slug);
    expect(post).toBeDefined();
    const text = post.body.map(block => block.text || '').join(' ');
    expect(text).toMatch(/December 13, 2021.*E498095-20211123/);
    expect(text).toMatch(/18.*model/);
    expect(text).toMatch(/C\/CT\/CW.*CR15.*CR20.*CD20/);
    expect(text).toMatch(/current listing status/);
    expect(text).toMatch(/missing.*PDF.*not.*uncertified/i);
    expect(text).toMatch(/CR15.*15A, 125V\/250V.*CR20.*CD20.*20A, 125V\/250V/);
    expect(text).toMatch(/C15\/C15Q\/C20.*CT15\/CT15Q\/CT20.*CW15\/CW15Q\/CW20/);
    expect(text).toMatch(/15A push-in.*#14 AWG Only/);
    expect(text).toMatch(/Leviton.*5325.*side terminals and Quickwire terminals separately/);
    expect(text).toMatch(/not installation specifications for FAHINT/);
    expect(text).toMatch(/shared receptacle range drawing.*33\.2 mm.*106 mm.*23\.8 mm/);
    expect(text).not.toMatch(/CD20 has conflicting|no separate dimension drawing|R15-C/);
    expect(text).toMatch(/TR.*WR.*do not provide GFCI protection/);
    expect(text).toMatch(/cover.*enclosure/);
    expect(text).not.toMatch(/universally compatible|fully certified|guaranteed|childproof|waterproof outlet/i);
    expect(findModelCertificate(findCatalogProduct('receptacles', 'rt15-c'))).toBeUndefined();
    const domains = post.sources.filter(source => source.href.startsWith('https:')).map(source => new URL(source.href).hostname);
    expect(new Set(domains)).toEqual(new Set(['leviton.com', 'www.legrand.us']));
    for (const block of post.body.filter(block => Number.isInteger(block.source))) expect(post.sources[block.source]).toBeDefined();
    for (const block of post.body) {
      for (const link of block.links || []) if (link.href.startsWith('/blog/')) expect(findPost(link.href.split('/').pop())).toBeDefined();
    }
  });

  it('is available from Blog and the related wallplate guide', () => {
    render(wrap(<Blog />));
    expect(screen.getByRole('link', { name: 'Standard receptacle buying guide: ratings, TR/WR and wiring' })).toHaveAttribute('href', path);
    expect(screen.getByRole('status')).toHaveTextContent('11 articles');
    expect(findPost('wallplate-buying-guide').body.flatMap(block => block.links || []).some(link => link.href === path)).toBe(true);
  });

  it('connects both the family guide and model procurement checklist to the full guide', () => {
    render(wrap(<><BuyingGuide line="receptacles" /><ModelBuyingChecklist product={findCatalogProduct('receptacles', 'dt15')} /></>));
    const links = screen.getAllByRole('link', { name: 'Read the standard receptacle buying guide' });
    expect(links).toHaveLength(2);
    for (const link of links) expect(link).toHaveAttribute('href', path);
  });

  it('adds a Resources entry while keeping existing guides and original downloads', () => {
    render(wrap(<Resources />));
    expect(screen.getByRole('link', { name: 'Read the standard receptacle buying guide' })).toHaveAttribute('href', path);
    for (const label of ['USB outlet', 'dimmer', 'wallplate', 'light switch']) expect(screen.getByRole('link', { name: `Read the ${label} buying guide` })).toBeVisible();
    expect(screen.getAllByRole('link', { name: /^Download .* PDF$/ })).toHaveLength(8);
  });
});
