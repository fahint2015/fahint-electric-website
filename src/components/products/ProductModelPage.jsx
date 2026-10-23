import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { findLine } from '../../data/lines.js';
import { productMetadata } from '../../seo/metadata.js';
import { usePageMetadata } from '../../seo/usePageMetadata.js';
import { inquiryContactHref, resolveInquiryContext } from '../../utils/inquiryContext.js';
import ProductDetailHero from './ProductDetailHero.jsx';
import ConciseProductDetails from './ConciseProductDetails.jsx';
import RecommendedProducts from './RecommendedProducts.jsx';
import FloatingRail from '../FloatingRail.jsx';

export default function ProductModelPage({ product, related }) {
  const { pathname, search } = useLocation();
  const [finish, setFinish] = useState('');
  const line = findLine(product.line || 'gfci');
  const context = resolveInquiryContext(product.sku, finish);
  const quoteHref = inquiryContactHref(context);
  usePageMetadata(productMetadata(product, line));
  return <><div className="concise-product-page">
    <nav className="product-detail-breadcrumb" aria-label="Breadcrumb"><div className="container crumbs">
      <Link to="/">Home</Link><span aria-hidden="true">/</span><Link to="/products">Products</Link>
      <span aria-hidden="true">/</span><Link to={`/products/${line.slug}`}>{line.name}</Link>
      <span aria-hidden="true">/</span><span aria-current="page">{product.sku}</span>
    </div></nav>
    <ProductDetailHero product={product} anchorPath={pathname} anchorSearch={search} inquiryFinish={finish} onFinishChange={setFinish} compact quoteHref={quoteHref} />
    <ConciseProductDetails key={product.sku} product={product} contactHref={inquiryContactHref(context, 'technical')} />
    {related.length > 0 && <RecommendedProducts products={related} />}
  </div><FloatingRail product={product} /></>;
}
