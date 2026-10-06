import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, BookOpen, Download } from 'lucide-react';
import { certificates } from '../data/certificates.js';
import { catalogueDocument } from '../data/documents.js';
import { findLine, productLines } from '../data/lines.js';
import { inquiryContactHref, resolveInquiryContext } from '../utils/inquiryContext.js';
import { publicAsset } from '../utils/publicAsset.js';
import { CompanyBreadcrumb, CompanyLink, usePageMeta } from '../components/company/CompanyShared.jsx';
import './resources.css';

function ResourceDocument({ document }) {
  const titleId = `resource-${document.slug}`;
  return <article className="resources-document" aria-labelledby={titleId}>
    <img className="resources-document__scan" src={publicAsset(document.image)} alt="" width="90" height={document.slug === 'iso-9001' ? '121' : '117'} loading="lazy" decoding="async" />
    <div className="resources-document__body">
      <p className="resources-document__type">PDF · {document.file}</p>
      <h3 id={titleId}>{document.name}</h3>
      <p>{document.detail}</p>
      <details>
        <summary>Scope &amp; document date</summary>
        <p>{document.scope}</p>
        <p>Document issued: {document.issued}</p>
      </details>
    </div>
    <div className="resources-document__actions">
      <a href={publicAsset(document.document)} target="_blank" rel="noreferrer" aria-label={`Open ${document.name} PDF`}>
        View PDF <ArrowUpRight size={17} aria-hidden="true" />
      </a>
      <a href={publicAsset(document.document)} download aria-label={`Download ${document.name} PDF`}>
        Download <Download size={17} aria-hidden="true" />
      </a>
    </div>
  </article>;
}

export default function Resources() {
  usePageMeta('Product resources', 'Find the FAHINT catalog and original product-family documents.');
  const [params, setParams] = useSearchParams();
  const requestedFamily = findLine(params.get('family'));
  const candidate = resolveInquiryContext(params.get('model'));
  const context = candidate && (!requestedFamily || requestedFamily.name === candidate.category) ? candidate : null;
  const family = requestedFamily || productLines.find(line => line.name === context?.category);
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
    <header className="resources-opening">
      <div className="company-wrap">
        <CompanyBreadcrumb current="Resources" />
        <div className="resources-lead">
          <div><p className="resources-eyebrow">FAHINT document library</p><h1>Product resources.</h1></div>
          <p>Find our product catalog, original certificates and model references. Start with the family, then confirm the details for your device.</p>
        </div>
        <section className="resources-catalog" aria-labelledby="resources-catalog-title">
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
        </section>
        <p className="resources-scope-note">
          Choosing USB charging outlets?{' '}
          <Link className="company-text-link" to="/blog/usb-wall-outlet-buying-guide">Read the USB outlet buying guide <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </p>
        <p className="resources-scope-note">
          Choosing lighting controls?{' '}
          <Link className="company-text-link" to="/blog/dimmer-buying-guide-led-0-10v">Read the dimmer buying guide <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </p>
        <p className="resources-scope-note">
          Matching devices and wallplates?{' '}
          <Link className="company-text-link" to="/blog/wallplate-buying-guide">Read the wallplate buying guide <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </p>
        <p className="resources-scope-note">
          Comparing on/off switches?{' '}
          <Link className="company-text-link" to="/blog/light-switch-buying-guide">Read the light switch buying guide <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </p>
      </div>
    </header>

    <div className="company-wrap resources-library">
      <section aria-labelledby="resources-family-title">
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
          <div><strong>Reviewing {context.model}</strong><p>Selecting a model does not confirm its certification coverage. Check the exact designation and configuration in the original document.</p></div>
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

      <section className="resources-quality" aria-labelledby="resources-quality-title">
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
