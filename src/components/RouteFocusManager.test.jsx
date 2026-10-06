import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Link, MemoryRouter, useNavigate } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RouteFocusManager from './RouteFocusManager.jsx';

function RouteChangeButton() {
  const navigate = useNavigate();
  return <button onClick={() => navigate('/products/gfci')}>Open GFCI series</button>;
}

function ClearHashButton() {
  const navigate = useNavigate();
  return <button onClick={() => navigate('/products/gfci')}>Clear hash</button>;
}

describe('RouteFocusManager', () => {
  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', (callback) => {
      callback();
      return 1;
    });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    vi.stubGlobal('scrollTo', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('scrolls to the top and focuses main content after a route change', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <RouteFocusManager />
        <RouteChangeButton />
        <main id="main-content" tabIndex={-1}>Main content</main>
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: 'Open GFCI series' });
    button.focus();
    await user.click(button);

    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0 });
    expect(screen.getByText('Main content')).toHaveFocus();
  });

  it('leaves scroll and keyboard focus in place for an explicitly preserved form query change', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/contact?model=GF15']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <RouteFocusManager />
      <main id="main-content" tabIndex={-1}>
        <Link to="/contact?model=GF15&topic=oem" state={{ preserveScroll: true }}>OEM inquiry</Link>
      </main>
    </MemoryRouter>);
    vi.mocked(window.scrollTo).mockClear();
    const link = screen.getByRole('link', { name: 'OEM inquiry' });
    await user.click(link);
    expect(window.scrollTo).not.toHaveBeenCalled();
    expect(link).toHaveFocus();
  });

  it('scrolls to and focuses a hash target while respecting reduced motion', async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.fn();
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })));

    render(
      <MemoryRouter
        initialEntries={['/products/gfci#engineering-proof']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <RouteFocusManager />
        <main id="main-content" tabIndex={-1}>Main content</main>
        <ClearHashButton />
        <section id="engineering-proof" ref={(node) => { if (node) node.scrollIntoView = scrollIntoView; }}>
          Engineering proof
        </section>
      </MemoryRouter>
    );

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto' });
    expect(window.scrollTo).not.toHaveBeenCalled();
    expect(screen.getByText('Engineering proof')).toHaveFocus();
    expect(screen.getByText('Engineering proof')).toHaveAttribute('tabindex', '-1');

    await user.click(screen.getByRole('button', { name: 'Clear hash' }));

    expect(screen.getByText('Engineering proof')).not.toHaveAttribute('tabindex');
    expect(screen.getByText('Main content')).toHaveFocus();
  });

  it('falls back to the main content when a hash is not a valid selector', () => {
    render(
      <MemoryRouter
        initialEntries={['/products/gfci#%invalid']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <RouteFocusManager />
        <main id="main-content" tabIndex={-1}>Main content</main>
      </MemoryRouter>
    );

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 });
    expect(screen.getByText('Main content')).toHaveFocus();
  });

  it('revisits a chapter when the same hash link is clicked again after scrolling away', async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.fn();
    render(
      <MemoryRouter initialEntries={['/home-studio#studio-brand']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <RouteFocusManager />
        <Link to="/home-studio#studio-brand">About FAHINT</Link>
        <section id="studio-brand" ref={(node) => { if (node) node.scrollIntoView = scrollIntoView; }}>Brand introduction</section>
      </MemoryRouter>
    );

    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('link', { name: 'About FAHINT' }));
    expect(scrollIntoView).toHaveBeenCalledTimes(2);
    expect(screen.getByText('Brand introduction')).toHaveFocus();
  });
});
