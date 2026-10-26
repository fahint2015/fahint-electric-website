import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { products } from '../../data/products.js';
import RecommendedProducts from './RecommendedProducts.jsx';

afterEach(() => vi.unstubAllGlobals());

describe('RecommendedProducts', () => {
  it.each([false, true])('pages real model links, updates edge controls, and honors reduced motion: %s', reducedMotion => {
    vi.stubGlobal('matchMedia', () => ({ matches: reducedMotion }));
    render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><RecommendedProducts products={products} /></MemoryRouter>);
    const track = screen.getByRole('region', { name: 'Recommended product carousel' });
    Object.defineProperties(track, { clientWidth: { value: 800 }, scrollWidth: { value: 1400 }, scrollLeft: { value: 0, writable: true } });
    track.firstElementChild.getBoundingClientRect = () => ({ width: 200 });
    track.scrollTo = vi.fn();
    fireEvent.scroll(track);
    const previous = screen.getByRole('button', { name: 'Previous recommended products' });
    const next = screen.getByRole('button', { name: 'Next recommended products' });
    expect(previous).toBeDisabled();
    expect(next).not.toBeDisabled();
    expect(track.querySelectorAll('a')).toHaveLength(products.length);
    fireEvent.click(next);
    expect(track.scrollTo).toHaveBeenCalledWith({ left: 800, behavior: reducedMotion ? 'instant' : 'smooth' });
    track.scrollLeft = 600;
    fireEvent.scroll(track);
    expect(next).toBeDisabled();
    expect(previous).not.toBeDisabled();
    fireEvent.keyDown(track, { key: 'Home' });
    expect(track.scrollTo).toHaveBeenLastCalledWith({ left: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
    fireEvent.keyDown(track, { key: 'End' });
    expect(track.scrollTo).toHaveBeenLastCalledWith({ left: 1400, behavior: reducedMotion ? 'instant' : 'smooth' });
    Object.defineProperty(track, 'scrollLeft', { value: 0 });
  });

  it('hides paging controls when all recommendations fit', () => {
    render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><RecommendedProducts products={products.slice(0, 1)} /></MemoryRouter>);
    expect(screen.queryByRole('button', { name: 'Next recommended products' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^GF15 / })).toHaveAttribute('href', '/products/gfci/gf15/');
  });
});
