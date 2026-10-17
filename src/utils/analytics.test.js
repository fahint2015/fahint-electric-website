import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initializeAnalytics, trackEvent } from './analytics.js';

beforeEach(() => {
  vi.stubGlobal('window', { location: new URL('https://fahint.com/') });
  vi.stubGlobal('document', document.implementation.createHTMLDocument('FAHINT'));
  document.addEventListener('click', event => event.preventDefault());
});

afterEach(() => vi.unstubAllGlobals());

describe('production GA4', () => {
  it.each(['http://127.0.0.1:5181/', 'http://localhost:5180/', 'https://preview.fahint.pages.dev/', 'https://fahint2015.github.io/'])('does not track a preview at %s', url => {
    window.location = new URL(url);
    initializeAnalytics();
    trackEvent('generate_lead');
    expect(document.scripts).toHaveLength(0);
    expect(window.dataLayer).toBeUndefined();
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
    expect(events).toEqual(['contact_email', 'contact_whatsapp', 'generate_lead'].map(name => ['event', name, { transport_type: 'beacon' }]));
    expect(JSON.stringify(events)).not.toContain('private-inquiry');
  });

  it('does not let a missing or broken tracker break the user action', () => {
    expect(() => trackEvent('generate_lead')).not.toThrow();
    window.gtag = () => { throw new Error('Tracker unavailable'); };
    expect(() => trackEvent('generate_lead')).not.toThrow();
  });
});
