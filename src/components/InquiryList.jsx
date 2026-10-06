import { useId } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { getCatalogProducts } from '../data/catalogProducts.js';
import { validInquiryQuantity } from '../utils/inquiryList.js';
import SafeImage from './SafeImage.jsx';
import './inquiry-list.css';

const usbProducts = getCatalogProducts('usb-outlets');

export default function InquiryList({ items, onChange }) {
  const id = useId();
  const change = (model, key, value) => onChange(items.map(item => item.model === model ? { ...item, [key]: value } : item));
  return <section className="inquiry-list" role="group" aria-labelledby={`${id}-title`}>
    <div className="inquiry-list__heading"><h4 id={`${id}-title`}>Your inquiry list</h4><span aria-live="polite">{items.length} {items.length === 1 ? 'model' : 'models'}</span></div>
    <p className="inquiry-list__intro">Set a quantity and finish for each model, or leave them open for discussion.</p>
    <ul>{items.map(item => {
      const product = usbProducts.find(candidate => candidate.sku === item.model);
      const invalidQuantity = !validInquiryQuantity(item.quantity);
      const itemId = `${id}-${item.model}`;
      const [width, height] = product.assets.imageSizes[product.assets.card] || [800, 800];
      return <li key={item.model} className="inquiry-list__item">
        <div className="inquiry-list__product">
          <SafeImage src={product.assets.card} alt="" width={width} height={height} />
          <div><Link to={item.source}>{item.model}</Link><p>{product.name}</p></div>
          <button className="inquiry-list__remove" type="button" aria-label={`Remove ${item.model} from inquiry`} onClick={() => onChange(items.filter(row => row.model !== item.model))}><X size={18} aria-hidden="true" /></button>
        </div>
        <div className="inquiry-list__fields">
          <div className="field">
            <label htmlFor={`${itemId}-quantity`}>Quantity <span>(pcs)</span></label>
            <input id={`${itemId}-quantity`} aria-label={`Quantity for ${item.model}`} type="text" inputMode="numeric" maxLength={7}
              data-inquiry-quantity="" value={item.quantity} onChange={event => change(item.model, 'quantity', event.target.value)}
              placeholder="Not specified" aria-invalid={invalidQuantity ? 'true' : undefined} aria-describedby={invalidQuantity ? `${itemId}-error` : undefined} />
            {invalidQuantity && <p className="field__error" id={`${itemId}-error`}>Use digits only (1–9999999), or leave blank.</p>}
          </div>
          <div className="field">
            <label htmlFor={`${itemId}-finish`}>Finish</label>
            <select id={`${itemId}-finish`} aria-label={`Finish for ${item.model}`} value={item.finishSlug} onChange={event => change(item.model, 'finishSlug', event.target.value)}>
              <option value="">Not specified</option>
              {product.finishes.map(finish => <option key={finish.slug} value={finish.slug}>{finish.name}</option>)}
            </select>
          </div>
        </div>
      </li>;
    })}</ul>
    <p className="inquiry-list__note">These model choices are saved in this page’s link; contact details are not. Changing product category clears the list. Finish availability is confirmed with your quotation.</p>
  </section>;
}
