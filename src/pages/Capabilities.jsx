import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { CompanyBreadcrumb, CompanyImage, CompanyLink, usePageMeta } from '../components/company/CompanyShared.jsx';
import { companyPhotos } from '../data/companyProfile.js';
import '../styles/capabilities.css';

const steps = [
  ['Define the brief', 'Share your market, model mix, target quantities and installation requirements.'],
  ['Configure the range', 'Review available finishes, wall plates, authorized branding and packaging.'],
  ['Approve the sample', 'Confirm appearance, function, model documentation and artwork before the order.'],
  ['Plan production', 'Agree on quantities, lead times, packing and delivery requirements for the selected models.']
];

const factoryStages = [
  {
    id: 'assembly', title: 'Assembly & automation', photo: companyPhotos.automatedAssembly,
    description: 'Components come together through hands-on assembly and dedicated equipment. Device construction, assembly steps and product identification follow the selected model.',
    note: 'Functional inspection is a separate stage, with dedicated GFCI and USB test stations.',
  },
  {
    id: 'aging', title: 'Aging tests', photo: companyPhotos.agingTests,
    description: 'Devices are connected to an aging-test rack. Test conditions and duration are confirmed for the relevant product.',
  },
  {
    id: 'laboratory', title: 'Laboratory verification', photo: companyPhotos.environmentalChamber,
    description: 'A temperature and humidity chamber supports product verification. Test requirements and certification coverage are model-specific.',
  },
];

const oemOptions = [
  ['Products & finishes', 'Select device families, electrical ratings, available colors and matching wall plates. Confirm combinations with actual samples.'],
  ['Branding & identification', 'Review authorized logos, product markings and artwork placement together with model-specific identification requirements.'],
  ['Packaging & instructions', 'Coordinate retail or neutral packaging, carton information and product literature around your distribution needs.'],
  ['Product development', 'Share requirements beyond the existing range so our team can assess technical feasibility, tooling and verification needs.'],
];

export default function Capabilities() {
  usePageMeta('Manufacturing & OEM / ODM', 'Explore FAHINT manufacturing, functional testing and private-label support for wiring devices. Review products, samples and model-specific documentation.');
  return <div className="company-page capabilities-page">
    <header className="cap-hero">
      <div className="cap-wrap">
        <CompanyBreadcrumb current="Manufacturing & OEM / ODM" />
        <div className="cap-hero__layout">
          <div className="cap-hero__copy">
            <h1>Your product.<br /><span>Our production.</span></h1>
            <p>From component assembly to product testing. Wiring-device manufacturing and OEM / ODM support, from our team in Wenzhou.</p>
            <CompanyLink to="/contact?topic=oem" light>Discuss your OEM / ODM project</CompanyLink>
          </div>
          <figure className="cap-hero__photo">
            <CompanyImage {...companyPhotos.deviceAssembly} priority />
            <figcaption><span>Component assembly</span><span>FAHINT workshop · Wenzhou, China</span></figcaption>
          </figure>
        </div>
        <nav className="cap-chapters" aria-label="Manufacturing sections">
          <Link to="/capabilities#production">Inside production <ArrowUpRight size={19} aria-hidden="true" /></Link>
          <Link to="/capabilities#oem">OEM / ODM <ArrowUpRight size={19} aria-hidden="true" /></Link>
          <Link to="/capabilities#process">Working with us <ArrowUpRight size={19} aria-hidden="true" /></Link>
        </nav>
      </div>
    </header>

    <section className="cap-section" id="production" aria-labelledby="production-title">
      <div className="cap-wrap">
        <div className="cap-intro">
          <h2 id="production-title">From assembly to verification.</h2>
          <p>Different stages, different equipment. A closer look at the work behind each device.</p>
        </div>
        <div className="cap-factory-stories">
          {factoryStages.map((stage, index) => <article key={stage.id} className={index === 0 ? 'cap-stage cap-stage--lead' : 'cap-stage'} aria-labelledby={'stage-' + stage.id}>
            <div className="cap-stage__photo"><CompanyImage {...stage.photo} /></div>
            <div className="cap-stage__copy">
              <h3 id={'stage-' + stage.id}>{stage.title}</h3>
              <p>{stage.description}</p>
              {stage.note && <p className="cap-stage__note">{stage.note}</p>}
              {index === 0 && <CompanyLink to="/#studio-making" secondary>See our testing stations</CompanyLink>}
            </div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="cap-section cap-oem" id="oem" aria-labelledby="oem-title">
      <div className="cap-wrap cap-oem__layout">
        <div>
          <div className="cap-intro">
            <h2 id="oem-title">Your range.<br />Down to the details.</h2>
            <p>Start with FAHINT product platforms. Then discuss the product, finish and presentation your market needs. Availability and customization are confirmed per model.</p>
          </div>
          <div className="cap-oem__options">
            {oemOptions.map(([title, description]) => <div key={title}><h3>{title}</h3><p>{description}</p></div>)}
          </div>
          <CompanyLink to="/contact?topic=oem" secondary>Send your requirements</CompanyLink>
        </div>
        <figure className="cap-oem__photo">
          <div><CompanyImage src="assets/images/products/gf15-package-standard-white-v1.jpg" alt="FAHINT GF15 retail packaging and white wall plate" width={800} height={800} /></div>
          <figcaption>FAHINT packaging example.<br />Private-label artwork requires authorization and approval.</figcaption>
        </figure>
      </div>
    </section>

    <section className="cap-section" id="process" aria-labelledby="process-title">
      <div className="cap-wrap cap-process__layout">
        <div className="cap-intro">
          <h2 id="process-title">From a product brief to an agreed order.</h2>
          <p>A clear approval path keeps product choices, documentation and delivery expectations aligned.</p>
          <p className="cap-process__note">Order quantities, sample arrangements and lead times are confirmed in your quotation. There is no single minimum or delivery promise for every product.</p>
        </div>
        <ol className="cap-process" aria-label="From brief to production">
          {steps.map(([title, description], index) => <li key={title}>
            <span className="cap-process__number" aria-hidden="true">0{index + 1}</span>
            <div><h3>{title}</h3><p>{description}</p></div>
          </li>)}
        </ol>
      </div>
    </section>

    <section className="cap-section cap-next" aria-labelledby="cap-next-title">
      <div className="cap-wrap cap-next__layout">
        <div className="cap-intro">
          <h2 id="cap-next-title">Bring us your product brief.</h2>
          <p>A new range, a private-label program or a model-specific question. Start with what your market needs.</p>
          <CompanyLink to="/contact?topic=oem" light>Start a project</CompanyLink>
        </div>
        <div className="cap-next__documents">
          <h3>Documentation for the model you choose.</h3>
          <p>Review the original UL product-family files and ISO 9001 quality-system document, then confirm the exact model, finish and construction for your order.</p>
          <p>A company certificate does not certify every product in the range.</p>
          <CompanyLink to="/about#certifications" secondary light>Review certificates</CompanyLink>
        </div>
      </div>
    </section>
  </div>;
}
