import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUpRight, Download, Search, X } from 'lucide-react';
import { studioModels, studioRanges, searchStudioModels } from '../data/studioCatalog.js';
import { catalogueDocument, findCatalogAliasMatch } from '../data/catalogProducts.js';
import { publicAsset } from '../utils/publicAsset.js';
import { StudioImage, StudioLink, useStudioPageMeta } from '../components/studio/StudioShared.jsx';
import '../styles/studio.css';

function RangeTile({ range }) {
  return <article className="studio-range-tile" aria-label={range.name}>
    <div className="studio-range-tile__top"><span>{range.models.length} models</span><ArrowUpRight size={21} aria-hidden="true" /></div>
    <Link to={`/products/${range.slug}`} aria-label={`Explore ${range.name}`}>
      <div className="studio-range-tile__images">{range.featured.map((product) => <StudioImage key={product.sku} src={product.assets.card} />)}</div>
      <h3>{range.name}</h3>
      <p>{range.tagline}</p>
    </Link>
  </article>;
}

function ModelTile({ product }) {
  return <article className="studio-model-tile" data-sku={product.sku}>
    <Link to={product.href} className="studio-model-tile__image" tabIndex={-1} aria-hidden="true"><StudioImage src={product.assets.card} /></Link>
    <div className="studio-model-tile__copy"><span className="studio-model-sku">{product.sku}</span><h3>{product.name}</h3>
      <dl>{product.keyFacts.slice(0, 2).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      {product.reviewNotice && <p className="studio-model-note">Review the model notes before specifying.</p>}
      <div className="studio-model-tile__bottom"><div className="studio-mini-swatches" aria-label={`${product.finishes?.length || 0} listed finishes`}>{product.finishes?.slice(0, 7).map((finish) => <span key={finish.slug} style={{ backgroundColor: finish.hex }} title={finish.name} />)}</div><Link to={product.href} aria-label={`View ${product.sku}`}>View model <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
    </div>
  </article>;
}

export default function ProductsStudio() {
  useStudioPageMeta('Product Catalog', 'Explore seven FAHINT wiring-device families. Find model-specific ratings, available finishes, product photographs and documentation.');
  const [query, setQuery] = useState('');
  const [family, setFamily] = useState('all');
  const [mode, setMode] = useState('ranges');
  const [limit, setLimit] = useState(12);
  const searchRef = useRef(null);
  const results = useMemo(() => searchStudioModels(query, family), [query, family]);
  const alias = findCatalogAliasMatch(query);
  const aliasMatch = results.find(product => product.line === alias?.line && product.sku === alias?.sku);
  const showModels = mode === 'models' || query.trim() || family !== 'all';
  const activeRange = studioRanges.find((range) => range.slug === family);
  function chooseFamily(value) { setFamily(value); setMode('models'); setLimit(12); }
  function reset() { setQuery(''); setFamily('all'); setMode('ranges'); setLimit(12); }
  return <div className="studio-page studio-catalog">
    <section className="studio-catalog-hero" aria-labelledby="studio-catalog-title">
      <StudioImage
        className="studio-catalog-hero__poster"
        src="assets/images/editorial-products/product-catalog-hero-v1.jpg"
        width={1920}
        height={550}
        priority
      />
      <div className="studio-catalog-hero__shade" aria-hidden="true" />
      <div className="studio-wrap studio-catalog-hero__content">
        <nav className="studio-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><span aria-current="page">Products</span></nav>
        <div className="studio-catalog-hero__copy">
          <h1 id="studio-catalog-title">Find the right<br /><span>connection.</span></h1>
          <p>Outlets, switches and wall plates.<br />Explore the FAHINT collection, down to the details.</p>
          <a className="studio-text-link" href={publicAsset(catalogueDocument)} download>Download the product catalog <Download size={18} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
    <section className="studio-catalog-browser studio-space" aria-label="Browse the FAHINT catalog">
      <div className="studio-wrap">
        <div className="studio-catalog-tools">
          <div className="studio-view-switch" aria-label="Catalog view"><button type="button" aria-pressed={!showModels} onClick={reset}>Product ranges <span>7</span></button><button type="button" aria-label="Browse all models" aria-pressed={Boolean(showModels)} onClick={() => { setMode('models'); setLimit(12); }}>All models <span>{studioModels.length}</span></button></div>
          <div role="search" className="studio-search"><Search size={21} aria-hidden="true" /><label className="studio-visually-hidden" htmlFor="studio-search">Search model or feature</label><input id="studio-search" ref={searchRef} type="search" placeholder="Search model or feature…" value={query} aria-controls="studio-catalog-results" onChange={(event) => { setQuery(event.target.value); setLimit(12); }} />{query && <button type="button" aria-label="Clear search" onClick={() => { setQuery(''); setLimit(12); searchRef.current?.focus(); }}><X size={18} aria-hidden="true" /></button>}</div>
        </div>
        <div className="studio-catalog-layout">
          <aside className="studio-filter-sidebar" aria-label="Product family filters">
            <h2>Our collection</h2>
            <div className="studio-filter-options"><button type="button" aria-pressed={family === 'all'} onClick={() => { setFamily('all'); setLimit(12); }}>All products <span>{studioModels.length}</span></button>{studioRanges.map((range) => <button type="button" key={range.slug} aria-label={`Filter ${range.name}`} aria-pressed={family === range.slug} onClick={() => chooseFamily(range.slug)}>{range.name}<span>{range.models.length}</span></button>)}</div>
            <div className="studio-filter-help"><h3>Working on a<br />private-label range?</h3><p>Bring us your product mix, finish and packaging requirements.</p><Link className="studio-text-link" to="/contact">Talk to our team <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
          </aside>
          <div id="studio-catalog-results" className="studio-catalog-results">
            <div className="studio-results-head"><p role="status" aria-live="polite">{showModels ? `${results.length} ${results.length === 1 ? 'model' : 'models'}${activeRange ? ` in ${activeRange.name}` : ''}` : 'Seven families. Every detail considered.'}</p>{showModels && <button type="button" onClick={reset}>Reset filters <X size={14} aria-hidden="true" /></button>}</div>
            {aliasMatch && <p className="studio-model-note" aria-live="polite">{aliasMatch.sourceModel} is listed in the current catalog as {aliasMatch.sku}.</p>}
            {!showModels ? <section className="studio-range-grid" aria-label="Product ranges">{studioRanges.map((range) => <RangeTile key={range.slug} range={range} />)}<article className="studio-catalog-guide"><Download size={32} aria-hidden="true" /><h3>A closer look.<br />All in one place.</h3><p>Keep the FAHINT product catalog on hand for your next project.</p><a href={publicAsset(catalogueDocument)} download>Get the catalog <ArrowDown size={19} aria-hidden="true" /></a></article></section>
              : <>{activeRange && <div className="studio-active-range"><div><h2>{activeRange.name}</h2><p>{activeRange.tagline}</p></div><Link className="studio-text-link" to={`/products/${family}`}>Full range details <ArrowUpRight size={17} aria-hidden="true" /></Link></div>}
                <div className="studio-model-grid">{results.slice(0, limit).map((product) => <ModelTile key={`${product.line}-${product.sku}`} product={product} />)}</div>
                {results.length === 0 && <div className="studio-empty"><Search size={34} aria-hidden="true" /><h2>No matching products</h2><p>Try a model such as GF15, a feature such as USB-C, or reset the filters to explore the complete collection.</p><StudioLink to="/contact">Ask us to find a product</StudioLink></div>}
                {limit < results.length && <div className="studio-load-more"><span>Showing {Math.min(limit, results.length)} of {results.length} models</span><button className="studio-button" type="button" onClick={() => setLimit((current) => current + 12)}>Show more models <ArrowDown size={18} aria-hidden="true" /></button></div>}
              </>}
            <p className="studio-catalog-disclaimer">Specifications, available finishes and certification coverage vary by model. Open a product for its documented details.</p>
          </div>
        </div>
      </div>
    </section>
    <section className="studio-catalog-support"><div className="studio-wrap"><div><h2>From selection<br />to specification.</h2><p>Our team can help coordinate the model, finish, documents and samples for your program.</p></div><StudioLink to="/contact" light>Get product support</StudioLink></div></section>
  </div>;
}
