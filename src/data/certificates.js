// Certificate scans rendered from the PDFs in the company asset folder.
export const certificates = [
  {
    slug: 'ul-gfci',
    family: 'gfci',
    name: 'UL — GFCI Receptacles',
    file: 'E504391',
    report: 'E504391-20210212',
    detail: 'UL 943 5th Ed. · Class A ground-fault circuit interrupters',
    image: 'assets/images/certs/ul-gfci.webp',
    document: 'assets/documents/certificates/ul-gfci.pdf',
    issued: 'August 16, 2022',
    models: ['GF15', 'GF20', 'GT15', 'GT20', 'GTN15', 'GTN20', 'GW15', 'GW20'],
    modelPages: [2, 4],
    scope: 'GF15, GF20, GT15, GT20, GTN15, GTN20, GW15 and GW20. See the original addendum for designations.'
  },
  {
    slug: 'ul-receptacle',
    family: 'receptacles',
    name: 'UL — Standard Receptacles',
    file: 'E498095',
    report: 'E498095-20211123',
    detail: 'UL 498 · Attachment plugs and receptacles',
    image: 'assets/images/certs/ul-receptacle.webp',
    document: 'assets/documents/certificates/ul-receptacle.pdf',
    issued: 'December 13, 2021',
    models: ['D15', 'D15Q', 'D20', 'DT15', 'DT15Q', 'DT20', 'DW15', 'DW15Q', 'DW20', 'R15', 'R15Q', 'R20', 'RT15', 'RT15Q', 'RT20', 'RW15', 'RW15Q', 'RW20'],
    modelPages: [2, 4],
    scope: 'D15/D20 and R15/R20 series, including the Q, TR and WR variants listed in the original addendum.'
  },
  {
    slug: 'ul-usb',
    family: 'usb-outlets',
    name: 'UL — USB Outlets',
    file: 'E498095',
    report: 'E498095-20180426',
    detail: 'USB charger receptacles · See the model-specific addendum',
    image: 'assets/images/certs/ul-usb.webp',
    document: 'assets/documents/certificates/ul-usb.pdf',
    issued: 'April 26, 2022',
    models: ['FTR15', 'FTR15-3100', 'FTR15-3600', 'FTR15C', 'FTR15C-3100', 'FTR15C-3600', 'FTR15DC', 'FTR15DC-3100', 'FTR15DC-3600', 'FTR15QC', 'FTR20', 'FTR20-3100', 'FTR20-3600', 'FTR20C', 'FTR20C-3100', 'FTR20C-3600', 'FTR20DC', 'FTR20DC-3100', 'FTR20DC-3600', 'FTR20QC'],
    modelPages: [2, 3, 5, 6],
    scope: 'FTR15 and FTR20 families, including C, DC and QC designations. Confirm the exact suffix in the original addendum.'
  },
  {
    slug: 'ul-wallplate',
    family: 'wallplates',
    name: 'UL — Wallplates',
    file: 'E501377',
    report: 'E501377-20230919',
    detail: 'UL 514D · Nonmetallic flush device cover plates',
    image: 'assets/images/certs/ul-wallplate.webp',
    document: 'assets/documents/certificates/ul-wallplate.pdf',
    issued: 'September 25, 2023',
    models: ['BS1806', 'BS1807', 'BS18012', 'BS18013', 'BS18014', 'BS18032', 'BS18033', 'BS18034'],
    modelPages: [2, 4],
    scope: 'Base models BS1806, BS1807, BS18012, BS18013, BS18014, BS18032, BS18033 and BS18034. Confirm finish designations and current coverage for the ordered configuration; other models require their corresponding documentation.'
  },
  {
    slug: 'ul-wallplate-2018',
    family: 'wallplates',
    name: 'UL — Wallplates (BS1801–BS1804)',
    file: 'E501377',
    report: 'E501377-20181016',
    detail: 'UL 514D · Nonmetallic flush device cover plates',
    image: 'assets/images/certs/ul-wallplate-2018.jpg',
    document: 'assets/documents/certificates/ul-wallplate-2018.pdf',
    issued: 'August 16, 2022',
    models: ['BS1801', 'BS1802', 'BS1803', 'BS1804'],
    modelPages: [2, 4],
    scope: 'Base models BS1801, BS1802, BS1803 and BS1804. Confirm finish designations and current coverage for the ordered configuration; other models require their corresponding documentation.'
  },
  {
    slug: 'ul-switch',
    family: 'lighting-switches',
    name: 'UL — Flush Switches',
    file: 'E528137',
    report: 'E528137-20241016',
    detail: 'UL 20 · Flush switches',
    image: 'assets/images/certs/ul-switch.webp',
    document: 'assets/documents/certificates/ul-switch.pdf',
    issued: 'October 18, 2024',
    models: ['DS15', 'DS15.3', 'T15'],
    modelPages: [2, 4],
    scope: 'DS15, DS15.3 and T15. UL 20 is the standard number, not the amperage rating.'
  },
  {
    slug: 'iso-9001',
    name: 'ISO 9001',
    file: 'Quality System',
    detail: 'Quality management system certification',
    image: 'assets/images/certs/iso-9001.webp',
    document: 'assets/documents/certificates/iso-9001.pdf',
    issued: 'March 13, 2025',
    scope: 'Design and production of export low-voltage wall sockets, GFCI outlets and USB outlets. Stated validity ends April 11, 2028, subject to surveillance audit acceptance.'
  }
];

// Match a supplied base-model reference, not current listing status or finish coverage.
export function findWallplateCertificate(model) {
  const baseModel = String(model).replace(/[ -][GM]$/i, '');
  return certificates.find(certificate => certificate.family === 'wallplates' && certificate.models?.includes(baseModel));
}

// This matches archived designations, not live certification status. Never use
// prefix/file-number matching: USB wattage suffixes and switch punctuation matter.
export function findModelCertificate(product) {
  if (product.draft || product.listing?.status === 'review') return undefined;
  const family = product.line || 'gfci';
  if (family === 'wallplates') return findWallplateCertificate(product.sku);
  return certificates.find(certificate => certificate.family === family && certificate.models?.includes(product.sku));
}

// Real photographs sliced from the supplied company detail sheets.
export const facilityShots = [
  {
    slug: 'workshop',
    title: 'Production Workshop',
    body: 'Assembly lines with GFCI 100% comprehensive test stations.',
    image: 'assets/images/company/facility-workshop.webp'
  },
  {
    slug: 'lab',
    title: 'Laboratory / Testing Room',
    body: 'Dielectric, trip-threshold and endurance testing in house.',
    image: 'assets/images/company/facility-lab.webp'
  },
  {
    slug: 'warehouse',
    title: 'Warehouse',
    body: 'Racked finished-goods storage feeding container loading.',
    image: 'assets/images/company/facility-warehouse.webp'
  },
  {
    slug: 'sampleroom',
    title: 'Sample Room',
    body: 'Full display of wiring device ranges for buyer selection.',
    image: 'assets/images/company/facility-sampleroom.webp'
  },
  {
    slug: 'office',
    title: 'Office Area',
    body: 'Sales, documentation and engineering support desks.',
    image: 'assets/images/company/facility-office.webp'
  },
  {
    slug: 'meeting',
    title: 'Meeting Room',
    body: 'Project reviews with OEM and private-label customers.',
    image: 'assets/images/company/facility-meeting.webp'
  }
];
