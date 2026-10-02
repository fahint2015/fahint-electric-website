import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Faq from '../Faq.jsx';
import { buyingGuides, modelDocumentationNote } from '../../data/buyingGuides.js';
import { findLine } from '../../data/lines.js';
import '../../styles/buying-guide.css';

export function BuyingGuide({ line }) {
  const guide = buyingGuides[line];
  const family = findLine(line);
  return <section className="buying-guide" id="buying-guide" aria-label={`Buying guide: ${family.name}`}>
    <div className="container buying-guide__layout">
      <div className="buying-guide__intro">
        <p className="product-section-label">Before you choose</p>
        <h2>Choosing {family.name}.</h2>
        <p>{guide.intro}</p>
        <Link className="textlink" to={guide.resource.to}>{guide.resource.label} <ArrowUpRight size={16} aria-hidden="true" /></Link>
        <Link className="textlink" to="/contact?topic=technical">Discuss your selection <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div>
      <Faq items={guide.questions} />
    </div>
  </section>;
}

export function ModelBuyingChecklist({ product }) {
  const guide = buyingGuides[product.line || 'gfci'];
  return <section className="model-buying-checklist" aria-labelledby={`buying-${product.sku}`}>
    <h3 id={`buying-${product.sku}`}>Before you order {product.sku}</h3>
    <ul>
      <li><strong>Configuration.</strong> {guide.modelCheck}</li>
      <li><strong>Order breakdown.</strong> List quantities by finish, wallplate and packaging option, with the destination and requested timing.</li>
      <li><strong>Documentation.</strong> {modelDocumentationNote(product)}</li>
    </ul>
    <p>Sample arrangements, minimum quantities and lead times are confirmed in your quotation. Approve the sample and any authorized artwork before the order.</p>
  </section>;
}
