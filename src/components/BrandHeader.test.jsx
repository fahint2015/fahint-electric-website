import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import BrandHeader from './BrandHeader.jsx';
import BrandFooter from './BrandFooter.jsx';
import LegacyHeader from './Header.jsx';

function show() { return render(<MemoryRouter future={{v7_startTransition:true,v7_relativeSplatPath:true}}><BrandHeader /></MemoryRouter>); }
afterEach(() => vi.unstubAllGlobals());
describe('brand navigation', () => {
  it('switches application and product menus, restores focus and closes on navigation', () => {
    show();
    const applicationTrigger = screen.getByRole('button', { name: 'Toggle applications' });
    fireEvent.click(applicationTrigger);
    expect(screen.getByRole('link', { name: 'Residential', exact: true })).toHaveAttribute('href', '/applications/residential/');
    expect(screen.getByRole('link', { name: 'Workplace', exact: true })).toHaveAttribute('href', '/applications/workplace/');
    expect(screen.getByRole('link', { name: 'Hospitality', exact: true })).toHaveAttribute('href', '/applications/hospitality/');
    fireEvent.click(screen.getByRole('button', { name: 'Toggle product series' }));
    expect(applicationTrigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(applicationTrigger);
    expect(screen.getByRole('button', { name: 'Toggle product series' })).toHaveAttribute('aria-expanded', 'false');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(applicationTrigger).toHaveFocus();
    expect(applicationTrigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(applicationTrigger);
    fireEvent.click(screen.getByRole('link', { name: 'Residential', exact: true }));
    expect(applicationTrigger).toHaveAttribute('aria-expanded', 'false');
  });
  it('closes the application submenu before the mobile navigation with Escape', () => {
    show();
    const menu = screen.getByRole('button', { name: 'Open menu' });
    const applications = screen.getByRole('button', { name: 'Toggle applications' });
    fireEvent.click(menu);
    fireEvent.click(applications);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(menu).toHaveAttribute('aria-expanded', 'true');
    expect(applications).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(menu).toHaveAttribute('aria-expanded', 'false');
    expect(menu).toHaveFocus();
  });
  it('opens by click in a narrow window even when the pointer supports hover', () => {
    vi.stubGlobal('matchMedia',query => ({matches:query==='(hover: hover)'}));
    const {container}=show(); const trigger=screen.getByRole('button',{name:'Toggle product series'});
    fireEvent.mouseEnter(container.querySelector('.product-navigation'));
    expect(trigger).toHaveAttribute('aria-expanded','false');
    fireEvent.click(trigger); expect(trigger).toHaveAttribute('aria-expanded','true');
  });
  it.each(['/home-studio/','/home-previous/'])('keeps the preserved homepage links local under %s', path => {
    render(<MemoryRouter initialEntries={[path+'?review=1']} future={{v7_startTransition:true,v7_relativeSplatPath:true}}><LegacyHeader /></MemoryRouter>);
    const canonical=path;
    expect(screen.getByRole('link',{name:'Home',exact:true})).toHaveAttribute('href',canonical);
    expect(screen.getByRole('link',{name:'Send Inquiry'})).toHaveAttribute('href',canonical+'#studio-inquiry');
    expect(screen.getByRole('link',{name:'Skip to main content'})).toHaveAttribute('href',canonical+'?review=1#main-content');
  });
  it('keeps skip and back-to-top links on the current model/filter URL', () => {
    render(<MemoryRouter initialEntries={['/products/usb-outlets?ports=c&compare=FTR15C-3100']} future={{v7_startTransition:true,v7_relativeSplatPath:true}}><BrandHeader /><BrandFooter /></MemoryRouter>);
    for (const name of ['Skip to content','Back to top']) expect(screen.getByRole('link',{name})).toHaveAttribute('href','/products/usb-outlets/?ports=c&compare=FTR15C-3100#main-content');
  });
  it('links all five main groups to actual routes including Blog', () => {
    show(); const nav=screen.getByRole('navigation',{name:'Main navigation'});
    for(const [name,path] of [['Products','/products'],['Applications','/applications'],['Resources','/resources'],['Blog','/blog'],['About FAHINT','/about']]) {
      expect(within(nav).getByRole('link',{name,exact:true})).toHaveAttribute('href',path + '/');
    }
  });
  it('opens all seven product families and closes Escape to its trigger', () => {
    show(); const trigger=screen.getByRole('button',{name:'Toggle product series'});
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded','true');
    for(const name of ['GFCI Outlets','USB Outlets','Standard Receptacles','Dimmers','Smart Switches','Lighting Switches','Wallplates']) expect(screen.getByRole('link',{name,exact:true})).toBeInTheDocument();
    fireEvent.keyDown(document,{key:'Escape'});
    expect(trigger).toHaveAttribute('aria-expanded','false'); expect(trigger).toHaveFocus();
  });
  it('closes the mobile menu on a route change and restores focus on Escape', () => {
    show(); const trigger=screen.getByRole('button',{name:'Open menu'});
    fireEvent.click(trigger); fireEvent.keyDown(document,{key:'Escape'});
    expect(trigger).toHaveFocus(); expect(trigger).toHaveAttribute('aria-expanded','false');
    fireEvent.click(trigger); fireEvent.click(screen.getByRole('link',{name:'Blog',exact:true}));
    expect(trigger).toHaveAttribute('aria-expanded','false');
  });
});
