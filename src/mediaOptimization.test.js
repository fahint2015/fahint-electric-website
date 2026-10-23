import { existsSync, readFileSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  gfciSeriesVisuals,
  productFamilyVisuals
} from './data/productPageVisuals.js';

describe('production media budget', () => {
  it('serves lightweight scenes and preserves the original GF15 packaging photo', () => {
    const assets = [
      ...productFamilyVisuals.map(({ scene }) => scene),
      ...Object.values(gfciSeriesVisuals)
    ];

    assets.forEach((asset) => {
      if (asset === gfciSeriesVisuals.oemPoster) {
        expect(asset).toBe('assets/images/products/gf15-package-standard-white-v1.jpg');
      } else {
        expect(asset).toMatch(/\.webp$/);
      }
      expect(existsSync(`public/${asset}`)).toBe(true);
      expect(statSync(`public/${asset}`).size).toBeLessThanOrEqual(500 * 1024);
    });
  });

  it('ships a compact fast-start GFCI video and a lightweight poster frame', () => {
    const video = 'public/assets/videos/gfci-product-video-optimized.mp4';
    const poster = 'public/assets/videos/gfci-product-video-poster.webp';

    expect(existsSync(video)).toBe(true);
    expect(existsSync(poster)).toBe(true);
    expect(statSync(video).size).toBeLessThanOrEqual(6 * 1024 * 1024);
    expect(statSync(poster).size).toBeLessThanOrEqual(200 * 1024);
  });
});

describe('site typography', () => {
  const styles = ['src/styles.css', 'src/styles/product-experience.css', 'src/styles/catalog.css']
    .map((file) => readFileSync(file, 'utf8'));

  it('preloads a licensed local variable subset and retains the full font fallback', () => {
    const font = 'public/assets/fonts/source-sans-3-variable.woff2';
    expect(existsSync(font)).toBe(true);
    expect(readFileSync(font).subarray(0, 4).toString()).toBe('wOF2');
    expect(statSync(font).size).toBeLessThan(200 * 1024);
    expect(readFileSync('public/assets/fonts/source-sans-3-LICENSE.txt', 'utf8')).toContain('SIL OPEN FONT LICENSE');
    expect(styles[0]).toMatch(/@font-face\s*\{[^}]*font-family:\s*'Source Sans 3';[^}]*font-style:\s*normal;[^}]*font-weight:\s*200 900;[^}]*font-display:\s*swap;/);
    expect(styles[0]).toContain("url('/assets/fonts/source-sans-3-variable.woff2')");
    const subset = 'public/assets/fonts/fahint-latin-variable.woff2';
    expect(readFileSync(subset).subarray(0, 4).toString()).toBe('wOF2');
    expect(statSync(subset).size).toBeLessThan(100 * 1024);
    expect(styles[0]).toContain("url('/assets/fonts/fahint-latin-variable.woff2')");
    expect(styles[0]).toMatch(/font-family:\s*'FAHINT Latin';[^}]*font-weight:\s*200 900;[^}]*font-display:\s*swap;[^}]*unicode-range:/);
    const html = readFileSync('index.html', 'utf8');
    const preload = [...html.matchAll(/<link\b[^>]*>/g)].map(([tag]) => tag).find((tag) => tag.includes('as="font"'));
    expect(preload).toContain('href="assets/fonts/fahint-latin-variable.woff2"');
    expect(preload).toContain('crossorigin');
    expect(styles.join('\n') + html).not.toMatch(/fonts\.(googleapis|gstatic)\.com/);
  });

  it('uses the shared font for every section and native form control', () => {
    expect(/--font:\s*'FAHINT Latin',\s*'Source Sans 3',/.test(styles[0]), 'Shared subset with the original font fallback').toBe(true);
    const families = styles.flatMap((css) => [...css.matchAll(/font-family:\s*([^;]+);/g)].map((match) => match[1]));
    expect(families.every((family) => ["'FAHINT Latin'", "'Source Sans 3'", 'var(--font)', 'inherit'].includes(family))).toBe(true);
    expect(styles[0]).toMatch(/button,\s*input,\s*select,\s*textarea,\s*optgroup\s*\{\s*font-family:\s*inherit;/);
  });

  it('keeps headings comfortably spaced at desktop and mobile breakpoints', () => {
    let checked = 0;
    for (const css of styles) {
      for (const [, selector, declarations] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
        if (!/(^|[\s>,+~])h[1-4](?=[\s.#:[>,+~]|$)/.test(selector)) continue;
        checked += 1;
        const weight = declarations.match(/font-weight:\s*(\d+)/)?.[1];
        const leading = declarations.match(/line-height:\s*([\d.]+)\s*;/)?.[1];
        const tracking = declarations.match(/letter-spacing:\s*(-[\d.]+)(em|px)/);
        if (weight) expect(Number(weight), selector).toBeLessThanOrEqual(700);
        if (leading) expect(Number(leading), selector).toBeGreaterThanOrEqual(1.12);
        if (tracking) {
          expect(tracking[2], selector).toBe('em');
          expect(Number(tracking[1]), selector).toBeGreaterThanOrEqual(-0.02);
        }
      }
    }
    expect(checked).toBeGreaterThan(30);
  });
});
