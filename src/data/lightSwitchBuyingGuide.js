// Industry references explain the terms; FAHINT's catalog and model records supply the specifications.
export const lightSwitchBuyingGuide = {
  slug: 'light-switch-buying-guide',
  title: 'Light Switch Buying Guide: Single-Pole, 3-Way and Combination',
  excerpt: 'Compare single-pole, 3-way and combination light switches using six FAHINT models. Check voltage, wallplate fit and model documents before requesting a quote.',
  date: '2026-10-06',
  updated: '2026-10-06',
  readMinutes: 6,
  category: 'Buying Guide',
  cover: 'assets/images/lines/lighting-series-stair-entry-v1.webp',
  coverAlt: 'A white paddle switch on a green wall beside a doorway in an illustrated interior.',
  coverCaption: 'Illustrated lighting-switch setting. The image shows a face style, not a circuit arrangement or installation reference.',
  coverSource: 'Existing FAHINT lighting-switch illustration: lines/lighting-series-stair-entry-v1.webp',
  coverWidth: 1920,
  coverHeight: 450,
  coverPosition: '24% center',
  sources: [
    {
      label: 'Leviton: what a 3-way switch controls (industry reference)',
      href: 'https://leviton.com/support/resources/product-support/dimmers-and-switches/switches/what-is-a-3-way-switch'
    },
    {
      label: 'Legrand: switches and dimmers buying guide (industry reference)',
      href: 'https://www.legrand.us/faq/switches-and-dimmers'
    },
    {
      label: 'FAHINT lighting switch models and original specifications',
      href: '/products/lighting-switches'
    },
    {
      label: 'FAHINT catalog (switches on page 25) and supplied switch certificate',
      href: '/resources?family=lighting-switches'
    }
  ],
  body: [
    {
      type: 'p',
      text: 'A purchase line that says “15A white switch” leaves the control function, voltage and wallplate undecided. For a mixed order, separate the single-pole, 3-way and combination models first. Then add the face style and finish to each line.'
    },
    { type: 'h2', text: 'How many places need to control the light?' },
    {
      type: 'p',
      text: 'For ordinary on/off control from one location, start with a single-pole switch. Legrand distinguishes this function from multi-location switching and dimming. In the FAHINT range, DS15 and T15 are single-pole examples, with different face styles and voltage ratings.',
      source: 1
    },
    {
      type: 'p',
      text: 'A 3-way switch is used to control the same lighting circuit from two locations. It does not mean three buttons or three separate lighting circuits. As Leviton explains, a conventional two-location arrangement uses two 3-way switches. DS15.3 and T15.3 are the FAHINT models to review for this function. Have the project electrician confirm the required arrangement.',
      source: 0
    },
    {
      type: 'p',
      text: 'Combination switches answer a different question: how can separate loads be controlled from one device position? DS1502 has two single-pole rockers; DS1503 has three. Both are single-gang devices. Their rocker count is not the wallplate gang count, and it does not make either one a 3-way switch.'
    },
    { type: 'h2', text: 'Choose paddle or toggle after the control function' },
    {
      type: 'p',
      text: 'Paddle and toggle describe what the user touches. Single-pole and 3-way describe the switching function. FAHINT offers both functions in each face style, so keep them in separate columns in your order list. A room can use matching-looking devices while requiring different switching functions.'
    },
    { type: 'h2', text: 'Compare the six FAHINT lighting switches' },
    {
      type: 'p',
      text: 'The ratings below come from the FAHINT product catalog, page 25, and the published model records. Notice the voltage difference between the DS paddle models and T toggle models. Open a model for its specifications and available drawings; the table is not a wiring or load-approval schedule.',
      links: [{ label: 'Browse FAHINT lighting switches', href: '/products/lighting-switches' }]
    },
    {
      type: 'table',
      caption: 'FAHINT lighting switch model comparison',
      columns: ['Model', 'Style / control', 'Catalog rating', 'Control arrangement'],
      rows: [
        [{ label: 'DS15', href: '/products/lighting-switches/ds15' }, 'Paddle / single-pole', '15A, 120/277V AC', 'One location'],
        [{ label: 'DS15.3', href: '/products/lighting-switches/ds15-3' }, 'Paddle / 3-way', '15A, 120/277V AC', 'Two-location circuit'],
        [{ label: 'DS1502', href: '/products/lighting-switches/ds1502' }, 'Two single-pole rockers', '15A, 120/277V AC', 'Separate loads in one device'],
        [{ label: 'DS1503', href: '/products/lighting-switches/ds1503' }, 'Three single-pole rockers', '15A, 120/277V AC', 'Separate loads in one device'],
        [{ label: 'T15', href: '/products/lighting-switches/t15' }, 'Toggle / single-pole', '15A, 125V AC', 'One location'],
        [{ label: 'T15.3', href: '/products/lighting-switches/t15-3' }, 'Toggle / 3-way', '15A, 125V AC', 'Two-location circuit']
      ]
    },
    { type: 'h2', text: 'Check the load as well as the voltage' },
    {
      type: 'p',
      text: 'Write the supply voltage and intended load type in the inquiry. A shared 15A rating does not make the 125V and 120/277V models interchangeable. For LED drivers, motors or other loads with specific switching requirements, send the equipment details for review against the exact switch documentation.'
    },
    {
      type: 'p',
      text: 'For a combination model, do not multiply the 15A label by the number of rockers. The table does not establish an independent full-load allowance for every rocker. Ask for the approved per-circuit and combined-load limits, terminal requirements and installation instructions for the selected device.'
    },
    {
      type: 'p',
      text: 'These six models provide on/off switching, not brightness control. If the brief calls for dimming, compare the dimmer with the actual lamp or driver, including its control method and load rating.',
      links: [{ label: 'Read the dimmer buying guide', href: '/blog/dimmer-buying-guide-led-0-10v' }]
    },
    { type: 'h2', text: 'Pair the switch with its wallplate' },
    {
      type: 'p',
      text: 'Check the device opening before choosing a wallplate: a paddle and a traditional toggle need different openings. For DS1502 and DS1503, review the single-gang combination device, not a two- or three-gang plate selected from the button count. Use the product dimensions and a sample to check the complete pairing.'
    },
    {
      type: 'p',
      text: 'Specify the plate model, color and glossy or matte surface alongside the switch finish. Compare the samples together, including their edges. Also state whether the wallplate should be packed with the switch or supplied separately; the product photograph alone does not define the pack contents.',
      links: [{ label: 'Read the wallplate buying guide', href: '/blog/wallplate-buying-guide' }]
    },
    { type: 'h2', text: 'Request documents for the exact model' },
    {
      type: 'p',
      text: 'The supplied October 18, 2024 UL report E528137-20241016 names DS15, DS15.3 and T15 in its addendum. T15.3 is not named in that file, so request its corresponding record. A missing name in this particular PDF is not a finding that the product has no certification.'
    },
    {
      type: 'p',
      text: 'The original product entries for DS1502 and DS1503 cite ETL file E5033770. We do not yet have the corresponding ETL certificate PDF in this library. Request that document for the selected model; the UL switch addendum is not a substitute.'
    },
    {
      type: 'p',
      text: 'Treat the library files as supplied reference documents. Before an order, confirm current listing status, exact model designation and coverage of the requested configuration. Keep the agreed document references with the sample and purchase specification.',
      links: [{ label: 'Review lighting switch product documents', href: '/resources?family=lighting-switches' }]
    },
    { type: 'h2', text: 'What to include in a quotation request' },
    {
      type: 'p',
      text: 'Send one line per model and finish, with quantities split accordingly. If the selection is still open, describe the control arrangement and load instead of guessing a model number.'
    },
    {
      type: 'list',
      label: 'Light switch quotation checklist',
      items: [
        'Model number, paddle or toggle style, and single-pole, 3-way or combination function.',
        'Required control locations and, for combination devices, the load assigned to each rocker.',
        'Supply voltage, load type and connected-load details from the project team.',
        'Switch finish, matching wallplate model and sample references for the pairing.',
        'Quantity by configuration, destination market and requested delivery date.',
        'Individual or bundled packs, labeling and any authorized private-label artwork.',
        'Required model documents, approved instructions and checks to complete before sample approval.'
      ]
    },
    {
      type: 'p',
      text: 'Use the selected product page to start a model-specific inquiry, or send an unresolved selection question using the contact link below. Sample arrangements, minimum quantities and lead times are confirmed in the quotation.'
    }
  ]
};
