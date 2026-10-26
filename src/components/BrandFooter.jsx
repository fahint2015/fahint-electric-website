import { useLocation } from 'react-router-dom';
import { Link } from './SiteLink.jsx';
import { ArrowUp, Mail, Phone } from 'lucide-react';
import { company } from '../data/company.js';
import { productLines } from '../data/lines.js';
import { publicAsset } from '../utils/publicAsset.js';
import { normalizePathname } from '../utils/prerender.js';
import Reveal from './Reveal.jsx';
import { socialProfiles } from '../data/socialProfiles.js';


export default function BrandFooter() {
  const { pathname, search } = useLocation();
  return <footer className="footer"><div className="wrap footer-main">
    <Reveal className="footer-brand">
      <Link to="/" aria-label="FAHINT home"><img className="footer-logo" src={publicAsset('assets/images/brand/fahint-logo-navy.webp')} alt="FAHINT" width="180" height="31" loading="lazy" /></Link>
      <div className="footer-contact-details">
        <a href={`tel:${company.phone.replace(/\s/g, '')}`}><Phone size={20} aria-hidden="true" /><span>{company.phone}</span></a>
        <a href={`mailto:${company.email}`}><Mail size={20} aria-hidden="true" /><span>{company.email}</span></a>
      </div>
      <div className="footer-socials" role="group" aria-label="Follow FAHINT">
        {socialProfiles.map(({ name, icon, href }) => <a key={icon} href={href} target="_blank" rel="noopener noreferrer" aria-label={`FAHINT on ${name} (opens in a new tab)`} title={name}>
          <img src={publicAsset(`assets/icons/social/${icon}.svg`)} alt="" width="22" height="22" loading="lazy" />
        </a>)}
      </div>
    </Reveal>
    <Reveal delay={60}><h3>Products</h3>{productLines.map(line => <Link key={line.slug} to={`/products/${line.slug}`}>{line.name}</Link>)}</Reveal>
    <Reveal delay={120}><h3>FAHINT</h3><Link to="/about">About us</Link><Link to="/applications">Applications</Link><Link to="/capabilities">Manufacturing</Link><Link to="/capabilities#oem">OEM &amp; ODM</Link><Link to="/blog">News &amp; insights</Link></Reveal>
    <Reveal delay={180}><h3>Connect</h3><Link to="/resources">Resources</Link><Link to="/contact">Contact us</Link><p>{company.location}</p></Reveal>
  </div><div className="wrap footer-bottom"><span>© {new Date().getFullYear()} {company.name}</span><Link to={{ pathname:normalizePathname(pathname), search, hash:'#main-content' }}>Back to top <ArrowUp size={14} aria-hidden="true" /></Link></div></footer>;
}
