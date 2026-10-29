/**
 * FAHINT company facts — single source of truth.
 *
 * Use these values in page copy, structured data, quotations and trade material.
 * Rules: numbers carry units; area is given in both metric and imperial; one fact, one value.
 *
 * Confirmed 2026-10-29: factory area 3,600 m², 100 employees, postal code 325600,
 * first-pass yield 98%. Retired: 70,000 sq ft, 12 inspection lines, US warehouse claims,
 * 2.5 million unit output. Do not reintroduce them.
 */
export const companyFacts = {
  legalName: 'Wenzhou Fahint Electric Co., Ltd.',
  brand: 'FAHINT',
  foundedYear: 2015,

  address: {
    streetAddress: 'Floor 3, 4, 5, No. 130 Xinguang Avenue, Xinguang Industrial Zone, Liushi Town',
    addressLocality: 'Yueqing, Wenzhou',
    addressRegion: 'Zhejiang',
    postalCode: '325600',
    addressCountry: 'CN'
  },

  production: {
    floorAreaSqm: 3600,
    ownedLines: 4,
    machines: 29,
    maxCapacityUnitsPerYear: 9000000,
    port: 'Ningbo'
  },

  output: {
    gfciUnitsLastYear: 1800000,
    gfciMaxUnitsPerYear: 2900000
  },

  markets: {
    northAmerica: 70, // %
    domestic: 18, // %
    southAmerica: 12, // %
    yearsExporting: 11
  },

  quality: {
    qcInspectors: 5,
    testEquipment: 4,
    qcProcessSteps: 3,
    firstPassYield: 98 // % final-assembly first-pass yield, rolling 12 months
  },

  oem: {
    years: 10,
    newModelsPerYear: 5,
    ownBrands: 1,
    services: ['OEM Service Offered', 'Design Service Offered', 'Buyer Label Offered']
  },

  rnd: {
    engineers: 2
  },

  workforce: {
    employees: 100
  },

  trade: {
    paymentTerms: ['T/T'],
    annualRevenueUsd: { min: 2500000, max: 5000000, internalOnly: true }
  },

  certifications: [
    { code: 'ISO 9001', reference: '00225Q31531R1S/3302', scope: 'Design and production of export low-voltage wall sockets, GFCI outlets and USB outlets' },
    { code: 'ETL', reference: '2504020GZU-001', scope: 'AC only flush switch' },
    { code: 'UL', reference: 'E510871-20241010', scope: 'Certificates / test reports' },
    { code: 'UL', reference: 'E496095-20190420', scope: 'Receptacles for plugs and attachment plugs' },
    { code: 'UL', reference: 'E496095-20210723', scope: 'Receptacles for plugs and attachment plugs' },
    { code: 'UL / cUL', reference: 'E504391', scope: 'GFCI models GF15/GF20/GT15/GT20/GW15/GW20 (addendum E504391-20210212)' },
    { code: 'US Patent', reference: 'GFCI mechanism', scope: 'Patented trip mechanism' },
    { code: 'CN Patent', reference: 'PCB architecture', scope: 'Patented GFCI circuit layout' }
  ]
};

/** Area in both units, so a small metric number never appears alone. */
export const areaText = () => {
  const sqm = companyFacts.production.floorAreaSqm;
  const sqft = Math.round((sqm * 10.7639) / 100) * 100;
  return `${sqm.toLocaleString('en-US')} m² (${sqft.toLocaleString('en-US')} sq ft)`;
};

/** Fixed way of stating shop-floor scale, so pages cannot drift apart. */
export const floorText = () => {
  const { ownedLines, machines } = companyFacts.production;
  return `${ownedLines} owned production lines and ${machines} machines`;
};

/** GFCI output: keep actual output and capacity ceiling separate. */
export const gfciOutputText = () => {
  const { gfciUnitsLastYear, gfciMaxUnitsPerYear } = companyFacts.output;
  return `${(gfciUnitsLastYear / 1e6).toFixed(1)} million GFCI units produced last year, with capacity for ${(gfciMaxUnitsPerYear / 1e6).toFixed(1)} million`;
};

/** One-line quality statement for the homepage and product pages. */
export const qualityText = () => {
  const { qcInspectors, testEquipment, firstPassYield } = companyFacts.quality;
  return `${qcInspectors} QC inspectors, ${testEquipment} test stations, ${firstPassYield}% first-pass yield`;
};

/**
 * Retired claims. Remove them from every page; do not rephrase and keep.
 */
export const removedClaims = [
  {
    claim: 'Factory area 70,000 sq ft',
    reason: 'Contradicts 3,600 m² (about 38,750 sq ft). Two areas on one site invite the question.',
    replaceWith: 'areaText()'
  },
  {
    claim: '12 Automated Inspection Lines',
    reason: 'Shop floor is four owned lines, 29 machines and four test stations.',
    replaceWith: 'floorText()'
  },
  {
    claim: 'US Warehouse, 10-Day Delivery',
    reason: 'No verifiable warehouse entity or address behind the promise; fails at the quotation stage.',
    replaceWith: 'Removed. If a warehouse exists, name the operator, address and scope.'
  },
  {
    claim: 'GFCI annual production 2.5 million',
    reason: 'Actual output is 1.8 million units; capacity ceiling is 2.9 million.',
    replaceWith: 'gfciOutputText()'
  },
  {
    claim: 'Approved ALDI Supplier / a decade of zero Category A complaints',
    reason: 'Naming a customer may breach a confidentiality clause; the record cannot be verified externally.',
    replaceWith: 'Drop the customer name; keep only a dated, verifiable statement if one exists.'
  },
  {
    claim: '6-Hour Engineering Response',
    reason: 'Two R&D engineers cannot sustain a six-hour turnaround; the claim contradicts the team size.',
    replaceWith: 'Two R&D engineers; technical answers within 24 hours.'
  }
];

export default companyFacts;
