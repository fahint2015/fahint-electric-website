import BrandBanner from '../components/BrandBanner.jsx';
import GfciModelDirectory from '../components/products/GfciModelDirectory.jsx';
import { isVerifiedListing, products } from '../data/products.js';
import { findLine } from '../data/lines.js';
import { familyMetadata } from '../seo/metadata.js';
import { usePageMetadata } from '../seo/usePageMetadata.js';
import { BuyingGuide } from '../components/products/BuyingGuide.jsx';
import { getCatalogProducts } from '../data/catalogProducts.js';


const verifiedListings = products.filter(isVerifiedListing);
const reviewListings = products.filter((product) => !isVerifiedListing(product));
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

export default function GfciSeries() {
  usePageMetadata(familyMetadata(findLine('gfci'), [...products, ...getCatalogProducts('gfci')]));
  return (
    <div className="gfci-series">
      <section className="gfci-series__hero gfci-series-hero"><BrandBanner title="GFCI Outlets" label={false} image="assets/images/lines/gfci-series-kitchen-wide-v1.webp" width={2172} height={724} position="72% center" className="brand-banner--series" /></section>
      <GfciModelDirectory />

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
    </div>
  );
}
