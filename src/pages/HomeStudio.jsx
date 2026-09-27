import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { company } from '../data/company.js';
import { companyPhotos } from '../data/companyProfile.js';
import { studioRanges } from '../data/studioCatalog.js';
import { StudioImage, StudioLink, useStudioPageMeta } from '../components/studio/StudioShared.jsx';
import StudioBuyerSections from '../components/studio/StudioBuyerSections.jsx';
import StudioApplicationMap from '../components/studio/StudioApplicationMap.jsx';
import StudioProductSelection from '../components/studio/StudioProductSelection.jsx';
import Reveal from '../components/Reveal.jsx';
import '../styles/studio.css';

/* Published homepage — earlier designs remain available only for local review.
 * THESIS: an architectural wiring-device brand with a visible manufacturing backbone.
 * WORLD: FAHINT Source Sans 3, ink navy, cool white, functional blue, real device photography.
 * STORY: a device in its room → the collection → the brand and company → your own range → factory evidence.
 * FIRST VIEW: full-bleed interior, a large quiet statement and an actionable product label.
 * FORM: code-led, surface seed 8b58929a; editorial image scale and asymmetrical pacing, not a repeated card stack.
 * References: Vibia/Plusminus editorial case (Eva Sánchez/Réplica); Mara product/space catalogue via Siteinspire.
 * All imagery below is from the existing FAHINT library; no model geometry or facts generated.
 */
const scenes = [
  { label: 'Kitchen essentials', line: 'gfci', name: 'GFCI Outlets', image: 'home-hero-kitchen-scene-v2.webp', alt: 'White FAHINT GFCI outlet installed beside a warmly lit kitchen' },
  { label: 'Bedside charging', line: 'usb-outlets', name: 'USB Outlets', image: 'home-hero-bedside-scene-v2.webp', alt: 'White FAHINT USB charging outlet installed beside a bed' },
  { label: 'Lighting control', line: 'dimmers', name: 'Dimmers', image: 'home-hero-lighting-scene-v3.webp', alt: 'White FAHINT slide dimmer installed in a softly lit living room' }
];
const HERO_ROTATION_MS = 5000;
const programSteps = [
  { title: 'Select your products', text: 'Choose models, ratings and finishes for your market and applications.' },
  { title: 'Make the details yours', text: 'Coordinate colors, wall plates, authorized artwork and packaging.' },
  { title: 'Review the sample', text: 'Check appearance, function and model documentation before approval.' },
  { title: 'Confirm production', text: 'Confirm order quantities and lead times for your selected models.' }
];

function RoomHero() {
  const heroRef = useRef(null);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(() => typeof document === 'undefined' || !document.hidden);
  const [reducedMotion, setReducedMotion] = useState(() => (
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  ));
  const paused = hovered || focusWithin || !heroVisible || !pageVisible || reducedMotion;

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setReducedMotion(media.matches);
    updateMotionPreference();
    media.addEventListener?.('change', updateMotionPreference);
    return () => media.removeEventListener?.('change', updateMotionPreference);
  }, []);

  useEffect(() => {
    if (typeof window.IntersectionObserver !== 'function' || !heroRef.current) return undefined;
    const observer = new window.IntersectionObserver(([entry]) => {
      setHeroVisible(entry.isIntersecting);
    }, { threshold: 0.05 });
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updatePageVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', updatePageVisibility);
    return () => document.removeEventListener('visibilitychange', updatePageVisibility);
  }, []);

  useEffect(() => {
    if (paused) return undefined;
    const timeout = window.setTimeout(() => {
      setActive((current) => (current + 1) % scenes.length);
    }, HERO_ROTATION_MS);
    return () => window.clearTimeout(timeout);
  }, [active, paused]);

  return <section
    ref={heroRef}
    className={`studio-hero${paused ? ' is-paused' : ''}`}
    aria-labelledby="studio-hero-title"
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocusWithin(true)}
    onBlurCapture={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false);
    }}
  >
    <div className="studio-hero__photo" id="studio-room-scene">
      {scenes.map((item, index) => <StudioImage key={item.line} src={`assets/images/editorial-products/${item.image}`} alt={item.alt} width={1536} height={1024} priority={index === 0} className={index === active ? 'is-current' : ''} aria-hidden={index !== active} />)}
    </div>
    <div className="studio-wrap studio-hero__layout">
      <div className="studio-hero__copy">
        <p className="studio-hero__identity">FAHINT <span aria-hidden="true">/</span> North American wiring devices</p>
        <h1 id="studio-hero-title"><span className="studio-hero__opening">Wiring devices.</span>{' '}<span className="studio-hero__continuation">Built for your market.</span></h1>
        <p className="studio-hero__summary">Explore outlets, switches and wall plates for homes and commercial spaces.<span className="studio-hero__program-summary"> Choose FAHINT products, or work with us on your own brand.</span></p>
        <div className="studio-hero__paths">
          <div role="group" aria-labelledby="studio-project-path">
            <span id="studio-project-path">For your projects</span>
            <StudioLink to="/products" light>Explore FAHINT products</StudioLink>
          </div>
          <div role="group" aria-labelledby="studio-brand-path">
            <span id="studio-brand-path">For your brand</span>
            <Link className="studio-hero__secondary" to="/#studio-oem">Build a range with us <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
        <ul className="studio-hero__evidence" aria-label="Product and program support">
          <li><Check size={16} aria-hidden="true" />{studioRanges.length} product families</li>
          <li className="studio-hero__evidence-detail"><Check size={16} aria-hidden="true" />Model-specific documentation</li>
          <li><Check size={16} aria-hidden="true" />OEM / ODM support</li>
        </ul>
      </div>
      <div className="studio-hero__bottom">
        <div className="studio-scene-switch" aria-label="Choose an application scene">
          {scenes.map((item, index) => <button type="button" key={item.line} aria-pressed={active === index} aria-controls="studio-room-scene" onClick={() => setActive(index)}>{item.label}</button>)}
        </div>
      </div>
    </div>
  </section>;
}

function BrandIntroduction() {
  // Perspective-corrected version of the supplied FAHINT sample-room photograph.
  return <section className="studio-brand" id="studio-brand" aria-labelledby="studio-brand-title">
    <figure className="studio-brand-visual">
      <StudioImage src="assets/images/company/fahint-showroom-front-v1.webp" alt="FAHINT product display wall in the sample showroom, with corrected perspective" width={1920} height={1080} />
      <figcaption><strong>Inside FAHINT</strong><span>Sample showroom · Wenzhou, China</span></figcaption>
    </figure>
    <div className="studio-wrap studio-brand-layout">
      <Reveal className="studio-brand-panel" delay={120}>
        <h2 id="studio-brand-title">Everyday power.<br /><span>Made by FAHINT.</span></h2>
        <div className="studio-company-summary">
          <h3>{company.name}</h3>
          <p>Based in Wenzhou, China, we develop and manufacture wiring devices for the North American market, bringing product development, manufacturing and quality control together.</p>
        </div>
        <div className="studio-brand-details">
          <dl className="studio-brand-paths">
            <div><dt>FAHINT products</dt><dd>Explore our range for your next project or product order.</dd></div>
            <div><dt>Your brand, our manufacturing</dt><dd>Create an OEM/ODM range with coordinated products, finishes and packaging.</dd></div>
          </dl>
          <div className="studio-brand-actions">
            <StudioLink to="/about" light>Get to know FAHINT</StudioLink>
            <Link className="studio-text-link" to="/#studio-oem">Explore OEM / ODM <ArrowUpRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
      </Reveal>
    </div>
  </section>;
}

function PrivateLabel() {
  return <section className="studio-oem studio-space" id="studio-oem" aria-labelledby="studio-oem-title">
    <div className="studio-wrap">
      <Reveal as="header" className="studio-section-head studio-section-head--oem">
        <h2 id="studio-oem-title">Your product range.<br /><span>Our manufacturing.</span></h2>
        <div><p>Choose the products, finishes and packaging for your market. We coordinate the details from your first brief to the approved order.</p></div>
      </Reveal>
      <div className="studio-program">
        <figure className="studio-program__image">
          {/* Generated scene referenced only the original GF15 main, FTR15C-3100 white and DS15 white product photographs. */}
          <StudioImage src="assets/images/editorial-products/oem-fahint-product-samples-v1.webp" alt="FAHINT GF15 GFCI, FTR15C-3100 USB outlet and DS15 paddle switch in a sample-packaging concept" width={1536} height={1024} />
          <figcaption>Product and packaging concept · GF15 / FTR15C-3100 / DS15</figcaption>
        </figure>
        <div className="studio-program__steps">
          <ol className="studio-process" aria-label="OEM / ODM process">
            {programSteps.map((step, index) => <li key={step.title}>
              <span className="studio-process__number" aria-hidden="true">0{index + 1}</span>
              <div><h3>{step.title}</h3><p>{step.text}</p></div>
            </li>)}
          </ol>
          <div className="studio-program-actions">
            <StudioLink to="/#studio-inquiry" light>Discuss your OEM / ODM project</StudioLink>
            <Link className="studio-text-link" to="/capabilities#oem">Explore OEM / ODM capabilities <ArrowUpRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
      </div>
    </div>
  </section>;
}

function Manufacturing() {
  return <section className="studio-making studio-space" id="studio-making" aria-labelledby="studio-making-title">
      <div className="studio-wrap">
        <div className="studio-testing-feature">
          <figure className="studio-testing-primary">
            <div className="studio-factory-stage"><div className="studio-factory-photo"><StudioImage {...companyPhotos.gfciTesting} /></div></div>
            <figcaption><h3>GFCI functional testing</h3><p>Dedicated test stations and device fixtures · Wenzhou, China</p></figcaption>
          </figure>
          <Reveal as="header" className="studio-section-head studio-testing-intro">
            <h2 id="studio-making-title">Testing<br /><span>you can see.</span></h2>
            <p>A closer look at the checks behind the device. Our GFCI functional testing stations are a separate stage from component assembly.</p>
            <Link className="studio-text-link" to="/capabilities#production">Inside our manufacturing <ArrowUpRight size={19} aria-hidden="true" /></Link>
          </Reveal>
        </div>
        <div className="studio-testing-support">
          <figure className="studio-testing-usb"><StudioImage {...companyPhotos.usbTesting} /><figcaption><h3>USB charging tests</h3><p>A dedicated bench for charging and electrical checks on USB outlet models.</p></figcaption></figure>
          <div className="studio-testing-note"><h3>Model-specific checks</h3><p>Confirm the test requirements, electrical ratings and certification coverage for your selected device.</p><Link className="studio-text-link" to="/#studio-certificates">Review model certificates <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
        </div>
      </div>
    </section>;
}

export default function HomeStudio() {
  useStudioPageMeta('Wiring Devices & OEM/ODM Manufacturing', 'FAHINT develops and manufactures North American wiring devices, with seven product families and OEM/ODM support for brands, distributors and project buyers.');
  return <div className="studio-page studio-home" data-home-version="studio">
    <RoomHero />
    <div className="studio-product-transition">
      <StudioImage className="studio-product-transition__scene" src="assets/images/home-installations/home-interior-background-v1.webp" alt="" aria-hidden="true" width={1672} height={941} />
      <nav className="studio-chapter-nav" aria-label="Homepage sections">
        <Link to="/#studio-collection">The collection</Link>
        <Link to="/#studio-brand">About FAHINT</Link>
        <Link to="/#studio-oem">OEM / ODM</Link>
        <Link to="/#studio-making">Inside FAHINT</Link>
        <Link to="/#studio-certificates">Certificates</Link>
        <Link to="/#studio-inquiry">Let’s talk <ArrowUpRight size={17} aria-hidden="true" /></Link>
      </nav>
      <StudioProductSelection />
    </div>
    <StudioApplicationMap />
    <div className="studio-brand-transition">
      <div className="studio-wrap"><span>Inside FAHINT</span></div>
    </div>
    <BrandIntroduction /><PrivateLabel /><Manufacturing /><StudioBuyerSections />
  </div>;
}
