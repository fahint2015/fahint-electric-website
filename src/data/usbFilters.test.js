import { describe, expect, it } from 'vitest';
import { getCatalogProducts } from './catalogProducts.js';
import { filterUsbProducts, usbFilters, usbFilterValues } from './usbFilters.js';

const models = getCatalogProducts('usb-outlets');
const model = sku => models.find(product => product.sku === sku);

describe('USB specification filters', () => {
  it('classifies every published model using the supported port, AC rating and charging values', () => {
    const counts = {
      ports: { 'dual-a': 8, 'a-c': 14, 'dual-c': 14, 'four-a': 1 },
      rating: { '15a': 18, '20a': 18, 'usb-only': 1 },
      charging: { '5v-3.1': 6, '5v-3.6': 6, '5v-4.2': 7, '5v-5': 6, 'pd-20w': 4, 'pd-36w': 4, 'pd-65w': 4 },
    };
    expect(usbFilters.map(filter => filter.name)).toEqual(['ports', 'rating', 'charging']);
    for (const { name, options } of usbFilters) {
      expect(options.map(([value]) => value)).toEqual(Object.keys(counts[name]));
      for (const [value, expected] of Object.entries(counts[name])) {
        expect(filterUsbProducts(models, { [name]: value }), `${name}: ${value}`).toHaveLength(expected);
      }
      for (const product of models) {
        expect(Object.keys(counts[name]), product.sku).toContain(usbFilterValues(product)[name]);
      }
    }
  });

  it('normalizes the 4.2A catalogue aliases without treating conventional USB-C as PD', () => {
    expect(usbFilterValues(model('FTR15-4200'))).toEqual({ ports: 'dual-a', rating: '15a', charging: '5v-4.2' });
    expect(usbFilterValues(model('FTR20DC-4200'))).toEqual({ ports: 'dual-c', rating: '20a', charging: '5v-4.2' });
    expect(usbFilterValues(model('FTR15C-3100'))).toEqual({ ports: 'a-c', rating: '15a', charging: '5v-3.1' });
  });

  it('keeps the four-port charger separate from AC receptacle amperage', () => {
    expect(usbFilterValues(model('F4P'))).toEqual({ ports: 'four-a', rating: 'usb-only', charging: '5v-4.2' });
    expect(filterUsbProducts(models, { rating: 'usb-only' }).map(product => product.sku)).toEqual(['F4P']);
  });

  it('intersects selections without adding up the PD ports', () => {
    expect(filterUsbProducts(models, { ports: 'dual-c', rating: '20a', charging: 'pd-65w' }).map(product => product.sku))
      .toEqual(['FTR20QC-DC65W']);
    expect(filterUsbProducts(models, { ports: 'dual-a', charging: 'pd-65w' })).toEqual([]);
    expect(usbFilterValues(model('FTR20QC-AC65W')).charging).toBe('pd-65w');
  });

  it('retains the catalog order and does not mutate product specifications', () => {
    const before = JSON.stringify(models.map(product => product.specificationSummary));
    expect(filterUsbProducts(models)).toEqual(models);
    filterUsbProducts(models, { rating: '15a' });
    expect(JSON.stringify(models.map(product => product.specificationSummary))).toBe(before);
  });

  it('does not guess missing specifications from a model number', () => {
    expect(usbFilterValues({ sku: 'FTR20QC-DC65W', specificationSummary: [], group: '' }))
      .toEqual({ ports: '', rating: '', charging: '' });
    expect(usbFilterValues({ ...model('FTR15C-3100'), sku: 'arbitrary-name' }))
      .toEqual(usbFilterValues(model('FTR15C-3100')));
  });
});
