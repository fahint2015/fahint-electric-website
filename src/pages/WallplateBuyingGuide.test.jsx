import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Blog from './Blog.jsx';
import BlogPost from './BlogPost.jsx';
import Resources from './Resources.jsx';
import { BuyingGuide } from '../components/products/BuyingGuide.jsx';
import { findPost } from '../data/posts.js';
import { findCatalogProduct } from '../data/catalogProducts.js';

const slug = 'wallplate-buying-guide';
const path = '/blog/' + slug;
const wrap = children => <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{children}</MemoryRouter>;

describe('Researched wallplate buying guide', () => {
  it('renders an accessible model comparison, quotation checklist and article metadata', () => {
    render(<MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes><Route path="/blog/:slug" element={<BlogPost />} /></Routes>
    </MemoryRouter>);
    const post = findPost(slug);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Wallplate Buying Guide: Openings, Sizes and Finishes');
    const table = screen.getByRole('table', { name: 'FAHINT wallplate configuration comparison' });
    expect(within(table).getAllByRole('row')).toHaveLength(9);
    expect(within(table).getAllByRole('columnheader')).toHaveLength(4);
    expect(within(table).getAllByRole('rowheader')).toHaveLength(8);
    expect(screen.getByRole('region', { name: 'FAHINT wallplate configuration comparison' })).toHaveAttribute('tabindex', '0');
    expect(within(screen.getByRole('list', { name: 'Wallplate quotation checklist' })).getAllByRole('listitem')).toHaveLength(7);
    expect(screen.getByRole('link', { name: 'Browse all FAHINT wallplate configurations' })).toHaveAttribute('href', '/products/wallplates');
    expect(screen.getByRole('link', { name: 'Review wallplate product documents' })).toHaveAttribute('href', '/resources?family=wallplates');
    expect(screen.getByRole('link', { name: 'Prepare a device and wallplate finish specification' })).toHaveAttribute('href', '/blog/gfci-colour-finishes-specification');
    expect(screen.getByRole('link', { name: 'Ask a product question' })).toHaveAttribute('href', '/contact?topic=technical');
    expect(document.title).toBe(post.title + ' | FAHINT');
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute('content', post.excerpt);
    const graph = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)['@graph'];
    expect(graph.find(item => item['@type'] === 'Article')).toMatchObject({ headline: post.title, description: post.excerpt, datePublished: '2026-10-06' });
    for (const link of within(screen.getByRole('navigation', { name: 'In this article' })).getAllByRole('link')) {
      const id = new URL(link.getAttribute('href'), 'https://example.com').hash.slice(1);
      expect(document.getElementById(id)).toHaveTextContent(link.textContent);
    }
  });

  it('uses the catalog opening, finish and exterior width by height for eight linked configurations', () => {
    const post = findPost(slug);
    expect(post).toBeDefined();
    const table = post.body.find(block => block.type === 'table');
    expect(table.rows.map(row => row[0].label)).toEqual(['BS1801', 'BS1802', 'BS1804', 'BS1806', 'BS1807', 'BS18012', 'BS1803-G', 'BS1803-M']);
    expect(table.columns[3]).toBe('Exterior W × H (mm)');
    for (const [model, opening, finish, dimensions] of table.rows) {
      const product = findCatalogProduct('wallplates', model.href.split('/').pop());
      expect(product?.sku).toBe(model.label);
      const summary = Object.fromEntries(product.specificationSummary);
      const fields = Object.fromEntries(product.specificationGroups.flatMap(group => group.rows));
      expect(opening).toBe(`${summary.Opening} / ${summary.Gangs}`);
      expect(finish).toBe(`${summary.Surface} / ${summary.Fixing}`);
      const mm = value => value.match(/\(([\d.]+)\s*mm\)/)[1];
      expect(dimensions).toBe(`${mm(fields['Product width'])} × ${mm(fields['Product height'])} mm`);
    }
  });

  it('keeps sources, illustration disclosure and the documented specification boundaries', () => {
    const post = findPost(slug);
    expect(post).toBeDefined();
    const text = JSON.stringify(post.body);
    expect(text).not.toMatch(/6\.4\s*mm|universal fit|fits all|guaranteed|21 (?:independent )?models|BS1805/);
    expect(text).toMatch(/Both supplied product-library drawings show 6\.5 mm thickness/);
    expect(text).toMatch(/outer edges/);
    expect(text).toMatch(/mounting positions/);
    expect(text).toMatch(/BS1801-M/);
    expect(text).toMatch(/BS1803-G and BS1803-M/);
    expect(text).toMatch(/polycarbonate \(PC\)/);
    expect(text).toMatch(/Glossy and matte are surface finishes, not two different materials/);
    expect(text).toMatch(/E501377-20181016.*August 16, 2022.*BS1801, BS1802, BS1803 and BS1804/);
    expect(text).toMatch(/E501377-20230919.*September 25, 2023.*BS1806, BS1807, BS18012, BS18013, BS18014, BS18032, BS18033 and BS18034/);
    expect(text).toMatch(/finish.*current listing status/);
    expect(text).not.toMatch(/add a wallplate to the inquiry list/i);
    expect(post.coverCaption).toMatch(/illustrat/i);
    expect(post.coverSource).toMatch(/illustrat/i);
    expect(post.coverWidth).toBe(1600);
    expect(post.coverHeight).toBe(900);
    const sources = post.sources.filter(source => source.href.startsWith('https:'));
    expect(new Set(sources.map(source => new URL(source.href).hostname))).toEqual(new Set(['leviton.com', 'www.legrand.us']));
    for (const block of post.body.filter(block => Number.isInteger(block.source))) expect(post.sources[block.source]).toBeDefined();
  });

  it('appears in Blog alongside the existing guides', () => {
    render(wrap(<Blog />));
    expect(screen.getByRole('link', { name: 'Wallplate Buying Guide: Openings, Sizes and Finishes' })).toHaveAttribute('href', path);
    expect(screen.getByRole('status')).toHaveTextContent('11 articles');
  });

  it('is linked from the wallplate family buying guide', () => {
    render(wrap(<BuyingGuide line="wallplates" />));
    expect(screen.getByRole('link', { name: 'Read the wallplate buying guide' })).toHaveAttribute('href', path);
  });

  it('is linked from Resources without replacing the other guides or downloads', () => {
    render(wrap(<Resources />));
    expect(screen.getByRole('link', { name: 'Read the wallplate buying guide' })).toHaveAttribute('href', path);
    expect(screen.getByRole('link', { name: 'Read the USB outlet buying guide' })).toHaveAttribute('href', '/blog/usb-wall-outlet-buying-guide');
    expect(screen.getByRole('link', { name: 'Read the dimmer buying guide' })).toHaveAttribute('href', '/blog/dimmer-buying-guide-led-0-10v');
    expect(screen.getAllByRole('link', { name: /^Download .* PDF$/ })).toHaveLength(8);
  });
});
