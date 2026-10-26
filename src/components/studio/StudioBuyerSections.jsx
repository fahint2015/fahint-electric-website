import { Link } from '../SiteLink.jsx';
import { ArrowUpRight, Download, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import CertCarousel from '../CertCarousel.jsx';
import Faq from '../Faq.jsx';
import InquiryForm from '../InquiryForm.jsx';
import { company, faqs } from '../../data/company.js';
import { productLines } from '../../data/lines.js';
import { catalogueDocument } from '../../data/catalogProducts.js';
import { publicAsset } from '../../utils/publicAsset.js';
import Reveal from '../Reveal.jsx';

// Keep document scope, contact information and delivery behavior shared with the
// existing website. This surface changes their presentation, not their claims.
export default function StudioBuyerSections() {
  return <>
    <section className="studio-certificates studio-space" id="studio-certificates" aria-labelledby="studio-certificates-title">
      <div className="studio-wrap">
        <Reveal as="header" className="studio-section-head">
          <h2 id="studio-certificates-title">Confidence,<br /> documented.</h2>
          <div><p>Review the original certificates, then check the exact model and its specifications. The details matter.</p><Link className="studio-text-link" to="/resources#certifications">Explore certification details <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
        </Reveal>
        <CertCarousel />
        <div className="studio-document-foot">
          <p>Certification coverage is model-specific. Preview the certificate or download its full PDF and model addendum before specifying.</p>
          <a className="studio-text-link" href={publicAsset(catalogueDocument)} download>Download product catalog <Download size={18} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
    <section className="studio-faq studio-space" id="studio-faq" aria-labelledby="studio-faq-title">
      <div className="studio-wrap studio-faq-layout">
        <Reveal className="studio-faq-intro">
          <h2 id="studio-faq-title">Before<br /> we begin.</h2>
          <p>A few answers to help with your next product order or private-label project.</p>
          <Link className="studio-text-link" to="#studio-inquiry">Have another question? <ArrowUpRight size={19} aria-hidden="true" /></Link>
        </Reveal>
        <Faq items={faqs} />
      </div>
    </section>
    <section className="studio-inquiry studio-space" id="studio-inquiry" aria-label="Send an inquiry">
      <div className="studio-wrap studio-inquiry-layout">
        <Reveal className="studio-inquiry-intro">
          <h2>Let’s make<br /><span>the right connection.</span></h2>
          <p>Choose FAHINT products or build a range with your own name. Tell us the product categories, quantities and market you have in mind.</p>
          <ul className="studio-contact-list">
            <li><Mail size={20} aria-hidden="true" /><div><span>Email</span><a href={`mailto:${company.email}`}>{company.email}</a></div></li>
            <li><Phone size={20} aria-hidden="true" /><div><span>Call our team</span><a href={`tel:${company.phone.replace(/\s/g, '')}`}>{company.phone}</a></div></li>
            <li><MessageCircle size={20} aria-hidden="true" /><div><span>Message us</span><a href={`https://wa.me/${company.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">WhatsApp <ArrowUpRight size={16} aria-hidden="true" /></a></div></li>
            <li><MapPin size={20} aria-hidden="true" /><div><span>Visit FAHINT</span><p>{company.location}</p></div></li>
          </ul>
          <p className="studio-contact-hours">{company.hours}</p>
        </Reveal>
        <div className="studio-inquiry-form"><InquiryForm title="Start your inquiry" categoryOptions={productLines} /></div>
      </div>
    </section>
  </>;
}
