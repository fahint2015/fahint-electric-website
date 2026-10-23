import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import ProductCard from '../ProductCard.jsx';
import { products } from '../../data/products.js';
import { getCatalogProducts } from '../../data/catalogProducts.js';

// Adapt the published GTN models to the shared GFCI card and filter fields.
const models = [...products, ...getCatalogProducts('gfci').map(product => {
  const facts = Object.fromEntries(product.keyFacts);
  return { ...product, rating: facts.Rating, nema: facts.Configuration.replace(/^NEMA /, ''), category: 'tr', feature: 'TR' };
})];

export default function GfciModelDirectory() {
  const [query,setQuery] = useState('');
  const [rating,setRating] = useState('');
  const [variant,setVariant] = useState('');
  const filtered = models.filter(product => `${product.sku} ${product.name} ${product.feature}`.toLowerCase().includes(query.trim().toLowerCase()) && (!rating || product.rating.startsWith(rating)) && (!variant || product.feature === variant));
  function clear() { setQuery(''); setRating(''); setVariant(''); }
  return <section className="gfci-series__catalog section" aria-labelledby="gfci-models-heading"><div className="container">
    <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><Link to="/products">Products</Link><span aria-hidden="true">/</span><span aria-current="page">GFCI Outlets</span></nav>
    <div className="gfci-series__catalog-head"><h2 id="gfci-models-heading">Explore GFCI models</h2><p>Compare FAHINT self-test GFCI outlets in 15A and 20A configurations. Choose standard, tamper-resistant (TR), or tamper- and weather-resistant (TR/WR) receptacles; review the blank-face GL20 separately.</p></div>
    <div className="brand-catalog-layout">
      <div className="catalog-filters gfci-series__filters">
        <label className="catalog-filters__search"><span>Search models</span><div><Search size={18} aria-hidden="true" /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Model or feature" /></div></label>
        <label><span>Receptacle rating</span><select value={rating} onChange={event => setRating(event.target.value)}><option value="">All ratings</option><option value="15A">15A</option><option value="20A">20A</option></select></label>
        <label><span>Variant</span><select value={variant} onChange={event => setVariant(event.target.value)}><option value="">All variants</option>{[...new Set(models.map(product => product.feature))].map(value => <option key={value} value={value}>{value}</option>)}</select></label>
        <div className="catalog-filters__summary"><p className="catalog-filters__count" role="status">{filtered.length} of {models.length} models</p><button type="button" className="catalog-filters__clear" onClick={clear} disabled={!query && !rating && !variant}>Clear filters</button><Link className="textlink" to="#buying-guide">Need help choosing?</Link></div>
      </div>
      <div className="brand-catalog-results">{filtered.length ? <div className="prod-grid gfci-series__product-grid gfci-product-grid">{filtered.map(product => <ProductCard key={product.sku} product={product} />)}</div> : <div className="catalog-empty gfci-series__empty"><p role="status">No models match your selection.</p><button type="button" className="btn btn--outline" onClick={clear}>Reset selection</button></div>}</div>
    </div>
  </div></section>;
}
