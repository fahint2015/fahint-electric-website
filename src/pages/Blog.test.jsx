import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Blog from './Blog.jsx';
import BlogPost from './BlogPost.jsx';
import { posts } from '../data/posts.js';
import { publicAsset } from '../utils/publicAsset.js';

const renderBlog = (path = '/blog') => render(<MemoryRouter initialEntries={[path]} future={{ v7_startTransition:true, v7_relativeSplatPath:true }}><Routes><Route path="/blog" element={<Blog />} /><Route path="/blog/:slug" element={<BlogPost />} /></Routes></MemoryRouter>);

describe('Buyer reading pages', () => {
  it('filters articles with a visible selected state and result count', async () => {
    renderBlog();
    await userEvent.click(screen.getByRole('button', { name:'Compliance' }));
    expect(screen.getByRole('button', { name:'Compliance' })).toHaveAttribute('aria-pressed','true');
    expect(screen.getByRole('status')).toHaveTextContent('2 articles');
    expect(document.title).toBe('Wiring Device Guides | FAHINT');
  });
  it('provides article navigation, sources and a direct catalog download', () => {
    renderBlog('/blog/gfci-vs-afci-whats-the-difference');
    expect(screen.getByRole('navigation', { name:'In this article' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name:'Sources & further reading' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name:/CPSC.*AFCI/ })).toHaveAttribute('href', expect.stringContaining('cpsc.gov'));
    expect(screen.getByRole('link', { name:'Download FAHINT catalog' })).toHaveAttribute('download');
    expect(document.title).toBe(`${posts.find(post => post.slug === 'gfci-vs-afci-whats-the-difference').title} | FAHINT`);
  });
  it('shows a real not-found message for an unknown article', () => {
    renderBlog('/blog/not-a-real-article');
    expect(screen.getByRole('heading', { level:1, name:'This page isn’t here.' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name:'Browse products' })).toHaveAttribute('href','/products');
  });
  it('removes unsourced universal specifications and retains original article URLs', () => {
    expect(posts).toHaveLength(11);
    const content = posts.map(post => `${post.title} ${post.body.map(block=>block.text).join(' ')}`).join(' ');
    expect(content).not.toMatch(/every 15 minutes|400 cartons|98 percent|without Compliance Risk|seven-finish|Current production should be to UL 943 5th/i);
    expect(posts.find(post => post.slug === 'nec-406-8-weather-resistant-receptacles').title).not.toContain('406.8');
    for (const post of posts) expect(post.sources?.length).toBeGreaterThan(0);
  });
  it('gives every guide a distinct editorial cover with a source-aware description', () => {
    expect(new Set(posts.map(post => JSON.stringify([post.cover, post.coverRegion])))).toHaveProperty('size', 11);
    for (const post of posts) {
      expect(post.coverAlt).toBeTruthy();
      expect(post.coverCaption).toBeTruthy();
      expect(post.coverSource).toBeTruthy();
      expect(post.cover).not.toMatch(/(?:plate|main|white)\.webp$/);
    }
  });
  it('keeps the relevant cover description with the full article', () => {
    const post = posts.find(item => item.slug === 'gfci-colour-finishes-specification');
    renderBlog('/blog/' + post.slug);
    expect(screen.getByAltText(post.coverAlt)).toHaveAttribute('src', publicAsset(post.cover));
    expect(screen.getByText(post.coverCaption)).toBeInTheDocument();
  });
  it('visibly labels every reused application illustration, not only in alternative text', () => {
    const illustrations = posts.filter(post => /application|product-gfci|product-usb|home-installations/.test(post.cover));
    expect(illustrations).toHaveLength(6);
    for (const post of illustrations) expect(post.coverCaption).toMatch(/illustrat/i);
  });
});
