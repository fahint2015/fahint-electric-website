import { useRef, useState } from 'react';
import { Link } from '../SiteLink.jsx';
import { ArrowRight, Download, Search, X } from 'lucide-react';
import SafeImage from '../SafeImage.jsx';
import { productLines } from '../../data/lines.js';
import { products } from '../../data/products.js';
import { catalogueDocument, getCatalogProducts, modelKey, productHref } from '../../data/catalogProducts.js';

// These are editorial selections, not new product records. All displayed facts
// and photographs below come from the existing model catalogues.
const featuredModels = {
  gfci: ['GF15', 'GT20', 'GW20'],
  'usb-outlets': ['FTR15C-3100', 'FTR15QC-AC20W', 'FTR15QC-DC65W'],
  receptacles: ['R15', 'DT15', 'DW20'],
  dimmers: ['DM2010', 'DM2010S'],
  'smart-switches': ['USW8811', 'USW8821', 'USW8811-Z'],
  'lighting-switches': ['DS15', 'DS15.3', 'T15'],
  wallplates: ['BS1801', 'BS1803-G', 'BS18032-M']
};

const ranges = productLines.map((line) => {
  const models = [
    ...(line.slug === 'gfci' ? products.map((p) => ({
      ...p, line: line.slug, href: `/products/gfci/${p.sku.toLowerCase()}`,
      keyFacts: [['Rating', p.rating], ['Variant', p.feature]]
    })) : []),
    ...getCatalogProducts(line.slug).map((p) => ({ ...p, href: productHref(p) }))
  ];
  return { ...line, models, featured: featuredModels[line.slug].map((sku) => models.find((p) => p.sku === sku)).filter(Boolean) };
});

function ModelPreview({ product }) {
  const [width, height] = product.assets.imageSizes?.[product.assets.card] || [800, 800];
  return (
    <article className="range-model" data-line={product.line} data-sku={product.sku}>
      <Link className="range-model__image" to={product.href} tabIndex={-1} aria-hidden="true">
        <SafeImage src={product.assets.card} alt="" width={width} height={height} loading="lazy" />
      </Link>
      <div className="range-model__body">
        <p className="range-model__sku">{product.sku}</p>
        <h3>{product.name}</h3>
        <dl>{product.keyFacts.slice(0, 2).map(([label, value]) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}</dl>
        {product.reviewNotice && <p className="range-model__notice">Review model notes before specifying.</p>}
        <Link className="range-model__link" to={product.href} aria-label={`View ${product.sku} details`}>
          View model <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default function ProductRangeDirectory() {
  const [query, setQuery] = useState('');
  const searchRef = useRef(null);
  const searching = Boolean(query.trim());
  const terms = query.trim().split(/\s+/).map(modelKey).filter(Boolean);
  const visibleRanges = ranges.map((range) => ({
    ...range,
    visible: searching ? range.models.filter((p) => {
      const searchable = modelKey([p.sku, p.name, p.summary, range.name, ...p.keyFacts.flat()].join(' '));
      return terms.every((term) => searchable.includes(term));
    }) : range.featured
  })).filter((range) => range.visible.length);
  const resultCount = visibleRanges.reduce((sum, range) => sum + range.visible.length, 0);
  const clearSearch = () => { setQuery(''); searchRef.current?.focus(); };

  return (
    <>
      <section className="range-intro" aria-labelledby="product-overview-title">
        <div className="container">
          <nav className="range-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Products</span></nav>
          <div className="range-intro__layout">
            <div className="range-intro__copy">
              <h1 id="product-overview-title">Find your wiring devices.</h1>
              <p>Explore seven product ranges. Compare model specifications, available finishes and documentation.</p>
            </div>
            <div className="range-search" role="search" aria-label="Product catalog">
              <label htmlFor="range-search">Search by model or feature</label>
              <div className="range-search__field">
                <Search size={21} aria-hidden="true" />
                <input ref={searchRef} id="range-search" type="search" placeholder="Try GF15, USB-C or 20A" value={query} onChange={(event) => setQuery(event.target.value)} aria-controls="product-ranges" />
                {query && <button type="button" onClick={clearSearch} aria-label="Clear search"><X size={19} aria-hidden="true" /></button>}
              </div>
              <div className="range-search__help"><span>Search across all models</span><a href={catalogueDocument} download>Download catalog <Download size={16} aria-hidden="true" /></a></div>
            </div>
          </div>
        </div>
      </section>
      <div className="range-directory" id="product-ranges">
        <div className="container">
          {!searching && <nav className="range-nav" aria-label="Product ranges">
            {ranges.map((range) => <Link key={range.slug} to={`/products#range-${range.slug}`}>{range.name}</Link>)}
          </nav>}
          <div className="range-directory__intro">
            <p role="status" aria-live="polite">{searching ? `${resultCount} ${resultCount === 1 ? 'model' : 'models'} found` : 'Explore selected models from each range.'}</p>
            <span>{searching ? `Results for “${query.trim()}”` : 'Open a range to view every configuration.'}</span>
          </div>
          {visibleRanges.map((range) => (
            <section className="range-section" id={`range-${range.slug}`} key={range.slug} aria-labelledby={`range-title-${range.slug}`} tabIndex={-1}>
              <header className="range-section__header">
                <h2 id={`range-title-${range.slug}`}>{range.name}</h2>
                <p>{range.tagline}</p>
                <span className="range-section__count">{range.models.length} model configurations</span>
                <Link className="range-section__link" to={`/products/${range.slug}`} aria-label={`View all ${range.name}`}>View all models <ArrowRight size={18} aria-hidden="true" /></Link>
              </header>
              <div className="range-models">{range.visible.map((p) => <ModelPreview key={p.sku} product={p} />)}</div>
            </section>
          ))}
          {!resultCount && <div className="range-empty"><h2>No matching models</h2><p>Try a model number such as GF15, or a feature such as USB. You can also clear the search to browse all seven ranges.</p><Link to="/contact">Ask us to help you find a model <ArrowRight size={18} aria-hidden="true" /></Link></div>}
        </div>
      </div>
    </>
  );
}
