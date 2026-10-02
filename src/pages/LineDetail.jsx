import { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { findLine, productLines } from '../data/lines.js';
import { filterCatalogProducts, getCatalogProducts } from '../data/catalogProducts.js';
import CatalogModelCard from '../components/products/CatalogModelCard.jsx';
import SafeImage from '../components/SafeImage.jsx';
import { familyMetadata } from '../seo/metadata.js';
import { usePageMetadata } from '../seo/usePageMetadata.js';
import { BuyingGuide } from '../components/products/BuyingGuide.jsx';

function ModelCatalogue({ line }) {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('');
  const models = getCatalogProducts(line.slug);
  const groups = [...new Set(models.map((product) => product.group))];
  const filtered = filterCatalogProducts(models, { query, group });
  const clear = () => { setQuery(''); setGroup(''); };
  const isCenteredPoster = ['receptacles', 'smart-switches'].includes(line.slug);
  const isRightPoster = line.slug === 'lighting-switches';
  const poster = {
    'usb-outlets': 'assets/images/lines/usb-series-desktop-charging-v1.webp',
    dimmers: 'assets/images/lines/dimmer-series-living-room-v1.webp',
    receptacles: 'assets/images/lines/receptacle-series-desk-power-v1.webp',
    'smart-switches': 'assets/images/lines/smart-series-bedside-touch-v1.webp',
    'lighting-switches': 'assets/images/lines/lighting-series-stair-entry-v1.webp',
  }[line.slug];

  usePageMetadata(familyMetadata(line));

  return <div className="catalog-series">
    <section className={`catalog-series__intro${poster ? ' catalog-series__intro--poster' : ''}${isCenteredPoster ? ' catalog-series__intro--centered' : ''}${isRightPoster ? ' catalog-series__intro--right' : ''}`} aria-labelledby="catalog-series-title">
      {poster && <>
        <SafeImage className="catalog-series__poster" src={poster}
          alt="" width={1920} height={450} loading="eager" fetchpriority="high" />
        <div className="catalog-series__poster-shade" aria-hidden="true" />
      </>}
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link><span aria-hidden="true">/</span><Link to="/products">Products</Link>
          <span aria-hidden="true">/</span><span aria-current="page">{line.name}</span>
        </nav>
        <div className="catalog-section-heading">
          <div><h1 id="catalog-series-title">{line.name}</h1></div>
          {!isCenteredPoster && !isRightPoster && <p>{line.summary}</p>}
        </div>
        <div className="catalog-series__meta">
          <span>{models.length} model configurations</span><span>Model-specific specifications</span><span>Original product references</span>
        </div>
      </div>
    </section>
    <section className="catalog-series__models" aria-label={`${line.name} models`}>
      <div className="container">
        <div className="catalog-filters">
          <label className="catalog-filters__search"><span>Search models</span><div><Search size={18} aria-hidden="true" />
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Model number or feature" />
          </div></label>
          <label><span>Configuration</span><select value={group} onChange={(event) => setGroup(event.target.value)}>
            <option value="">All configurations</option>{groups.map((name) => <option key={name} value={name}>{name}</option>)}
          </select></label>
          <div className="catalog-filters__summary"><p className="catalog-filters__count" aria-live="polite">{filtered.length} of {models.length} models</p>
            <Link className="textlink" to={`/products/${line.slug}#buying-guide`}>Need help choosing?</Link></div>
        </div>
        {filtered.length ? <div className="catalog-model-grid">{filtered.map((product) => <CatalogModelCard key={product.slug} product={product} />)}</div>
          : <div className="catalog-empty"><p role="status">No models match your selection.</p><button className="btn btn--outline" onClick={clear}>Clear filters</button></div>}
      </div>
    </section>
    <BuyingGuide line={line.slug} />
    <section className="catalog-series__footer">
      <div className="container">
        <header className="catalog-section-heading"><div><h2>Explore the other ranges.</h2></div>
          <Link className="textlink" to="/contact">Discuss your project <ArrowRight size={16} aria-hidden="true" /></Link>
        </header>
        <div className="catalog-family-links">{productLines.filter((item) => item.slug !== line.slug).map((item) =>
          <Link key={item.slug} to={`/products/${item.slug}`}><span>{item.name}</span><ArrowRight size={18} aria-hidden="true" /></Link>
        )}</div>
      </div>
    </section>
  </div>;
}

export default function LineDetail() {
  const { line: slug } = useParams();
  const line = findLine(slug);
  if (!line) return <Navigate to="/products" replace />;
  return <ModelCatalogue key={line.slug} line={line} />;
}
