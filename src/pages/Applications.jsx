import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import BrandBanner, { BrandBreadcrumb } from '../components/BrandBanner.jsx';
import { publicAsset } from '../utils/publicAsset.js';
import { staticMetadata } from '../seo/metadata.js';
import { usePageMetadata } from '../seo/usePageMetadata.js';
import Reveal from '../components/Reveal.jsx';

const scenes = [
  { id:'residential', name:'Residential', description:'Power, charging and lighting for kitchens, bedrooms and living spaces.', image:'application-residential-scene', link:'/applications/residential', action:'Explore residential' },
  { id:'workplace', name:'Workplace', description:'Outlets and lighting controls for desks, meeting rooms and shared spaces.', image:'application-workplace-scene', link:'/applications/workplace', action:'Explore workplace' },
  { id:'hospitality', name:'Hospitality', description:'Convenient charging and coordinated controls for guest rooms and common areas.', image:'application-hospitality-scene', link:'/applications/hospitality', action:'Explore hospitality' }
];
export default function Applications() {
  usePageMetadata(staticMetadata['/applications']);
  return <div className="brand-applications">
    <BrandBanner title="Wiring devices for homes, workplaces and hotels." label="APPLICATIONS" description="Protection, charging and lighting control for everyday spaces." image="assets/images/brand-home/generated/application-residential-scene.webp" />
    <BrandBreadcrumb current="Applications" />
    <nav className="wrap brand-chapter-nav" aria-label="Application environments">{scenes.map(scene => <Link key={scene.id} to={scene.link}>{scene.name}</Link>)}</nav>
    {scenes.map((scene,index) => <Reveal as="section" id={scene.id} className={`brand-application section wrap${index%2 ? ' is-reversed':''}`} key={scene.id}>
      <figure><img src={publicAsset(`assets/images/brand-home/generated/${scene.image}.webp`)} srcSet={[768,1200,1536].map(width => `${publicAsset(`assets/images/brand-home/generated/${scene.image}${width===1536 ? '' : '-'+width}.webp`)} ${width}w`).join(', ')} sizes="(max-width: 760px) 90vw, 50vw" alt={`${scene.name} interior — FAHINT application concept.`} width="1536" height="1024" loading="lazy" /><figcaption>FAHINT application concept</figcaption></figure>
      <div className="brand-application-copy"><h2>{scene.name}.</h2><p className="body-copy">{scene.description}</p><Link className="text-link button-link" to={scene.link}>{scene.action} <ArrowRight size={19} aria-hidden="true" /></Link></div>
    </Reveal>)}
    <section className="section brand-application-support"><div className="wrap"><p className="eyebrow">YOUR NEXT PROJECT</p><h2>Find the right devices for your space.</h2><p className="body-copy">Build a room-by-room checklist for power, charging, controls and matching finishes.</p><div className="brand-application-links"><Link to="/blog/outlet-planning-by-room">Read the room-by-room outlet guide <ArrowRight size={19} aria-hidden="true" /></Link><Link to="/products">Explore all products <ArrowRight size={19} aria-hidden="true" /></Link></div></div></section>
  </div>;
}
