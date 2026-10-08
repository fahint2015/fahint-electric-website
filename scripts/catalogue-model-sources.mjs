// Model-by-model transcription of the supplied FAHINT catalogue. Paths refer to
// the user's existing product library, not to copied source folders in this repo.
const usbRoot = '02-USB Outlet/主图';
const usb4200 = [15, 20].flatMap((amperage) => ['', 'C', 'DC'].map((ports) => {
  const model = `FTR${amperage}${ports}-4200`;
  const folder = `${usbRoot}/4200mA/${model}/白底图+方特主图`;
  const interfaces = ports === 'DC' ? '2 × USB-C' : ports === 'C' ? 'USB-A + USB-C' : '2 × USB-A';
  return {
    model, family: 'usb-outlets', referencePages: [10, 12],
    breadcrumb: 'Products / USB Outlet / Conventional USB Outlet 4200mA /',
    title: `${amperage}A ${interfaces} Outlet · 4.2A`, group: '4.2A USB',
    summary: `${amperage}A, 125V receptacle with ${interfaces} charging ports. Combined USB output is 5V DC, 4.2A (21W), shared across both ports.`,
    keyFacts: [['Receptacle', `${amperage}A · NEMA 5-${amperage}R`], ['Combined USB output', '5V DC · 4.2A · 21W'], ['Interfaces', interfaces], ['Charging', 'Conventional · non-PD']],
    rows: [
      ['Model', model], ['Receptacle Rating', `${amperage}A, 125V · NEMA 5-${amperage}R`],
      ['USB Rating', '5V DC · 4.2A · 21W'], ['USB Type', interfaces],
      ['Pole & Wire', '2-Pole, 3-Wire'], ['Charging protocols', 'BC1.2 · Apple / Samsung'],
      ['Quick charging', 'No'], ['Tamer-Resistant', 'Yes — marked on the model face'],
      ['Device width', '43.5 mm'], ['Body height', '69 mm'], ['Overall depth', '44.7 mm'],
      ['Recessed depth', '37.5 mm'], ['Mounting centers', '83.5 mm']
    ],
    notes: ['The catalogue specifies combined output, but not an individual-port current limit for this 4200mA model. Do not substitute the limits from a 3100mA or 5000mA model.',
      'Dimensions use the shared non-65W reference supplied in the 4200mA product folder. The 83.5 mm value is mounting-hole spacing, not overall height. Confirm the final model drawing and wiring instructions before installation.'],
    primaryIndex: 0, presentationIndices: [1, 2],
    drawingSources: [`${usbRoot}/4200mA/5.png`],
    drawingCaptions: ['Shared 4200mA folder reference · use the non-65W views, not the PD65W depth'],
    gallerySources: [`${folder}/0-白哑光单品.png`, `${folder}/1-白单品+亮面常规面板.png`, `${folder}/3-白单品-亮面无螺丝面板.png`]
  };
}));

// These legacy galleries start with a rear view or an unordered color. Use the
// exact model's white product photograph rather than inferring a gallery index.
const usbPhotoCorrections = [
  ['FTR15 3600', '3600mA/FTR15-3600'],
  ['FTR15C 3100', '3100mA/FTR15C-3100'],
  ['FTR20 5000', '5000mA/FTR20-5000'],
  ['FTR20DC 3600', '3600mA/FTR20DC-3600'],
  ['FTR15QC DC36W', 'PD36W/FTR15QC DC36W'],
  ['F4P', '4200mA-F4P']
].map(([model, folder]) => ({
  model, family: 'usb-outlets', imageOnly: true,
  gallerySources: [`${usbRoot}/${folder}/白底图+方特主图/0-白哑光单品.png`]
}));

const standardDuplex = ['R15', 'R15Q', 'R20'].map((model) => {
  const amperage = model === 'R20' ? 20 : 15;
  const wiring = model.endsWith('Q') ? 'Side Wire / Push-In Quick Wire' : 'Side Wire / Back Wire';
  const folder = `04-Standard Receptacle/R系列/${amperage === 20 ? 'R20' : 'R15-R15Q'}/白底图`;
  return {
    model, family: 'receptacles', referencePages: [15, 18],
    title: `${amperage}A Standard Duplex Receptacle${model.endsWith('Q') ? ' · Quick-Wire' : ''}`,
    group: 'Duplex Receptacle', summary: `${amperage}A, 125V standard duplex receptacle with ${wiring.toLowerCase()}. Matte finish; non-TR standard version.`,
    keyFacts: [['Rating', `${amperage}A · 125V`], ['Wiring', wiring], ['Variant', 'Standard'], ['Surface', 'Matte']],
    rows: [['Model', model], ['Rating', `${amperage}A · 125V`], ['Wiring', wiring], ['Spec', 'Non Tamper-Resistant'], ['Surface finish', 'Matte'], ['File No.', 'E498095'],
      ['Device width', '33.2 mm'], ['Overall height', '106 mm'], ['Overall depth', '23.8 mm'], ['Mounting centers', '83.5 mm']],
    notes: [
      ...(model === 'R20' ? [] : ['R15 and R15Q share the front-face presentation in the source library. Their wiring methods are different; use the model-specific wiring configuration on the order.']),
      'Dimensions are transcribed from the shared receptacle range drawing in the supplied product library. Its illustrated TR/WR faces do not add those features to this standard model; confirm the approved model drawing for final fit.'
    ],
    primaryIndex: 0, detailIndex: 1, presentationIndices: [1],
    drawingSources: ['04-Standard Receptacle/副图/7.png'],
    drawingCaptions: ['Shared receptacle range dimensions · not a model-specific TR/WR or wiring specification'],
    gallerySources: [`${folder}/白哑光单品.png`, `${folder}/白哑光单品+亮面面板.png`]
  };
});

const dimmers = ['DM2010', 'DM2010S'].map((model) => {
  const lowVoltageControl = model === 'DM2010S';
  const folder = `03-Dimmer & sensor switch-目前只卖Dimmer/${model}-${lowVoltageControl ? 'Digital Dimmer Light switch' : 'Digital Dimmer Light Switch'}`;
  const voltage = lowVoltageControl ? '120 / 277V AC · 60Hz' : '120V AC · 60Hz';
  const load = lowVoltageControl ? '600VA maximum' : 'LED / CFL: 5–200W';
  return {
    model, family: 'dimmers', referencePages: [13],
    title: lowVoltageControl ? '0–10V Slide Dimmer' : 'Digital Slide Dimmer',
    group: lowVoltageControl ? '0–10V dimming' : 'Digital slide dimming',
    summary: lowVoltageControl
      ? 'Paddle on/off switching with slide control for compatible 0–10V LED drivers and fluorescent ballasts. Rated for 120/277V AC, 60Hz and 600VA maximum.'
      : 'Paddle on/off switching with a separate brightness slider. For 120V AC, 60Hz circuits, with distinct incandescent and LED/CFL load limits.',
    keyFacts: [['Supply', voltage], ['Load', load], ['Control', lowVoltageControl ? '0–10V' : 'On/off + slide dimming'], ['Circuit', 'Single-pole / 3-way']],
    rows: [
      ['Model', model], ['Operating voltage', voltage], ['Current rating', lowVoltageControl ? '5A at 120V AC · 2A at 277V AC' : '5A'],
      ['Control method', lowVoltageControl ? 'On/off slide dimmer · 0–10V' : 'On/off slide dimmer'],
      ...(lowVoltageControl ? [['Maximum load', '600VA'], ['Control output', '0–10V DC analog control — compatible driver required']]
        : [['Incandescent load', '20–600W'], ['LED / CFL load', '5–200W']]),
      ['Circuit configuration', 'Single-pole / 3-way'], ['Certification', 'UL / cUL marking on model'], ['File No.', 'E550002'],
      ['Device width', '1.73 in (44 mm)'], ['Device height', '4.14 in (105 mm)'], ['Overall depth', '1.14 in (28.8 mm)'],
      ['Wall-plate face', '2.75 × 4.53 in (70 × 115 mm)'],
      ['Operating Temp', '−20°C to 40°C'], ['Recessed depth', '21.5 mm']
    ],
    notes: [lowVoltageControl
      ? 'DM2010S uses a 0–10V control signal and is not interchangeable with DM2010. Confirm compatibility with the LED driver or ballast.'
      : 'The 600W incandescent limit does not apply to LED/CFL lamps. Their published load range is 5–200W.',
      'Dimensions and wiring references are reproduced from the model-specific product-library drawings. Use approved installation instructions for the final installation.',
      'A multi-gang derating schedule, conductor limits and terminal torque are not specified in these references. Request the approved instructions for the intended installation.'],
    primaryIndex: 0, detailIndex: 3, presentationIndices: [1, 2],
    gallerySources: [`${folder}/白底图-方特主图/0-白单品.png`, `${folder}/白底图-方特主图/1-白配亮面常规面板.png`,
      `${folder}/白底图-方特主图/5-中性包装-白色配亮面常规面板.png`, `${folder}/副图/5.jpg`],
    drawingSources: [`${folder}/副图/6.jpg`, `${folder}/副图/7.jpg`],
    drawingKinds: ['dimensions', 'wiring'],
    drawingCaptions: [`${model} dimensions · 44 × 105 × 28.8 mm, recessed depth 21.5 mm`, `${model} single-pole / 3-way wiring reference · follow approved instructions`]
  };
});

const wallplateDrawings = [
  ['BS1801', '副图-1801尺寸.png', '70 × 115 × 6.5 mm'],
  ['BS1801-M', '副图-1801哑光尺寸.png', '70 × 115 × 6.5 mm'],
  ['BS1802', '副图-1802尺寸.png', '80 × 124 × 6.5 mm']
].map(([model, file, size]) => ({
  model, family: 'wallplates', imageOnly: true, gallerySources: [],
  drawingSources: [`07-Wallplates/BS1801+BS1802/${file}`],
  drawingCaptions: [`${model} · ${size} · supplied product-library drawing`]
}));

const smartRoot = '05-Smart Switch';
const gangCodes = [[1, '8811'], [2, '8821'], [3, '8831'], [4, '8841']];
const usSmart = gangCodes.flatMap(([gangs, code]) => [
  { model: `USW${code}`, mode: 'Wi-Fi + touch', wiring: 'Neutral required (N + L)', voltage: '90–250V AC · 50/60Hz', folder: 'Wi-Fi Neutral Reruired' },
  { model: `USW${code}-S`, mode: 'Wi-Fi + touch', wiring: 'Single live wire', voltage: '110–240V AC · 50/60Hz', folder: 'Wi-Fi Single Life Wire' },
  { model: `USW${code}-Z`, mode: 'Zigbee + touch', wiring: 'Single live wire', voltage: '110–240V AC · 50/60Hz', folder: 'Zigbee Single Life Wire' },
  { model: `UST${code}`, mode: 'Touch only', wiring: 'Single live wire', voltage: '110–240V AC · 50/60Hz', folder: 'Touch Switch/Single Life Wire' }
].map((item) => ({ ...item, format: 'US', referencePages: [gangs === 4 ? 20 : 19], function: `${gangs}-gang switching`, gangs,
  power: '1200W / gang (catalogue rating; confirm load type)', sourceFolder: `${smartRoot}/美规/${item.folder}/${item.model}` })));

const usSpecial = [
  ['USW8832', 'Wi-Fi + touch', 'Dimming', 'Wi-Fi Neutral Reruired', 'Neutral required (N + L)', '90–250V AC · 50/60Hz'],
  ['USW8833', 'Wi-Fi + touch', 'Curtain control', 'Wi-Fi Neutral Reruired', 'Neutral required (N + L)', 'Confirm approved model voltage'],
  ['UST8832', 'Touch only', 'Dimming', 'Touch Switch/Neutral Reruired', 'Source conflict — confirm wiring', '110–240V AC · 50/60Hz (catalogue; confirm supplied version)'],
  ['UST8833', 'Touch only', 'Curtain control', 'Touch Switch/Neutral Reruired', 'Neutral required per model artwork — confirm supplied version', 'Confirm approved model voltage']
].map(([model, mode, fn, folder, wiring, voltage]) => ({
  model, mode, function: fn, format: 'US', wiring, voltage, referencePages: [20],
  power: 'Confirm model-specific lamp / motor load', sourceFolder: `${smartRoot}/美规/${folder}/${model}`,
  notes: [model.endsWith('8833')
    ? 'The curtain-control artwork is filed under this exact 8833 model. Catalogue page 20 repeats the 8831 switching code in its curtain row; this page retains the product-library model code rather than merging it with the 3-gang light switch. Voltage and motor load require model-specific approval.'
    : model === 'UST8832'
      ? 'Catalogue page 20 calls UST8832 single-live-wire, but the model-specific artwork explicitly says neutral required. The wiring requirement must be confirmed before specifying or ordering.'
      : 'Catalogue page 20 groups the dimmer under a 1200W/gang heading without separate LED/CFL limits. Do not treat that heading as an approved dimming load; request the lamp-specific rating.'],
  sourceArtwork: '7.png'
}));

const euSmart = gangCodes.flatMap(([gangs, code]) => [
  { model: `EUW${code}`, mode: 'Wi-Fi + touch', wiring: 'Neutral required (N + L)', voltage: '90–250V AC · 50/60Hz', power: '1000W / gang', folder: '智能/零火/Wifi零火' },
  { model: `EUZ${code}`, mode: 'Zigbee + touch', wiring: 'Neutral required (N + L)', voltage: '90–250V AC · 50/60Hz', power: '1000W / gang', folder: '智能/零火/Zigbee零火（试样）', sample: true },
  { model: `EUW${code}C`, mode: 'Wi-Fi + touch', wiring: 'Single-live or neutral + live (L / N + L)', voltage: '160–240V AC · 50/60Hz', power: '600W / gang', folder: '智能/单零火通用/Wifi单零火通用' },
  { model: `EUZ${code}C`, mode: 'Zigbee + touch', wiring: 'Single-live or neutral + live (L / N + L)', voltage: '160–240V AC · 50/60Hz', power: '600W / gang', folder: '智能/单零火通用/Zigbee单零火通用' },
  ...(gangs < 4 ? [{ model: `EUZ${code}S`, mode: 'Zigbee + touch', wiring: 'Single live wire only (L)', voltage: '110–240V AC · 50/60Hz', power: '600W / gang', folder: '智能/Zigbeei单火(圆弧底座)' }] : []),
  { model: `EUT${code}S`, mode: 'Touch only', wiring: 'Single live wire only (L)', voltage: '110–240V AC · 50/60Hz', power: 'LED: 3–100W · resistive: 3–300W', folder: '纯触摸单火' }
].map((item) => ({ ...item, format: 'EU', referencePages: [22], function: `${gangs}-gang switching`, gangs,
  sourceFolder: `${smartRoot}/欧规/${item.folder}/${item.model}` })));

const euSpecial = [
  ['8832', 'Dimming'], ['8833', 'Curtain control'], ['8834', 'Fan control'], ['8835', 'Heater control']
].flatMap(([code, fn]) => ['W', 'Z'].map((radio) => {
  const model = `EU${radio}${code}`;
  const folderSuffix = code === '8835' ? '' : radio === 'W' && code !== '8834' ? '（半圆弧底座）' : '(半圆弧底座)';
  return { model, mode: radio === 'W' ? 'Wi-Fi + touch' : 'Zigbee + touch', function: fn, format: 'EU',
    wiring: 'Neutral required (N + L)', voltage: '90–250V AC · 50/60Hz', power: '300W / gang (catalogue rating)',
    referencePages: [23], sample: radio === 'Z',
    sourceFolder: `${smartRoot}/欧规/智能/零火/${radio === 'W' ? 'Wifi零火' : 'Zigbee零火（试样）'}/${model}${folderSuffix}`,
    notes: ['The catalogue gives a 300W/gang rating for this functional control. Confirm the compatible lamp, motor or heater type and its starting load before specification.'] };
}));

const smartSwitches = [...usSmart, ...usSpecial, ...euSmart, ...euSpecial].map((item) => {
  const { model, mode, wiring, voltage, power, format, sourceFolder } = item;
  const us = format === 'US';
  const gallery = us ? ['1.png', '1-2.png', '1-3.png', '1-4.png'] : ['黑.jpg', '白.jpg', '金.jpg', '灰.jpg'];
  return {
    model, family: 'smart-switches', referencePages: [...item.referencePages, us ? 21 : 24],
    title: `${format} ${item.function} · ${mode}`,
    group: `${format} · ${mode}`, summary: `${model}: ${item.function.toLowerCase()} in a ${format}-format glass touch panel. ${mode}; ${wiring.toLowerCase()}. ${voltage}.`,
    keyFacts: [['Format', `${format} glass panel`], ['Control', mode], ['Wiring', wiring], ['Supply', voltage]],
    rows: [['Model', model], ['Face format', `${format} glass panel`], ['Control mode', mode], ['Function', item.function],
      ...(item.gangs ? [['Number of switched gangs', String(item.gangs)]] : []),
      ['Wiring requirement', wiring], ['Operating voltage', voltage], ['Published load', power],
      ['Face material', 'Tempered glass'], ['Available face colors', 'White · Black · Gold · Grey'],
      ...(item.sample ? [['Program status', 'Sample-stage reference — confirm production availability']] : [])],
    reviewNotice: model === 'UST8832' ? 'Wiring conflict in source documents: confirm whether the supplied UST8832 requires a neutral wire before ordering.'
      : us && model.endsWith('8833') ? 'Curtain-control reference: the voltage and motor-load rating need model-specific confirmation.'
        : item.sample ? 'Sample-stage model in the source library. Confirm production availability and final specifications.' : null,
    notes: [...(item.notes || []),
      'The catalogue dimension sheet includes different rear housing and base versions. Confirm the exact body drawing and wall-box compatibility for the ordered model; a shared face format does not establish an identical rear housing.',
      ...(item.gangs && !model.startsWith('EUT') ? ['The catalogue load figure does not identify every lamp or motor load type. Confirm the permitted load, minimum load and any required bypass with the model-specific instructions.'] : []),
      ...(item.sample ? ['The supplied product library marks this neutral-required Zigbee range as sample-stage. Confirm availability and approved specifications before ordering.'] : []),
      ...(mode === 'Touch only' ? ['This is a touch-only control, not a Wi-Fi or Zigbee model. App, voice and remote-control features are not claimed for this configuration.'] : [])],
    primaryIndex: 0, detailIndex: item.sourceArtwork ? 4 : 1, presentationIndices: [],
    gallerySources: [...gallery.map((file) => `${sourceFolder}/${us ? '' : '白底图/'}${file}`), ...(item.sourceArtwork ? [`${sourceFolder}/${item.sourceArtwork}`] : [])]
  };
});

export const catalogueModelSources = [...usb4200, ...usbPhotoCorrections, ...standardDuplex, ...dimmers, ...smartSwitches, ...wallplateDrawings];

// Explicit model folders and front-face colors from the product library. Do not
// infer colors from gallery position or reuse a different amperage / port layout.
const libraryColors = [['white', '白'], ['ivory', '象牙'], ['almond', '杏仁'], ['black', '黑'], ['grey', '灰'], ['brown', '棕'], ['graphite', '石墨灰']];
const colorSource = (family, model, folder, filename) => ({
  family, model,
  finishSources: libraryColors.map(([slug, color]) => ({ slug, source: `${folder}/${filename(color)}.png` }))
});

const usbColorSources = [3100, 3600, 4200, 5000].flatMap((output) => [15, 20].flatMap((amperage) => ['', 'C', 'DC'].map((ports) => {
  const model = `FTR${amperage}${ports}-${output}`;
  return colorSource('usb-outlets', model, `${usbRoot}/${output}mA/${model}/白底图+方特主图`, (color) => `0-${color}哑光单品`);
})));
const pdColorSources = [20, 36, 65].flatMap((watts) => [15, 20].flatMap((amperage) => ['AC', 'DC'].map((ports) => {
  const model = `FTR${amperage}QC-${ports}${watts}W`;
  const folderModel = amperage === 20 && watts !== 36 ? `FTR20${ports === 'AC' ? 'C' : 'DC'}` : `FTR${amperage}QC`;
  return colorSource('usb-outlets', model, `${usbRoot}/PD${watts}W/${folderModel} ${ports}${watts}W/白底图+方特主图`, (color) => `0-${color}哑光单品`);
})));

const receptacleColorSources = ['D', 'R', 'C'].flatMap((series) => ['', 'T', 'W'].flatMap((protection) => ['15', '15Q', '20'].map((rating) => {
  const stem = `${series === 'C' ? 'R' : series}${protection}`;
  const suffix = series === 'C' ? '-C' : '';
  const model = `${stem}${rating}${suffix}`;
  // The library groups 15A and 15A quick-wire models under their shared face;
  // only the front photograph is shared. Their wiring data remains independent.
  const folder = rating.startsWith('15') ? `${stem}15${suffix}-${stem}15Q${suffix}` : `${stem}20${suffix}`;
  return colorSource('receptacles', model, `04-Standard Receptacle/${series}系列/${folder}/白底图`,
    (color) => `${series === 'D' ? '0-' : ''}${color}哑光单品`);
})));
const industrialColorSources = ['CR15', 'CR20', 'CD20'].map((model) =>
  colorSource('receptacles', model, `04-Standard Receptacle/工业插座-无UL/${model}/白底图-方特店铺主图`, (color) => `${color}哑光单品`));

const dimmerColorSources = ['DM2010', 'DM2010S'].map((model) =>
  colorSource('dimmers', model, `03-Dimmer & sensor switch-目前只卖Dimmer/${model}-Digital Dimmer Light ${model === 'DM2010S' ? 'switch' : 'Switch'}/白底图-方特主图`, (color) => `0-${color}单品`));
const lightingColorSources = [
  ['DS15', '1开/DS15单控/白底', (color) => `正面${color}-哑光`],
  ['DS15.3', '1开/DS15.3双控/白底', (color) => `正面${color}-哑光`],
  ['DS1502', '2开/白底', (color) => `${color}亮面`],
  ['DS1503', '3开/白底', (color) => `${color}亮面`],
  ['T15', '手柄开关/T15单控/白底图', (color) => `侧面${color}`],
  ['T15.3', '手柄开关/T15.3双控/白底', (color) => color]
].map(([model, folder, filename]) => colorSource('lighting-switches', model, `06-Lighting Switches/${folder}`, filename));

const fixedPlateColorSources = ['BS1801', 'BS18012', 'BS18013', 'BS18014'].flatMap((code) => ['G', 'M'].map((surface) => {
  const model = `${code}${surface === 'M' ? '-M' : ''}`;
  const finish = surface === 'M' ? '哑光' : '亮面';
  const folder = code === 'BS1801' ? 'BS1801+BS1802/白底图-主图/BS1801-标准面板1位常规尺寸' : `${code}/白底图-主图`;
  return colorSource('wallplates', model, `07-Wallplates/${folder}`, (color) => `${color}${finish}${code === 'BS1801' ? '-标准面板' : ''}`);
}));
const screwlessPlateColorSources = [1, 2, 3, 4].flatMap((gangs) => ['G', 'M'].map((surface) => {
  const model = `BS1803${gangs === 1 ? '' : gangs}-${surface}`;
  return colorSource('wallplates', model, '07-Wallplates/BS1803+BS18032+BS18033+BS18034/白底图+方特主图',
    (color) => `${gangs}-${surface === 'M' ? 2 : 1}-${color}${surface === 'M' ? '哑光' : '亮面'}`);
}));
const otherPlateColorSources = [
  ['BS1802', 'BS1801+BS1802/白底图-主图/BS1802-标准面板1位中号尺寸', (color) => `${color}亮面`],
  ['BS1804', 'BS1804/白底图-主图', (color) => color],
  ['BS1805', 'BS1805-延伸板/白底图-主图', (color) => color],
  ['BS1806', 'BS1806/白底图-主图', (color) => color],
  ['BS1807', 'BS1807-Blank/白底图-主图', (color) => color]
].map(([model, folder, filename]) => colorSource('wallplates', model, `07-Wallplates/${folder}`, filename));

export const catalogueFinishSources = [
  ...usbColorSources, ...pdColorSources,
  colorSource('usb-outlets', 'F4P', `${usbRoot}/4200mA-F4P/白底图+方特主图`, (color) => `0-${color}哑光单品`),
  ...receptacleColorSources, ...industrialColorSources, ...dimmerColorSources, ...lightingColorSources,
  ...fixedPlateColorSources, ...screwlessPlateColorSources, ...otherPlateColorSources
];
