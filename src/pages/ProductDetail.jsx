import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { MessageSquareText } from 'lucide-react';
import { findProduct, products } from '../data/products.js';
import { findCatalogProduct } from '../data/catalogProducts.js';
import { findLine } from '../data/lines.js';
import { productMetadata } from '../seo/metadata.js';
import { usePageMetadata } from '../seo/usePageMetadata.js';
import { ModelBuyingChecklist } from '../components/products/BuyingGuide.jsx';
import CatalogProductDetail from './CatalogProductDetail.jsx';
import ProductCard from '../components/ProductCard.jsx';
import InquiryForm from '../components/InquiryForm.jsx';
import ProductDetailHero from '../components/products/ProductDetailHero.jsx';
import {
  ProductApplicationStory,
  ProductFeatureStory,
  ProductOemStory
} from '../components/products/ProductStorySections.jsx';
import {
  ProductCertification,
  ProductInstallation,
  ProductManufacturingProof,
  ProductSpecifications
} from '../components/products/ProductTechnicalSections.jsx';

function RelatedProducts({ products: related }) {
  return (
    <section className="product-related">
      <div className="container">
        <div className="product-technical__head">
          <p className="product-section-label">Related models</p>
          <h2>Other verified GFCI models.</h2>
        </div>
        <div className="prod-grid">
          {related.map((product) => <ProductCard key={product.sku} product={product} />)}
        </div>
      </div>
    </section>
  );
}

function ProductInquiry({ product }) {
  return (
    <section className="product-inquiry" id="inquiry">
      <div className="container product-inquiry__layout">
        <div className="product-inquiry__intro">
          <p className="product-section-label">Project inquiry</p>
          <h2>Request a quotation for {product.sku}.</h2>
          <p>
            Share the intended application, target finish and documentation needs so the team can review the product brief.
          </p>
          <Link className="textlink" to={`/contact?model=${encodeURIComponent(product.sku)}`}>
            Use the full contact page
          </Link>
          <ModelBuyingChecklist product={product} />
        </div>
        <InquiryForm defaultModel={product.sku} title="Send a product brief." />
      </div>
    </section>
  );
}

export default function ProductDetail() {
  const { sku, line = 'gfci' } = useParams();
  const { pathname, search } = useLocation();
  const product = line === 'gfci' ? findProduct(sku) : null;
  const catalogProduct = findCatalogProduct(line, sku);

  usePageMetadata(product ? productMetadata(product, findLine('gfci')) : undefined);

  if (!product && catalogProduct) return <CatalogProductDetail key={`${line}-${catalogProduct.slug}`} product={catalogProduct} />;
  if (!product) return <Navigate to={findLine(line) ? `/products/${line}` : '/products'} replace />;

  const related = products.filter((candidate) => candidate.sku !== product.sku).slice(0, 4);

  return (
    <>
      <nav className="product-detail-breadcrumb" aria-label="Breadcrumb">
        <div className="container crumbs">
          <Link to="/">Home</Link> <span aria-hidden="true">/</span> <Link to="/products">Products</Link>{' '}
          <span aria-hidden="true">/</span> <Link to="/products/gfci">GFCI Outlets</Link>{' '}
          <span aria-hidden="true">/</span> <span aria-current="page">{product.sku}</span>
        </div>
      </nav>

      <ProductDetailHero product={product} anchorPath={pathname} anchorSearch={search} />
      <ProductSpecifications product={product} layout="matrix" />
      <ProductFeatureStory product={product} />
      <ProductApplicationStory product={product} />
      <ProductOemStory product={product} />
      <ProductInstallation product={product} />
      <ProductCertification product={product} />
      <ProductManufacturingProof />
      <RelatedProducts products={related} />
      <ProductInquiry product={product} />

      <Link
        className="product-mobile-quote"
        to={{ pathname, search, hash: '#inquiry' }}
        aria-label={`Request quote for ${product.sku}`}
      >
        <MessageSquareText size={24} aria-hidden="true" />
      </Link>
    </>
  );
}
