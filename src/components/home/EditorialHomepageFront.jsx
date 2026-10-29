import { ArrowRight, Check, Download, FileCheck2, FlaskConical, Layers3, Package, Palette, PenTool } from 'lucide-react';
import { Link } from '../SiteLink.jsx';
import { stats as companyStats } from '../../data/company.js';
import Reveal from '../Reveal.jsx';
import HomeCertifications from './HomeCertifications.jsx';
import { productLines } from '../../data/lines.js';

const asset = (name) => `assets/images/editorial-home/${name}`;

const products = [
  {
    slug: 'gfci',
    image: asset('product-gfci-optimized.webp'),
    imageSize: [1600, 888],
    description: 'Self-test protection devices for residential, commercial and demanding installation environments.'
  },
  {
    slug: 'usb-outlets',
    image: asset('product-usb-optimized.webp'),
    imageSize: [1600, 889],
    description: 'Integrated charging solutions designed for modern homes, hospitality and workplace projects.'
  },
  {
    slug: 'receptacles',
    image: asset('product-receptacle-optimized.webp'),
    imageSize: [1600, 888],
    description: 'Decorator, duplex and specialty receptacles with coordinated plates and finish options.'
  },
  {
    slug: 'dimmers',
    image: asset('category-switches-scene.webp'),
    imageSize: [1600, 900],
    description: 'Digital slide dimmers and 0–10V controls for residential and commercial lighting.'
  },
  {
    slug: 'smart-switches',
    image: asset('product-smart-optimized.webp'),
    imageSize: [1600, 889],
    description: 'Wi-Fi and Zigbee lighting controls built for app, voice and shared-home experiences.'
  },
  {
    slug: 'wallplates',
    image: asset('category-wallplates-scene.webp'),
    imageSize: [1600, 900],
    description: 'Screwless, standard and metal wall plates developed to complete a coordinated device range.'
  }
].map((product) => {
  const line = productLines.find((item) => item.slug === product.slug);
  return { ...product, name: line.name, href: `/products/${line.slug}` };
});

const applications = [
  {
    title: 'Kitchens & Wet Areas',
    image: asset('application-kitchen-v2-optimized.webp'),
    mobileFocal: 'right',
    href: '/products/gfci',
    copy: 'Integrated GFCI protection for premium kitchens and water-adjacent locations.'
  },
  {
    title: 'Hospitality & Multifamily',
    image: asset('application-hotel-v2-optimized.webp'),
    mobileFocal: 'left',
    href: '/products/usb-outlets',
    copy: 'USB and Type-C charging where guests and residents naturally need power.'
  },
  {
    title: 'Commercial Fit-Out',
    image: asset('application-commercial-v2-optimized.webp'),
    mobileFocal: 'center',
    href: '/capabilities',
    copy: 'Dependable wiring-device programs for contractors and project buyers.'
  },
  {
    title: 'Bathrooms & Renovation',
    image: asset('application-bathroom-v2-optimized.webp'),
    mobileFocal: 'center',
    href: '/products/receptacles',
    copy: 'Explore device and wall plate options for your renovation specification.'
  }
];

const engineeringCapabilities = [
  ['01', 'Safety & compliance', 'Listed platforms and market-ready documentation across selected device families.'],
  ['02', 'Charging performance', 'USB-A, Type-C and PD options configured for modern in-wall charging programs.'],
  ['03', 'Control intelligence', 'Switching, dimming and connected control options built around the same system.'],
  ['04', 'Coordinated form & finish', 'Aligned faces, plates, colours and markings across a complete wall-device range.']
];

const programSupport = [
  ['01', 'Model selection', 'Compare ratings, functions and installation requirements before you choose.'],
  ['02', 'Document review', 'Check model-specific specifications and certification references in one place.'],
  ['03', 'Matched finishes', 'Coordinate device colors and wall plates across your selected range.'],
  ['04', 'Sample approval', 'Review the product, packaging and markings before confirming production.']
];

const customizationOptions = [
  [Layers3, 'Product mix', 'Build a range across protection, charging, receptacle, switch and control families.'],
  [Palette, 'Colors & finishes', 'Match device colors and wall plates to your chosen range.'],
  [PenTool, 'Logo & markings', 'Review authorized branding and required product identification.'],
  [Package, 'Packaging', 'Prepare cartons, manuals and retail or project packaging around your program.'],
  [FileCheck2, 'Compliance files', 'Coordinate model data, certification references and approval documentation.'],
  [FlaskConical, 'Samples & testing', 'Review appearance, fit, function and packaging before production handoff.']
];

const factoryArea = companyStats.find((item) => item.label === 'Factory area (m²)');

const proof = [
  ['UL / cUL', 'Selected listed models'],
  ['100%', 'GFCI functional testing'],
  [factoryArea?.value || '3,600', factoryArea?.label || 'Factory area (m²)'],
  ['OEM / ODM', 'Flexible program support']
];

const process = [
  ['01', 'Requirement review', 'Market, application, rating and certification needs.'],
  ['02', 'Product configuration', 'Device family, color, plate and packaging options.'],
  ['03', 'Sample & verification', 'Confirm appearance, fit, function and documentation.'],
  ['04', 'Production & delivery', 'Manufacturing, testing, packing and shipment support.']
];

export default function EditorialHomepageFront() {
  return (
    <div className="editorial-home-front">
      <section className="editorial-hero" aria-labelledby="editorial-hero-title">
        <img
          className="editorial-hero__image"
          src={asset('hero-1-optimized.webp')}
          alt="Fahint North American wiring devices"
          width="1600"
          height="458"
          fetchpriority="high"
          decoding="async"
        />
        <div className="editorial-hero__shade" />
        <div className="editorial-hero__grid" />
        <div className="container editorial-hero__content">
          <p className="editorial-eyebrow">FAHINT · Wiring-device manufacturer</p>
          <h1 id="editorial-hero-title">Wiring devices for your market.</h1>
          <p className="editorial-hero__copy">
            North American wiring devices for distributors, contractors and private-label brands.
            Choose FAHINT products or work with our manufacturing team on OEM/ODM orders.
          </p>
          <div className="editorial-hero__actions">
            <Link className="editorial-button" to="/products">
              Explore FAHINT products <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link className="editorial-text-link" to="/contact">
              Discuss OEM/ODM <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="container editorial-hero__note" aria-label="Product program values">
          <span>Product safety</span><span>Verified testing</span><span>Program flexibility</span>
        </div>
      </section>

      <section className="editorial-proof homepage-proof-bridge" aria-label="Fahint manufacturing highlights">
        <div className="container editorial-proof__grid">
          {proof.map(([value, label]) => (
            <div key={value}><strong>{value}</strong><span>{label}</span></div>
          ))}
        </div>
      </section>

      <section className="editorial-products homepage-product-portfolio" aria-labelledby="editorial-products-title">
        <div className="container editorial-heading homepage-section-heading">
          <div>
            <h2 id="editorial-products-title">Featured product ranges.</h2>
          </div>
          <p>
            Protection, power and control for the spaces you build. Explore a range, or find a specific model in our product catalog.
          </p>
        </div>
        <Reveal className="editorial-product-mosaic reveal--group">
          {products.map((product, index) => (
            <Link
              className="editorial-product-panel"
              key={product.name}
              to={product.href}
              aria-label={`View ${product.name}`}
            >
              <img
                src={product.image}
                alt={product.name}
                width={product.imageSize[0]}
                height={product.imageSize[1]}
                loading={index > 1 ? 'lazy' : 'eager'}
                decoding="async"
              />
              <div className="editorial-panel__content">
                <div className="editorial-panel__heading">
                  <h3>{product.name}</h3>
                  <span className="editorial-panel__arrow" aria-hidden="true"><ArrowRight size={22} /></span>
                </div>
                <p>{product.description}</p>
              </div>
            </Link>
          ))}
        </Reveal>
        <div className="container homepage-range-footer">
          <p>Looking for lighting switches or a specific model?</p>
          <Link className="editorial-button" to="/products">Browse all 7 product ranges <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="editorial-brand homepage-why-fahint" aria-labelledby="editorial-brand-title">
        <div className="container editorial-brand__layout">
          <div className="editorial-brand__grid">
            <Reveal className="editorial-brand__media reveal--media">
              <img
                src={asset('brand-system-family-final-optimized.webp')}
                alt="Fahint coordinated wiring-device product family"
                width="1254"
                height="1254"
                loading="lazy"
                decoding="async"
              />
              <span className="editorial-brand__index">Fahint wiring devices</span>
            </Reveal>
            <div className="editorial-brand__copy">
              <h2 id="editorial-brand-title">FAHINT products. Manufacturing expertise.</h2>
              <p className="editorial-brand__lede">
                Explore our product families with support for model selection, certification documents
                and sample approval. Our team also helps coordinate private-label requirements.
              </p>
              <div className="homepage-resource-links">
                <Link className="editorial-text-link editorial-text-link--dark" to="/about">
                  Discover Fahint <ArrowRight size={17} aria-hidden="true" />
                </Link>
                <a className="editorial-text-link editorial-text-link--dark" href="assets/documents/fahint-product-catalog.pdf" download>
                  Download product catalog <Download size={17} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
          <ul className="editorial-brand__support" aria-label="Fahint program support" role="list">
            {programSupport.map(([number, title, copy]) => (
              <li key={number}><h3>{title}</h3><p>{copy}</p></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="editorial-engineering homepage-restored-poster" aria-labelledby="editorial-engineering-title">
        <img className="editorial-engineering__bg" src={asset('product-gfci-optimized.webp')} alt="Fahint wiring-device engineering platform" width="1600" height="888" loading="lazy" decoding="async" />
        <div className="editorial-engineering__shade" aria-hidden="true" />
        <div className="container editorial-engineering__content">
          <div className="editorial-engineering__copy">
            <h2 id="editorial-engineering-title">Engineering across the range.</h2>
            <p>
              Safety, charging and control functions are developed across our device families.
              Compare model-specific features, finishes and technical documentation with our team.
            </p>
            <ul className="editorial-feature-list editorial-feature-list--platform" aria-label="Engineering capabilities" role="list">
              {engineeringCapabilities.map(([number, title, copy]) => (
                <li key={number}><div><strong>{title}</strong><small>{copy}</small></div></li>
              ))}
            </ul>
            <Link className="editorial-button editorial-button--outline" to="/capabilities">
              Explore engineering capability <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className="editorial-engineering__callout">
            <span>Coordinated product families</span>
            <strong>Device faces, wall plates and finishes coordinated across your selected range.</strong>
          </div>
        </div>
      </section>

      <section className="editorial-factory homepage-restored-poster" aria-labelledby="editorial-factory-title">
        <div className="homepage-factory-stage">
          <img className="editorial-factory__bg" src={asset('factory-optimized.webp')} alt="Fahint production and testing line" width="1600" height="900" loading="lazy" decoding="async" />
          <div className="editorial-factory__shade" aria-hidden="true" />
          <div className="container editorial-factory__content">
            <div className="editorial-factory__copy">
              <h2 id="editorial-factory-title">Quality checked on the line.</h2>
              <p>
                Fahint integrates product development, manufacturing and quality control in Yueqing, Wenzhou.
                Complete production lines and test benches support consistent output for export programs.
              </p>
            </div>
          </div>
        </div>
        <div className="container homepage-factory-proof">
          <ul className="editorial-factory__points" aria-label="Manufacturing capabilities" role="list">
            {[
              ['01', 'Integrated production', 'Manufacturing and assembly under one coordinated system.'],
              ['02', 'Functional inspection', 'Comprehensive testing before products leave the line.'],
              ['03', 'Laboratory support', 'Supporting equipment for standards-focused verification.'],
              ['04', 'Export experience', 'Programs serving North and Latin American markets.']
            ].map(([number, title, copy]) => (
              <li key={number}><h3>{title}</h3><small>{copy}</small></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="editorial-oem homepage-restored-poster" aria-labelledby="editorial-oem-title">
        <img className="editorial-oem__bg" src={asset('about-fahint-optimized.webp')} alt="Fahint automated manufacturing equipment" width="800" height="500" loading="lazy" decoding="async" />
        <div className="editorial-oem__shade" aria-hidden="true" />
        <div className="container editorial-oem__content">
          <div className="editorial-heading homepage-section-heading">
            <div>
              <h2 id="editorial-oem-title">From specification to production.</h2>
            </div>
            <p>
              Share your specifications, target market and order quantity. We will review the requirements,
              confirm samples and agree on production details with you.
            </p>
          </div>
          <Reveal as="ol" className="editorial-process reveal--group" aria-label="OEM program steps" role="list">
            {process.map(([number, title, copy]) => (
              <li key={number}>
                <span className="editorial-process__number" aria-hidden="true">{number}</span>
                <h3>{title}</h3><p>{copy}</p><Check size={16} aria-hidden="true" />
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="editorial-customization homepage-oem-program" aria-labelledby="editorial-customization-title">
        <header className="container homepage-oem-program__intro homepage-section-heading">
          <div>
            <h2 id="editorial-customization-title">Customize your product range.</h2>
          </div>
          <p className="editorial-customization__lede">
            Choose device colors, wall plates, authorized brand markings and packaging. We will confirm
            available options, artwork requirements and order quantities with you.
          </p>
        </header>
        <div className="container homepage-oem-program__workspace">
          <div className="editorial-customization__grid">
            <Reveal as="figure" className="editorial-customization__media reveal--media">
              <img src="assets/images/products/gf15-package-standard-white-v1.jpg" alt="Fahint retail packaging and matching GFCI wall plate" width="800" height="800" loading="lazy" decoding="async" />
              <figcaption className="homepage-oem-program__image-note">Fahint retail box &amp; matching wall plate</figcaption>
            </Reveal>
            <ul className="homepage-oem-program__options" aria-label="Customization options" role="list">
              {customizationOptions.map(([Icon, title, copy]) => (
                <li className="homepage-oem-program__option" key={title}>
                  <span className="homepage-oem-program__icon"><Icon size={23} strokeWidth={1.7} aria-hidden="true" /></span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="homepage-oem-program__footer">
            <div>
              <h3>Your packaging. Your presentation.</h3>
              <p>Custom artwork is subject to brand authorization and sample approval.</p>
            </div>
            <Link className="editorial-button homepage-oem-program__cta" to="/contact">
              Request a quote <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <HomeCertifications />

      <section className="editorial-applications" aria-labelledby="editorial-applications-title">
        <div className="container editorial-heading homepage-section-heading">
          <div>
            <h2 id="editorial-applications-title">Built for homes and businesses.</h2>
          </div>
          <p>Explore wiring devices for residential construction, hospitality and commercial projects. Select models to match the installation requirements.</p>
        </div>
        <Reveal className="container editorial-application-grid reveal--group">
          {applications.map((item) => (
            <Link
              className="editorial-application"
              data-mobile-focal={item.mobileFocal}
              key={item.title}
              to={item.href}
              aria-label={`View ${item.title} solution`}
            >
              <img src={item.image} alt={item.title} width="1600" height="900" loading="lazy" decoding="async" />
              <div className="editorial-application__copy">
                <div className="editorial-application__heading">
                  <h3>{item.title}</h3>
                  <span className="editorial-application__arrow" aria-hidden="true"><ArrowRight size={19} /></span>
                </div>
                <span>{item.copy}</span>
              </div>
            </Link>
          ))}
        </Reveal>
      </section>
    </div>
  );
}
