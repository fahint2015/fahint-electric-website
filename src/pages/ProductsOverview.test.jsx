import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { productLines } from '../data/lines.js';
import { products } from '../data/products.js';
import { getCatalogProducts, productHref } from '../data/catalogProducts.js';
import ProductsOverview from './ProductsOverview.jsx';

function renderOverview() {
  return render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><ProductsOverview /></MemoryRouter>);
}

describe('ProductsOverview model directory', () => {
  it('opens with a searchable catalog instead of a second brand campaign', () => {
    renderOverview();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Find your wiring devices.');
    expect(screen.getByRole('searchbox', { name: 'Search by model or feature' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Download catalog' })).toHaveAttribute('href', 'assets/documents/fahint-product-catalog.pdf');
    expect(document.querySelector('.product-family-card')).toBeNull();
    expect(document.querySelector('.product-overview-hero__image')).toBeNull();
  });

  it('uses seven canonical categories with shortcuts, accurate totals and model previews', () => {
    renderOverview();
    const links = within(screen.getByRole('navigation', { name: 'Product ranges' })).getAllByRole('link');
    expect(links).toHaveLength(productLines.length);
    productLines.forEach((line, i) => {
      expect(links[i]).toHaveAccessibleName(line.name);
      expect(links[i]).toHaveAttribute('href', '/products/#range-' + line.slug);
      expect(document.getElementById('range-' + line.slug)).toBeInTheDocument();
      const range = screen.getByRole('region', { name: line.name });
      const count = getCatalogProducts(line.slug).length + (line.slug === 'gfci' ? products.length : 0);
      expect(within(range).getByText(count + ' model configurations')).toBeInTheDocument();
      expect(within(range).getByRole('link', { name: 'View all ' + line.name })).toHaveAttribute('href', '/products/' + line.slug + '/');
      expect(within(range).getAllByRole('article').length).toBe(Math.min(count, 3));
    });
  });

  it('keeps category shortcuts on the product page under the repository base path', () => {
    function LocationProbe() {
      const location = useLocation();
      return <output data-testid="route">{location.pathname}{location.hash}</output>;
    }
    render(<MemoryRouter basename="/fahint-electric-website" initialEntries={['/fahint-electric-website/products']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><ProductsOverview /><LocationProbe /></MemoryRouter>);
    const link = within(screen.getByRole('navigation', { name: 'Product ranges' })).getByRole('link', { name: 'Dimmers', exact: true });
    expect(link).toHaveAttribute('href', '/fahint-electric-website/products/#range-dimmers');
    fireEvent.click(link);
    expect(screen.getByTestId('route')).toHaveTextContent('/products/#range-dimmers');
  });

  it('uses exact source images, names, parameters and routes for every preview', () => {
    const { container } = renderOverview();
    const records = productLines.flatMap((line) => [
      ...(line.slug === 'gfci' ? products.map((p) => ({ ...p, line: 'gfci', href: '/products/gfci/' + p.sku.toLowerCase(), facts: [['Rating', p.rating], ['Variant', p.feature]] })) : []),
      ...getCatalogProducts(line.slug).map((p) => ({ ...p, href: productHref(p), facts: p.keyFacts.slice(0, 2) }))
    ]);
    const cards = container.querySelectorAll('.range-model');
    expect(cards).toHaveLength(20);
    cards.forEach((card) => {
      const p = records.find((item) => item.line === card.dataset.line && item.sku === card.dataset.sku);
      expect(p).toBeTruthy();
      expect(within(card).getByRole('heading', { name: p.name })).toBeInTheDocument();
      expect(within(card).getByRole('link', { name: 'View ' + p.sku + ' details' })).toHaveAttribute('href', p.href + '/');
      expect(card.querySelector('img')).toHaveAttribute('src', expect.stringContaining(p.assets.card));
      expect(existsSync('public/' + p.assets.card)).toBe(true);
      expect(card.querySelector('img')).toHaveAttribute('width', '800');
      expect(card.querySelector('img')).toHaveAttribute('height', '800');
      p.facts.forEach(([label, value]) => {
        expect(within(card).getByText(label, { selector: 'dt' })).toBeInTheDocument();
        expect(within(card).getByText(value, { selector: 'dd' })).toBeInTheDocument();
      });
    });
    expect([...screen.getByRole('region', { name: 'Smart Switches' }).querySelectorAll('.range-model')].every((c) => c.dataset.sku.startsWith('US'))).toBe(true);
  });

  it('searches the whole catalog including models outside the initial previews', () => {
    renderOverview();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'ftr20qc dc65w' } });
    expect(screen.getByRole('status')).toHaveTextContent('1 model found');
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'View FTR20QC-DC65W details' })).toHaveAttribute('href', '/products/usb-outlets/ftr20qc-dc65w/');
  });

  it('finds GFCI models using their existing detail routes', () => {
    renderOverview();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: ' gf15 ' } });
    expect(screen.getByRole('status')).toHaveTextContent('1 model found');
    expect(screen.getByRole('link', { name: 'View GF15 details' })).toHaveAttribute('href', '/products/gfci/gf15/');
  });

  it('shows an empty state and clears the search while restoring input focus', () => {
    renderOverview();
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'no-such-model-987654' } });
    expect(screen.getByRole('status')).toHaveTextContent('0 models found');
    expect(screen.getByText('No matching models')).toBeInTheDocument();
    expect(screen.queryAllByRole('article')).toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(screen.getAllByRole('article')).toHaveLength(20);
  });

  it('treats whitespace as an empty query', () => {
    renderOverview();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '   ' } });
    expect(screen.getAllByRole('article')).toHaveLength(20);
    expect(screen.getByRole('navigation', { name: 'Product ranges' })).toBeInTheDocument();
  });

  it('preserves lower sections and model-specific documentation during this paired preview', () => {
    renderOverview();
    expect(screen.getByRole('region', { name: 'Built for brands and OEM programs.' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Specified for real projects.' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Verified manufacturing and compliance.' })).toBeInTheDocument();
    expect(screen.getByText(/Certification coverage varies by model/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View certification details' })).toHaveAttribute('href', '/resources/#certifications');
  });
});
