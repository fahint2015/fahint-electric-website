import { ArrowRight, Clock } from 'lucide-react';
import { Link } from '../SiteLink.jsx';
import { posts } from '../../data/posts.js';
import Reveal from '../Reveal.jsx';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function HomeInsights() {
  return (
    <section className="home-insights" aria-labelledby="home-insights-title" data-title-align="left">
      <div className="container">
        <div className="home-insights__head">
          <div>
            <p className="home-section-label">Knowledge base</p>
            <h2 id="home-insights-title">Latest From Fahint.</h2>
          </div>
          <Link to="/blog" className="home-arrow-link">
            View all insights <ArrowRight size={16} />
          </Link>
        </div>

        <Reveal className="home-insights__grid reveal--group">
          {posts.slice(0, 3).map((post) => (
            <Link to={`/blog/${post.slug}`} className="home-insight" key={post.slug}>
              <div className="home-insight__media">
                <img src={post.cover} alt="" width="800" height="800" loading="lazy" />
                <span>{post.category}</span>
              </div>
              <div className="home-insight__body">
                <div className="home-insight__meta">
                  <span>{formatDate(post.date)}</span>
                  <span>
                    <Clock size={14} /> {post.readMinutes} min
                  </span>
                </div>
                <h3>{post.title}</h3>
                <span className="home-insight__link">
                  Read article <ArrowRight size={15} />
                </span>
              </div>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
