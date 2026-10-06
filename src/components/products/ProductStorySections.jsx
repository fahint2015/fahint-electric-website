import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { colors, productFinishImage } from '../../data/products.js';
import SafeImage from '../SafeImage.jsx';

function productEngineeringPoints(product) {
  const candidates = [
    ...(product.highlights || []),
    ...(product.features || []).filter((feature) => (
      !product.listing?.reportReference || !feature.includes(product.listing.reportReference)
    ))
  ];
  const themes = [
    ['self-test', /self[- ]test/i],
    ['reverse-wiring', /reverse|reversed/i],
    ['feed-through', /feed[- ]through/i],
    ['tamper-resistant', /tamper[- ]resistant/i],
    ['weather-resistant', /weather[- ]resistant/i],
    ['blank-face', /blank[- ]face/i]
  ];
  const seen = new Set();

  return candidates.filter((point) => {
    const theme = themes.find(([, pattern]) => pattern.test(point))?.[0] || point.toLowerCase();
    if (seen.has(theme)) return false;
    seen.add(theme);
    return true;
  }).slice(0, 4);
}

const GF15_ENGINEERING_PROOFS = [
  'UL / cUL listed · UL 943 5th Edition',
  'Patent protected · US / CN',
  'Anti-interference',
  'Self-test every 15 minutes',
  'Reverse-wiring protection',
  '20A feed-through',
  'Dual-color LED indicator',
  '3-year warranty'
];

function productEngineeringProofs(product) {
  return product.sku === 'GF15' ? GF15_ENGINEERING_PROOFS : productEngineeringPoints(product);
}

export function ProductFeatureStory({ product }) {
  const points = productEngineeringProofs(product);
  const imageAlt = product.sku === 'GF15'
    ? 'GF15 installed in a bathroom vanity'
    : `${product.sku} installed application`;

  return (
    <section className="product-story product-story--feature">
      <div className="container">
        <div className="product-engineering-editorial">
          <header className="product-engineering-editorial__head">
            <p className="product-section-label">Product engineering</p>
            <div className="product-engineering-editorial__head-main">
              <h2>
                Protection,
                <span>clearly documented.</span>
              </h2>
              <p className="product-story__summary">{product.summary}</p>
            </div>
          </header>
          <div className="product-engineering-editorial__body">
            <figure
              className="product-engineering-editorial__scene"
              data-product-media="engineering"
              data-sku={product.sku.toLowerCase()}
            >
              <span>Representative installation</span>
              <SafeImage
                src={product.assets.feature}
                alt={imageAlt}
                width={1536}
                height={1024}
                loading="lazy"
              />
            </figure>
            <div className="product-engineering-editorial__details">
              <div className="product-engineering-editorial__details-head">
                <p>Product features</p>
                <span>{String(points.length).padStart(2, '0')} documented details</span>
              </div>
              <ol className="product-engineering-editorial__proofs">
                {points.map((point, index) => (
                  <li key={point}>
                    <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    <strong>{point}</strong>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProductApplicationStory({ product, contactHref = `/contact?model=${encodeURIComponent(product.sku)}` }) {
  const lifestyleImage = product.assets.application
    || product.assets.gallery?.[4]
    || product.assets.gallery?.at(-1)
    || product.assets.hero;

  return (
    <section className="product-story product-story--application">
      <div className="container product-story__split product-story__split--reverse">
        <div className="product-story__content">
          <p className="product-section-label">Application review</p>
          <h2>Designed for the environments in the specification.</h2>
          <p className="product-story__grade">{product.grade}</p>
          <p className="product-story__summary">{product.summary}</p>
          <p className="product-story__note">
            Confirm the intended location, enclosure and applicable code requirements before specifying a model.
          </p>
          <Link className="textlink" to={contactHref}>
            Review your application <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <figure
          className="product-story__media product-story__media--cover"
          data-product-media="application"
          data-sku={product.sku.toLowerCase()}
        >
          <SafeImage
            src={lifestyleImage}
            alt={`${product.sku} representative application setting`}
            width={1536}
            height={1024}
            loading="lazy"
          />
        </figure>
      </div>
    </section>
  );
}

const PACKAGING_PROGRAMS = [
  {
    code: 'Package A',
    label: 'Color retail box',
    wallPlate: 'Included',
    inner: '10 pcs',
    carton: '50 pcs'
  },
  {
    code: 'Package B',
    label: 'Blank white box',
    wallPlate: 'Included',
    inner: '10 pcs',
    carton: '50 pcs'
  },
  {
    code: 'Package C',
    label: 'Color retail box',
    wallPlate: 'Not included',
    inner: '10 pcs',
    carton: '100 pcs'
  }
];

const PACKAGING_REFERENCES = [
  { key: 'standard', name: 'White' },
  { key: 'black', name: 'Black' },
  { key: 'grey', name: 'Grey' },
  { key: 'graphite', name: 'Graphite' },
  { key: 'ivory', name: 'Ivory' },
  { key: 'almond', name: 'Light Almond' },
  { key: 'brown', name: 'Brown' }
];

export function ProductOemStory({ product, contactHref = `/contact?model=${encodeURIComponent(product.sku)}` }) {
  const packagingTitleId = `packaging-${product.sku.toLowerCase()}`;
  const wallPlateTitleId = `wall-plates-${product.sku.toLowerCase()}`;
  const programTitleId = `packaging-programs-${product.sku.toLowerCase()}`;
  const packagingReferences = PACKAGING_REFERENCES.map((reference) => ({
    ...reference,
    src: product.assets.packaging?.[reference.key]
  })).filter((reference) => reference.src);
  const showsPackagingReferences = packagingReferences.length > 0;

  return (
    <section
      id="program-configuration"
      className="product-story product-story--oem product-story--cool"
      aria-labelledby="program-configuration-title"
      data-testid="product-oem-story"
    >
      <div className="container">
        <div className="product-story__oem-head">
          <div>
            <p className="product-section-label">Program configuration</p>
            <h2 id="program-configuration-title">Configure the product around your program.</h2>
          </div>
          <p>Align the visible finish and approved program materials around a reviewed product specification.</p>
        </div>
        <div className="product-finish-heading">
          <p>{showsPackagingReferences ? 'Retail packaging references' : 'Finish options'}</p>
          <span>
            {showsPackagingReferences
              ? `${packagingReferences.length} standard presentations`
              : `${colors.length} standard finishes`}
          </span>
        </div>
        <div
          className={`product-finish-strip${showsPackagingReferences ? ' product-packaging-showcase' : ''}`}
          aria-label={`${product.sku} ${showsPackagingReferences ? 'retail packaging' : 'finish'} references`}
        >
          {showsPackagingReferences
            ? packagingReferences.map((reference) => (
              <figure key={reference.key} data-testid="product-packaging-showcase-cell">
                <SafeImage
                  src={reference.src}
                  alt={`${product.sku} ${reference.name} standard retail packaging`}
                  width={620}
                  height={620}
                  loading="lazy"
                />
                <figcaption>{reference.name}</figcaption>
              </figure>
            ))
            : colors.map((finish) => (
              <figure key={finish.slug} data-testid="product-finish-cell">
                <SafeImage
                  src={productFinishImage(product.sku, finish.slug)}
                  alt={`${product.sku} ${finish.name} finish`}
                  width={620}
                  height={620}
                  loading="lazy"
                />
                <figcaption>{finish.name}</figcaption>
              </figure>
            ))}
        </div>
        {product.assets.packaging && (
          <section className="product-packaging" aria-labelledby={packagingTitleId}>
            <header className="product-packaging__header">
              <div>
                <h3 id={packagingTitleId}>Packaging &amp; program options.</h3>
              </div>
              <p className="product-packaging__intro">
                Review the visible wall-plate style separately from box format and shipment quantity.
              </p>
            </header>
            <div className="product-packaging__workspace">
              <section className="product-wallplate-options" aria-labelledby={wallPlateTitleId}>
                <header className="product-packaging__subhead">
                  <div>
                    <h4 id={wallPlateTitleId}>Wall plate options</h4>
                  </div>
                  <p>Coordinate the plate style with the selected finish.</p>
                </header>
                <div className="product-wallplate-options__grid">
                  <figure className="product-wallplate-option">
                    <SafeImage
                      src={product.assets.packaging.standard}
                      alt={`${product.sku} with standard screw wall plate and retail box`}
                      width={1000}
                      height={1000}
                      loading="lazy"
                    />
                    <figcaption>
                      <strong>Standard screw plate</strong>
                      <span>Visible fastening · classic presentation</span>
                    </figcaption>
                  </figure>
                  <figure className="product-wallplate-option">
                    <SafeImage
                      src={product.assets.packaging.screwless}
                      alt={`${product.sku} with screwless wall plate and retail box`}
                      width={1000}
                      height={1000}
                      loading="lazy"
                    />
                    <figcaption>
                      <strong>Screwless plate</strong>
                      <span>Clean face · concealed fastening</span>
                    </figcaption>
                  </figure>
                </div>
              </section>
              <section className="product-packaging__program-panel" aria-labelledby={programTitleId}>
                <header className="product-packaging__subhead">
                  <div>
                    <h4 id={programTitleId}>Packaging programs</h4>
                  </div>
                  <p>{PACKAGING_PROGRAMS.length} approved configurations</p>
                </header>
                <div className="product-packaging__table-wrap">
                  <table aria-label={`${product.sku} packaging programs`}>
                    <thead>
                      <tr>
                        <th scope="col">Program</th>
                        <th scope="col">Retail presentation</th>
                        <th scope="col">Wall plate</th>
                        <th scope="col">Inner box</th>
                        <th scope="col">Carton</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PACKAGING_PROGRAMS.map((program) => (
                        <tr key={program.code}>
                          <th scope="row">{program.code}</th>
                          <td data-label="Retail presentation">{program.label}</td>
                          <td data-label="Wall plate">{program.wallPlate}</td>
                          <td data-label="Inner box">{program.inner}</td>
                          <td data-label="Carton">{program.carton}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
            <footer className="product-packaging__footer">
              <p className="product-packaging__authorization">
                Customer-branded packaging is available after the registered trademark and brand authorization
                documents are reviewed.
              </p>
              <Link className="btn btn--primary" to={contactHref}>
                Discuss {product.sku} configuration <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </footer>
          </section>
        )}
      </div>
    </section>
  );
}
