import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import HomeStudio from './pages/HomeStudio.jsx';
import ProductsStudio from './pages/ProductsStudio.jsx';
import Header from './components/Header.jsx';

const show = (Component, path) => render(<MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Component /></MemoryRouter>);

describe('published homepage and product overview', () => {
  it('keeps the favicon square and the original wordmark proportions intact', () => {
    const parser = new DOMParser();
    const html = parser.parseFromString(readFileSync('index.html', 'utf8'), 'text/html');
    const iconPath = html.querySelector('link[rel="icon"]').getAttribute('href');
    const svg = parser.parseFromString(readFileSync(`public/${iconPath}`, 'utf8'), 'image/svg+xml').documentElement;
    expect(svg.localName).toBe('svg');
    const [, , width, height] = svg.getAttribute('viewBox').split(/\s+/).map(Number);
    expect(width).toBeGreaterThan(0);
    expect(width).toBe(height);
    expect(svg.getAttribute('width')).toBe(svg.getAttribute('height'));
    const image = svg.querySelector('image');
    const original = readFileSync('public/assets/images/brand/fahint-logo-navy.png');
    expect(Number(image.getAttribute('width')) / Number(image.getAttribute('height'))).toBeCloseTo(original.readUInt32BE(16) / original.readUInt32BE(20));
    expect(image.getAttribute('preserveAspectRatio')).toBe('xMidYMid meet');
    expect(Buffer.from(image.getAttribute('href').split(',')[1], 'base64').equals(original)).toBe(true);
  });

  it('loads company and editorial pages only with their route', () => {
    const source = readFileSync('src/App.jsx', 'utf8');
    for (const name of ['Blog', 'BlogPost', 'Capabilities', 'About']) {
      expect(source).toContain(`const ${name} = lazy(() => import('./pages/${name}.jsx'))`);
      expect(source).not.toContain(`import ${name} from`);
    }
  });

  it('serves the completed pages at the canonical entry routes', () => {
    const source = readFileSync('src/App.jsx', 'utf8');
    expect(source).toContain('path="/" element={<HomeStudio />}');
    expect(source).toContain('path="/products" element={<ProductsStudio />}');
    expect(source).not.toContain('path="/" element={<Home />}');
  });

  it('publishes a lazy-loaded resource center with its own metadata', async () => {
    const source = readFileSync('src/App.jsx', 'utf8');
    const { PUBLIC_ROUTES } = await import('../scripts/prepare-pages.mjs');
    const { routeMetadata } = await import('../scripts/page-metadata.mjs');
    expect(source).toContain("const Resources = lazy(() => import('./pages/Resources.jsx'))");
    expect(source).toContain('path="/resources" element={<Resources />}');
    expect(PUBLIC_ROUTES).toContain('resources');
    expect(routeMetadata.get('/resources')?.label).toBe('Resources');
  });

  it('makes the published homepage indexable with production metadata', () => {
    show(HomeStudio, '/');
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
    expect(document.title).toBe('FAHINT | Safer Power. Better Living.');
    expect(document.querySelector('meta[name="description"]')?.content).toContain('North American');
    expect(screen.getByRole('link', { name: 'Explore FAHINT products' })).toHaveAttribute('href', '/products');
    const nav = screen.getByRole('navigation', { name: 'Homepage sections' });
    for (const link of within(nav).getAllByRole('link')) {
      expect(link.getAttribute('href')).toMatch(/^\/#studio-/);
    }
  });

  it('makes the published catalog indexable and links back to the homepage', () => {
    show(ProductsStudio, '/products');
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
    expect(document.title).toBe('FAHINT | Product Catalog');
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
  });

  it.each(['/', '/about', '/products', '/products/usb-outlets'])('keeps navigation on published routes from %s', path => {
    show(Header, path);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /^Products/ })).toHaveAttribute('href', '/products');
    expect(screen.getByRole('link', { name: 'Send Inquiry' })).toHaveAttribute('href', path === '/' ? '/#studio-inquiry' : '/contact');
  });

  it('has current sharing copy without the former five-range claim', () => {
    const html = readFileSync('index.html', 'utf8');
    expect(html).not.toContain('Five coordinated');
    expect(html).toContain('Seven product families');
  });
});
