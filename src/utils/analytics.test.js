import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initializeAnalytics, trackEvent } from './analytics.js';

let storage;
beforeEach(() => {
  storage = new Map();
  vi.stubGlobal('window', {
    location: new URL('https://fahint.com/'),
    sessionStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: key => storage.delete(key),
    },
  });
  vi.stubGlobal('document', document.implementation.createHTMLDocument('FAHINT'));
  document.addEventListener('click', event => event.preventDefault());
});

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

function events(name) {
  return (window.dataLayer || []).map(args => Array.from(args)).filter(args => args[0] === 'event' && (!name || args[1] === name));
}

function click(href, attributes = {}, options = {}) {
  const link = document.createElement('a');
  link.setAttribute('href', href);
  Object.entries(attributes).forEach(([key, value]) => link.setAttribute(key, value));
  link.innerHTML = '<span>Request a quote</span>';
  document.body.appendChild(link);
  link.firstChild.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, ...options }));
  return link;
}

const gfciQuote = {
  quote_page: '/products/gfci/', quote_type: 'category', quote_location: 'category_guide',
  quote_family: 'gfci', quote_model: 'none',
};

describe('production GA4', () => {
  it.each(['http://127.0.0.1:5181/', 'http://localhost:5180/', 'https://preview.fahint.pages.dev/', 'https://fahint2015.github.io/'])('does not track a preview at %s', url => {
    window.location = new URL(url);
    initializeAnalytics();
    trackEvent('generate_lead');
    click('/contact?topic=products', { 'data-quote-location': 'home_hero' });
    expect(document.scripts).toHaveLength(0);
    expect(window.dataLayer).toBeUndefined();
    expect(storage.size).toBe(0);
  });

  it.each(['https://fahint.com/', 'https://www.fahint.com/'])('initializes once at %s and leaves page views to enhanced measurement', url => {
    window.location = new URL(url);
    initializeAnalytics();
    initializeAnalytics();
    expect(document.scripts).toHaveLength(1);
    expect(document.scripts[0].src).toBe('https://www.googletagmanager.com/gtag/js?id=G-N7PBW2XWRV');
    expect(document.scripts[0].async).toBe(true);
    expect(window.dataLayer.map(args => Array.from(args))).toEqual([
      ['js', expect.any(Date)],
      ['config', 'G-N7PBW2XWRV', { allow_google_signals: false, allow_ad_personalization_signals: false }]
    ]);
  });

  it('records contact methods without copying link queries or inquiry details', () => {
    initializeAnalytics();
    document.body.innerHTML = '<a href="mailto:louis@fahint.com?body=private-inquiry"><span>Email</span></a><a href="https://wa.me/8618857349189?text=private-inquiry"><span>WhatsApp</span></a><a href="https://example.com/"><span>Other</span></a>';
    for (const target of document.querySelectorAll('span')) {
      target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    }
    trackEvent('generate_lead');
    const events = window.dataLayer.slice(2).map(args => Array.from(args));
    expect(events.map(args => args[1])).toEqual(['contact_email', 'contact_whatsapp', 'generate_lead']);
    for (const [, , params] of events) {
      expect(params).toMatchObject({ transport_type: 'beacon', page_location: 'https://fahint.com/' });
    }
    expect(JSON.stringify(events)).not.toContain('private-inquiry');
  });

  it('does not let a missing or broken tracker break the user action', () => {
    expect(() => trackEvent('generate_lead')).not.toThrow();
    window.gtag = () => { throw new Error('Tracker unavailable'); };
    expect(() => trackEvent('generate_lead')).not.toThrow();
  });
});

describe('quote attribution', () => {
  it('captures the category before router navigation, then carries it to one successful lead', () => {
    window.location = new URL('https://fahint.com/products/gfci/?private=secret#buying-guide');
    initializeAnalytics();
    initializeAnalytics();
    document.addEventListener('click', () => { window.location = new URL('https://fahint.com/contact/?topic=products&message=secret'); });
    click('/contact/?topic=products&message=secret', { 'data-quote-location': 'category_guide', 'data-quote-family': 'gfci' });
    expect(events('quote_click')).toEqual([['event', 'quote_click', {
      transport_type: 'beacon', page_location: 'https://fahint.com/products/gfci/', ...gfciQuote,
    }]]);
    expect(storage.size).toBe(1);
    trackEvent('generate_lead');
    expect(events('generate_lead')[0][2]).toEqual({
      transport_type: 'beacon', page_location: 'https://fahint.com/contact/', ...gfciQuote,
    });
    expect(storage.size).toBe(0);
    expect(JSON.stringify(events())).not.toContain('secret');
    trackEvent('generate_lead');
    expect(events('generate_lead')[1][2]).toMatchObject({ quote_type: 'direct', quote_location: 'inquiry_form', quote_page: '/contact/' });
  });

  it.each([
    ['/', '/contact/', 'home_hero', 'all', 'none', 'home'],
    ['/products/gfci/gf15/', '/contact/?topic=products&model=GF15', 'model_hero', 'gfci', 'GF15', 'product'],
    ['/products/usb-outlets/', '/contact/?topic=products&items=private-quantities', 'comparison_batch', 'usb-outlets', 'FTR15QC-DC20W|FTR15QC-DC65W', 'category'],
    ['/products/receptacles/', '/contact/?topic=products', 'comparison_model', 'receptacles', 'R15', 'category'],
    ['/blog/what-is-blank-face-gfci/', '/contact/?topic=products', 'article_body', 'gfci', 'none', 'article'],
    ['/applications/workplace/', '/contact/?topic=products', 'application_quote', 'all', 'none', 'application'],
  ])('records public source fields for %s', (path, href, position, family, model, type) => {
    window.location = new URL(path, 'https://fahint.com');
    initializeAnalytics();
    click(href, { 'data-quote-location': position, 'data-quote-family': family, 'data-quote-model': model });
    expect(events('quote_click')[0]?.[2]).toMatchObject({
      quote_page: path, quote_type: type, quote_location: position, quote_family: family, quote_model: model,
    });
    expect(JSON.stringify(events())).not.toContain('private-quantities');
  });

  it('tracks an inline product inquiry without waiting for form submission', () => {
    window.location = new URL('https://fahint.com/products/gfci/gf15/');
    initializeAnalytics();
    click('#inquiry', { 'data-quote-location': 'model_hero', 'data-quote-model': 'GF15' });
    expect(events('quote_click')).toHaveLength(1);
    expect(events('generate_lead')).toHaveLength(0);
  });

  it('uses the last quote and does not clear it on an email or WhatsApp click', () => {
    window.location = new URL('https://fahint.com/products/gfci/');
    initializeAnalytics();
    click('/contact?topic=products', { 'data-quote-location': 'category_guide' });
    window.location = new URL('https://fahint.com/products/receptacles/r20/');
    click('/contact?topic=products', { 'data-quote-location': 'model_hero', 'data-quote-model': 'R20' });
    window.location = new URL('https://fahint.com/contact/?model=R20&email=private-email');
    click('mailto:louis@fahint.com?body=private-message');
    click('https://wa.me/8618857349189?text=private-message');
    expect(storage.size).toBe(1);
    trackEvent('generate_lead');
    for (const [, , params] of events().slice(-3)) {
      expect(params).toMatchObject({ quote_page: '/products/receptacles/r20/', quote_model: 'R20', quote_family: 'receptacles' });
    }
    expect(storage.size).toBe(0);
    expect(JSON.stringify(events())).not.toMatch(/private-email|private-message/);
  });

  it('expires attribution after thirty minutes', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    initializeAnalytics();
    click('/contact', { 'data-quote-location': 'home_hero' });
    vi.setSystemTime(Date.now() + 30 * 60 * 1000);
    window.location = new URL('https://fahint.com/contact/');
    trackEvent('generate_lead');
    expect(events('generate_lead')[0][2]).toMatchObject({ quote_page: '/contact/', quote_type: 'direct' });
    expect(storage.size).toBe(0);
  });

  it.each([{ target: '_blank' }, { ctrlKey: true }, { metaKey: true }, { shiftKey: true }])('counts a new-tab click without saving attribution: %j', option => {
    initializeAnalytics();
    click('/contact', { 'data-quote-location': 'home_hero', ...(option.target ? { target: option.target } : {}) }, option);
    expect(events('quote_click')).toHaveLength(1);
    expect(storage.size).toBe(0);
  });

  it('ignores generic contact, technical questions, external, disabled and non-primary links', () => {
    initializeAnalytics();
    click('/contact');
    click('/contact?topic=technical', { class: 'quote-button', 'data-quote-location': 'category_guide' });
    click('https://example.com/contact?topic=products');
    click('/contact?topic=products', { 'aria-disabled': 'true' });
    click('/contact?topic=products', {}, { button: 1 });
    const link = document.createElement('a');
    link.href = '/contact?topic=products';
    document.body.appendChild(link);
    const cancelled = new MouseEvent('click', { bubbles: true, cancelable: true });
    cancelled.preventDefault();
    link.dispatchEvent(cancelled);
    expect(events()).toHaveLength(0);
    expect(storage.size).toBe(0);
  });

  it('does not replace an origin when switching topics on Contact', () => {
    window.location = new URL('https://fahint.com/products/gfci/');
    initializeAnalytics();
    click('/contact?topic=products', { 'data-quote-location': 'category_guide' });
    window.location = new URL('https://fahint.com/contact/?topic=technical');
    click('/contact/?topic=products');
    trackEvent('generate_lead');
    expect(events('quote_click')).toHaveLength(1);
    expect(events('generate_lead')[0][2]).toMatchObject(gfciQuote);
  });

  it('filters unknown metadata and never reads private inquiry queries or text', () => {
    window.location = new URL('https://fahint.com/products/gfci/?email=buyer@example.com');
    initializeAnalytics();
    click('/contact?topic=products&model=secret&quantity=123&message=private-message', {
      'data-quote-location': 'private-message', 'data-quote-family': 'secret',
      'data-quote-model': 'buyer@example.com', 'data-quote-email': 'buyer@example.com',
    });
    const payload = events('quote_click')[0][2];
    expect(payload).toMatchObject({ quote_family: 'gfci', quote_model: 'none', quote_location: 'category_page' });
    expect(Object.keys(payload).sort()).toEqual(['page_location', 'quote_family', 'quote_location', 'quote_model', 'quote_page', 'quote_type', 'transport_type']);
    expect(JSON.stringify([...events(), ...storage.values()])).not.toMatch(/secret|private-message|buyer@example.com|quantity/);
  });

  it.each(['/private/buyer@example.com/', '/products/not-a-family/', '/assets/private.pdf'])('ignores nonpublic source paths at %s', path => {
    window.location = new URL(path, 'https://fahint.com');
    initializeAnalytics();
    click('/contact?topic=products');
    expect(events()).toHaveLength(0);
  });

  it('ignores noindex pages', () => {
    window.location = new URL('https://fahint.com/products/gfci/missing/');
    document.head.innerHTML = '<meta name="robots" content="noindex, follow">';
    initializeAnalytics();
    click('/contact?topic=products');
    expect(events()).toHaveLength(0);
  });

  it('ignores malformed stored attribution', () => {
    initializeAnalytics();
    click('/contact', { 'data-quote-location': 'home_hero' });
    const key = [...storage.keys()][0];
    storage.set(key, '{bad-json');
    window.location = new URL('https://fahint.com/contact/');
    expect(() => trackEvent('generate_lead')).not.toThrow();
    expect(events('generate_lead')[0][2]).toMatchObject({ quote_type: 'direct' });
  });

  it('revalidates storage instead of spreading untrusted fields into GA', () => {
    initializeAnalytics();
    click('/contact', { 'data-quote-location': 'home_hero' });
    const key = [...storage.keys()][0];
    const saved = JSON.parse(storage.get(key));
    storage.set(key, JSON.stringify({ ...saved, quote_page: '/private/buyer@example.com/', email: 'buyer@example.com' }));
    window.location = new URL('https://fahint.com/contact/');
    trackEvent('generate_lead');
    expect(JSON.stringify(events('generate_lead'))).not.toContain('buyer@example.com');
    expect(events('generate_lead')[0][2]).toMatchObject({ quote_type: 'direct' });
  });

  it('keeps working when session storage is unavailable', () => {
    Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('Storage denied'); } });
    initializeAnalytics();
    expect(() => click('/contact', { 'data-quote-location': 'home_hero' })).not.toThrow();
    expect(() => trackEvent('generate_lead')).not.toThrow();
    expect(events('quote_click')).toHaveLength(1);
    expect(events('generate_lead')).toHaveLength(1);
  });

  it('does not let a broken existing gtag prevent initialization or quote navigation', () => {
    window.gtag = () => { throw new Error('Tracker unavailable'); };
    expect(() => initializeAnalytics()).not.toThrow();
    expect(() => click('/contact', { 'data-quote-location': 'home_hero' })).not.toThrow();
  });
});
