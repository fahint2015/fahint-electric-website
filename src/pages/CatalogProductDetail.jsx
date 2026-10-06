import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { MessageSquareText } from 'lucide-react';
import { findLine } from '../data/lines.js';
import { getCatalogProducts } from '../data/catalogProducts.js';
import ProductDetailHero from '../components/products/ProductDetailHero.jsx';
import { ProductSpecifications } from '../components/products/ProductTechnicalSections.jsx';
import { CatalogApplications, CatalogDocumentation, CatalogDrawings, CatalogFeatures, CatalogPresentation } from '../components/products/CatalogProductSections.jsx';
import CatalogModelCard from '../components/products/CatalogModelCard.jsx';
import InquiryForm from '../components/InquiryForm.jsx';
import { productMetadata } from '../seo/metadata.js';
import { usePageMetadata } from '../seo/usePageMetadata.js';
import { ModelBuyingChecklist } from '../components/products/BuyingGuide.jsx';
import { inquiryContactHref, resolveInquiryContext } from '../utils/inquiryContext.js';

export default function CatalogProductDetail({ product }) {
  const { pathname, search } = useLocation();
  const [selection, setSelection] = useState(null);
  const selectedModel = selection?.pageModel === product.sku ? selection.model : product.sku;
  const selectedFinish = selection?.pageModel === product.sku ? selection.finish : '';
  const context = resolveInquiryContext(selectedModel, selectedFinish);
  const selectModel = model => setSelection({ pageModel: product.sku, model, finish: '' });
  const selectFinish = finish => setSelection({ pageModel: product.sku, model: product.sku, finish });
  const pageContext = selectedModel === product.sku ? context : resolveInquiryContext(product.sku);
  const technicalContact = inquiryContactHref(pageContext, 'technical');
  const line = findLine(product.line);
  const isUsb = product.line === 'usb-outlets';
  const isSmart = product.line === 'smart-switches';
  const isLighting = product.line === 'lighting-switches';
  const upfrontSpecifications = isUsb || isSmart || isLighting || product.line === 'receptacles' || product.line === 'dimmers';
  const models = getCatalogProducts(product.line);
  const related = models.filter((candidate) => candidate.slug !== product.slug)
    .sort((a, b) => Number(b.group === product.group) - Number(a.group === product.group)).slice(0, 4);

  usePageMetadata(productMetadata(product, line));

  return (
    <div className={`catalog-product-detail${isUsb ? ' catalog-product-detail--usb' : ''}${isSmart ? ' catalog-product-detail--smart' : ''}${isLighting ? ' catalog-product-detail--lighting' : ''}${upfrontSpecifications ? ' catalog-product-detail--matrix' : ''}`}>
      <nav className="product-detail-breadcrumb" aria-label="Breadcrumb">
        <div className="container crumbs">
          <Link to="/">Home</Link><span aria-hidden="true">/</span><Link to="/products">Products</Link>
          <span aria-hidden="true">/</span><Link to={`/products/${product.line}`}>{line.name}</Link>
          <span aria-hidden="true">/</span><span aria-current="page">{product.sku}</span>
        </div>
      </nav>
      <ProductDetailHero key={product.slug} product={product} anchorPath={pathname} anchorSearch={search}
        inquiryFinish={selectedModel === product.sku ? selectedFinish : ''} onFinishChange={selectFinish} />
      {upfrontSpecifications ? <ProductSpecifications key={`specifications-${product.slug}`} product={product} layout="matrix" /> : <nav className="catalog-product-nav" aria-label="Product sections">
        <div className="container">
          <Link to={{ pathname, search, hash: '#technical-details' }}>Specifications</Link>
          {product.assets.drawings.length > 0 && <Link to={{ pathname, search, hash: '#installation-reference' }}>Drawings</Link>}
          <Link to={{ pathname, search, hash: '#model-documentation' }}>Documentation</Link>
          <Link to={{ pathname, search, hash: '#inquiry' }}>Request a quote</Link>
        </div>
      </nav>}
      <CatalogFeatures product={product} />
      <CatalogApplications product={product} contactHref={technicalContact} />
      {!product.draft && <CatalogPresentation product={product} contactHref={inquiryContactHref(pageContext, 'oem')} />}
      {!upfrontSpecifications && <ProductSpecifications key={`specifications-${product.slug}`} product={product} />}
      <CatalogDrawings product={product} contactHref={technicalContact} />
      <CatalogDocumentation product={product} contactHref={technicalContact} />
      {related.length > 0 && <section className="product-related">
        <div className="container">
          <header className="catalog-section-heading">
            <div><p className="product-section-label">Related models</p><h2>Compare the configurations.</h2></div>
            <Link className="textlink" to={`/products/${product.line}`}>All {line.name.toLowerCase()}</Link>
          </header>
          <div className="catalog-model-grid">{related.map((model) => <CatalogModelCard key={model.slug} product={model} />)}</div>
        </div>
      </section>}
      <section className="product-inquiry" id="inquiry">
        <div className="container product-inquiry__layout">
          <div className="product-inquiry__intro">
            <p className="product-section-label">Project inquiry</p><h2>{product.draft ? 'Request approved documentation' : 'Request a quotation'} for {product.sku}.</h2>
            <p>Share the quantity, intended application, finish and packaging needs. The selected model travels with your inquiry.</p>
            <Link className="textlink" to={inquiryContactHref(context)}>Use the full contact page</Link>
            <ModelBuyingChecklist product={product} />
          </div>
          <InquiryForm defaultModel={selectedModel} productContext={context} onModelChange={selectModel} modelOptions={models} title="Send a product brief." />
        </div>
      </section>
      <Link className="product-mobile-quote" to={{ pathname, search, hash: '#inquiry' }} aria-label={`Request ${product.draft ? 'documents' : 'quote'} for ${product.sku}`}>
        <MessageSquareText size={24} aria-hidden="true" />
      </Link>
    </div>
  );
}
