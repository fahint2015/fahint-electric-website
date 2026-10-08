// Primary industry references explain terms; FAHINT records supply model specifications.
export const receptacleBuyingGuide = {
  slug: 'standard-receptacle-buying-guide',
  title: 'Standard receptacle buying guide: ratings, TR/WR and wiring',
  excerpt: 'Compare FAHINT standard receptacle ratings, TR/WR features and terminal types. Check model documents and prepare a quotation with the right wallplate and finish.',
  date: '2026-10-07',
  updated: '2026-10-07',
  readMinutes: 7,
  category: 'Buying Guide',
  cover: 'assets/images/lines/receptacle-series-desk-power-v1.webp',
  coverAlt: 'A white duplex receptacle beside a desk lamp on a blue wall in an illustrated room.',
  coverCaption: 'Illustrated receptacle setting. Use the exact model documents to confirm ratings, terminals and installation requirements.',
  coverSource: 'Existing FAHINT receptacle illustration: lines/receptacle-series-desk-power-v1.webp',
  coverWidth: 1920,
  coverHeight: 450,
  sources: [
    {
      label: 'Legrand: residential outlet selection guide (industry reference)',
      href: 'https://www.legrand.us/faq/residential-outlets'
    },
    {
      label: 'Leviton: straight-blade receptacles and NEMA configurations (industry reference)',
      href: 'https://leviton.com/products/commercial/straight-blade-receptacles'
    },
    {
      label: 'Leviton: back wiring and side wiring (industry reference)',
      href: 'https://leviton.com/support/literature/blogs/back-wiring-vs-side-wiring'
    },
    {
      label: 'Leviton: tamper-resistant shutter function (industry reference)',
      href: 'https://leviton.com/support/resources/infographics/tamper-resistant'
    },
    {
      label: 'FAHINT standard receptacle models and original specification references',
      href: '/products/receptacles'
    },
    {
      label: 'FAHINT catalog (PDF pages 15-18) and original receptacle certificate',
      href: '/resources?family=receptacles'
    },
    {
      label: 'Leviton 5325-GY: terminal-specific conductor requirements (industry reference)',
      href: 'https://leviton.com/products/5325-gy'
    }
  ],
  body: [
    {
      type: 'p',
      text: 'R15 and R15Q share a front-face image in the FAHINT catalog, but their terminals differ. R15 is listed for side/back wiring; R15Q for side/push-in quick wiring. A purchasing list based on the photograph would miss that difference.'
    },
    {
      type: 'p',
      text: 'Keep the complete model number on each order line. Use the guide below to compare the electrical configuration, protection features and terminals, then specify the finish and matching plate. The examples come from our published model records and product catalog.'
    },
    { type: 'h2', text: 'Start with the rating and NEMA configuration' },
    {
      type: 'p',
      text: 'A NEMA designation identifies a particular plug and receptacle configuration. Leviton organizes its receptacles by these configurations as well as by current and voltage. Put all three fields in the purchasing brief; a matching color or similar face is not enough to identify a replacement.',
      source: 1
    },
    {
      type: 'p',
      text: 'For example, FAHINT D15 is listed as 15A, 125V AC, NEMA 5-15R. D20 is 20A, 125V AC, NEMA 5-20R. The project electrician should confirm the required configuration against the circuit, equipment and adopted local code. A 20A face is not an automatic upgrade for any existing outlet.'
    },
    {
      type: 'p',
      text: 'The industrial range is listed separately on catalog PDF page 17: CR15 is 15A, 125V/250V; CR20 and CD20 are 20A, 125V/250V. All three use side/back wiring. These published ratings do not establish interchangeable plug configurations. Match the ordered device to its face photograph and approved specification; these models are not part of the 125V comparison below.',
      links: [
        { label: 'Review CR15 references', href: '/products/receptacles/cr15' },
        { label: 'Review CR20 references', href: '/products/receptacles/cr20' },
        { label: 'Review CD20 specifications', href: '/products/receptacles/cd20' }
      ]
    },
    { type: 'h2', text: 'Keep TR, WR and GFCI requirements separate' },
    {
      type: 'p',
      text: 'TR means tamper-resistant. The device uses internal shutters to restrict access to its contacts by foreign objects. This is a physical feature of the receptacle; it does not describe its current rating. Leviton explains the shutter function in its tamper-resistant reference.',
      source: 3
    },
    {
      type: 'p',
      text: 'WR means weather-resistant. For an outdoor or damp location, check the cover and enclosure as well as the receptacle. Legrand treats outdoor location and electrical protection as separate selection questions. Have the installer confirm the required assembly, including protection while a plug is connected where applicable.',
      source: 0
    },
    {
      type: 'p',
      text: 'TR and WR features do not provide GFCI protection. The standard receptacles in this guide have no built-in GFCI function. Where the project requires ground-fault protection, ask the electrician to confirm how it will be provided. FAHINT GFCI models have their own selection and documentation pages.',
      links: [
        { label: 'Compare FAHINT GFCI models', href: '/products/gfci' },
        { label: 'Read about weather-resistant devices and covers', href: '/blog/nec-406-8-weather-resistant-receptacles' }
      ]
    },
    { type: 'h2', text: 'Compare these FAHINT 125V models' },
    {
      type: 'p',
      text: 'The table shows ten examples, not the entire range. D/DT/DW models have decorator faces; R/RT/RW models have traditional duplex faces. DT and RT add TR; DW and RW have both TR and WR. The commercial range uses C, CT and CW designations. Ratings and terminal types follow catalog PDF pages 15–17.',
      links: [{ label: 'Browse all standard receptacle models', href: '/products/receptacles' }]
    },
    {
      type: 'table',
      caption: 'FAHINT 125V receptacle comparison',
      columns: ['Model', 'Face / protection features', 'Published rating', 'Terminals'],
      rows: [
        [{ label: 'D15', href: '/products/receptacles/d15' }, 'Decorator / non-TR, non-WR', '15A, 125V AC', 'Side / back wire'],
        [{ label: 'D15Q', href: '/products/receptacles/d15q' }, 'Decorator / non-TR, non-WR', '15A, 125V AC', 'Side / push-in quick wire'],
        [{ label: 'D20', href: '/products/receptacles/d20' }, 'Decorator / non-TR, non-WR', '20A, 125V AC', 'Side / back wire'],
        [{ label: 'DT15', href: '/products/receptacles/dt15' }, 'Decorator / TR', '15A, 125V AC', 'Side / back wire'],
        [{ label: 'DW20', href: '/products/receptacles/dw20' }, 'Decorator / TR + WR', '20A, 125V AC', 'Side / back wire'],
        [{ label: 'R15', href: '/products/receptacles/r15' }, 'Duplex / non-TR, non-WR', '15A, 125V AC', 'Side / back wire'],
        [{ label: 'R15Q', href: '/products/receptacles/r15q' }, 'Duplex / non-TR, non-WR', '15A, 125V AC', 'Side / push-in quick wire'],
        [{ label: 'RT20', href: '/products/receptacles/rt20' }, 'Duplex / TR', '20A, 125V AC', 'Side / back wire'],
        [{ label: 'RW20', href: '/products/receptacles/rw20' }, 'Duplex / TR + WR', '20A, 125V AC', 'Side / back wire'],
        [{ label: 'CT15', href: '/products/receptacles/rt15-c' }, 'Commercial duplex / TR', '15A, 125V AC', 'Side / back wire']
      ]
    },
    { type: 'h2', text: 'Check the terminal type before comparing prices' },
    {
      type: 'p',
      text: 'Back-wire and push-in quick-wire are different terminal descriptions. In Leviton\'s explanation, a back-wire connection uses a screw-operated clamp, while side wiring uses the side terminal screw. That reference explains the terms; use FAHINT\'s approved instructions to establish the connection details for a FAHINT device.',
      source: 2
    },
    {
      type: 'p',
      text: 'The Q versions are listed for side/push-in quick wiring. Their non-Q counterparts list side/back wiring. Catalog PDF page 18 marks the 15A push-in terminal “#14 AWG Only”; that limit is not a side/back-terminal specification. Confirm conductor material, solid or stranded suitability, strip length and terminal torque in the approved instructions for the chosen connection.'
    },
    {
      type: 'p',
      text: 'Leviton’s 5325 specification lists conductor requirements for its side terminals and Quickwire terminals separately. Use that distinction when requesting FAHINT documents: ask which conductor requirements apply to each terminal, rather than one wire-size range for the whole device. The Leviton limits are not installation specifications for FAHINT.',
      source: 6
    },
    { type: 'h2', text: 'Approve the receptacle and wallplate together' },
    {
      type: 'p',
      text: 'Both traditional and decorator styles can have two receptacle positions. The plate opening differs: a traditional duplex plate has two shaped openings, while a decorator plate has one rectangular opening. Match the device and plate drawings, then check the assembled sample.'
    },
    {
      type: 'p',
      text: 'Specify color and surface finish separately, and compare the plate with the device under the intended lighting. Keep the approved pairing with the order record. State whether plates should be packed with the devices or supplied separately; a photograph with a plate does not define the pack contents.',
      links: [{ label: 'Read the wallplate buying guide', href: '/blog/wallplate-buying-guide' }]
    },
    { type: 'h2', text: 'Match the document to the complete model number' },
    {
      type: 'p',
      text: 'The supplied December 13, 2021 report E498095-20211123 names 18 receptacle models in its addendum: D15, D15Q, D20, DT15, DT15Q, DT20, DW15, DW15Q, DW20, R15, R15Q, R20, RT15, RT15Q, RT20, RW15, RW15Q and RW20. The US and Canadian model lists are on PDF pages 2 and 4.'
    },
    {
      type: 'p',
      text: 'The commercial C/CT/CW range, CR15, CR20 and CD20 are not named in that addendum. Request their matching records; a shared E498095 file number does not establish exact-model coverage. A missing PDF in this library does not mean that a model is uncertified. Confirm current listing status and the ordered configuration with the issuing body and our team.'
    },
    {
      type: 'p',
      text: 'Use the catalog names for commercial orders: C15/C15Q/C20 are standard, CT15/CT15Q/CT20 add TR, and CW15/CW15Q/CW20 add TR and WR. Keep the Q suffix when requesting push-in terminals. Updating a website model name does not extend the scope of an existing certificate.'
    },
    {
      type: 'p',
      text: 'Open the full certificate from Resources, then follow the selected model page for its available drawings. R15, R15Q and R20 now include the shared receptacle range drawing: 33.2 mm width, 106 mm overall height and 23.8 mm depth. It is a dimensional reference, not proof of TR/WR features or a substitute for the exact model\'s approved installation drawing.',
      links: [{ label: 'Review receptacle product documents', href: '/resources?family=receptacles' }]
    },
    { type: 'h2', text: 'What to send with a quotation request' },
    {
      type: 'list',
      label: 'Receptacle quotation checklist',
      items: [
        'Complete catalog model designation, including any Q suffix, with quantity on each order line.',
        'Required current, voltage and NEMA configuration from the project specification.',
        'TR and WR requirements, intended location, and the project\'s separate GFCI protection requirement.',
        'Terminal type and conductor requirements supplied by the installation team.',
        'Device finish, matching wallplate model and approved sample references.',
        'Destination market, requested timing, pack contents and authorized branding artwork.',
        'Current model documents, approved drawings and any designation or rating questions to resolve before sample approval.'
      ]
    },
    {
      type: 'p',
      text: 'Start an inquiry from a model page to carry its model number into the form. For an unresolved selection, use the product-question link below and include the specification details in your message. Sample arrangements, minimum quantities and lead times are confirmed in the quotation.'
    }
  ]
};
