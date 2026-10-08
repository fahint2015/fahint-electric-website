import { useId } from 'react';
import { ExternalLink } from 'lucide-react';
import { publicAsset } from '../../utils/publicAsset.js';

// The outline is simplified for reading, not a manufacturing CAD drawing.
// Reviewed measurements use mm coordinates and a shared scale/centerline;
// unannotated outline details are schematic, not specified dimensions.
const SCALE = 2.15;
const center = { x: 160, y: 170 };

function UsbPort({ type, x, y }) {
  return <g transform={`translate(${x} ${y})`} data-port-type={type}>
    {type === 'A' ? <>
      <rect x="-2.2" y="-6" width="4.4" height="12" rx=".4" />
      <path d="M-.8-4.6V4.6M.5-4.2H1.4M.5-1.4H1.4M.5 1.4H1.4M.5 4.2H1.4" />
    </> : <>
      <rect x="-1.7" y="-4.7" width="3.4" height="9.4" rx="1.7" />
      <path d="M0-2.7V2.7" />
    </>}
  </g>;
}

function OutletSlots({ y, twentyAmp }) {
  return <g transform={`translate(0 ${y})`} data-receptacle={twentyAmp ? '5-20R' : '5-15R'}>
    {twentyAmp
      ? <path d="M-8.5-4H-6.5V4H-8.5V1H-12V-1H-8.5Z" />
      : <rect x="-8.5" y="-4" width="2" height="8" />}
    <rect x="5.5" y="-3" width="2" height="6" />
    <path d="M-2.8 13V10.5A2.8 2.8 0 0 1 2.8 10.5V13Z" />
  </g>;
}

function DeviceFace({ sku }) {
  const fourPort = sku === 'F4P';
  const ports = sku.includes('DC') ? ['C', 'C'] : /(?:C-|AC)/.test(sku) ? ['A', 'C'] : ['A', 'A'];
  return <g className="usb-dimension-face">
    <rect x="-16.55" y="-33.25" width="33.1" height="66.5" rx="2.2" />
    {fourPort ? [-17, 17].flatMap((y) => [-9, 9].map((x) => <UsbPort key={`${x}-${y}`} type="A" x={x} y={y} />)) : <>
      <OutletSlots y={-22} twentyAmp={sku.startsWith('FTR20')} />
      <OutletSlots y={17} twentyAmp={sku.startsWith('FTR20')} />
      {ports.map((type, i) => <UsbPort key={i} type={type} x={i === 0 ? -10 : 10} y={0} />)}
      <text className="usb-dimension-face__mark" x="8" y="-27">TR</text>
    </>}
  </g>;
}

function Yoke({ height, mountingPitch = 83.5, tabPitch = 23.8 }) {
  const top = -height / 2;
  return [0, 180].map((rotation) => <g key={rotation} transform={`rotate(${rotation})`}>
    <path d={`M-16 ${top}H-4L-3 ${top + 2.5}H3L4 ${top}H16Q18 ${top} 18 ${top + 2}V${top + 9}Q18 ${top + 11} 16 ${top + 11}H9V-33H-9V${top + 11}H-16Q-18 ${top + 11} -18 ${top + 9}V${top + 2}Q-18 ${top} -16 ${top}Z`} />
    <circle cx={-tabPitch / 2} cy={top + 5.5} r="2" />
    <circle cx={tabPitch / 2} cy={top + 5.5} r="2" />
    <rect x="-3.7" y={-mountingPitch / 2 - 1.6} width="7.4" height="3.2" rx="1.6" />
  </g>);
}

function FrontOutline({ sku, dimensions, plate = false, mounting = false }) {
  return <g className="usb-dimension-outline" transform={`translate(${center.x} ${center.y}) scale(${SCALE})`}>
    {plate ? <>
      <rect x={-dimensions.plateWidth / 2} y={-dimensions.plateHeight / 2} width={dimensions.plateWidth} height={dimensions.plateHeight} rx="2.5" />
      <rect className="usb-dimension-outline__detail" x={-dimensions.plateWidth / 2 + 1} y={-dimensions.plateHeight / 2 + 1} width={dimensions.plateWidth - 2} height={dimensions.plateHeight - 2} rx="2" />
    </> : <>
      <Yoke height={dimensions.overallHeight || 103.3} mountingPitch={dimensions.mountingPitch} tabPitch={dimensions.tabPitch} />
      <rect x={-dimensions.width / 2} y="-34.5" width={dimensions.width} height="69" rx="3" />
    </>}
    <g opacity={mounting ? '.38' : '1'}><DeviceFace sku={sku} /></g>
    {mounting && <path className="usb-dimension-centerline" d="M0-57V57M-26-41.75H26M-26 41.75H26" />}
  </g>;
}

function SideOutline({ dimensions }) {
  const left = -dimensions.depth / 2;
  const right = dimensions.depth / 2;
  const mountingX = dimensions.boxDepth ? left + dimensions.boxDepth : right - 6;
  const halfHeight = (dimensions.overallHeight || 103.3) / 2;
  return <g className="usb-dimension-outline" transform={`translate(${center.x} ${center.y}) scale(${SCALE})`}>
    <rect x={left} y="-34.5" width={dimensions.depth - 6} height="69" rx="1.7" />
    <rect x={right - 6} y="-34.5" width="6" height="69" rx=".6" />
    <path d={`M${mountingX} ${-halfHeight}V${halfHeight}M${mountingX - 1} ${-halfHeight}V${halfHeight}`} />
    {[-25, -19, 9, 15, 21, 27].map((y) => <rect key={y} x={left} y={y} width="12" height="1.1" rx=".5" />)}
    <rect x={left + 4} y="-10" width="10" height="10" rx=".5" />
    <circle cx={left + 9} cy="-5" r="3.6" />
    <path d={`M${left + 6.5}-5H${left + 11.5}M${left + 9}-7.5V-2.5`} />
    {[-41.75, 41.75].map((y) => <path key={y} d={`M${mountingX - 13} ${y}H${mountingX + 1}M${mountingX - 13} ${y - 1}H${mountingX}M${mountingX + 1} ${y - 2}V${y + 2}`} />)}
  </g>;
}

function HorizontalDimension({ from, to, sourceY, y, value }) {
  return <g className="usb-dimension-measure">
    <path className="usb-dimension-extension" d={`M${from} ${sourceY}V${y + (y > sourceY ? 5 : -5)}M${to} ${sourceY}V${y + (y > sourceY ? 5 : -5)}`} />
    <path d={`M${from} ${y}H${to}`} />
    <path className="usb-dimension-arrow" d={`M${from} ${y}l6-3v6ZM${to} ${y}l-6-3v6Z`} />
    <text x={(from + to) / 2} y={y + 20}>{value} mm</text>
  </g>;
}

function VerticalDimension({ from, to, sourceX, x, value }) {
  return <g className="usb-dimension-measure">
    <path className="usb-dimension-extension" d={`M${sourceX} ${from}H${x - 5}M${sourceX} ${to}H${x - 5}`} />
    <path d={`M${x} ${from}V${to}`} />
    <path className="usb-dimension-arrow" d={`M${x} ${from}l-3 6h6ZM${x} ${to}l-3-6h6Z`} />
    <text transform={`translate(${x - 13} ${(from + to) / 2}) rotate(-90)`}>{value} mm</text>
  </g>;
}

function DimensionView({ sku, dimensions, view, title, caption, index }) {
  const titleId = useId();
  const plate = view === 'plate';
  const side = view === 'side';
  const mounting = view === 'mounting';
  const width = plate ? dimensions.plateWidth : side ? dimensions.depth : dimensions.width;
  const height = plate ? dimensions.plateHeight : side ? dimensions.bodyHeight || dimensions.overallHeight : dimensions.overallHeight || dimensions.bodyHeight;
  const left = center.x - width * SCALE / 2;
  const right = center.x + width * SCALE / 2;
  const top = center.y - height * SCALE / 2;
  const bottom = center.y + height * SCALE / 2;
  const holeY = center.y - ((dimensions.overallHeight || 103.3) / 2 - 5.5) * SCALE;

  return <figure className="usb-dimensions__view">
    <figcaption><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3></figcaption>
    <svg viewBox="0 0 320 360" width="320" height="360" role="img" aria-labelledby={titleId}>
      <title id={titleId}>{`${sku} ${title.toLowerCase()} dimension drawing`}</title>
      {side ? <SideOutline dimensions={dimensions} /> : <FrontOutline sku={sku} dimensions={dimensions} plate={plate} mounting={mounting} />}
      {mounting ? <>
        <HorizontalDimension from={center.x - dimensions.tabPitch * SCALE / 2} to={center.x + dimensions.tabPitch * SCALE / 2} sourceY={holeY} y={36} value={dimensions.tabPitch} />
        <VerticalDimension from={center.y - dimensions.mountingPitch * SCALE / 2} to={center.y + dimensions.mountingPitch * SCALE / 2} sourceX={center.x} x={left - 32} value={dimensions.mountingPitch} />
      </> : <>
        <HorizontalDimension from={left} to={right} sourceY={bottom + 3} y={318} value={width} />
        <VerticalDimension from={top} to={bottom} sourceX={left - 3} x={left - 30} value={height} />
        {side && dimensions.boxDepth && <HorizontalDimension from={left} to={left + dimensions.boxDepth * SCALE} sourceY={top - 3} y={70} value={dimensions.boxDepth} />}
      </>}
    </svg>
    <p>{caption}</p>
  </figure>;
}

export default function UsbDimensions({ product, dimensions }) {
  const views = dimensions.plateWidth ? [
    ['plate', 'Wall plate', 'Reference plate · height × width'],
    ['front', 'Front view', 'Device height includes the mounting tabs.'],
    ['side', 'Side profile', 'Overall device height and depth.']
  ] : [
    ['front', 'Front view', dimensions.faceWidth ? `Face: ${dimensions.faceWidth} × ${dimensions.faceHeight} mm · body height shown.` : 'Overall height includes the mounting tabs.'],
    ['mounting', 'Mounting centers', 'Hole spacing is measured center to center.'],
    ['side', 'Side profile', dimensions.boxDepth ? 'Recessed body depth above · total depth below.' : 'Body height and overall depth.']
  ];
  return <section className="product-technical usb-dimensions" id="installation-reference">
    <div className="container">
      <header className="catalog-section-heading">
        <div><p className="product-section-label">Dimensional reference</p><h2>Dimensions,<br />clearly drawn.</h2></div>
        <p>{dimensions.scope || `Three clear views of ${product.sku}. Key measurements from the original model drawing, with room to read every detail.`}</p>
      </header>
      <div className="usb-dimensions__sheet">
        <div className="usb-dimensions__sheet-head"><strong>{product.sku}</strong><span>Dimensions in millimeters · mm</span></div>
        <div className="usb-dimensions__views">
          {views.map(([view, title, caption], index) => <DimensionView key={view} sku={product.sku} dimensions={dimensions} view={view} title={title} caption={caption} index={index} />)}
        </div>
        <footer className="usb-dimensions__footer">
          <p>Simplified reference outlines, not a scale template. Confirm the approved drawing and installation instructions before specifying.</p>
          <a href={publicAsset(dimensions.source)} target="_blank" rel="noreferrer" aria-label={`Open ${product.sku} original dimension drawing`}>Original dimension drawing <ExternalLink size={16} aria-hidden="true" /></a>
        </footer>
      </div>
    </div>
  </section>;
}
