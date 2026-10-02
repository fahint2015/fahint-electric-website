import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { publicAsset } from '../../utils/publicAsset.js';
import { staticMetadata } from '../../seo/metadata.js';
import { usePageMetadata } from '../../seo/usePageMetadata.js';

export function useStudioPageMeta(title, description) {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/$/, '') || '/';
  const preview = ['/home-studio', '/products-studio'].includes(path);
  usePageMetadata(preview ? { title: `FAHINT | ${title} — Preview`, description, noindex: true, robots: 'noindex, nofollow' }
    : staticMetadata[path] || { title: `FAHINT | ${title}`, description });
}

export function StudioImage({ src, alt = '', className = '', width = 800, height = 800, priority = false, ...props }) {
  return <img className={className} src={publicAsset(src)} alt={alt} width={width} height={height} loading={priority ? 'eager' : 'lazy'} fetchpriority={priority ? 'high' : undefined} decoding="async" {...props} />;
}

export function StudioLink({ to, children, light = false, className = '', ...props }) {
  return <Link to={to} className={`studio-button ${light ? 'studio-button--light' : ''} ${className}`} {...props}>{children}<ArrowUpRight size={19} aria-hidden="true" /></Link>;
}
