import { useId } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Schematic coordinates, not measurements. R15/R15Q/R20 source photographs
// show different rear terminals and front slots, but publish no dimensions.
function MountingTabs() {
  return [0, 180].map((rotation) => <g key={rotation} transform={`rotate(${rotation})`}>
    <path d="M-16-51H-9L-7-48H-5L-3-51H3L5-48H7L9-51H16L19-48V-42L16-39H8V-32H-8V-39H-16L-19-42V-48Z" />
    <circle cx="-12.5" cy="-45.5" r="2.5" />
    <circle cx="12.5" cy="-45.5" r="2.5" />
    <circle cx="0" cy="-47" r="2.2" />
    <circle cx="0" cy="-39" r="2.5" />
    <path fill="none" d="M-1.5-39H1.5M0-40.5V-37.5" />
  </g>);
}

function FrontFace({ twentyAmp }) {
  return <g data-receptacle-type={twentyAmp ? '5-20R' : '5-15R'}>
    <rect x="-16.5" y="-33.5" width="33" height="67" rx="7" />
    {[-19.5, 19.5].map((y) => <g key={y} transform={`translate(0 ${y})`}>
      <path d="M-9-14H9C13-11 16-7 16-1C16 5 12 11 9 14H-9C-12 11-16 5-16-1C-16-7-13-11-9-14Z" />
      {twentyAmp ? <path d="M-8.5-7H-6.5V2H-8.5V-1H-12V-3H-8.5Z" />
        : <rect x="-8.5" y="-7" width="2" height="9" />}
      <rect x="6.5" y="-6" width="2" height="8" />
      <path d="M-2.8 11V8.2A2.8 2.8 0 0 1 2.8 8.2V11Z" />
    </g>)}
    <circle cx="0" cy="0" r="2.3" />
    <circle cx="0" cy="0" r="1.2" />
  </g>;
}

function RearBody({ quickWire }) {
  return <g data-rear-wiring={quickWire ? 'push-in' : 'back-wire'}>
    <rect x="-17" y="-33.5" width="34" height="67" rx="3" />
    <path fill="none" d="M-12-33.5V-30H-3L0-32L3-30H12V-33.5M-17 20H17M-5 24H5M-5 26H5M-5 28H5" />
    {[-1, 1].map((direction) => <g key={direction} transform={`scale(${direction} 1)`}>
      {quickWire ? [-17, 8].map((y) => <g key={y} transform={`translate(10 ${y})`}>
        <circle r="2.7" /><circle r="1.7" />
        <rect x="-2.8" y="4" width="5.6" height="2.4" rx=".4" />
        <path fill="none" d="M5-1.8H8V1.8H5" />
      </g>) : [-15, 6].map((y) => <g key={y} transform={`translate(14 ${y})`}>
        <rect x="-3.2" y="-7" width="6.4" height="14" rx="1" />
        <rect x="-2.4" y="-5" width="4.8" height="10" rx=".6" />
        <circle r="2.4" />
        <path fill="none" d="M-1.5 0H1.5M0-1.5V1.5M3.2-2H5V2H3.2" />
      </g>)}
    </g>)}
    <rect x="10" y="23" width="7" height="8" rx="1" />
    <circle cx="13.5" cy="27" r="2.1" />
    <path fill="none" d="M12 27H15M13.5 25.5V28.5" />
  </g>;
}

export default function ReceptacleOutline({ product, contactHref = `/contact?model=${encodeURIComponent(product.sku)}` }) {
  const id = useId();
  const quickWire = product.sku === 'R15Q';
  const wiring = quickWire ? 'Side wire / push-in quick wire' : 'Side wire / back wire';
  return <section className="product-technical usb-dimensions receptacle-outline" id="installation-reference">
    <div className="container">
      <header className="catalog-section-heading">
        <div><p className="product-section-label">Model outline</p><h2>Front and rear,<br />clearly shown.</h2></div>
        <p>Clean reference outlines of {product.sku}, based on the model’s product photographs.</p>
      </header>
      <div className="usb-dimensions__sheet">
        <div className="usb-dimensions__sheet-head"><strong>{product.sku}</strong><span>Reference outlines · not to scale</span></div>
        <div className="usb-dimensions__views">
          {['front', 'rear'].map((view, index) => <figure key={view} className="usb-dimensions__view">
            <figcaption><span>{String(index + 1).padStart(2, '0')}</span><h3>{view === 'front' ? 'Front view' : 'Rear view'}</h3></figcaption>
            <svg viewBox="0 0 320 360" width="320" height="360" role="img" aria-labelledby={`${id}-${view}`}>
              <title id={`${id}-${view}`}>{`${product.sku} ${view} view line drawing`}</title>
              <g className="usb-dimension-outline" transform="translate(160 176) scale(2.65)">
                <MountingTabs />
                {view === 'front' ? <FrontFace twentyAmp={product.sku === 'R20'} /> : <RearBody quickWire={quickWire} />}
              </g>
            </svg>
            <p>{view === 'front' ? 'Standard duplex face · non tamper-resistant' : wiring}</p>
          </figure>)}
        </div>
        <footer className="usb-dimensions__footer">
          <p>Illustrative outlines only, not a dimensioned installation drawing. Confirm measurements against the approved model drawing before specifying.</p>
          <Link to={contactHref}>Request dimensioned drawing <ArrowRight size={16} aria-hidden="true" /></Link>
        </footer>
      </div>
    </div>
  </section>;
}
