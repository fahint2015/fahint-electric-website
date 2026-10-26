import { Link } from './SiteLink.jsx';
import { publicAsset } from '../utils/publicAsset.js';
import Reveal from './Reveal.jsx';

export default function BrandBanner({ title, label, description, image, alt = '', position = 'center', width = 1536, height = 1024, className = '', children }) {
  const srcSet = image.startsWith('assets/images/brand-home/') && image.endsWith('.webp')
    ? [768, 1200, width].map(size => `${publicAsset(image.replace(/\.webp$/, size === width ? '.webp' : `-${size}.webp`))} ${size}w`).join(', ')
    : undefined;
  return <header className={`brand-banner ${className}`.trim()}>
    <img className="brand-banner-photo" src={publicAsset(image)} srcSet={srcSet} sizes={srcSet ? '100vw' : undefined} width={width} height={height} alt={alt} style={{ objectPosition: position }} loading="eager" fetchpriority="high" />
    <div className="brand-banner-shade" aria-hidden="true" />
    <div className="wrap brand-banner-copy">{label !== false && <p className="eyebrow">{label || 'FAHINT'}</p>}<Reveal as="h1">{title}</Reveal>{description && <Reveal as="p" delay={160}>{description}</Reveal>}{children}</div>
  </header>;
}

export function BrandBreadcrumb({ current }) {
  return <nav className="wrap brand-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">{current}</span></nav>;
}
