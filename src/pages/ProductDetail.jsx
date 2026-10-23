import { Navigate, useParams } from 'react-router-dom';
import { findProduct, products } from '../data/products.js';
import { findCatalogProduct, getCatalogProducts } from '../data/catalogProducts.js';
import { findLine } from '../data/lines.js';
import CatalogProductDetail from './CatalogProductDetail.jsx';
import ProductModelPage from '../components/products/ProductModelPage.jsx';

export default function ProductDetail() {
  const { sku, line = 'gfci' } = useParams();
  const product = line === 'gfci' ? findProduct(sku) : null;
  const catalogProduct = findCatalogProduct(line, sku);
  if (!product && catalogProduct) return <CatalogProductDetail key={`${line}-${catalogProduct.slug}`} product={catalogProduct} />;
  if (!product) return <Navigate to={findLine(line) ? `/products/${line}` : '/products'} replace />;
  const related = [...products, ...getCatalogProducts('gfci')].filter(candidate => candidate.sku !== product.sku).slice(0, 8);
  return <ProductModelPage key={product.sku} product={product} related={related} />;
}
