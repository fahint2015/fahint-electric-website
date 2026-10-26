import { ArrowRight } from 'lucide-react';
import { Link } from '../SiteLink.jsx';
import CertCarousel from '../CertCarousel.jsx';

export default function HomeCertifications() {
  return (
    <section className="home-certificates" aria-labelledby="home-certificates-title" data-title-align="left">
      <div className="container">
        <div className="home-certificates__head homepage-section-heading">
          <div>
            <h2 id="home-certificates-title">Certifications &amp; compliance.</h2>
          </div>
          <div>
            <p>View a certificate or download the original PDF, including its model addendum. Coverage is specific to the listed models.</p>
            <Link to="/resources#certifications" className="home-arrow-link">
              View certification details <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <CertCarousel />
      </div>
    </section>
  );
}
