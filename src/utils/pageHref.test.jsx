import { afterEach, describe, expect, it } from 'vitest';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Link, NavLink } from '../components/SiteLink.jsx';
import { pageHref } from './pageHref.js';
afterEach(cleanup);
describe('canonical page URLs', () => {
  it.each(['/products', '/products/'])('preserves active navigation at %s', (path) => {
    render(<MemoryRouter initialEntries={[path]}><NavLink end to="/products" className={({isActive}) => isActive ? 'selected' : ''}>Products</NavLink></MemoryRouter>);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/products/');
    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link')).toHaveClass('selected');
  });
  it.each([
    ['/products','/products/'],['/resources?family=gfci&model=GF15#certifications','/resources/?family=gfci&model=GF15#certifications'],
    ['/products/lighting-switches/ds15.3','/products/lighting-switches/ds15.3/'],['/','/'],
    ['/assets/catalog.pdf','/assets/catalog.pdf'],['/api/inquiry','/api/inquiry'],['/cdn-cgi/l/email-protection#x','/cdn-cgi/l/email-protection#x'],
    ['https://other.example/path','https://other.example/path'],['//other.example/path','//other.example/path'],['#details','#details'],['?q=USB','?q=USB'],
  ])('normalizes %s without touching non-page targets', (input, expected) => expect(pageHref(input)).toBe(expected));
  it('keeps basename, query and hash on client navigation and preserves modified-model names', () => {
    function Page(){const l=useLocation();return <><Link to="/contact?model=DS15.3#inquiry">Quote</Link><output>{l.pathname+l.search+l.hash}</output></>;}
    render(<MemoryRouter basename="/catalog" initialEntries={['/catalog/products/gfci/']}><Routes><Route path="*" element={<Page/>}/></Routes></MemoryRouter>);
    expect(screen.getByRole('link')).toHaveAttribute('href','/catalog/contact/?model=DS15.3#inquiry');
    fireEvent.click(screen.getByRole('link'));
    expect(screen.getByRole('status')).toHaveTextContent('/contact/?model=DS15.3#inquiry');
  });
  it('resolves relative anchors and object targets using the router', () => {
    render(<MemoryRouter initialEntries={['/about']}><Link to="#team">Team</Link><Link to={{pathname:'/contact',search:'?topic=oem',hash:'#form'}}>OEM</Link></MemoryRouter>);
    expect(screen.getByText('Team')).toHaveAttribute('href','/about/#team');
    expect(screen.getByText('OEM')).toHaveAttribute('href','/contact/?topic=oem#form');
  });
});
