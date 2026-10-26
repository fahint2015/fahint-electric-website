import { Link } from '../components/SiteLink.jsx';
import { ArrowRight } from 'lucide-react';
import BrandBanner from '../components/BrandBanner.jsx';
import Reveal from '../components/Reveal.jsx';
import RecommendedProducts from '../components/products/RecommendedProducts.jsx';
import { applicationPages } from '../data/applicationPages.js';
import { products } from '../data/products.js';
import { findCatalogProduct } from '../data/catalogProducts.js';
import { publicAsset } from '../utils/publicAsset.js';
import { staticMetadata } from '../seo/metadata.js';
import { usePageMetadata } from '../seo/usePageMetadata.js';
import { inquiryContactHref } from '../utils/inquiryContext.js';

export default function ApplicationDetail({ application }) {
  const page = applicationPages[application];
  const scene = `assets/images/brand-home/applications/${page.scene}`;
  const recommended = page.models.map(([family, model]) => family === 'gfci'
    ? products.find(product => product.sku.toLowerCase() === model)
    : findCatalogProduct(family, model));
  usePageMetadata(staticMetadata[`/applications/${application}`]);
  return <div className="residential-application">
    <BrandBanner title={page.name} label="APPLICATIONS" description={page.description} image={`assets/images/brand-home/generated/application-${application}-scene.webp`} alt={page.bannerAlt} />
    <nav className="wrap brand-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><Link to="/applications">Applications</Link><span aria-hidden="true">/</span><span aria-current="page">{page.name}</span></nav>
    <section className="wrap residential-intro" aria-labelledby={`${application}-intro-title`}>
      <Reveal as="figure" className="residential-scene">
        <img src={publicAsset(`${scene}.webp`)} srcSet={[768,1200,1536].map(width => `${publicAsset(`${scene}${width === 1536 ? '' : `-${width}`}.webp`)} ${width}w`).join(', ')} sizes="(max-width: 760px) 100vw, 55vw" width="1536" height="1024" loading="lazy" alt={page.sceneAlt} />
        <figcaption>{`${page.name} application concept`}</figcaption>
      </Reveal>
      <Reveal className="residential-intro-copy" delay={120}>
        <h2 id={`${application}-intro-title`}>{page.introTitle}</h2>
        <p className="body-copy">{page.intro}</p>
        <Link className="text-link" to={`#${application}-products`}>Explore products <ArrowRight size={19} aria-hidden="true" /></Link>
      </Reveal>
    </section>
    <section className="residential-offer" aria-labelledby={`${application}-offer-title`}>
      <div className="wrap">
        <Reveal className="residential-section-heading"><h2 id={`${application}-offer-title`}>What we offer.</h2></Reveal>
        <div className="residential-capabilities">{page.capabilities.map(({ icon: Icon, title, text, family }, index) => <Reveal key={family} delay={index * 80}>
          <Link to={`/products/${family}`}><Icon size={34} strokeWidth={1.5} aria-hidden="true" /><h3>{title}</h3><p>{text}</p><ArrowRight size={21} aria-hidden="true" /></Link>
        </Reveal>)}</div>
      </div>
    </section>
    <section className="residential-features wrap" aria-labelledby={`${application}-features-title`}>
      <Reveal className="residential-feature-heading"><h2 id={`${application}-features-title`}>{page.featuresTitle}</h2><Link className="text-link residential-guide" to="/blog/outlet-planning-by-room">Room-by-room guide <ArrowRight size={18} aria-hidden="true" /></Link></Reveal>
      <div className="residential-feature-grid">{page.features.map(({ icon: Icon, title, text }, index) => <Reveal as="article" key={title} delay={index * 100}>
        <Icon size={32} strokeWidth={1.5} aria-hidden="true" /><h3>{title}</h3><p>{text}</p>
      </Reveal>)}</div>
    </section>
    <div id={`${application}-products`}><RecommendedProducts products={recommended} /></div>
    <section className="residential-contact" aria-labelledby={`${application}-contact-title`}><div className="wrap">
      <div><h2 id={`${application}-contact-title`}>{page.contactTitle}</h2><p>{page.contactText}</p></div>
      <Link className="text-link button-link button-link--light" to={inquiryContactHref(null, 'technical', application)}>Contact us <ArrowRight size={19} aria-hidden="true" /></Link>
    </div></section>
  </div>;
}
