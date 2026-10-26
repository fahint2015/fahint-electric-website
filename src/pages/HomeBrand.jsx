import React, { useEffect, useRef, useState } from 'react';
import { Link } from '../components/SiteLink.jsx';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { publicAsset } from '../utils/publicAsset.js';
import { staticMetadata } from '../seo/metadata.js';
import { usePageMetadata } from '../seo/usePageMetadata.js';
import Reveal from '../components/Reveal.jsx';
import StudioApplicationMap from '../components/studio/StudioApplicationMap.jsx';
import '../styles/brand-application-map.css';

const generated = publicAsset('assets/images/brand-home/generated/');
const revised = publicAsset('assets/images/brand-home/revised/');
const aboutGenerated = publicAsset('assets/images/brand-home/about/');
const heroes = [
  { id: 'belief', title: 'Safer Power. Better Living.', label: 'OUR BELIEF', image: 'hero-family-belief-background.png', mobile: 'hero-family-mobile.png', width: 1944, height: 809, alt: 'A family reading together in a bright contemporary home.' },
  { id: 'purpose', title: 'Designed Around People.', label: 'OUR PURPOSE', image: 'hero-hotel-purpose-background.png', mobile: 'hero-hotel-mobile.png', width: 1941, height: 810, alt: 'A guest opening curtains in a quiet hotel room overlooking the water.' },
  { id: 'vision', title: 'Better Spaces. Brighter Tomorrow.', label: 'OUR VISION', image: 'hero-city-vision-background.png', mobile: 'hero-city-mobile.png', width: 1940, height: 810, alt: 'An illuminated city and waterfront at blue hour.' }
];
const ranges = [
  { id: 'gfci-kitchen', name: 'GFCI Outlets', description: 'Self-test protection. 15A & 20A.', image: 'series-gfci-tabletop-v2.png', imageHeight: 864, alt: 'White FAHINT GF15 15A, GT20 20A TR and GW20 20A TR/WR GFCI outlets displayed on a dark blue tabletop.', links: [{ label: 'Explore GFCI', href: '/products/gfci' }] },
  { id: 'usb-charging', name: 'USB Outlets', description: 'USB-A, USB-C and fast charging.', image: 'series-usb-tabletop-v2.png', imageHeight: 864, alt: 'White FAHINT FTR15-3100 dual USB-A, FTR15C-3100 USB-A/USB-C and FTR15QC-DC65W dual USB-C outlets displayed on a dark blue tabletop.', links: [{ label: 'Explore USB outlets', href: '/products/usb-outlets' }] },
  { id: 'dimmer-lighting', name: 'Switches & Dimmers', description: 'Everyday lighting control.', image: 'series-switches-dimmers-tabletop-v2.png', imageHeight: 864, alt: 'White FAHINT DS15 paddle switch, DM2010 digital slide dimmer and DM2010S 0-10V dimmer displayed on a dark blue tabletop.', links: [{ label: 'Explore dimmers', href: '/products/dimmers' }, { label: 'View switches', href: '/products/lighting-switches' }] }
];
const spaces = [
  { id: 'residential', name: 'Residential', title: 'A little more comfort. Every day.', description: 'Protection, charging and lighting controls for the places we call home.', image: 'application-residential-scene.png', position: 'center', alt: 'A bright residential kitchen and dining area with navy cabinetry.', link: '/applications/residential', linkLabel: 'Explore residential' },
  { id: 'workplace', name: 'Workplace', title: 'Spaces that work with you.', description: 'Practical power and lighting choices for offices and shared spaces.', image: 'application-workplace-scene.png', position: 'center', alt: 'A bright modern workplace with shared desks and a meeting area.', link: '/applications/workplace', linkLabel: 'Explore workplace' },
  { id: 'hospitality', name: 'Hospitality', title: 'Thoughtful details. A warmer welcome.', description: 'Convenient charging and coordinated controls for a comfortable guest experience.', image: 'application-hospitality-scene.png', position: 'center', alt: 'A contemporary hotel lounge with navy seating and a quiet guest.', link: '/applications/hospitality', linkLabel: 'Explore hospitality' }
];
const webp = (file, folder = generated) => folder + file.replace(/\.png$/, '.webp');
const responsive = (file, width = 1536, folder = generated, breakpoints = [768, 1200]) => [...breakpoints.filter(size => size < width), width].map(size => `${folder}${file.replace(/\.png$/, size === width ? '.webp' : `-${size}.webp`)} ${size}w`).join(', ');

function TextLink({ to, children, className = '' }) {
  return <Link className={`text-link ${className}`} to={to}>{children}<ArrowRight size={19} strokeWidth={1.6} aria-hidden="true" /></Link>;
}

function Hero() {
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [visited, setVisited] = useState(new Set([0]));
  const root = useRef(null);
  useEffect(() => {
    const motion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!motion) return undefined;
    const syncMotion = () => setReduced(motion.matches);
    const syncVisibility = () => {
      const bounds = root.current.getBoundingClientRect();
      setVisible(!document.hidden && bounds.bottom > 0 && bounds.top < window.innerHeight);
    };
    syncMotion(); motion.addEventListener?.('change', syncMotion);
    document.addEventListener('visibilitychange', syncVisibility);
    const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && !document.hidden)) : null;
    observer?.observe(root.current);
    return () => { motion.removeEventListener?.('change', syncMotion); document.removeEventListener('visibilitychange', syncVisibility); observer?.disconnect(); };
  }, []);
  useEffect(() => { setVisited(value => new Set([...value, active])); }, [active]);
  useEffect(() => {
    if (focused || !visible || reduced) return undefined;
    const timer = window.setTimeout(() => setActive(value => (value + 1) % heroes.length), 8000);
    return () => window.clearTimeout(timer);
  }, [active, focused, visible, reduced]);
  return <section id="hero" className="hero" ref={root} aria-label="FAHINT brand story" aria-roledescription="carousel" onFocusCapture={event => setFocused(event.target.matches(':focus-visible'))} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <div className="hero-photographs">
      {heroes.map((hero, index) => visited.has(index) && <picture key={hero.id} className={`hero-photo hero-photo--${hero.id}${active === index ? ' is-active' : ''}`} aria-hidden={active !== index}>
        <source media="(max-width: 920px)" srcSet={responsive(hero.mobile, 1024, revised, [480, 768])} sizes="100vw" />
        <img src={webp(hero.image)} srcSet={responsive(hero.image, hero.width)} sizes="100vw" alt={active === index ? hero.alt : ''} width={hero.width} height={hero.height} fetchpriority={index === 0 ? 'high' : 'auto'} />
      </picture>)}
    </div>
    <div className="hero-copy"><div className="wrap hero-heading" aria-live={focused ? 'polite' : 'off'} aria-atomic="true">
      <Reveal as="h1" key={heroes[active].id}>{heroes[active].title}</Reveal>
    </div></div>
    <div className="wrap hero-controls">
      <div className="hero-selectors" role="group" aria-label="Choose brand story">
        {heroes.map((hero, index) => <button key={hero.id} type="button" aria-label={`Show ${hero.label.toLowerCase()}`} aria-pressed={active === index} className={active === index ? 'is-active' : ''} onClick={() => setActive(index)}>{String(index + 1).padStart(2, '0')}</button>)}
      </div>
      <Link className="hero-down" to="#about" aria-label="Discover FAHINT"><ArrowDown size={28} strokeWidth={1.4} /></Link>
    </div>
  </section>;
}

function About() {
  return <section id="about" className="about section wrap">
    <Reveal className="about-copy">
      <p className="eyebrow">ABOUT FAHINT</p>
      <h2>Power for everyday life.</h2>
      <p className="body-copy">FAHINT is a wiring device manufacturer in Wenzhou, China. Since 2015, we have developed GFCI outlets, USB wall outlets, switches and dimmers for North American markets, with OEM and ODM support for brands and distributors.</p>
      <div className="range-links"><TextLink to="/about">Discover our story</TextLink><TextLink to="/capabilities">Explore OEM / ODM</TextLink></div>
    </Reveal>
    <Reveal as="figure" className="about-photo" delay={100}><img src={webp('about-fahint-factory-v3.png', aboutGenerated)} srcSet={responsive('about-fahint-factory-v3.png', 1536, aboutGenerated)} sizes="(max-width: 640px) calc(100vw - 48px), (min-width: 2240px) 1022px, 44vw" alt="Factory exterior brand concept with FAHINT signage and the bilingual name of Wenzhou Fahint Electric Co.,Ltd." width="1536" height="1024" loading="lazy" /><figcaption>FAHINT · Brand vision</figcaption></Reveal>
  </section>;
}

export function WhyFahint({ showEyebrow = true }) {
  return <section id="why-fahint" className="why-fahint section" aria-labelledby="why-fahint-title">
    <div className="wrap">
      <Reveal className="section-heading"><div>{showEyebrow && <p className="eyebrow">WHY FAHINT</p>}<h2 id="why-fahint-title">Why choose FAHINT.</h2></div><p className="section-intro">Manufacturing behind the brand.</p></Reveal>
      <dl className="strength-stats">
        <Reveal><dt>Established</dt><dd>2015</dd></Reveal>
        <Reveal delay={80}><dt>Automated inspection lines</dt><dd>12</dd></Reveal>
        <Reveal delay={160}><dt>GFCI functional testing</dt><dd>100<span>%</span></dd></Reveal>
      </dl>
      <div className="certification-row">
        <div className="certification-intro"><p className="eyebrow">PRODUCT & QUALITY CERTIFICATIONS</p><TextLink to="/resources#certifications">Explore our standards</TextLink></div>
        <Link className="certification-entry" to="/resources?family=gfci&model=GF15">
          <span className="certification-mark certification-mark--ul"><img src={publicAsset('assets/images/brand-home/certification-marks/ul-official-marks.webp')} width="303" height="160" alt="UL Listed mark" loading="lazy" /></span>
          <span><strong>UL Listed</strong><span>GFCI product range</span></span>
        </Link>
        <Link className="certification-entry" to="/resources#quality-management">
          <span className="certification-mark"><img src={publicAsset('assets/images/brand-home/certification-marks/cqc-quality-mark.webp')} width="648" height="504" alt="China Quality Certification Centre" loading="lazy" /></span>
          <span><strong>ISO 9001:2015</strong><span>Quality management · CQC</span></span>
        </Link>
      </div>
    </div>
  </section>;
}

function Products() {
  return <section id="products" className="products section">
    <Reveal className="wrap section-heading"><h2>Products.</h2><TextLink to="/products">View all products</TextLink></Reveal>
    <div className="range-list">
      {ranges.map((range, index) => <article id={range.id} className={`range range--feature${index % 2 ? ' range--reverse' : ''}`} key={range.name}>
        <Reveal as={Link} className="range-photo" to={range.links[0].href} aria-label={range.links[0].label}><img src={webp(range.image, revised)} srcSet={responsive(range.image, 1536, revised)} sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 920px) calc(100vw - 80px), (min-width: 1920px) 850px, 50vw" alt={range.alt} width="1536" height={range.imageHeight || 1024} loading="lazy" /></Reveal>
        <Reveal className="range-copy" delay={100}><h3>{range.name}</h3><p className="body-copy">{range.description}</p><div className="range-links">{range.links.map((link, linkIndex) => <TextLink key={link.href} to={link.href} className={linkIndex === 0 ? 'button-link' : ''}>{link.label}</TextLink>)}</div></Reveal>
      </article>)}
    </div>
  </section>;
}

export function ApplicationTabs() {
  const [active, setActive] = useState(0);
  const scene = spaces[active];
  function keySelect(event, index) {
    let next;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % spaces.length;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + spaces.length - 1) % spaces.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = spaces.length - 1;
    if (next !== undefined) { event.preventDefault(); setActive(next); document.getElementById(`space-${spaces[next].id}`)?.focus(); }
  }
  return <section id="spaces" className="applications section">
    <Reveal className="wrap section-heading"><div><p className="eyebrow">SPACES WE POWER</p><h2>Applications.</h2></div></Reveal>
    <div className="applications-layout wrap">
      <div className="space-tabs" role="tablist" aria-label="Application environments" aria-orientation="horizontal">
        {spaces.map((space, index) => <button key={space.id} id={`space-${space.id}`} type="button" role="tab" aria-selected={active === index} aria-controls="space-panel" tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onMouseEnter={() => { if (window.matchMedia('(hover: hover)').matches && !document.activeElement?.closest('.space-tabs')) setActive(index); }} onKeyDown={event => keySelect(event, index)}><span>{space.name}</span><ArrowRight size={22} strokeWidth={1.6} aria-hidden="true" /></button>)}
      </div>
      <Reveal className="application-panel" id="space-panel" role="tabpanel" aria-labelledby={`space-${scene.id}`}>
        <div className="application-image"><img key={scene.id} src={webp(scene.image)} srcSet={responsive(scene.image)} sizes="(min-width: 2240px) 1920px, (max-width: 640px) calc(100vw - 48px), 84vw" style={{ objectPosition: scene.position }} alt={scene.alt} width="1536" height="1024" loading="lazy" /></div>
        <div className="space-story"><h3>{scene.title}</h3><div><p className="body-copy">{scene.description}</p><TextLink to={scene.link}>{scene.linkLabel}</TextLink></div></div>
      </Reveal>
    </div>
  </section>;
}

function Resources() {
  return <section id="support" className="support section wrap">
    <div className="section-heading"><div><p className="eyebrow">HERE TO HELP</p><h2>Resources & support.</h2></div></div>
    <div className="support-grid">
      <Reveal as="article" className="support-entry"><div><h3>Product resources.</h3><p>Product catalogues, technical documents and installation resources.</p></div><TextLink to="/resources" className="button-link">Browse resources</TextLink></Reveal>
      <Reveal as="article" className="support-entry support-entry--contact" delay={100}><div><h3>Talk with FAHINT.</h3><p>Discuss GFCI and USB outlet models, quantities, packaging and OEM or ODM requirements for your next range.</p></div><TextLink to="/contact" className="button-link button-link--light">Contact us</TextLink></Reveal>
    </div>
  </section>;
}

export default function HomeBrand() {
  usePageMetadata(staticMetadata['/']);
  return <div className="brand-home"><Hero /><About /><WhyFahint /><Products /><StudioApplicationMap imageSrc="assets/images/brand-home/rooms/residential-application-map-daylight-v1.webp" /><ApplicationTabs /><Resources /></div>;
}
