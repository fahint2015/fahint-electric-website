import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from '../SiteLink.jsx';
import { Search } from 'lucide-react';
import ProductCard from '../ProductCard.jsx';
import { products } from '../../data/products.js';
import { getCatalogProducts } from '../../data/catalogProducts.js';
import { resolveModelComparison } from '../../data/modelComparison.js';
import CatalogFilterPanel from './CatalogFilterPanel.jsx';
import UsbComparison from './UsbComparison.jsx';

// Adapt the published GTN models to the shared GFCI card and filter fields.
const models = [...products, ...getCatalogProducts('gfci').map(product => {
  const facts = Object.fromEntries(product.keyFacts);
  return { ...product, rating: facts.Rating, nema: facts.Configuration.replace(/^NEMA /, ''), category: 'tr', feature: 'TR' };
})];

export default function GfciModelDirectory() {
  const [query,setQuery] = useState('');
  const [rating,setRating] = useState('');
  const [variant,setVariant] = useState('');
  const [params, setParams] = useSearchParams();
  const filterPanelRef = useRef(null);
  const compared = resolveModelComparison('gfci', params.get('compare') || '');
  const updateComparison = nextProducts => {
    const next = new URLSearchParams(params);
    if (nextProducts.length) next.set('compare', nextProducts.map(product => product.sku).join(','));
    else next.delete('compare');
    setParams(next, { replace: true, preventScrollReset: true, state: { preserveScroll: true } });
  };
  const toggleCompare = product => {
    if (compared.some(item => item.sku === product.sku)) updateComparison(compared.filter(item => item.sku !== product.sku));
    else if (compared.length < 3) updateComparison([...compared, product]);
  };
  const filtered = models.filter(product => `${product.sku} ${product.name} ${product.feature}`.toLowerCase().includes(query.trim().toLowerCase()) && (!rating || product.rating.startsWith(rating)) && (!variant || product.feature === variant));
  function clear() { setQuery(''); setRating(''); setVariant(''); }
  return <section className="gfci-series__catalog section" aria-labelledby="gfci-models-heading"><div className="container">
    <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><Link to="/products">Products</Link><span aria-hidden="true">/</span><span aria-current="page">GFCI Outlets</span></nav>
    <div className="gfci-series__catalog-head"><h2 id="gfci-models-heading">Explore GFCI models</h2><p>Compare FAHINT self-test GFCI outlets in 15A and 20A configurations. Choose standard, tamper-resistant (TR), or tamper- and weather-resistant (TR/WR) receptacles; review the blank-face GL20 separately.</p></div>
    <div className="brand-catalog-layout">
      <CatalogFilterPanel ref={filterPanelRef}><div className="catalog-filters gfci-series__filters">
        <label className="catalog-filters__search"><span>Search models</span><div><Search size={18} aria-hidden="true" /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Model or feature" /></div></label>
        <label><span>Receptacle rating</span><select value={rating} onChange={event => setRating(event.target.value)}><option value="">All ratings</option><option value="15A">15A</option><option value="20A">20A</option></select></label>
        <label><span>Variant</span><select value={variant} onChange={event => setVariant(event.target.value)}><option value="">All variants</option>{[...new Set(models.map(product => product.feature))].map(value => <option key={value} value={value}>{value}</option>)}</select></label>
        <div className="catalog-filters__summary"><p className="catalog-filters__count" role="status">{filtered.length} of {models.length} models</p><button type="button" className="catalog-filters__clear" onClick={clear} disabled={!query && !rating && !variant}>Clear filters</button><Link className="textlink" to="#buying-guide">Need help choosing?</Link></div>
      </div></CatalogFilterPanel>
      <div className="brand-catalog-results">
        <UsbComparison line="gfci" products={compared} onChange={updateComparison} onOpenFilters={() => filterPanelRef.current?.showModal?.()} />
        {filtered.length ? <div className="prod-grid gfci-series__product-grid gfci-product-grid">{filtered.map(product => <article className="gfci-compare-card" key={product.sku}>
          <ProductCard product={product} />
          <label className="usb-compare-choice">
            <input type="checkbox" aria-label={`Compare ${product.sku}`} checked={compared.some(item => item.sku === product.sku)}
              disabled={compared.length === 3 && !compared.some(item => item.sku === product.sku)} onChange={() => toggleCompare(product)} />
            <span>Compare</span>
          </label>
        </article>)}</div> : <div className="catalog-empty gfci-series__empty"><p role="status">No models match your selection.</p><button type="button" className="btn btn--outline" onClick={clear}>Reset selection</button></div>}
      </div>
    </div>
  </div></section>;
}
