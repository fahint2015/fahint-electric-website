import { Link } from '../SiteLink.jsx';
import { ArrowRight, Check } from 'lucide-react';

export default function HomepageCta() {
  return (
    <section className="home-cta" aria-labelledby="home-cta-title" data-title-align="right">
      <div className="container home-cta__inner">
        <div className="home-cta__copy">
          <p className="home-section-label">Start with a proven platform</p>
          <h2 id="home-cta-title">Build the Line Your Market Needs.</h2>
          <p>Define the range, finish and brand details. We coordinate the engineering, approvals and production handoff.</p>
        </div>

        <div className="home-cta__action">
          <ul>
            {['Certified product platforms', 'Private-label development', 'Sample approval before production'].map((item) => (
              <li key={item}>
                <Check size={17} /> {item}
              </li>
            ))}
          </ul>
          <Link to="/contact" className="btn btn--primary">
            Request a Product Line Proposal <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
