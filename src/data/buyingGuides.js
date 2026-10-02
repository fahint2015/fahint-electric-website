// Purchasing guidance based on the published model data, not installation instructions.
export const buyingGuides = {
  gfci: {
    intro: 'Start with the device configuration, then check the documentation for the exact model you plan to order.',
    questions: [
      { q: 'How do I compare standard, TR / WR and blank-face models?', a: 'GF15/GF20 are the standard-face models; GT15/GT20 add tamper resistance; GW15/GW20 combine tamper and weather resistance. GL20 is a blank-face device, not a plug-in receptacle. Use the comparison table to shortlist the rating and configuration, then have a qualified professional confirm suitability for the project.' },
      { q: 'Does the same certificate cover every GFCI model?', a: 'No. The available E504391 report names the residential GF, GT and GW models. GL20 documentation remains under review. Industrial GTN15/GTN20 require their own model-specific listing review; the residential report does not establish their coverage.' },
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
    resource: { label: 'Review product-family certificates', to: '/about#certifications' },
    modelCheck: 'Confirm port mix, charging profiles, simultaneous-port power sharing and input rating; where applicable, confirm the AC receptacle rating.',
  },
  receptacles: {
    intro: 'Match the electrical configuration first, then refine the face style, finish and wallplate.',
    questions: [
      { q: 'Which voltage and current should I specify?', a: 'Use the exact current, voltage and NEMA configuration required by the project. Compare those entries on the model page rather than selecting by face appearance alone. Specialty 250V configurations are separate from the standard 125V range.' },
      { q: 'How do face style and TR / WR affect the shortlist?', a: 'Compare duplex or decorator openings, tamper-resistant and weather-resistant features, and the stated wiring method for each model. A similar-looking face does not make two configurations interchangeable. Confirm location and installation requirements with a qualified professional.' },
      { q: 'What do I need to approve before ordering?', a: 'Confirm the model designation, electrical ratings, wiring method, finish and matching wallplate. Request the relevant model documents and record the agreed sample, markings and packaging in the quotation.' },
    ],
    resource: { label: 'Prepare a finish specification', to: '/blog/gfci-colour-finishes-specification' },
    modelCheck: 'Confirm voltage, current, NEMA configuration, TR / WR features and wiring method for the exact model.',
  },
  dimmers: {
    intro: 'Choose by the lighting load and control system, not just by the appearance of the wall control.',
    questions: [
      { q: 'Which load information should I provide?', a: 'Share the lamp or driver manufacturer, model, load type and total connected load. Compare the dimmer rating for that load type; LED and incandescent ratings must not be treated as the same limit. Have compatibility and installation requirements checked for the complete lighting system.' },
      { q: 'Are DM2010 and DM2010S interchangeable?', a: 'They represent different control choices: DM2010 is the digital slide dimmer and DM2010S is the 0-10V model. Review the model-specific control method, wiring and lighting-system requirements before selecting either one.' },
      { q: 'What should the approved sample establish?', a: 'Agree on the exact dimmer, finish, plate and intended lamp or driver combination. Specify what compatibility checks and documentation are needed before the order. Sample arrangements, quantities and timing are confirmed for the project.' },
    ],
    resource: { label: 'Explore OEM / ODM support', to: '/capabilities#oem' },
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
    resource: { label: 'Compare matching wallplates', to: '/products/wallplates' },
    modelCheck: 'Confirm single-pole, 3-way or combination operation, voltage and current, and the matching plate opening.',
  },
  wallplates: {
    intro: 'Specify the opening and gang count before choosing the finish or fixing style.',
    questions: [
      { q: 'Which opening and gang count should I choose?', a: 'Match the plate to the device opening: decorator, duplex, toggle or blank. Then confirm gang count and dimensions. The number of buttons or rockers on a device is not a substitute for checking the wallplate configuration.' },
      { q: 'What changes between standard and screwless plates?', a: 'Check the fixing style and the components shown for the selected model. Confirm the plate and device fit together using the model dimensions and a sample. Do not assume every plate is included with every device order.' },
      { q: 'How should I specify colour and packaging?', a: 'Name the finish and surface appearance, then approve it alongside the intended device. Include quantities by model and finish, required pack format and authorized artwork. Custom colours, minimum quantities and timing need confirmation in the quotation.' },
    ],
    resource: { label: 'Read about finish approval', to: '/blog/gfci-colour-finishes-specification' },
    modelCheck: 'Confirm opening, gang count, dimensions, fixing style and whether the plate is ordered separately or with a device.',
  },
};

export function modelDocumentationNote(product) {
  if (product.listing?.status === 'review') return `${product.sku} documentation remains under review. Request the exact model listing record before specifying it.`;
  if (/^GTN(?:15|20)$/.test(product.sku)) return `For ${product.sku}, the residential GFCI report does not establish coverage. Request model-specific listing documentation.`;
  if (product.listing?.file) return `Match ${product.sku} to the available ${product.listing.file} report and confirm current coverage for the ordered configuration.`;
  return `Request documentation for ${product.sku} and its ordered configuration. A company or product-family certificate does not automatically cover every model.`;
}
