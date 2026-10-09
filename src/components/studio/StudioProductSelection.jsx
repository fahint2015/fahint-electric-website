import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { productLines } from '../../data/lines.js';
import { StudioImage } from './StudioShared.jsx';
import Reveal from '../Reveal.jsx';

// Homepage category entrances only; model photography and the full catalog stay unchanged.
const installedCategories = [
  { slug: 'gfci', image: 'gf15-kitchen-installed-v1.webp', setting: 'a kitchen backsplash' },
  { slug: 'usb-outlets', image: 'ftr15qc-dc65w-desk-installed-v1.webp', setting: 'a writing desk' },
  { slug: 'dimmers', image: 'dm2010-living-installed-v1.webp', setting: 'a living-room entrance' },
  { slug: 'receptacles', image: 'r15-reading-corner-installed-v1.webp', setting: 'a reading corner' },
  { slug: 'smart-switches', image: 'usw8811-bedside-installed-v1.webp', setting: 'a bedside table' },
  { slug: 'lighting-switches', image: 'ds15-hallway-installed-v1.webp', setting: 'a hallway entrance' }
];

export default function StudioProductSelection() {
  return <section className="studio-collection studio-space" id="studio-collection" aria-labelledby="studio-collection-title">
    <div className="studio-wrap">
      <Reveal as="header" className="studio-section-head">
        <h2 id="studio-collection-title">Find the right device.</h2>
      </Reveal>
      <ul className="studio-selection-grid" aria-label="Product categories">
        {installedCategories.map(({ slug, image, setting }, index) => {
          const { name } = productLines.find(line => line.slug === slug);
          return <Reveal as="li" className="studio-installation-reveal" key={slug} delay={index % 3 * 80}>
            <Link className="studio-selection-card" to={`/products/${slug}`} aria-label={`Explore ${name}`}>
              <div className="studio-selection-card__image">
                <StudioImage src={`assets/images/home-installations/${image}`} alt={`${name}, illustrative installation at ${setting}`} width={1536} height={1024} responsive sizes="(max-width: 760px) calc(100vw - 44px), (max-width: 1150px) calc(50vw - 56px), min(40vw, 667px)" />
              </div>
              <div className="studio-selection-card__caption"><h3>{name}</h3><span className="studio-selection-card__action" aria-hidden="true"><ArrowUpRight size={22} /></span></div>
            </Link>
          </Reveal>;
        })}
      </ul>
    </div>
  </section>;
}
