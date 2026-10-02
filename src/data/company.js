export const company = {
  name: 'Wenzhou Fahint Electric Co., Ltd.',
  shortName: 'Fahint Electric',
  brand: 'FAHINT',
  tagline: 'Crafting Quality, Delivering Value',
  since: 2015,
  email: 'louis@fahint.com',
  phone: '+86 188 5734 9189',
  whatsapp: '+8618857349189',
  website: 'www.fahint.com',
  location: 'Wenzhou, Zhejiang Province, China',
  address: 'Wenzhou, Zhejiang Province, China — 25 minutes from Wenzhou International Airport',
  ulFile: 'E504391',
  hours: 'Mon – Sat, 08:30 – 18:00 (GMT+8)'
};

export const stats = [
  { value: '2015', label: 'Year established', suffix: '' },
  { value: '70,000', label: 'Factory area (sq ft)', suffix: '' },
  { value: '12', label: 'Automated inspection lines', suffix: '' },
  { value: '98', label: 'First pass yield', suffix: '%' }
];

export const services = [
  {
    tone: 'navy',
    title: 'OEM & ODM Manufacturing',
    body:
      'Individual color box, logo on wall plate, logo on top/bottom body, color customization for wall plates, covers and bases, plus bracket customization. MOQ from 400 cartons.',
    link: { label: 'Start a custom project', to: '/contact' }
  },
  {
    tone: 'light',
    title: '6-Hour Engineering Response',
    body:
      'Our in-house engineering team returns customized design solutions within 6 hours, backed by US and China patents on our GFCI mechanism and PCB architecture.',
    link: { label: 'Talk to an engineer', to: '/contact' }
  },
  {
    tone: 'medium',
    title: 'US Warehouse, 10-Day Delivery',
    body:
      'Overseas warehouses serving North American customers enable shipment within 3 days and delivery in as fast as 10 days, with a decade of zero Category A complaints.',
    link: { label: 'See logistics options', to: '/about' }
  }
];

export const certifications = [
  { code: 'UL / cUL', detail: 'Listed under file E504391, UL 943 5th Edition 2018' },
  { code: 'ETL', detail: 'Verified production system' },
  { code: 'ISO 9001', detail: 'Certified quality management system' },
  { code: 'SGS', detail: 'Verified supplier audit' },
  { code: 'US Patent', detail: 'Patented GFCI mechanism' },
  { code: 'CN Patent', detail: 'Patented PCB architecture' }
];

export const capabilities = [
  {
    title: 'In-House Tooling & Injection',
    body: 'Precision molds and injection lines for thermoplastic and nylon housings.',
    image: 'assets/images/products/gf15-back-angle.webp'
  },
  {
    title: '12 Automated Inspection Lines',
    body: 'Every unit is dielectric, trip-threshold and continuity tested before packing.',
    image: 'assets/images/products/gf15-mcu.webp'
  },
  {
    title: 'Thickened Silver Contacts',
    body: 'Reduced temperature rise and longer mechanical life under commercial duty.',
    image: 'assets/images/products/gf15-sides.webp'
  },
  {
    title: 'Approved ALDI Supplier',
    body: 'Ten years of retail-grade compliance with zero Category A complaints.',
    image: 'assets/images/products/gf15-lifestyle.webp'
  }
];

export const faqs = [
  {
    q: 'Are your GFCI outlets UL listed?',
    a:
      'Fahint maintains UL / cUL listing documentation under file E504391 for applicable GFCI models. Confirm model-specific coverage in the product documentation or with our team before ordering.'
  },
  {
    q: 'What is your MOQ for a customized order?',
    a:
      'Minimum order quantities depend on the model, finish, packaging and customization requested. Send us your target quantity and artwork requirements so we can confirm the MOQ for your order.'
  },
  {
    q: 'How fast can you deliver to the United States?',
    a:
      'Lead time depends on model availability, order quantity, customization and destination. We will confirm the dispatch schedule and shipping options in your quotation; ask our team about current stock before planning a delivery date.'
  },
  {
    q: 'What is the difference between TR, WR and Self-Test?',
    a:
      'TR means tamper-resistant; WR means weather-resistant; self-test identifies automatic monitoring of the GFCI protection function. These features vary by model. Check the product specification and approved installation instructions for the intended location and enclosure requirements.'
  },
  {
    q: 'Do you offer a warranty?',
    a: 'Warranty coverage and duration are model-specific. Refer to the selected product documentation and confirm the applicable warranty terms in your quotation before ordering.'
  },
  {
    q: 'Can you supply neutral or private-label packaging?',
    a:
      'Discuss neutral or private-label packaging, authorized logos and product markings with our team. Send the model list, packaging format and artwork requirements; availability, minimum quantities and sample approval are confirmed for the selected program.'
  },
  {
    q: 'What information helps you prepare a quotation?',
    a: 'Include the complete model numbers, quantities by finish, destination, required documents and packaging needs. State your requested timing and any sample or private-label requirements. Keep different configurations separate so the quotation can identify exactly what is included.'
  },
  {
    q: 'What should I confirm before approving an order?',
    a: 'Match the sample to the agreed model, specification, finish, wallplate and markings. Review the relevant model documents and authorized packaging artwork. Confirm quantities, warranty terms, inspection requirements and the delivery arrangement in writing.'
  }
];

export const applications = [
  'Bathrooms, kitchens, basements, garages and laundry rooms',
  'Outdoor and wet locations per NEC Section 406.8',
  'School classrooms, laboratories, restrooms and commercial kitchens',
  'Airports, offices, shopping centers, restaurants and hotels',
  'Generators, outdoor lighting and industrial equipment (Anti-Gasoline series)'
];
