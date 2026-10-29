// Head-term pillar for the GFCI range. Targets "gfci outlet" and the rating/configuration
// questions buyers ask before they shortlist a model. Links every claim to a primary source.
export const gfciOutletGuide = {
  slug: 'gfci-outlet-guide',
  title: 'GFCI Outlet Guide: Ratings, Configurations and Model Selection',
  excerpt: 'How a GFCI outlet senses a ground fault, whether to specify 15A or 20A, what TR and WR actually add, and how the nine FAHINT models differ.',
  date: '2026-10-29',
  updated: '2026-10-29',
  readMinutes: 8,
  category: 'Technical Guide',
  cover: 'assets/images/products/gf15-application-kitchen-v2.jpg',
  coverAlt: 'FAHINT GF15 self-test GFCI outlet installed above a kitchen counter',
  coverCaption: 'A GFCI receptacle in a kitchen counter application illustration. Device selection follows the circuit, the location and the adopted code.',
  coverSource: 'Existing FAHINT product asset — products/gf15-feature-application-v3.jpg',
  sources: [
    { label: 'NFPA — free access to the National Electrical Code', href: 'https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70' },
    { label: 'UL Standards — UL 943, Ground-Fault Circuit Interrupters', href: 'https://www.shopulstandards.com/ProductDetail.aspx?productId=UL943' },
    { label: 'ESFI — Ground fault circuit interrupters', href: 'https://www.esfi.org/resource/ground-fault-circuit-interrupters-284' },
    { label: 'CPSC — GFCI fact sheet', href: 'https://www.cpsc.gov/s3fs-public/5133%281%29.pdf' },
    { label: 'FAHINT — Original certificate library', href: '/resources#certifications' }
  ],
  body: [
    {
      type: 'p',
      text: 'A GFCI outlet is a receptacle that cuts power when current leaks from the hot conductor to ground. In North America the device is listed to UL 943, and Class A versions respond somewhere in the 4–6 mA range — low enough to interrupt a fault before it becomes a shock hazard, and fast enough that a breaker protecting the branch circuit would never see it as an overload. Where the protection is required depends on the code edition your project adopts, not on the product.'
    },
    { type: 'h2', text: 'What the device is actually measuring' },
    {
      type: 'p',
      text: 'A GFCI compares the current leaving on the hot conductor with the current returning on the neutral. In a healthy circuit those two numbers are equal. Any difference is leakage, and a small toroidal transformer wound around both conductors is what detects it. When the imbalance holds long enough, a solenoid opens the contacts.',
      source: 2
    },
    {
      type: 'p',
      text: 'This is why the test and reset buttons are not the protection itself. They exercise a mechanism that is already running. When a device refuses to reset, the mechanism has reached a conclusion about the circuit — a conclusion that a press of the button cannot overrule.'
    },
    { type: 'h2', text: '15A or 20A: match the circuit, not the price' },
    {
      type: 'p',
      text: 'The face rating has to match the branch circuit it sits on. A 20A receptacle on a 15A circuit invites a load the wiring cannot carry; a 15A receptacle on a 20A circuit is legal but limits what can be plugged in. The plug configuration follows from the rating, so the decision is usually made by the electrician or the specifier before purchasing sees it.'
    },
    {
      type: 'table',
      caption: 'Choosing between 15A and 20A GFCI receptacles',
      columns: ['', '15A', '20A'],
      rows: [
        ['Face rating', '15A, 125V', '20A, 125V'],
        ['Plug configuration', 'NEMA 5-15R', 'NEMA 5-20R (T-slot, accepts 5-15P)'],
        ['Typical branch circuit', '14 AWG on a 15A breaker', '12 AWG on a 20A breaker'],
        ['FAHINT models', 'GF15, GT15, GW15', 'GF20, GT20, GW20'],
        ['Where it is usually specified', 'General-purpose, lighting, bedroom and living areas', 'Kitchen counter, garage, laundry, dedicated appliance circuits']
      ]
    },
    { type: 'h2', text: 'Four configurations, and when each one is the right purchase' },
    {
      type: 'p',
      text: 'Tamper resistance, weather resistance and ground-fault protection are three separate features. A device can carry one without the others, and a catalogue that lists a whole family under one description will not tell you which variant has what. Read the model designation, then the listing document.'
    },
    {
      type: 'table',
      caption: 'FAHINT GFCI configurations',
      columns: ['Configuration', 'What it adds', 'FAHINT models', 'Specify when'],
      rows: [
        ['Standard', 'Ground-fault protection only', { label: 'GF15', href: '/products/gfci/gf15' }, 'Replacement and general residential work where TR is not required'],
        ['Tamper-resistant (TR)', 'Shutters block foreign objects in the slots', { label: 'GT15', href: '/products/gfci/gt15' }, 'Dwelling units and other occupancies covered by NEC 406.12'],
        ['Tamper- and weather-resistant (TR/WR)', 'Shutters plus UV and corrosion resistance', { label: 'GW20', href: '/products/gfci/gw20' }, 'Damp and wet locations, outdoor receptacles under a cover'],
        ['Blank-face', 'Protection for a downstream circuit, no receptacle openings', { label: 'GL20', href: '/products/gfci/gl20' }, 'A GFCI device protecting a circuit with no outlet at that box']
      ]
    },
    {
      type: 'p',
      text: 'Blank-face devices get misread more often than any other variant. The GL20 has no plug openings, so it protects whatever is wired downstream rather than offering a place to plug in. If the box needs to supply a load, this is the wrong device. Its documentation also remains under review in our library, so request the exact record before specifying it.'
    },
    { type: 'h2', text: 'Self-test changes what maintenance looks like' },
    {
      type: 'p',
      text: 'A conventional GFCI proves itself on the day someone presses TEST. Self-test models check the sensing circuit on a schedule instead, and signal when protection can no longer be confirmed. In a hotel floor or a rental portfolio, that is the difference between a maintenance schedule and an assumption.',
      source: 2
    },
    {
      type: 'p',
      text: 'The manual test is still required. Self-testing verifies the electronics; it does not verify the wiring behind the device, the contacts under load, or the enclosure. Follow the instructions supplied with the model, and treat an unfamiliar indicator as a reason to stop using the circuit rather than a reason to press reset again.'
    },
    { type: 'h2', text: 'Where protection is required, and why the section number matters' },
    {
      type: 'p',
      text: 'NEC Article 210.8 sets out where GFCI protection is required, 406.9 covers receptacles in damp and wet locations, and 406.12 covers tamper-resistant requirements. Those sections have moved and expanded between editions, and local amendments vary by jurisdiction. The edition adopted for the project is the one that governs.',
      source: 0
    },
    {
      type: 'list',
      label: 'Locations that commonly require GFCI protection',
      items: [
        'Bathrooms, kitchens, laundry areas and utility sinks',
        'Garages, unfinished basements and crawl spaces',
        'Outdoors, and receptacles within reach of a sink or a wet location',
        'Kitchen countertop surfaces, including islands and peninsulas in recent editions',
        'Equipment such as pool pumps, spas and permanently installed outdoor machinery'
      ]
    },
    {
      type: 'p',
      text: 'Treat that list as a starting point for the conversation with the authority having jurisdiction, not as a substitute for it. Requirements differ by occupancy type as well as by room, and a commercial kitchen is not assessed the same way as a dwelling unit.',
      source: 0
    },
    { type: 'h2', text: 'The nine FAHINT GFCI models, side by side' },
    {
      type: 'table',
      caption: 'FAHINT GFCI range',
      columns: ['Model', 'Rating', 'Configuration', 'Note'],
      rows: [
        [{ label: 'GF15', href: '/products/gfci/gf15' }, '15A', 'Standard', 'Baseline self-test receptacle'],
        [{ label: 'GF20', href: '/products/gfci/gf20' }, '20A', 'Standard', 'Same construction on a 20A face'],
        [{ label: 'GT15', href: '/products/gfci/gt15' }, '15A', 'TR', 'Shuttered slots for dwelling units'],
        [{ label: 'GT20', href: '/products/gfci/gt20' }, '20A', 'TR', '20A circuit with tamper resistance'],
        [{ label: 'GW15', href: '/products/gfci/gw15' }, '15A', 'TR/WR', 'Outdoor and damp locations'],
        [{ label: 'GW20', href: '/products/gfci/gw20' }, '20A', 'TR/WR', 'Outdoor 20A circuits'],
        [{ label: 'GL20', href: '/products/gfci/gl20' }, '20A', 'Blank-face', 'Downstream protection, no openings'],
        [{ label: 'GTN15', href: '/products/gfci/gtn15' }, '15A', 'TR, industrial', 'No feed-through terminals'],
        [{ label: 'GTN20', href: '/products/gfci/gtn20' }, '20A', 'TR, industrial', 'No feed-through terminals']
      ]
    },
    {
      type: 'p',
      text: 'The August 16, 2022 addendum to report E504391-20210212 names GF15, GF20, GT15, GT20, GW15 and GW20, and identifies GTN15 and GTN20 as tamper-resistant models without feed-through terminals. GL20 is not part of that documented shortlist. Confirm current coverage for the exact configuration you order rather than relying on a family reference.',
      links: [{ label: 'Review the GFCI certificate library', href: '/resources?family=gfci' }]
    },
    { type: 'h2', text: 'What to put in a specification or an inquiry' },
    {
      type: 'list',
      label: 'GFCI inquiry checklist',
      items: [
        'Full model designation, face rating and configuration — not "GFCI outlet" alone',
        'Finish, wallplate style and whether the plate ships with the device',
        'Required model documents, and the listing reference your market expects',
        'Quantities split by model and finish, with destination and pack format',
        'Sample requirements, private-label artwork and any inspection criteria'
      ]
    },
    {
      type: 'p',
      text: 'Send the shortlist even when some details are still open, and mark which ones need resolving. A supplier who can answer the model-specific questions is more useful than a quotation with a single price and no references.',
      links: [
        { label: 'Compare the GFCI outlet range', href: '/products/gfci' },
        { label: 'Explore OEM and private-label support', href: '/capabilities#oem' }
      ]
    },
    { type: 'h2', text: 'Questions buyers ask before ordering' },
    { type: 'h3', text: 'Does a GFCI outlet protect against arc faults?' },
    {
      type: 'p',
      text: 'No. Arc-fault protection is a separate function, listed to a different standard, and a device carrying one does not carry the other unless it is marked for both. If the specification calls for both, confirm the exact device rather than assuming a GFCI covers it.'
    },
    { type: 'h3', text: 'Can a GFCI be installed on a two-wire circuit without a ground?' },
    {
      type: 'p',
      text: 'A GFCI does not require an equipment ground to detect a ground fault, which is why it appears in older wiring discussions. Whether it may be used that way, and what marking is required, is a code question for the authority having jurisdiction and the licensed installer.'
    },
    { type: 'h3', text: 'Why does a GFCI trip when nothing is plugged in?' },
    {
      type: 'p',
      text: 'The fault is usually downstream: moisture in an exterior box, a damaged conductor, or an appliance on the protected leg. Unplug everything on the circuit and reset once. If it trips again with nothing connected, the problem is in the wiring and needs an electrician.'
    },
    { type: 'h3', text: 'How long does a GFCI outlet last?' },
    {
      type: 'p',
      text: 'Manufacturers publish no single service life because it depends on load, environment and how often the device is exercised. A device that will not reset, will not trip on test, or shows an unfamiliar indicator has reached the end of its service life and should be replaced.'
    },
    { type: 'h3', text: 'Is a 20A GFCI outlet interchangeable with a 15A one?' },
    {
      type: 'p',
      text: 'They share a form factor but not a rating. The 20A face takes a 5-20P plug and belongs on a 20A circuit with 12 AWG conductors. Fitting a 20A device to a 15A circuit does not increase capacity; it removes the reminder that the circuit cannot supply it.'
    },
    { type: 'h3', text: 'Do you supply private-label GFCI outlets?' },
    {
      type: 'p',
      text: 'Yes. Authorization for artwork, product markings and packaging is confirmed per model and per program, and we ask for a sample approval before production. Start with the model list, quantities by finish and the destination market for the quotation.',
      links: [{ label: 'Send your GFCI sourcing brief', href: '/contact?topic=oem' }]
    },
    {
      type: 'p',
      text: 'Device selection still belongs to the licensed installer and the authority having jurisdiction. What a manufacturer can do is make the model, the rating, the configuration and the listing document unambiguous — which is most of what goes wrong in an order.'
    }
  ]
};

export default gfciOutletGuide;
