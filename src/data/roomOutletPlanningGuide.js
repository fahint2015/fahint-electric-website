// Application planning complements the model-specific guides; it does not set installation requirements.
export const roomOutletPlanningGuide = {
  slug: 'outlet-planning-by-room',
  title: 'Outlet Planning for Homes, Offices and Guest Rooms',
  excerpt: 'Plan outlets for homes, offices and guest rooms with a room-by-room checklist for power, USB charging, protection features, wallplates and sample approval.',
  date: '2026-10-18',
  updated: '2026-10-18',
  readMinutes: 5,
  category: 'Buying Guide',
  cover: 'assets/images/brand-home/generated/application-residential-scene.webp',
  coverAlt: 'Illustrated kitchen and dining area with a central island, blue cabinets and daylight.',
  coverCaption: 'Illustrated residential setting. The room image is a planning reference, not an electrical layout or an installed-project record.',
  coverSource: 'Existing FAHINT application illustration: brand-home/generated/application-residential-scene.webp',
  coverWidth: 1536,
  coverHeight: 1024,
  sources: [
    { label: 'ESFI: ground fault circuit interrupters (industry reference)', href: 'https://www.esfi.org/ground-fault-circuit-interrupters-gfci/' },
    { label: 'FAHINT application environments', href: '/applications' },
    { label: 'FAHINT USB outlet model specifications', href: '/products/usb-outlets' },
    { label: 'FAHINT standard receptacle model specifications', href: '/products/receptacles' },
    { label: 'FAHINT product catalog and original documents', href: '/resources' }
  ],
  body: [
    {
      type: 'p',
      text: 'A hotel bedside, an office desk and a kitchen counter may all need white outlets, but they rarely need the same order line. The bedside may call for USB charging; the desk needs capacity for specific equipment; the kitchen brings location and protection requirements into the selection. Ordering by room count and face color alone leaves those differences unresolved.'
    },
    {
      type: 'p',
      text: 'Start with the electrical schedule from the project team, then add a list of what people will plug in at each location. This guide turns those two inputs into a purchasing brief for homes, workplaces and guest rooms. Use the linked product guides when you are ready to compare individual models.'
    },
    { type: 'h2', text: 'Build a room-by-room device schedule' },
    {
      type: 'p',
      text: 'Give each location an identifier, such as Bedroom B-02 or Meeting Room M-01. Record the intended equipment, required electrical configuration, charging needs and finish on the same line. A room name provides context; the project specification determines the device requirements.'
    },
    {
      type: 'table',
      caption: 'Questions to resolve for each application',
      columns: ['Location', 'Start with this question', 'Product family to review', 'Detail to settle before ordering'],
      rows: [
        ['Kitchen or utility area', 'What equipment is served, and what protection does the project require?', { label: 'GFCI outlets', href: '/products/gfci' }, 'Required circuit protection, face rating and any TR / WR features'],
        ['Bedroom or guest-room bedside', 'Which devices need charging, and how many will connect at once?', { label: 'USB outlets', href: '/products/usb-outlets' }, 'Port mix, charging profiles and simultaneous-port output'],
        ['Office desk or meeting space', 'Which loads need AC power, and which can use USB?', { label: 'Standard receptacles', href: '/products/receptacles' }, 'Current, voltage, plug configuration and terminal type'],
        ['A room with several device types', 'Will the receptacles and controls share a consistent finish?', { label: 'Wallplates', href: '/products/wallplates' }, 'Opening, gang count, dimensions, finish and pack contents']
      ]
    },
    { type: 'h2', text: 'Keep protection and charging on separate lines' },
    {
      type: 'p',
      text: 'GFCI protection addresses electric-shock hazards associated with ground faults. ESFI explains its role where electrical products may encounter water. Ask the qualified project team to specify the required protection for each location and the way it will be provided.',
      source: 0
    },
    {
      type: 'p',
      text: 'USB describes a charging function. Choosing a USB outlet does not resolve the separate GFCI, tamper-resistant or weather-resistant requirements. Likewise, a GFCI designation does not establish USB charging capability. Keep these fields separate in the schedule so that a request for convenient charging cannot silently replace a required protection feature.',
      links: [
        { label: 'Compare GFCI and AFCI functions', href: '/blog/gfci-vs-afci-whats-the-difference' },
        { label: 'Review TR, WR and receptacle ratings', href: '/blog/standard-receptacle-buying-guide' }
      ]
    },
    { type: 'h2', text: 'Bedrooms and guest rooms: specify the charging job' },
    {
      type: 'p',
      text: 'List the expected devices and cable ends before choosing ports. For a mixed USB-A and USB-C requirement, FAHINT FTR15C-3100 is a non-PD example with 5V, 3.1A combined USB output. For a dual USB-C PD requirement, FTR15QC-DC20W is a different configuration with a published single-port maximum of 20W. These are choices to compare against the brief, not a promise that every connected device receives the maximum output.',
      links: [
        { label: 'FTR15C-3100 model details', href: '/products/usb-outlets/ftr15c-3100' },
        { label: 'FTR15QC-DC20W model details', href: '/products/usb-outlets/ftr15qc-dc20w' }
      ]
    },
    {
      type: 'p',
      text: 'If two guests may charge at once, put that use case in the sample brief. Test the intended devices and cables together and record the result. A single-port rating does not establish two-port power sharing. The same approach applies to a household bedside used for a phone and a second device.',
      links: [{ label: 'Compare USB configurations and PD profiles', href: '/blog/usb-wall-outlet-buying-guide' }]
    },
    { type: 'h2', text: 'Desks and shared workspaces: list what plugs in' },
    {
      type: 'p',
      text: 'A useful desk inventory distinguishes the monitor, laptop power supply, task light and phone charger. Keep AC-powered equipment in the AC requirement even when the desk also has a USB-C port. Confirm the laptop manufacturer’s power requirements before treating an integrated USB outlet as a replacement for its power supply.'
    },
    {
      type: 'p',
      text: 'For shared desks or meeting rooms, record whether users bring their own cables and devices. Give the project team the furniture layout and intended connection points so they can resolve access and electrical design. Buyers can then order against approved location identifiers instead of trying to infer the circuit or quantity from an interior photograph.'
    },
    { type: 'h2', text: 'Coordinate switches and wallplates across the room' },
    {
      type: 'p',
      text: 'Check the complete device set together: receptacles, charging outlets, lighting controls and wallplates. A matching color name does not establish a matching opening, gloss level or mounting arrangement. Record the wallplate model alongside each device, and specify whether the plate is included in the pack or supplied separately.',
      links: [{ label: 'Check wallplate openings and finishes', href: '/blog/wallplate-buying-guide' }]
    },
    {
      type: 'p',
      text: 'For connected lighting, add the intended control system and wiring version to the room schedule. This matters in a guest room where a wall control also needs to fit an operating and maintenance plan. Touch-only, Wi-Fi and Zigbee configurations have different selection questions.',
      links: [{ label: 'Read the smart switch buying guide', href: '/blog/smart-switch-buying-guide-wifi-zigbee' }]
    },
    { type: 'h2', text: 'Approve one complete sample room' },
    {
      type: 'p',
      text: 'Before repeating a room package across a project, approve its individual devices and the assembled combinations. Compare finishes under the intended lighting, check device and plate fit, and have the qualified team verify the electrical and functional choices. Keep the charging test results with the sample record.'
    },
    {
      type: 'p',
      text: 'Record the full model numbers and document revisions against the location identifiers. If a substitute is proposed later, review the affected rating, wiring, function and finish fields again. A similar front face should not bypass the approval record.'
    },
    { type: 'h2', text: 'Turn the schedule into a quotation request' },
    {
      type: 'list',
      label: 'Room-by-room purchasing checklist',
      items: [
        'Project destination, room types and approved location identifiers.',
        'Complete model number and quantity per location, with the required electrical ratings and protection features.',
        'Charging devices, port mix, cable requirements and simultaneous-use cases to evaluate.',
        'Control function, wiring version and connected system where smart controls are included.',
        'Device finish, matching wallplate, pack contents and approved sample references.',
        'Required model documents, spare-unit quantities, packaging requirements and requested delivery date.'
      ]
    },
    {
      type: 'p',
      text: 'Send the schedule with your inquiry and identify any selections still awaiting project approval. FAHINT can review the model combinations, sample requirements and packaging scope, then confirm availability, minimum quantities and timing for the actual order.',
      links: [{ label: 'Discuss your room schedule', href: '/contact?topic=technical' }]
    }
  ]
};
