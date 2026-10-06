import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Columns3, X } from 'lucide-react';
import { productHref } from '../../data/catalogProducts.js';
import { usbComparisonRows } from '../../data/usbComparison.js';
import { inquiryContactHref, resolveInquiryContext } from '../../utils/inquiryContext.js';
import { usbInquiryHref } from '../../utils/inquiryList.js';
import SafeImage from '../SafeImage.jsx';
import './usb-comparison.css';

export default function UsbComparison({ products, onChange }) {
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const [differencesOnly, setDifferencesOnly] = useState(false);
  const rows = usbComparisonRows(products).filter(row => !differencesOnly || row.different);
  const close = () => dialogRef.current?.close();

  return <>
    <section className={`usb-comparison${products.length ? ' usb-comparison--selected' : ''}`} aria-label="Model comparison">
      <div className="usb-comparison__intro">
        <strong><Columns3 size={18} aria-hidden="true" /> Compare USB models</strong>
        <p aria-live="polite">{products.length < 2 ? products.length ? '1 selected · Add one more' : 'Select 2–3 models' : `${products.length} of 3 selected`}</p>
      </div>
      <button ref={triggerRef} className="usb-comparison__open" type="button" disabled={products.length < 2}
        aria-haspopup="dialog" aria-controls="usb-comparison-dialog"
        onClick={() => { setDifferencesOnly(false); dialogRef.current.showModal(); }}>
        Compare models <ArrowRight size={16} aria-hidden="true" />
      </button>
      {products.length > 0 && <div className="usb-comparison__selection">
        <ul aria-label="Selected models">{products.map(product => <li key={product.sku}>
          <button type="button" onClick={() => onChange(products.filter(item => item.sku !== product.sku))} aria-label={`Remove ${product.sku} from comparison`}>
            <span>{product.sku}</span><X size={14} aria-hidden="true" />
          </button>
        </li>)}</ul>
        <button className="usb-comparison__clear" type="button" onClick={() => onChange([])}>Clear comparison</button>
      </div>}
    </section>

    <dialog ref={dialogRef} id="usb-comparison-dialog" className="usb-comparison__dialog" aria-labelledby="usb-comparison-title"
      onCancel={event => { event.preventDefault(); close(); }}
      onClose={() => triggerRef.current?.focus({ preventScroll: true })}>
      <header className="usb-comparison__header">
        <div><p>PRODUCT COMPARISON</p><h2 id="usb-comparison-title">Compare USB models</h2></div>
        <button type="button" className="usb-comparison__close" aria-label="Close comparison" onClick={close} autoFocus><X size={22} aria-hidden="true" /></button>
      </header>
      <div className="usb-comparison__controls">
        <label><input type="checkbox" checked={differencesOnly} onChange={event => setDifferencesOnly(event.target.checked)} />Show differences only</label>
        <p>Scroll the table to see every model.</p>
      </div>
      <div className="usb-comparison__scroll" role="region" aria-label="Scrollable model specifications" tabIndex={0}>
        <table className={`usb-comparison__table usb-comparison__table--${products.length}`} aria-label="USB model specifications">
          <thead><tr><th scope="col">Specification</th>{products.map(product => {
            const [width, height] = product.assets.imageSizes[product.assets.card] || [800, 800];
            return <th key={product.sku} scope="col">
              <SafeImage src={product.assets.card} alt="" width={width} height={height} />
              <strong>{product.sku}</strong><p>{product.name}</p>
              <div className="usb-comparison__links">
                <Link to={productHref(product)} aria-label={`View ${product.sku} details`}>View details <ArrowRight size={14} aria-hidden="true" /></Link>
                <Link to={inquiryContactHref(resolveInquiryContext(product.sku), 'products')} aria-label={`Request quote for ${product.sku}`}>Request quote</Link>
              </div>
            </th>;
          })}</tr></thead>
          <tbody>{rows.map(row => <tr key={row.label} className={row.different ? 'usb-comparison__different' : undefined}>
            <th scope="row">{row.label}{row.different && <small>Different</small>}</th>
            {row.values.map((value, index) => <td key={products[index].sku}>{value}</td>)}
          </tr>)}{!rows.length && <tr><td colSpan={products.length + 1}>No differences in these published specifications. Turn off “Show differences only” to see all rows.</td></tr>}</tbody>
        </table>
      </div>
      <div className="usb-comparison__inquiry">
        <p>Shortlist ready? Set quantities and finishes on the contact page.</p>
        <Link className="usb-comparison__open" to={`${usbInquiryHref(products.map(product => ({ model: product.sku })))}#inquiry`}>
          Add selected to inquiry <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <p className="usb-comparison__note">5V output is shared across USB ports. PD values are single-port maximums, not simultaneous dual-port output. Confirm missing specifications, power sharing and model documentation before ordering.</p>
    </dialog>
  </>;
}
