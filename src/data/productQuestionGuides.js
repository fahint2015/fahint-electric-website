// Focused follow-ups to the series buying guides. Research: docs/ARTICLE-RESEARCH-2026-10-22.md.
export const productQuestionGuides = [
  {
    slug: 'what-is-blank-face-gfci',
    title: 'What is a blank-face GFCI?',
    excerpt: 'A blank-face GFCI has test and reset buttons but no plug sockets. See how it differs from a receptacle and what to check when specifying GL20.',
    date: '2026-10-22',
    readMinutes: 3,
    category: 'Technical Guide',
    cover: 'assets/images/products/gl20-feature-application-v1.jpg',
    coverAlt: 'Blank-face GFCI with test and reset buttons on a wall beside an equipment enclosure.',
    coverCaption: 'Illustrated blank-face GFCI setting. The image does not establish approval for the adjacent equipment.',
    coverSource: 'Existing FAHINT GL20 application illustration: products/gl20-feature-application-v1.jpg',
    sources: [
      { label: 'Leviton: blank-face GFCI overview', href: 'https://leviton.com/products/residential/gfci/blank-face' },
      { label: 'FAHINT GL20 model specifications', href: '/products/gfci/gl20' },
      { label: 'FAHINT original certification documents', href: '/resources#certifications' }
    ],
    body: [
      { type: 'p', text: 'A blank-face GFCI provides ground-fault protection without a place to insert a plug. Its front has TEST and RESET buttons. You may also see it called a faceless or dead-front GFCI. The protected equipment is connected elsewhere in the circuit, as specified in the device instructions.', source: 0 },
      { type: 'p', text: 'That explains the unusual appearance of FAHINT GL20. It belongs in a specification that calls for a separate protective device. If the drawing calls for a plug-in outlet at that location, a blank-face model will leave that requirement unmet.' },
      { type: 'h2', text: 'Why separate protection from the plug-in point?' },
      { type: 'p', text: 'A project may need the protection and its test/reset controls in one place, with the equipment or outlet it protects elsewhere. Leviton describes downstream protection as a use for this device format. “Downstream” means electrically connected through the protective device; it does not mean every outlet farther along the wall.', source: 0 },
      { type: 'p', text: 'For a buyer, the useful document is a marked-up device schedule from the project electrician. It should identify which load the GFCI protects and where someone will reach the controls. A room name alone, such as “utility room,” leaves both questions open. Have the project team approve the arrangement and access before placing the order.' },
      { type: 'h2', text: 'A blank face, a blank wallplate and a receptacle are different items' },
      { type: 'table', caption: 'Three items that can appear on a wiring-device schedule', columns: ['Item', 'What is on the front', 'What to specify'], rows: [
        ['Blank-face GFCI', 'TEST / RESET controls, no plug sockets', 'The protective device and intended load'],
        ['GFCI receptacle', 'Plug sockets and TEST / RESET controls', 'The receptacle rating and required protection features'],
        ['Blank wallplate', 'A plain cover', 'The plate dimensions and mounting arrangement; it provides no GFCI function']
      ] },
      { type: 'p', text: 'Keep those descriptions separate in a bill of materials. “Blank GFCI plate” is ambiguous: the supplier could read it as a cover, an accessory or a complete device. Use the model number and state whether the wallplate is included in the required pack.' },
      { type: 'h2', text: 'What the GL20 record tells you' },
      { type: 'p', text: 'GL20 is listed in FAHINT’s product record as a 20A, 125V blank-face self-test GFCI with side and back wiring. The record identifies indoor use and does not list weather resistance. Its current rating and appearance do not establish suitability for every appliance or outdoor application.', source: 1 },
      { type: 'p', text: 'GL20’s exact-model certification documentation remains under review in our library. Request that record for your project; a certificate covering a different GFCI model is not evidence that GL20 is included. The model page also needs to be read alongside the approved installation instructions, particularly when the drawing calls for a specific load arrangement.' },
      { type: 'h2', text: 'What to put on the order line' },
      { type: 'p', text: 'Start with “GL20, 20A, 125V, blank-face GFCI,” then add the finish, wallplate configuration and quantity. Attach the project’s intended load and installation location for review. If a sample is required, ask for the same full model and pack configuration that will be supplied in production.' },
      { type: 'p', text: 'For a specification that needs plug sockets at the device, compare the receptacle models in the same family. The broader sourcing guide explains how to review their individual ratings and documentation.', links: [
        { label: 'View GL20', href: '/products/gfci/gl20' },
        { label: 'GFCI sourcing guide', href: '/blog/how-to-source-ul-listed-gfci-from-china' }
      ] }
    ]
  },
  {
    slug: 'usb-c-wall-outlet-laptop-charging',
    title: 'Can a USB-C wall outlet charge a laptop?',
    excerpt: 'Check the laptop’s power requirement, the outlet’s USB-C profiles and the cable. A 65W marking alone does not tell you what happens with two devices connected.',
    date: '2026-10-22',
    readMinutes: 4,
    category: 'Buying Guide',
    cover: 'assets/images/home-installations/ftr15qc-dc65w-desk-installed-v1.webp',
    coverAlt: 'A dual USB-C wall outlet charging a phone on a desk in an illustrated interior.',
    coverCaption: 'Illustrated USB-C charging setup. A phone charging scene does not establish compatibility with a laptop.',
    coverSource: 'Existing FAHINT illustration: home-installations/ftr15qc-dc65w-desk-installed-v1.webp',
    sources: [
      { label: 'Legrand: USB-C Power Delivery applications', href: 'https://www.legrand.ca/solutions/usb-charging/usb-c-power-delivery' },
      { label: 'Apple: choosing a power adapter for a Mac', href: 'https://support.apple.com/en-us/109509' },
      { label: 'Apple: charging a Mac laptop', href: 'https://support.apple.com/en-us/102397' },
      { label: 'FAHINT FTR15QC-DC65W output profiles', href: '/products/usb-outlets/ftr15qc-dc65w' },
      { label: 'FAHINT USB catalog sheet, original page 11', href: '/assets/documents/catalog-sheets/pd-usb-outlets.pdf' }
    ],
    body: [
      { type: 'p', text: 'Yes, a USB-C wall outlet can charge a laptop when the laptop accepts USB-C charging and the outlet and cable meet its requirements. Some manufacturers, including Legrand, offer wall outlets for this use. That is a useful starting point, but it is not a compatibility result for a different outlet or computer.', source: 0 },
      { type: 'p', text: 'For an office desk, write down the laptop model before choosing the outlet. “USB-C laptop” is too broad to be a purchasing specification. The same question comes up in guest rooms, where the property may want a convenient charging point without promising that it replaces every guest’s power adapter.' },
      { type: 'h2', text: 'Start with the laptop’s recommended charging power' },
      { type: 'p', text: 'Check the computer manufacturer’s charging guidance and the rating of the recommended adapter. Apple, for example, specifies USB Power Delivery for USB-C charging and recommends a source that meets at least the minimum wattage for the Mac model. Its recommendations differ by computer.', source: 1 },
      { type: 'p', text: 'A connected computer can show a charging symbol and still charge more slowly than expected. Apple documents a slow-charger warning when the available power is too low for the model. Use the actual laptop and its intended workload when assessing a sample, rather than recording only whether the battery icon changes.', source: 2 },
      { type: 'h2', text: 'Read the voltage and current profiles behind “65W”' },
      { type: 'p', text: 'The published FTR15QC-DC65W record lists the following USB-C output profiles. The largest is 20V at 3.25A, which gives 65W. These are available output profiles, not a statement that every connected device draws 65W.', source: 3 },
      { type: 'table', caption: 'FTR15QC-DC65W published USB-C profiles', columns: ['Voltage', 'Current', 'Calculated power'], rows: [
        ['5V', '3A', '15W'], ['9V', '3A', '27W'], ['12V', '3A', '36W'], ['15V', '3A', '45W'], ['20V', '3.25A', '65W']
      ] },
      { type: 'p', text: 'Compare that list with the computer’s accepted charging input and use a cable rated for the required power. The outlet’s 15A, 125V receptacle rating is a separate AC specification. It does not describe the power available from its USB ports.' },
      { type: 'h2', text: 'What changes when someone plugs in a phone?' },
      { type: 'p', text: 'FTR15QC-DC65W has two USB-C ports. Its listed figures are single-port maximums; they do not establish a combined 130W output. The current catalog does not give a complete simultaneous-use power allocation table. Ask for that table before approving laptop-and-phone charging as a project requirement.' },
      { type: 'p', text: 'Make the sample check match the desk. First record the laptop charging on its own. Then connect the phone to the second port and record the laptop’s reported charging status and any interruption. Keep the cable model, computer model and battery state with the result so the supplier can reproduce the conditions. This is a proposed acceptance check, not a test result for the FAHINT model.' },
      { type: 'h2', text: 'Specify a useful charging point without overpromising' },
      { type: 'p', text: 'For a managed office, you can name the exact computers the outlet must support. For a hotel, decide whether the brief is phone charging, occasional laptop charging or a verified replacement for a particular adapter. Those are different acceptance requirements, even if the front of the outlet looks the same.' },
      { type: 'p', text: 'A useful inquiry would be: “Please review FTR15QC-DC65W for this laptop model and cable. We need the available power with the laptop alone and with a phone on the second port.” Attach the laptop’s charging specification. This gives us something concrete to check before the sample order.', links: [
        { label: 'View FTR15QC-DC65W', href: '/products/usb-outlets/ftr15qc-dc65w' },
        { label: 'Compare USB outlet configurations', href: '/blog/usb-wall-outlet-buying-guide' }
      ] }
    ]
  },
  {
    slug: 'back-wire-vs-push-in-outlets',
    title: 'Back wire vs push-in outlets: what changes?',
    excerpt: 'A hole in the back of a receptacle does not identify its terminal mechanism. Compare screw-clamp back wiring, push-in wiring and FAHINT R15 / R15Q.',
    date: '2026-10-22',
    readMinutes: 3,
    category: 'Technical Guide',
    cover: 'assets/images/editorial-home/product-receptacle-optimized.webp',
    coverAlt: 'A receptacle between lighting controls in a dark wallplate, shown in an interior illustration.',
    coverCaption: 'Illustrated receptacle setting. A front view does not identify the terminals behind the device.',
    coverSource: 'Existing FAHINT illustration: editorial-home/product-receptacle-optimized.webp',
    sources: [
      { label: 'Leviton: back wiring vs side wiring', href: 'https://leviton.com/support/literature/blogs/back-wiring-vs-side-wiring' },
      { label: 'Leviton: Quickwire terminology', href: 'https://leviton.com/support/resources/product-support/dimmers-and-switches/articles/4402132021915-Video-How-to-Wire-a-Device-Using-the-Quickwire-Method' },
      { label: 'FAHINT receptacle catalog, pages 15 to 18', href: '/assets/documents/fahint-product-catalog.pdf#page=15' },
      { label: 'FAHINT R15Q terminal specification', href: '/products/receptacles/r15q' }
    ],
    body: [
      { type: 'p', text: 'Back wire and push-in can describe different terminal mechanisms, even though both accept a conductor from the rear of the device. With a screw-clamp back-wire terminal, tightening the screw secures the conductor under a clamp. A push-in terminal holds the conductor through its internal spring mechanism. Check the exact terminal description instead of treating the rear hole as the specification.', source: 0 },
      { type: 'p', text: 'This distinction matters when ordering R15 and R15Q. FAHINT’s source library uses the same front-face presentation for the two models, but the catalog lists different wiring versions. A purchasing comparison based on that photograph would miss the difference.' },
      { type: 'h2', text: 'Three terms you will see in a catalog' },
      { type: 'table', caption: 'Wiring terminology for receptacle selection', columns: ['Term', 'What it describes', 'What the name leaves open'], rows: [
        ['Screw-clamp back wire', 'A rear-entry conductor secured by a screw-operated clamp', 'Permitted conductor sizes and types, strip length and torque'],
        ['Push-in / quick wire', 'A push-in conductor connection retained by the terminal mechanism', 'The exact conductor limits for that push-in terminal'],
        ['Side wire', 'A conductor connection at a side screw terminal', 'The approved conductor and tightening requirements']
      ] },
      { type: 'p', text: 'Leviton uses Quickwire for its push-in method and also refers to it as backstab. That brand terminology helps explain why a request for “back wiring” can be misunderstood. For a FAHINT order, use the catalog wording and full model number.', source: 1 },
      { type: 'h2', text: 'R15 and R15Q share a rating, not a terminal specification' },
      { type: 'p', text: 'Both R15 and R15Q are listed as 15A, 125V standard duplex receptacles. R15 has side/back wiring. R15Q has side/push-in quick wiring. The Q therefore identifies a purchasing difference that should stay on the order line, sample label and packing specification.', source: 2 },
      { type: 'p', text: 'The published push-in limit for the 15A version is #14 AWG only. It is a limit for that terminal, not a general rule for every side or back terminal in the series. Do not use it to approve a different conductor material or a stranded conductor; those details need the exact model instructions.', source: 3 },
      { type: 'p', text: 'D15Q is a decorator-format example with the same published #14 AWG push-in limit. Its face requires a different wallplate opening from the duplex R15Q. Keep the front configuration and terminal configuration as two separate fields in a comparison.' },
      { type: 'h2', text: 'Ask for a rear view with the sample' },
      { type: 'p', text: 'If two quotations use similar front images, ask each supplier to identify the rear and side terminals on the quoted sample. Include the model marking in the photograph. This is useful evidence for purchasing; it does not replace the installer’s review of the approved instructions.' },
      { type: 'p', text: 'Your technical team can then check the required conductor size and type against that version. Record any mismatch before approval. Do not resolve it by dropping the model suffix or accepting a claim that all 15A receptacles use the same terminals.' },
      { type: 'h2', text: 'Keep the wiring version visible in the specification' },
      { type: 'p', text: 'A clear line would read “R15Q, 15A 125V, duplex, side/push-in quick wire,” followed by finish and quantity. If the project calls for back-wire clamps, review R15 instead and confirm its instructions. The broader guide covers the other decisions, including tamper resistance and matching wallplates.', links: [
        { label: 'Compare R15', href: '/products/receptacles/r15' },
        { label: 'Compare R15Q', href: '/products/receptacles/r15q' },
        { label: 'Standard receptacle buying guide', href: '/blog/standard-receptacle-buying-guide' }
      ] }
    ]
  },
  {
    slug: 'led-lights-flicker-on-dimmer',
    title: 'Why do LED lights flicker on a dimmer?',
    excerpt: 'Flicker at low brightness can point to a lamp and dimmer mismatch. Record when it happens, check the load specification and evaluate the exact combination.',
    date: '2026-10-22',
    readMinutes: 3,
    category: 'Troubleshooting',
    cover: 'assets/images/editorial-home/category-switches-scene.webp',
    coverAlt: 'White paddle and slide dimmer on a dark wall beside a softly lit room.',
    coverCaption: 'Illustrated dimmer setting. A room photograph cannot establish lamp compatibility or the lowest stable light level.',
    coverSource: 'Existing FAHINT dimmer illustration: editorial-home/category-switches-scene.webp',
    sources: [
      { label: 'Lutron: flickering, buzzing and dropout with LED dimmers', href: 'https://support.lutron.com/us/en/product/maestro/article/troubleshooting/flickering-flashing-led-lights-with-maestro-dimmers' },
      { label: 'FAHINT DM2010 / DM2010S catalog sheet', href: '/assets/documents/catalog-sheets/dm2010-dm2010s.pdf' },
      { label: 'FAHINT DM2010 load specifications', href: '/products/dimmers/dm2010' }
    ],
    body: [
      { type: 'p', text: 'LED lights that flicker on a dimmer may be non-dimmable, incompatible with the control, or operating below their stable dimming range. Those are possible causes, not a diagnosis of the installation. Lutron’s support guidance distinguishes low-level flicker and dropout from other behavior and starts by checking the lamp.', source: 0 },
      { type: 'p', text: 'The first useful detail is when it happens. “It flickers” gives a supplier very little to work with. “These four lamps flicker near the bottom of the slider, but stay steady at full brightness” gives the review a place to start. There is no need to open the wall box to make that observation.' },
      { type: 'h2', text: 'Does the lamp or driver support this dimming method?' },
      { type: 'p', text: 'Find the lamp or fixture model in its paperwork and check for a dimmable designation. Then look for the control method the manufacturer specifies. A 0-10V driver needs a compatible control signal; a conventional line-voltage dimmer is a different choice. “LED compatible” on a dimmer does not establish compatibility with every LED product.' },
      { type: 'p', text: 'FAHINT DM2010 is listed for dimmable LED/CFL loads at 120V AC, 60Hz. DM2010S is the separate 0-10V model, with a 120/277V supply specification. Their similar paddle-and-slider appearance is not a reason to substitute one for the other.', source: 1 },
      { type: 'h2', text: 'Low-end flicker needs a closer look at the usable range' },
      { type: 'p', text: 'An LED may stop behaving steadily before the slider reaches its lowest position. Lutron explains that a low-end adjustment can help on its supported dimmers by keeping the output within the lamp’s usable range. That adjustment and its procedure are model-specific. Do not apply a Maestro button sequence to a FAHINT dimmer.', source: 0 },
      { type: 'p', text: 'During sample approval, define the lowest brightness the room actually needs. Ask the supplier and lighting team to demonstrate stable operation at that level with the proposed lamps. If the combination cannot reach it, review the lamp/control pairing before ordering the full quantity. A catalog wattage range does not provide that demonstration.' },
      { type: 'h2', text: 'Check the LED rating, even when the watts look low' },
      { type: 'p', text: 'DM2010’s published LED/CFL range is 5 to 200W. Its incandescent range is 20 to 600W. The 600W figure should not be used as the LED limit.', source: 2 },
      { type: 'p', text: 'For example, four 10W dimmable LED lamps add up to 40W. That is within the stated LED wattage range, but the arithmetic alone cannot establish how that lamp model will dim. The installation also needs the applicable instructions, including any limits for the actual mounting arrangement. The catalog sheet does not provide a multi-gang derating schedule.' },
      { type: 'h2', text: 'Send a short, reproducible description' },
      { type: 'list', label: 'Information for a dimming performance review', items: [
        'Dimmer model and the lamp or driver manufacturer and model.',
        'Lamp quantity, wattage per lamp and the specified dimming method.',
        'Whether the symptom occurs at startup, at low brightness or throughout the range.',
        'Whether every lamp behaves the same way, and whether anything was recently changed.'
      ] },
      { type: 'p', text: 'A short video can help show the sequence, but describe what you see in person as well. Have a qualified electrician assess wiring faults or abnormal operation. If there is heat damage, a burning smell or arcing, stop using the affected control and arrange inspection rather than continuing a dimming trial.' },
      { type: 'p', text: 'For a new project, keep the approved lamp model with the dimmer sample record. If the lamp changes later, repeat the compatibility review; the earlier sample result belongs to the combination that was actually evaluated.', links: [
        { label: 'View DM2010', href: '/products/dimmers/dm2010' },
        { label: 'Compare LED and 0-10V dimmers', href: '/blog/dimmer-buying-guide-led-0-10v' }
      ] }
    ]
  },
  {
    slug: 'combination-light-switch-double-triple-rocker',
    title: 'Two or three switches in one box: choosing a combination switch',
    excerpt: 'A double or triple rocker can control separate loads from one device position. Rocker count, wallplate gangs and 3-way operation describe different things.',
    date: '2026-10-22',
    readMinutes: 3,
    category: 'Buying Guide',
    cover: 'assets/images/catalog/models/9c21053579be1cac.webp',
    coverAlt: 'FAHINT DS1502 double paddle combination switch with two separate rockers.',
    coverCaption: 'DS1502 has two single-pole rockers in one device. It is not a two-gang assembly.',
    coverSource: 'Existing FAHINT DS1502 product-library photograph: catalog/models/9c21053579be1cac.webp',
    coverFit: 'contain',
    coverWidth: 800,
    coverHeight: 800,
    sources: [
      { label: 'ENERLITES: combination device configurations', href: 'https://enerlites.com/category/wiring-devices/combination-devices' },
      { label: 'FAHINT lighting switch catalog, page 25', href: '/assets/documents/fahint-product-catalog.pdf#page=25' },
      { label: 'FAHINT DS1502 specifications', href: '/products/lighting-switches/ds1502' },
      { label: 'FAHINT DS1503 specifications', href: '/products/lighting-switches/ds1503' }
    ],
    body: [
      { type: 'p', text: 'A combination light switch puts separate controls into one device position. A double rocker can give two loads their own on/off control; a triple rocker can give three. This can be useful when a room needs several lighting groups but the design calls for a single device position on the wall.' },
      { type: 'p', text: 'The names can be confusing on an order. “Three switches” may mean three separate devices, three rockers in one device or a 3-way control requirement. ENERLITES, for example, lists dual single-pole, dual 3-way and triple-rocker configurations separately. FAHINT buyers need the same distinction in their specification.', source: 0 },
      { type: 'h2', text: 'Count the loads and the control locations separately' },
      { type: 'p', text: 'Suppose a room has one ceiling-light group and one wall-light group, both controlled at the entrance. The purchasing brief needs two separate on/off controls at that location. If the ceiling lights must also be controlled from another doorway, that adds a different requirement. The installer needs to specify the appropriate multi-location arrangement.' },
      { type: 'p', text: 'A 3-way switch is used in a suitable circuit to control a load from two locations. Three rockers on the front do not create that function. DS1503 has three single-pole rockers, while DS15.3 is FAHINT’s 3-way paddle-switch model.', source: 1 },
      { type: 'table', caption: 'FAHINT switch functions that should not be confused', columns: ['Model', 'Controls on the device', 'Published function'], rows: [
        [{ label: 'DS1502', href: '/products/lighting-switches/ds1502' }, 'Two rockers', 'Two single-pole controls'],
        [{ label: 'DS1503', href: '/products/lighting-switches/ds1503' }, 'Three rockers', 'Three single-pole controls'],
        [{ label: 'DS15.3', href: '/products/lighting-switches/ds15-3' }, 'One paddle', '3-way switching']
      ] },
      { type: 'h2', text: 'Several rockers still fit one device opening' },
      { type: 'p', text: 'DS1502 and DS1503 are single-gang combination devices. Do not order a two-gang wallplate for DS1502 merely because it has two buttons. The gang count describes the physical device arrangement; the rocker count describes the controls within that device.' },
      { type: 'p', text: 'Review the complete switch and wallplate sample. The plate opening must suit the device face, and the installer must confirm the box, conductors and mounting space. A compact front does not establish that an existing box has room for the proposed installation.' },
      { type: 'h2', text: 'Check the load type behind each rocker' },
      { type: 'p', text: 'Both DS1502 and DS1503 carry a published device rating of 15A, 120/277V AC. Treat that as the starting specification, then ask for the permitted load types and the limits that apply to the complete device. Do not multiply the 15A figure by the number of rockers to advertise a combined capacity.', source: 2 },
      { type: 'p', text: 'If one control is intended for a fan, heater or another non-lighting load, name that equipment in the request. The equipment rating and the switch’s applicable load approval need to be reviewed together. These rocker switches provide on/off operation; they do not add dimming or fan-speed control.' },
      { type: 'h2', text: 'Make the control schedule readable' },
      { type: 'p', text: 'Label the intended function of each rocker in the sample brief, such as ceiling lights and wall lights. Have the project team confirm the wiring arrangement using the exact instructions. For a repeated room design, keep the same control order on the approved sample and the room schedule.' },
      { type: 'p', text: 'When asking for DS1502 or DS1503, include the load schedule and matching plate, not just the phrase “double switch” or “triple switch.” For a single paddle or toggle, the lighting-switch guide compares the other FAHINT options.', links: [
        { label: 'Lighting switch buying guide', href: '/blog/light-switch-buying-guide' },
        { label: 'View combination switch models', href: '/products/lighting-switches' }
      ] }
    ]
  },
  {
    slug: 'smart-switch-neutral-vs-no-neutral',
    title: 'Smart switches with or without neutral: which version fits?',
    excerpt: 'Neutral requirements belong to the exact switch model. Compare FAHINT USW8811 and USW8811-S, then check the load, accessories and actual wall-box conditions.',
    date: '2026-10-22',
    readMinutes: 3,
    category: 'Buying Guide',
    cover: 'assets/images/catalog/smart-switches/17f21f2fe226b9cf-white-v1.webp',
    coverAlt: 'Black FAHINT US-format glass touch switch shown at a slight angle on a white background.',
    coverCaption: 'The front panel does not identify neutral requirements. Use the complete model designation.',
    coverSource: 'Existing FAHINT smart-switch product asset: catalog/smart-switches/17f21f2fe226b9cf-white-v1.webp',
    coverFit: 'contain',
    coverWidth: 800,
    coverHeight: 800,
    sources: [
      { label: 'ELEGRP: neutral requirement for SPN10 / SPN30', href: 'https://www.elegrp.com/support/faqs/faq/52.html' },
      { label: 'Leviton: neutral requirements for in-wall devices', href: 'https://leviton.com/support/resources/product-support/decora-smart-support/articles/360009317373-Do-I-need-a-Neutral-Wire-for-In-Wall-Devices' },
      { label: 'FAHINT smart-control catalog, pages 19 to 24', href: '/assets/documents/fahint-product-catalog.pdf#page=19' },
      { label: 'FAHINT USW8811 specifications', href: '/products/smart-switches/usw8811' },
      { label: 'FAHINT USW8811-S specifications', href: '/products/smart-switches/usw8811-s' }
    ],
    body: [
      { type: 'p', text: 'Choose the wiring version after a qualified electrician confirms the conditions in the switch box. A smart switch marked “neutral required” needs that connection. A no-neutral or single-live version is a different product configuration with its own load and installation requirements. The choice cannot be made from the glass panel or Wi-Fi logo.' },
      { type: 'p', text: 'Manufacturer instructions are specific about this. ELEGRP’s guidance for SPN10 and SPN30 says those models need a neutral. Leviton documents both neutral-required and no-neutral families, with different accessory requirements. A statement about one smart switch should not be treated as a rule for the whole category.', source: 0 },
      { type: 'h2', text: 'What changes between USW8811 and USW8811-S?' },
      { type: 'p', text: 'Both FAHINT models are US-format, one-gang Wi-Fi touch switches. Their published wiring and supply specifications differ. The suffix needs to stay visible from the quotation through to the sample and final order.', source: 2 },
      { type: 'table', caption: 'Two similar-looking FAHINT Wi-Fi switches', columns: ['Model', 'Wiring version', 'Published supply'], rows: [
        [{ label: 'USW8811', href: '/products/smart-switches/usw8811' }, 'Neutral + live (N + L)', '90 to 250V AC, 50/60Hz'],
        [{ label: 'USW8811-S', href: '/products/smart-switches/usw8811-s' }, 'Single live wire', '110 to 240V AC, 50/60Hz']
      ] },
      { type: 'p', text: 'The single-live designation describes the wiring version. It does not mean that the device is battery powered or that it can be installed anywhere without checking the existing circuit. Have the installer review the model diagram and available conductors. Do not identify a neutral from color alone or substitute a grounding conductor for it.' },
      { type: 'h2', text: 'No-neutral does not settle the accessory question' },
      { type: 'p', text: 'Some no-neutral products need additional equipment. Leviton’s DN family, for example, requires its specified Wi-Fi bridge and an earth-ground connection. That is an example of a particular system, not a requirement or a compatibility claim for FAHINT.', source: 1 },
      { type: 'p', text: 'For the FAHINT version being quoted, ask whether a bypass accessory is needed, which loads are permitted and whether a minimum load applies. The catalog alone does not resolve those details for every lamp. Include any required accessory in the price comparison and sample pack so it cannot be missed later.' },
      { type: 'h2', text: 'Check the lamp separately from the switch’s headline wattage' },
      { type: 'p', text: 'The catalog gives a 1200W-per-gang load figure for these models but does not identify every permitted lamp or motor type behind that figure. It should not become a blanket “1200W LED” claim. Send the lamp or driver model, quantity and wattage for review before accepting a load match.', source: 3 },
      { type: 'p', text: 'The required action matters too. If the room needs dimming, choose and evaluate a dimming model. A one-gang touch switch does not become a dimmer because its panel resembles another product in the range.' },
      { type: 'h2', text: 'Use a sample to settle the remaining questions' },
      { type: 'p', text: 'Ask the project electrician to install the approved sample with the intended lamp under the supplied instructions. Then review ordinary use: local on/off control, the required app functions and what happens when power or connectivity returns. Record the exact app, accessories and hardware version with the result.' },
      { type: 'p', text: 'For a renovation with several rooms, note the confirmed wiring conditions room by room. Avoid ordering a single version for the whole property until the survey supports that choice. The wider smart-switch guide covers Wi-Fi, Zigbee and touch-only options once the wiring requirement is established.', links: [
        { label: 'Wi-Fi, Zigbee and touch-control guide', href: '/blog/smart-switch-buying-guide-wifi-zigbee' }
      ] }
    ]
  },
  {
    slug: 'screwless-vs-screw-fixed-wallplates',
    title: 'Screwless vs screw-fixed wallplates: what to check',
    excerpt: 'The visible screws are only part of the choice. Compare the complete mounting assembly, opening, outside dimensions and finish before approving a wallplate.',
    date: '2026-10-22',
    readMinutes: 3,
    category: 'Specification',
    cover: 'assets/images/catalog/models/302d8689a5dde176.webp',
    coverAlt: 'White FAHINT BS1803-G decorator wallplate with a screwless front and rectangular device opening.',
    coverCaption: 'BS1803-G screwless decorator wallplate. Check the full assembly and dimensions with the intended device.',
    coverSource: 'Existing FAHINT BS1803-G product-library photograph: catalog/models/302d8689a5dde176.webp',
    coverFit: 'contain',
    coverWidth: 800,
    coverHeight: 800,
    sources: [
      { label: 'ENERLITES: two-piece screwless decorator wallplate', href: 'https://enerlites.com/products/screwless-decorator-gfci-two-gang-wall-plate' },
      { label: 'FAHINT BS1801 dimensions', href: '/products/wallplates/bs1801' },
      { label: 'FAHINT BS1802 dimensions', href: '/products/wallplates/bs1802' },
      { label: 'FAHINT BS1803-G specifications', href: '/products/wallplates/bs1803-g' },
      { label: 'FAHINT wallplate catalog, pages 27 to 28', href: '/assets/documents/fahint-product-catalog.pdf#page=27' }
    ],
    body: [
      { type: 'p', text: 'A screw-fixed wallplate leaves the fixing screws visible on the front. A screwless design hides them behind the face. Many screwless plates use a separate mounting piece and a cover that clips into place; ENERLITES describes its decorator product as a two-piece kit.', source: 0 },
      { type: 'p', text: 'For a room sample, the visual choice is easy to compare. For an order, there is more to record: the complete assembly, the device opening and the outside dimensions. A front cover on its own is not the same purchase as a complete mounting kit.' },
      { type: 'h2', text: 'Approve the plate with the device it will surround' },
      { type: 'p', text: 'Start with the opening. A decorator plate has a rectangular opening; a traditional duplex receptacle or toggle needs the corresponding pattern. Choosing a screwless finish does not change which opening the device requires.' },
      { type: 'p', text: 'Ask for a sample with the proposed switch or outlet. Look at the device height within the opening and the gap around its edge. Have the installer confirm that the mounting parts fit as intended. Do not assume that covers and mounting pieces from different manufacturers are interchangeable simply because both products say “screwless.”' },
      { type: 'h2', text: 'Outside size can change when the fixing style changes' },
      { type: 'table', caption: 'FAHINT one-gang decorator plate examples', columns: ['Model', 'Fixing style', 'Outside width × height'], rows: [
        [{ label: 'BS1801', href: '/products/wallplates/bs1801' }, 'Screw fixed, standard size', '70 × 115 mm'],
        [{ label: 'BS1802', href: '/products/wallplates/bs1802' }, 'Screw fixed, medium size', '80 × 124 mm'],
        [{ label: 'BS1803-G', href: '/products/wallplates/bs1803-g' }, 'Screwless, glossy', '75 × 120 mm'],
        [{ label: 'BS1803-M', href: '/products/wallplates/bs1803-m' }, 'Screwless, matte', '75 × 120 mm']
      ] },
      { type: 'p', text: 'These are exterior dimensions from the model records. BS1802 is a larger one-gang plate, not a two-gang plate. BS1803-G is a separate screwless model, not another name for the standard BS1801.', source: 4 },
      { type: 'p', text: 'That difference matters on a decorated wall. In the size table, the 75 × 120 mm screwless plate is smaller than the 80 × 124 mm medium plate. If the old finish stops at the edge of the larger plate, changing to the smaller one can expose the border. Measure the actual area that needs covering before choosing the replacement; a plate should not be used to conceal an installation defect.' },
      { type: 'h2', text: 'Look at the edge as well as the front' },
      { type: 'p', text: 'Compare the assembled sample from the side under the room’s lighting. Check how far it stands from the wall, whether the cover sits evenly and how its sheen compares with the device. The word “white” does not record those details.' },
      { type: 'p', text: 'For the BS1803 range, retain G for the glossy version and M for the matte version in the order designation. Keep an approved physical sample with the device and plate together. A separate photo of each part is less useful when the question is whether they look right as a pair.' },
      { type: 'h2', text: 'Include the mounting parts and spare covers in the brief' },
      { type: 'p', text: 'Confirm which mounting components and fixings come in the quoted pack, then ask how the cover is removed for service under the manufacturer’s instructions. If a property needs spare covers, specify the exact model and finish and verify whether the supplier sells that component separately.' },
      { type: 'p', text: 'A short order description can capture the decision: “BS1803-M, one-gang decorator opening, matte white, complete mounting assembly.” Add the quantity after the sample pairing is approved. For other opening patterns and gang counts, use the full wallplate guide.', links: [
        { label: 'Wallplate opening and size guide', href: '/blog/wallplate-buying-guide' },
        { label: 'View wallplate models', href: '/products/wallplates' }
      ] }
    ]
  }
];
