// Buyer guide based on primary references and the published FAHINT wallplate records.
export const wallplateBuyingGuide = {
  slug: 'wallplate-buying-guide',
  title: 'Wallplate Buying Guide: Openings, Sizes and Finishes',
  excerpt: 'Compare wallplate openings, gang counts, exterior sizes and finishes. Use FAHINT model examples and a practical checklist to prepare a quotation request.',
  date: '2026-10-06',
  updated: '2026-10-07',
  readMinutes: 6,
  category: 'Buying Guide',
  cover: 'assets/images/editorial-home/category-wallplates-scene.webp',
  coverAlt: 'Single- and multi-gang wallplates arranged on a dark display surface in an illustrated scene.',
  coverCaption: 'Illustrated wallplate configurations. Confirm the selected model’s dimensions, material and finish from its product documents and sample.',
  coverSource: 'Existing FAHINT wallplate illustration: editorial-home/category-wallplates-scene.webp',
  coverWidth: 1600,
  coverHeight: 900,
  sources: [
    {
      label: 'Leviton: residential wallplate sizes and styles (industry reference)',
      href: 'https://leviton.com/products/residential/wallplates'
    },
    {
      label: 'Legrand: radiant screwless wallplate and mounting components (industry reference)',
      href: 'https://www.legrand.us/wiring-devices/radiant-collection/wall-plates/radiant-1-gang-screwless-wall-plate-white/p/rwp26wcc10'
    },
    {
      label: 'FAHINT wallplate configurations and model references',
      href: '/products/wallplates'
    },
    {
      label: 'FAHINT BS1801 specifications and dimension drawing',
      href: '/products/wallplates/bs1801'
    },
    {
      label: 'FAHINT BS1802 specifications and dimension drawing',
      href: '/products/wallplates/bs1802'
    },
    {
      label: 'FAHINT BS1803-G specifications and dimension drawing',
      href: '/products/wallplates/bs1803-g'
    }
  ],
  body: [
    {
      type: 'p',
      text: 'Choose the wallplate with the device it will surround. Start with the opening and gang count, then check the exterior dimensions, fixing style and finish. A request for a white, one-gang plate leaves several of those decisions unanswered.'
    },
    {
      type: 'p',
      text: 'For a mixed product order, put the wallplate model beside each switch or receptacle model in your purchasing list. That gives both sides a specific pairing to review before samples and packaging are approved.'
    },
    { type: 'h2', text: 'Match the device opening' },
    {
      type: 'p',
      text: 'Decorator, duplex and toggle describe different device openings. A decorator plate has a rectangular opening; a traditional duplex plate has two shaped receptacle openings; a toggle plate has a smaller opening for the switch lever. A blank plate has no device opening. FAHINT examples are BS1801, BS1804, BS1806 and BS1807 respectively.'
    },
    {
      type: 'p',
      text: 'Use those names to narrow the range, then compare the intended device with the plate drawing. Include the device model in your inquiry even if the opening looks familiar. A front photograph cannot establish the mounting fit or clearance behind the plate.',
      links: [{ label: 'Read the standard receptacle buying guide', href: '/blog/standard-receptacle-buying-guide' }]
    },
    { type: 'h2', text: 'Count the device mounting positions' },
    {
      type: 'p',
      text: 'Gang count refers to device mounting positions side by side. Two buttons on one switch do not necessarily require a two-gang plate. Count the device positions in the planned arrangement and check the opening required at each position.'
    },
    {
      type: 'p',
      text: 'The FAHINT range includes one- through four-gang decorator configurations. BS18012 is a two-gang screw-fixed example; the BS1803 screwless series also has separate multi-gang models. If a project combines different opening types, send the arrangement for review. The published decorator options do not establish availability of every mixed-opening plate.',
      links: [{ label: 'Browse all FAHINT wallplate configurations', href: '/products/wallplates' }]
    },
    { type: 'h2', text: 'Check the exterior size separately' },
    {
      type: 'p',
      text: 'Exterior width and height measure the plate’s outer edges. The device opening is a separate measurement. A larger outer frame may provide more wall coverage, but it does not resolve an opening or mounting mismatch.'
    },
    {
      type: 'p',
      text: 'Leviton separates size from style in its wallplate selector. That is a useful way to organize a purchasing brief: record the opening first, then the outside dimensions. Use FAHINT’s own drawings for a FAHINT order; size labels from another brand are not a dimension specification.',
      source: 0
    },
    {
      type: 'p',
      text: 'BS1801 is the standard 70 × 115 mm plate; BS1802 is the medium 80 × 124 mm plate. Both supplied product-library drawings show 6.5 mm thickness. They are separate models, not two sizes of BS1802. BS1803-G is a separate screwless configuration at 75 × 120 mm. All sizes here are exterior width × height.'
    },
    { type: 'h2', text: 'Compare eight FAHINT configurations' },
    {
      type: 'p',
      text: 'These rows summarize selected published configurations. The dimensions are exterior width × height, not opening dimensions. Open the model links for drawings and the rest of the specification. This table is a shortlist, not a cross-brand compatibility list.'
    },
    {
      type: 'table',
      caption: 'FAHINT wallplate configuration comparison',
      columns: ['Model', 'Opening / gangs', 'Finish / fixing', 'Exterior W × H (mm)'],
      rows: [
        [{ label: 'BS1801', href: '/products/wallplates/bs1801' }, 'Decorator / 1', 'Glossy / Screw-fixed', '70 × 115 mm'],
        [{ label: 'BS1802', href: '/products/wallplates/bs1802' }, 'Mid-Size Decorator / 1', 'Glossy / Screw-fixed', '80 × 124 mm'],
        [{ label: 'BS1804', href: '/products/wallplates/bs1804' }, 'Duplex / 1', 'Glossy / Screw-fixed', '70 × 115 mm'],
        [{ label: 'BS1806', href: '/products/wallplates/bs1806' }, 'Toggle / 1', 'Glossy / Screw-fixed', '70 × 115 mm'],
        [{ label: 'BS1807', href: '/products/wallplates/bs1807' }, 'Blank / 1', 'Glossy / Screw-fixed', '70 × 115 mm'],
        [{ label: 'BS18012', href: '/products/wallplates/bs18012' }, 'Decorator / 2', 'Glossy / Screw-fixed', '116 × 115 mm'],
        [{ label: 'BS1803-G', href: '/products/wallplates/bs1803-g' }, 'Decorator / 1', 'Glossy / Screwless', '75 × 120 mm'],
        [{ label: 'BS1803-M', href: '/products/wallplates/bs1803-m' }, 'Decorator / 1', 'Matte / Screwless', '75 × 120 mm']
      ]
    },
    { type: 'h2', text: 'Specify the fixing style and pack contents' },
    {
      type: 'p',
      text: 'Decide whether the finished face should show fixing screws. For a screwless model, ask which mounting components it needs and which are supplied. The appearance of the face does not tell you what belongs in the pack.'
    },
    {
      type: 'p',
      text: 'Legrand’s radiant screwless plate, for example, uses subplate screws and has a stated device-series fit. This illustrates why the mounting parts and approved pairing need checking even when the face has no visible screws. It does not establish the construction or compatibility of a FAHINT plate.',
      source: 1
    },
    {
      type: 'p',
      text: 'For your FAHINT quotation, request confirmation of the faceplate, any required backplate and fixing hardware. State whether plates are ordered separately or packed with devices. Agree on the pack contents before comparing unit prices.'
    },
    { type: 'h2', text: 'Approve the finish and the complete pairing' },
    {
      type: 'p',
      text: 'Glossy and matte describe the surface appearance. Compare the plate and device samples together under the intended lighting, including the visible edge profile. Keep the approved samples or their agreed references with the order. A shared color name or a screen image is not enough to approve a match.',
      links: [{ label: 'Prepare a device and wallplate finish specification', href: '/blog/gfci-colour-finishes-specification' }]
    },
    {
      type: 'p',
      text: 'Use the full website model and write the finish separately. Some screw-fixed matte entries, such as BS1801-M, use a website suffix to distinguish them from a glossy entry with the same original base model. BS1803-G and BS1803-M have distinct G and M source designations. Keep those suffixes when requesting the screwless models.'
    },
    {
      type: 'p',
      text: 'FAHINT’s wallplate material reference identifies polycarbonate (PC) for these plates. Glossy and matte are surface finishes, not two different materials. BS1801 is shown in both finishes; BS1802 is shown in glossy. Specify the material, size and finish as separate fields, and include any additional performance requirement before approving the sample.'
    },
    {
      type: 'p',
      text: 'The library contains two supplied wallplate reports. E501377-20181016, issued August 16, 2022, names base models BS1801, BS1802, BS1803 and BS1804. E501377-20230919, issued September 25, 2023, names BS1806, BS1807, BS18012, BS18013, BS18014, BS18032, BS18033 and BS18034.'
    },
    {
      type: 'p',
      text: 'Match the base model to the relevant addendum, then confirm the finish designation, current listing status and coverage of the ordered configuration. Website finish suffixes are not proof of an exact certificate designation. Models outside those lists need their corresponding documentation.',
      links: [{ label: 'Review wallplate product documents', href: '/resources?family=wallplates' }]
    },
    { type: 'h2', text: 'Prepare a wallplate quotation request' },
    {
      type: 'p',
      text: 'Send one line per model and finish, with quantities split accordingly. Include the following details so the quotation can address the intended pairing and pack:'
    },
    {
      type: 'list',
      label: 'Wallplate quotation checklist',
      items: [
        'Wallplate model, opening type and gang count, plus the matching device model and drawing.',
        'Exterior size limits and any fit constraints identified by the project team.',
        'Screw-fixed or screwless style, with the required backplate and fixing hardware confirmed.',
        'Color, glossy or matte finish, and the sample reference for the plate and device together.',
        'Quantity by configuration, destination market and requested delivery date.',
        'Separate or device-matched packs, labeling and any authorized brand artwork.',
        'Material, thickness, required model documents and the sample checks to agree before ordering.'
      ]
    },
    {
      type: 'p',
      text: 'Start a model-specific inquiry from the wallplate’s product page. If the pairing needs review, use “Ask a product question” below and include the device details. Sample arrangements, customization, minimum quantities and lead times are confirmed in the quotation.'
    }
  ]
};
