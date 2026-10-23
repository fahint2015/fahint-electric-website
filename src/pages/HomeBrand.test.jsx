import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import HomeBrand from './HomeBrand.jsx';

let reduced = false;
beforeEach(() => {
  vi.useFakeTimers(); reduced = false;
  vi.stubGlobal('matchMedia', () => ({ matches:reduced, addEventListener:vi.fn(), removeEventListener:vi.fn() }));
  vi.stubGlobal('IntersectionObserver', class { constructor(callback) { this.callback=callback; } observe(target) { this.callback([{ target, isIntersecting:true }]); } unobserve() {} disconnect() {} });
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });
function show() { return render(<MemoryRouter future={{v7_startTransition:true,v7_relativeSplatPath:true}}><HomeBrand /></MemoryRouter>); }
describe('published brand homepage', () => {
  it('keeps a tapped room card open on touch screens until focus leaves the scene', () => {
    vi.stubGlobal('matchMedia', query => ({ matches: query === '(hover: none)', addEventListener: vi.fn(), removeEventListener: vi.fn() }));
    show();
    const section = screen.getByRole('region', { name: 'Power, room by room.' });
    const button = within(section).getByRole('button', { name: 'Show DS15 Paddle Switch' });
    act(() => button.focus());
    fireEvent.click(button);
    fireEvent.mouseLeave(button);
    fireEvent.mouseLeave(section);
    act(() => vi.advanceTimersByTime(1000));
    expect(within(section).getByRole('link', { name: 'View DS15 Paddle Switch' })).toBeVisible();
    act(() => screen.getByRole('tab', { name: 'Residential' }).focus());
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
  it('places the room scene between the product series and applications with reachable product links', async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    show();
    const section = screen.getByRole('region', { name: 'Power, room by room.' });
    expect(section.previousElementSibling).toHaveAttribute('id', 'products');
    expect(section.nextElementSibling).toHaveAttribute('id', 'spaces');
    const buttons = within(section).getAllByRole('button');
    const destinations = ['/products/gfci/gf15', '/products/usb-outlets/ftr15c-3100', '/products/dimmers/dm2010', '/products/lighting-switches/ds15'];
    expect(buttons).toHaveLength(destinations.length);
    act(() => buttons[0].focus());
    for (const [index, button] of buttons.entries()) {
      expect(button).toHaveFocus();
      expect(button).toHaveAttribute('aria-expanded', 'true');
      const link = within(section).getByRole('link');
      expect(link).toHaveAttribute('href', destinations[index]);
      await user.tab();
      expect(link).toHaveFocus();
      await user.tab({ shift: true });
      expect(button).toHaveFocus();
      await user.tab();
      await user.keyboard('{Escape}');
      expect(button).toHaveFocus();
      expect(button).toHaveAttribute('aria-expanded', 'false');
      await user.click(button);
      await user.tab();
      await user.tab();
    }
    expect(section).not.toContainElement(document.activeElement);
  });
  it('cycles without a play control and continues after a pointer selection', () => {
    show();
    expect(screen.getByRole('button',{name:'Show our belief'})).toHaveAttribute('aria-pressed','true');
    expect(screen.queryByRole('button',{name:/play|pause/i})).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(8000));
    expect(screen.getByRole('button',{name:'Show our purpose'})).toHaveAttribute('aria-pressed','true');
    const vision=screen.getByRole('button',{name:'Show our vision'});
    vi.spyOn(vision,'matches').mockReturnValue(false);
    fireEvent.focus(vision); fireEvent.click(vision);
    act(() => vi.advanceTimersByTime(8000));
    expect(screen.getByRole('button',{name:'Show our belief'})).toHaveAttribute('aria-pressed','true');
  });
  it('pauses on keyboard focus and resumes after focus leaves', () => {
    show(); const purpose=screen.getByRole('button',{name:'Show our purpose'});
    vi.spyOn(purpose,'matches').mockReturnValue(true);
    fireEvent.focus(purpose); fireEvent.click(purpose);
    act(() => vi.advanceTimersByTime(16000));
    expect(purpose).toHaveAttribute('aria-pressed','true');
    fireEvent.blur(purpose,{relatedTarget:null});
    act(() => vi.advanceTimersByTime(8000));
    expect(screen.getByRole('button',{name:'Show our vision'})).toHaveAttribute('aria-pressed','true');
  });
  it('respects reduced motion while keeping manual choices available', () => {
    reduced=true; show(); act(() => vi.advanceTimersByTime(24000));
    expect(screen.getByRole('button',{name:'Show our belief'})).toHaveAttribute('aria-pressed','true');
    fireEvent.click(screen.getByRole('button',{name:'Show our vision'}));
    expect(screen.getByRole('button',{name:'Show our vision'})).toHaveAttribute('aria-pressed','true');
  });
  it('connects all selected product and document destinations and supports keyboard application tabs', () => {
    const {container}=show();
    expect(screen.getAllByRole('link',{name:'Explore GFCI'})[0]).toHaveAttribute('href','/products/gfci');
    expect(screen.getByRole('link',{name:/UL Listed/})).toHaveAttribute('href','/resources?family=gfci&model=GF15');
    const tabs=screen.getByRole('tablist',{name:'Application environments'});
    fireEvent.keyDown(within(tabs).getByRole('tab',{name:'Residential'}),{key:'End'});
    expect(within(tabs).getByRole('tab',{name:'Hospitality'})).toHaveAttribute('aria-selected','true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Thoughtful details. A warmer welcome.');
    expect(within(screen.getByRole('tabpanel')).getByRole('link', {name:'Explore hospitality'})).toHaveAttribute('href','/applications/hospitality');
    fireEvent.keyDown(within(tabs).getByRole('tab',{name:'Hospitality'}),{key:'ArrowLeft'});
    expect(within(screen.getByRole('tabpanel')).getByRole('link', {name:'Explore workplace'})).toHaveAttribute('href','/applications/workplace');
    expect(container.querySelector('img[src*="about-fahint-factory-v3"]')).toHaveAttribute('alt',expect.stringContaining('concept'));
    expect(container.querySelector('img[src*="/output/"]')).toBeNull();
  });
});
