import { findModelCertificate } from './certificates.js';

// Purchasing guidance based on the published model data, not installation instructions.
export const buyingGuides = {
  gfci: {
    intro: 'Start with the device configuration, then check the documentation for the exact model you plan to order.',
    questions: [
      { q: 'How do I compare standard, TR / WR and blank-face models?', a: 'GF15/GF20 are the standard-face models; GT15/GT20 add tamper resistance; GW15/GW20 combine tamper and weather resistance. GL20 is a blank-face device, not a plug-in receptacle. Use the comparison table to shortlist the rating and configuration, then have a qualified professional confirm suitability for the project.' },
      { q: 'Does the same certificate cover every GFCI model?', a: 'No. The August 16, 2022 E504391-20210212 addendum names GF15, GF20, GT15, GT20, GW15 and GW20, plus GTN15 and GTN20 as tamper-resistant models with no feed-through. GL20 documentation remains under review. Confirm current listing status and coverage for the ordered configuration.' },
      { q: 'What should I confirm with the sample?', a: 'Record the complete model number, face rating, finish, wallplate and required markings. Compare the sample with the relevant specifications and documents. Confirm packaging and any authorized private-label artwork before approving an order.' },
    ],
    resource: { label: 'Read the GFCI sourcing checklist', to: '/blog/how-to-source-ul-listed-gfci-from-china' },
    modelCheck: 'Confirm the face rating, TR / WR or blank-face configuration, and required model documents.',
  },
  'usb-outlets': {
    intro: 'Compare the charging ports, input rating and any AC receptacle separately. The highest wattage is not the only selection criterion.',
    questions: [
      { q: 'Should I choose a USB-A, USB-C or Power Delivery outlet?', a: 'List the devices and cables your customers use, then compare the port arrangement and published output profiles. The catalogue includes USB-A, USB-C and PD configurations, including 65W GaN models. A USB-C connector alone does not establish a particular PD output.' },
      { q: 'How should I compare total output and power sharing?', a: 'Check combined USB output, single-port limits and the behaviour with multiple ports in use. Do not add individual maximum ratings together. Charging output depends on the connected device, cable and negotiated profile; confirm simultaneous-port power sharing for the selected model.' },
      { q: 'What belongs in a USB outlet quotation request?', a: 'Send the complete model, input rating, any AC receptacle rating, required port mix, target charging profile and quantity. Include finish, wallplate, destination and packaging requirements. Review the model documentation and approve the requested configuration with a sample.' },
    ],
    resource: { label: 'Read the USB outlet buying guide', to: '/blog/usb-wall-outlet-buying-guide' },
    modelCheck: 'Confirm port mix, charging profiles, simultaneous-port power sharing and input rating; where applicable, confirm the AC receptacle rating.',
  },
  receptacles: {
    intro: 'Match the electrical configuration first, then refine the face style, finish and wallplate.',
    questions: [
      { q: 'Which voltage and current should I specify?', a: 'Use the exact current, voltage and plug configuration required by the project. The catalogue lists the standard and commercial range at 125V, and industrial CR15/CR20/CD20 at 125V/250V. That voltage label does not establish plug compatibility; confirm the exact ordered configuration.' },
      { q: 'How do face style and TR / WR affect the shortlist?', a: 'Compare duplex or decorator openings, tamper-resistant and weather-resistant features, and the stated wiring method for each model. A similar-looking face does not make two configurations interchangeable. Confirm location and installation requirements with a qualified professional.' },
      { q: 'What do I need to approve before ordering?', a: 'Confirm the model designation, electrical ratings, wiring method, finish and matching wallplate. Request the relevant model documents and record the agreed sample, markings and packaging in the quotation.' },
    ],
    resource: { label: 'Read the standard receptacle buying guide', to: '/blog/standard-receptacle-buying-guide' },
    modelCheck: 'Confirm voltage, current, NEMA configuration, TR / WR features and wiring method for the exact model.',
  },
  dimmers: {
    intro: 'Choose by the lighting load and control system, not just by the appearance of the wall control.',
    questions: [
      { q: 'Which load information should I provide?', a: 'Share the lamp or driver manufacturer, model, load type and total connected load. Compare the dimmer rating for that load type; LED and incandescent ratings must not be treated as the same limit. Have compatibility and installation requirements checked for the complete lighting system.' },
      { q: 'Are DM2010 and DM2010S interchangeable?', a: 'They represent different control choices: DM2010 is the digital slide dimmer and DM2010S is the 0-10V model. Review the model-specific control method, wiring and lighting-system requirements before selecting either one.' },
      { q: 'What should the approved sample establish?', a: 'Agree on the exact dimmer, finish, plate and intended lamp or driver combination. Specify what compatibility checks and documentation are needed before the order. Sample arrangements, quantities and timing are confirmed for the project.' },
    ],
    resource: { label: 'Read the dimmer buying guide', to: '/blog/dimmer-buying-guide-led-0-10v' },
    modelCheck: 'Provide lamp or driver model, load type and total load; confirm compatibility with the selected control method.',
  },
  'smart-switches': {
    intro: 'A smart-switch brief needs the wiring arrangement, control function and connection protocol as separate decisions.',
    questions: [
      { q: 'Does this model require a neutral conductor?', a: 'Check the exact model: neutral-required, single-live and dual-wiring versions are separate catalogue configurations. Provide the wiring requirements from your project team. Do not assume one diagram or wiring arrangement applies to the whole smart-switch range.' },
      { q: 'What should I confirm about Wi-Fi, Zigbee or touch-only operation?', a: 'Specify the required protocol and function, then confirm the app, gateway and accessories for the chosen model. Touch-only controls should not be assumed to provide network features. Switching, dimming, curtain, fan and heater controls serve different loads.' },
      { q: 'How do I specify the format and finish?', a: 'Include US or EU format, dimensions, control functions, finish, quantity and destination. Review model-specific approvals and the intended connected system with a sample. Artwork, packaging and any customization require separate confirmation.' },
    ],
    resource: { label: 'Review the OEM approval process', to: '/capabilities#process' },
    modelCheck: 'Confirm neutral requirements, protocol, control function, US/EU format and any gateway or accessory requirements.',
  },
  'lighting-switches': {
    intro: 'Separate the switching function from the face style when preparing your product range.',
    questions: [
      { q: 'Do I need single-pole, 3-way or combination controls?', a: 'Specify the required switching function first. The range includes single-pole and 3-way models plus double- and triple-rocker combination controls. Multiple rockers in one device do not necessarily mean a multi-gang wallplate.' },
      { q: 'What electrical and approval details should I check?', a: 'Compare the current and voltage stated for the model, including the separate 125V and 120/277V configurations. Published UL or ETL identification varies by model. Do not substitute a certificate from another switch or product family.' },
      { q: 'Which details help keep a mixed order consistent?', a: 'Provide model numbers and quantities by circuit type, with the required paddle or toggle style, finish and matching wallplate opening. Approve the sample, markings and packaging for each configuration in the order.' },
    ],
    resource: { label: 'Read the light switch buying guide', to: '/blog/light-switch-buying-guide' },
    modelCheck: 'Confirm single-pole, 3-way or combination operation, voltage and current, and the matching plate opening.',
  },
  wallplates: {
    intro: 'Specify the opening and gang count before choosing the finish or fixing style.',
    questions: [
      { q: 'Which opening and gang count should I choose?', a: 'Match the plate to the device opening: decorator, duplex, toggle or blank. Then confirm gang count and dimensions. The number of buttons or rockers on a device is not a substitute for checking the wallplate configuration.' },
      { q: 'What changes between standard and screwless plates?', a: 'Check the fixing style and the components shown for the selected model. Confirm the plate and device fit together using the model dimensions and a sample. Do not assume every plate is included with every device order.' },
      { q: 'How should I specify colour and packaging?', a: 'Name the finish and surface appearance, then approve it alongside the intended device. Include quantities by model and finish, required pack format and authorized artwork. Custom colours, minimum quantities and timing need confirmation in the quotation.' },
    ],
    resource: { label: 'Read the wallplate buying guide', to: '/blog/wallplate-buying-guide' },
    modelCheck: 'Confirm opening, gang count, dimensions, fixing style and whether the plate is ordered separately or with a device.',
  },
};

export function modelDocumentationNote(product) {
  if (product.listing?.status === 'review') return `${product.sku} documentation remains under review. Request the exact model listing record before specifying it.`;
  const reference = findModelCertificate(product);
  if (product.line === 'wallplates') {
    return reference
      ? `The base model for ${product.sku} appears in report ${reference.report}, issued ${reference.issued}. Confirm the finish designation and current coverage for the ordered configuration.`
      : `${product.sku} is not named in the supplied wallplate addenda. Request the matching model document before specifying it.`;
  }
  if (reference) return `${product.sku} is named in the supplied ${reference.issued} addendum (report ${reference.report}). Confirm current coverage for the ordered configuration.`;
  return `No matching certificate PDF for ${product.sku} is currently published in this library. Request the exact-model document; a file number or family reference alone does not establish coverage.`;
}
