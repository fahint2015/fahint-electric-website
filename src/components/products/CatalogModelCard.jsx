import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { productHref } from '../../data/catalogProducts.js';
import SafeImage from '../SafeImage.jsx';

export default function CatalogModelCard({ product, children }) {
  const [width, height] = product.assets.imageSizes[product.assets.card] || [800, 800];
  return (
    <article className="catalog-model-card">
      <Link className="catalog-model-card__image" to={productHref(product)} tabIndex={-1} aria-hidden="true">
        <SafeImage src={product.assets.card} alt="" width={width} height={height} loading="lazy" />
      </Link>
      <div className="catalog-model-card__body">
        <p className="catalog-model-card__sku">{product.sku}</p>
        <h3>{product.name}</h3>
        <p className="catalog-model-card__group">{product.group}</p>
        {product.reviewNotice && <p className="catalog-model-card__review">Review model notes</p>}
        <Link className="textlink" to={productHref(product)} aria-label={`View ${product.sku} details`}>
          View details <ArrowRight size={16} aria-hidden="true" />
        </Link>
        {children}
      </div>
    </article>
  );
}
