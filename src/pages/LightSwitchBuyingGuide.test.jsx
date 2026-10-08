import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Blog from './Blog.jsx';
import BlogPost from './BlogPost.jsx';
import Resources from './Resources.jsx';
import { BuyingGuide } from '../components/products/BuyingGuide.jsx';
import { findPost } from '../data/posts.js';
import { findCatalogProduct } from '../data/catalogProducts.js';

const slug = 'light-switch-buying-guide';
const path = '/blog/' + slug;
const wrap = children => <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{children}</MemoryRouter>;

describe('Researched light switch buying guide', () => {
  it('renders the model comparison, quotation checklist, navigation and article metadata', () => {
    render(<MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes><Route path="/blog/:slug" element={<BlogPost />} /></Routes>
    </MemoryRouter>);
    const post = findPost(slug);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Light Switch Buying Guide: Single-Pole, 3-Way and Combination');
    const table = screen.getByRole('table', { name: 'FAHINT lighting switch model comparison' });
    expect(within(table).getAllByRole('row')).toHaveLength(7);
    expect(within(table).getAllByRole('columnheader')).toHaveLength(4);
    expect(within(table).getAllByRole('rowheader')).toHaveLength(6);
    expect(screen.getByRole('region', { name: 'FAHINT lighting switch model comparison' })).toHaveAttribute('tabindex', '0');
    expect(within(screen.getByRole('list', { name: 'Light switch quotation checklist' })).getAllByRole('listitem')).toHaveLength(7);
    expect(screen.getByRole('link', { name: 'Browse FAHINT lighting switches' })).toHaveAttribute('href', '/products/lighting-switches');
    expect(screen.getByRole('link', { name: 'Review lighting switch product documents' })).toHaveAttribute('href', '/resources?family=lighting-switches');
    expect(screen.getByRole('link', { name: 'Read the dimmer buying guide' })).toHaveAttribute('href', '/blog/dimmer-buying-guide-led-0-10v');
    expect(screen.getByRole('link', { name: 'Read the wallplate buying guide' })).toHaveAttribute('href', '/blog/wallplate-buying-guide');
    expect(screen.getByRole('link', { name: 'Ask a product question' })).toHaveAttribute('href', '/contact?topic=technical');
    expect(screen.getByText(post.coverCaption)).toBeVisible();
    expect(document.title).toBe(post.title + ' | FAHINT');
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute('content', post.excerpt);
    const graph = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)['@graph'];
    expect(graph.find(item => item['@type'] === 'Article')).toMatchObject({
      headline: post.title, description: post.excerpt, datePublished: '2026-10-06', dateModified: '2026-10-06',
    });
    for (const link of within(screen.getByRole('navigation', { name: 'In this article' })).getAllByRole('link')) {
      const id = new URL(link.getAttribute('href'), 'https://example.com').hash.slice(1);
      expect(document.getElementById(id)).toHaveTextContent(link.textContent);
    }
  });

  it('uses all six published models without merging the paddle and toggle voltage ratings', () => {
    const post = findPost(slug);
    expect(post).toBeDefined();
    const table = post.body.find(block => block.type === 'table');
    expect(table.rows.map(row => row[0].label)).toEqual(['DS15', 'DS15.3', 'DS1502', 'DS1503', 'T15', 'T15.3']);
    for (const [model, control, rating] of table.rows) {
      const product = findCatalogProduct('lighting-switches', model.href.split('/').pop());
      expect(product?.sku).toBe(model.label);
      const fields = Object.fromEntries(product.specificationGroups.flatMap(group => group.rows));
      const voltage = model.label.startsWith('T') ? '125V' : '120/277V';
      expect(rating).toBe(`15A, ${voltage} AC`);
      expect(fields['Device rating']).toContain(voltage);
      expect(fields['Device rating']).toContain('15A');
      if (model.label.endsWith('.3')) expect(control).toContain('3-way');
    }
  });

  it('keeps the exact certificate limits and distinguishes rocker count from ratings and gang count', () => {
    const post = findPost(slug);
    expect(post).toBeDefined();
    const text = post.body.map(block => block.text || '').join(' ');
    expect(text).toMatch(/October 18, 2024.*E528137-20241016.*DS15, DS15\.3 and T15/);
    expect(text).toMatch(/T15\.3 is not named/);
    expect(text).toMatch(/DS1502 and DS1503.*ETL.*E5033770/);
    expect(text).toMatch(/do not yet have.*ETL.*PDF/i);
    expect(text).toMatch(/current listing status/);
    expect(text).toMatch(/not.*(?:three buttons|three-button)/);
    expect(text).toMatch(/single-gang/);
    expect(text).toMatch(/do not multiply.*15A.*rocker/i);
    expect(text).not.toMatch(/30A|45A|works? with all|universal compatibility|fully certified|guaranteed/);
    expect(text).toMatch(/catalog.*page 25/i);
    expect(post.coverCaption).toMatch(/illustrat/i);
    expect(post.coverSource).toMatch(/illustrat/i);
    expect([post.coverWidth, post.coverHeight]).toEqual([1920, 450]);
    const sources = post.sources.filter(source => source.href.startsWith('https:'));
    expect(new Set(sources.map(source => new URL(source.href).hostname))).toEqual(new Set(['leviton.com', 'www.legrand.us']));
    for (const block of post.body.filter(block => Number.isInteger(block.source))) expect(post.sources[block.source]).toBeDefined();
  });

  it('appears in Blog alongside the existing guides', () => {
    render(wrap(<Blog />));
    expect(screen.getByRole('link', { name: 'Light Switch Buying Guide: Single-Pole, 3-Way and Combination' })).toHaveAttribute('href', path);
    expect(screen.getByRole('status')).toHaveTextContent('11 articles');
  });

  it('is linked from the lighting-switch family guide', () => {
    render(wrap(<BuyingGuide line="lighting-switches" />));
    expect(screen.getByRole('link', { name: 'Read the light switch buying guide' })).toHaveAttribute('href', path);
  });

  it('is linked from Resources without replacing existing guides or downloads', () => {
    render(wrap(<Resources />));
    expect(screen.getByRole('link', { name: 'Read the light switch buying guide' })).toHaveAttribute('href', path);
    for (const label of ['USB outlet', 'dimmer', 'wallplate']) expect(screen.getByRole('link', { name: `Read the ${label} buying guide` })).toBeVisible();
    expect(screen.getAllByRole('link', { name: /^Download .* PDF$/ })).toHaveLength(8);
  });
});
