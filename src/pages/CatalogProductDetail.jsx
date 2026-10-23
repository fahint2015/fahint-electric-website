import { getCatalogProducts } from '../data/catalogProducts.js';
import { products } from '../data/products.js';
import ProductModelPage from '../components/products/ProductModelPage.jsx';

export default function CatalogProductDetail({ product }) {
  const related = [...(product.line === 'gfci' ? products : []), ...getCatalogProducts(product.line)]
    .filter(candidate => !candidate.draft && candidate.sku !== product.sku)
    .sort((a, b) => Number(b.group === product.group) - Number(a.group === product.group)).slice(0, 8);
  return <ProductModelPage key={product.slug} product={product} related={related} />;
}
