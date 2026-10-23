import BrandBanner from '../components/BrandBanner.jsx';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, BookOpen, Download } from 'lucide-react';
import { certificates, findModelCertificate } from '../data/certificates.js';
import { modelDocumentationNote } from '../data/buyingGuides.js';
import { findProduct } from '../data/products.js';
import { findCatalogProduct } from '../data/catalogProducts.js';
import { catalogueDocument } from '../data/documents.js';
import { findLine, productLines } from '../data/lines.js';
import { inquiryContactHref, resolveInquiryContext } from '../utils/inquiryContext.js';
import { publicAsset } from '../utils/publicAsset.js';
import { CompanyBreadcrumb, CompanyLink, usePageMeta } from '../components/company/CompanyShared.jsx';
import './resources.css';
import Reveal from '../components/Reveal.jsx';

function ResourceDocument({ document }) {
  const titleId = `resource-${document.slug}`;
  return <Reveal as="article" className="resources-document" aria-labelledby={titleId}>
    <a className="resources-document__scan" href={publicAsset(document.document)} target="_blank" rel="noreferrer" aria-label={`Open ${document.name} PDF`}>
      <img src={publicAsset(document.image)} alt={`${document.name} certificate scan`} width="900" height={document.slug === 'iso-9001' ? '1214' : '1165'} loading="lazy" decoding="async" />
      <span>Open original PDF <ArrowUpRight size={16} aria-hidden="true" /></span>
    </a>
    <div className="resources-document__body">
      <p className="resources-document__type">PDF · {document.file}</p>
      <h3 id={titleId}>{document.name}</h3>
      <p>{document.detail}</p>
      <details>
        <summary>Scope &amp; document date</summary>
        <p>{document.scope}</p>
        {document.report && <p>Report reference: {document.report}</p>}
        <p>Document issued: {document.issued}</p>
        {document.modelPages && <p>Model addenda: PDF pages {document.modelPages.join(', ')}</p>}
      </details>
    </div>
    <div className="resources-document__actions">
      <a href={publicAsset(document.document)} download aria-label={`Download ${document.name} PDF`}>
        Download <Download size={17} aria-hidden="true" />
      </a>
    </div>
  </Reveal>;
}

export default function Resources() {
  usePageMeta('Product resources', 'Find the FAHINT catalog and original product-family documents.');
  const [params, setParams] = useSearchParams();
  const requestedFamily = findLine(params.get('family'));
  const candidate = resolveInquiryContext(params.get('model'));
  const context = candidate && (!requestedFamily || requestedFamily.name === candidate.category) ? candidate : null;
  const family = requestedFamily || productLines.find(line => line.name === context?.category);
  const product = context && (findProduct(context.model) || findCatalogProduct(family.slug, context.model));
  const modelCertificate = product && findModelCertificate(product);
  const files = certificates.filter(file => file.family && (!family || file.family === family.slug));
  const qualityDocument = certificates.find(file => file.slug === 'iso-9001');

  const changeFamily = event => {
    const slug = event.target.value;
    const next = new URLSearchParams();
    if (slug) next.set('family', slug);
    if (context && slug && findLine(slug)?.name === context.category) next.set('model', context.model);
    setParams(next, { replace: true, preventScrollReset: true, state: { preserveScroll: true } });
  };

  return <div className="company-page resources-page">
    <BrandBanner title="Product resources." label="RESOURCES & SUPPORT" description="Catalogs, original certification documents and model references, all in one place." image="assets/images/brand-home/generated/application-workplace-scene.webp" />
    <header className="resources-opening">
      <div className="company-wrap">
        <CompanyBreadcrumb current="Resources" />
        <div className="resources-lead">
          <div><p className="resources-eyebrow">FAHINT document library</p><h2>Find your product documents.</h2></div>
          <p>Find our product catalog, original certificates and model references. Start with the family, then confirm the details for your device.</p>
        </div>
        <div className="resources-entry-grid">
        <Reveal as="section" className="resources-catalog" aria-labelledby="resources-catalog-title">
          <BookOpen className="resources-catalog__icon" size={44} strokeWidth={1.25} aria-hidden="true" />
          <div className="resources-catalog__copy">
            <p className="resources-eyebrow">The complete collection · PDF · 13.9 MB</p>
            <h2 id="resources-catalog-title">FAHINT product catalog</h2>
            <p>Seven wiring-device families, product configurations and a closer look at our company.</p>
          </div>
          <div className="resources-catalog__actions">
            <a className="company-button is-light" href={publicAsset(catalogueDocument)} download aria-label="Download product catalog PDF">
              Download catalog <Download size={18} aria-hidden="true" />
            </a>
            <a href={publicAsset(catalogueDocument)} target="_blank" rel="noreferrer" aria-label="Open product catalog PDF">
              View PDF <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
        </Reveal>
        <nav className="resources-guides" aria-labelledby="resources-guides-title">
          <h3 id="resources-guides-title">Product buying guides</h3>
          <ul>
            <li><Link to="/blog/usb-wall-outlet-buying-guide" aria-label="Read the USB outlet buying guide">USB charging outlets <ArrowUpRight size={18} aria-hidden="true" /></Link></li>
            <li><Link to="/blog/dimmer-buying-guide-led-0-10v" aria-label="Read the dimmer buying guide">Dimmers & lighting control <ArrowUpRight size={18} aria-hidden="true" /></Link></li>
            <li><Link to="/blog/wallplate-buying-guide" aria-label="Read the wallplate buying guide">Matching wallplates <ArrowUpRight size={18} aria-hidden="true" /></Link></li>
            <li><Link to="/blog/light-switch-buying-guide" aria-label="Read the light switch buying guide">Light switches <ArrowUpRight size={18} aria-hidden="true" /></Link></li>
            <li><Link to="/blog/standard-receptacle-buying-guide" aria-label="Read the standard receptacle buying guide">Standard receptacles <ArrowUpRight size={18} aria-hidden="true" /></Link></li>
          </ul>
        </nav>
        </div>
      </div>
    </header>

    <div className="company-wrap resources-library">
      <section id="certifications" aria-labelledby="resources-family-title">
        <div className="resources-section-heading">
          <div><h2 id="resources-family-title">Product-family documents</h2><p>Original reference files. Review the full PDF and its model addendum before specifying.</p></div>
          <div className="resources-filter">
            <label htmlFor="resource-family">Product family</label>
            <select id="resource-family" value={family?.slug || ''} onChange={changeFamily}>
              <option value="">All product families</option>
              {productLines.map(line => <option key={line.slug} value={line.slug}>{line.name}</option>)}
            </select>
          </div>
        </div>
        {context && <aside className="resources-context" aria-label="Source product">
          <div>
            <strong>Reviewing {context.model}</strong>
            <p>{modelDocumentationNote(product)}</p>
            {modelCertificate && <a className="company-text-link" href={publicAsset(modelCertificate.document)} target="_blank" rel="noreferrer">View original certificate PDF <ArrowUpRight size={16} aria-hidden="true" /></a>}
          </div>
          <CompanyLink to={context.source} secondary>Return to {context.model}</CompanyLink>
        </aside>}
        <p className="resources-count" role="status">{files.length} product-family {files.length === 1 ? 'document' : 'documents'}{family ? ` · ${family.name}` : ''}</p>
        {files.length ? <ul className="resources-documents">
          {files.map(file => <li key={file.slug}><ResourceDocument document={file} /></li>)}
        </ul> : <div className="resources-empty">
          <h3>{family.name} documentation</h3>
          <p>No separate certificate PDF is published here for this family. Consult the catalog and model references, or ask our team for documents for your exact device.</p>
          <CompanyLink to={`/products/${family.slug}`} secondary>Browse this product family</CompanyLink>
        </div>}
        <p className="resources-scope-note">These are supplied reference documents, not a live certification-status check. Confirm current status, exact model coverage and any conditions with the issuing body and our team before ordering.</p>
      </section>

      <section id="quality-management" className="resources-quality" aria-labelledby="resources-quality-title">
        <div className="resources-section-heading"><div><h2 id="resources-quality-title">Quality management</h2><p>ISO 9001 relates to the quality management system, not a product listing.</p></div></div>
        <ResourceDocument document={qualityDocument} />
      </section>

      <section className="resources-request" aria-labelledby="resources-request-title">
        <div><h2 id="resources-request-title">Need a model-specific document?</h2>
          <p>{context ? `For ${context.model}, review the online model references or ask our team for the relevant documents.` : 'Product pages include available specifications, drawings and source references. For an installation manual or a file not published here, ask our team with the exact model and market.'}</p>
          <p>Online installation references do not replace the approved instructions for the device.</p>
        </div>
        <div className="resources-request__actions">
          <CompanyLink to={inquiryContactHref(context, 'technical')}>Request model documents</CompanyLink>
          <CompanyLink to={context?.source || '/products'} secondary>{context ? 'View model references' : 'Browse product families'}</CompanyLink>
        </div>
      </section>
    </div>
  </div>;
}
