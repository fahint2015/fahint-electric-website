import { Link, useParams } from 'react-router-dom';
import { Download, ArrowUpRight } from 'lucide-react';
import { findPost, posts } from '../data/posts.js';
import { catalogueDocument } from '../data/documents.js';
import { publicAsset } from '../utils/publicAsset.js';
import { CompanyLink } from '../components/company/CompanyShared.jsx';
import { articleMetadata } from '../seo/metadata.js';
import { usePageMetadata } from '../seo/usePageMetadata.js';
import EditorialPhoto from '../components/company/EditorialPhoto.jsx';
import { formatPostDate, ReadingCard } from '../components/company/ReadingShared.jsx';
import NotFound from './NotFound.jsx';

function SourceLink({ source, children, ...props }) {
  if (source.href.startsWith('/')) return <Link to={source.href} {...props}>{children || source.label}</Link>;
  return <a href={source.href} target="_blank" rel="noreferrer" {...props}>{children || source.label}</a>;
}

function ArticleContent({ post }) {
  usePageMetadata(articleMetadata(post));
  const headings = post.body.map((block,index) => ({ ...block, id:'article-section-' + index })).filter(block => block.type === 'h2');
  const related = posts.filter(item => item.slug !== post.slug).sort((a,b) => Number(b.category === post.category) - Number(a.category === post.category)).slice(0,3);
  return <div className="company-page reading-page">
    <header className="reading-article-heading company-section--paper"><div className="company-wrap">
      <nav className="company-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><Link to="/blog">Guides & insights</Link><span aria-hidden="true">/</span><span>{post.category}</span></nav>
      <h1>{post.title}</h1><p>{post.excerpt}</p><div className="reading-meta"><span>{post.category}</span><time dateTime={post.updated || post.date}>Updated {formatPostDate(post.updated || post.date)}</time><span>{post.readMinutes} min read</span></div>
    </div></header>
    <div className="company-wrap reading-article-layout">
      <aside className="reading-article-nav"><nav aria-label="In this article"><h2>In this article</h2><ol>{headings.map(heading => <li key={heading.id}><Link to={'#' + heading.id}>{heading.text}</Link></li>)}</ol></nav><div className="reading-document"><h3>Keep the details close.</h3><p>Compare the product with the original model documentation.</p><a className="company-text-link" href={publicAsset(catalogueDocument)} download>Download FAHINT catalog <Download size={16} aria-hidden="true" /></a><CompanyLink to="/about#certifications" secondary>Certificate library</CompanyLink></div></aside>
      <article className="reading-article"><figure className="reading-article-image"><EditorialPhoto src={post.cover} alt={post.coverAlt} region={post.coverRegion} width={post.coverWidth} height={post.coverHeight} position={post.coverPosition} priority /><figcaption>{post.coverCaption}</figcaption></figure>
        <p className="reading-safety-note">Buyer information, not installation instructions. Requirements depend on the adopted local code and exact product. Electrical work and site diagnosis should be performed by qualified professionals.</p>
        {post.body.map((block, index) => {
          if (block.type === 'h2') return <h2 id={'article-section-' + index} key={index}>{block.text}</h2>;
          if (block.type === 'list') return <ul className="reading-checklist" aria-label={block.label} key={index}>{block.items.map(item => <li key={item}>{item}</li>)}</ul>;
          if (block.type === 'table') return <div className="reading-table-scroll" role="region" aria-label={block.caption} tabIndex={0} key={index}>
            <table><caption>{block.caption}<span aria-hidden="true">Scroll sideways on smaller screens.</span></caption>
              <thead><tr>{block.columns.map(column => <th scope="col" key={column}>{column}</th>)}</tr></thead>
              <tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => {
                const content = typeof cell === 'string' ? cell : <SourceLink source={cell} />;
                return cellIndex === 0 ? <th scope="row" key={cellIndex}>{content}</th> : <td key={cellIndex}>{content}</td>;
              })}</tr>)}</tbody>
            </table>
          </div>;
          return <p key={index}>{block.text}
            {Number.isInteger(block.source) && post.sources[block.source] && <> <SourceLink className="reading-inline-source" source={post.sources[block.source]}>[Source]</SourceLink></>}
            {block.links?.map(link => <SourceLink className="reading-action-link" key={link.href} source={link} />)}
          </p>;
        })}
        <section className="reading-sources" aria-labelledby="reading-sources-title"><h2 id="reading-sources-title">Sources & further reading</h2><ul>{post.sources.map(source => <li key={source.href}><SourceLink source={source} /><ArrowUpRight size={15} aria-hidden="true" /></li>)}</ul></section>
        <div className="reading-article-cta"><h2>Reviewing a specific model?</h2><p>Send the model and the question you want to resolve. We will help locate the relevant product information.</p><CompanyLink to="/contact?topic=technical">Ask a product question</CompanyLink></div>
      </article>
    </div>
    <section className="company-section company-section--paper"><div className="company-wrap"><div className="company-heading"><h2>Continue reading.</h2><CompanyLink to="/blog" secondary>All guides & insights</CompanyLink></div><div className="reading-grid">{related.map(item => <ReadingCard post={item} key={item.slug} />)}</div></div></section>
  </div>;
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = findPost(slug);
  return post ? <ArticleContent key={post.slug} post={post} /> : <NotFound />;
}
