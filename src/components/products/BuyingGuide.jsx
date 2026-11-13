import { Link } from '../SiteLink.jsx';
import { ArrowUpRight } from 'lucide-react';
import Faq from '../Faq.jsx';
import { buyingGuides, modelDocumentationNote } from '../../data/buyingGuides.js';
import { findLine } from '../../data/lines.js';
import { findModelCertificate } from '../../data/certificates.js';
import { publicAsset } from '../../utils/publicAsset.js';
import '../../styles/buying-guide.css';

export function BuyingGuide({ line }) {
  const guide = buyingGuides[line];
  const family = findLine(line);
  const inquiry = guide.inquiry || { label: 'Discuss your selection', to: '/contact?topic=technical' };
  const questions = guide.questions.map(({ q, a }) => ({
    q,
    a: Array.isArray(a) ? a.map(part => typeof part === 'string' ? part : <Link key={part.to} to={part.to}>{part.label}</Link>) : a,
  }));
  return <section className="buying-guide" id="buying-guide" aria-label={`Buying guide: ${family.name}`}>
    <div className="container buying-guide__layout">
      <div className="buying-guide__intro">
        <p className="product-section-label">Before you choose</p>
        <h2>Choosing {family.name}.</h2>
        <p>{guide.intro}</p>
        <Link className="textlink" to={guide.resource.to}>{guide.resource.label} <ArrowUpRight size={16} aria-hidden="true" /></Link>
        {guide.relatedGuide && <Link className="textlink" to={guide.relatedGuide.to}>{guide.relatedGuide.label} <ArrowUpRight size={16} aria-hidden="true" /></Link>}
        <Link className="textlink quote-button" to={inquiry.to} data-quote-location="category_guide" data-quote-family={line}>{inquiry.label} <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div>
      <Faq items={questions} />
    </div>
  </section>;
}

export function ModelBuyingChecklist({ product }) {
  const guide = buyingGuides[product.line || 'gfci'];
  const certificate = findModelCertificate(product);
  return <section className="model-buying-checklist" aria-labelledby={`buying-${product.sku}`}>
    <h3 id={`buying-${product.sku}`}>Before you order {product.sku}</h3>
    <ul>
      <li><strong>Configuration.</strong> {guide.modelCheck}</li>
      <li><strong>Order breakdown.</strong> List quantities by finish, wallplate and packaging option, with the destination and requested timing.</li>
      <li><strong>Documentation.</strong> {modelDocumentationNote(product)}</li>
    </ul>
    <div className="model-buying-checklist__links">
      {certificate && <a className="textlink" href={publicAsset(certificate.document)} target="_blank" rel="noreferrer">View original certificate PDF <ArrowUpRight size={16} aria-hidden="true" /></a>}
      <Link className="textlink" to={guide.resource.to}>{guide.resource.label} <ArrowUpRight size={16} aria-hidden="true" /></Link>
    </div>
    <p>Sample arrangements, minimum quantities and lead times are confirmed in your quotation. Approve the sample and any authorized artwork before the order.</p>
  </section>;
}
