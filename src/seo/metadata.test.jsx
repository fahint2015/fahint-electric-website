import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import GfciSeries from '../pages/GfciSeries.jsx';
import LineDetail from '../pages/LineDetail.jsx';
import ProductDetail from '../pages/ProductDetail.jsx';
import BlogPost from '../pages/BlogPost.jsx';
import HomeStudio from '../pages/HomeStudio.jsx';
import NotFound from '../pages/NotFound.jsx';
import { headEntries, renderHeadEntries, validateSiteUrl } from './metadata.js';

function openPage(path) {
  return render(<MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes>
      <Route path="/" element={<HomeStudio />} />
      <Route path="/home-studio" element={<HomeStudio />} />
      <Route path="/products/gfci" element={<GfciSeries />} />
      <Route path="/products/:line" element={<LineDetail />} />
      <Route path="/products/:line/:sku" element={<ProductDetail />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </MemoryRouter>);
}

const graph = () => JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)['@graph'];
const property = name => document.querySelector(`meta[property="${name}"]`)?.content;

afterEach(() => { cleanup(); vi.unstubAllEnvs(); document.head.innerHTML = ''; });

describe('Page search information', () => {
  it.each(['gfci', 'usb-outlets', 'receptacles', 'dimmers', 'smart-switches', 'lighting-switches', 'wallplates'])('creates complete metadata for %s without relying on existing tags', line => {
    openPage(`/products/${line}`);
    expect(document.querySelector('meta[name="description"]')?.content.length).toBeGreaterThan(60);
    expect(document.querySelector('meta[name="description"]')?.content.length).toBeLessThanOrEqual(190);
    expect(property('og:title')).toBe(document.title);
    expect(property('og:description')).toBe(document.querySelector('meta[name="description"]').content);
    expect(property('og:image')).toMatch(/^https?:\/\/.+\.(?:webp|jpg|png)$/);
    expect(document.querySelector('meta[name="twitter:image"]')?.content).toBe(property('og:image'));
    expect(graph().find(item => item['@type'] === 'BreadcrumbList').itemListElement.at(-1).name).toBeTruthy();
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  });

  it('publishes only the selected product facts without invented prices or reviews', () => {
    openPage('/products/usb-outlets/ftr15-3100');
    const product = graph().find(item => item['@type'] === 'Product');
    expect(product.sku).toBe('FTR15-3100');
    expect(product.brand.name).toBe('FAHINT');
    expect(product.image).toEqual([property('og:image')]);
    expect(JSON.stringify(product)).not.toMatch(/"offers"|"aggregateRating"|"review"|certified|certification/i);
    expect(property('og:image')).not.toContain('hero-interior');
  });

  it('uses the configured site base for canonical URLs and removes query/hash', () => {
    vi.stubEnv('VITE_SITE_URL', 'https://example.com/catalog/');
    openPage('/products/gfci/gf15?finish=black#inquiry');
    expect(document.querySelector('link[rel="canonical"]')?.href).toBe('https://example.com/catalog/products/gfci/gf15/');
    expect(property('og:url')).toBe('https://example.com/catalog/products/gfci/gf15/');
    expect(property('og:image')).toMatch(/^https:\/\/example.com\/catalog\/assets\//);
  });

  it.each(['/home-studio', '/not-real'])('keeps %s out of search without a canonical or misleading schema', path => {
    vi.stubEnv('VITE_SITE_URL', 'https://example.com/');
    openPage(path);
    expect(document.querySelector('meta[name="robots"]')?.content).toContain('noindex');
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.querySelector('script[type="application/ld+json"]')).toBeNull();
  });

  it('publishes article metadata with its real cover and no invented author', () => {
    openPage('/blog/how-to-source-ul-listed-gfci-from-china');
    const article = graph().find(item => item['@type'] === 'Article');
    expect(article.headline).toBeTruthy();
    expect(article.dateModified).toBeTruthy();
    expect(article.publisher.name).toBe('FAHINT');
    expect(article.author).toBeUndefined();
    expect(property('og:type')).toBe('article');
  });

  it('restores existing metadata and removes owned tags when leaving a page', () => {
    document.head.innerHTML = '<title>Original</title><meta name="description" content="Original description">';
    const page = openPage('/products/gfci/gf15');
    expect(property('og:image')).toBeTruthy();
    page.unmount();
    expect(document.title).toBe('Original');
    expect(document.querySelector('meta[name="description"]').content).toBe('Original description');
    expect(document.querySelector('script[type="application/ld+json"]')).toBeNull();
    expect(document.querySelector('meta[property="og:image"]')).toBeNull();
  });

  it('escapes metadata text and keeps JSON-LD from ending its script element', () => {
    const unsafeText = 'Device </script><script>alert("test")</script> & "finish"';
    const html = renderHeadEntries(headEntries({ title: unsafeText, description: unsafeText, entity: { '@type': 'Product', name: unsafeText } }));
    const parsed = new DOMParser().parseFromString(`<html><head>${html}</head></html>`, 'text/html');
    expect(parsed.querySelectorAll('script')).toHaveLength(1);
    expect(parsed.title).toBe(unsafeText);
    expect(parsed.querySelector('meta[name="description"]').content).toBe(unsafeText);
    expect(JSON.parse(parsed.querySelector('script').textContent)['@graph'][0].name).toBe(unsafeText);
  });

  it.each(['javascript:alert(1)', 'https://user:password@example.com/', 'https://example.com/?source=preview', 'https://example.com/#section'])('rejects unsafe site URL %s', url => {
    expect(() => validateSiteUrl(url)).toThrow();
  });
});
