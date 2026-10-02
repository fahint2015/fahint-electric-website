import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import SafeImage from '../components/SafeImage.jsx';
import { isVerifiedListing, products } from '../data/products.js';
import { gfciSeriesVisuals } from '../data/productPageVisuals.js';
import { getCatalogProducts } from '../data/catalogProducts.js';
import CatalogModelCard from '../components/products/CatalogModelCard.jsx';
import { findLine } from '../data/lines.js';
import { familyMetadata } from '../seo/metadata.js';
import { usePageMetadata } from '../seo/usePageMetadata.js';
import { BuyingGuide } from '../components/products/BuyingGuide.jsx';

const GFCI_HERO_VIDEO = `${import.meta.env.BASE_URL}assets/videos/gfci-product-video-optimized.mp4`;
const GFCI_HERO_POSTER = `${import.meta.env.BASE_URL}assets/videos/gfci-product-video-poster.webp`;

const verifiedListings = products.filter(isVerifiedListing);
const reviewListings = products.filter((product) => !isVerifiedListing(product));
const industrialModels = getCatalogProducts('gfci');
const verifiedListingFile = verifiedListings[0]?.listing.file;
const ENGINEERING_PROOF = [
  {
    title: 'Self-test protection',
    body: 'Automatic protection monitoring across the published GFCI platform.'
  },
  {
    title: 'Reverse-wiring lockout',
    body: 'Line/load reversal prevents power at the receptacle face.'
  },
  {
    title: 'Verified GFCI platform',
    body: `${verifiedListings.length === 6 ? 'Six' : verifiedListings.length} published models are named under UL / cUL file ${verifiedListingFile}; ${reviewListings.map((product) => product.sku).join(', ')} documentation remains under review.`
  }
];

const OEM_OPTIONS = [
  'Finish coordination',
  'Brand marking',
  'Packaging coordination',
  'Documentation support'
];

export default function GfciSeries() {
  usePageMetadata(familyMetadata(findLine('gfci')));
  return (
    <div className="gfci-series">
      <section className="gfci-series__hero gfci-series-hero">
        <video
          className="gfci-series__hero-video"
          data-testid="gfci-hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={GFCI_HERO_POSTER}
          aria-hidden="true"
        >
          <source src={GFCI_HERO_VIDEO} type="video/mp4" />
        </video>
        <div className="gfci-series__hero-shade" aria-hidden="true" />
        <div className="container gfci-series__hero-grid">
          <div className="gfci-series__hero-content">
            <h1>GFCI Product Range</h1>
            <p className="gfci-series__hero-copy">
              Compare seven published models, then confirm the finish and program requirements for your market.
            </p>
          </div>
        </div>
      </section>

      <section className="gfci-series__catalog section" aria-labelledby="gfci-models-heading">
        <div className="container">
          <div className="gfci-series__catalog-head">
            <h2 id="gfci-models-heading">Explore GFCI models</h2>
            <div><p>{products.length} published models</p><Link className="textlink" to="/products/gfci#buying-guide">Need help choosing?</Link></div>
          </div>
          <div className="prod-grid gfci-series__product-grid gfci-product-grid">
            {products.map((product) => <ProductCard key={product.sku} product={product} />)}
          </div>
        </div>
      </section>

      <section className="gfci-series__comparison gfci-comparison section section--gray" aria-labelledby="gfci-comparison-heading">
        <div className="container gfci-series__comparison-panel">
          <div className="section-head">
            <h2 id="gfci-comparison-heading">Compare the published range</h2>
          </div>
          <div
            className="gfci-series__table-wrap"
            role="region"
            aria-label="GFCI model comparison"
            tabIndex={0}
          >
            <table className="spec-table">
              <thead>
                <tr>
                  {['Model', 'Rating', 'NEMA', 'Variant', 'Application'].map((heading) => (
                    <th scope="col" key={heading}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.sku}>
                    <th scope="row"><Link to={`/products/gfci/${product.sku.toLowerCase()}`}>{product.sku}</Link></th>
                    <td>{product.rating}</td>
                    <td>{product.nema}</td>
                    <td>{product.feature}</td>
                    <td>{product.grade.replace(' Grade', '')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="catalog-series__models" id="industrial-models" aria-labelledby="gfci-industrial-heading">
        <div className="container">
          <header className="catalog-section-heading">
            <div><h2 id="gfci-industrial-heading">A different industrial configuration.</h2></div>
            <p>Nylon construction and no feed-through terminals. Review the GTN model-specific documents; the residential-series certificate is not a substitute.</p>
          </header>
          <div className="catalog-model-grid">{industrialModels.map((product) => <CatalogModelCard key={product.sku} product={product} />)}</div>
        </div>
      </section>

      <BuyingGuide line="gfci" />

      <section id="engineering-proof" className="gfci-series__engineering section" aria-labelledby="gfci-engineering-heading">
        <div className="container">
          <div className="section-head">
            <h2 id="gfci-engineering-heading">Protection documented at platform level</h2>
          </div>
          <div className="gfci-series__proof-grid gfci-proof-grid">
            {ENGINEERING_PROOF.map((item, index) => (
              <article key={item.title}>
                <span aria-hidden="true">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="gfci-series__poster-section gfci-series__poster-section--application section" aria-labelledby="gfci-application-heading">
        <div className="gfci-series__wide-container">
          <article className="gfci-series__poster gfci-series__poster--application">
            <SafeImage
              className="gfci-series__poster-image"
              data-testid="gfci-application-poster"
              src={gfciSeriesVisuals.applicationPoster}
              alt=""
              width={1536}
              height={1024}
              loading="lazy"
            />
            <div className="gfci-series__poster-shade" aria-hidden="true" />
            <div className="gfci-series__poster-copy gfci-series__poster-copy--left">
              <h2 id="gfci-application-heading">Specify from documented requirements.</h2>
              <p>
                Match the published model, rating and variant to the project brief before ordering.
              </p>
              <ul className="gfci-series__application-points" aria-label="Application requirements">
                <li>Residential and commercial applications</li>
                <li>15A / 20A and TR / WR selection</li>
                <li>Published platform documentation</li>
              </ul>
              <Link to="/contact" className="textlink">
                Discuss a project <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="gfci-series__poster-section gfci-series__poster-section--oem section" aria-labelledby="gfci-oem-heading">
        <div className="gfci-series__wide-container">
          <article className="gfci-series__poster gfci-series__poster--oem">
            <figure className="gfci-series__oem-photo">
            <SafeImage
              data-testid="gfci-oem-poster"
              src={gfciSeriesVisuals.oemPoster}
              alt="FAHINT GF15 retail box and white wall plate"
              width={1000}
              height={1000}
              loading="lazy"
            />
            <figcaption>GF15 · FAHINT retail packaging example</figcaption>
            </figure>
            <div className="gfci-series__poster-copy gfci-series__poster-copy--right">
              <h2 id="gfci-oem-heading">Verified platforms. Built for your brand.</h2>
              <p>
                Start with the published product, then coordinate finish, marking, packaging and
                approval documents as one program.
              </p>
              <ul className="gfci-series__oem-rail">
                {OEM_OPTIONS.map((option) => <li key={option}>{option}</li>)}
              </ul>
              <Link to="/contact" className="btn btn--primary">
                Start an OEM conversation <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
