const MEASUREMENT_ID = 'G-N7PBW2XWRV';
const QUOTE_STORAGE_KEY = 'fahint-quote-source';
const QUOTE_TTL = 30 * 60 * 1000;
const FAMILIES = new Set(['gfci', 'usb-outlets', 'receptacles', 'dimmers', 'smart-switches', 'lighting-switches', 'wallplates']);
const STATIC_PAGES = new Set(['/', '/products/', '/blog/', '/applications/', '/capabilities/', '/about/', '/contact/', '/resources/']);
const LOCATIONS = new Set(['home_hero', 'home_quote', 'category_guide', 'category_page', 'model_hero', 'product_page', 'comparison_model', 'comparison_batch', 'article_body', 'article_quote', 'application_quote', 'page_quote', 'inquiry_form', 'contact_method']);

function isProductionSite() {
  return typeof window !== 'undefined'
    && ['https://fahint.com', 'https://www.fahint.com'].includes(window.location.origin);
}

function publicPage(pathname) {
  const path = `${pathname.replace(/\/+$/, '')}/`;
  if (STATIC_PAGES.has(path)) return path;
  const parts = path.split('/').filter(Boolean);
  if (parts[0] === 'products' && FAMILIES.has(parts[1])
    && (parts.length === 2 || (parts.length === 3 && /^[a-z0-9-]{1,60}$/.test(parts[2])))) return path;
  if (parts[0] === 'blog' && parts.length === 2 && /^[a-z0-9-]{1,100}$/.test(parts[1])) return path;
  if (parts[0] === 'applications' && parts.length === 2 && ['residential', 'workplace', 'hospitality'].includes(parts[1])) return path;
  return null;
}

function pageType(page) {
  if (page === '/') return 'home';
  if (page === '/contact/') return 'direct';
  if (page.startsWith('/products/') && page !== '/products/') return page.split('/').filter(Boolean).length === 3 ? 'product' : 'category';
  if (page.startsWith('/blog/') && page !== '/blog/') return 'article';
  if (page.startsWith('/applications/')) return 'application';
  return 'other';
}

function publicModels(value) {
  if (typeof value !== 'string' || value.length > 92) return 'none';
  const models = value.split('|');
  return models.length <= 3 && models.every(model => /^(?=[A-Z0-9.-]*\d)[A-Z0-9][A-Z0-9.-]{0,29}$/.test(model)) ? models.join('|') : 'none';
}

// Construct only these five public fields; never spread URL queries, form values or storage.
function quoteContext(page, data = {}, fallbackLocation = 'inquiry_form') {
  const family = page.split('/')[2];
  return {
    quote_page: page,
    quote_type: pageType(page),
    quote_location: LOCATIONS.has(data.quoteLocation) ? data.quoteLocation : fallbackLocation,
    quote_family: FAMILIES.has(data.quoteFamily) ? data.quoteFamily : FAMILIES.has(family) ? family : 'all',
    quote_model: publicModels(data.quoteModel),
  };
}

function currentPage() {
  if (/\bnoindex\b/i.test(document.querySelector('meta[name="robots"]')?.content || '')) return null;
  return publicPage(window.location.pathname);
}

function clearQuoteSource() {
  try { window.sessionStorage.removeItem(QUOTE_STORAGE_KEY); } catch { /* Storage can be denied. */ }
}

function readQuoteSource() {
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(QUOTE_STORAGE_KEY));
    const age = Date.now() - saved?.at;
    const page = typeof saved?.quote_page === 'string' ? publicPage(saved.quote_page) : null;
    if (!page || typeof saved.at !== 'number' || age < 0 || age >= QUOTE_TTL) {
      clearQuoteSource();
      return null;
    }
    return quoteContext(page, { quoteLocation: saved.quote_location, quoteFamily: saved.quote_family, quoteModel: saved.quote_model });
  } catch {
    clearQuoteSource();
    return null;
  }
}

function sendEvent(name, context) {
  const page = currentPage();
  if (!page || typeof window.gtag !== 'function') return;
  try {
    window.gtag('event', name, {
      transport_type: 'beacon',
      page_location: `${window.location.origin}${page}`,
      ...context,
    });
  } catch {
    // An unavailable analytics service must never interrupt an inquiry or a link.
  }
}

export function trackEvent(name) {
  if (!isProductionSite()) return;
  const page = currentPage();
  if (!page) return;
  const attributed = ['generate_lead', 'contact_email', 'contact_whatsapp'].includes(name);
  const model = pageType(page) === 'product' ? document.querySelector('[data-quote-location="model_hero"]')?.dataset : undefined;
  const context = attributed ? readQuoteSource() || quoteContext(page, model, name === 'generate_lead' ? 'inquiry_form' : 'contact_method') : undefined;
  // This function is called for a lead only after the existing successful server receipt.
  if (name === 'generate_lead') clearQuoteSource();
  sendEvent(name, context);
}

function handleClick(event) {
  if (event.defaultPrevented || event.button !== 0) return;
  const link = event.target?.closest?.('a[href]');
  if (!link || link.hasAttribute('download') || link.getAttribute('aria-disabled') === 'true' || link.closest('[inert]')) return;
  let url;
  try { url = new URL(link.getAttribute('href'), window.location.href); } catch { return; }
  if (url.protocol === 'mailto:') { trackEvent('contact_email'); return; }
  if (['wa.me', 'api.whatsapp.com', 'web.whatsapp.com'].includes(url.hostname)) { trackEvent('contact_whatsapp'); return; }

  const page = currentPage();
  if (!page || page === '/contact/' || url.origin !== window.location.origin) return;
  const topic = url.searchParams.get('topic');
  const contactQuote = publicPage(url.pathname) === '/contact/'
    && (topic === 'products' || (!topic && link.hasAttribute('data-quote-location')));
  const inlineQuote = url.pathname === window.location.pathname && url.hash === '#inquiry' && link.hasAttribute('data-quote-location');
  if (!contactQuote && !inlineQuote) return;

  const fallback = { home: 'home_quote', category: 'category_page', product: 'product_page', article: 'article_quote', application: 'application_quote' }[pageType(page)] || 'page_quote';
  const context = quoteContext(page, link.dataset, fallback);
  sendEvent('quote_click', context);
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || (link.target && link.target !== '_self')) return;
  try { window.sessionStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify({ ...context, at: Date.now() })); } catch { /* Navigation must still work. */ }
}

export function initializeAnalytics() {
  if (!isProductionSite() || document.getElementById('fahint-ga4')) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  try {
    window.gtag('js', new Date());
    // Enhanced measurement handles history changes and downloads; no extra page_view.
    window.gtag('config', MEASUREMENT_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
  } catch { /* Analytics must not block page initialization. */ }

  const script = document.createElement('script');
  script.id = 'fahint-ga4';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Capture the origin before React Router changes the current URL while bubbling.
  document.addEventListener('click', handleClick, true);
}
