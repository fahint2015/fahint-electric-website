import { describe, expect, it } from 'vitest';
import { getCatalogProducts, findCatalogProduct } from './catalogProducts.js';
import { usbDimensionReference } from './usbDimensions.js';

const model = (sku) => findCatalogProduct('usb-outlets', sku);

describe('model-specific USB dimensional references', () => {
  it('covers original drawings and the reviewed shared reference for six 4200mA models', () => {
    const models = getCatalogProducts('usb-outlets');
    expect(models.filter((p) => usbDimensionReference(p))).toHaveLength(37);
    for (const p of models) {
      const dimensions = usbDimensionReference(p);
      expect(dimensions.source, p.sku).toBe(p.assets.drawings[0].src);
      expect(dimensions.width, p.sku).toBe(43.5);
      if (p.sku.endsWith('-4200')) {
        expect(dimensions).toMatchObject({ bodyHeight: 69, depth: 44.7, boxDepth: 37.5, mountingPitch: 83.5 });
        expect(dimensions.overallHeight).toBeUndefined();
        expect(dimensions.scope).toMatch(/shared.*4200mA/i);
        expect(p.assets.drawings[0].caption).toMatch(/non-65W/);
      }
    }
  });

  it('does not use a GFCI depth or confuse mounting pitch with overall height', () => {
    expect(usbDimensionReference(model('FTR15-3100'))).toMatchObject({ plateHeight: 115, plateWidth: 70, overallHeight: 103.3, depth: 44.7 });
    expect(usbDimensionReference(model('F4P'))).toMatchObject({ overallHeight: 103.3, depth: 41.1 });
    for (const p of getCatalogProducts('usb-outlets').filter((p) => p.sku.includes('QC'))) {
      const dimensions = usbDimensionReference(p);
      expect(dimensions.mountingPitch, p.sku).toBe(83.5);
      expect(dimensions.tabPitch, p.sku).toBe(23.8);
      expect(dimensions.bodyHeight, p.sku).toBe(69);
      expect(dimensions.plateHeight, p.sku).toBeUndefined();
      if (p.sku.endsWith('65W')) {
        expect(dimensions, p.sku).toMatchObject({ overallHeight: 103.8, depth: 47, boxDepth: 39.8 });
      } else {
        expect(dimensions.overallHeight, p.sku).toBeUndefined();
        expect(dimensions.depth, p.sku).toBe(44.7);
      }
    }
  });

  it('requires both the exact model and the reviewed source drawing', () => {
    const p = model('FTR15-3100');
    expect(usbDimensionReference({ ...p, sku: 'UNKNOWN' })).toBeNull();
    expect(usbDimensionReference({ ...p, line: 'gfci' })).toBeNull();
    expect(usbDimensionReference({ ...p, assets: { ...p.assets, drawings: [{ src: 'replacement.webp' }] } })).toBeNull();
  });
});
