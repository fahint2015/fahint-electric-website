import { escapeHtml, validateSiteUrl, pageModifiedDate } from '../src/seo/metadata.js';

export function renderSitemap(metadata, base = 'https://fahint.com/') {
  const site = validateSiteUrl(base);
  const rows = [...metadata].filter(([, meta]) => !meta.noindex).map(([path, meta]) => {
    const url = new URL(path === '/' ? '' : `${path.replace(/^\/+|\/+$/g, '')}/`, site).href;
    const date = pageModifiedDate(meta);
    if (date && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date)) {
      throw new Error(`Invalid content update date for ${path}: ${date}`);
    }
    return `  <url><loc>${escapeHtml(url)}</loc>${date ? `<lastmod>${date}</lastmod>` : ''}</url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join('\n')}\n</urlset>\n`;
}
