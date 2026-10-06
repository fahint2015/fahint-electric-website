import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
import { inquiryContactHref, resolveInquiryContext } from '../utils/inquiryContext.js';
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

function ProductInquiry({ product, selectedModel, context, onModelChange }) {
  return (
    <section className="product-inquiry" id="inquiry">
      <div className="container product-inquiry__layout">
        <div className="product-inquiry__intro">
          <p className="product-section-label">Project inquiry</p>
          <h2>Request a quotation for {product.sku}.</h2>
          <p>
            Share the intended application, target finish and documentation needs so the team can review the product brief.
          </p>
          <Link className="textlink" to={inquiryContactHref(context)}>
            Use the full contact page
          </Link>
          <ModelBuyingChecklist product={product} />
        </div>
        <InquiryForm defaultModel={selectedModel} productContext={context} onModelChange={onModelChange} title="Send a product brief." />
      </div>
    </section>
  );
}

export default function ProductDetail() {
  const { sku, line = 'gfci' } = useParams();
  const { pathname, search } = useLocation();
  const product = line === 'gfci' ? findProduct(sku) : null;
  const catalogProduct = findCatalogProduct(line, sku);
  const [selection, setSelection] = useState(null);
  const selectedModel = selection && selection.pageModel === product?.sku ? selection.model : product?.sku;
  const selectedFinish = selection && selection.pageModel === product?.sku ? selection.finish : '';
  const context = resolveInquiryContext(selectedModel, selectedFinish);
  const selectModel = model => setSelection({ pageModel: product.sku, model, finish: '' });
  const selectFinish = finish => setSelection({ pageModel: product.sku, model: product.sku, finish });
  useEffect(() => setSelection(null), [product?.sku]);

  usePageMetadata(product ? productMetadata(product, findLine('gfci')) : undefined);

  if (!product && catalogProduct) return <CatalogProductDetail key={`${line}-${catalogProduct.slug}`} product={catalogProduct} />;
  if (!product) return <Navigate to={findLine(line) ? `/products/${line}` : '/products'} replace />;

  const related = products.filter((candidate) => candidate.sku !== product.sku).slice(0, 4);
  const pageContext = selectedModel === product.sku ? context : resolveInquiryContext(product.sku);
  const technicalContact = inquiryContactHref(pageContext, 'technical');

  return (
    <>
      <nav className="product-detail-breadcrumb" aria-label="Breadcrumb">
        <div className="container crumbs">
          <Link to="/">Home</Link> <span aria-hidden="true">/</span> <Link to="/products">Products</Link>{' '}
          <span aria-hidden="true">/</span> <Link to="/products/gfci">GFCI Outlets</Link>{' '}
          <span aria-hidden="true">/</span> <span aria-current="page">{product.sku}</span>
        </div>
      </nav>

      <ProductDetailHero product={product} anchorPath={pathname} anchorSearch={search}
        inquiryFinish={selectedModel === product.sku ? selectedFinish : ''} onFinishChange={selectFinish} />
      <ProductSpecifications product={product} layout="matrix" />
      <ProductFeatureStory product={product} />
      <ProductApplicationStory product={product} contactHref={technicalContact} />
      <ProductOemStory product={product} contactHref={inquiryContactHref(pageContext, 'oem')} />
      <ProductInstallation product={product} />
      <ProductCertification product={product} contactHref={technicalContact} />
      <ProductManufacturingProof />
      <RelatedProducts products={related} />
      <ProductInquiry product={product} selectedModel={selectedModel} context={context} onModelChange={selectModel} />

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
