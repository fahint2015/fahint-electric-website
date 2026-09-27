import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CompanyBreadcrumb, CompanyClosing, CompanyImage, CompanyLink, usePageMeta } from '../components/company/CompanyShared.jsx';
import { companyPhotos } from '../data/companyProfile.js';

const steps = [
  ['Define the brief', 'Share your market, model mix, target quantities and installation requirements.'],
  ['Configure the range', 'Review available finishes, wall plates, authorized branding and packaging.'],
  ['Approve the sample', 'Confirm appearance, function, model documentation and artwork before the order.'],
  ['Plan production', 'Agree on quantities, lead times, packing and delivery requirements for the selected models.']
];

const factoryStages = [
  {
    id: 'assembly', title: 'Assembly & automation', photo: companyPhotos.automatedAssembly,
    description: 'Components come together through hands-on assembly and dedicated equipment. Device construction and assembly steps follow the selected model.',
    note: 'Functional inspection is a separate stage, with dedicated GFCI and USB test stations.',
    caption: 'Device assembly equipment · Rotary fixtures',
  },
  {
    id: 'aging', title: 'Aging tests', photo: companyPhotos.agingTests,
    description: 'Devices are connected to an aging-test rack. Test conditions and duration are confirmed for the relevant product.',
    note: 'Discuss the test plan for your selected model with our team.',
    caption: 'Aging-test rack · Connected devices',
  },
  {
    id: 'laboratory', title: 'Laboratory verification', photo: companyPhotos.environmentalChamber,
    description: 'A temperature and humidity chamber supports product verification. Review the applicable test requirements and supporting documents with our team.',
    note: 'Verification requirements and certification coverage are model-specific.',
    caption: 'Laboratory equipment · Temperature and humidity chamber',
  },
];

function FactoryTour() {
  const [active, setActive] = useState(0);
  const tabs = useRef([]);
  function navigate(event, index) {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % factoryStages.length;
    else if (event.key === 'ArrowLeft') next = (index + factoryStages.length - 1) % factoryStages.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = factoryStages.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }
  return <div className="company-factory-tour">
    <div className="company-factory-tabs" role="tablist" aria-label="Explore factory stages">
      {factoryStages.map((stage, index) => <button key={stage.id} ref={node => { tabs.current[index] = node; }} id={`factory-tab-${stage.id}`} type="button" role="tab" aria-selected={active === index} aria-controls={`factory-panel-${stage.id}`} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => navigate(event, index)}>{stage.title}</button>)}
    </div>
    {factoryStages.map((stage, index) => <div key={stage.id} id={`factory-panel-${stage.id}`} role="tabpanel" aria-labelledby={`factory-tab-${stage.id}`} tabIndex={0} hidden={active !== index} className="company-factory-panel">
      <figure><div className="company-factory-panel__image"><CompanyImage {...stage.photo} /></div><figcaption>{stage.caption}</figcaption></figure>
      <div className="company-factory-panel__copy"><h3>{stage.title}</h3><p>{stage.description}</p><p className="company-factory-panel__note">{stage.note}</p>{index === 0 && <CompanyLink to="/#studio-making" secondary>See our testing stations</CompanyLink>}</div>
    </div>)}
  </div>;
}

export default function Capabilities() {
  usePageMeta('Manufacturing & OEM / ODM', 'Explore FAHINT manufacturing, functional testing and private-label support for wiring devices. Review products, samples and model-specific documentation.');
  return <div className="company-page company-editorial company-capabilities">
    <header className="company-masthead company-masthead--dark company-editorial-opening">
      <div className="company-wrap">
        <CompanyBreadcrumb current="Manufacturing & OEM / ODM" />
        <div className="company-editorial-lead">
          <h1>Your product.<br /><span>Our production.</span></h1>
          <div><p>From component assembly to product testing. Wiring-device manufacturing and OEM / ODM support, from our team in Wenzhou.</p><div className="company-actions"><CompanyLink to="/contact?topic=oem" light>Discuss your OEM / ODM project</CompanyLink></div></div>
        </div>
      </div>
      <figure className="company-wide-photo company-wide-photo--assembly"><div className="company-wide-photo__frame"><CompanyImage {...companyPhotos.deviceAssembly} priority /></div><figcaption><span>Component assembly</span><span>FAHINT workshop · Wenzhou, China</span></figcaption></figure>
      <nav className="company-section-nav company-wrap" aria-label="Manufacturing sections"><Link to="#production">Inside production</Link><Link to="#oem">OEM / ODM</Link><Link to="#process">Working with us</Link></nav>
    </header>
    <section className="company-section" id="production" aria-labelledby="production-title">
      <div className="company-wrap">
        <div className="company-heading"><h2 id="production-title">From assembly<br /><span>to verification.</span></h2><p>Different stages, different equipment. Explore the work behind the range, with testing and documentation defined for each model.</p></div>
        <FactoryTour />
      </div>
    </section>
    <section className="company-section company-section--navy company-oem-chapter" id="oem" aria-labelledby="oem-title">
      <div className="company-wrap">
        <div className="company-heading"><h2 id="oem-title">Your range.<br /><span>Down to the details.</span></h2><p>Start with FAHINT product platforms. Then discuss the product, finish and presentation your market needs. Availability and customization requirements are confirmed per model.</p></div>
        <div className="company-oem-layout">
          <figure className="company-packaging"><CompanyImage src="assets/images/products/gf15-package-standard-white-v1.jpg" alt="FAHINT GF15 retail packaging and white wall plate" width={1000} height={1000} /><figcaption>FAHINT packaging example. Private-label artwork requires authorization and approval.</figcaption></figure>
          <div className="company-options">
            <div><h3>Products & finishes</h3><p>Select device families, electrical ratings, available colors and matching wall plates. Confirm combinations with actual samples.</p></div>
            <div><h3>Branding & identification</h3><p>Review authorized logos, product markings and artwork placement together with model-specific identification requirements.</p></div>
            <div><h3>Packaging & instructions</h3><p>Coordinate retail or neutral packaging, carton information and product literature around your distribution needs.</p></div>
            <div><h3>Product development</h3><p>Have a requirement beyond the existing range? Share the brief so our team can assess technical feasibility, tooling and verification needs.</p></div>
            <CompanyLink to="/contact?topic=oem" secondary light>Send your requirements</CompanyLink>
          </div>
        </div>
      </div>
    </section>
    <section className="company-section company-process-chapter" id="process" aria-labelledby="process-title">
      <div className="company-wrap"><div className="company-heading"><h2 id="process-title">From a product brief<br /><span>to an agreed order.</span></h2><p>A clear approval path keeps product choices, documentation and delivery expectations aligned.</p></div>
        <ol className="company-process" aria-label="From brief to production">{steps.map(([title, body], index) => <li key={title}><span className="company-step">0{index + 1}</span><h3>{title}</h3><p>{body}</p></li>)}</ol>
        <p className="company-process-note">Order quantities, sample arrangements and lead times are confirmed in your quotation. There is no single minimum or delivery promise for every product.</p>
      </div>
    </section>
    <section className="company-section"><div className="company-wrap company-heading"><div><h2>Documentation for<br /><span>the model you choose.</span></h2><p>Certification coverage is model-specific. Review the original certificate and addendum, then confirm the exact model, finish and construction for your order.</p></div><div className="company-document-callout"><h3>Check the details before you specify.</h3><p>Access original UL product-family files and the ISO 9001 quality-system document. A company certificate does not certify every product in the range.</p><CompanyLink to="/about#certifications" secondary>Review certificates</CompanyLink></div></div></section>
    <CompanyClosing title="Bring us your product brief." text="A new range, a private-label program or a model-specific question. Start with what your market needs." to="/contact?topic=oem" action="Start a project" />
  </div>;
}
