const MEASUREMENT_ID = 'G-N7PBW2XWRV';

function isProductionSite() {
  return typeof window !== 'undefined'
    && ['https://fahint.com', 'https://www.fahint.com'].includes(window.location.origin);
}

export function trackEvent(name) {
  if (!isProductionSite() || typeof window.gtag !== 'function') return;
  try {
    // Only event names are sent; never include inquiry fields or contact URL queries.
    window.gtag('event', name, { transport_type: 'beacon' });
  } catch {
    // An unavailable analytics service must never interrupt an inquiry or a link.
  }
}

export function initializeAnalytics() {
  if (!isProductionSite() || document.getElementById('fahint-ga4')) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  // Enhanced measurement handles React Router history changes and file downloads.
  // Do not add a second manual page_view handler alongside it.
  window.gtag('config', MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });

  const script = document.createElement('script');
  script.id = 'fahint-ga4';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  document.addEventListener('click', event => {
    const link = event.target?.closest?.('a[href]');
    if (!link) return;
    if (link.protocol === 'mailto:') trackEvent('contact_email');
    else if (['wa.me', 'api.whatsapp.com', 'web.whatsapp.com'].includes(link.hostname)) {
      trackEvent('contact_whatsapp');
    }
  });
}
