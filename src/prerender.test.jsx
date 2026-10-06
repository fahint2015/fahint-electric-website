// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { renderPage } from './entry-server.jsx';
import { canHydratePage } from './utils/prerender.js';
import { PUBLIC_ROUTES } from '../scripts/prepare-pages.mjs';

describe('published page prerendering', () => {
  it('prerenders the light switch guide with base-safe model and purchasing links', async () => {
    expect(PUBLIC_ROUTES).toContain('blog/light-switch-buying-guide');
    const html = await renderPage('/blog/light-switch-buying-guide', '/fahint-electric-website/');
    expect(html).toContain('FAHINT lighting switch model comparison');
    expect(html).toContain('<table>');
    expect(html).toContain('15A, 120/277V AC');
    expect(html).toContain('15A, 125V AC');
    expect(html).toContain('Light switch quotation checklist');
    for (const model of ['ds15', 'ds15-3', 'ds1502', 'ds1503', 't15', 't15-3']) {
      expect(html).toContain(`href="/fahint-electric-website/products/lighting-switches/${model}"`);
    }
    expect(html).toContain('href="/fahint-electric-website/resources?family=lighting-switches"');
    expect(html).toContain('href="/fahint-electric-website/blog/dimmer-buying-guide-led-0-10v"');
    expect(html).toContain('href="/fahint-electric-website/blog/wallplate-buying-guide"');
    expect(html).not.toContain('Loading page…');
  });

  it('prerenders the wallplate guide with base-safe model, finish and document links', async () => {
    expect(PUBLIC_ROUTES).toContain('blog/wallplate-buying-guide');
    const html = await renderPage('/blog/wallplate-buying-guide', '/fahint-electric-website/');
    expect(html).toContain('FAHINT wallplate configuration comparison');
    expect(html).toContain('<table>');
    expect(html).toContain('79.5 × 123.9 mm');
    expect(html).toContain('Wallplate quotation checklist');
    for (const model of ['bs1801', 'bs1802', 'bs1804', 'bs1806', 'bs1807', 'bs18012', 'bs1803-g', 'bs1803-m']) {
      expect(html).toContain(`href="/fahint-electric-website/products/wallplates/${model}"`);
    }
    expect(html).toContain('href="/fahint-electric-website/resources?family=wallplates"');
    expect(html).toContain('href="/fahint-electric-website/blog/gfci-colour-finishes-specification"');
    expect(html).not.toContain('Loading page…');
  });

  it('prerenders the dimmer guide with base-safe model and document links', async () => {
    const html = await renderPage('/blog/dimmer-buying-guide-led-0-10v', '/fahint-electric-website/');
    expect(html).toContain('FAHINT dimmer model comparison');
    expect(html).toContain('<table>');
    expect(html).toContain('600VA');
    expect(html).toContain('Dimmer quotation checklist');
    expect(html).toContain('href="/fahint-electric-website/products/dimmers/dm2010"');
    expect(html).toContain('href="/fahint-electric-website/products/dimmers/dm2010s"');
    expect(html).toContain('href="/fahint-electric-website/resources?family=dimmers"');
    expect(html).not.toContain('Loading page…');
  });

  it('prerenders the USB guide and preserves base-safe model and filter links', async () => {
    const html = await renderPage('/blog/usb-wall-outlet-buying-guide', '/fahint-electric-website/');
    expect(html).toContain('FAHINT USB outlet shortlist');
    expect(html).toContain('<table>');
    expect(html).toContain('FTR15QC-DC65W');
    expect(html).toContain('href="/fahint-electric-website/products/usb-outlets?ports=a-c"');
    expect(html).toContain('href="/fahint-electric-website/products/usb-outlets/f4p"');
    expect(html).toContain('USB outlet quotation checklist');
    expect(html).not.toContain('Loading page…');
  });

  it('waits for the actual lazy homepage, including product and company links', async () => {
    const html = await renderPage('/');
    expect(html).toContain('Wiring devices.');
    expect(html).toContain('Built for your market.');
    expect(html).toContain('Wenzhou Fahint Electric');
    expect(html).toContain('href="/products/usb-outlets"');
    expect(html).not.toContain('Loading page…');
    expect(html).not.toContain('data-motion="ready"');
    expect(html).toContain('class="studio-hero"');
  });

  it.each([
    ['/products', 'connection.'],
    ['/products/gfci', 'GF15'],
    ['/products/usb-outlets', 'FTR15-3100'],
    ['/products/dimmers', 'DM2010'],
    ['/products/receptacles', 'CR15'],
    ['/products/smart-switches', 'USW8811'],
    ['/products/lighting-switches', 'DS15'],
    ['/products/wallplates', 'Wallplates'],
    ['/products/gfci/gf15', 'NEMA 5-15R'],
    ['/products/usb-outlets/ftr15-3100', '3.1A'],
    ['/resources', 'Product resources.'],
  ])('puts %s content in HTML without any browser globals', async (path, content) => {
    const html = await renderPage(path);
    expect(typeof window).toBe('undefined');
    expect(html).toMatch(/<main\b/);
    expect(html).toMatch(/<h1\b/);
    expect(html.includes(content), `${path} includes ${content}`).toBe(true);
    expect(html).not.toContain('Loading page…');
    expect(html).not.toContain('<!--$!-->');
  });

  it('keeps the deployment subpath on navigation, model and inquiry links', async () => {
    const html = await renderPage('/products/gfci/gf15', '/fahint-electric-website/');
    expect(html).toContain('href="/fahint-electric-website/products/gfci"');
    expect(html).toContain('href="/fahint-electric-website/products/gfci/gf20"');
    expect(html).toContain('href="/fahint-electric-website/contact?');
    expect(html).not.toContain('href="/products');
  });

  it('keeps identical markup when static hosting adds a trailing slash', async () => {
    const canonical = await renderPage('/products/gfci/gf15');
    const directory = await renderPage('/products/gfci/gf15/');
    expect(directory === canonical).toBe(true);
  });

  it('renders every published route with one real page heading', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      for (const route of PUBLIC_ROUTES) {
        const html = await renderPage(`/${route}`);
        expect(html.match(/<h1(?:\s|>)/g), route).toHaveLength(1);
        expect(html.includes('Loading page…'), route).toBe(false);
        expect(html.includes('This page isn’t here.'), route).toBe(false);
        expect(errors.mock.calls.map(([message]) => message), route).toEqual([]);
      }
    } finally { errors.mockRestore(); }
    expect(PUBLIC_ROUTES).not.toContain('home-studio');
    expect(PUBLIC_ROUTES).not.toContain('products/gfci/flb20');
  }, 20000);

  it('renders a real not-found body instead of reusing the homepage', async () => {
    const html = await renderPage('/404');
    expect(html).toContain('This page isn’t here.');
    expect(html).toContain('Browse products');
    expect(html).not.toContain('Wiring devices.');
  });

  it('disables inquiry submission until JavaScript takes over, avoiding a native GET with customer details', async () => {
    const html = await renderPage('/contact');
    expect(/<button(?=[^>]*type="submit")(?=[^>]*disabled="")[^>]*>/.test(html)).toBe(true);
    expect(html).toContain('Enable JavaScript to use this form');
    expect(html).toContain('href="mailto:louis@fahint.com"');
  });

  it('renders USB drawing titles without React text-node warnings', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const html = await renderPage('/products/usb-outlets/ftr15-3100');
      expect(errors.mock.calls.map(([message]) => message)).toEqual([]);
      expect(html).toMatch(/<title[^>]*>FTR15-3100 front[^<]*dimension drawing<\/title>/);
    } finally { errors.mockRestore(); }
  });
});

describe('client takeover of static HTML', () => {
  const root = { dataset: { prerenderPath: '/catalog/products/gfci' }, hasChildNodes: () => true };
  it('hydrates only a matching static path without URL selection state', () => {
    expect(canHydratePage(root, { pathname: '/catalog/products/gfci', search: '' })).toBe(true);
    expect(canHydratePage(root, { pathname: '/catalog/products/gfci', search: '?compare=GF15' })).toBe(false);
    expect(canHydratePage(root, { pathname: '/catalog/products/gfci/', search: '' })).toBe(true);
    expect(canHydratePage(root, { pathname: '/catalog/unknown', search: '' })).toBe(false);
    expect(canHydratePage({ dataset: {}, hasChildNodes: () => false }, { pathname: '/', search: '' })).toBe(false);
  });
});
