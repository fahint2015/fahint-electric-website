import { describe, expect, it } from 'vitest';
import { certificates, findModelCertificate } from './certificates.js';
import { findCatalogProduct } from './catalogProducts.js';
import { findProduct } from './products.js';

describe('Supplied model documents', () => {
  it.each([
    ['gfci', 'GF15', 'ul-gfci', 'E504391-20210212'],
    ['gfci', 'GTN20', 'ul-gfci', 'E504391-20210212'],
    ['usb-outlets', 'FTR15C-3100', 'ul-usb', 'E498095-20180426'],
    ['usb-outlets', 'FTR20DC-3600', 'ul-usb', 'E498095-20180426'],
    ['receptacles', 'RW15Q', 'ul-receptacle', 'E498095-20211123'],
    ['lighting-switches', 'DS15.3', 'ul-switch', 'E528137-20241016'],
    ['wallplates', 'BS1801-M', 'ul-wallplate-2018', 'E501377-20181016'],
    ['wallplates', 'BS18032-G', 'ul-wallplate', 'E501377-20230919'],
  ])('finds the archived reference for %s / %s', (line, sku, slug, report) => {
    const product = findProduct(sku) || findCatalogProduct(line, sku);
    expect(product).toBeDefined();
    expect(findModelCertificate(product)).toMatchObject({ slug, report });
  });

  it.each([
    ['gfci', 'GL20'], ['usb-outlets', 'FTR15-4200'], ['usb-outlets', 'FTR15-5000'],
    ['usb-outlets', 'FTR15QC-AC65W'], ['usb-outlets', 'F4P'],
    ['receptacles', 'R15-C'], ['receptacles', 'CR20'],
    ['lighting-switches', 'T15.3'], ['lighting-switches', 'DS1502'], ['wallplates', 'BS1805'],
  ])('does not infer correspondence from family, file number or prefix: %s / %s', (line, sku) => {
    const product = findProduct(sku) || findCatalogProduct(line, sku);
    expect(product).toBeDefined();
    expect(findModelCertificate(product)).toBeUndefined();
  });

  it('does not erase punctuation, cross families or publish review/draft evidence', () => {
    expect(findModelCertificate({ line: 'lighting-switches', sku: 'DS153' })).toBeUndefined();
    expect(findModelCertificate({ line: 'usb-outlets', sku: 'DS15' })).toBeUndefined();
    expect(findModelCertificate({ line: 'wallplates', sku: 'BS1801-X' })).toBeUndefined();
    expect(findModelCertificate({ sku: 'GF15', listing: { status: 'review' } })).toBeUndefined();
    expect(findModelCertificate({ line: 'wallplates', sku: 'BS1801', draft: true })).toBeUndefined();
  });

  it('records report and model-page references separately from the quality system', () => {
    for (const file of certificates.filter(file => file.family)) {
      expect(file.report).toMatch(/^E\d+-\d{8}$/);
      expect(file.models.length).toBeGreaterThan(0);
      expect(file.modelPages.length).toBeGreaterThan(0);
      expect(new Set(file.models).size).toBe(file.models.length);
    }
    expect(certificates.find(file => file.slug === 'ul-usb').modelPages).toEqual([2, 3, 5, 6]);
    expect(certificates.find(file => file.slug === 'iso-9001').models).toBeUndefined();
  });

  it('attaches catalog scans only when the exact designation has a supplied reference', () => {
    for (const [line, sku] of [['usb-outlets', 'FTR15-5000'], ['usb-outlets', 'FTR15QC-AC65W'], ['receptacles', 'R15-C']]) {
      expect(findCatalogProduct(line, sku).certificate.image).toBeNull();
    }
    expect(findCatalogProduct('lighting-switches', 'DS15').certificate.image).toBe('assets/images/certs/ul-switch.webp');
  });
});
