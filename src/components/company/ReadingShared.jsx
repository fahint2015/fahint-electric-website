import { Link } from '../SiteLink.jsx';
import { ArrowUpRight } from 'lucide-react';
import EditorialPhoto from './EditorialPhoto.jsx';
import Reveal from '../Reveal.jsx';

export function formatPostDate(iso) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric', timeZone:'UTC' });
}

export function ReadingCard({ post, lead = false }) {
  const Heading = lead ? 'h2' : 'h3';
  return <Reveal as="article" className={`reading-card${lead ? ' reading-card--lead' : ''}`}>
    <Link className="reading-card__image" to={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true"><EditorialPhoto src={post.cover} alt="" region={post.coverRegion} width={post.coverWidth} height={post.coverHeight} position={post.coverPosition} fit={post.coverFit} /></Link>
    <div className="reading-card__body"><div className="reading-meta"><span>{post.category}</span><span>{post.readMinutes} min read</span></div><Heading><Link to={`/blog/${post.slug}`}>{post.title}</Link></Heading><p>{post.excerpt}</p><div className="reading-card__bottom"><time dateTime={post.updated || post.date}>Updated {formatPostDate(post.updated || post.date)}</time><Link to={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}><ArrowUpRight size={21} aria-hidden="true" /></Link></div></div>
  </Reveal>;
}
