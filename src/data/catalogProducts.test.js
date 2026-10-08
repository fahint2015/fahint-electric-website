import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { catalogProducts, findCatalogProduct, filterCatalogProducts, getCatalogProducts, modelKey, productHref } from './catalogProducts.js';
import { products } from './products.js';
import { findLine } from './lines.js';
import { searchStudioModels, studioRanges } from './studioCatalog.js';
import { PUBLIC_ROUTES } from '../../scripts/prepare-pages.mjs';

const rows = (product) => new Map(product.specificationGroups.flatMap((group) => group.rows));
const model = (family, sku) => findCatalogProduct(family, sku);

describe('complete, model-specific catalogue', () => {
  it('covers each source model once without merging surface variants or product families', () => {
    const legacy = JSON.parse(readFileSync('src/data/catalog/legacy-products.json', 'utf8'));
    expect(legacy).toHaveLength(95);
    expect(catalogProducts).toHaveLength(150);
    expect(products.length + catalogProducts.length).toBe(157);
    expect(new Set(catalogProducts.map(productHref)).size).toBe(catalogProducts.length);
    expect(Object.fromEntries(['usb-outlets', 'receptacles', 'dimmers', 'smart-switches', 'lighting-switches', 'wallplates', 'gfci']
      .map((line) => [line, getCatalogProducts(line).length])))
      .toEqual({ 'usb-outlets': 37, receptacles: 30, dimmers: 2, 'smart-switches': 51, 'lighting-switches': 6, wallplates: 21, gfci: 2 });
    for (const record of legacy) {
      const existingGfci = record.family === 'gfci' && products.some((p) => p.sku === record.model);
      expect(existingGfci || catalogProducts.some((p) => p.sourceUrl === record.sourceUrl), record.sourceUrl).toBe(true);
    }
  });

  it('uses real, complete local images with dimensions and traceable sources', () => {
    for (const p of catalogProducts) {
      expect(p.name, p.sku).not.toMatch(/undefined|NaN|\bnull\b/);
      expect(p.sources.length, p.sku).toBeGreaterThan(0);
      expect(p.specificationGroups.length, p.sku).toBeGreaterThan(1);
      expect(p.assets.gallery, p.sku).toContain(p.assets.hero);
      const assets = [...p.assets.gallery, ...p.assets.drawings.map((image) => image.src), ...p.assets.presentation.map((image) => image.src)];
      for (const asset of assets) {
        expect(existsSync(`public/${asset}`), `${p.sku}: ${asset}`).toBe(true);
        expect(p.assets.imageSizes[asset]?.every((dimension) => dimension > 0), `${p.sku}: image dimensions`).toBe(true);
      }
      for (const group of p.specificationGroups) {
        expect(new Set(group.rows.map(([label]) => label)).size, `${p.sku}: duplicate specification labels`).toBe(group.rows.length);
        for (const [label, value] of group.rows) expect(Boolean(label && value), `${p.sku}: ${label}`).toBe(true);
      }
    }
  });

  it('binds genuine finish images for every published model instead of an empty color list', () => {
    for (const product of catalogProducts.filter((p) => !p.draft)) {
      const expected = product.line === 'smart-switches' ? 4 : product.line === 'gfci' ? 1 : 7;
      expect(product.finishes, product.sku).toHaveLength(expected);
      expect(new Set(product.finishes.map((f) => f.image)).size, product.sku).toBe(expected);
      for (const finish of product.finishes) {
        expect(finish.name && finish.hex, `${product.sku}: ${finish.slug}`).toBeTruthy();
        expect(product.assets.finishes[finish.slug]).toBe(finish.image);
        expect(existsSync(`public/${finish.image}`), `${product.sku}: ${finish.slug}`).toBe(true);
        expect(product.assets.imageSizes[finish.image]?.every((size) => size > 0)).toBe(true);
      }
    }
  });

  it('does not interchange color photos between amperages, ports or wall-plate surfaces', () => {
    const photo = (family, sku) => model(family, sku).assets.finishes.black;
    expect(photo('usb-outlets', 'FTR15C-3100')).toBeTruthy();
    expect(photo('usb-outlets', 'FTR15C-3100')).not.toBe(photo('usb-outlets', 'FTR20C-3100'));
    expect(photo('usb-outlets', 'FTR15C-3100')).not.toBe(photo('usb-outlets', 'FTR15DC-3100'));
    expect(photo('wallplates', 'BS1801')).not.toBe(photo('wallplates', 'BS1801-M'));
    expect(photo('wallplates', 'BS1803-G')).not.toBe(photo('wallplates', 'BS1803-M'));
  });

  it('gives all smart switches structural galleries, white photos and their own source references', () => {
    for (const p of getCatalogProducts('smart-switches')) {
      expect(p.assets.gallery.length, p.sku).toBe(p.sku.startsWith('US') ? 5 : 4);
      expect(p.assets.gallery[0], p.sku).toBe(p.assets.finishes.black);
      for (const finish of p.finishes.filter((f) => f.slug !== 'black')) {
        expect(p.assets.gallery, `${p.sku}: ${finish.slug}`).not.toContain(finish.image);
      }
      expect(p.assets.detailViews.map((view) => view.kind), p.sku).toEqual(['front', 'side', 'rear']);
      expect(p.assets.drawings.map((drawing) => drawing.kind), p.sku).toEqual(['dimensions', 'wiring']);
      for (const image of [...p.assets.detailViews, ...p.assets.drawings]) {
        expect(image.source, p.sku).toContain(p.sku);
        expect(existsSync(`public/${image.src}`), `${p.sku}: ${image.kind}`).toBe(true);
        expect(p.assets.imageSizes[image.src], p.sku).toEqual([image.width, image.height]);
      }
      if (p.sku.startsWith('US')) {
        for (const image of [...p.assets.gallery, ...p.finishes.map((finish) => finish.image)]) {
          expect(image, p.sku).toMatch(/smart-switches\/.*-white-v1\.webp$/);
        }
      }
    }
  });

  it('makes all approved catalogue routes deployable, but excludes FLB20 from public listings', () => {
    const draft = catalogProducts.find((p) => p.sku === 'FLB20');
    expect(draft.draft).toBe(true);
    expect(draft.reviewNotice).toMatch(/voltage.*conflict/i);
    expect(getCatalogProducts('gfci').some((p) => p.sku === 'FLB20')).toBe(false);
    expect(PUBLIC_ROUTES).not.toContain('products/gfci/flb20');
    for (const p of catalogProducts.filter((p) => !p.draft)) expect(PUBLIC_ROUTES, p.sku).toContain(productHref(p).slice(1));
    expect(findCatalogProduct('receptacles', 'DM2010')).toBeUndefined();
    expect(findCatalogProduct('usb-outlets', 'GF15')).toBeUndefined();
  });

  it('keeps USB receptacle current, combined power and individual port limits separate', () => {
    expect(rows(model('usb-outlets', 'FTR15-3100')).get('Receptacle rating')).toMatch(/15A/);
    expect(rows(model('usb-outlets', 'FTR20-3100')).get('Receptacle rating')).toMatch(/20A/);
    expect(rows(model('usb-outlets', 'FTR15DC-3600')).get('USB-C port 1')).toMatch(/2\.4A/);
    expect(rows(model('usb-outlets', 'FTR15DC-5000')).get('USB-C port 1')).toBe('5V DC 3.0A');
    expect(rows(model('usb-outlets', 'F4P')).get('Combined USB output')).toBe('5V DC · 4.2A · 21W');
    expect(rows(model('usb-outlets', 'F4P')).has('Receptacle rating')).toBe(false);
    expect(rows(model('usb-outlets', 'FTR20QC-AC65W')).get('USB-A port 1')).toMatch(/18W/);
    expect(rows(model('usb-outlets', 'FTR20QC-AC65W')).get('USB-A port 1')).not.toMatch(/PD/);
    expect(model('usb-outlets', 'FTR20QC-DC65W').notes.join(' ')).toMatch(/not a promise.*both ports/);
  });

  it('keeps USB color variants out of thumbnails and places genuine plate photographs last', () => {
    for (const p of getCatalogProducts('usb-outlets')) {
      expect(p.assets.gallery[0], p.sku).toBe(p.assets.finishes.white);
      expect(new Set(p.assets.gallery).size, p.sku).toBe(p.assets.gallery.length);
      expect(p.assets.gallery.length, p.sku).toBeLessThanOrEqual(6);
      for (const finish of p.finishes.filter((f) => f.slug !== 'white')) {
        expect(p.assets.gallery, `${p.sku}: ${finish.slug}`).not.toContain(finish.image);
      }
      expect(p.assets.gallery.slice(-2), p.sku).toEqual([
        `assets/images/catalog/usb-plates/${p.slug}-standard-v1.png`,
        `assets/images/catalog/usb-plates/${p.slug}-screwless-v1.png`
      ]);
      if (!p.sku.endsWith('-4200') && p.sku !== 'F4P') {
        for (const packaged of p.assets.presentation) expect(p.assets.gallery).not.toContain(packaged.src);
      }
    }
  });

  it('fills missing USB receptacle rear and side views before the plate photographs', () => {
    const sharedViews = ['430f555427db1805', 'ddf36c5c6fcae0e3']
      .map((id) => `assets/images/catalog/models/${id}.webp`);
    for (const p of getCatalogProducts('usb-outlets').filter((product) => product.sku !== 'F4P')) {
      for (const src of sharedViews) {
        expect(p.assets.gallery.filter((image) => image === src), p.sku).toHaveLength(1);
        expect(p.assets.gallery.indexOf(src), p.sku).toBeGreaterThan(0);
        expect(p.assets.gallery.indexOf(src), p.sku).toBeLessThan(p.assets.gallery.length - 2);
        expect(p.assets.imageSizes[src], p.sku).toEqual([800, 800]);
      }
    }
  });

  it('preserves the four-port charger’s own structural views', () => {
    const p = model('usb-outlets', 'F4P');
    expect(p.assets.gallery.slice(1, -2)).toEqual([
      'assets/images/catalog/models/9e0642bd67a45176.webp',
      'assets/images/catalog/models/ebaf77f3a03e5a07.webp'
    ]);
  });

  it('keeps Q wiring, TR/WR variants and catalogue industrial ratings distinct', () => {
    expect(rows(model('receptacles', 'R15Q')).get('Wiring method')).toMatch(/Push-In/);
    expect(rows(model('receptacles', 'R15')).get('Wiring method')).toMatch(/Back Wire/);
    expect(rows(model('receptacles', 'RT20')).get('Tamper-resistant')).toBe('Yes');
    expect(rows(model('receptacles', 'RT20')).get('Weather-resistant')).toBe('No');
    expect(rows(model('receptacles', 'RW20')).get('Weather-resistant')).toBe('Yes');
    for (const sku of ['CR15', 'CR20', 'CD20']) {
      const product = model('receptacles', sku);
      expect(rows(product).get('Device rating')).toBe(`${sku === 'CR15' ? 15 : 20}A · 125V/250V`);
      expect(rows(product).get('Application grade')).toBe('Industrial Grade');
      expect(rows(product).has('NEMA')).toBe(false);
      expect(product.name).toMatch(/Industrial Grade Duplex Receptacle/);
      expect(product.sources.some(source => source.href.endsWith('#page=17'))).toBe(true);
      expect(product.certificate).toBeNull();
      expect(product.reviewNotice || '').not.toMatch(/sources conflict/);
    }
  });

  it('uses catalogue commercial names without breaking old routes, finishes or search', () => {
    const aliases = { 'R15-C': 'C15', 'R15Q-C': 'C15Q', 'R20-C': 'C20', 'RT15-C': 'CT15', 'RT15Q-C': 'CT15Q', 'RT20-C': 'CT20', 'RW15-C': 'CW15', 'RW15Q-C': 'CW15Q', 'RW20-C': 'CW20' };
    for (const [oldSku, sku] of Object.entries(aliases)) {
      const product = model('receptacles', sku);
      expect(product, sku).toBeDefined();
      expect(product).toBe(model('receptacles', oldSku));
      expect(product.sku).toBe(sku);
      expect(productHref(product)).toBe(`/products/receptacles/${oldSku.toLowerCase()}`);
      expect(rows(product).get('Source model designation')).toBe(sku);
      expect(product.group).toBe('Commercial Duplex Receptacles');
      expect(product.finishes).toHaveLength(7);
      expect(product.sources.some(source => source.href.endsWith('#page=17'))).toBe(true);
      for (const query of [oldSku, sku]) expect(filterCatalogProducts(getCatalogProducts('receptacles'), { query })).toContain(product);
    }
  });

  it('applies catalogue terminal distinctions to all thirty receptacle models', () => {
    for (const product of getCatalogProducts('receptacles')) {
      const fields = rows(product);
      const quick = product.sku.endsWith('Q');
      expect(fields.get('Wiring method'), product.sku).toBe(quick ? 'Side Wire / Push-In Quick Wire' : 'Side Wire / Back Wire');
      expect(fields.has('Push-in terminal conductor'), product.sku).toBe(quick);
      if (quick) expect(fields.get('Push-in terminal conductor')).toBe('#14 AWG only · 15A push-in terminal');
      expect(product.sources.some(source => source.href.endsWith('#page=18'))).toBe(true);
    }
  });

  it('attaches the reviewed range drawing and measurements to the three standard R models', () => {
    for (const sku of ['R15', 'R15Q', 'R20']) {
      const product = model('receptacles', sku);
      expect(rows(product).get('Device width')).toBe('33.2 mm');
      expect(rows(product).get('Overall height')).toBe('106 mm');
      expect(rows(product).get('Overall depth')).toBe('23.8 mm');
      expect(product.assets.drawings).toHaveLength(1);
      expect(product.assets.drawings[0].caption).toMatch(/Shared receptacle range/);
      expect(product.notes.join(' ')).toMatch(/range drawing/);
    }
  });

  it('does not interchange DM2010 and DM2010S load or control ratings', () => {
    expect(rows(model('dimmers', 'DM2010')).get('LED / CFL load')).toBe('5–200W');
    expect(rows(model('dimmers', 'DM2010')).get('Incandescent load')).toBe('20–600W');
    expect(rows(model('dimmers', 'DM2010S')).get('Operating voltage')).toMatch(/277V/);
    expect(rows(model('dimmers', 'DM2010S')).get('Control output')).toMatch(/0–10V/);
    expect(rows(model('dimmers', 'DM2010S')).has('Incandescent load')).toBe(false);
    for (const sku of ['DM2010', 'DM2010S']) {
      const product = model('dimmers', sku);
      expect(rows(product).get('Operating temperature')).toBe('−20°C to 40°C');
      expect(rows(product).get('Recessed depth')).toBe('21.5 mm');
      expect(product.assets.drawings.map(drawing => drawing.kind)).toEqual(['dimensions', 'wiring']);
      expect(product.notes.join(' ')).toMatch(/derating/);
    }
  });

  it.each(['DM2010', 'DM2010S'])('adds the matching screwless dimmer views for %s', (sku) => {
    const p = model('dimmers', sku);
    const screwless = `assets/images/catalog/dimmers/${p.slug}-screwless-plate-v1.png`;
    const packaged = `assets/images/catalog/dimmers/${p.slug}-screwless-package-v1.png`;
    expect(p.assets.gallery).toEqual([
      p.assets.hero,
      'assets/images/catalog/models/ea83e27b52508303.webp',
      screwless,
      'assets/images/catalog/models/cb4dfb328d0db950.webp',
      packaged,
      'assets/images/catalog/models/89b3d42444050e1d.webp'
    ]);
    expect(p.assets.presentation.map((image) => image.src)).toEqual([
      packaged, 'assets/images/catalog/models/cb4dfb328d0db950.webp'
    ]);
    expect(p.assets.imageSizes[screwless]).toEqual([800, 800]);
    expect(p.assets.imageSizes[packaged]).toEqual([800, 800]);
    expect(p.assets.detail).toBe('assets/images/catalog/models/89b3d42444050e1d.webp');
  });

  it('distinguishes smart-switch wiring, radios, formats and model-specific uncertainty', () => {
    expect(rows(model('smart-switches', 'EUW8811')).get('Operating voltage')).toMatch(/90–250/);
    expect(rows(model('smart-switches', 'EUW8811C')).get('Operating voltage')).toMatch(/160–240/);
    expect(rows(model('smart-switches', 'EUZ8811S')).get('Operating voltage')).toMatch(/110–240/);
    expect(rows(model('smart-switches', 'USW8811-S')).get('Wiring requirement')).toBe('Single live wire');
    expect(rows(model('smart-switches', 'UST8811')).get('Control mode')).toBe('Touch only');
    expect(rows(model('smart-switches', 'USW8832')).get('Function')).toBe('Dimming');
    expect(rows(model('smart-switches', 'USW8833')).get('Function')).toBe('Curtain control');
    expect(rows(model('smart-switches', 'UST8832')).get('Wiring requirement')).toMatch(/conflict/);
    expect(rows(model('smart-switches', 'EUZ8834')).get('Program status')).toMatch(/Sample-stage/);
    expect(model('smart-switches', 'USW8811').certificate).toBeNull();
    expect(model('smart-switches', 'EUW8811').finishes).toHaveLength(4);
    const neutral = model('smart-switches', 'USW8811');
    const singleLive = model('smart-switches', 'USW8811-S');
    const touch = model('smart-switches', 'UST8811');
    expect(neutral.assets.detailViews[2].src).not.toBe(singleLive.assets.detailViews[2].src);
    expect(singleLive.assets.detailViews[2].src).not.toBe(touch.assets.detailViews[2].src);
    expect(neutral.assets.drawings[1].source).toContain('Wi-Fi Neutral Reruired/USW8811/10.png');
    expect(singleLive.assets.drawings[1].source).toContain('Wi-Fi Single Life Wire/USW8811-S/10.png');
    expect(touch.assets.drawings[1].source).toContain('Touch Switch/Single Life Wire/UST8811/10.png');
    expect(model('smart-switches', 'UST8832').assets.drawings[1].source).toContain('Neutral Reruired/UST8832/10.png');
  });

  it('preserves the lighting-switch voltage and UL/ETL differences', () => {
    expect(rows(model('lighting-switches', 'T15')).get('Device rating')).toMatch(/125V/);
    expect(rows(model('lighting-switches', 'DS15')).get('Device rating')).toMatch(/120\/277V/);
    expect(rows(model('lighting-switches', 'DS15')).get('Source model designation')).toBe('DS15');
    expect(model('lighting-switches', 'DS15.3').name).toMatch(/3-Way/);
    for (const sku of ['DS1502', 'DS1503']) {
      expect(rows(model('lighting-switches', sku)).get('Published certification')).toBe('ETL');
      expect(model('lighting-switches', sku).certificate.image).toBeNull();
      expect(model('lighting-switches', sku).name).not.toMatch(/Gang/);
    }
  });

  it('uses white bare-device covers for the selected lighting switches across the catalogue', () => {
    const expected = {
      DS15: 'assets/images/catalog/models/50e6f2d3f5cf9b64.webp',
      'DS15.3': 'assets/images/catalog/models/50e6f2d3f5cf9b64.webp',
      DS1502: 'assets/images/catalog/models/9c21053579be1cac.webp',
      T15: 'assets/images/catalog/models/f859bb10d2d105c0.webp'
    };
    for (const [sku, src] of Object.entries(expected)) {
      const p = model('lighting-switches', sku);
      expect(p.assets.card, sku).toBe(src);
      expect(p.assets.card, sku).toBe(p.assets.finishes.white);
      expect(p.assets.imageSizes[src], sku).toEqual([800, 800]);
      expect(existsSync(`public/${src}`), sku).toBe(true);
      // The curated detail gallery now starts with the approved bare white cover.
      expect(p.assets.hero, sku).toBe(p.assets.card);
      expect(p.assets.gallery, sku).toContain(p.assets.hero);
    }
    for (const sku of ['DS1503', 'T15.3']) {
      const p = model('lighting-switches', sku);
      expect(p.assets.card, sku).toBe(p.assets.hero);
    }
    expect(findLine('lighting-switches').cover).toBe(expected.DS15);
    expect(studioRanges.find((range) => range.slug === 'lighting-switches').featured.map((p) => p.assets.card))
      .toEqual([expected.DS15, expected.T15]);
  });

  it('curates compact model-specific white lighting galleries without color or promotional clutter', () => {
    const expected = {
      DS15: ['models/50e6f2d3f5cf9b64.webp', 'models/f27fdfb77ebc422d.webp', 'models/d0d49278307b26d7.webp', 'models/bbd1ee3b3a7ef0ea.webp', 'lighting-switches/paddle-screwless-white-v1.png'],
      'DS15.3': ['models/50e6f2d3f5cf9b64.webp', 'models/dc383c22eded4661.webp', 'models/1cca0ee7ddcc8f0a.webp', 'models/bbd1ee3b3a7ef0ea.webp', 'lighting-switches/paddle-screwless-white-v1.png'],
      DS1502: ['models/9c21053579be1cac.webp', 'models/f5bff2d649a9a069.webp', 'lighting-switches/ds1502-side-v1.png', 'lighting-switches/ds1502-standard-plate-v1.png', 'lighting-switches/ds1502-screwless-plate-v1.png'],
      DS1503: ['models/9ef60ea16e0567a5.webp', 'models/a9bd7366f5c2aaa4.webp', 'lighting-switches/ds1503-side-v1.png', 'lighting-switches/ds1503-standard-plate-v1.png', 'lighting-switches/ds1503-screwless-plate-v1.png'],
      T15: ['models/f859bb10d2d105c0.webp', 'models/f8141a47c5ffc32b.webp', 'models/40197c504db5ed01.webp', 'models/345569ec6e60fd6f.webp'],
      'T15.3': ['models/e865d6e03bd24428.webp', 'models/d0fdd5bd30be0743.webp', 'models/797c494ac3c405f7.webp', 'models/4212209407e00bbc.webp'],
    };
    const legacy = JSON.parse(readFileSync('src/data/catalog/legacy-products.json', 'utf8'));
    for (const [sku, paths] of Object.entries(expected)) {
      const p = model('lighting-switches', sku);
      const gallery = paths.map((path) => `assets/images/catalog/${path}`);
      expect(p.assets.gallery, sku).toEqual(gallery);
      expect(p.assets.hero, sku).toBe(gallery[0]);
      expect(p.assets.detail, sku).toBe(gallery[1]);
      expect(new Set(gallery).size, sku).toBe(gallery.length);
      expect(p.finishes, sku).toHaveLength(7);
      for (const finish of p.finishes.filter((f) => f.slug !== 'white')) {
        expect(gallery, `${sku} ${finish.slug}`).not.toContain(finish.image);
      }
      for (const src of gallery) {
        expect(existsSync(`public/${src}`), src).toBe(true);
        expect(p.assets.imageSizes[src], src).toEqual([800, 800]);
      }
      expect(p.assets.drawings, sku).toEqual(legacy.find((r) => r.family === 'lighting-switches' && r.model === sku).drawings);
    }
    const css = readFileSync('src/styles/catalog.css', 'utf8');
    expect(css).toMatch(/\.catalog-product-detail--lighting \.product-gallery__thumbs\s*\{[^}]*display:\s*grid[^}]*overflow:\s*visible/);
    const shared = readFileSync('src/styles/site-system.css', 'utf8');
    expect(shared.slice(shared.indexOf('@media (max-width: 760px)')))
      .toMatch(/\.product-detail-hero \.product-gallery__thumbs\s*\{[^}]*display:\s*flex[^}]*flex-wrap:\s*nowrap[^}]*overflow-x:\s*auto/);
  });

  it('keeps glossy/matte and screw-fixed/screwless plate sizes separate', () => {
    const standard = model('wallplates', 'BS1801');
    const matte = model('wallplates', 'BS1801-M');
    const screwless = model('wallplates', 'BS1803-G');
    expect(standard.assets.hero).not.toBe(matte.assets.hero);
    expect(rows(standard).get('Surface finish')).toBe('Glossy');
    expect(rows(matte).get('Surface finish')).toBe('Matte');
    expect(rows(standard).get('Product width')).toBe('2.75 in (70mm)');
    expect(rows(screwless).get('Product width')).toBe('2.95 in (75mm)');
    expect(rows(model('wallplates', 'BS18014')).get('Number of gangs')).toBe('4');
    expect(rows(model('wallplates', 'BS18014')).get('Source model designation')).toBe('BS18014');
    expect(rows(model('wallplates', 'BS1805')).get('Thickness')).toBe('0.87 in (22mm)');
    expect(rows(standard).get('Warranty')).toBe('3 years limited');
  });

  it('uses the supplied PC material reference separately from standard/medium size and glossy/matte finish', () => {
    for (const sku of ['BS1801', 'BS1801-M', 'BS1802']) {
      const product = model('wallplates', sku);
      const medium = sku === 'BS1802';
      expect(rows(product).get('Product width')).toBe(medium ? '3.15 in (80 mm)' : '2.75 in (70mm)');
      expect(rows(product).get('Product height')).toBe(medium ? '4.88 in (124 mm)' : '4.52 in (115mm)');
      expect(rows(product).get('Thickness')).toBe('0.26 in (6.5mm)');
      expect(rows(product).get('Material specification')).toBe('Polycarbonate (PC)');
      expect(rows(product).get('Surface finish')).toBe(sku === 'BS1801-M' ? 'Matte' : 'Glossy');
      expect(product.notes.join(' ')).toMatch(/Glossy and matte describe surface finishes, not different resins/);
      expect(rows(product).has('Published construction material')).toBe(false);
      expect(product.sources.some(source => source.href.endsWith('#page=30'))).toBe(true);
      expect(product.assets.drawings).toHaveLength(1);
      expect(product.assets.drawings[0].caption).toContain(medium ? '80 × 124 × 6.5 mm' : '70 × 115 × 6.5 mm');
    }
  });

  it('prioritizes exact legacy commercial names in the full catalogue without crossing family filters', () => {
    const aliases = { 'R15-C': 'C15', 'R15Q-C': 'C15Q', 'R20-C': 'C20', 'RT15-C': 'CT15', 'RT15Q-C': 'CT15Q', 'RT20-C': 'CT20', 'RW15-C': 'CW15', 'RW15Q-C': 'CW15Q', 'RW20-C': 'CW20' };
    for (const [alias, sku] of Object.entries(aliases)) {
      expect(searchStudioModels(alias).map(p => p.sku), alias).toEqual([sku]);
      expect(searchStudioModels(alias, 'receptacles').map(p => p.sku), alias).toEqual([sku]);
      expect(filterCatalogProducts(getCatalogProducts('receptacles'), { query: alias }).map(p => p.sku), alias).toEqual([sku]);
    }
    expect(searchStudioModels(' rt15q c ').map(p => p.sku)).toEqual(['CT15Q']);
    expect(searchStudioModels('RT15Q-C', 'dimmers')).toEqual([]);
    expect(searchStudioModels('R15-C', 'usb-outlets')).toEqual([]);
    expect(searchStudioModels('FTR15C-3100').map(p => p.sku)).toEqual(['FTR15C-3100']);
    expect(searchStudioModels('CT15Q').map(p => p.sku)).toEqual(['CT15Q']);
    expect(searchStudioModels('BS1801', 'wallplates').map(p => p.sku)).toEqual(expect.arrayContaining(['BS1801', 'BS1801-M']));
  });

  it('publishes all six catalogue 4200 models without claiming unpublished port limits are listed', () => {
    const models = getCatalogProducts('usb-outlets').filter(p => p.sku.endsWith('-4200'));
    expect(models.map(p => p.sku)).toEqual(['FTR15-4200', 'FTR15C-4200', 'FTR15DC-4200', 'FTR20-4200', 'FTR20C-4200', 'FTR20DC-4200']);
    for (const product of models) {
      expect(Object.fromEntries(product.keyFacts)['Combined USB output']).toBe('5V DC · 4.2A · 21W');
      expect(product.sources.some(source => source.href.endsWith('#page=10'))).toBe(true);
      expect(product.notes.join(' ')).toMatch(/not an individual-port current limit/);
      expect(product.notes.join(' ')).not.toMatch(/Individual port limits are listed separately/);
    }
  });

  it('matches wallplate scans to the documented base model instead of the family alone', () => {
    for (const sku of ['BS1801', 'BS1801-M', 'BS1802', 'BS1803-G', 'BS1803-M', 'BS1804']) {
      expect(model('wallplates', sku).certificate.image, sku).toBe('assets/images/certs/ul-wallplate-2018.jpg');
    }
    for (const sku of ['BS1806', 'BS1807', 'BS18012', 'BS18013-M', 'BS18014', 'BS18032-M', 'BS18033-G', 'BS18034-M']) {
      expect(model('wallplates', sku).certificate.image, sku).toBe('assets/images/certs/ul-wallplate.webp');
    }
    expect(model('wallplates', 'BS1805').certificate.image).toBeNull();
  });

  it('uses the GTN addendum without restoring conflicting feed-through drawings', () => {
    for (const sku of ['GTN15', 'GTN20']) {
      const p = model('gfci', sku);
      expect(rows(p).get('Feed-through terminals')).toMatch(/^None/);
      expect(p.certificate.image).toBe('assets/images/certs/ul-gfci.webp');
      expect(p.summary).toMatch(/nylon/);
      expect(p.notes.join(' ')).toMatch(/August 16, 2022.*E504391-20210212.*GTN15.*GTN20/);
      expect(p.notes.join(' ')).toMatch(/current.*coverage/i);
      expect(p.notes.join(' ')).not.toMatch(/does not establish coverage/);
      expect(p.certificationLabel).toMatch(/E504391.*2022/);
      expect(rows(p).get('Weather-resistant')).toBe('No');
      expect(p.assets.drawings).toEqual([]);
      expect(p.notes.join(' ')).toMatch(/drawing.*20A Feed-Through.*withheld/);
    }
    expect(modelKey(model('gfci', 'GTN20').sku)).toBe('gtn20');
  });
});
