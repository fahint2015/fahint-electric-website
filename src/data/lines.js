// The seven wiring-device families Fahint manufactures.
// Data traced to the FAHINT product catalogue; GFCI detail lives in products.js.
import smartSwitchMedia from './catalog/smart-switch-media.json' with { type: 'json' };

export const productLines = [
  {
    slug: 'gfci',
    name: 'GFCI Outlets',
    short: 'GFCI',
    cover: 'assets/images/products/gf15-plate.webp',
    tagline: 'Class A self-test ground fault protection',
    summary:
      '15A and 20A GFCI devices with standard, tamper-resistant, TR/WR and blank-face configurations, plus separately documented industrial models. Review certification coverage for the exact model.',
    ulFile: 'E504391',
    standard: 'UL 943 5th Edition 2018',
    highlights: ['Self-test protection', 'Model-specific listing review', 'Coordinated finishes'],
    models: ['GF15', 'GF20', 'GT15', 'GT20', 'GW15', 'GW20', 'GL20', 'GTN15', 'GTN20'],
    detailed: true
  },
  {
    slug: 'usb-outlets',
    name: 'USB Outlets',
    short: 'USB',
    cover: 'assets/images/lines/usb-3100-plate.webp',
    tagline: 'Type-A, Type-C and PD fast charging receptacles',
    summary:
      'Combination receptacles with integrated USB charging, from 3100 mA Type-A pairs up to 65 W GaN Power Delivery, in 15A and 20A NEMA faces.',
    ulFile: 'E498095',
    standard: 'UL listed',
    highlights: ['3.1A / 3.6A / 4.2A / 5A USB', 'PD 20W / 36W / 65W', '15A and 20A faces'],
    groups: [
      { name: '3100 mA', items: ['FTR15-3100', 'FTR15C-3100', 'FTR15DC-3100', 'FTR20-3100', 'FTR20C-3100', 'FTR20DC-3100'] },
      { name: '3600 mA', items: ['FTR15-3600', 'FTR20-3600'] },
      { name: '4200 mA', items: ['FTR15-4200', 'FTR20-4200', '4-port 4200 mA'] },
      { name: '5000 mA', items: ['FTR15-5000', 'FTR20-5000'] },
      { name: 'Power Delivery', items: ['PD 20W', 'PD 36W', 'PD 65W GaN'] }
    ],
    gallery: ['assets/images/lines/usb-3100-plate.webp', 'assets/images/lines/usb-3100.webp', 'assets/images/lines/usb-pd65-plate.webp', 'assets/images/lines/usb-pd65.webp']
  },
  {
    slug: 'receptacles',
    name: 'Standard Receptacles',
    short: 'Receptacles',
    cover: 'assets/images/lines/recep-decora-plate.webp',
    tagline: 'Duplex, Decora, commercial and industrial grade',
    summary:
      'Compare duplex and decorator receptacles by current, voltage, TR/WR protection and wiring method. The commercial C range and industrial CR/CD range follow the product catalogue; confirm the configuration for your project.',
    standard: 'Model-specific certification',
    highlights: ['R / D / C series', 'TR and WR variants', '15A and 20A'],
    groups: [
      { name: 'R series duplex', items: ['R15', 'R15Q', 'R20', 'RT15', 'RT15Q', 'RT20', 'RW15', 'RW15Q', 'RW20'] },
      { name: 'D series Decora', items: ['D15', 'D15Q', 'D20', 'DT15', 'DT15Q', 'DT20', 'DW15', 'DW15Q', 'DW20'] },
      { name: 'Commercial Duplex Receptacles', items: ['C15', 'C15Q', 'C20', 'CT15', 'CT15Q', 'CT20', 'CW15', 'CW15Q', 'CW20'] },
      { name: 'Industrial Grade Duplex Receptacles', items: ['CR15', 'CR20', 'CD20'] }
    ],
    gallery: ['assets/images/lines/recep-decora-plate.webp', 'assets/images/lines/recep-decora.webp', 'assets/images/lines/recep-duplex.webp', 'assets/images/lines/recep-duplex-plate.webp']
  },
  {
    slug: 'dimmers',
    name: 'Dimmers',
    short: 'Dimmers',
    cover: 'assets/images/lines/dimmer-plate.webp',
    tagline: 'Digital slide dimmers and 0-10V control',
    summary:
      'Digital dimmer light switches for LED, CFL, halogen and incandescent loads, including a 0-10V variant for commercial lighting control.',
    standard: 'UL listed',
    highlights: ['DM2010 digital slide', 'DM2010S 0-10V', 'Load-specific ratings'],
    groups: [{ name: 'Digital dimmers', items: ['DM2010 - Digital Dimmer Light Switch', 'DM2010S - 0-10V Dimmer Light Switch'] }],
    gallery: ['assets/images/lines/dimmer-plate.webp', 'assets/images/lines/dimmer.webp']
  },
  {
    slug: 'smart-switches',
    name: 'Smart Switches',
    short: 'Smart',
    cover: smartSwitchMedia.USW8811.gallery[0].src,
    tagline: 'Wi-Fi, Zigbee and touch glass panels',
    summary:
      'US- and EU-format glass controls for Wi-Fi, Zigbee and touch-only operation. Compare neutral-required, single-live and dual-wiring versions, with separate switching, dimming, curtain, fan and heater controls.',
    standard: 'Confirm model-specific approvals',
    highlights: ['Wi-Fi / Zigbee / touch only', 'Model-specific wiring', 'US and EU formats'],
    groups: [
      { name: 'Wi-Fi neutral required', items: ['USW8811', 'USW8821', 'USW8831', 'USW8832', 'USW8833', 'USW8841'] },
      { name: 'Wi-Fi single live wire', items: ['1 gang', '2 gang', '3 gang'] },
      { name: 'Zigbee single live wire', items: ['1 gang', '2 gang', '3 gang'] },
      { name: 'Touch switch', items: ['Neutral required', 'Single live wire'] }
    ],
    gallery: [smartSwitchMedia.USW8811.gallery[0].src, smartSwitchMedia.USW8811.gallery[2].src]
  },
  {
    slug: 'lighting-switches',
    name: 'Lighting Switches',
    short: 'Switches',
    cover: 'assets/images/catalog/models/50e6f2d3f5cf9b64.webp',
    tagline: 'Paddle rocker and toggle wall switches',
    summary:
      'Single-pole and 3-way paddle and toggle switches, plus double- and triple-rocker combination controls. Compare the 125V and 120/277V ratings and each model’s stated UL or ETL certification.',
    standard: 'UL / ETL — varies by model',
    highlights: ['Single pole and 3-way', 'Combination rockers', 'Paddle and toggle'],
    groups: [
      { name: 'Paddle rocker', items: ['DS15', 'DS15.3', 'DS1502', 'DS1503'] },
      { name: 'Toggle', items: ['T15', 'T15.3 three-way'] }
    ],
    gallery: ['assets/images/lines/switch-paddle.webp', 'assets/images/lines/switch-paddle-alt.webp']
  },
  {
    slug: 'wallplates',
    name: 'Wallplates',
    short: 'Wallplates',
    cover: 'assets/images/lines/wallplate.webp',
    tagline: 'Screwless and standard decorator plates',
    summary:
      'Screwless and standard decorator wallplates from 1 to 4 gang, in glossy and matte finishes, coordinated with every Fahint device family.',
    standard: 'UL listed',
    highlights: ['1 - 4 gang', 'Glossy and matte', 'Screwless and standard'],
    groups: [
      { name: 'Decorator plates', items: ['BS1801', 'BS1802', 'BS18012', 'BS18013', 'BS18014'] },
      { name: 'Screwless plates', items: ['BS1803', 'BS18032', 'BS18033', 'BS18034'] },
      { name: 'Specialty', items: ['BS1804 duplex', 'BS1805 extension', 'BS1806 toggle', 'BS1807 blank'] }
    ],
    gallery: ['assets/images/lines/wallplate.webp', 'assets/images/lines/wallplate-matte.webp']
  }
];

export function findLine(slug) {
  return productLines.find((l) => l.slug === slug);
}
