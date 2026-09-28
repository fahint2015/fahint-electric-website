import { useEffect, useState } from 'react';
import { ArrowRight, ExternalLink, FileCheck2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { isVerifiedListing } from '../../data/products.js';
import { companyPhotos } from '../../data/companyProfile.js';
import { publicAsset } from '../../utils/publicAsset.js';
import SafeImage from '../SafeImage.jsx';

export function productSpecificationRows(product) {
  const verified = isVerifiedListing(product);
  const configuration = product.nema === 'Blank face' ? product.nema : `NEMA ${product.nema}`;
  const faceDimensions = [product.dimensions?.face, product.dimensions?.width].filter(Boolean).join(' × ');
  const certification = verified
    ? `UL/cUL listed · file ${product.listing.file}`
    : 'Documentation review required';

  if (Array.isArray(product.technicalSpecifications) && product.technicalSpecifications.length > 0) {
    return [
      ['Item code', product.sku],
      ['Rating', product.rating],
      ['Certification', certification],
      ...product.technicalSpecifications,
      ['Face dimensions', faceDimensions],
      ['Body depth', product.dimensions?.depth]
    ].filter(([, value]) => value);
  }

  return [
    ['Item code', product.sku],
    ['Rating', product.rating],
    ['NEMA configuration', configuration],
    ['Variant', product.feature],
    ['Application grade', product.grade],
    ['Standard', verified ? 'UL 943' : null],
    ['Certification', certification],
    ['Face dimensions', faceDimensions],
    ['Body depth', product.dimensions?.depth]
  ].filter(([, value]) => value);
}

const SPECIFICATION_GROUPS = [
  {
    title: 'Electrical performance',
    labels: ['Amperage', 'Rated voltage', 'Working voltage', 'Trip level', 'Operating temperature']
  },
  {
    title: 'Installation & configuration',
    labels: ['NEMA configuration', 'Wiring method', 'Wire gauge', 'Pole & wire', 'Grounding', 'Face dimensions', 'Body depth']
  },
  {
    title: 'Compliance & application',
    labels: ['Item code', 'Certification', 'Standard', 'Application grade', 'Tamper-resistant', 'Weather-resistant', 'Usage']
  }
];

function selectRows(rows, labels) {
  const rowMap = new Map(rows);
  return labels.map((label) => [label, rowMap.get(label)]).filter(([, value]) => value);
}

export function productSpecificationGroups(product) {
  if (Array.isArray(product.specificationGroups)) return product.specificationGroups;
  const rows = productSpecificationRows(product);

  if (!Array.isArray(product.technicalSpecifications) || product.technicalSpecifications.length === 0) {
    return [{ title: 'Product information', rows }];
  }

  return [
    ...SPECIFICATION_GROUPS.map((group) => ({
      title: group.title,
      rows: selectRows(rows, group.labels)
    })),
    { title: 'Materials & construction', rows: product.construction?.materials || [] },
    { title: 'Quality & durability', rows: product.construction?.performance || [] }
  ].filter((group) => group.rows.length > 0);
}

export function productSpecificationSummaryRows(product) {
  if (Array.isArray(product.specificationSummary)) return product.specificationSummary;
  const rows = new Map(productSpecificationRows(product));
  return [
    ['Rating', product.rating],
    ['Configuration', rows.get('NEMA configuration')],
    ['Trip level', rows.get('Trip level')],
    ['Wiring', rows.get('Wiring method')],
    ['Certification', rows.get('Certification')]
  ].filter(([, value]) => value);
}

function SpecificationGroup({ group, index, isOpen, onToggle }) {
  if (!Array.isArray(group.rows) || group.rows.length === 0) return null;

  return (
    <details
      className="product-specification-group"
      open={isOpen}
      onToggle={(event) => onToggle(group.title, event.currentTarget.open)}
    >
      <summary>
        <span className="product-specification-group__title">
          <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <h3>{group.title}</h3>
        </span>
        <span className="product-specification-group__meta">{group.rows.length} details</span>
      </summary>
      <dl className="product-specification-group__rows">
        {group.rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}

function SpecificationPanel({ group, index }) {
  if (!Array.isArray(group.rows) || group.rows.length === 0) return null;
  const headingId = `specification-panel-${index + 1}`;

  return (
    <section className="product-specification-panel" aria-labelledby={headingId}>
      <header className="product-specification-panel__head">
        <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <h3 id={headingId}>{group.title}</h3>
        <span>{group.rows.length} details</span>
      </header>
      <dl className="product-specification-panel__rows">
        {group.rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ProductSpecifications({ product, layout = 'accordion' }) {
  const summaryRows = productSpecificationSummaryRows(product);
  const groups = productSpecificationGroups(product);
  const usesSpecificationMatrix = layout === 'matrix';
  const [expandedGroups, setExpandedGroups] = useState(() => new Set(groups[0] ? [groups[0].title] : []));

  useEffect(() => {
    setExpandedGroups(new Set(groups[0] ? [groups[0].title] : []));
  }, [product.sku]);

  const allExpanded = groups.length > 0 && groups.every((group) => expandedGroups.has(group.title));
  const handleGroupToggle = (title, isOpen) => {
    setExpandedGroups((current) => {
      if (current.has(title) === isOpen) return current;
      const next = new Set(current);
      if (isOpen) next.add(title);
      else next.delete(title);
      return next;
    });
  };

  const handleToggleAll = () => {
    setExpandedGroups(allExpanded ? new Set() : new Set(groups.map((group) => group.title)));
  };

  return (
    <section
      className={`product-technical product-specifications${usesSpecificationMatrix ? ' product-specifications--matrix' : ''}`}
      id="technical-details"
    >
      <div className="container product-technical__narrow">
        <div className="product-specifications__heading">
          <div>
            <p className="product-section-label">Model data</p>
            <h2>Technical specifications.</h2>
          </div>
          <p>Key values first, with the complete specification grouped below for faster review.</p>
        </div>
        <dl className="product-specification-summary" role="list" aria-label="Key specifications">
          {summaryRows.map(([label, value]) => (
            <div role="listitem" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <div className={`product-specifications__controls${usesSpecificationMatrix ? ' product-specifications__controls--static' : ''}`}>
          <p>Complete model specification</p>
          {!usesSpecificationMatrix && (
            <button type="button" aria-expanded={allExpanded} onClick={handleToggleAll}>
              {allExpanded ? 'Collapse all specifications' : 'Expand all specifications'}
            </button>
          )}
        </div>
        {usesSpecificationMatrix ? (
          <div className="product-specification-matrix">
            {groups.map((group, index) => (
              <SpecificationPanel key={group.title} group={group} index={index} />
            ))}
          </div>
        ) : (
          <div className="product-specification-groups">
            {groups.map((group, index) => (
              <SpecificationGroup
                key={group.title}
                group={group}
                index={index}
                isOpen={expandedGroups.has(group.title)}
                onToggle={handleGroupToggle}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function ProductInstallation({ product }) {
  const views = product.assets.technicalViews || {
    plate: product.assets.card,
    front: product.assets.hero,
    side: product.assets.dimensions,
    back: product.assets.installation
  };

  return (
    <section
      id="installation-reference"
      className="product-technical product-installation"
      aria-labelledby="installation-reference-title"
    >
      <div className="container">
        <div className="product-installation__head">
          <div>
            <p className="product-section-label">Installation reference</p>
            <h2 id="installation-reference-title">Wiring and dimensions.</h2>
          </div>
          <p>
            A clear field reference for terminal identification, installation sequence and the three dimensions that
            matter before specification.
          </p>
        </div>

        <div className="product-installation__canvas">
          <article className="product-installation__wiring" aria-labelledby="wiring-reference-title">
            <header className="product-installation__panel-head">
              <span aria-hidden="true">01</span>
              <div>
                <p>Connection guide</p>
                <h3 id="wiring-reference-title">Wire by terminal, not by position.</h3>
              </div>
            </header>

            <div className="product-installation__wiring-body">
              <figure className="product-installation__wiring-view">
                <SafeImage src={views.back} alt={`${product.sku} rear terminal view`} width={800} height={800} loading="lazy" />
                <figcaption>Rear terminal view · confirm molded LINE and LOAD markings on the device.</figcaption>
              </figure>

              <div className="product-installation__wiring-copy">
                <dl className="product-installation__wire-map">
                  <div data-wire="neutral">
                    <dt>Neutral <span>White conductor</span></dt>
                    <dd>Silver screw</dd>
                  </div>
                  <div data-wire="hot">
                    <dt>Hot <span>Black conductor</span></dt>
                    <dd>Brass screw</dd>
                  </div>
                  <div data-wire="ground">
                    <dt>Ground <span>Copper or green conductor</span></dt>
                    <dd>Green screw</dd>
                  </div>
                </dl>
                <p className="product-installation__device-note">
                  Use the device’s LINE and LOAD markings to identify the corresponding terminals before inserting any
                  conductor.
                </p>
              </div>
            </div>

            <ol className="product-installation__sequence" aria-label="Installation sequence">
              <li><span>01</span><strong>Identify</strong><small>Confirm supply, load and ground conductors.</small></li>
              <li><span>02</span><strong>Secure</strong><small>Insert wires through the terminal holes and tighten clockwise.</small></li>
              <li><span>03</span><strong>Verify</strong><small>Press RESET and confirm the green LED indicator turns on.</small></li>
            </ol>
          </article>

          <article className="product-installation__dimensions" aria-labelledby="dimension-reference-title">
            <header className="product-installation__panel-head product-installation__panel-head--inverse">
              <span aria-hidden="true">02</span>
              <div>
                <p>Dimensional profile</p>
                <h3 id="dimension-reference-title">Three views. Three critical dimensions.</h3>
              </div>
            </header>

            <div className="product-installation__view-stack" aria-label={`${product.sku} product views`}>
              <figure>
                <SafeImage src={views.plate} alt={`${product.sku} installed front view`} width={800} height={800} loading="lazy" />
                <figcaption>Plate</figcaption>
              </figure>
              <figure>
                <SafeImage src={views.front} alt={`${product.sku} device front view`} width={800} height={800} loading="lazy" />
                <figcaption>Front</figcaption>
              </figure>
              <figure>
                <SafeImage src={views.side} alt={`${product.sku} device side views`} width={800} height={800} loading="lazy" />
                <figcaption>Side</figcaption>
              </figure>
            </div>

            <dl className="product-installation__metrics">
              {product.dimensions?.face && <div><dt>Overall height</dt><dd>{product.dimensions.face}</dd></div>}
              {product.dimensions?.width && <div><dt>Plate width</dt><dd>{product.dimensions.width}</dd></div>}
              {product.dimensions?.depth && <div><dt>Body depth</dt><dd>{product.dimensions.depth}</dd></div>}
            </dl>

            <p className="product-installation__reference-note">
              Reference dimensions only. Verify enclosure depth and applicable installation requirements before release.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

function ProductDownloads({ documents }) {
  if (!Array.isArray(documents) || documents.length === 0) return null;
  return (
    <details className="product-certification__downloads product-documents">
      <summary tabIndex={0}>Product documents</summary>
      <div aria-label="Product downloads">
        {documents.map((document) => {
          const href = typeof document === 'string' ? document : document.href || document.url;
          const label = typeof document === 'string' ? 'Product document' : document.label || document.name;
          return href ? <a key={href} href={href}>{label || 'Product document'}</a> : null;
        })}
      </div>
    </details>
  );
}

export function ProductCertification({ product }) {
  const verified = isVerifiedListing(product);
  if (!verified) {
    return (
      <section className="product-technical product-certification product-certification--review">
        <div className="container product-certification__review">
          <FileCheck2 size={34} aria-hidden="true" />
          <div>
            <p className="product-section-label">Model documentation</p>
            <h2>Documentation review for {product.sku}.</h2>
            <p>Certification status requires model-specific documentation review before specification or purchase.</p>
            <Link className="textlink" to={`/contact?model=${encodeURIComponent(product.sku)}`}>
              Request a documentation review <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const certificatePath = 'assets/images/certs/ul-gfci.webp';
  const certificateHref = publicAsset(certificatePath);

  return (
    <section
      id="certification-evidence"
      className="product-technical product-certification"
      aria-labelledby="certification-evidence-title"
    >
      <div className="container product-certification__layout">
        <figure className="product-certification__document-viewer">
          <div className="product-certification__document-bar" aria-hidden="true">
            <span>UL certificate of compliance</span>
            <span>Original document</span>
          </div>
          <a
            className="product-certification__document"
            href={certificateHref}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open full UL certificate for ${product.sku}`}
          >
            <SafeImage
              src={certificatePath}
              alt={`${product.sku} UL certification certificate`}
              width={900}
              height={1165}
              loading="lazy"
            />
            <span>Open full certificate <ExternalLink size={15} aria-hidden="true" /></span>
          </a>
          <figcaption>
            Certificate of Compliance · UL-US-2016865-1 · issued to Wenzhou Fahint Electric Co Ltd
          </figcaption>
        </figure>

        <div className="product-certification__verification">
          <p className="product-section-label">Model verification</p>
          <h2 id="certification-evidence-title">Certification your team can verify.</h2>
          <p className="product-certification__intro">
            Review the listing identifiers here, then open the original certificate when your technical or sourcing
            team needs the complete document.
          </p>

          <div className="product-certification__status">
            <FileCheck2 size={20} aria-hidden="true" />
            <span>Verified listing reference</span>
          </div>

          <dl
            className="product-certification__facts"
            aria-label="Certificate verification details"
            role="list"
          >
            <div role="listitem"><dt>Certificate number</dt><dd>UL-US-2016865-1</dd></div>
            <div role="listitem"><dt>UL file</dt><dd>{product.listing.file}</dd></div>
            <div role="listitem"><dt>Report reference</dt><dd>{product.listing.reportReference}</dd></div>
            <div role="listitem"><dt>Standard</dt><dd>UL 943 · 5th Edition</dd></div>
          </dl>

          <div className="product-certification__scope">
            <span>Document scope</span>
            <strong>KCXS · Ground-fault circuit interrupters</strong>
            <p>Confirm the model designation in the applicable addendum before final specification or purchase.</p>
          </div>

          <div className="product-certification__actions">
            <a className="product-certification__open" href={certificateHref} target="_blank" rel="noreferrer">
              Open full certificate <ExternalLink size={15} aria-hidden="true" />
            </a>
            <Link className="textlink" to="/capabilities">
              Review quality capabilities <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <ProductDownloads documents={product.documents} />
        </div>
      </div>
    </section>
  );
}

const MANUFACTURING_EVIDENCE = [
  [companyPhotos.productAssembly, 'Component assembly'],
  [companyPhotos.productGfciTesting, 'GFCI functional testing'],
  [companyPhotos.productLaboratory, 'Laboratory verification']
];

export function ProductManufacturingProof() {
  return (
    <section className="product-technical product-manufacturing" id="manufacturing-evidence" aria-labelledby="manufacturing-evidence-title">
      <div className="container">
        <div className="product-technical__head">
          <h2 id="manufacturing-evidence-title">Manufacturing evidence.</h2>
          <p>Factory photographs from FAHINT. Test requirements and documentation are confirmed for the selected model.</p>
        </div>
        <div className="product-manufacturing__grid">
          {MANUFACTURING_EVIDENCE.map(([photo, caption]) => (
            <figure key={photo.src}><SafeImage {...photo} loading="lazy" /><figcaption>{caption}</figcaption></figure>
          ))}
        </div>
      </div>
    </section>
  );
}
