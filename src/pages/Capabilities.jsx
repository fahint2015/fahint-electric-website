import BrandBanner from '../components/BrandBanner.jsx';
import Reveal from '../components/Reveal.jsx';
import { Link } from '../components/SiteLink.jsx';
import { ArrowUpRight } from 'lucide-react';
import { CompanyBreadcrumb, CompanyImage, CompanyLink, usePageMeta } from '../components/company/CompanyShared.jsx';
import { capabilitiesPhotos } from '../data/capabilitiesPhotos.js';
import '../styles/capabilities.css';

const steps = [
  ['Define the brief', 'Send the model list, quantity by finish, destination and intended application. Identify the specifications and documents your market requires.'],
  ['Configure the range', 'Review the exact device, matching wallplate, authorized brand artwork and packaging. Confirm feasibility and any changes in writing.'],
  ['Approve the sample', 'Compare the sample with the agreed specification, model documents, markings and pack artwork. Resolve differences before approving the order.'],
  ['Plan production', 'Confirm quantities, lead times, packing and shipping terms in the quotation. Agree on inspection requirements and the documents to accompany the order.']
];

const factoryStages = [
  {
    id: 'assembly', title: 'Component assembly', photo: capabilitiesPhotos.assembly,
    description: 'Circuit boards and device components are assembled at dedicated workstations. The construction and assembly steps follow the selected model.',
  },
  {
    id: 'testing', title: 'GFCI functional testing', photo: capabilitiesPhotos.testing,
    description: 'Dedicated stations check GFCI functions, separate from component assembly. Confirm the inspection requirements for the model you choose.',
    link: { to: '/capabilities#production', label: 'See our testing stations' },
  },
  {
    id: 'laboratory', title: 'Laboratory verification', photo: capabilitiesPhotos.laboratory,
    description: 'Bench instruments support electrical verification. The test plan, supporting records and certification scope are confirmed for each model.',
  },
];

const oemOptions = [
  ['Products & finishes', 'Build your range from GFCI outlets, USB charging outlets, receptacles, switches, dimmers and wallplates. Confirm electrical ratings, available finishes and combinations with actual samples.'],
  ['Branding & identification', 'Review authorized logos, product markings and artwork placement together with model-specific identification requirements.'],
  ['Packaging & instructions', 'Review OEM packaging for each wiring-device model: retail or neutral packs, carton information, instructions and authorized artwork. Confirm the agreed pack format with the sample.'],
  ['Product development', 'Share requirements beyond the existing range so our team can assess technical feasibility, tooling and verification needs.'],
];

export default function Capabilities() {
  usePageMeta('Manufacturing & OEM / ODM', 'Explore FAHINT manufacturing, functional testing and private-label support for wiring devices. Review products, samples and model-specific documentation.');
  return <div className="company-page capabilities-page">
    <BrandBanner title={<>Your product.<br /><span>Our production.</span></>} label="MANUFACTURING & OEM / ODM" description="Wiring-device manufacturing and OEM / ODM support for brands and distributors. Review product selection, assembly, testing and private-label packaging with our Wenzhou team." image={capabilitiesPhotos.workshop.src} width={capabilitiesPhotos.workshop.width} height={capabilitiesPhotos.workshop.height} alt={capabilitiesPhotos.workshop.alt}><CompanyLink to="/contact?topic=oem" light>Discuss your OEM / ODM project</CompanyLink></BrandBanner>
    <header className="cap-hero"><div className="cap-wrap"><CompanyBreadcrumb current="Manufacturing & OEM / ODM" />
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
          {factoryStages.map(stage => <Reveal as="article" key={stage.id} className="cap-stage" aria-labelledby={'stage-' + stage.id}>
            <div className="cap-stage__photo"><CompanyImage {...stage.photo} /></div>
            <div className="cap-stage__copy">
              <h3 id={'stage-' + stage.id}>{stage.title}</h3>
              <p>{stage.description}</p>
              {stage.link && <CompanyLink to={stage.link.to} secondary>{stage.link.label}</CompanyLink>}
            </div>
          </Reveal>)}
        </div>
        <p className="cap-photo-note">AI-refined from FAHINT factory photographs. For test records and model documentation, please contact our team.</p>
      </div>
    </section>

    <section className="cap-section cap-oem" id="oem" aria-labelledby="oem-title">
      <div className="cap-wrap cap-oem__layout">
        <div>
          <div className="cap-intro">
            <h2 id="oem-title">OEM wiring devices.<br />Built around your range.</h2>
            <p>Plan private-label electrical outlets, switches and wallplates for your market. Compare our <Link to="/products/gfci">GFCI outlets</Link> and <Link to="/products/usb-outlets">USB charging outlets</Link>, then confirm finishes, authorized markings and packaging for each model.</p>
          </div>
          <div className="cap-oem__options">
            {oemOptions.map(([title, description]) => <div key={title}><h3>{title}</h3><p>{description}</p></div>)}
          </div>
          <p><Link to="/products/gfci">Compare GFCI outlet models</Link> or <Link to="/products/usb-outlets">explore USB wall outlets</Link> to prepare your shortlist.</p>
          <CompanyLink to="/contact?topic=oem" secondary>Send your requirements</CompanyLink>
        </div>
        <Reveal as="figure" className="cap-oem__photo">
          <div><CompanyImage src="assets/images/products/gf15-package-standard-white-v1.jpg" alt="FAHINT GF15 retail packaging and white wall plate" width={800} height={800} /></div>
          <figcaption>FAHINT packaging example.<br />Private-label artwork requires authorization and approval.</figcaption>
        </Reveal>
      </div>
    </section>

    <section className="cap-section" id="process" aria-labelledby="process-title">
      <div className="cap-wrap cap-process__layout">
        <div className="cap-intro">
          <h2 id="process-title">From a product brief to an agreed order.</h2>
          <p>A clear approval path keeps product choices, documentation and delivery expectations aligned.</p>
          <h3>What to include in your brief</h3>
          <ul className="cap-brief-list" aria-label="OEM quotation checklist">
            <li>Model numbers and quantities by finish or configuration.</li>
            <li>Destination, intended application and required model documents.</li>
            <li>Wallplate choice, packaging format and authorized brand artwork.</li>
            <li>Sample requirements and your requested delivery window.</li>
          </ul>
          <p className="cap-process__note">Order quantities, sample arrangements and lead times are confirmed in your quotation. There is no single minimum or delivery promise for every product.</p>
          <CompanyLink to="/blog/how-to-source-ul-listed-gfci-from-china" secondary>Read the sourcing checklist</CompanyLink>
        </div>
        <ol className="cap-process" aria-label="From brief to production">
          {steps.map(([title, description], index) => <Reveal as="li" key={title} delay={index * 60}>
            <span className="cap-process__number" aria-hidden="true">0{index + 1}</span>
            <div><h3>{title}</h3><p>{description}</p></div>
          </Reveal>)}
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
          <CompanyLink to="/resources#certifications" secondary light>Review certificates</CompanyLink>
        </div>
      </div>
    </section>
  </div>;
}
