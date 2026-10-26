import { Link } from './SiteLink.jsx';
import { ArrowRight } from 'lucide-react';
import { productImage } from '../data/products.js';
import SafeImage from './SafeImage.jsx';
import Reveal from './Reveal.jsx';

const VARIANT_LABELS = {
  standard: 'STANDARD',
  tr: 'TR',
  wr: 'TR + WR',
  blank: 'BLANK FACE'
};

export function productVariantLabel(product) {
  return VARIANT_LABELS[product.category] || 'STANDARD';
}

export default function ProductCard({ product }) {
  const productLabel = `${product.sku} ${product.name}`;
  const receptacleType = product.nema === 'Blank face' ? product.nema : `NEMA ${product.nema}`;

  return (
    <Reveal as={Link}
      to={`/products/gfci/${product.sku.toLowerCase()}`}
      className="pcard"
      aria-label={productLabel}
    >
      <div className="pcard__media">
        <span className="pcard__tag">{productVariantLabel(product)}</span>
        <SafeImage
          src={product.assets?.hero || productImage(product.sku, 'hero')}
          alt={productLabel}
          width={800}
          height={800}
          loading="lazy"
        />
      </div>
      <div className="pcard__body">
        <div className="pcard__sku">{product.sku}</div>
        <h3 className="pcard__name">{product.name}</h3>
        <div className="pcard__meta">
          <span>{product.rating}</span>
          <span>{receptacleType}</span>
        </div>
        <div className="pcard__foot">
          <span className="textlink">
            View details <ArrowRight size={15} />
          </span>
        </div>
      </div>
    </Reveal>
  );
}
