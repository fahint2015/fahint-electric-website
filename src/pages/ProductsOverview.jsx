import { ArrowRight, FileCheck2, Factory } from 'lucide-react';
import { Link } from '../components/SiteLink.jsx';
import SafeImage from '../components/SafeImage.jsx';
import ProductRangeDirectory from '../components/products/ProductRangeDirectory.jsx';
import EditorialPhoto from '../components/company/EditorialPhoto.jsx';
import { companyPhotos } from '../data/companyProfile.js';
import {
  productOverviewVisualDimensions,
  productOverviewVisuals
} from '../data/productPageVisuals.js';

const markets = [
  {
    title: 'Residential & renovation',
    summary: 'Protection and wiring devices for kitchens, bathrooms and renovation programs.',
    visualKey: 'marketResidential',
    href: '/products/gfci',
    action: 'Explore GFCI outlets'
  },
  {
    title: 'Hospitality & multifamily',
    summary: 'In-wall charging for guest rooms, shared spaces and multifamily developments.',
    visualKey: 'marketHospitality',
    href: '/products/usb-outlets',
    action: 'Explore USB outlets'
  },
  {
    title: 'Commercial fit-out',
    summary: 'Product specification and manufacturing support for commercial wiring-device programs.',
    visualKey: 'marketCommercial',
    href: '/capabilities',
    action: 'Review project capabilities'
  }
];

export default function ProductsOverview() {
  return (
    <div className="product-overview">
      <ProductRangeDirectory />

      <section className="product-brand-system" aria-labelledby="product-brand-title">
        <div className="container product-brand-system__inner">
          <figure className="product-brand-system__media">
            <EditorialPhoto {...companyPhotos.display} ratio={557 / 271} />
            <figcaption>Original product display · FAHINT exhibition</figcaption>
          </figure>
          <div className="product-brand-system__copy">
            <h2 id="product-brand-title">Built for brands and OEM programs.</h2>
            <p>Coordinate product selection, finishes, markings, documentation and packaging around one market-ready wiring-device program.</p>
            <Link className="editorial-button" to="/capabilities">
              Explore OEM/ODM support <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="product-market-section" aria-labelledby="product-market-title">
        <div className="container">
          <div className="product-overview-heading">
            <div>
              <h2 id="product-market-title">Specified for real projects.</h2>
            </div>
            <p>Start with the installation environment, then coordinate the product mix around the project brief.</p>
          </div>
          <div className="product-market-grid">
            {markets.map((market) => (
              <Link className="product-market-card" key={market.title} to={market.href}>
                <SafeImage src={productOverviewVisuals[market.visualKey]} alt="" {...productOverviewVisualDimensions[market.visualKey]} loading="lazy" />
                <div className="product-market-card__shade" aria-hidden="true" />
                <div className="product-market-card__body">
                  <h3>{market.title}</h3>
                  <p>{market.summary}</p>
                  <span className="product-market-card__action">{market.action} <ArrowRight size={17} aria-hidden="true" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="product-evidence-section" aria-labelledby="product-evidence-title">
          <SafeImage
            className="product-evidence-section__image"
            src={productOverviewVisuals.factory}
            alt="Fahint production and functional testing line"
            {...productOverviewVisualDimensions.factory}
            loading="lazy"
          />
          <div className="product-evidence-section__shade" aria-hidden="true" />
        <div className="container product-evidence-section__grid">
          <div className="product-evidence-section__copy">
            <h2 id="product-evidence-title">Verified manufacturing and compliance.</h2>
            <p>Integrated production, functional inspection and standards-focused documentation support consistent product programs from approval sample through shipment.</p>
          </div>
          <ul className="product-evidence-links" aria-label="Manufacturing and certification resources" role="list">
            <li>
              <Factory size={24} aria-hidden="true" />
              <div>
                <h3>Production &amp; testing</h3>
                <p>Product development, manufacturing and quality control in Yueqing, Wenzhou.</p>
                <Link className="editorial-text-link" to="/capabilities">View manufacturing <ArrowRight size={17} aria-hidden="true" /></Link>
              </div>
            </li>
            <li>
              <FileCheck2 size={24} aria-hidden="true" />
              <div>
                <h3>Model-specific certification</h3>
                <p>Certification coverage varies by model. Review the applicable UL/cUL files and model addenda before specifying.</p>
                <Link className="editorial-text-link" to="/resources#certifications">View certification details <ArrowRight size={17} aria-hidden="true" /></Link>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section className="product-overview-cta" aria-labelledby="product-cta-title">
        <div className="container product-overview-cta__inner">
          <div>
            <h2 id="product-cta-title">Tell us what your market needs.</h2>
            <p>Share your target product mix, finishes, compliance needs and forecast volume.</p>
          </div>
          <Link className="editorial-button" to="/contact">Request a quote <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>
    </div>
  );
}
