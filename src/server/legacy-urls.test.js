// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { onRequest } from '../../functions/_middleware.js';
import { legacyRedirects } from './legacy-urls.js';
import { PUBLIC_ROUTES } from '../../scripts/prepare-pages.mjs';
import { catalogProducts } from '../data/catalogProducts.js';

const invoke = (path, method = 'GET') => {
  const next = vi.fn(() => new Response('pass', { status: 202 }));
  return { response: onRequest({ request: new Request(`https://fahint.com${path}`, { method }), next }), next };
};

describe('production legacy URL cleanup', () => {
  it('redirects every verified legacy model to a published canonical page, including encoded query keys', () => {
    const publicPaths = new Set(PUBLIC_ROUTES.map(path => `/${path}/`));
    const records = JSON.parse(readFileSync('src/data/catalog/legacy-products.json', 'utf8'));
    const published = records.filter(record => record.model !== 'FLB20');
    expect(published).toHaveLength(94);
    for (const record of published) {
      const key = new URL(record.sourceUrl).search.slice(1);
      const target = legacyRedirects.get(key);
      expect(publicPaths.has(target), record.model).toBe(true);
      const product = catalogProducts.find(product => product.sourceUrl === record.sourceUrl);
      expect(target).toBe(product ? `/products/${product.line}/${product.slug}/` : `/products/gfci/${record.model.toLowerCase()}/`);
      for (const query of [key, `${encodeURIComponent(key)}=`]) {
        const { response, next } = invoke(`/?${query}&utm_source=legacy`);
        expect(response.status, query).toBe(301);
        expect(response.headers.get('Location')).toBe(`https://fahint.com${target}`);
        expect(next).not.toHaveBeenCalled();
      }
    }
    for (const target of legacyRedirects.values()) expect(publicPaths.has(target), target).toBe(true);
  });

  it('keeps category and company migrations useful', () => {
    for (const [query, target] of [['Brochures', '/resources/'], ['company/', '/about/'], ['message/', '/contact/'], ['list_49/', '/products/wallplates/']]) {
      expect(invoke(`/?${query}`).response.headers.get('Location')).toBe(`https://fahint.com${target}`);
    }
  });

  it('permanently removes obsolete CMS endpoints and queries without an equivalent page', async () => {
    for (const path of ['/static/index.php?12345.html', '/yineng/index.php/12345', '/api.php/content/addcart/id/', '/core/code.php', '/?list_2/195.html', '/?pro1/242.html', '/?list_20%2F254.html=', '/?p=/Do/area&lg=cn']) {
      for (const method of ['GET', 'HEAD']) {
        const { response, next } = invoke(path, method);
        expect(response.status, path).toBe(410);
        expect(response.headers.get('X-Robots-Tag')).toBe('noindex');
        expect(response.headers.has('Location')).toBe(false);
        expect(await response.text()).toEqual(method === 'HEAD' ? '' : expect.stringContaining('This page has been removed.'));
        expect(next).not.toHaveBeenCalled();
      }
    }
  });

  it('preserves current pages, tracking parameters, inquiry context and all non-read requests', () => {
    for (const [path, method] of [
      ['/', 'GET'], ['/?utm_source=google&gclid=example', 'GET'], ['/?constructor=', 'GET'],
      ['/contact/?model=GF15&topic=oem', 'GET'], ['/products/gfci/gf15/', 'GET'],
      ['/static/catalogue.pdf', 'GET'], ['/static/index.php.png', 'GET'], ['/api.php.json', 'GET'],
      ['/api/inquiry', 'POST'], ['/api/inquiry/', 'OPTIONS'], ['/?pro1/151.html', 'POST'],
    ]) {
      const { response, next } = invoke(path, method);
      expect(response.status, `${method} ${path}`).toBe(202);
      expect(next).toHaveBeenCalledOnce();
    }
  });

  it('invokes the middleware only for legacy URL families, the homepage and the existing inquiry endpoint', () => {
    const routes = JSON.parse(readFileSync('public/_routes.json', 'utf8'));
    const matches = path => routes.include.some(pattern => new RegExp(`^${pattern.split('*').map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*')}$`).test(path));
    expect(routes.version).toBe(1);
    expect(routes.exclude).toEqual([]);
    for (const path of ['/', '/static/index.php', '/yineng/index.php', '/api.php/content/addcart/id/', '/core/code.php', '/api/inquiry', '/api/inquiry/']) expect(matches(path), path).toBe(true);
    for (const path of ['/assets/app.js', '/static/logo.png', '/sitemap.xml', '/products/gfci/', '/contact/']) expect(matches(path), path).toBe(false);
  });
});
