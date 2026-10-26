// Canonicalize page paths only; downloads, APIs and edge-managed paths are not pages.
export function pageHref(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return value;
  const [, path, suffix = ''] = value.match(/^([^?#]*)(.*)$/);
  if (/^\/(?:assets|api|ai|cdn-cgi|\.well-known)(?:\/|$)/.test(path)
    || /\.(?:pdf|xml|txt|json|html?|ico|svg|webp|png|jpe?g|gif|avif|mp4|webm|zip|css|js)$/i.test(path)) return value;
  return `${path.replace(/\/+$/, '')}/${suffix}`;
}
