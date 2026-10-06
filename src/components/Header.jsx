import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import { company } from '../data/company.js';
import { productLines } from '../data/lines.js';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [mobileProducts, setMobileProducts] = useState(false);
  const closeTimer = useRef(null);
  const { pathname } = useLocation();
  const overHero = ['/', '/home-studio'].includes(pathname);
  const homePath = pathname.replace(/\/$/, '') === '/home-next' ? '/home-next' : '/';
  const productsPath = '/products';
  const inquiryPath = ['/', '/home-studio'].includes(pathname) ? '/#studio-inquiry' : '/contact';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setDropdown(false);
    setMobileProducts(false);
  }, [pathname]);

  // Small close delay keeps the menu usable while the pointer crosses the gap.
  const openDropdown = () => {
    clearTimeout(closeTimer.current);
    setDropdown(true);
  };
  const closeDropdown = () => {
    closeTimer.current = setTimeout(() => setDropdown(false), 160);
  };

  const solid = scrolled || !overHero || open || dropdown;

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className={`header${overHero ? ' header--home' : ''} ${solid ? 'header--solid' : 'header--transparent'}`}>
        <div className="header__inner">
          <Link to={homePath} className="logo" aria-label={company.shortName}>
            <img
              className="logo__image"
              src="assets/images/brand/fahint-logo-navy.png"
              alt="Fahint"
              width="204"
              height="34"
            />
          </Link>

          <nav className="nav">
            <NavLink to={homePath} end className={({ isActive }) => (isActive ? 'is-active' : '')}>
              Home
            </NavLink>

            <div className="nav__has-menu" onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
              <NavLink
                to={productsPath}
                className={({ isActive }) => `nav__trigger ${isActive ? 'is-active' : ''}`}
              >
                Products <ChevronDown size={15} className={dropdown ? 'is-flipped' : ''} />
              </NavLink>

              {dropdown && (
                <div className="dropdown">
                  <div className="dropdown__grid">
                    {productLines.map((l) => (
                      <Link key={l.slug} to={`/products/${l.slug}`} className="dropdown__item">
                        <img src={l.cover} alt="" loading="lazy" />
                        <span>
                          <strong>{l.name}</strong>
                          <small>{l.tagline}</small>
                        </span>
                      </Link>
                    ))}
                  </div>
                  <Link to={productsPath} className="dropdown__all">
                    View all product series <ArrowRight size={15} />
                  </Link>
                </div>
              )}
            </div>

            <NavLink to="/capabilities" className={({ isActive }) => (isActive ? 'is-active' : '')}>
              Capabilities
            </NavLink>
            <NavLink to="/resources" className={({ isActive }) => (isActive ? 'is-active' : '')}>
              Resources
            </NavLink>
            <NavLink to="/blog" className={({ isActive }) => (isActive ? 'is-active' : '')}>
              Blog
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'is-active' : '')}>
              About
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => (isActive ? 'is-active' : '')}>
              Contact
            </NavLink>
          </nav>

          <Link to={inquiryPath} className="btn btn--primary header__cta">
            Send Inquiry <ArrowRight size={16} />
          </Link>

          <button className="burger" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {open && (
        <div className="mobile-menu">
          <Link to={homePath}>Home</Link>

          <button className="mobile-menu__toggle" onClick={() => setMobileProducts((v) => !v)} aria-expanded={mobileProducts}>
            Products <ChevronDown size={17} className={mobileProducts ? 'is-flipped' : ''} />
          </button>
          {mobileProducts && (
            <div className="mobile-menu__sub">
              <Link to={productsPath}>All product series</Link>
              {productLines.map((l) => (
                <Link key={l.slug} to={`/products/${l.slug}`}>
                  {l.name}
                </Link>
              ))}
            </div>
          )}

          <Link to="/capabilities">Capabilities</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to={inquiryPath} className="btn btn--primary" onClick={() => setOpen(false)}>
            Send Inquiry <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </>
  );
}
