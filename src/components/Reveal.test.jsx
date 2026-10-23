import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Reveal from './Reveal.jsx';

afterEach(() => vi.unstubAllGlobals());

describe('Reveal enhancement', () => {
  it('keeps content visible when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    render(<Reveal as="section" aria-label="Chapter"><a href="#details">Explore</a></Reveal>);
    expect(screen.getByRole('region', { name: 'Chapter' })).toHaveAttribute('data-visible', 'true');
    expect(screen.getByRole('link', { name: 'Explore' })).toHaveAttribute('href', '#details');
  });

  it('replays after leaving the viewport and disconnects when unmounted', () => {
    const observers = [];
    const unobserve = vi.fn();
    const disconnect = vi.fn();
    vi.stubGlobal('IntersectionObserver', class {
      constructor(callback) { observers.push({ notify: callback }); }
      observe() {}
      unobserve = unobserve;
      disconnect = disconnect;
    });
    const { unmount } = render(<Reveal as="section" aria-label="Chapter">Content</Reveal>);
    const section = screen.getByRole('region', { name: 'Chapter' });
    const [entrance, reset] = observers;
    expect(section).not.toHaveAttribute('data-visible');
    act(() => entrance.notify([{ target: section, isIntersecting: true }]));
    expect(section).toHaveAttribute('data-visible', 'true');
    expect(unobserve).not.toHaveBeenCalled();
    act(() => entrance.notify([{ target: section, isIntersecting: false }]));
    expect(section).toHaveAttribute('data-visible', 'true');
    act(() => reset.notify([{ target: section, isIntersecting: false }]));
    expect(section).not.toHaveAttribute('data-visible');
    act(() => entrance.notify([{ target: section, isIntersecting: true }]));
    expect(section).toHaveAttribute('data-visible', 'true');
    act(() => reset.notify([{ target: section, isIntersecting: false }]));
    expect(section).not.toHaveAttribute('data-visible');
    unmount();
    expect(disconnect).toHaveBeenCalledTimes(2);
  });

  it('keeps a focused link visible even when the observer reports it outside the viewport', () => {
    const observers = [];
    vi.stubGlobal('IntersectionObserver', class {
      constructor(callback) { observers.push(callback); }
      observe() {}
      disconnect() {}
    });
    render(<Reveal as="section" aria-label="Chapter"><a href="#details">Explore</a></Reveal>);
    const section = screen.getByRole('region', { name: 'Chapter' });
    const link = screen.getByRole('link', { name: 'Explore' });
    const notifyReset = observers[1];
    act(() => link.focus());
    act(() => notifyReset([{ target: section, isIntersecting: false }]));
    expect(link).toHaveFocus();
    expect(section).toHaveAttribute('data-visible', 'true');
    act(() => link.blur());
    act(() => notifyReset([{ target: section, isIntersecting: false }]));
    expect(section).not.toHaveAttribute('data-visible');
  });

  it('reveals immediately on keyboard focus and preserves the caller focus handler', () => {
    vi.stubGlobal('IntersectionObserver', class {
      observe() {}
      disconnect() {}
    });
    const onFocus = vi.fn();
    render(<Reveal as="section" aria-label="Chapter" onFocusCapture={onFocus}><a href="#details">Explore</a></Reveal>);
    const section = screen.getByRole('region', { name: 'Chapter' });
    expect(section).not.toHaveAttribute('data-visible');
    fireEvent.focus(screen.getByRole('link', { name: 'Explore' }));
    expect(section).toHaveAttribute('data-visible', 'true');
    expect(onFocus).toHaveBeenCalledOnce();
  });
});
