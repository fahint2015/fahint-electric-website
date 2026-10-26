import { describe, it, expect } from 'vitest';
import { renderSitemap } from '../../scripts/sitemap.mjs';
describe('sitemap dates', () => {
  it('uses only source-backed updates, never the build date, with canonical escaped URLs', () => {
    const xml=renderSitemap(new Map([['/',{}],['/blog/a',{entity:{'@type':'Article',dateModified:'2026-10-22'}}]]),'https://example.com/catalog/');
    expect(xml).toContain('<loc>https://example.com/catalog/</loc>');
    expect(xml).toContain('<loc>https://example.com/catalog/blog/a/</loc><lastmod>2026-10-22</lastmod>');
    expect((xml.match(/<lastmod>/g)||[])).toHaveLength(1);
    expect(xml).not.toContain('undefined');
  });
  it('rejects invalid calendar dates instead of publishing fake freshness', () => {
    expect(()=>renderSitemap(new Map([['/blog/a',{entity:{dateModified:'2026-02-31'}}]]),'https://example.com/')).toThrow(/date/i);
  });
  it('includes a documented specification change, while leaving unknown dates absent', () => {
    const xml=renderSitemap(new Map([['/',{}],['/products/gfci/gf15',{updated:'2026-10-25'}],['/contact',{updated:'2026-10-26'}]]));
    expect(xml).toContain('<loc>https://fahint.com/products/gfci/gf15/</loc><lastmod>2026-10-25</lastmod>');
    expect(xml).toContain('<loc>https://fahint.com/contact/</loc><lastmod>2026-10-26</lastmod>');
    expect((xml.match(/<lastmod>/g)||[])).toHaveLength(2);
  });
});
