import legacyRecords from './catalog/legacy-products.json' with { type: 'json' };
import catalogueRecords from './catalog/catalogue-products.json' with { type: 'json' };
import smartSwitchMedia from './catalog/smart-switch-media.json' with { type: 'json' };
import { colors, products as gfciProducts } from './products.js';

import { catalogueDocument } from './documents.js';
import { findWallplateCertificate } from './certificates.js';
export { catalogueDocument };
const clean = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
export const modelKey = (value) => clean(value).toLowerCase().replace(/[^a-z0-9]/g, '');
export const modelSlug = (value) => clean(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const finishPalette = Object.fromEntries([
  ...colors, { slug: 'graphite', name: 'Graphite', hex: '#484A4B' }, { slug: 'gold', name: 'Gold', hex: '#cbbb82' }
].map((finish) => [finish.slug, finish]));

// Only these verified structural views belong in the USB thumbnail strip.
// Color variants remain available through finishes; packaging stays in presentation.
// Shared rear/side photographs are approved fallbacks for USB receptacles, not F4P.
const sharedUsbViews = ['430f555427db1805', 'ddf36c5c6fcae0e3'].map((id) => ({
  src: `assets/images/catalog/models/${id}.webp`, width: 800, height: 800
}));
const usbStructuralViews = new Set([
  ...sharedUsbViews.map((image) => image.src),
  ...['d93d93a37fc05d32', '9e0642bd67a45176', 'ebaf77f3a03e5a07']
    .map((id) => `assets/images/catalog/models/${id}.webp`)
]);

// Verified library order: bare white device, own rear, own sides, white plates.
// Keep finish variants in the swatches, not mixed into the product gallery.
const lightingSwitchViews = {
  DS15: ['models/50e6f2d3f5cf9b64.webp', 'models/f27fdfb77ebc422d.webp', 'models/d0d49278307b26d7.webp', 'models/bbd1ee3b3a7ef0ea.webp', 'lighting-switches/paddle-screwless-white-v1.png'],
  'DS15.3': ['models/50e6f2d3f5cf9b64.webp', 'models/dc383c22eded4661.webp', 'models/1cca0ee7ddcc8f0a.webp', 'models/bbd1ee3b3a7ef0ea.webp', 'lighting-switches/paddle-screwless-white-v1.png'],
  DS1502: ['models/9c21053579be1cac.webp', 'models/f5bff2d649a9a069.webp', 'lighting-switches/ds1502-side-v1.png', 'lighting-switches/ds1502-standard-plate-v1.png', 'lighting-switches/ds1502-screwless-plate-v1.png'],
  DS1503: ['models/9ef60ea16e0567a5.webp', 'models/a9bd7366f5c2aaa4.webp', 'lighting-switches/ds1503-side-v1.png', 'lighting-switches/ds1503-standard-plate-v1.png', 'lighting-switches/ds1503-screwless-plate-v1.png'],
  T15: ['models/f859bb10d2d105c0.webp', 'models/f8141a47c5ffc32b.webp', 'models/40197c504db5ed01.webp', 'models/345569ec6e60fd6f.webp'],
  'T15.3': ['models/e865d6e03bd24428.webp', 'models/d0fdd5bd30be0743.webp', 'models/797c494ac3c405f7.webp', 'models/4212209407e00bbc.webp'],
};

const LABELS = {
  Model: 'Source model designation', Certification: 'Published certification', 'File No.': 'Certification file',
  'Receptacle Rating': 'Receptacle rating', 'USB Rating': 'Combined USB output',
  'USB Type': 'USB interfaces', 'Operating Temp': 'Operating temperature',
  'Wiring Method': 'Wiring method', 'Wire Gauge': 'Wire gauge', Grade: 'Application grade',
  'Pole & Wire': 'Pole & wire', 'Tamer-Resistant': 'Tamper-resistant',
  'Weather-Resistant': 'Weather-resistant', Wallplate: 'Wall plate',
  'Rating Voltage': 'Rated voltage', 'Working Voltage': 'Working voltage',
  'Trip Level': 'Trip level', 'Number of Gangs': 'Number of gangs',
  'Product Width': 'Product width', 'Product Height': 'Product height',
  Wiring: 'Wiring method', Rating: 'Device rating', 'Standard Version': 'Standard', Spec: 'Protection features',
  'Terminal Accommodation': 'Terminal accommodation', 'Mounting Type': 'Mounting type',
  'Terminal Identification': 'Terminal identification'
};

function normalizedRows(record) {
  const counts = {};
  const rows = record.rows.map(([rawLabel, rawValue]) => {
    let label = LABELS[rawLabel] || rawLabel;
    let value = clean(rawValue).replace(/℃/g, '°C').replace(/℉/g, '°F');
    if (value === 'Non') value = 'No';
    if (/^USB [AC]$/.test(rawLabel)) {
      const type = rawLabel.slice(-1);
      counts[type] = (counts[type] || 0) + 1;
      label = `USB-${type} port ${counts[type]}`;
      // USB-A does not use USB Power Delivery. Preserve the published wattage,
      // without carrying the old site's mistaken "PD" label onto a Type-A port.
      if (type === 'A') value = value.replace(/PD(?=\d)/, '');
    }
    return [label, value];
  });
  const spec = rows.find(([label]) => label === 'Protection features')?.[1];
  if (spec) {
    rows.push(['Tamper-resistant', /tamper/i.test(spec) && !/non tamper/i.test(spec) ? 'Yes' : 'No']);
    rows.push(['Weather-resistant', /weather/i.test(spec) ? 'Yes' : 'No']);
  }
  return rows;
}

function makeGroups(rows, materialRows, family) {
  const groups = [
    { title: 'Electrical & functional', rows: [] },
    { title: 'Installation & dimensions', rows: [] },
    { title: 'Compliance & application', rows: [] }
  ];
  if (family === 'wallplates') {
    groups[0].title = 'Material & finish';
    groups[1].title = 'Dimensions & fit';
  }
  for (const row of rows) {
    const label = row[0];
    const index = /certification|standard|model|application|resistant|usage|warranty/i.test(label) ? 2
      : /wiring|wire|ground|nema|plate|width|height|depth|thickness|weight|gang|dimension/i.test(label) ? 1 : 0;
    groups[index].rows.push(row);
  }
  if (materialRows.length) groups.push({ title: 'Materials & construction', rows: materialRows });
  return groups.filter((group) => group.rows.length);
}

const familyStories = {
  'usb-outlets': {
    heading: 'Charging, built into the wall.',
    applicationHeading: 'Power and charging, in the same place.',
    applications: [
      ['Homes & hospitality', 'Keep everyday device charging close to desks, bedsides and shared living spaces.'],
      ['Workplaces & shared spaces', 'Select the port layout and charging profile to suit the devices people use.'],
      ['Before installation', 'Check the receptacle rating, available wall-box space and local installation requirements.']
    ]
  },
  receptacles: {
    heading: 'Power, matched to the installation.',
    applicationHeading: 'Choose the face, rating and wiring you need.',
    applications: [
      ['Match the load', 'Use the voltage, current and configuration published for this exact model.'],
      ['Match the installation', 'Check the listed wiring method, conductor size and enclosure requirements.'],
      ['Coordinate the finish', 'Pair the device with a compatible wall plate and the approved project finish.']
    ]
  },
  'lighting-switches': {
    heading: 'Everyday control, clearly specified.',
    applicationHeading: 'Switching that fits the room and circuit.',
    applications: [
      ['Circuit configuration', 'Select single-pole or multi-location control from the model specification.'],
      ['Load compatibility', 'Review the published voltage and load limits before specifying the switch.'],
      ['Coordinated presentation', 'Match the paddle or toggle opening with the correct wall plate.']
    ]
  },
  wallplates: {
    heading: 'The finishing detail.',
    applicationHeading: 'Complete a coordinated device installation.',
    applications: [
      ['Opening & gang count', 'Choose the opening pattern and number of gangs to match the installed devices.'],
      ['Surface & fixing', 'Keep glossy, matte, screw-fixed and screwless versions distinct when ordering.'],
      ['Fit review', 'Check the model drawing and outside dimensions before approving the plate.']
    ]
  },
  gfci: {
    heading: 'Protection, clearly documented.',
    applicationHeading: 'Review the model before specification.',
    applications: [
      ['Model selection', 'Compare the exact face configuration and protection features.'],
      ['Installation review', 'Use the approved instructions and confirm the application requirements.'],
      ['Documentation', 'Request the model-specific listing scope before purchase.']
    ]
  },
  dimmers: {
    heading: 'Lighting control, matched to the load.',
    applicationHeading: 'Choose the right dimming method.',
    applications: [
      ['Control method', 'Phase dimming and 0–10V control are different systems. Match this model to the lamp or driver.'],
      ['Load review', 'Check the separate LED, CFL and incandescent limits where specified. Do not use one load rating for every lamp type.'],
      ['Circuit planning', 'Confirm the supply, wiring configuration and multi-location requirements with the installer.']
    ]
  },
  'smart-switches': {
    heading: 'Control, configured for your project.',
    applicationHeading: 'Match the network and the wiring.',
    applications: [
      ['Wiring first', 'Neutral-required and single-live-wire models are separate configurations. Check the existing wiring before selection.'],
      ['Control system', 'Select Wi-Fi, Zigbee or touch-only control as specified for this exact model. Zigbee models require a compatible gateway.'],
      ['Load & format', 'Check the published load limits, number of controls and US or EU face format before ordering.']
    ]
  }
};

function describeLegacy(record, rows) {
  const values = new Map(rows);
  const rawModel = record.model;
  const sku = rawModel.replace(/\s+/g, '-') + (record.breadcrumb.includes('Matte Finish') && !/ M$/.test(rawModel) ? '-M' : '');
  if (record.title) return { sku, slug: modelSlug(sku), group: record.group, name: record.title, summary: record.summary, keyFacts: record.keyFacts };
  const rating = values.get('Receptacle rating') || values.get('Input rating') || values.get('Device rating') || values.get('Amperage') || values.get('Rated voltage');
  const amp = rating?.match(/\d+\s?A/)?.[0] || '';
  const ports = rows.filter(([label]) => /^USB-[AC] port/.test(label));
  const portNames = ports.map(([label]) => label.startsWith('USB-A') ? 'USB-A' : 'USB-C');
  const portType = record.model === 'F4P' ? '4 × USB-A'
    : portNames.length === 2 && portNames[0] === portNames[1] ? `Dual ${portNames[0]}` : portNames.join(' + ');
  let group, name, summary, facts;
  if (record.family === 'usb-outlets') {
    const pd = rawModel.match(/(?:AC|DC)(\d+)W/)?.[1];
    group = rawModel === 'F4P' ? '4-port USB' : pd ? `PD ${pd}W` : `${Number(rawModel.match(/(\d{4})$/)?.[1]) / 1000}A USB`;
    const output = values.get('Combined USB output') || `USB-C up to ${pd}W`;
    name = rawModel === 'F4P' ? '4-Port USB-A Wall Charger' : `${amp} ${portType} Outlet · ${pd ? `PD ${pd}W` : group.replace(' USB', '')}`;
    summary = rawModel === 'F4P'
      ? 'Four USB-A charging ports in a decorator-format wall device, with a published combined output of 4.2A at 5V DC.'
      : `${rating}. ${portType} charging with ${output}. ${values.get('Tamper-resistant') === 'Yes' ? 'Tamper-resistant receptacle' : 'Receptacle'} with ${clean(values.get('Wiring method')).toLowerCase()}.`;
    facts = [[rawModel === 'F4P' ? 'Input' : 'Receptacle', rating], ['Charging', output], ['Interfaces', portType], ['Variant', values.get('Tamper-resistant') === 'Yes' ? 'Tamper-resistant' : 'USB charger']];
  } else if (record.family === 'wallplates') {
    const surface = record.breadcrumb.includes('Matte Finish') ? 'Matte' : 'Glossy';
    const fixing = record.breadcrumb.includes('Without Screws') ? 'Screwless' : 'Screw-fixed';
    const shape = { BS1804: 'Duplex', BS1805: 'Extension', BS1806: 'Toggle', BS1807: 'Blank', BS1802: 'Mid-Size Decorator' }[rawModel] || 'Decorator';
    group = `${surface} · ${fixing}`;
    name = `${values.get('Number of gangs')}-Gang ${surface} ${shape} ${fixing === 'Screwless' ? 'Screwless ' : ''}Wall Plate`;
    summary = `${surface} ${shape.toLowerCase()} wall plate with ${fixing.toLowerCase()} presentation. ${values.get('Product width')} wide × ${values.get('Product height')} high.`;
    facts = [['Opening', shape], ['Gangs', values.get('Number of gangs')], ['Surface', surface], ['Fixing', fixing]];
  } else if (record.family === 'lighting-switches') {
    const circuit = { DS15: 'Single pole', 'DS15.3': '3-way', DS1502: '2 single-pole rockers', DS1503: '3 single-pole rockers', T15: 'Single pole', 'T15.3': '3-way' }[rawModel];
    const names = { DS15: 'Single-Pole Paddle Switch', 'DS15.3': '3-Way Paddle Switch', DS1502: 'Double Paddle Combination Switch', DS1503: 'Triple Paddle Combination Switch', T15: 'Single-Pole Toggle Switch', 'T15.3': '3-Way Toggle Switch' };
    group = rawModel.startsWith('T') ? 'Toggle switches' : 'Paddle switches';
    name = `${amp} ${names[rawModel]}`;
    summary = `${rating}. ${circuit} control with ${values.get('Wiring method').toLowerCase()}. ${values.get('Published certification')} is the certification identified on the original model page.`;
    facts = [['Rating', rating], ['Circuit', circuit], ['Wiring', values.get('Wiring method')], ['Published certification', values.get('Published certification')]];
  } else if (record.family === 'gfci') {
    group = rawModel.startsWith('GTN') ? 'Industrial GFCI' : 'Archived model reference';
    const referenceOnly = rawModel === 'FLB20';
    name = referenceOnly ? 'GFCI Model Reference · Specifications Under Review' : `${amp} Industrial Tamper-Resistant GFCI`;
    summary = referenceOnly
      ? 'FLB20 is retained as a local reference only. Conflicting voltage and receptacle-configuration entries in the old source must be resolved before this model is specified.'
      : `${amp}, 125V industrial-grade GFCI with a nylon face and body, tamper-resistant shutters and the ${values.get('NEMA')} configuration. The catalogue specifies no feed-through terminals.`;
    facts = referenceOnly ? [['Status', 'Specification review required'], ['Certification', 'Not listed in source']]
      : [['Rating', `${amp} · 125V AC`], ['Configuration', `NEMA ${values.get('NEMA')}`], ['Variant', 'Tamper-resistant · non-WR'], ['Feed-through', 'No terminals — catalogue p.6']];
  } else {
    group = record.breadcrumb.split('/').at(-2)?.trim() || record.family;
    const variant = [values.get('Tamper-resistant') === 'Yes' && 'TR', values.get('Weather-resistant') === 'Yes' && 'WR'].filter(Boolean).join(' + ') || 'Standard';
    const descriptions = { DS15: 'Single-Pole Paddle Switch', 'DS15.3': '3-Way Paddle Switch', DS1502: 'Double Paddle Combination Switch', DS1503: 'Triple Paddle Combination Switch', T15: 'Single-Pole Toggle Switch', 'T15.3': '3-Way Toggle Switch' };
    if (record.family === 'receptacles' && rawModel.endsWith('-C')) group = 'C-series Duplex Receptacle';
    if (/^CR\d+$/.test(rawModel)) group = '250V Duplex Receptacle';
    if (rawModel === 'CD20') group = 'Specialty Duplex Receptacle';
    name = descriptions[rawModel] || `${amp} ${variant === 'Standard' ? '' : `${variant} `}${group}`;
    summary = `${sku}: ${group.toLowerCase()}. ${rows.filter(([label]) => /^(device rating|receptacle rating|rated voltage|amperage|wiring method)$/i.test(label)).map(([, value]) => value).join(' · ')}.`;
    facts = [['Rating', rating], ['Configuration', values.get('NEMA') || values.get('Pole & wire')], ['Variant', variant], ['Application', values.get('Application grade')]];
  }
  return { sku, slug: modelSlug(sku), group, name: clean(name), summary, keyFacts: facts.filter(([, value]) => value) };
}

function legacyProduct(record) {
  const rows = normalizedRows(record);
  const notes = [...(record.notes || [])];
  const referencePages = [...(record.referencePages || [])];
  let reviewNotice = record.reviewNotice;
  const draft = record.model === 'FLB20';
  if (draft) {
    reviewNotice = 'LOCAL REFERENCE ONLY — voltage, operating range, NEMA configuration and installation environment conflict in the source. Do not use this page as an installation specification.';
    for (const row of rows) {
      if (['Rated voltage', 'Working voltage', 'NEMA', 'Usage'].includes(row[0])) row[1] += ' — UNCONFIRMED legacy entry';
    }
    notes.push('The original FLB20 page and product photograph show a 250V device, but the table also states a 102–132V working range, NEMA 5-20R and outdoor/indoor usage without WR. These entries must not be treated as a validated configuration. No certification is stated. The page is excluded from the public catalogue and deployment routes.');
  }
  if (/^GTN(?:15|20)$/.test(record.model)) {
    referencePages.push(6);
    rows.push(['Feed-through terminals', 'None — product catalogue page 6']);
    const usage = rows.find(([label]) => label === 'Usage');
    if (usage) usage[1] = 'Confirm the approved enclosure and installation environment; non-WR device';
    reviewNotice = 'Industrial model: catalogue specifies no feed-through terminals. Conflicting legacy drawings are withheld; request the approved drawing, exact listing scope and enclosure requirements before ordering.';
    notes.push('The legacy introduction mentions 20A feed-through, but both its industrial feature list and the supplied catalogue state no feed-through terminals. The catalogue is used here. Do not substitute a residential GFCI wiring diagram.');
    notes.push('The legacy model drawing also prints “20A Feed-Through” on the device face, so it is withheld as an installation reference. Request an approved model-specific drawing to confirm dimensions and terminals.');
    notes.push('The August 16, 2022 E504391-20210212 addendum lists GTN15 and GTN20 as tamper-resistant GFCIs with no feed-through. Confirm current listing status and coverage for the ordered configuration.');
  }
  if (record.family === 'wallplates') {
    const surface = record.breadcrumb.includes('Matte Finish') ? 'Matte' : 'Glossy';
    rows.push(['Surface finish', surface]);
    for (const entry of record.materials.filter((value) => /^(?:Construction|Standard|Application|Orientation|Operating Temperature|Country of Origin):/i.test(value))) {
      const [label, ...value] = entry.split(':');
      rows.push([label === 'Construction' ? 'Published construction material' : label, clean(value.join(':')).replace(/℃/g, '°C').replace(/℉/g, '°F').replace(/;$/, '')]);
    }
    const modelRow = rows.find(([label]) => label === 'Source model designation');
    if (modelRow && modelRow[1] !== record.model) {
      notes.push(`The legacy table repeats ${modelRow[1]} in its model row. The page heading, gang count and product catalogue identify this plate as ${record.model}.`);
      modelRow[1] = record.model;
    }
    if (surface === 'Matte' && !/ M$/.test(record.model)) notes.push('The -M suffix on this website distinguishes the matte page from the glossy page. The original site uses the same base model designation for both finishes; specify the surface finish on the order.');
    referencePages.push(['BS1804', 'BS1805', 'BS1806', 'BS1807'].includes(record.model) ? 29 : 28);
    notes.push('Dimensions and weight follow this exact model’s legacy specification table and drawing. Do not substitute the dimensions of a screw-fixed plate for the screwless version.');
  }
  if (record.family === 'lighting-switches') {
    referencePages.push(25);
    if (record.model === 'DS15') {
      rows.find(([label]) => label === 'Source model designation')[1] = 'DS15';
      notes.push('The legacy DS15 table repeats DS15.3 in its model row. The page title, single-pole description and catalogue identify this model as DS15; DS15.3 is the separate 3-way model.');
    }
    if (['DS1502', 'DS1503'].includes(record.model)) {
      notes.push('This is a multi-rocker combination switch in a single-gang device opening, not a two- or three-gang wall plate. The original model page identifies ETL certification; a UL certificate for another switch must not be substituted.');
    }
  }
  if (record.model === 'CD20') {
    reviewNotice = 'Confirm voltage and plug configuration before specification: the original CD20 sources conflict.';
    const publishedRating = rows.find(([label]) => label === 'Device rating');
    if (publishedRating) {
      publishedRating[0] = 'Legacy rating entry — requires confirmation';
      rows.push(['Device rating', '20A · voltage / plug configuration requires confirmation']);
    }
    const nema = rows.find(([label]) => label === 'NEMA');
    if (nema) nema[1] = 'Legacy page states 5-20R — confirmation required';
    notes.push('The CD20 legacy description states 125V / NEMA 5-20R, while its table states 125V/250V and the product image shows a different slot pattern. Do not select a supply voltage or plug from this inconsistent source; request an approved CD20 drawing and rating before purchase.');
  }
  // The old F4P page has a contradictory 2.5V entry. The supplied catalogue p.10
  // explicitly identifies F4P as a 5V / 4.2A / 21W charger, not an AC receptacle.
  if (record.model === 'F4P') {
    rows.splice(rows.findIndex(([label]) => label === 'Combined USB output'), 1, ['Combined USB output', '5V DC · 4.2A · 21W']);
    const rating = rows.find(([label]) => label === 'Receptacle rating');
    if (rating) rating[0] = 'Input rating';
    notes.push('F4P output follows the supplied product catalogue (page 10): 5V DC, 4.2A, 21W. The legacy page contains a conflicting 2.5V entry.');
    referencePages.push(10);
  }
  const pdWattage = record.model.match(/(?:AC|DC)(20|36|65)W/)?.[1];
  if (record.family === 'usb-outlets' && pdWattage) {
    const profiles = {
      20: '5V / 3A · 9V / 2.22A · 12V / 1.67A',
      36: '5V / 3A · 9V / 3A · 12V / 3A · 15V / 2.4A · 20V / 1.8A',
      65: '5V / 3A · 9V / 3A · 12V / 3A · 15V / 3A · 20V / 3.25A'
    };
    rows.push(['USB-C output profiles', profiles[pdWattage]]);
    if (record.model.includes('AC')) rows.push(['USB-A output profiles', '5V / 3A · 9V / 2A · 12V / 1.5A (18W max)']);
    referencePages.push(11);
  }
  const description = describeLegacy(record, rows);
  const values = new Map(rows);
  const file = values.get('Certification file') || record.features.join(' ').match(/E\d{6}/)?.[0];
  const certImages = { 'usb-outlets': ['E498095', 'ul-usb'], receptacles: ['E498095', 'ul-receptacle'] };
  const wallplateReference = record.family === 'wallplates' ? findWallplateCertificate(record.model) : null;
  const certificate = file ? {
    file,
    label: `${values.get('Published certification') || 'Published certification'} · file ${file}`,
    image: wallplateReference?.file === file ? wallplateReference.image : certImages[record.family]?.[0] === file ? `assets/images/certs/${certImages[record.family][1]}.webp` : null
  } : null;
  const photoCorrection = catalogueRecords.find((item) => item.imageOnly && item.gallery.length > 0 && item.model === record.model && item.family === record.family);
  const gallery = photoCorrection ? [...photoCorrection.gallery, ...record.gallery.filter((image) => !photoCorrection.gallery.some((photo) => photo.src === image.src))] : record.gallery;
  const primaryIndex = photoCorrection ? 0 : record.primaryIndex ?? (record.family === 'usb-outlets' && record.model !== 'F4P' ? Math.min(2, gallery.length - 1) : 0);
  const hero = gallery[primaryIndex];
  const materialRows = record.materials.filter((value) => /^(?:Material:|[\d.]+\s?mm|Silver alloy|Coated PC|Environmental\s*:|Front Cover\/Body:|Operation Temperature:|Yoke:|Clamps:|Terminal Screws:)/i.test(value))
    .map((value, index) => {
      const entry = value.replace(/ with 30 silver layer thick/i, '').replace(/;\s*$/, '').replace(/℃/g, '°C');
      const split = entry.indexOf(':');
      return split > -1 ? [entry.slice(0, split).trim(), entry.slice(split + 1).trim()] : [`Construction detail ${index + 1}`, entry];
    });
  const warrantySource = [...record.features, ...record.materials].find((value) => /Warranty(?: for|:)?\s*\d+[\s-]+years?/i.test(value));
  const warranty = warrantySource?.match(/(\d+)[\s-]+years?(?:\s+(limited))?/i);
  const warrantyValue = warranty ? `${warranty[1]} years${warranty[2] ? ' limited' : ''}` : null;
  if (warrantyValue) rows.push(['Warranty', warrantyValue]);
  if (record.family === 'usb-outlets' && record.model !== 'F4P') {
    notes.push(record.model.includes('QC')
      ? 'USB-C values are published single-port maximums, not a promise that both ports supply their maximum simultaneously. Output depends on the connected device, cable and negotiated profile; confirm dual-port power sharing before ordering.'
      : 'The combined USB output is shared across the charging ports. Individual port limits are listed separately and must not be added together.');
  }
  const finishRecord = catalogueRecords.find((item) => item.family === record.family && modelKey(item.model) === modelKey(description.sku));
  const smartMedia = record.family === 'smart-switches' ? smartSwitchMedia[record.model] : null;
  const finishNames = record.family === 'smart-switches'
    ? record.model.startsWith('EU') ? ['black', 'white', 'gold', 'grey'] : ['black', 'white', 'grey', 'gold'] : [];
  const finishImages = smartMedia?.finishes || finishRecord?.finishImages
    || (finishNames.length ? finishNames.map((slug, index) => ({ slug, ...gallery[index] }))
      : /^GTN(?:15|20)$/.test(record.model) ? [{ slug: 'black', ...hero }] : []);
  const finishes = finishImages.map(({ slug, src }) => ({ ...finishPalette[slug], image: src }));
  const usbPlates = record.family === 'usb-outlets' ? ['standard', 'screwless'].map((plate) => ({
    src: `assets/images/catalog/usb-plates/${description.slug}-${plate}-v1.png`, width: 800, height: 800
  })) : [];
  const dimmerScrewless = record.family === 'dimmers' ? {
    src: `assets/images/catalog/dimmers/${description.slug}-screwless-plate-v1.png`, width: 800, height: 800
  } : null;
  const dimmerPackage = dimmerScrewless ? {
    ...dimmerScrewless, src: `assets/images/catalog/dimmers/${description.slug}-screwless-package-v1.png`,
    caption: 'Screwless plate · packaged'
  } : null;
  const lightingViews = record.family === 'lighting-switches' ? lightingSwitchViews[record.model]?.map((path) => ({
    src: `assets/images/catalog/${path}`, width: 800, height: 800
  })) : null;
  const productViews = lightingViews || (smartMedia ? smartMedia.gallery : record.family === 'usb-outlets'
    ? [finishImages.find((finish) => finish.slug === 'white') || hero,
      ...gallery.filter((image) => usbStructuralViews.has(image.src)),
      ...(record.model === 'F4P' ? [] : sharedUsbViews.filter((shared) => !gallery.some((image) => image.src === shared.src))),
      ...usbPlates]
    : dimmerScrewless ? [...gallery.slice(0, 2), dimmerScrewless, gallery[2], dimmerPackage, ...gallery.slice(3)] : gallery);
  const primaryView = lightingViews || smartMedia || record.family === 'usb-outlets' ? productViews[0] : hero;
  const drawings = smartMedia?.drawings || record.drawings;
  const detailViews = smartMedia?.detailViews || [];
  const presentation = dimmerPackage
    ? [dimmerPackage, { ...gallery[2], caption: 'Standard screw plate · packaged' }]
    : record.presentationIndices ? record.presentationIndices.map((index) => gallery[index])
      : record.family === 'usb-outlets' && record.model !== 'F4P' ? record.gallery.slice(0, 2) : [];
  const features = description.keyFacts.map(([label, value]) => `${label}: ${value}`);
  if (values.get('Wiring method') && !description.keyFacts.some(([label]) => label === 'Wiring')) features.push(`Wiring: ${values.get('Wiring method')}`);
  if (warrantyValue) features.push(`Warranty: ${warrantyValue}`);
  if (/^GTN(?:15|20)$/.test(record.model)) features.push('Nylon front cover, body and buttons', 'PCB designed for vibration and high-frequency interference resistance');
  return {
    ...description, line: record.family, sourceModel: record.model, sourceUrl: record.sourceUrl,
    sources: [...(record.sourceUrl ? [{ label: 'Original model specifications', href: record.sourceUrl, kind: 'website' }] : []),
      ...[...new Set(referencePages)].map((page) => ({ label: `Product catalogue · page ${page}`, href: `${catalogueDocument}#page=${page}`, kind: 'catalogue' }))],
    ...familyStories[record.family],
    specificationGroups: makeGroups([['Model', description.sku], ...rows], materialRows, record.family),
    specificationSummary: description.keyFacts,
    features, finishes, certificate,
    certificationLabel: draft ? 'No certification stated in the source' : /^GTN/.test(record.model) ? 'E504391 · August 16, 2022 addendum · confirm current coverage' : certificate?.label || 'Model-specific documentation available on request',
    notes, reviewNotice, draft,
    assets: {
      hero: primaryView.src, card: primaryView.src, gallery: productViews.map((image) => image.src),
      imageSizes: Object.fromEntries([...gallery, ...drawings, ...finishImages, ...productViews, ...presentation, ...detailViews].map((image) => [image.src, [image.width, image.height]])),
      finishes: Object.fromEntries(finishes.map((finish) => [finish.slug, finish.image])),
      detail: lightingViews ? lightingViews[1].src : smartMedia ? detailViews[0].src : record.detailIndex != null ? gallery[record.detailIndex]?.src : gallery.find((image) => /430f555427db1805|9e0642bd67a45176/.test(image.src))?.src || gallery[Math.min(primaryIndex + 1, gallery.length - 1)]?.src,
      detailViews,
      drawings: draft ? [] : drawings,
      presentation
    }
  };
}

export const catalogProducts = [...legacyRecords, ...catalogueRecords.filter((record) => !record.imageOnly)]
  .filter((record) => !gfciProducts.some((product) => record.family === 'gfci' && product.sku === record.model))
  .map(legacyProduct)
  .sort((a, b) => {
    const usbGroups = ['3.1A USB', '3.6A USB', '4.2A USB', '5A USB', 'PD 20W', 'PD 36W', 'PD 65W', '4-port USB'];
    if (a.line === 'usb-outlets' && b.line === 'usb-outlets' && a.group !== b.group) return usbGroups.indexOf(a.group) - usbGroups.indexOf(b.group);
    if (a.line === 'smart-switches' && b.line === 'smart-switches') {
      const formatRank = (sku) => sku.startsWith('US') ? 0 : sku.startsWith('EU') ? 1 : 2;
      const formatOrder = formatRank(a.sku) - formatRank(b.sku);
      if (formatOrder) return formatOrder;
    }
    return a.line.localeCompare(b.line) || a.group.localeCompare(b.group, 'en', { numeric: true }) || a.sku.localeCompare(b.sku, 'en', { numeric: true });
  });

export const productHref = (product) => `/products/${product.line}/${product.slug}`;

export function getCatalogProducts(line) {
  return catalogProducts.filter((product) => product.line === line && !product.draft);
}

export function findCatalogProduct(line, slug) {
  const key = modelKey(slug);
  return catalogProducts.find((product) => product.line === line && (!product.draft || import.meta.env?.DEV)
    && [product.slug, product.sku].some((value) => modelKey(value) === key));
}

export function filterCatalogProducts(products, { query = '', group = '' } = {}) {
  const queryKey = modelKey(query);
  return products.filter((product) => (!group || product.group === group)
    && (!queryKey || modelKey([product.sku, product.name, product.group, product.summary].join(' ')).includes(queryKey)));
}
