import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronDown, Menu, X, House, Building2, BedDouble } from 'lucide-react';
import { productLines } from '../data/lines.js';
import { publicAsset } from '../utils/publicAsset.js';
import { normalizePathname } from '../utils/prerender.js';

export default function BrandHeader() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const productsOpen = dropdown === 'products';
  const applicationsOpen = dropdown === 'applications';
  const menuRef = useRef(null);
  const productsRef = useRef(null);
  const applicationsRef = useRef(null);
  const headerRef = useRef(null);
  const { pathname, search, hash } = useLocation();
  useEffect(() => { setOpen(false); setDropdown(null); }, [pathname, hash]);
  useEffect(() => {
    function close(event) {
      if (event.key !== 'Escape') return;
      if (dropdown) { setDropdown(null); (productsOpen ? productsRef : applicationsRef).current?.focus(); }
      else if (open) { setOpen(false); menuRef.current?.focus(); }
    }
    function outside(event) {
      if (!headerRef.current?.contains(event.target)) { setOpen(false); setDropdown(null); }
    }
    document.addEventListener('keydown', close);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', close); document.removeEventListener('pointerdown', outside); };
  }, [open, dropdown, productsOpen]);
  return <>
    <Link to={{ pathname:normalizePathname(pathname), search, hash:'#main-content' }} className="skip-link">Skip to content</Link>
    <header className="header" ref={headerRef}>
      <div className="wrap header-inner">
        <Link to="/" aria-label="FAHINT home"><img src={publicAsset('assets/images/brand/fahint-logo-navy.webp')} alt="FAHINT" width="180" height="31" /></Link>
        <nav id="main-navigation" className={open ? 'navigation is-open' : 'navigation'} aria-label="Main navigation">
          <div className="product-navigation" onMouseEnter={() => { if (window.matchMedia?.('(min-width: 1081px) and (hover: hover)').matches) setDropdown('products'); }} onMouseLeave={event => { if (window.matchMedia?.('(min-width: 1081px) and (hover: hover)').matches && !event.currentTarget.contains(document.activeElement)) setDropdown(null); }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setDropdown(null); }}>
            <div className="product-navigation-trigger"><NavLink to="/products">Products</NavLink><button ref={productsRef} type="button" aria-label="Toggle product series" aria-expanded={productsOpen} aria-controls="product-series-menu" onClick={() => setDropdown(productsOpen ? null : 'products')}><ChevronDown size={14} aria-hidden="true" /></button></div>
            {productsOpen && <div id="product-series-menu" className="product-menu is-open">
              <div className="brand-menu-heading"><span>Our product series</span><Link to="/products">View all products <ArrowRight size={17} aria-hidden="true" /></Link></div>
              <div className="brand-menu-grid">{productLines.map(line => <Link key={line.slug} to={`/products/${line.slug}`}><img src={publicAsset(`assets/images/brand-home/catalog-products/${line.slug}-menu.webp`)} alt="" width="90" height="90" loading="lazy" /><span>{line.name}</span></Link>)}</div>
            </div>}
          </div>
          <div className="product-navigation application-navigation" onMouseEnter={() => { if (window.matchMedia?.('(min-width: 1081px) and (hover: hover)').matches) setDropdown('applications'); }} onMouseLeave={event => { if (window.matchMedia?.('(min-width: 1081px) and (hover: hover)').matches && !event.currentTarget.contains(document.activeElement)) setDropdown(null); }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setDropdown(null); }}>
            <div className="product-navigation-trigger"><NavLink to="/applications">Applications</NavLink><button ref={applicationsRef} type="button" aria-label="Toggle applications" aria-expanded={applicationsOpen} aria-controls="application-menu" onClick={() => setDropdown(applicationsOpen ? null : 'applications')}><ChevronDown size={14} aria-hidden="true" /></button></div>
            {applicationsOpen && <div id="application-menu" className="product-menu application-menu is-open"><div className="application-menu-grid" onClick={() => setDropdown(null)}>
              <Link to="/applications/residential"><House size={30} strokeWidth={1.5} aria-hidden="true" /><span>Residential</span><ArrowRight size={18} aria-hidden="true" /></Link>
              <Link to="/applications/workplace"><Building2 size={30} strokeWidth={1.5} aria-hidden="true" /><span>Workplace</span><ArrowRight size={18} aria-hidden="true" /></Link>
              <Link to="/applications/hospitality"><BedDouble size={30} strokeWidth={1.5} aria-hidden="true" /><span>Hospitality</span><ArrowRight size={18} aria-hidden="true" /></Link>
            </div></div>}
          </div>
          <NavLink to="/resources">Resources</NavLink>
          <NavLink to="/blog">Blog</NavLink>
          <NavLink to="/about">About FAHINT</NavLink>
          <Link className="mobile-contact" to="/contact">Contact us</Link>
        </nav>
        <Link className="header-contact" to="/contact">Contact us <ArrowRight size={16} aria-hidden="true" /></Link>
        <button ref={menuRef} className="menu-toggle" type="button" aria-expanded={open} aria-controls="main-navigation" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => { setOpen(value => !value); setDropdown(null); }}>{open ? <X size={25} aria-hidden="true" /> : <Menu size={25} aria-hidden="true" />}</button>
      </div>
    </header>
  </>;
}
