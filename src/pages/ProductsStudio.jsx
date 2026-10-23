import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUpRight, ChevronDown, Download, Search, X } from 'lucide-react';
import { studioRanges, searchStudioModels } from '../data/studioCatalog.js';
import { categoryImages, productCategories, productCategory } from '../data/productCategories.js';
import { catalogueDocument, findCatalogAliasMatch } from '../data/catalogProducts.js';
import { publicAsset } from '../utils/publicAsset.js';
import { StudioImage, StudioLink, useStudioPageMeta } from '../components/studio/StudioShared.jsx';
import '../styles/studio.css';
import Reveal from '../components/Reveal.jsx';

function RangeTile({ range }) {
  return <Reveal as="article" className="studio-range-tile" aria-label={range.name}>
    <Link to={`/products/${range.slug}`} aria-label={`Explore ${range.name}`}>
      <div className="studio-range-tile__photo"><StudioImage {...categoryImages[range.slug]} srcSet={`${publicAsset(categoryImages[range.slug].src.replace('.webp', '-768w.webp'))} 768w, ${publicAsset(categoryImages[range.slug].src)} 1536w`} sizes="(max-width: 760px) calc(100vw - 48px), (max-width: 1080px) 35vw, 28vw" /></div>
      <div className="studio-range-tile__title"><h3>{range.name}</h3><ArrowUpRight size={21} aria-hidden="true" /></div>
      <p>{range.tagline}</p>
    </Link>
  </Reveal>;
}

function ModelTile({ product }) {
  return <Reveal as="article" className="studio-model-tile" data-sku={product.sku}>
    <Link to={product.href} className="studio-model-tile__image" tabIndex={-1} aria-hidden="true"><StudioImage src={product.assets.card} /></Link>
    <div className="studio-model-tile__copy"><span className="studio-model-sku">{product.sku}</span><h3>{product.name}</h3>
      <dl>{product.keyFacts.slice(0, 2).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      {product.reviewNotice && <p className="studio-model-note">Review the model notes before specifying.</p>}
      <div className="studio-model-tile__bottom"><div className="studio-mini-swatches" aria-label={`${product.finishes?.length || 0} listed finishes`}>{product.finishes?.slice(0, 7).map((finish) => <span key={finish.slug} style={{ backgroundColor: finish.hex }} title={finish.name} />)}</div><Link to={product.href} aria-label={`View ${product.sku}`}>View model <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
    </div>
  </Reveal>;
}

export default function ProductsStudio() {
  useStudioPageMeta('Product Catalog', 'Explore seven FAHINT wiring-device families. Find model-specific ratings, available finishes, product photographs and documentation.');
  const [query, setQuery] = useState('');
  const [family, setFamily] = useState('all');
  const [expandedFamily, setExpandedFamily] = useState('');
  const [group, setGroup] = useState('');
  const [mode, setMode] = useState('ranges');
  const [limit, setLimit] = useState(12);
  const searchRef = useRef(null);
  const results = useMemo(() => searchStudioModels(query, family).filter(product => !group || productCategory(product) === group), [query, family, group]);
  const alias = findCatalogAliasMatch(query);
  const aliasMatch = results.find(product => product.line === alias?.line && product.sku === alias?.sku);
  const showModels = mode === 'models' || query.trim() || family !== 'all';
  const activeRange = studioRanges.find((range) => range.slug === family);
  function chooseFamily(value) {
    if (value === family) { setExpandedFamily(current => current === value ? '' : value); return; }
    setFamily(value); setExpandedFamily(value); setGroup(''); setMode('models'); setLimit(12);
  }
  function reset(nextMode = 'ranges') { setQuery(''); setFamily('all'); setExpandedFamily(''); setGroup(''); setMode(nextMode); setLimit(12); }
  return <div className="studio-page studio-catalog">
    <section className="studio-catalog-hero" aria-labelledby="studio-catalog-title">
      <StudioImage
        className="studio-catalog-hero__poster"
        src="assets/images/brand-home/generated/application-residential-scene.webp"
        width={1920}
        height={550}
        priority
      />
      <div className="studio-catalog-hero__shade" aria-hidden="true" />
      <div className="studio-wrap studio-catalog-hero__content">
        <nav className="studio-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><span aria-current="page">Products</span></nav>
        <div className="studio-catalog-hero__copy">
          <Reveal as="h1" id="studio-catalog-title">Find the right<br /><span>connection.</span></Reveal>
          <Reveal as="p" delay={160}>Outlets, switches and wall plates.<br />Explore the FAHINT collection, down to the details.</Reveal>
          <a className="studio-text-link" href={publicAsset(catalogueDocument)} download>Download the product catalog <Download size={18} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
    <section className="studio-catalog-browser studio-space" aria-label="Browse the FAHINT catalog">
      <div className="studio-wrap">
        <div className="studio-catalog-tools">
          <div className="studio-view-switch" role="group" aria-label="Catalog view"><button type="button" aria-pressed={!showModels} onClick={() => reset()}>Product ranges</button><button type="button" aria-label="Browse all models" aria-pressed={Boolean(showModels)} onClick={() => reset('models')}>All models</button></div>
          <div role="search" className="studio-search"><Search size={21} aria-hidden="true" /><label className="studio-visually-hidden" htmlFor="studio-search">Search model or feature</label><input id="studio-search" ref={searchRef} type="search" placeholder="Search model or feature…" value={query} aria-controls="studio-catalog-results" onChange={(event) => { setQuery(event.target.value); setLimit(12); }} />{query && <button type="button" aria-label="Clear search" onClick={() => { setQuery(''); setLimit(12); searchRef.current?.focus(); }}><X size={18} aria-hidden="true" /></button>}</div>
        </div>
        <div className="studio-catalog-layout">
          <aside className="studio-filter-sidebar" aria-label="Product family filters">
            <h2>Product families</h2>
            <div className="studio-filter-options"><button type="button" aria-pressed={family === 'all'} onClick={() => reset()}>All products</button>{productCategories.map(range => <div className="studio-category" key={range.slug}>
              <button type="button" aria-label={`Filter ${range.name}`} aria-pressed={family === range.slug} aria-expanded={expandedFamily === range.slug} aria-controls={`category-${range.slug}`} onClick={() => chooseFamily(range.slug)}>{range.name}<ChevronDown size={16} aria-hidden="true" /></button>
              {expandedFamily === range.slug && <div className="studio-subcategories" id={`category-${range.slug}`} aria-label={`${range.name} categories`}>
                <button type="button" aria-pressed={!group} onClick={() => { setGroup(''); setLimit(12); }}>All {range.short}</button>
                {range.children.map(value => <button key={value} type="button" aria-pressed={group === value} onClick={() => { setGroup(value); setLimit(12); }}>{value}</button>)}
              </div>}
            </div>)}</div>
            <div className="studio-filter-help"><h3>Working on a<br />private-label range?</h3><p>Bring us your product mix, finish and packaging requirements.</p><Link className="studio-text-link" to="/contact">Talk to our team <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
          </aside>
          <div id="studio-catalog-results" className="studio-catalog-results">
            <div className="studio-results-head"><p role="status" aria-live="polite">{showModels ? `${results.length} ${results.length === 1 ? 'model' : 'models'}${group ? ` · ${group}` : activeRange ? ` in ${activeRange.name}` : ''}` : 'Explore our product families.'}</p>{showModels && <button type="button" onClick={() => reset()}>Reset filters <X size={14} aria-hidden="true" /></button>}</div>
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
