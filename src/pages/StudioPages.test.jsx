import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import HomeStudio from './HomeStudio.jsx';
import StudioApplicationMap from '../components/studio/StudioApplicationMap.jsx';
import ProductsStudio from './ProductsStudio.jsx';
import Header from '../components/Header.jsx';
import { productLines } from '../data/lines.js';
import { products } from '../data/products.js';
import { getCatalogProducts } from '../data/catalogProducts.js';
import { certificates } from '../data/certificates.js';
import { company, faqs } from '../data/company.js';
import { publicAsset } from '../utils/publicAsset.js';
import { studioRanges } from '../data/studioCatalog.js';
import userEvent from '@testing-library/user-event';
import { publicAssetFile } from '../test/publicAssetFile.js';

const installedCategories = [
  ['gfci', 'gf15-kitchen-installed-v1.webp'],
  ['usb-outlets', 'ftr15qc-dc65w-desk-installed-v1.webp'],
  ['dimmers', 'dm2010-living-installed-v1.webp'],
  ['receptacles', 'r15-reading-corner-installed-v1.webp'],
  ['smart-switches', 'usw8811-bedside-installed-v1.webp'],
  ['lighting-switches', 'ds15-hallway-installed-v1.webp']
];

function show(Component, path = '/home-studio') {
  return render(<MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Component /></MemoryRouter>);
}

describe('studio homepage and catalog', () => {
  it('publishes the completed homepage and catalog while preserving local review routes', () => {
    const source = readFileSync('src/App.jsx', 'utf8');
    for (const route of ['path="/" element={<HomeStudio />}', 'path="/products" element={<ProductsStudio />}']) expect(source).toContain(route);
    expect(source).toContain('{import.meta.env.DEV && <Route path="/home-next"');
    expect(source).toContain('{import.meta.env.DEV && <Route path="/home-legacy"');
    expect(source).toContain('{import.meta.env.DEV && <Route path="/products-legacy"');
    expect(source).toContain('path="/home-studio" element={<HomeStudio />}');
    expect(source).toContain('path="/products-studio" element={<ProductsStudio />}');
  });

  it('directs preview navigation to the published pages', () => {
    show(Header, '/products-studio');
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /^Products/ })).toHaveAttribute('href', '/products');
  });

  it('connects the studio homepage header inquiry button to its own form', () => {
    show(Header);
    expect(screen.getByRole('link', { name: 'Send Inquiry' })).toHaveAttribute('href', '/#studio-inquiry');
  });

  it('introduces the brand and gives six homepage categories a direct entrance', () => {
    show(HomeStudio);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Wiring devices. Built for your market.');
    const list = screen.getByRole('list', { name: 'Product categories' });
    for (const [slug] of installedCategories) {
      const line = productLines.find(line => line.slug === slug);
      expect(within(list).getByRole('link', { name: `Explore ${line.name}` })).toHaveAttribute('href', `/products/${slug}`);
    }
    expect(screen.getByRole('link', { name: 'Explore FAHINT products' })).toHaveAttribute('href', '/products');
  });

  it('switches between the three real application scenes without a floating product card', () => {
    show(HomeStudio);
    fireEvent.click(screen.getByRole('button', { name: 'Bedside charging' }));
    expect(screen.getByRole('button', { name: 'Bedside charging' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByRole('link', { name: 'Explore the featured product family' })).not.toBeInTheDocument();
  });

  it('uses the supplied scene posters', () => {
    const { container } = show(HomeStudio);
    const sources = [...container.querySelectorAll('.studio-hero__photo img')]
      .map((image) => image.getAttribute('src'));

    expect(sources).toEqual([
      publicAsset('assets/images/editorial-products/home-hero-kitchen-scene-v2.webp'),
      publicAsset('assets/images/editorial-products/home-hero-bedside-scene-v2.webp'),
      publicAsset('assets/images/editorial-products/home-hero-lighting-scene-v3.webp')
    ]);
  });

  it('prioritizes the active poster without competing category and inactive scene downloads', () => {
    const { container } = show(HomeStudio);
    const images = [...container.querySelectorAll('.studio-hero__photo img')];
    expect(images.map(image => image.getAttribute('fetchpriority'))).toEqual(['high', 'low', 'low']);
    expect(images.map(image => image.getAttribute('loading'))).toEqual(['eager', 'lazy', 'lazy']);
    for (const image of container.querySelectorAll('.studio-selection-card img')) {
      expect(image).toHaveAttribute('loading', 'lazy');
      expect(image).toHaveAttribute('fetchpriority', 'low');
    }
    fireEvent.click(screen.getByRole('button', { name: 'Bedside charging' }));
    expect(images.map(image => image.getAttribute('fetchpriority'))).toEqual(['low', 'high', 'low']);
    expect(images[1]).toHaveAttribute('loading', 'eager');
  });

  it('separates the application scene and company story with a navy chapter band only', () => {
    const { container } = show(HomeStudio);
    const map = container.querySelector('.studio-application-map');
    const transition = map.nextElementSibling;
    expect(transition).toHaveClass('studio-brand-transition');
    expect(transition).toHaveTextContent('Inside FAHINT');
    expect(transition.nextElementSibling).toHaveClass('studio-brand');
    expect(transition.querySelector('a, button, [tabindex]')).toBeNull();
    expect(map.previousElementSibling).toHaveClass('studio-product-transition');
    expect(within(map.previousElementSibling).getByRole('list', { name: 'Product categories' })).toBeInTheDocument();

    const css = readFileSync('src/styles/studio.css', 'utf8');
    expect(css).not.toMatch(/\.studio-application-map\s*\+\s*\.studio-brand\s*\{[^}]*margin-top/);
    expect(css).toMatch(/\.studio-brand-transition\s*\{[^}]*min-height:\s*clamp\(104px, 8vw, 120px\)[^}]*background:\s*var\(--studio-navy\)/);
    expect(css).toMatch(/@media \(max-width:\s*760px\)[\s\S]*?\.studio-brand-transition\s*\{[^}]*min-height:\s*72px/);
    expect(css).toMatch(/\.studio-application-map__stage::after\s*\{[^}]*background:\s*linear-gradient\(180deg[^}]*var\(--studio-navy\)[^}]*pointer-events:\s*none/);
  });

  it('integrates a readable chapter index into the collection instead of a separate navigation strip', () => {
    const { container } = show(HomeStudio);
    const collection = container.querySelector('.studio-product-transition');
    const nav = screen.getByRole('navigation', { name: 'Homepage sections' });
    expect(collection.previousElementSibling).toHaveClass('studio-hero');
    expect(nav.parentElement).toBe(collection);
    expect(nav.nextElementSibling).toHaveClass('studio-collection');
    expect(collection.nextElementSibling).toHaveClass('studio-application-map');
    expect(within(nav).getAllByRole('link').map(link => link.getAttribute('href'))).toEqual([
      '/#studio-collection', '/#studio-brand', '/#studio-oem', '/#studio-making', '/#studio-certificates', '/#studio-inquiry'
    ]);
    expect(within(collection).queryByRole('tablist')).not.toBeInTheDocument();
    expect(within(collection).getAllByRole('listitem')).toHaveLength(6);
    const backdrop = collection.querySelector('.studio-product-transition__scene');
    expect(backdrop).toHaveAttribute('src', publicAsset('assets/images/home-installations/home-interior-background-v1.webp'));
    expect(backdrop).toHaveAttribute('alt', '');
    expect(backdrop).toHaveAttribute('aria-hidden', 'true');
    expect(backdrop).toHaveAttribute('loading', 'lazy');

    const css = readFileSync('src/styles/studio.css', 'utf8');
    const surface = css.match(/\.studio-product-transition\s*\{([^}]+)\}/)[1];
    expect(surface).toMatch(/background:\s*#20272b/);
    expect(surface).toMatch(/padding-top:\s*clamp\(40px, 5vw, 72px\)/);
    expect(surface).toMatch(/--studio-muted:\s*#bfd0dd/);
    expect(surface).toMatch(/--studio-blue:\s*#a7d2e2/);
    expect(surface).toMatch(/color:\s*#f6f9fb/);
    expect(surface).toMatch(/isolation:\s*isolate/);
    expect(surface).not.toMatch(/margin-top:\s*-|border-radius:/);
    expect(css).not.toMatch(/\.studio-product-transition\s*,/);
    const heroShade = css.match(/\.studio-hero::before\s*\{([^}]+)\}/)[1];
    expect(heroShade).toMatch(/position:\s*absolute;\s*inset:\s*0;/);
    expect(heroShade).toContain('linear-gradient(90deg');
    expect(heroShade).toMatch(/pointer-events:\s*none/);
    const shade = css.match(/\.studio-product-transition::before\s*\{([^}]+)\}/)[1];
    expect(shade).toMatch(/background:\s*rgba\(18,24,27,\.54\)/);
    expect(shade).not.toContain('gradient');
    expect(shade).toMatch(/pointer-events:\s*none/);
    const navigation = css.match(/\.studio-chapter-nav\s*\{([^}]+)\}/)[1];
    expect(navigation).toMatch(/width:\s*min\(calc\(100% - var\(--studio-gutter\) \* 2\), 1600px\)/);
    expect(navigation).toMatch(/margin-inline:\s*auto/);
    expect(navigation).toMatch(/background:\s*transparent/);
    expect(navigation).toMatch(/--studio-muted:\s*#c5d3db/);
    expect(navigation).not.toContain('gradient');
    expect(navigation).toMatch(/border-bottom:\s*1px solid var\(--studio-line\)/);
    expect(css).toMatch(/\.studio-chapter-nav > a\s*\{[^}]*min-height:\s*48px[^}]*font-size:\s*18px/);
    expect(css).toMatch(/\.studio-chapter-nav > a:last-child\s*\{[^}]*border:\s*1px solid/);
    expect(css).toMatch(/\.studio-product-transition__scene\s*\{[^}]*opacity:\s*\.55/);
    const spacing = css.match(/\.studio-home \.studio-collection\s*\{([^}]+)\}/)[1];
    expect(spacing).toMatch(/padding-top:\s*clamp\(48px, 5vw, 72px\)/);
  });

  it('restores the original hero-only bottom shade and unboxed scene controls', () => {
    const { container } = show(HomeStudio);
    const controls = container.querySelector('.studio-scene-switch');
    expect(within(controls).getAllByRole('button').map(button => button.textContent)).toEqual([
      'Kitchen essentials', 'Bedside charging', 'Lighting control'
    ]);
    const css = readFileSync('src/styles/studio.css', 'utf8');
    const heroShade = css.match(/\.studio-hero::before\s*\{([^}]+)\}/)[1];
    expect(heroShade).toContain('linear-gradient(0deg, #0313249c 0%, transparent 35%)');
    const sceneControls = css.match(/\.studio-scene-switch\s*\{([^}]+)\}/)[1];
    expect(sceneControls).toMatch(/background:\s*transparent/);
    expect(sceneControls).toMatch(/padding:\s*0/);
    expect(sceneControls).toMatch(/gap:\s*32px/);
    expect(css).toMatch(/\.studio-scene-switch button\s*\{[^}]*background:\s*transparent/);
    const sceneButton = css.match(/\.studio-scene-switch button\s*\{([^}]+)\}/)[1];
    expect(sceneButton).not.toContain('text-shadow');
    expect(css).toMatch(/\.studio-scene-switch button::after\s*\{[^}]*height:\s*2px/);
  });

  it('uses straight non-overlapping manufacturing and inquiry section edges on desktop and mobile', () => {
    const css = readFileSync('src/styles/studio.css', 'utf8');
    for (const selector of [/\.studio-home \.studio-making\s*\{([^}]+)\}/, /\.studio-inquiry\s*\{([^}]+)\}/]) {
      const rule = css.match(selector)[1];
      expect(rule).toMatch(/border-radius:\s*0\s*;/);
      expect(rule).toMatch(/margin-top:\s*0\s*;/);
    }
    expect(css).not.toMatch(/\.studio-home \.studio-making, \.studio-inquiry\s*\{[^}]*border-radius:\s*20px/);
    expect(css).toMatch(/\.studio-inquiry \.form-card\s*\{[^}]*border-radius:\s*16px/);
  });

  it('uses a three-per-row editorial mosaic with complete photographs and equal tablet columns', () => {
    const css = readFileSync('src/styles/studio.css', 'utf8');
    expect(css).not.toContain('.studio-family-tabs');
    expect(css).toMatch(/\.studio-product-transition :focus-visible\s*\{[^}]*outline-color:\s*var\(--studio-blue\)/);

    const card = css.match(/\.studio-selection-card\s*\{([^}]+)\}/)[1];
    expect(card).toMatch(/background:\s*transparent/);
    expect(card).not.toMatch(/border:|border-radius:/);
    const stage = css.match(/\.studio-selection-card__image\s*\{([^}]+)\}/)[1];
    expect(stage).toMatch(/background:\s*#fff/);
    expect(stage).toMatch(/aspect-ratio:\s*3\s*\/\s*2/);
    expect(stage).toMatch(/border-radius:\s*12px/);
    const image = css.match(/\.studio-selection-card__image img\s*\{([^}]+)\}/)[1];
    expect(image).toMatch(/height:\s*100%/);
    expect(image).toMatch(/object-fit:\s*contain/);
    expect(image).toMatch(/mix-blend-mode:\s*normal/);
    expect(css).toMatch(/\.studio-selection-grid\s*\{[^}]*grid-template-columns:\s*repeat\(12, minmax\(0, 1fr\)\)/);
    expect(css).toMatch(/\.studio-selection-grid > li\s*\{[^}]*grid-column:\s*span 4/);
    expect(css).toMatch(/\.studio-selection-grid > li:nth-child\(1\), \.studio-selection-grid > li:nth-child\(5\)\s*\{[^}]*grid-column:\s*span 5/);
    expect(css).toMatch(/\.studio-selection-grid > li:nth-child\(3\), \.studio-selection-grid > li:nth-child\(4\)\s*\{[^}]*grid-column:\s*span 3/);
    expect(css).toMatch(/\.studio-collection \.studio-section-head\s*\{[^}]*text-align:\s*left/);
    expect(css).toMatch(/@media \(max-width:\s*1150px\)[\s\S]*?\.studio-selection-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
    expect(css).toMatch(/@media \(max-width:\s*1150px\)[\s\S]*?\.studio-selection-grid > li:nth-child\(n\)\s*\{[^}]*grid-column:\s*auto/);
    expect(css).toMatch(/@media \(max-width:\s*760px\)[\s\S]*?\.studio-selection-grid\s*\{[^}]*grid-template-columns:\s*1fr/);
    expect(css).not.toMatch(/\.studio-selection-card__image img\s*\{[^}]*height:\s*\d+px/);
  });

  it('shows six installation photographs in the approved category order without Wallplates', () => {
    show(HomeStudio);
    const list = screen.getByRole('list', { name: 'Product categories' });
    const cards = within(list).getAllByRole('listitem');
    expect(cards).toHaveLength(6);
    expect(within(list).getAllByRole('heading').map(heading => heading.textContent))
      .toEqual(installedCategories.map(([slug]) => productLines.find(line => line.slug === slug).name));
    installedCategories.forEach(([slug, imageName], index) => {
      const line = productLines.find(line => line.slug === slug);
      const card = cards[index];
      const image = within(card).getByRole('img', { name: /illustrative installation/i });
      expect(image).toHaveAttribute('src', publicAsset(`assets/images/home-installations/${imageName}`));
      expect(image).toHaveAttribute('width', '1536');
      expect(image).toHaveAttribute('height', '1024');
      expect(image).toHaveAttribute('loading', 'lazy');
      expect(within(card).getByRole('link', { name: `Explore ${line.name}` })).toHaveAttribute('href', `/products/${slug}`);
    });
    expect(within(list).queryByText('Wallplates')).not.toBeInTheDocument();
    expect(productLines.find(line => line.slug === 'wallplates')).toBeDefined();
  });

  it('keeps the hero within the first viewport and aligns the scene controls on the right', () => {
    const css = readFileSync('src/styles/studio.css', 'utf8');
    expect(css).toMatch(/\.studio-hero\s*\{[^}]*min-height:\s*100(?:svh|dvh)/s);
    expect(css).toMatch(/\.studio-hero__bottom\s*\{[^}]*justify-content:\s*flex-end/s);
  });

  it('rotates the three hero scenes every five seconds and restarts after a manual choice', () => {
    vi.useFakeTimers();
    try {
      show(HomeStudio);
      expect(screen.getByRole('button', { name: 'Kitchen essentials' })).toHaveAttribute('aria-pressed', 'true');

      act(() => vi.advanceTimersByTime(5000));
      expect(screen.getByRole('button', { name: 'Bedside charging' })).toHaveAttribute('aria-pressed', 'true');

      fireEvent.click(screen.getByRole('button', { name: 'Kitchen essentials' }));
      act(() => vi.advanceTimersByTime(4999));
      expect(screen.getByRole('button', { name: 'Kitchen essentials' })).toHaveAttribute('aria-pressed', 'true');
      act(() => vi.advanceTimersByTime(1));
      expect(screen.getByRole('button', { name: 'Bedside charging' })).toHaveAttribute('aria-pressed', 'true');
    } finally {
      vi.useRealTimers();
    }
  });

  it('pauses the hero rotation while a visitor is interacting with it', () => {
    vi.useFakeTimers();
    try {
      show(HomeStudio);
      const hero = screen.getByRole('region', { name: 'Wiring devices. Built for your market.' });
      fireEvent.mouseEnter(hero);
      act(() => vi.advanceTimersByTime(10000));
      expect(screen.getByRole('button', { name: 'Kitchen essentials' })).toHaveAttribute('aria-pressed', 'true');

      fireEvent.mouseLeave(hero);
      act(() => vi.advanceTimersByTime(5000));
      expect(screen.getByRole('button', { name: 'Bedside charging' })).toHaveAttribute('aria-pressed', 'true');
    } finally {
      vi.useRealTimers();
    }
  });

  it('does not auto-rotate when the visitor prefers reduced motion', () => {
    vi.useFakeTimers();
    const originalMatchMedia = window.matchMedia;
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      })
    });
    try {
      show(HomeStudio);
      act(() => vi.advanceTimersByTime(10000));
      expect(screen.getByRole('button', { name: 'Kitchen essentials' })).toHaveAttribute('aria-pressed', 'true');
    } finally {
      Object.defineProperty(window, 'matchMedia', { configurable: true, value: originalMatchMedia });
      vi.useRealTimers();
    }
  });

  it('stops the hero timer while the poster is outside the viewport', () => {
    vi.useFakeTimers();
    const OriginalIntersectionObserver = window.IntersectionObserver;
    class HiddenHeroObserver {
      constructor(callback) { this.callback = callback; }
      observe(target) { this.callback([{ isIntersecting: false, target }]); }
      disconnect() {}
    }
    Object.defineProperty(window, 'IntersectionObserver', { configurable: true, value: HiddenHeroObserver });
    try {
      show(HomeStudio);
      act(() => vi.advanceTimersByTime(10000));
      expect(screen.getByRole('button', { name: 'Kitchen essentials' })).toHaveAttribute('aria-pressed', 'true');
    } finally {
      Object.defineProperty(window, 'IntersectionObserver', { configurable: true, value: OriginalIntersectionObserver });
      vi.useRealTimers();
    }
  });

  it('groups the hero actions around project buyers and private-label brands', () => {
    show(HomeStudio);
    const hero = screen.getByRole('region', { name: 'Wiring devices. Built for your market.' });
    const projects = within(hero).getByRole('group', { name: 'For your projects' });
    const brands = within(hero).getByRole('group', { name: 'For your brand' });
    expect(within(projects).getByRole('link', { name: 'Explore FAHINT products' })).toHaveAttribute('href', '/products');
    expect(within(brands).getByRole('link', { name: 'Build a range with us' })).toHaveAttribute('href', '/#studio-oem');
    expect(within(hero).getByText(/North American wiring devices/)).toBeInTheDocument();
    expect(within(hero).getByText(`${productLines.length} product families`)).toBeInTheDocument();
    expect(within(hero).getByText('Model-specific documentation')).toBeInTheDocument();
  });

  it('removes model codes, facts, footnotes, selector UI and duplicate actions from the homepage collection', () => {
    show(HomeStudio);
    const section = screen.getByRole('region', { name: 'Find the right device.' });
    expect(within(section).getAllByRole('link')).toHaveLength(6);
    expect(section.querySelector('button, [role="tab"], [role="tabpanel"], dl, p, .studio-selection-sku')).toBeNull();
    for (const removed of ['GF15', 'FTR15QC-DC65W', 'DM2010', 'Featured installations', 'Three everyday settings', 'Installation scenes are illustrative', 'Request a quote', 'Wallplates']) {
      expect(section).not.toHaveTextContent(removed);
    }
  });

  it('centers the desktop hero copy above the scene controls without positional offsets and preserves mobile flow', () => {
    const css = readFileSync('src/styles/studio.css', 'utf8');
    const layout = css.match(/\.studio-hero__layout\s*\{([^}]+)\}/)[1];
    expect(layout).toMatch(/display:\s*flex/);
    expect(layout).toMatch(/flex-direction:\s*column/);
    expect(layout).toMatch(/justify-content:\s*flex-start/);
    expect(layout).toMatch(/min-height:\s*inherit/);
    const copy = css.match(/\.studio-hero__copy\s*\{([^}]+)\}/)[1];
    expect(copy).toMatch(/margin-block:\s*auto/);
    expect(copy).not.toMatch(/transform:|position:\s*absolute|top:/);
    const mobileCopy = css.match(/@media \(max-width:\s*760px\)\s*\{[\s\S]*?\.studio-hero__copy\s*\{([^}]+)\}/)[1];
    expect(mobileCopy).toMatch(/margin-block:\s*0/);
    expect(mobileCopy).toMatch(/grid-row:\s*2/);
    expect(css).toMatch(/@media \(max-width:\s*760px\)\s*\{[\s\S]*?\.studio-hero__layout\s*\{[^}]*display:\s*contents/);
  });

  it('keeps all six chapter links visible in a wrapping phone index', () => {
    const css = readFileSync('src/styles/studio.css', 'utf8');
    expect(css).toMatch(/@media \(max-width:\s*760px\)[\s\S]*?\.studio-chapter-nav\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/);
    expect(css).toMatch(/\.studio-chapter-nav > a\s*\{[^}]*white-space:\s*normal/);
    expect(css).not.toMatch(/\.studio-chapter-nav\s*\{[^}]*overflow-x:\s*auto/);
  });

  it('pairs each category name with a decorative action and bounded hover feedback', () => {
    show(HomeStudio);
    const list = screen.getByRole('list', { name: 'Product categories' });
    for (const link of within(list).getAllByRole('link')) {
      expect(link.querySelector('.studio-selection-card__action')).toHaveAttribute('aria-hidden', 'true');
      expect(link.querySelector('.studio-selection-card__action svg')).not.toBeNull();
      expect(link.querySelector('button, a')).toBeNull();
    }
    const css = readFileSync('src/styles/studio.css', 'utf8');
    expect(css).toMatch(/\.studio-selection-card__action\s*\{[^}]*width:\s*44px[^}]*height:\s*44px/);
    expect(css).toMatch(/@media \(hover:\s*hover\) and \(pointer:\s*fine\)[\s\S]*?\.studio-selection-card:hover \.studio-selection-card__image img\s*\{[^}]*filter:\s*brightness\(1\.05\)/);
    expect(css).toContain('.studio-selection-card:focus-visible .studio-selection-card__action');
  });

  it('overlays transparent mobile controls on the complete poster above the introduction', () => {
    const css = readFileSync('src/styles/studio.css', 'utf8');
    const mobile = css.match(/@media \(max-width:\s*760px\)\s*\{\s*\.studio-page[\s\S]*?\n\}/)[0];
    const rule = selector => mobile.match(new RegExp(`${selector}\\s*\\{([^}]+)\\}`))[1];
    expect(rule('\\.studio-hero')).toMatch(/display:\s*grid/);
    expect(rule('\\.studio-hero')).toMatch(/grid-template-columns:\s*minmax\(0, 1fr\)/);
    expect(rule('\\.studio-hero')).toMatch(/padding-top:\s*0/);
    const photo = rule('\\.studio-hero__photo');
    expect(photo).toMatch(/grid-area:\s*1\s*\/\s*1/);
    expect(photo).toMatch(/position:\s*relative/);
    expect(photo).toMatch(/aspect-ratio:\s*3\s*\/\s*2/);
    expect(rule('\\.studio-hero__photo img')).toMatch(/object-fit:\s*contain/);
    const controls = rule('\\.studio-hero__bottom');
    expect(controls).toMatch(/grid-area:\s*1\s*\/\s*1/);
    expect(controls).toMatch(/align-self:\s*end/);
    expect(controls).toMatch(/z-index:\s*1/);
    expect(controls).toMatch(/background:\s*transparent/);
    expect(controls).toMatch(/padding:\s*4px var\(--studio-gutter\) 12px/);
    const copy = rule('\\.studio-hero__copy');
    expect(copy).toMatch(/grid-row:\s*2/);
    expect(copy).toMatch(/width:\s*100%/);
    expect(copy).toMatch(/background:\s*var\(--studio-paper\)/);
    expect(copy).toMatch(/padding:\s*24px var\(--studio-gutter\) 28px/);
    expect(copy).not.toContain('--header-h');
    expect(rule('\\.studio-hero__copy h1')).toMatch(/color:\s*var\(--studio-ink\)/);
    expect(css).not.toMatch(/\.studio-home \.studio-hero__bottom\s*\{[^}]*padding-bottom:\s*46px/);
  });

  it('keeps the mobile poster menu and scene labels readable without solid backgrounds', () => {
    const css = readFileSync('src/styles/studio.css', 'utf8');
    const mobile = css.match(/@media \(max-width:\s*760px\)\s*\{\s*\.studio-page[\s\S]*?\n\}/)[0];
    expect(mobile).toMatch(/\.header--home\.header--transparent \.burger\s*\{[^}]*background:\s*transparent[^}]*color:\s*#fff/);
    expect(mobile).toMatch(/\.studio-scene-switch button\s*\{[^}]*color:\s*#fff[^}]*text-shadow:/);
    expect(mobile).not.toMatch(/\.header--home\.header--solid[^{}]*\{[^}]*background:\s*transparent/);
  });

  it('simplifies mobile copy and actions without changing the desktop message or scene labels', () => {
    const { container } = show(HomeStudio);
    const summary = container.querySelector('.studio-hero__summary');
    expect(summary).toHaveTextContent('Explore outlets, switches and wall plates for homes and commercial spaces. Choose FAHINT products, or work with us on your own brand.');
    expect(summary.querySelector('.studio-hero__program-summary')).toHaveTextContent('Choose FAHINT products, or work with us on your own brand.');
    expect(container.querySelector('.studio-hero__evidence-detail')).toHaveTextContent('Model-specific documentation');
    const css = readFileSync('src/styles/studio.css', 'utf8');
    const mobile = css.match(/@media \(max-width:\s*760px\)\s*\{\s*\.studio-page[\s\S]*?\n\}/)[0];
    expect(mobile).toMatch(/\.studio-hero__program-summary\s*\{[^}]*display:\s*none/);
    expect(mobile).toMatch(/\.studio-hero__paths > div > span\s*\{[^}]*display:\s*none/);
    expect(mobile).toMatch(/\.studio-hero__evidence > \.studio-hero__evidence-detail\s*\{[^}]*display:\s*none/);
    expect(mobile).toMatch(/\.studio-hero__paths\s*\{[^}]*grid-template-columns:\s*1fr[^}]*border-top:\s*0/);
    expect(mobile).toMatch(/\.studio-hero__paths \.studio-button\s*\{[^}]*width:\s*100%[^}]*border-radius:\s*8px[^}]*background:\s*var\(--studio-navy\)[^}]*color:\s*#fff/);
    expect(mobile).toMatch(/\.studio-scene-switch\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/);
    expect(mobile).toMatch(/\.studio-scene-switch button\s*\{[^}]*min-height:\s*44px/);
  });

  it('maps four verified products to real residential locations', async () => {
    const user = userEvent.setup();
    show(HomeStudio);
    const section = screen.getByRole('region', { name: 'Power, room by room.' });
    const expected = [
      ['GF15 GFCI Outlet', '/products/gfci/gf15'],
      ['FTR15C-3100 USB Outlet', '/products/usb-outlets/ftr15c-3100'],
      ['DM2010 Digital Dimmer', '/products/dimmers/dm2010'],
      ['DS15 Paddle Switch', '/products/lighting-switches/ds15']
    ];

    expect(within(section).getByRole('img', { name: /cutaway North American home/i }))
      .toHaveAttribute('src', publicAsset('assets/images/editorial-home/fahint-residential-application-map-v1.webp'));
    const hotspots = within(section).getAllByRole('button', { name: /^Show / });
    expect(hotspots).toHaveLength(4);
    for (const [name, href] of expected) {
      const button = within(section).getByRole('button', { name: `Show ${name}` });
      expect(button).toHaveAttribute('aria-expanded', 'false');
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(within(section).getByRole('link', { name: `View ${name}` })).toHaveAttribute('href', href);
    }
  });

  it('keeps inactive application cards out of the visual layout', () => {
    const css = readFileSync('src/styles/studio.css', 'utf8');
    expect(css).toMatch(/\.studio-map-card\[hidden\]\s*\{[^}]*display:\s*none/s);
    expect(css).toMatch(/@media \(min-width:\s*901px\) and \(max-width:\s*1100px\)[\s\S]*?\.studio-application-map\s*\{[^}]*min-height:\s*56\.25vw/s);
    expect(css).toMatch(/@media \(max-width:\s*900px\)[\s\S]*?\.studio-application-map__stage\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*9/s);
  });

  it('closes each application card after leaving its hotspot without leaving the room section', () => {
    vi.useFakeTimers();
    try {
      show(StudioApplicationMap);
      const section = screen.getByRole('region', { name: 'Power, room by room.' });
      for (const button of within(section).getAllByRole('button')) {
        fireEvent.mouseEnter(button);
        expect(button).toHaveAttribute('aria-expanded', 'true');
        fireEvent.mouseLeave(button, { relatedTarget: section });
        expect(button).toHaveAttribute('aria-expanded', 'true');
        act(() => vi.advanceTimersByTime(200));
        expect(button).toHaveAttribute('aria-expanded', 'false');
        expect(within(section).queryByRole('link', { name: /^View / })).not.toBeInTheDocument();
      }
    } finally {
      vi.useRealTimers();
    }
  });

  it('allows crossing into a card and switching hotspots without a stale close timer', () => {
    vi.useFakeTimers();
    try {
      show(StudioApplicationMap);
      const section = screen.getByRole('region', { name: 'Power, room by room.' });
      const [first, second] = within(section).getAllByRole('button');
      fireEvent.mouseEnter(first);
      fireEvent.mouseLeave(first, { relatedTarget: section });
      act(() => vi.advanceTimersByTime(80));
      const card = within(section).getByRole('article');
      fireEvent.mouseEnter(card);
      act(() => vi.advanceTimersByTime(400));
      expect(within(card).getByRole('link')).toBeVisible();
      fireEvent.mouseLeave(card, { relatedTarget: section });
      act(() => vi.advanceTimersByTime(80));
      fireEvent.mouseEnter(second);
      act(() => vi.advanceTimersByTime(200));
      expect(first).toHaveAttribute('aria-expanded', 'false');
      expect(second).toHaveAttribute('aria-expanded', 'true');

      act(() => second.focus());
      fireEvent.click(second);
      fireEvent.mouseLeave(second, { relatedTarget: section });
      const secondCard = within(section).getByRole('article');
      fireEvent.mouseEnter(secondCard);
      fireEvent.mouseLeave(secondCard, { relatedTarget: section });
      act(() => vi.advanceTimersByTime(200));
      expect(second).toHaveAttribute('aria-expanded', 'false');
    } finally {
      vi.useRealTimers();
    }
  });

  it('keeps a keyboard-focused product link available and supports Escape and focus dismissal', () => {
    vi.useFakeTimers();
    try {
      show(StudioApplicationMap);
      const section = screen.getByRole('region', { name: 'Power, room by room.' });
      const button = within(section).getAllByRole('button')[0];
      act(() => button.focus());
      const link = within(section).getByRole('link');
      act(() => link.focus());
      fireEvent.mouseLeave(section);
      act(() => vi.advanceTimersByTime(200));
      expect(link).toBeVisible();
      expect(link).toHaveFocus();
      fireEvent.keyDown(link, { key: 'Escape' });
      expect(button).toHaveFocus();
      expect(button).toHaveAttribute('aria-expanded', 'false');
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
      act(() => button.blur());
      expect(button).toHaveAttribute('aria-expanded', 'false');
    } finally {
      vi.useRealTimers();
    }
  });

  it('cleans up a pending application-card close when the component unmounts', () => {
    vi.useFakeTimers();
    try {
      const { unmount } = show(StudioApplicationMap);
      const section = screen.getByRole('region', { name: 'Power, room by room.' });
      const button = within(section).getAllByRole('button')[0];
      const timersBeforeLeave = vi.getTimerCount();
      fireEvent.mouseEnter(button);
      fireEvent.mouseLeave(button, { relatedTarget: section });
      expect(vi.getTimerCount()).toBe(timersBeforeLeave + 1);
      unmount();
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it('enlarges the application dots and hit areas while keeping them centered on their locations', () => {
    const css = readFileSync('src/styles/studio.css', 'utf8');
    for (const selector of [/\.studio-map-location\s*\{([^}]+)\}/, /\.studio-map-hotspot\s*\{([^}]+)\}/]) {
      expect(css.match(selector)[1]).toMatch(/width:\s*56px;\s*height:\s*56px/);
    }
    expect(css).toMatch(/\.studio-map-location\s*\{[^}]*transform:\s*translate\(-50%, -50%\)/);
    expect(css).toMatch(/\.studio-map-hotspot > span\s*\{[^}]*width:\s*20px;\s*height:\s*20px/);
  });

  it('makes each category one native keyboard link with no nested or duplicate controls', async () => {
    const user = userEvent.setup();
    show(HomeStudio);
    const links = within(screen.getByRole('list', { name: 'Product categories' })).getAllByRole('link');
    links[0].focus();
    for (const link of links.slice(1)) {
      await user.tab();
      expect(link).toHaveFocus();
    }
    for (const link of links) expect(link.querySelector('a, button, [tabindex]')).toBeNull();
  });

  it('introduces FAHINT and its company in place of the single-product finish demo', () => {
    show(HomeStudio);
    const section = screen.getByRole('region', { name: 'Everyday power. Made by FAHINT.' });
    expect(within(section).getByRole('heading', { name: company.name })).toBeInTheDocument();
    expect(within(section).getByText(/Based in Wenzhou, China/)).toHaveTextContent('North American market');
    expect(within(section).getByText('FAHINT products')).toBeInTheDocument();
    expect(within(section).getByText('Your brand, our manufacturing')).toBeInTheDocument();
    const companyPhoto = within(section).getByRole('img', { name: 'FAHINT product display wall in the sample showroom, with corrected perspective' });
    expect(companyPhoto).toHaveAttribute('src', publicAsset('assets/images/company/fahint-showroom-front-v1.webp'));
    expect(companyPhoto).toHaveAttribute('width', '1920');
    expect(companyPhoto).toHaveAttribute('height', '1080');
    expect(section.querySelector('figcaption')).toHaveTextContent('Sample showroom · Wenzhou, China');
    expect(readFileSync('src/styles/studio.css', 'utf8')).toMatch(/\.studio-brand-panel\s*\{[^}]*margin-inline-start:\s*auto\s*;/);
    expect(within(section).queryByRole('img', { name: /FAHINT collection of/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'The finish is personal.' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Preview White' })).not.toBeInTheDocument();
  });

  it('connects the brand introduction to company details and the existing OEM chapter', () => {
    show(HomeStudio);
    const section = screen.getByRole('region', { name: 'Everyday power. Made by FAHINT.' });
    expect(within(section).getByRole('link', { name: 'Get to know FAHINT' })).toHaveAttribute('href', '/about');
    expect(within(section).getByRole('link', { name: 'Explore OEM / ODM' })).toHaveAttribute('href', '/#studio-oem');
    const nav = screen.getByRole('navigation', { name: 'Homepage sections' });
    expect(within(nav).getByRole('link', { name: 'About FAHINT' })).toHaveAttribute('href', '/#studio-brand');
    expect(within(nav).queryByRole('link', { name: 'Finishes' })).not.toBeInTheDocument();
  });

  it('has real local images/documents and explicit certification scope', () => {
    const { container } = show(HomeStudio);
    for (const img of container.querySelectorAll('img')) expect(existsSync(publicAssetFile(img.getAttribute('src')))).toBe(true);
    for (const link of container.querySelectorAll('a[href$=".pdf"]')) expect(existsSync(publicAssetFile(link.getAttribute('href')))).toBe(true);
    expect(screen.getByText(/Certification coverage is model-specific/)).toBeInTheDocument();
  });

  it('shares desktop certificate space without a fixed document count and keeps smaller-screen paging', () => {
    const css = readFileSync('src/styles/studio.css', 'utf8');
    const desktopCard = css.match(/\.studio-certificates \.certcard\s*\{([^}]+)\}/)[1];
    expect(desktopCard).toMatch(/flex:\s*1 0 0\s*;/);
    expect(desktopCard).toMatch(/min-width:\s*0\s*;/);
    expect(css).toMatch(/@media \(max-width:\s*1100px\)[\s\S]*?\.studio-certificates \.certcard\s*\{[^}]*flex-basis:\s*226px/);
    expect(css).toMatch(/@media \(max-width:\s*1100px\)[\s\S]*?\.studio-certificates \.certcar__nav\s*\{[^}]*display:\s*grid/);
  });

  it('restores the complete original certificate library, without blanket certification claims', () => {
    show(HomeStudio);
    const section = screen.getByRole('region', { name: 'Confidence, documented.' });
    for (const certificate of certificates) {
      expect(within(section).getByRole('button', { name: `View ${certificate.name} certificate` })).toBeInTheDocument();
      expect(within(section).getByRole('link', { name: `Download ${certificate.name} PDF` })).toHaveAttribute('href', certificate.document);
    }
    expect(within(section).getByText(/Certification coverage is model-specific/)).toBeInTheDocument();
  });

  it('restores buyer questions with accessible expand/collapse behavior', () => {
    show(HomeStudio);
    const section = screen.getByRole('region', { name: 'Before we begin.' });
    for (const item of faqs) expect(within(section).getByRole('button', { name: item.q })).toBeInTheDocument();
    const question = within(section).getByRole('button', { name: faqs[1].q });
    fireEvent.click(question);
    expect(question).toHaveAttribute('aria-expanded', 'true');
    expect(within(section).getByText(faqs[1].a)).toBeVisible();
  });

  it('provides company contacts and only the seven product categories in the homepage inquiry', () => {
    show(HomeStudio);
    const section = screen.getByRole('region', { name: 'Send an inquiry' });
    expect(within(section).getByRole('link', { name: company.email })).toHaveAttribute('href', `mailto:${company.email}`);
    expect(within(section).getByRole('link', { name: company.phone })).toHaveAttribute('href', `tel:${company.phone.replace(/\s/g, '')}`);
    expect(within(section).getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('href', `https://wa.me/${company.whatsapp.replace(/\D/g, '')}`);
    const select = within(section).getByRole('combobox');
    expect(within(select).getAllByRole('option').map(option => option.textContent)).toEqual([
      'Select a product category', ...productLines.map(line => line.name)
    ]);
    expect(select).toHaveAccessibleName('Product category');
    expect(select).toHaveAttribute('name', 'category');
    expect(within(section).queryByLabelText('Model of interest')).not.toBeInTheDocument();
  });

  it('validates the restored form and accurately describes the configured delivery method', () => {
    show(HomeStudio);
    const section = screen.getByRole('region', { name: 'Send an inquiry' });
    fireEvent.click(within(section).getByRole('button', { name: 'Open email app' }));
    expect(within(section).getByLabelText('Your name *')).toHaveAttribute('aria-invalid', 'true');
    expect(within(section).getByText(/This opens your email app/)).toBeInTheDocument();
    expect(within(section).queryByText(/Your inquiry has been received/)).not.toBeInTheDocument();
  });

  it('offers section navigation with real targets while keeping motion an optional enhancement', () => {
    const { container } = show(HomeStudio);
    const nav = screen.getByRole('navigation', { name: 'Homepage sections' });
    for (const link of within(nav).getAllByRole('link')) expect(container.querySelector(new URL(link.getAttribute('href'), 'https://example.test').hash)).not.toBeNull();
    const css = readFileSync('src/styles/studio.css', 'utf8');
    expect(css).toContain('@supports (animation-timeline: view())');
    expect(css).toContain('studio-factory-open');
    expect(css).toContain('prefers-reduced-motion: no-preference');
  });

  it('choreographs the collection and chapter headings without animating interactive forms or map targets', () => {
    const { container } = show(HomeStudio);
    const cards = within(screen.getByRole('list', { name: 'Product categories' })).getAllByRole('listitem');
    cards.forEach((card, index) => {
      expect(card).toHaveClass('reveal', 'studio-installation-reveal');
      expect(card).toHaveStyle({ '--reveal-delay': `${index % 3 * 80}ms` });
    });
    for (const selector of ['.studio-collection .studio-section-head', '.studio-application-map__intro', '.studio-brand-panel', '.studio-oem .studio-section-head', '.studio-making .studio-section-head', '.studio-certificates .studio-section-head', '.studio-faq-intro', '.studio-inquiry-intro']) {
      expect(container.querySelector(selector)).toHaveClass('reveal');
    }
    for (const selector of ['.studio-inquiry-form', '.studio-map-hotspot', '.certcard', '.faq-item']) {
      container.querySelectorAll(selector).forEach(element => expect(element.closest('.reveal')).toBeNull());
    }
  });

  it('uses bounded photographic framing with reduced-motion, mobile and keyboard fallbacks and native scroll timelines', () => {
    const css = readFileSync('src/styles/studio.css', 'utf8');
    expect(css).toContain('.studio-home .studio-installation-reveal[data-motion=ready]');
    expect(css).toContain('clip-path: inset(0 6% 8%)');
    expect(css).toContain('transition-delay: var(--reveal-delay, 0ms)');
    expect(css).toContain('studio-room-arrival');
    expect(css).toContain('animation-timeline: --studio-rooms');
    expect(css).toContain('animation-timeline: --studio-brand-entry');
    expect(css).toMatch(/@media \(max-width:\s*760px\) and \(prefers-reduced-motion:\s*no-preference\)[\s\S]*?transition-delay:\s*0ms/);
    expect(css).toMatch(/\.studio-home \.reveal:focus-within[\s\S]*?transition:\s*none !important/);
    expect(css).toMatch(/@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.studio-installation-reveal[\s\S]*?clip-path:\s*none !important/);
    const source = readFileSync('src/pages/HomeStudio.jsx', 'utf8');
    expect(source).not.toMatch(/addEventListener\(['"](?:scroll|wheel|touchmove)['"]/);
    expect(css).not.toMatch(/scroll-snap-type:\s*y mandatory/);
  });

  it('keeps four concise OEM steps visible with one inquiry action and one capabilities link', () => {
    show(HomeStudio);
    const section = screen.getByRole('region', { name: 'Your product range. Our manufacturing.' });
    const process = within(section).getByRole('list', { name: 'OEM / ODM process' });
    expect(within(process).getAllByRole('listitem')).toHaveLength(4);
    for (const title of ['Select your products', 'Make the details yours', 'Review the sample', 'Confirm production']) {
      expect(within(process).getByRole('heading', { name: title })).toBeVisible();
    }
    for (const step of within(process).getAllByRole('listitem')) {
      expect(step.querySelectorAll('p')).toHaveLength(1);
      expect(step.querySelector('p').textContent.trim().split(/\s+/).length).toBeLessThanOrEqual(22);
    }
    expect(within(process).getByText(/authorized artwork/)).toBeVisible();
    expect(within(process).getByText(/quantities and lead times/i)).toBeVisible();
    expect(within(section).getAllByRole('link', { name: 'Discuss your OEM / ODM project' })).toHaveLength(1);
    expect(within(section).getByRole('link', { name: 'Discuss your OEM / ODM project' })).toHaveAttribute('href', '/#studio-inquiry');
    expect(within(section).getByRole('link', { name: 'Explore OEM / ODM capabilities' })).toHaveAttribute('href', '/capabilities#oem');
    expect(within(section).queryByText('Have a product range in mind?')).not.toBeInTheDocument();
    expect(within(section).queryByText('Model selection & product brief')).not.toBeInTheDocument();
    expect(screen.queryByText(/1,000,000|20,000\+|12 hours|15 Days|UC60-GAN/)).not.toBeInTheDocument();
  });

  it('replaces the distorted OEM image with a concept based on identified FAHINT models', () => {
    show(HomeStudio);
    const section = screen.getByRole('region', { name: 'Your product range. Our manufacturing.' });
    const image = within(section).getByRole('img');
    expect(image).toHaveAttribute('src', publicAsset('assets/images/editorial-products/oem-fahint-product-samples-v1.webp'));
    expect(image).toHaveAttribute('width', '1536');
    expect(image).toHaveAttribute('height', '1024');
    for (const sku of ['GF15', 'FTR15C-3100', 'DS15']) expect(image.getAttribute('alt')).toContain(sku);
    expect(section.querySelector('figcaption')).toHaveTextContent('Product and packaging concept');
    expect(section.querySelector('img[src*="brand-program-review-v2"]')).toBeNull();
  });

  it('labels real testing photographs accurately and keeps their documentation context', () => {
    show(HomeStudio);
    const section = screen.getByRole('region', { name: 'Testing you can see.' });
    expect(within(section).getByRole('img', { name: 'GFCI functional testing stations at FAHINT' })).toHaveAttribute('src', publicAsset('assets/images/company/factory/gfci-testing-v1.webp'));
    expect(within(section).getByRole('img', { name: 'USB outlets connected to the FAHINT charging test bench' })).toHaveAttribute('src', publicAsset('assets/images/company/factory/usb-testing-v1.webp'));
    expect(within(section).getAllByRole('img')).toHaveLength(2);
    expect(section).not.toHaveTextContent(/production line|Checked on the line/i);
    for (const title of ['GFCI functional testing', 'USB charging tests', 'Model-specific checks']) {
      expect(within(section).getByRole('heading', { name: title })).toBeVisible();
    }
    expect(within(section).getByRole('link', { name: 'Review model certificates' })).toHaveAttribute('href', '/#studio-certificates');
  });

  it('uses the supplied catalog poster as a full-width hero with overlaid copy', () => {
    const { container } = show(ProductsStudio, '/products');
    const hero = screen.getByRole('heading', { level: 1, name: 'Find the right connection.' }).closest('section');
    const poster = hero.querySelector('.studio-catalog-hero__poster');

    expect(poster).toHaveAttribute('src', publicAsset('assets/images/editorial-products/product-catalog-hero-v1.jpg'));
    expect(poster).toHaveAttribute('width', '1920');
    expect(poster).toHaveAttribute('height', '550');
    expect(poster).toHaveAttribute('loading', 'eager');
    expect(poster).toHaveAttribute('fetchpriority', 'high');
    expect(hero.querySelector('.studio-catalog-hero__copy')).not.toBeNull();
    expect(hero.querySelector('.studio-catalog-objects')).toBeNull();

    const css = readFileSync('src/styles/studio.css', 'utf8');
    const heroRules = css.match(/\.studio-catalog-hero\s*\{[^}]+\}/)?.[0] || '';
    const posterRules = css.match(/\.studio-catalog-hero__poster\s*\{[^}]+\}/)?.[0] || '';
    expect(heroRules).toMatch(/position:\s*relative/);
    expect(heroRules).toMatch(/overflow:\s*hidden/);
    expect(posterRules).toMatch(/position:\s*absolute/);
    expect(posterRules).toMatch(/inset:\s*0/);
    expect(posterRules).toMatch(/object-fit:\s*cover/);
    expect(container.querySelector('.studio-catalog-hero__shade')).not.toBeNull();
  });

  it('shows seven product ranges and derives every count from the existing catalogue', () => {
    show(ProductsStudio, '/products-studio');
    const ranges = screen.getByRole('region', { name: 'Product ranges' });
    for (const line of productLines) {
      const item = within(ranges).getByRole('article', { name: line.name });
      const count = getCatalogProducts(line.slug).length + (line.slug === 'gfci' ? products.length : 0);
      expect(within(item).getByText(`${count} models`)).toBeInTheDocument();
      expect(within(item).getByRole('link', { name: `Explore ${line.name}` })).toHaveAttribute('href', `/products/${line.slug}`);
    }
  });

  it('keeps paired range images aligned instead of staggering the second product', () => {
    const css = readFileSync('src/styles/studio.css', 'utf8');

    expect(css).not.toMatch(/\.studio-range-tile__images img:last-child\s*\{[^}]*margin-top/);
  });

  it('searches models, filters families and recovers from an empty result', () => {
    show(ProductsStudio, '/products-studio');
    const search = screen.getByRole('searchbox', { name: 'Search model or feature' });
    fireEvent.change(search, { target: { value: 'FTR15C-3100' } });
    expect(screen.getByRole('status')).toHaveTextContent('1 model');
    expect(screen.getByRole('link', { name: 'View FTR15C-3100' })).toHaveAttribute('href', '/products/usb-outlets/ftr15c-3100');
    fireEvent.change(search, { target: { value: 'nothing-matches-here' } });
    expect(screen.getByRole('heading', { name: 'No matching products' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Reset filters' }));
    fireEvent.click(screen.getByRole('button', { name: 'Filter Dimmers' }));
    expect(screen.getByRole('status')).toHaveTextContent('2 models');
    expect(screen.getByRole('link', { name: 'View DM2010S' })).toBeInTheDocument();
  });

  it('paginates the full catalogue and resets pagination on category changes', () => {
    show(ProductsStudio, '/products-studio');
    fireEvent.click(screen.getByRole('button', { name: 'Browse all models' }));
    expect(screen.getAllByRole('link', { name: /^View / })).toHaveLength(12);
    fireEvent.click(screen.getByRole('button', { name: /Show more models/ }));
    expect(screen.getAllByRole('link', { name: /^View / })).toHaveLength(24);
    fireEvent.click(screen.getByRole('button', { name: 'Filter Lighting Switches' }));
    expect(screen.getAllByRole('link', { name: /^View / })).toHaveLength(6);
  });

  it('explains legacy commercial searches and removes the message on reset or a different family', () => {
    show(ProductsStudio, '/products-studio');
    const search = screen.getByRole('searchbox', { name: 'Search model or feature' });
    fireEvent.change(search, { target: { value: 'R15-C' } });
    expect(screen.getByRole('status')).toHaveTextContent('1 model');
    expect(screen.getByText('R15-C is listed in the current catalog as C15.')).toBeVisible();
    expect(screen.getByRole('link', { name: 'View C15' })).toHaveAttribute('href', '/products/receptacles/r15-c');
    fireEvent.click(screen.getByRole('button', { name: 'Filter USB Outlets' }));
    expect(screen.getByRole('heading', { name: 'No matching products' })).toBeVisible();
    expect(screen.queryByText(/is listed in the current catalog as/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Reset filters' }));
    expect(search).toHaveValue('');
    expect(screen.queryByText(/is listed in the current catalog as/)).not.toBeInTheDocument();
    fireEvent.change(search, { target: { value: 'CT15Q' } });
    expect(screen.getByRole('link', { name: 'View CT15Q' })).toBeVisible();
    expect(screen.queryByText(/is listed in the current catalog as/)).not.toBeInTheDocument();
  });

  it('marks each experimental route noindex and restores metadata on exit', () => {
    const oldTitle = document.title;
    const { unmount } = show(HomeStudio);
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
    unmount();
    expect(document.title).toBe(oldTitle);
    expect(document.querySelector('meta[name="robots"]')).toBeNull();
  });
});
