import { describe, expect, it } from 'vitest';
import { getCatalogProducts } from './catalogProducts.js';
import { resolveUsbComparison, usbComparisonRows } from './usbComparison.js';

const models = getCatalogProducts('usb-outlets');
const find = sku => models.find(product => product.sku === sku);
const values = (skus, label) => usbComparisonRows(skus.map(find)).find(row => row.label === label)?.values;

describe('USB comparison selection', () => {
  it('resolves known published USB models in order, ignoring invalid and duplicate values', () => {
    expect(resolveUsbComparison('GF15,invalid,FTR15-3100, ftr15-3100 ,F4P').map(p => p.sku))
      .toEqual(['FTR15-3100', 'F4P']);
    expect(resolveUsbComparison()).toEqual([]);
    expect(resolveUsbComparison('<script>,DM2010,https://example.invalid')).toEqual([]);
  });

  it('keeps at most the first three valid distinct models', () => {
    expect(resolveUsbComparison('invalid,FTR15-3100,F4P,FTR15C-3100,FTR20-3100').map(p => p.sku))
      .toEqual(['FTR15-3100', 'F4P', 'FTR15C-3100']);
  });
});

describe('USB comparison facts', () => {
  it('compares ports and electrical ratings without treating formatting as a difference', () => {
    expect(values(['FTR15C-3100', 'FTR15C-4200'], 'Receptacle rating'))
      .toEqual(['15A · 125V · NEMA 5-15R', '15A · 125V · NEMA 5-15R']);
    const rows = usbComparisonRows(['FTR15-3100', 'FTR15DC-4200'].map(find));
    expect(rows.find(row => row.label === 'USB ports')).toMatchObject({ values: ['Dual USB-A', 'Dual USB-C'], different: true });
    expect(rows.find(row => row.label === 'Receptacle rating').different).toBe(false);
  });

  it('separates conventional shared output from PD single-port maxima', () => {
    const skus = ['FTR15-3100', 'FTR20QC-DC65W'];
    expect(values(skus, 'Charging type')).toEqual(['Conventional 5V', 'USB Power Delivery']);
    expect(values(skus, 'Combined USB output')).toEqual(['5V DC · 3.1A', 'Confirm dual-port power sharing']);
    expect(values(skus, 'USB-C PD maximum')).toEqual(['Not applicable (non-PD)', 'Up to 65W per USB-C port']);
    expect(values(skus, 'Device depth')).toEqual(['44.7 mm', '47 mm']);
  });

  it('identifies F4P as a USB-only charger and uses its catalog total', () => {
    expect(values(['F4P'], 'Receptacle rating')).toEqual(['No AC receptacle · 125V 60Hz input']);
    expect(values(['F4P'], 'USB ports')).toEqual(['4 × USB-A']);
    expect(values(['F4P'], 'Combined USB output')).toEqual(['5V DC · 4.2A']);
    expect(values(['F4P'], 'Device depth')).toEqual(['41.1 mm']);
  });

  it('does not infer 4200 wiring/dimensions or substitute body height for overall height', () => {
    for (const label of ['Wiring method', 'Device width', 'Overall height', 'Device depth']) {
      expect(values(['FTR15C-4200'], label)).toEqual(['Not published — please confirm']);
    }
    expect(values(['FTR15QC-DC20W', 'FTR15QC-DC36W'], 'Overall height'))
      .toEqual(['Not published — please confirm', 'Not published — please confirm']);
    expect(values(['FTR15-3100', 'FTR20QC-DC65W'], 'Overall height')).toEqual(['103.3 mm', '103.8 mm']);
  });

  it('provides the same nine meaningful rows for all 37 models with reliable difference flags', () => {
    expect(models).toHaveLength(37);
    for (const model of models) {
      const rows = usbComparisonRows([model, model]);
      expect(rows).toHaveLength(9);
      for (const row of rows) {
        expect(row.values).toHaveLength(2);
        expect(row.values.every(value => typeof value === 'string' && value.length > 0)).toBe(true);
        expect(row.different).toBe(false);
      }
    }
  });
});
