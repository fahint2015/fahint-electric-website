import { buyingGuides } from './buyingGuides.js';

// Prefer a question naming the model; otherwise offer its family's selection guide.
const guides = [
  { title: 'What is a blank-face GFCI?', slug: 'what-is-blank-face-gfci', models: ['GL20'] },
  { title: 'Can a USB-C wall outlet charge a laptop?', slug: 'usb-c-wall-outlet-laptop-charging', models: ['FTR15QC-DC65W'] },
  { title: 'Back wire vs push-in outlets: what changes?', slug: 'back-wire-vs-push-in-outlets', models: ['R15', 'R15Q', 'D15Q'] },
  { title: 'Why do LED lights flicker on a dimmer?', slug: 'led-lights-flicker-on-dimmer', models: ['DM2010', 'DM2010S'] },
  { title: 'Two or three switches in one box: choosing a combination switch', slug: 'combination-light-switch-double-triple-rocker', models: ['DS1502', 'DS1503', 'DS15.3'] },
  { title: 'Smart switches with or without neutral: which version fits?', slug: 'smart-switch-neutral-vs-no-neutral', models: ['USW8811', 'USW8811-S'] },
  { title: 'Screwless vs screw-fixed wallplates: what to check', slug: 'screwless-vs-screw-fixed-wallplates', models: ['BS1801', 'BS1802', 'BS1803-G', 'BS1803-M'] },
];

const byModel = new Map(guides.flatMap(({ title, slug, models }) => models.map(model => [model, { title, href: `/blog/${slug}` }])));

export function modelGuideLink(sku, line) {
  if (byModel.has(sku)) return byModel.get(sku);
  const resource = buyingGuides[line]?.resource;
  return resource ? { title: resource.label.replace(/^Read the /, ''), href: resource.to, updated: '2026-10-28' } : null;
}
