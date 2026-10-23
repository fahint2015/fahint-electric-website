import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Download, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productLines } from '../data/lines.js';
import { certificates } from '../data/certificates.js';
import { company } from '../data/company.js';
import { publicAsset } from '../utils/publicAsset.js';
import '../styles/home-next.css';

/* Independent preview, not a reskin of the classic homepage.
 * THESIS: a considered device collection, backed by an approachable manufacturer.
 * WORLD: incumbent Source Sans, ink navy, cool paper and restrained blue links.
 * STORY: discover the brand, explore a family, choose private label, inspect evidence.
 * FIRST VIEW: large dark-on-paper statement beside a complete product-family photograph.
 * SIGNATURE: a keyboard-operable collection selector connects each scene to its family.
 * Asset provenance: existing FAHINT website library; no products or claims generated here.
 */

const photo = (name) => publicAsset(`assets/images/editorial-home/${name}`);
const rangeStories = {
  gfci: { image: 'product-gfci-optimized.webp', size: [1600, 888], title: 'Protection, built into the wall.', copy: 'Explore self-test GFCI receptacles, with protection features and finishes specified for each model.' },
  'usb-outlets': { image: 'product-usb-optimized.webp', size: [1600, 889], title: 'A place to plug in. And recharge.', copy: 'Bring receptacle power and USB charging together. Compare port combinations and charging outputs for your project.' },
  receptacles: { image: 'product-receptacle-optimized.webp', size: [1600, 888], title: 'The everyday essentials, considered.', copy: 'Find duplex and decorator receptacles by rating, wiring method and finish, then pair them with a matching wall plate.' },
  dimmers: { image: 'category-switches-scene.webp', size: [1600, 900], title: 'Set the light. Change the room.', copy: 'Choose digital slide or 0–10V dimming controls, with load compatibility and ratings documented by model.' },
  'smart-switches': { image: 'product-smart-optimized.webp', size: [1600, 889], title: 'More ways to feel at home.', copy: 'Discover glass controls for Wi-Fi, Zigbee and touch operation. Check wiring and control functions for the selected version.' },
  'lighting-switches': { image: 'product-receptacle-optimized.webp', size: [1600, 888], title: 'A familiar touch. A coordinated finish.', copy: 'Paddle, toggle and combination switches give you options for the way a space is used.' },
  wallplates: { image: 'category-wallplates-scene.webp', size: [1600, 900], title: 'Finish the space, down to the plate.', copy: 'Coordinate devices with screwless and standard wall plates. Explore configurations, colors and surface finishes.' }
};

function Collection() {
  const [selected, setSelected] = useState(0);
  const [compact, setCompact] = useState(false);
  const tabRefs = useRef([]);
  const line = productLines[selected];
  const story = rangeStories[line.slug];

  useEffect(() => {
    const media = window.matchMedia?.('(max-width: 760px)');
    if (!media) return;
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  function selectFromKeyboard(event, index) {
    let next;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % productLines.length;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + productLines.length) % productLines.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = productLines.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    setSelected(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <section className="next-collection next-space" id="collection" aria-labelledby="next-collection-title">
      <div className="next-wrap">
        <header className="next-section-head">
          <h2 id="next-collection-title">Meet your next<br />everyday essential.</h2>
          <div><p>Seven product families. Explore the details that make a space work.</p><Link className="next-text-link" to="/products">Open the product catalog <ArrowUpRight size={19} /></Link></div>
        </header>
        <div className="next-range-explorer">
          <div className="next-range-tabs" role="tablist" aria-label="FAHINT product families" aria-orientation={compact ? 'horizontal' : 'vertical'}>
            {productLines.map((item, index) => (
              <button key={item.slug} ref={(node) => { tabRefs.current[index] = node; }} id={`range-tab-${item.slug}`} type="button" role="tab" aria-selected={selected === index} aria-controls="next-range-panel" tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={(event) => selectFromKeyboard(event, index)}>
                <span>{item.name}</span><ArrowRight size={20} aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className="next-range-panel" role="tabpanel" id="next-range-panel" aria-labelledby={`range-tab-${line.slug}`} tabIndex={0}>
            <div className="next-range-scene"><img key={story.image} src={photo(story.image)} alt={`${line.name} in a coordinated interior`} width={story.size[0]} height={story.size[1]} loading="lazy" decoding="async" /></div>
            <div className="next-range-description" key={line.slug}>
              <div><h3>{story.title}</h3><p>{story.copy}</p></div>
              <Link className="next-circle-link" to={`/products/${line.slug}`} aria-label={`Explore ${line.name}`}><ArrowUpRight size={24} /></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomeNext() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'FAHINT — New homepage preview';
    const existing = document.querySelector('meta[name="robots"]');
    const previousContent = existing?.getAttribute('content');
    const robots = existing || document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    if (!existing) document.head.appendChild(robots);
    return () => {
      document.title = previousTitle;
      if (!existing) robots.remove();
      else if (previousContent === null) robots.removeAttribute('content');
      else robots.setAttribute('content', previousContent);
    };
  }, []);

  return (
    <div className="home-next" data-home-version="next">
      <section className="next-hero" aria-labelledby="next-hero-title">
        <div className="next-wrap next-hero-layout">
          <div className="next-hero-copy">
            <h1 id="next-hero-title"><span>Considered design.</span> <span>Everyday power.</span></h1>
            <p>FAHINT outlets, switches and wall plates bring the details together. For the spaces you build. For the brand you’re building.</p>
            <div className="next-actions">
              <Link className="next-button" to="/products">Explore FAHINT products <ArrowRight size={19} /></Link>
              <Link className="next-text-link" to="/home-next#private-label">Create your own range <ArrowUpRight size={19} /></Link>
            </div>
            <div className="next-hero-note"><span>Wiring devices, from product to production.</span><Link to="/home-next#collection" aria-label="Discover the FAHINT collection"><ArrowDown size={22} /></Link></div>
          </div>
          <figure className="next-hero-image">
            <img src={photo('brand-system-family-final-optimized.webp')} alt="FAHINT GFCI and USB receptacles, wall switches and dimmers" width="1600" height="1600" fetchpriority="high" decoding="async" />
          </figure>
        </div>
      </section>

      <Collection />

      <section className="next-partner next-space" id="private-label" aria-labelledby="next-partner-title">
        <div className="next-wrap next-partner-layout">
          <figure className="next-partner-image"><img src={publicAsset('assets/images/editorial-products/gfci-oem-program-poster-v3-optimized.webp')} alt="FAHINT devices, finish samples and packaging reviewed on a workbench" width="1536" height="1024" loading="lazy" decoding="async" /><figcaption>Devices. Finishes. Packaging. Your choices, reviewed together.</figcaption></figure>
          <div className="next-partner-copy">
            <h2 id="next-partner-title">Your name.<br />Our manufacturing.</h2>
            <p>A private-label range should feel like your brand. Work with FAHINT to connect the right devices with the finishes, markings and packaging your market needs.</p>
            <dl className="next-deliverables">
              <div><dt>Start with the product</dt><dd>Select the device families, functions and ratings for your range.</dd></div>
              <div><dt>Make the details yours</dt><dd>Review available colors, wall plates and authorized brand artwork.</dd></div>
              <div><dt>Agree before production</dt><dd>Confirm samples, documentation, packaging and order requirements with our team.</dd></div>
            </dl>
            <Link className="next-button next-button--light" to="/contact?subject=Private-label%20range">Discuss a private-label project <ArrowRight size={19} /></Link>
            <Link className="next-text-link" to="/capabilities#oem">See OEM / ODM capabilities <ArrowUpRight size={18} /></Link>
          </div>
        </div>
      </section>

      <section className="next-making next-space" aria-labelledby="next-making-title">
        <div className="next-wrap">
          <header className="next-section-head">
            <h2 id="next-making-title">Behind the faceplate,<br />a working factory.</h2>
            <div><p>Visit the production side of FAHINT in Wenzhou, China. See the assembly and functional testing behind the devices in our collection.</p><Link className="next-text-link" to="/capabilities">Take a closer look at manufacturing <ArrowUpRight size={19} /></Link></div>
          </header>
          <figure className="next-factory-image"><img src={photo('factory-optimized.webp')} alt="The FAHINT production team at the GFCI comprehensive testing line" width="1600" height="900" loading="lazy" decoding="async" /><figcaption><span>Inside FAHINT</span><span>GFCI assembly &amp; functional testing · Wenzhou, China</span></figcaption></figure>
          <div className="next-making-links"><p>Meet the company behind your next order.</p><Link className="next-text-link" to="/about">About FAHINT <ArrowRight size={18} /></Link></div>
        </div>
      </section>

      <section className="next-evidence next-space" aria-labelledby="next-evidence-title">
        <div className="next-wrap next-evidence-layout">
          <div><h2 id="next-evidence-title">Know what<br />you’re specifying.</h2><p>Move from a product idea to an informed selection. Start with the catalog, then review the documentation for your exact model.</p><a className="next-button next-button--outline" href={publicAsset('assets/documents/fahint-product-catalog.pdf')} download>Download the FAHINT catalog <Download size={18} /></a></div>
          <div className="next-document-list">
            {[certificates[0], certificates[2], certificates[5]].map((cert) => <a key={cert.slug} href={publicAsset(cert.document)} target="_blank" rel="noreferrer"><div><strong>{cert.name}</strong><span>{cert.file} · Original PDF</span></div><ArrowUpRight size={24} aria-hidden="true" /></a>)}
            <p>Certification applies to the models named in each document. Check the complete scope and addendum before specifying.</p>
            <Link className="next-text-link" to="/resources#certifications">View the full certificate library <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      <section className="next-spaces next-space" aria-labelledby="next-spaces-title">
        <div className="next-wrap">
          <header className="next-section-head"><h2 id="next-spaces-title">Part of the room.<br />Part of the everyday.</h2><p>Bring power, charging and control into the places people live, stay and work. Explore the product options behind each setting.</p></header>
          <div className="next-space-grid">
            {[
              { title: 'At home', image: 'application-kitchen-v2-optimized.webp', copy: 'The kitchen counter. The bedside. The finishing touches.', to: '/products/gfci', label: 'Explore GFCI protection' },
              { title: 'Away from home', image: 'application-hotel-v2-optimized.webp', copy: 'Charging within reach in guest rooms and shared spaces.', to: '/products/usb-outlets', label: 'Explore in-wall charging' },
              { title: 'At work', image: 'application-commercial-v2-optimized.webp', copy: 'Device selections that begin with the project specification.', to: '/products/receptacles', label: 'Explore receptacles' }
            ].map((space) => <article key={space.title}><Link className="next-space-image" to={space.to} aria-label={space.label}><img src={photo(space.image)} alt={space.title} width="1600" height="900" loading="lazy" decoding="async" /></Link><h3>{space.title}</h3><p>{space.copy}</p><Link className="next-text-link" to={space.to}>{space.label} <ArrowRight size={17} /></Link></article>)}
          </div>
        </div>
      </section>

      <section className="next-conversation next-space" aria-labelledby="next-conversation-title">
        <div className="next-wrap next-conversation-layout">
          <div><h2 id="next-conversation-title">What are<br />you building next?</h2><p>A product order, a project specification or a range with your name on it. Tell us where you want to start.</p><Link className="next-button" to="/contact">Talk to FAHINT <ArrowRight size={19} /></Link><a className="next-conversation-email" href={`mailto:${company.email}`}>{company.email}</a></div>
          <div className="next-questions" aria-label="Planning your inquiry">
            <details open><summary>Buying FAHINT products <Plus size={20} aria-hidden="true" /></summary><p>Send the models, quantities and destination you have in mind. We will confirm available finishes, order requirements and lead times in your quotation.</p><Link className="next-text-link" to="/products">Find a model <ArrowRight size={17} /></Link></details>
            <details><summary>Building a private-label range <Plus size={20} aria-hidden="true" /></summary><p>Share your target market and product mix, along with any finish, logo and packaging requirements. Artwork and samples are reviewed before production.</p><Link className="next-text-link" to="/contact">Send your project brief <ArrowRight size={17} /></Link></details>
            <details><summary>Reviewing a specification <Plus size={20} aria-hidden="true" /></summary><p>Tell us the application, rating and model you are considering. We can help you locate the relevant product information and certification references.</p><Link className="next-text-link" to="/contact">Ask a product question <ArrowRight size={17} /></Link></details>
          </div>
        </div>
      </section>
      {import.meta.env.DEV && <nav className="next-preview" aria-label="Homepage version preview"><span>New homepage preview</span><Link to="/">View retained classic homepage <ArrowUpRight size={16} /></Link></nav>}
    </div>
  );
}
