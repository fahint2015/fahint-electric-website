// Observe first. Do not turn this into an enforcing CSP before reviewing reports
// from GA4, Turnstile and an authorized end-to-end inquiry submission.
export const REPORT_ONLY_CSP = [
  "default-src 'self'",
  "script-src 'self' https://www.googletagmanager.com https://challenges.cloudflare.com https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://*.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self'",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://challenges.cloudflare.com https://cloudflareinsights.com",
  'frame-src https://challenges.cloudflare.com',
  "object-src 'none'", "base-uri 'self'", "form-action 'self' mailto:", "frame-ancestors 'self'",
  'report-uri /api/csp-report'
].join('; ');

const sharedHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};
const productionHosts = ['fahint.com', 'www.fahint.com'];
const hsts = 'max-age=86400'; // Start with one day; no subdomain or preload commitment.

export function withSecurityHeaders(response, request) {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(sharedHeaders)) headers.set(name, value);
  if (headers.get('Content-Type')?.includes('text/html')) headers.set('Content-Security-Policy-Report-Only', REPORT_ONLY_CSP);
  const url = new URL(request.url);
  if (url.protocol === 'https:' && productionHosts.includes(url.hostname)) headers.set('Strict-Transport-Security', hsts);
  return new Response(response.body, {status: response.status, statusText: response.statusText, headers});
}

export function renderSecurityHeaders() {
  const common = {...sharedHeaders, 'Content-Security-Policy-Report-Only': REPORT_ONLY_CSP};
  return '# Generated from src/server/security-headers.js. CSP remains report-only.\n/*\n'
    + Object.entries(common).map(([name,value])=>`  ${name}: ${value}\n`).join('')
    + productionHosts.map(host=>`https://${host}/*\n  Strict-Transport-Security: ${hsts}\n`).join('');
}
