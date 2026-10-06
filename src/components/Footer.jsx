import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { company } from '../data/company.js';
import { productLines } from '../data/lines.js';
import { findProduct, isVerifiedListing } from '../data/products.js';
import { publicAsset } from '../utils/publicAsset.js';

export default function Footer() {
  const { pathname } = useLocation();
  const productDetailMatch = pathname.match(/^\/products\/([^/]+)\/([^/]+)\/?$/i);
  const detailProduct = productDetailMatch?.[1].toLowerCase() === 'gfci' ? findProduct(productDetailMatch[2]) : null;
  const cataloguePath = productDetailMatch && !detailProduct ? pathname : null;
  const [catalogueReference, setCatalogueReference] = useState(null);
  const reviewLabel = 'Model-specific certification review required';

  // Keep the full catalogue off the homepage's initial download. A changed route
  // must never display the previous model's certification while its data loads.
  useEffect(() => {
    if (!cataloguePath) return undefined;
    let cancelled = false;
    const [, line, sku] = cataloguePath.match(/^\/products\/([^/]+)\/([^/]+)\/?$/i);
    import('../data/catalogProducts.js').then(({ findCatalogProduct }) => {
      if (!cancelled) setCatalogueReference({ pathname: cataloguePath, label: findCatalogProduct(line.toLowerCase(), sku)?.certificationLabel });
    }).catch(() => {
      if (!cancelled) setCatalogueReference({ pathname: cataloguePath, label: null });
    });
    return () => { cancelled = true; };
  }, [cataloguePath]);

  const certificationReference = detailProduct
    ? isVerifiedListing(detailProduct) ? `UL File ${detailProduct.listing.file}` : reviewLabel
    : productDetailMatch
      ? (catalogueReference?.pathname === pathname && catalogueReference.label) || reviewLabel
      : `UL File ${company.ulFile}`;

  return (
    <footer className={`footer${productDetailMatch ? ' footer--product-detail' : ''}`}>
      <div className="container">
        <div className="footer__grid">
          <div className="footer__about">
            <img className="footer__wordmark" src={publicAsset('assets/images/brand/fahint-logo-navy.png')} alt="FAHINT" width="204" height="34" loading="lazy" />
            <p>
              {company.name} develops coordinated North American wiring-device platforms for brands, distributors and
              private-label programs.
            </p>
            <p className="footer__reference">
              {certificationReference} | ISO 9001 Certified | US &amp; CN Patented
            </p>
          </div>

          <div>
            <h4>Product Series</h4>
            <ul>
              {productLines.map((l) => (
                <li key={l.slug}>
                  <Link to={`/products/${l.slug}`}>{l.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Company</h4>
            <ul>
              <li>
                <Link to="/about">About Fahint</Link>
              </li>
              <li>
                <Link to="/capabilities">Manufacturing</Link>
              </li>
              <li>
                <Link to="/capabilities#oem">OEM &amp; ODM</Link>
              </li>
              <li>
                <Link to="/about#certifications">Certifications</Link>
              </li>
              <li>
                <Link to="/resources">Resources</Link>
              </li>
              <li>
                <Link to="/blog">Blog &amp; insights</Link>
              </li>
              <li>
                <Link to="/contact">Request a quote</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Contact</h4>
            <ul>
              <li style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <Mail size={17} style={{ marginTop: 4, flexShrink: 0 }} />
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </li>
              <li style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <Phone size={17} style={{ marginTop: 4, flexShrink: 0 }} />
                <a href={`tel:${company.phone.replace(/\s/g, '')}`}>{company.phone}</a>
              </li>
              <li style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <MapPin size={17} style={{ marginTop: 4, flexShrink: 0 }} />
                <span>{company.location}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>
            © {new Date().getFullYear()} {company.name} All rights reserved.
          </span>
          <span>{company.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
