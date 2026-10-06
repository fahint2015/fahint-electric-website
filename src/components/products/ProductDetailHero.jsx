import { ArrowRight, FileCheck2, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { colors, isVerifiedListing, productFinishImage } from '../../data/products.js';
import ProductGallery from './ProductGallery.jsx';

export default function ProductDetailHero({ product, anchorPath, anchorSearch, inquiryFinish, onFinishChange }) {
  const listed = isVerifiedListing(product);
  const [selectedImage, setSelectedImage] = useState(product.assets.hero);
  const [selectedFinish, setSelectedFinish] = useState(null);
  const availableFinishes = product.finishes ?? colors;
  const anchorTarget = (hash) => ({ pathname: anchorPath, search: anchorSearch, hash });
  const configuration = product.nema === 'Blank face' ? product.nema : `NEMA ${product.nema}`;
  const facts = product.keyFacts || [
    ['Rating', product.rating],
    ['Configuration', configuration],
    ['Variant', product.feature],
    ['Application', product.grade]
  ];

  useEffect(() => {
    setSelectedImage(product.assets.hero);
    setSelectedFinish(null);
  }, [product.sku, product.assets.hero]);

  function selectGalleryImage(image) {
    setSelectedImage(image);
    setSelectedFinish(null);
  }

  function selectFinish(finish) {
    setSelectedImage(product.assets.finishes?.[finish.slug] || productFinishImage(product.sku, finish.slug));
    setSelectedFinish(finish.slug);
    onFinishChange?.(finish.slug);
  }

  return (
    <section className="product-detail-hero">
      <div className="container product-detail-hero__grid">
        <ProductGallery
          product={product}
          selectedImage={selectedImage}
          selectedFinish={selectedFinish}
          onSelectImage={selectGalleryImage}
        />

        <div className="product-detail-hero__content">
          <span className="product-detail-hero__model">Model {product.sku}</span>
          <h1>{product.name.split(/(USB-[AC]|Type-C)/g).map((part, index) =>
            /^(USB-[AC]|Type-C)$/.test(part)
              ? <span className="product-name-token" key={index}>{part}</span>
              : part
          )}</h1>
          <p className="product-detail-hero__summary">{product.summary}</p>
          {product.reviewNotice && <p className="catalog-model-notice" role="note">{product.reviewNotice}</p>}

          {availableFinishes.length > 0 && <fieldset className="product-detail-hero__finishes">
            <legend>Available finishes</legend>
            <div className="product-detail-hero__finish-options">
              {availableFinishes.map((finish) => (
                <button
                  key={finish.slug}
                  type="button"
                  className="product-detail-hero__finish"
                  aria-label={`Show ${product.sku} in ${finish.name}`}
                  aria-pressed={(inquiryFinish === undefined ? selectedFinish : inquiryFinish) === finish.slug}
                  onClick={() => selectFinish(finish)}
                >
                  <span
                    className="product-detail-hero__finish-dot"
                    style={{ '--finish-color': finish.hex }}
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
          </fieldset>}

          <div className="product-detail-hero__specifications">
            <p>Key specifications</p>
            <dl className="product-detail-hero__facts product-key-facts">
              {facts.map(([term, description]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{description}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p className={`product-detail-hero__certification${listed ? ' is-verified' : ''}`}>
            {listed ? <ShieldCheck size={19} aria-hidden="true" /> : <FileCheck2 size={19} aria-hidden="true" />}
            {product.certificationLabel || (listed
              ? `UL / cUL listed · file ${product.listing.file}`
              : 'Model-specific certification documentation review required')}
          </p>

          <div className="product-detail-hero__actions">
            <Link to={anchorTarget('#inquiry')} className="btn btn--primary">
              {product.draft ? 'Request documentation' : 'Request a quote'} <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              to={anchorTarget('#technical-details')}
              className="btn btn--ghost"
            >
              Technical details
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
