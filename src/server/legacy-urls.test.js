// @vitest-environment node
import { existsSync, readFileSync } from 'node:fs';
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

  it('recovers archived category and inquiry-list entrances, including HEAD and encoded queries', () => {
    const recovered = [
      ['list_17/', '/products/usb-outlets/f4p/'],
      ['pro2/', '/products/gfci/'],
      ['list_50/', '/products/wallplates/bs1802/'],
      ['list_16/', '/products/usb-outlets/'],
      ['pro7/', '/products/wallplates/'],
      ['list_29/', '/products/smart-switches/'],
      ['pro6/', '/products/smart-switches/'],
      ['list_47/', '/products/smart-switches/'],
      ['list_39/', '/products/smart-switches/'],
      ['list_14/', '/products/usb-outlets/'],
      ['list_35/', '/products/smart-switches/'],
      ['list_21/', '/products/receptacles/'],
      ['list_25/', '/products/dimmers/'],
      ['about_57/', '/contact/'],
    ];
    for (const [key, target] of recovered) {
      for (const query of [key, `${encodeURIComponent(key)}=`]) {
        for (const method of ['GET', 'HEAD']) {
          const { response, next } = invoke(`/?${query}&utm_source=legacy`, method);
          expect(response.status, `${method} ${query}`).toBe(301);
          expect(response.headers.get('Location')).toBe(`https://fahint.com${target}`);
          expect(next).not.toHaveBeenCalled();
        }
      }
    }
  });

  it('ships exact static migrations to real pages without overriding Functions or present-day routes', () => {
    const rules = (existsSync('public/_redirects') ? readFileSync('public/_redirects', 'utf8') : '')
      .split(/\r?\n/).map(line => line.trim()).filter(line => line && !line.startsWith('#'))
      .map(line => line.split(/\s+/));
    expect(rules).toHaveLength(58);
    const sources = new Set(rules.map(([source]) => source));
    const destinations = new Set(PUBLIC_ROUTES.map(path => `/${path}/`));
    const functionRoutes = JSON.parse(readFileSync('public/_routes.json', 'utf8')).include;
    expect(sources.size).toBe(rules.length);
    for (const [source, target, status] of rules) {
      expect(source).toMatch(/^\/[a-z0-9-]+\/?$/);
      expect(destinations.has(target), target).toBe(true);
      expect(status).toBe('301');
      expect(sources.has(target), target).toBe(false);
      expect(functionRoutes.some(pattern => pattern.endsWith('*') ? source.startsWith(pattern.slice(0, -1)) : source === pattern)).toBe(false);
      expect(sources.has(source.endsWith('/') ? source.slice(0, -1) : `${source}/`)).toBe(true);
    }
    const redirects = new Map(rules.map(([source, target]) => [source, target]));
    expect(redirects.get('/ds15-3-ul-listed-15a-decorator-rocker-lighting-switch-product/')).toBe('/products/lighting-switches/ds15-3/');
    expect(redirects.get('/pricelist-for-15-amp-duplex-receptacle-cw20-standard-size-us-duplex-outlet-receptacle-20amp-125v-trweather-resistant-fahint-product/')).toBe('/products/receptacles/rw20-c/');
    for (const path of ['/gfci-outlet-with-usb/', '/usb-night-light-outlet/', '/chrome-light-switch/', '/contact/', '/products/']) expect(redirects.has(path), path).toBe(false);
  });

  it('permanently removes obsolete CMS endpoints and queries without an equivalent page', async () => {
    for (const path of ['/static/index.php?12345.html', '/yineng/index.php/12345', '/api.php/content/addcart/id/', '/core/code.php', '/?list_2/195.html', '/?pro1/242.html', '/?list_20%2F254.html=', '/?list_32/', '/?list_30/', '/?list_24/', '/?p=/Do/area&lg=cn']) {
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
