import { company } from '../data/company.js';
import { Link } from 'react-router-dom';
import { CompanyBreadcrumb, CompanyClosing, CompanyImage, CompanyLink, usePageMeta } from '../components/company/CompanyShared.jsx';
import CertificateLibrary from '../components/company/CertificateLibrary.jsx';
import { companyProfile, companyPhotos } from '../data/companyProfile.js';
import { catalogueDocument } from '../data/documents.js';
import { publicAsset } from '../utils/publicAsset.js';

export default function About() {
  usePageMeta('About FAHINT', 'Meet Wenzhou Fahint Electric: wiring devices for North American markets, FAHINT-branded products and OEM / ODM manufacturing support.');
  return <div className="company-page company-editorial company-about">
    <header className="company-masthead company-about-opening company-editorial-opening">
      <div className="company-wrap">
        <CompanyBreadcrumb current="About FAHINT" />
        <div className="company-editorial-lead">
          <h1>Everyday power.<br /><span>Made by FAHINT.</span></h1>
          <div><p>We are {company.name} A wiring-device manufacturer in Wenzhou, China — for the FAHINT brand and the brands we work with.</p><div className="company-actions"><CompanyLink to="/products">Explore FAHINT products</CompanyLink><CompanyLink to="/capabilities" secondary>Our manufacturing</CompanyLink></div></div>
        </div>
      </div>
      <figure className="company-wide-photo company-wide-photo--workshop"><div className="company-wide-photo__frame"><CompanyImage {...companyPhotos.workshop} priority /></div><figcaption><span>Inside FAHINT</span><span>Electronics workshop · Wenzhou, China</span></figcaption></figure>
    </header>
    <nav className="company-about-nav company-wrap" aria-label="About FAHINT sections"><Link to="#company-profile">Our company</Link><Link to="#inside-fahint">Inside FAHINT</Link><Link to="#working-together">Working together</Link><Link to="#our-markets">Our markets</Link><Link to="#certifications">Certifications</Link></nav>
    <section id="company-profile" className="company-section" aria-labelledby="company-profile-title">
      <div className="company-wrap company-profile">
        <div><h2 id="company-profile-title">A product brand.<br /><span>A manufacturer behind it.</span></h2><dl className="company-facts"><div><dt>Established</dt><dd>{companyProfile.established}</dd></div><div><dt>Based in</dt><dd>{companyProfile.location}</dd></div><div><dt>Our work</dt><dd>{companyProfile.disciplines}</dd></div><div><dt>Our focus</dt><dd>American-standard wiring devices</dd></div></dl></div>
        <div className="company-profile__story"><h3>Wenzhou Fahint Electric Co., Ltd.</h3><p>Established in 2015, FAHINT develops and manufactures low-voltage electrical switches and receptacles in Yueqing, Wenzhou. Our work connects the device itself with the manufacturing and quality-control processes behind it.</p><p>GFCI protection and USB charging are central to our range, alongside standard receptacles, dimmers, smart switches, lighting switches and wall plates. These product families serve residential and commercial applications, with model-specific ratings, functions and finishes.</p><p>For customers, that means two ways to work with the same manufacturer: choose FAHINT-branded products or develop a private-label range with coordinated devices, markings and packaging.</p><a className="company-text-link" href={publicAsset(catalogueDocument)} download>Download our company & product catalog</a></div>
      </div>
    </section>
    <section id="inside-fahint" className="company-section company-section--paper company-people-chapter" aria-labelledby="company-making-title"><div className="company-wrap">
      <div className="company-heading"><h2 id="company-making-title">The people<br /><span>behind the product.</span></h2><div><p>From a product drawing to the assembly floor. Our work brings research, development and manufacturing together, with the device and your market at the center.</p><CompanyLink to="/capabilities#production" secondary>Explore manufacturing & testing</CompanyLink></div></div>
      <div className="company-people-gallery">
        <figure><CompanyImage {...companyPhotos.team} /><figcaption><span>Our team in Wenzhou</span><span>The people behind FAHINT</span></figcaption></figure>
        <figure><CompanyImage {...companyPhotos.productReview} /><figcaption><span>From a drawing to a device</span><span>Product review with the team</span></figcaption></figure>
      </div>
    </div></section>
    <section id="working-together" className="company-section company-section--navy">
      <div className="company-wrap"><div className="company-heading"><h2>One company.<br /><span>Two ways to work together.</span></h2><p>Choose the product range that fits your business, with support from selection through the order.</p></div>
        <div className="company-business-paths">
          <div><h3>FAHINT products</h3><p>Choose from our collection for distribution, retail or a project specification. Compare the model, electrical rating, available finish and relevant certification documents before confirming your order.</p><ul className="company-path-details"><li>GFCI protection, charging, switching and wall plates</li><li>Residential and commercial product options</li><li>Model documentation and sample review</li></ul><CompanyLink to="/products" secondary light>Find your product range</CompanyLink></div>
          <div><h3>Your brand, our manufacturing</h3><p>Build a private-label or OEM / ODM program with our team. Start with the device and its requirements, then coordinate the visible details and packaging for your market.</p><ul className="company-path-details"><li>Device colors and matching wall plates</li><li>Authorized logos and product markings</li><li>Color-box artwork and packaging requirements</li></ul><CompanyLink to="/capabilities#oem" secondary light>Explore OEM / ODM support</CompanyLink></div>
        </div>
      </div>
    </section>
    <section id="our-markets" className="company-section"><div className="company-wrap">
      <div className="company-heading"><h2>Built in Wenzhou.<br /><span>Working across markets.</span></h2><p>We work with distributors, retailers, contractors and private-label brands. Our export experience spans North America and markets across Latin America and the Caribbean.</p></div>
      <div className="company-markets-layout">
        <figure><CompanyImage {...companyPhotos.showroomSamples} /><figcaption>Wiring-device samples · FAHINT showroom</figcaption></figure>
        <div><h3>A conversation around real products.</h3><p>Start with the device itself. Our showroom samples provide a physical reference for discussing product families, finishes and wall plates, alongside the requirements for your market.</p><dl className="company-market-list"><div><dt>North America</dt><dd>United States, Canada and Mexico</dd></div><div><dt>Latin America & the Caribbean</dt><dd>Including Colombia, Panama, Honduras, Jamaica and the Dominican Republic</dd></div></dl><p className="company-market-note">Requirements differ by destination. Confirm the model, documentation and order details for your market with our team.</p><CompanyLink to="/contact" secondary>Meet your product team</CompanyLink></div>
      </div>
    </div></section>
    <CertificateLibrary />
    <CompanyClosing title="Your next project starts with a conversation." text="Tell us what you are specifying, sourcing or building. We will help you find the relevant products and documentation." />
  </div>;
}
