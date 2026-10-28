import { useRef, useState } from 'react';
import { Link } from '../SiteLink.jsx';
import { ArrowRight, Download } from 'lucide-react';
import { conciseSpecificationRows } from '../../utils/productSpecifications.js';
import { findModelCertificate } from '../../data/certificates.js';
import { resourcesHref, catalogueDocument } from '../../data/documents.js';
import { publicAsset } from '../../utils/publicAsset.js';
import { modelDocumentationNote } from '../../data/buyingGuides.js';
import { modelGuideLink } from '../../data/modelGuideLinks.js';
import Reveal from '../Reveal.jsx';

export { conciseSpecificationRows } from '../../utils/productSpecifications.js';

export default function ConciseProductDetails({ product, contactHref }) {
  const [tab, setTab] = useState('features');
  const tabRefs = useRef({});
  const certificate = findModelCertificate(product);
  const guide = modelGuideLink(product.sku, product.line || 'gfci');
  const features = (product.functionalFeatures || product.features || []).filter(feature => !/certified under.*report reference/i.test(feature));
  const documents = [
    ...(certificate ? [{ label: 'Model certificate', href: certificate.document }] : []),
    ...((product.sources || []).filter(source => source.kind !== 'website')),
    ...((product.documents || []).map(doc => typeof doc === 'string' ? { label: 'Product document', href: doc } : doc)),
    ...(product.assets.drawings || []).map((drawing, i) => ({ label: `Dimensions & wiring reference ${i + 1}`, href: drawing.src }))
  ];
  if (!documents.some(doc => doc.href?.includes(catalogueDocument))) documents.push({ label: 'Product catalog', href: catalogueDocument });
  const uniqueDocuments = documents.filter((doc, index) => doc.href && documents.findIndex(other => other.href === doc.href) === index);
  function keyboard(event) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 'features' : event.key === 'End' ? 'download' : tab === 'features' ? 'download' : 'features';
    setTab(next); tabRefs.current[next]?.focus();
  }
  return <>
    <section className="concise-product-content">
      <div className="container">
        <div role="tablist" aria-label="Product information" className="concise-product-tabs" onKeyDown={keyboard}>
          {['features', 'download'].map(value => <button key={value} ref={element => { tabRefs.current[value] = element; }} id={`product-${value}-tab`} role="tab" type="button" aria-selected={tab === value} tabIndex={tab === value ? 0 : -1} aria-controls={`product-${value}-panel`} onClick={() => setTab(value)}>{value === 'features' ? 'Features' : 'Download'}</button>)}
        </div>
        <div id="product-features-panel" role="tabpanel" aria-labelledby="product-features-tab" tabIndex={0} hidden={tab !== 'features'} className="concise-product-features">
          <ul>{features.map((feature, index) => <li key={`${index}-${feature}`}>{feature}</li>)}</ul>
          {guide && <Link className="textlink concise-product-guide" to={guide.href}>Read the guide: {guide.title} <ArrowRight size={16} aria-hidden="true" /></Link>}
        </div>
        <div id="product-download-panel" role="tabpanel" aria-labelledby="product-download-tab" tabIndex={0} hidden={tab !== 'download'} className="concise-product-downloads">
          <ul>{uniqueDocuments.map(doc => <li key={doc.href}><a href={publicAsset(doc.href)} target="_blank" rel="noreferrer">{doc.label || doc.name || 'Product document'} <Download size={18} aria-hidden="true" /></a></li>)}</ul>
          {certificate && <p className="concise-product-document-note">Supplied certificate · {certificate.file || product.listing?.file || product.certificate?.file} · {certificate.report} · issued {certificate.issued}. Model addenda: PDF pages {certificate.modelPages.join(', ')}. Confirm current coverage for the selected model.</p>}
          <p className="concise-product-document-note">{modelDocumentationNote(product)}</p>
          {product.notes?.length > 0 && <details className="concise-product-notes"><summary>Specification notes</summary><ul>{product.notes.map(note => <li key={note}>{note}</li>)}</ul></details>}
          <Link className="textlink" to={resourcesHref(product)}>Browse product resources <ArrowRight size={16} aria-hidden="true" /></Link>
          <Link className="textlink" to={contactHref}>Request model-specific documents <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
    <Reveal as="section" id="technical-details" className="concise-product-parameters" aria-labelledby="technical-parameters-title">
      <div className="container">
        <h2 id="technical-parameters-title">Technical Parameters</h2>
        <table className="concise-product-table"><caption className="studio-visually-hidden">{product.sku} technical parameters</caption><tbody>{conciseSpecificationRows(product).map(([label, value], index) => <tr key={label} className={index === 0 ? 'is-model' : undefined}><th scope="row">{label}</th><td>{value}</td></tr>)}</tbody></table>
      </div>
    </Reveal>
  </>;
}
