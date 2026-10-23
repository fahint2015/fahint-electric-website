import { useEffect, useId, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../ProductCard.jsx';
import CatalogModelCard from './CatalogModelCard.jsx';

export default function RecommendedProducts({ products }) {
  const trackRef = useRef(null);
  const trackId = useId();
  const [edges, setEdges] = useState({ start: true, end: false });
  function sync() {
    const track = trackRef.current;
    if (track) setEdges({ start: track.scrollLeft <= 2, end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 2 });
  }
  useEffect(() => {
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);
  function move(direction, end) {
    const track = trackRef.current;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = track.firstElementChild.getBoundingClientRect().width + gap;
    const left = end === undefined
      ? track.scrollLeft + direction * step * Math.max(1, Math.floor((track.clientWidth + gap) / step))
      : end ? track.scrollWidth : 0;
    track.scrollTo({ left, behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  return <section className="concise-product-related" aria-labelledby="recommended-products-title"><div className="container">
    <h2 id="recommended-products-title">Recommended Products</h2>
    <div className="product-carousel">
      <button type="button" className="product-carousel__arrow product-carousel__arrow--prev" aria-label="Previous recommended products" aria-controls={trackId} disabled={edges.start} hidden={edges.start && edges.end} onClick={() => move(-1)}><ChevronLeft size={22} aria-hidden="true" /></button>
      <div id={trackId} ref={trackRef} className="concise-product-related-grid" role="region" aria-label="Recommended product carousel" tabIndex={0} onScroll={sync} onKeyDown={event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        move(event.key === 'ArrowLeft' ? -1 : 1, ['Home', 'End'].includes(event.key) ? event.key === 'End' : undefined);
      }}>
        {products.map(model => model.line ? <CatalogModelCard key={model.sku} product={model} /> : <ProductCard key={model.sku} product={model} />)}
      </div>
      <button type="button" className="product-carousel__arrow product-carousel__arrow--next" aria-label="Next recommended products" aria-controls={trackId} disabled={edges.end} hidden={edges.start && edges.end} onClick={() => move(1)}><ChevronRight size={22} aria-hidden="true" /></button>
    </div>
  </div></section>;
}
