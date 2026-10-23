import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import {
  products,
  productReviewQueue,
  productGallery,
  productImage,
  productFinishImage,
  filterGfciProducts,
  isVerifiedListing
} from './products.js';

describe('verified GFCI product data', () => {
  it('retains the thirteen archived residential GFCI feature topics in the concise page data', () => {
    const product = products.find((item) => item.sku === 'GF15');
    expect(product.functionalFeatures).toHaveLength(13);
    expect(product.functionalFeatures).toEqual(expect.arrayContaining([
      expect.stringMatching(/E504391.*current coverage/i),
      expect.stringMatching(/3 seconds.*15 minutes/i),
      expect.stringMatching(/MCU/i),
      expect.stringMatching(/regular.*20K.*20A.*33K/i),
      expect.stringMatching(/torque.*2 N·m/i),
      expect.stringMatching(/LED.*stated.*5 years/i),
      expect.stringMatching(/100%.*stated.*99\.99%/i),
      expect.stringMatching(/legacy.*patent.*China.*USA/i),
      expect.stringMatching(/Warranty.*3 years/i)
    ]));
    expect(product.features).toHaveLength(7);
  });

  it('keeps recovered residential features scoped to the face variant and corrected source evidence', () => {
    for (const product of products) {
      expect(product.functionalFeatures.length, product.sku).toBeGreaterThanOrEqual(13);
      expect(product.functionalFeatures.join(' '), product.sku).toMatch(/phosphor bronze.*silver-alloy/i);
      expect(product.functionalFeatures.join(' '), product.sku).not.toMatch(/0\.4\s?mm|brass|green.*incorrect wiring|green.*line-load/i);
    }
    expect(products.find((p) => p.sku === 'GT15').functionalFeatures.join(' ')).toMatch(/tamper-resistant/i);
    expect(products.find((p) => p.sku === 'GW20').functionalFeatures.join(' ')).toMatch(/weather-resistant/i);
    const blank = products.find((p) => p.sku === 'GL20').functionalFeatures.join(' ');
    expect(blank).toMatch(/certification.*under review/i);
    expect(blank).toMatch(/blank-face/i);
    expect(blank).not.toMatch(/UL.*certified|E504391|receptacle face/i);
  });

  it('publishes only the seven models backed by local source folders', () => {
    expect(products.map((product) => product.sku)).toEqual([
      'GF15',
      'GF20',
      'GT15',
      'GT20',
      'GW15',
      'GW20',
      'GL20'
    ]);
  });

  it('keeps FLB20 out of public pages until its assets are verified', () => {
    expect(productReviewQueue).toContainEqual(
      expect.objectContaining({ sku: 'FLB20', publish: false })
    );
  });

  it('maps every product to its own gallery and finish images', () => {
    for (const product of products) {
      const key = product.sku.toLowerCase();
      expect(productGallery(product.sku)).toHaveLength(5);
      expect(productGallery(product.sku).every((path) => path.includes(`/products/${key}-`))).toBe(true);
      expect(productGallery(product.sku)).toEqual([
        `assets/images/products/${key}-main.webp`,
        `assets/images/products/${key}-sides.webp`,
        `assets/images/products/${key}-back.webp`,
        `assets/images/products/${key}-standard-plate.png`,
        `assets/images/products/${key}-plate.webp`
      ]);
      productGallery(product.sku).forEach((path) => expect(existsSync(`public/${path}`), path).toBe(true));
      expect(productFinishImage(product.sku, 'black')).toContain(`/products/${key}-black.webp`);
    }
  });

  it('returns the placeholder for an unsupported product image role', () => {
    expect(productImage('GF15', 'bogus')).toBe('assets/images/products/product-placeholder.svg');
  });

  it('does not publish unsupported outdoor or damp-location application claims', () => {
    for (const sku of ['GW15', 'GW20']) {
      const grade = products.find((product) => product.sku === sku)?.grade;
      expect(grade).toBe('Residential & Commercial Grade');
      expect(grade).not.toMatch(/outdoor|damp/i);
    }

    expect(filterGfciProducts(products, { application: 'outdoor' })).toEqual([]);
  });

  it('filters WR products through a non-installation classification taxonomy', () => {
    expect(filterGfciProducts(products, { classification: 'wr' }).map((product) => product.sku))
      .toEqual(['GW15', 'GW20']);
  });

  it('supports combined query, amperage, variant and classification filters', () => {
    expect(filterGfciProducts(products, {
      query: 'weather',
      amperage: '20A',
      variant: 'wr',
      classification: 'wr'
    }).map((product) => product.sku)).toEqual(['GW20']);
  });

  it('publishes dimensions verified in each model\'s own artwork', () => {
    for (const sku of ['GW15', 'GL20']) {
      expect(products.find((product) => product.sku === sku)?.dimensions).toEqual({
        face: '4.53 in (115 mm)',
        width: '2.75 in (70 mm)',
        depth: '1.56 in (39.7 mm)'
      });
    }
  });

  it('stores model-scoped listing truth for the six verified models and GL20 review', () => {
    const verified = products.filter(isVerifiedListing);

    expect(verified.map((product) => product.sku)).toEqual(['GF15', 'GF20', 'GT15', 'GT20', 'GW15', 'GW20']);
    verified.forEach((product) => {
      expect(product.listing).toEqual({
        status: 'verified',
        file: 'E504391',
        reportReference: 'E504391-20210212'
      });
    });

    const gl20 = products.find((product) => product.sku === 'GL20');
    expect(gl20.listing).toEqual({ status: 'review', file: null, reportReference: null });
    expect(isVerifiedListing(gl20)).toBe(false);
  });

  it('defines the report reference literal only once in product data', () => {
    const source = readFileSync('src/data/products.js', 'utf8');
    expect(source.match(/E504391-20210212/g)).toHaveLength(1);
  });

  it('stores the archived model-specific specification differences for every published model', () => {
    const expected = {
      GF15: { amperage: '15A', nema: 'NEMA 5-15R', tamper: 'No', weather: 'No' },
      GF20: { amperage: '20A', nema: 'NEMA 5-20R', tamper: 'No', weather: 'No' },
      GT15: { amperage: '15A', nema: 'NEMA 5-15R', tamper: 'Yes', weather: 'No' },
      GT20: { amperage: '20A', nema: 'NEMA 5-20R', tamper: 'Yes', weather: 'No' },
      GW15: { amperage: '15A', nema: 'NEMA 5-15R', tamper: 'Yes', weather: 'Yes' },
      GW20: { amperage: '20A', nema: 'NEMA 5-20R', tamper: 'Yes', weather: 'Yes' },
      GL20: { amperage: '20A', nema: 'Blank Face (Dead Face)', tamper: 'No', weather: 'No' }
    };

    for (const [sku, model] of Object.entries(expected)) {
      const product = products.find((item) => item.sku === sku);
      const specifications = Object.fromEntries(product.technicalSpecifications || []);

      expect(specifications).toMatchObject({
        Standard: 'UL 943 / UL 498 / UL 1998',
        Amperage: model.amperage,
        'Rated voltage': '125V AC',
        'Working voltage': '102–132V AC',
        'Trip level': '4–6 mA · <25 ms',
        'Operating temperature': '-35°C to 66°C (-30°F to 150°F)',
        'Wiring method': 'Side wire & back wire',
        'Wire gauge': '#12–#14 AWG copper wire',
        'Application grade': 'Residential & Commercial Grade',
        'NEMA configuration': model.nema,
        'Pole & wire': '2-pole, 3-wire',
        Grounding: 'Self-grounding',
        'Tamper-resistant': model.tamper,
        'Weather-resistant': model.weather,
        Usage: 'Indoor only'
      });
    }
  });

  it('stores the archived construction and performance evidence for every published model', () => {
    for (const product of products) {
      expect(product.construction.materials).toEqual(expect.arrayContaining([
        ['Face & body', 'Thermoplastic'],
        ['Current-carrying components', '0.8 mm high-precision phosphor bronze'],
        ['Mounting yoke', '1.2 mm galvanized steel'],
        ['Flammability', 'UL 94 V-1']
      ]));
      expect(product.construction.materials).toHaveLength(6);
      expect(product.construction.performance).toEqual(expect.arrayContaining([
        ['Initial self-test', 'Within 3 seconds after power-up'],
        ['Terminal screw torque', 'Over 2 N·m'],
        ['Factory inspection', '100% automated inspection · stated qualified rate 99.99%'],
        ['Warranty', '3 years']
      ]));
      expect(product.construction.performance).toHaveLength(8);
    }
  });

  it('maps each model to its own packaging and wall-plate source images', () => {
    for (const product of products) {
      const key = product.sku.toLowerCase();
      expect(product.assets.packaging).toEqual({
        standard: `assets/images/products/${key}-package-standard-white-v1.jpg`,
        screwless: `assets/images/products/${key}-package-screwless-white-v1.jpg`,
        black: `assets/images/products/${key}-package-standard-black-v1.jpg`,
        grey: `assets/images/products/${key}-package-standard-grey-v1.jpg`,
        graphite: `assets/images/products/${key}-package-standard-graphite-v1.jpg`,
        ivory: `assets/images/products/${key}-package-standard-ivory-v1.jpg`,
        almond: `assets/images/products/${key}-package-standard-almond-v1.jpg`,
        brown: `assets/images/products/${key}-package-standard-brown-v1.jpg`
      });
      Object.values(product.assets.packaging).forEach((path) => expect(existsSync(`public/${path}`), path).toBe(true));
    }
  });

  it('uses two dedicated generated scenes for every product page after GF15', () => {
    for (const sku of ['GF20', 'GT15', 'GT20', 'GW15', 'GW20', 'GL20']) {
      const product = products.find((item) => item.sku === sku);
      const key = sku.toLowerCase();

      expect(product.assets.feature).toBe(
        `assets/images/products/${key}-feature-application-v1.jpg`
      );
      expect(product.assets.application).toBe(
        `assets/images/products/${key}-application-scene-v1.jpg`
      );
      expect(product.assets.feature).not.toBe(product.assets.gallery[4]);
      expect(product.assets.application).not.toBe(product.assets.gallery[4]);
      expect(product.assets.feature).not.toBe(product.assets.application);
    }
  });
});
