import legacyRecords from './catalog/legacy-products.json' with { type: 'json' };
import catalogueRecords from './catalog/catalogue-products.json' with { type: 'json' };
import smartSwitchMedia from './catalog/smart-switch-media.json' with { type: 'json' };
import { colors, products as gfciProducts } from './products.js';

import { catalogueDocument } from './documents.js';
import { findModelCertificate } from './certificates.js';
export { catalogueDocument };
// Unmodified extracts from the supplied catalog, not manuals or certificates.
const catalogSheets = {
  'FTR15QC-DC20W': { label: 'PD USB outlets · catalog sheet (PDF)', href: 'assets/documents/catalog-sheets/pd-usb-outlets.pdf', kind: 'catalogue' },
  DM2010: { label: 'DM2010 / DM2010S · catalog sheet (PDF)', href: 'assets/documents/catalog-sheets/dm2010-dm2010s.pdf', kind: 'catalogue' }
};
const clean = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
export const modelKey = (value) => clean(value).toLowerCase().replace(/[^a-z0-9]/g, '');
export const modelSlug = (value) => clean(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
// Catalogue p.17 names. Preserve the library keys and deployed URLs below.
const commercialModels = {
  'R15-C': 'C15', 'R15Q-C': 'C15Q', 'R20-C': 'C20',
  'RT15-C': 'CT15', 'RT15Q-C': 'CT15Q', 'RT20-C': 'CT20',
  'RW15-C': 'CW15', 'RW15Q-C': 'CW15Q', 'RW20-C': 'CW20'
};
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

function restoredFunctionalFeatures(record, { values, description, materialRows, warrantyValue, modelReference, file, draft }) {
  const material = new Map(materialRows);
  const wiring = values.get('Wiring method');
  const opening = description.keyFacts.find(([label]) => label === 'Opening')?.[1];
  const surface = description.keyFacts.find(([label]) => label === 'Surface')?.[1];
  const construction = values.get('Material specification') || values.get('Published construction material');
  const documentation = modelReference
    ? `Supplied ${record.family === 'wallplates' ? 'base-model ' : ''}UL / cUL documentation: file ${modelReference.file}, report ${modelReference.report} (${modelReference.issued}); confirm current coverage${record.family === 'wallplates' ? ' and the ordered finish designation' : ' for the ordered model'}.`
    : `Certification reference: ${values.get('Published certification') || 'UL / cUL'}${file ? ` · file ${file}` : ''}. The certificate for this exact model is not yet published here. Request it before specifying the product.`;
  const industrialGfci = /^GTN(?:15|20)$/.test(record.model);
  const industrialReceptacle = ['CR15', 'CR20', 'CD20'].includes(record.model);
  const corrected = value => {
    const text = clean(value).replace(/：/g, ': ').replace(/orcopper/g, 'or copper').replace(/youcan/g, 'you can')
      .replace(/Sleek Glossy FinishModern/g, 'Sleek Glossy Finish: Modern').replace(/SwitchesControl/g, 'Switches: Control')
      .replace(/SafetyFully/g, 'Safety: Fully').replace(/BuildCommercial/g, 'Build: Commercial').replace(/InstallationFits/g, 'Installation: Fits')
      .replace(/easy to clean/gi, 'easy-to-clean');
    if (draft) return `Unconfirmed legacy reference: ${text}`;
    if (/^Warranty/i.test(text)) return `Warranty: ${warrantyValue || text.replace(/^Warranty(?: for|:)?\s*/i, '')}`;

    if (industrialGfci) {
      if (/Nylon material made/i.test(text)) return 'Nylon front cover, body and buttons. For generator and lighting applications, confirm the enclosure and installation environment for this non-WR model.';
      if (/^Impact-Resistant thermoplastic/i.test(text)) return 'Impact-resistant nylon cover and body.';
      if (/^No Feed-through/i.test(text)) return 'No feed-through terminals — product catalogue page 6.';
      if (/^No power will be delivered/i.test(text)) return 'Reverse-wiring lockout: no power is delivered to the receptacle face when line-load wiring is reversed.';
      if (/^Mechanical structure/i.test(text)) return 'Published function: mechanical trip operation with the device powered off. Confirm operation in the approved model instructions.';
      if (/^Status Indicator Light/i.test(text)) return 'Status indicator light reports power and protection status.';
      if (/^Thickened silver contacts/i.test(text)) return 'Thickened silver-alloy contacts; request temperature-rise test data for the ordered model.';
      if (/^Anti-Gasoline/i.test(text)) return 'For applications exposed to gasoline or vibration, request the model-specific resistance test data.';
      if (/^Patent protected/i.test(text)) return 'Request applicable patent details for the ordered model.';
      if (/^Class A GFCI/i.test(text)) return 'Class A GFCI trip protection. Review the model-specific UL 943 documentation and approved instructions.';
    }

    if (record.family === 'usb-outlets') {
      const pd = record.model.match(/(?:AC|DC)(\d+)W/)?.[1];
      const interfaces = description.keyFacts.find(([label]) => label === 'Interfaces')?.[1];
      if (/^Residence Homelife/i.test(text)) return 'Integrated power and USB charging for residential and commercial spaces; match the device rating and protection features to the location.';
      if (/^(Commercial Offices|Education Facilities)/i.test(text)) return null;
      if (/^Smart /i.test(text)) return 'Built-in smart chip recognizes a connected device’s charging requirements and adjusts the charging output.';
      if (/^PD\d+W Quick Charging/i.test(text)) return `Quick charging: USB-C up to ${pd}W single-port maximum; confirm dual-port power sharing for the connected devices and cables.`;
      if (/^Powerful/i.test(text)) return pd
        ? `Quick charging: USB-C up to ${pd}W single-port maximum; confirm dual-port power sharing for the connected devices and cables.`
        : record.model === 'F4P'
          ? 'Powerful: Four USB-A charging ports deliver a combined 5V DC / 4.2A / 21W output.'
          : text;
      if (/^Convenient/i.test(text)) return record.model === 'F4P'
        ? 'Convenient: Charge up to four compatible USB-powered devices without separate charging adapters; this charger has no AC receptacles.'
        : 'Charge up to two compatible USB devices, leaving the AC outlets free.';
      if (/^Enhanced Safety/i.test(text)) return `Built-in protection helps prevent overheating.${values.get('Tamper-resistant') === 'Yes' ? ' Tamper-resistant shutters limit access to the receptacle contacts.' : ''}`;
      if (/^Easy Installation/i.test(text)) return `Compact design fits a standard wall box and compatible decorator or screwless wall plates. Wiring: ${wiring}. Check the approved model instructions for box clearance and terminal requirements.`;
      if (/^The future of charging/i.test(text)) return `Charging interfaces: ${interfaces}; charge compatible phones, tablets and headsets without separate power adapters, using a matching cable and charging profile.`;
      if (/^UL\/cUL Listed Compatible with USB/i.test(text)) return 'Designed for charging compatible USB devices; match the cable and charging profile to your device.';
      if (/^Tamper Resistant Outlets/i.test(text)) return 'Tamper-resistant shutter mechanism blocks access to the contacts unless a two- or three-prong plug is inserted.';
    }

    if (record.family === 'receptacles') {
      if (/^(Wide Compatibility|Standard North American Design)/i.test(text) && industrialReceptacle) return `Industrial duplex receptacle: ${values.get('Device rating')}; match the plug configuration to the ordered model photograph and approved specification.`;
      if (/^(UL\/c\(UL\)|UL Listed Safety)/i.test(text)) return `${documentation} Duplex receptacle: ${values.get('Device rating')}, NEMA ${values.get('NEMA')}; ${values.get('Application grade')}.`;
      if (/^(Dual Wiring Design|Easy Dual-Wiring|Easy Installation)/i.test(text)) return `Easy installation: ${wiring}; secure terminal connections and mounting for the matching wall plate. Confirm conductor suitability, strip length and torque in the approved model instructions.${/Q(?:-C)?$/.test(record.model) ? ' Push-in terminals: #14 AWG only, 15A terminal.' : ''}`;
      if (/^(Premium Materials|Heavy-Duty Durability|Durable Construction)/i.test(text)) return `Durable construction: flame-retardant thermoplastic housing, conductive ${material.get('Clamps') || 'model-specific current-carrying components'}, ${material.get('Yoke') || 'metal mounting yoke'}, and ${material.get('Terminal Screws') || 'model-specific terminal screws'}.${/anti-oxidation/i.test(text) ? ' Request model test data for oxidation resistance.' : ''}`;
      if (/^Built-in Safety Features/i.test(text)) return 'Built-in safety features: Green grounding screw and corrosion-resistant components; follow the exact model installation instructions.';
      if (/^Tamper-Resistant/i.test(text)) return 'Tamper-resistant (TR) design: Built-in mechanical shutters reduce access to the contacts by foreign objects.';
      if (/^Weather-Resistant/i.test(text)) return 'Weather-resistant (WR) construction; confirm the approved enclosure and installation location for the ordered device.';
      if (/^Universal Compatibility.*NEMA/i.test(text)) return `Plug compatibility: NEMA ${values.get('NEMA')} duplex configuration; select a matching plug for this exact current and voltage rating.`;
    }

    if (record.family === 'lighting-switches') {
      if (/^Break-Off Tab/i.test(text)) return 'Break-off tab for circuit splitting.';
      if (/^Dual Independent Control/i.test(text)) return 'Two independent rocker paddles control separate loads in one wall plate.';
      if (/^3 Independent Rocker Switches/i.test(text)) return `Three independent rocker switches control separate lighting or appliance loads in one single-gang wall plate; ${values.get('Device rating')}.`;
      if (/^ETL Listed/i.test(text)) return `${documentation} Dedicated green grounding screw for installation.`;
      if (/^UL Certified Safety/i.test(text)) return `${documentation} ${values.get('Device rating')}; residential and commercial lighting applications.`;
      if (/^15A 125V Rated/i.test(text)) return `Rated for ${values.get('Device rating')} residential and commercial lighting circuits; match the ordered model to the circuit.`;
      if (/^(Dual Wiring Options|Easy, Universal Installation)/i.test(text)) return `Easy installation and rework: ${wiring}; fits matching standard wall boxes. Use the conductor and terminal requirements in the approved instructions.`;
      if (/corrosion-resistant brass terminals/i.test(text)) return text.replace(/corrosion-resistant brass terminals/i, 'phosphor-bronze components and plated-steel terminal screws');
    }

    if (record.family === 'wallplates') {
      if (/^Premium (?:Flame Retardant PC Material|Fireproof & Tough PC Construction)/i.test(text)) return `Construction material: ${construction}. Request model test data for flame retardancy, impact resistance${/shatterproof/i.test(text) ? ' and shatter resistance' : ' and fade resistance'}. ${/UL/i.test(text) ? documentation : ''}`.trim();
      if (/^UL Certified/i.test(text)) return `${documentation} Confirm the material's insulation and flame-retardancy requirements against the model test documentation.`;
      if (/^(Universal Compatibility|Perfect Fit Compatibility)/i.test(text)) return `Compatibility: ${opening} format for matching switches, receptacles or wall plates; ${values.get('Number of gangs')}-gang configuration, ${values.get('Product width')} × ${values.get('Product height')}.`;
      if (/^Standard (?:Universal|1-Gang) Size/i.test(text)) return `Wall-box fit: ${values.get('Number of gangs')}-gang model, ${values.get('Product width')} × ${values.get('Product height')}; match the opening and mounting arrangement.`;
      if (/^Neat Wall Concealment/i.test(text)) return 'Blank cover for unused junction boxes.';
      if (/^Quick & Easy Installation/i.test(text)) return 'Quick installation: Matching mounting screws for this screw-fixed plate; direct mounting to a compatible junction box.';
      if (/finish/i.test(text)) return text.replace(/\b(?:glossy|matte)\b/gi, surface.toLowerCase());
    }
    if (/^UL(?:\/|[- ]|\b)/i.test(text) && /certifi|listed/i.test(text)) return documentation;
    return text;
  };

  // Old model copy is the source of features; normalized rows only correct conflicts.
  const features = record.features.map(corrected);
  if (record.family === 'usb-outlets') {
    const paragraphs = [];
    for (const value of record.materials) {
      if (/^the contacts/i.test(value) && paragraphs.length && /^Tamper Resistant/i.test(paragraphs.at(-1))) paragraphs[paragraphs.length - 1] += ` ${value}`;
      else if (/^(Smart |Powerful |Convenient |The future of charging|Enhanced Safety|Easy Installation|UL\/cUL Listed Compatible|Tamper Resistant Outlets)/i.test(value)) paragraphs.push(value);
    }
    features.push(...paragraphs.map(corrected));
  }
  if (!features.length && record.summary) features.push(record.summary);
  if (record.features.some(value => /strip[\s-]*gauge/i.test(value))) features.push('Strip-gauge markings for conductor preparation.');
  if (record.family === 'smart-switches') {
    if (values.get('Function')) features.push(`Function: ${values.get('Function')}`);
    if (/Zigbee/i.test(values.get('Control mode') || '')) features.push('Zigbee control requires a compatible gateway.');
  }
  if (record.family === 'usb-outlets' && values.get('Charging protocols')) features.push(`Charging protocols: ${values.get('Charging protocols')}`);
  if (warrantyValue && !features.some(feature => /^Warranty/i.test(feature))) features.push(`Warranty: ${warrantyValue}`);
  return [...new Set(features.filter(Boolean))];
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
  const sourceSku = rawModel.replace(/\s+/g, '-') + (record.breadcrumb.includes('Matte Finish') && !/ M$/.test(rawModel) ? '-M' : '');
  const sku = commercialModels[rawModel] || sourceSku;
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
    if (commercialModels[rawModel]) group = 'Commercial Duplex Receptacles';
    if (['CR15', 'CR20', 'CD20'].includes(rawModel)) group = 'Industrial Grade Duplex Receptacles';
    name = descriptions[rawModel] || `${amp} ${variant === 'Standard' ? '' : `${variant} `}${group.replace(/Receptacles$/, 'Receptacle')}`;
    summary = `${sku}: ${group.toLowerCase()}. ${rows.filter(([label]) => /^(device rating|receptacle rating|rated voltage|amperage|wiring method)$/i.test(label)).map(([, value]) => value).join(' · ')}.`;
    facts = [['Rating', rating], ['Configuration', values.get('NEMA') || values.get('Pole & wire')], ['Variant', variant], ['Application', values.get('Application grade')]];
  }
  return { sku, slug: modelSlug(sourceSku), group, name: clean(name), summary, keyFacts: facts.filter(([, value]) => value) };
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
    if (['BS1801', 'BS1802'].includes(record.model)) {
      referencePages.push(30);
      const material = rows.findIndex(([label]) => label === 'Published construction material');
      if (material !== -1) rows.splice(material, 1);
      rows.push(['Material specification', 'Polycarbonate (PC)']);
      if (record.model === 'BS1802') {
        rows.find(([label]) => label === 'Product width')[1] = '3.15 in (80 mm)';
        rows.find(([label]) => label === 'Product height')[1] = '4.88 in (124 mm)';
      }
      notes.push('BS1801 is the 70 × 115 mm standard plate (glossy or matte); BS1802 is the 80 × 124 mm medium plate (glossy). Both supplied library drawings show 6.5 mm thickness. They are separate models, not two sizes of BS1802.');
      notes.push('The supplied wallplate material reference identifies polycarbonate (PC). Glossy and matte describe surface finishes, not different resins. Specify the size and finish separately on the order.');
    } else {
      notes.push('Dimensions and weight follow this exact model’s legacy specification table and drawing. Do not substitute the dimensions of a screw-fixed plate for the screwless version.');
    }
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
  if (record.family === 'receptacles') {
    const industrial = ['CR15', 'CR20', 'CD20'].includes(record.model);
    const commercial = commercialModels[record.model];
    const quick = /Q(?:-C)?$/.test(record.model);
    rows.find(([label]) => label === 'Wiring method')[1] = quick ? 'Side Wire / Push-In Quick Wire' : 'Side Wire / Back Wire';
    referencePages.push(industrial || commercial ? 17 : record.model.startsWith('D') ? 16 : 15, 18);
    if (quick) rows.push(['Push-in terminal conductor', '#14 AWG only · 15A push-in terminal']);
    if (commercial) rows.find(([label]) => label === 'Source model designation')[1] = commercial;
    if (industrial) {
      rows.find(([label]) => label === 'Device rating')[1] = `${record.model === 'CR15' ? 15 : 20}A · 125V/250V`;
      rows.find(([label]) => label === 'Application grade')[1] = 'Industrial Grade';
      const nema = rows.findIndex(([label]) => label === 'NEMA');
      if (nema !== -1) rows.splice(nema, 1);
      rows.push(['Plug configuration', 'Match the ordered device to its model photograph and approved specification']);
      notes.push('Rating and industrial grade follow catalogue page 17. The printed 125V/250V rating does not establish interchangeable plug configurations; confirm the required configuration for the order. Legacy NEMA descriptions are not used as the selection specification.');
    }
    notes.push('Wiring versions follow catalogue pages 15–18. The 15A push-in terminal is marked #14 AWG only. Confirm conductor material, solid/stranded suitability, strip length and torque in the approved model instructions; this push-in limit is not a specification for side/back terminals.');
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
  if (record.model === 'FTR15QC DC20W') {
    rows.push(['Charging protocols (catalogue)', 'PD 2.0 / 3.0 / PPS · QC 3.0 / 2.0 · FCP / SCP / HVSCP · Samsung AFC · BC 1.2 / DCP · Apple 2.4A']);
    notes.push('Catalogue page 11 lists charging protocols in a shared AC/DC model table. It does not give a port-by-port protocol matrix, PPS voltage/current range or simultaneous-output allocation. Confirm these details and device/cable compatibility for the ordered DC20W configuration.');
  }
  const description = describeLegacy(record, rows);
  const values = new Map(rows);
  const file = values.get('Certification file') || record.features.join(' ').match(/E\d{6}/)?.[0];
  const modelReference = findModelCertificate({ line: record.family, sku: description.sku, draft });
  const certificate = file ? {
    file,
    label: `${values.get('Published certification') || 'Published certification'} · file ${file}`,
    image: modelReference?.file === file ? modelReference.image : null
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
      : 'The combined USB output is shared across the charging ports. Do not treat the combined total as the output available from each port.');
  }
  const finishRecord = catalogueRecords.find((item) => item.family === record.family && modelKey(item.model) === modelKey(description.slug));
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
  const wallplateCover = record.family === 'wallplates' ? finishImages.find((finish) => finish.slug === 'white') : null;
  const productViews = lightingViews || (wallplateCover
    ? [wallplateCover, ...gallery.filter((image) => image.src !== wallplateCover.src)]
    : smartMedia ? smartMedia.gallery : record.family === 'usb-outlets'
    ? [finishImages.find((finish) => finish.slug === 'white') || hero,
      ...gallery.filter((image) => usbStructuralViews.has(image.src)),
      ...(record.model === 'F4P' ? [] : sharedUsbViews.filter((shared) => !gallery.some((image) => image.src === shared.src))),
      ...usbPlates]
    : dimmerScrewless ? [...gallery.slice(0, 2), dimmerScrewless, gallery[2], dimmerPackage, ...gallery.slice(3)] : gallery);
  const primaryView = lightingViews || wallplateCover || smartMedia || record.family === 'usb-outlets' ? productViews[0] : hero;
  const drawings = smartMedia?.drawings || (finishRecord?.drawings?.length ? finishRecord.drawings : record.drawings);
  const detailViews = smartMedia?.detailViews || [];
  const presentation = dimmerPackage
    ? [dimmerPackage, { ...gallery[2], caption: 'Standard screw plate · packaged' }]
    : record.presentationIndices ? record.presentationIndices.map((index) => gallery[index])
      : record.family === 'usb-outlets' && record.model !== 'F4P' ? record.gallery.slice(0, 2) : [];
  const features = description.keyFacts.map(([label, value]) => `${label}: ${value}`);
  if (values.get('Wiring method') && !description.keyFacts.some(([label]) => label === 'Wiring')) features.push(`Wiring: ${values.get('Wiring method')}`);
  if (warrantyValue) features.push(`Warranty: ${warrantyValue}`);
  if (/^GTN(?:15|20)$/.test(record.model)) features.push('Nylon front cover, body and buttons', 'PCB designed for vibration and high-frequency interference resistance');
  const functionalFeatures = restoredFunctionalFeatures(record, { values, description, materialRows, warrantyValue, modelReference, file, draft });
  return {
    ...description, line: record.family, sourceModel: record.model, sourceUrl: record.sourceUrl,
    sources: [catalogSheets[description.sku], ...[...new Set(referencePages)].map((page) => ({ label: `Product catalogue · page ${page}`, href: `${catalogueDocument}#page=${page}`, kind: 'catalogue' }))].filter(Boolean),
    ...familyStories[record.family],
    specificationGroups: makeGroups([['Model', description.sku], ...rows], materialRows, record.family),
    specificationSummary: description.keyFacts,
    features, functionalFeatures, finishes, certificate,
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

export function findCatalogAliasMatch(query) {
  const key = modelKey(query);
  const alias = Object.entries(commercialModels).find(([name]) => modelKey(name) === key);
  return alias ? getCatalogProducts('receptacles').find(product => product.sku === alias[1]) : undefined;
}

export function filterCatalogProducts(products, { query = '', group = '' } = {}) {
  const queryKey = modelKey(query);
  const alias = findCatalogAliasMatch(query);
  return products.filter((product) => (!group || product.group === group)
    && (alias ? product.line === alias.line && product.sku === alias.sku
      : !queryKey || modelKey([product.sku, product.sourceModel, product.name, product.group, product.summary].join(' ')).includes(queryKey)));
}
