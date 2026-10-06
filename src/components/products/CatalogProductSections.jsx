import { ArrowRight, ExternalLink, FileCheck2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SafeImage from '../SafeImage.jsx';
import { publicAsset } from '../../utils/publicAsset.js';
import { resourcesHref } from '../../data/documents.js';
import { usbDimensionReference } from '../../data/usbDimensions.js';
import UsbDimensions from './UsbDimensions.jsx';
import ReceptacleOutline from './ReceptacleOutline.jsx';
import { SmartSwitchDetails, SmartSwitchReferences } from './SmartSwitchDetails.jsx';

export function CatalogFeatures({ product }) {
  if (product.line === 'smart-switches') return <SmartSwitchDetails product={product} />;
  const image = product.assets.detail || product.assets.hero;
  const [width, height] = product.assets.imageSizes[image] || [800, 800];
  const separateDetail = image !== product.assets.hero;
  return (
    <section className="product-story product-story--feature catalog-features">
      <div className="container">
        <header className="catalog-section-heading">
          <div><p className="product-section-label">Product details</p><h2>{product.heading}</h2></div>
          <p>Model {product.sku}. A closer look at the product and the details that distinguish this configuration.</p>
        </header>
        <div className={`catalog-features__body${separateDetail ? '' : ' catalog-features__body--text'}`}>
          {separateDetail && <figure><SafeImage src={image} alt={`${product.sku} product detail reference`} width={width} height={height} loading="lazy" /></figure>}
          <ol className="catalog-features__list">
            {product.features.map((feature, index) => (
              <li key={`${index}-${feature}`}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><p>{feature}</p></li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function CatalogApplications({ product, contactHref = `/contact?model=${encodeURIComponent(product.sku)}` }) {
  return (
    <section className="product-story product-story--application catalog-applications">
      <div className="container">
        <header className="catalog-section-heading">
          <div><p className="product-section-label">Application review</p><h2>{product.applicationHeading}</h2></div>
          <Link className="textlink" to={contactHref}>Review your application <ArrowRight size={16} aria-hidden="true" /></Link>
        </header>
        <div className="catalog-applications__grid">
          {product.applications.map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}
        </div>
      </div>
    </section>
  );
}

export function CatalogPresentation({ product, contactHref = `/contact?model=${encodeURIComponent(product.sku)}` }) {
  const photos = product.assets.presentation || [];
  return (
    <section className="product-story product-story--cool catalog-presentation">
      <div className="container">
        <header className="catalog-section-heading">
          <div><p className="product-section-label">Program configuration</p><h2>Product, finish and packaging.</h2></div>
          <p>Coordinate the exact model, visible finish and customer-branded outer packaging in one approved sample.</p>
        </header>
        <div className={`catalog-presentation__body${photos.length ? '' : ' catalog-presentation__body--text'}`}>
          {photos.length > 0 && <div className="catalog-presentation__photos">
            {photos.map((image, index) => <figure key={image.src}>
              <SafeImage src={image.src} alt={`${product.sku} ${image.caption || `presentation reference ${index + 1}`}`} width={image.width} height={image.height} loading="lazy" />
              <figcaption>{image.caption || `Presentation reference ${String(index + 1).padStart(2, '0')}`}</figcaption>
            </figure>)}
          </div>}
          <div className="catalog-presentation__copy">
            <dl>
              <div><dt>Exact configuration</dt><dd>Confirm {product.sku}, its finish and any included wall plate on the quotation.</dd></div>
              <div><dt>Custom outer packaging</dt><dd>Customer-branded boxes can be reviewed with your artwork and brand authorization.</dd></div>
              <div><dt>Packing quantities</dt><dd>Inner-box and carton quantities are confirmed for the selected model and packaging format.</dd></div>
            </dl>
            <Link className="btn btn--primary" to={contactHref}>
              Discuss {product.sku} configuration <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CatalogDrawings({ product, contactHref }) {
  const drawings = product.assets.drawings || [];
  if (product.line === 'smart-switches' && drawings.length) return <SmartSwitchReferences product={product} />;
  if (!drawings.length) {
    return product.line === 'receptacles' && ['R15', 'R15Q', 'R20'].includes(product.sku)
      ? <ReceptacleOutline product={product} contactHref={contactHref} /> : null;
  }
  const usbDimensions = usbDimensionReference(product);
  if (usbDimensions) return <UsbDimensions product={product} dimensions={usbDimensions} />;
  return (
    <section className="product-technical catalog-drawings" id="installation-reference">
      <div className="container">
        <header className="catalog-section-heading">
          <div><p className="product-section-label">Model reference</p><h2>Dimensions &amp; installation reference.</h2></div>
          <p>Open the original model drawing for a closer look. Follow the approved installation instructions for the exact model.</p>
        </header>
        <div className="catalog-drawings__grid">
          {drawings.map((drawing, index) => <figure key={drawing.src}>
            <a href={publicAsset(drawing.src)} target="_blank" rel="noreferrer" aria-label={`Open ${product.sku} reference drawing ${index + 1}`}>
              <SafeImage src={drawing.src} alt={`${product.sku} original reference drawing ${index + 1}`} width={drawing.width} height={drawing.height} loading="lazy" />
              <span>Open full drawing <ExternalLink size={15} aria-hidden="true" /></span>
            </a>
          </figure>)}
        </div>
      </div>
    </section>
  );
}

export function CatalogDocumentation({ product, contactHref = `/contact?model=${encodeURIComponent(product.sku)}` }) {
  const certificate = product.certificate;
  return (
    <section className="product-technical catalog-documentation" id="model-documentation">
      <div className={`container catalog-documentation__layout${certificate?.image ? '' : ' catalog-documentation__layout--text'}`}>
        {certificate?.image && <figure className="catalog-documentation__certificate">
          <a href={publicAsset(certificate.image)} target="_blank" rel="noreferrer" aria-label={`Open ${product.sku} series certificate`}>
            <SafeImage src={certificate.image} alt={`${product.sku} series certificate reference`} width={900} height={1165} loading="lazy" />
            <span>Open full certificate <ExternalLink size={15} aria-hidden="true" /></span>
          </a>
        </figure>}
        <div>
          <p className="product-section-label">Source documentation</p>
          <h2>Details your team can review.</h2>
          <p className="catalog-documentation__reference"><FileCheck2 size={20} aria-hidden="true" />{product.certificationLabel}</p>
          <p>Specifications are recorded for {product.sku}. A series certificate is supporting documentation; confirm that the exact model is covered before final specification or purchase.</p>
          <div className="catalog-documentation__links">
            <Link to={resourcesHref(product)}>Browse product resources <ArrowRight size={15} aria-hidden="true" /></Link>
            {product.sources.map((source) => <a key={source.href} href={source.kind === 'website' ? source.href : publicAsset(source.href)} target="_blank" rel="noreferrer">
              {source.kind === 'website' ? 'View original model specifications' : source.label} <ExternalLink size={15} aria-hidden="true" />
            </a>)}
            <Link to={contactHref}>Request model-specific documents <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          {product.notes.length > 0 && <aside className="catalog-documentation__notes" aria-label="Specification notes">
            <h3>Specification notes</h3>
            <ul>{product.notes.map((note) => <li key={note}>{note}</li>)}</ul>
          </aside>}
        </div>
      </div>
    </section>
  );
}
