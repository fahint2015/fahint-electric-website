import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import GfciSeries from './GfciSeries.jsx';
import { publicAsset } from '../utils/publicAsset.js';
import { getCatalogProducts } from '../data/catalogProducts.js';

function renderSeries() {
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <GfciSeries />
    </MemoryRouter>
  );
}

describe('GfciSeries', () => {
  it('sets a category-specific page title', () => {
    renderSeries();
    expect(document.title).toBe('GFCI Outlet Manufacturer | 15A & 20A Models | FAHINT');
  });
  it('shows complete poster artwork above the copy on phones', () => {
    const styles = readFileSync('src/styles/product-experience.css', 'utf8');
    const phone = styles.slice(styles.lastIndexOf('@media (max-width: 520px)'));

    expect(phone).toMatch(
      /\.gfci-series__poster-image\s*\{[^}]*position:\s*relative[^}]*aspect-ratio:\s*3\s*\/\s*2[^}]*object-fit:\s*contain/
    );
    expect(phone).toMatch(/\.gfci-series__poster-copy[^}]*\{[^}]*position:\s*relative/);
  });

  it('defines product-page-only scene layers backed by a verified GFCI product asset', async () => {
    const { gfciSeriesHeroVisual, gfciSeriesVisuals } = await import('../data/productPageVisuals.js');

    expect(gfciSeriesHeroVisual).toMatchObject({
      scene: 'assets/images/editorial-products/family-gfci-background.webp',
      product: 'assets/images/products/gf15-main.webp'
    });
    expect(gfciSeriesHeroVisual.scene).toMatch(/^assets\/images\/editorial-products\/[a-z0-9-]+\.(?:webp|png)$/);
    expect(gfciSeriesVisuals.applicationPoster).toBe(
      'assets/images/editorial-products/gfci-application-installed-poster-v2-optimized.webp'
    );
    expect(gfciSeriesVisuals.oemPoster).toBe(
      'assets/images/products/gf15-package-standard-white-v1.jpg'
    );
    [
      gfciSeriesHeroVisual.scene,
      gfciSeriesVisuals.applicationPoster,
      gfciSeriesVisuals.oemPoster
    ].forEach((scene) => {
      expect(existsSync(`public/${scene}`)).toBe(true);
    });
    expect([
      gfciSeriesHeroVisual.scene,
      gfciSeriesHeroVisual.product,
      gfciSeriesVisuals.applicationPoster,
      gfciSeriesVisuals.oemPoster
    ].join(' ')).not.toContain('editorial-home');
    expect(existsSync(`public/${gfciSeriesHeroVisual.product}`)).toBe(true);
  });

  it('shows all nine published models in the same full-card grid', () => {
    const { container } = renderSeries();
    const grid = container.querySelector('.gfci-series__product-grid');

    expect(grid).not.toBeNull();
    expect(grid).toHaveClass('prod-grid', 'gfci-series__product-grid');
    ['GF15', 'GF20', 'GT15', 'GT20', 'GW15', 'GW20', 'GL20', 'GTN15', 'GTN20'].forEach((sku) => {
      expect(within(grid).getByRole('link', { name: new RegExp(`^${sku} `) })).toHaveAttribute(
        'href',
        `/products/gfci/${sku.toLowerCase()}/`
      );
    });
    expect(within(grid).getAllByRole('link')).toHaveLength(9);
    expect(grid.querySelectorAll('.pcard')).toHaveLength(9);
    for (const product of getCatalogProducts('gfci')) {
      const card = within(grid).getByRole('link', { name: `${product.sku} ${product.name}` });
      expect(within(card).getByRole('img')).toHaveAttribute('src', publicAsset(product.assets.hero));
      expect(card).toHaveTextContent(Object.fromEntries(product.keyFacts).Rating);
      expect(card).toHaveTextContent(Object.fromEntries(product.keyFacts).Configuration);
      expect(card.querySelector('.pcard__tag')).toHaveTextContent('TR');
    }
    expect(container.querySelector('#industrial-models')).toBeNull();
    expect(screen.queryByText('A different industrial configuration.')).not.toBeInTheDocument();
    expect(screen.queryByText(/Nylon construction and no feed-through terminals/)).not.toBeInTheDocument();
    expect(screen.queryByText('FLB20')).not.toBeInTheDocument();
  });

  it('includes GTN models in rating, variant and search filters and resets to all nine', () => {
    const {container}=renderSeries();
    fireEvent.change(screen.getByRole('combobox',{name:'Receptacle rating'}),{target:{value:'15A'}});
    expect(screen.getByRole('status')).toHaveTextContent('4 of 9 models');
    const grid=container.querySelector('.gfci-product-grid');
    expect(within(grid).getAllByRole('link')).toHaveLength(4);
    fireEvent.change(screen.getByRole('combobox',{name:'Variant'}),{target:{value:'TR'}});
    expect(screen.getByRole('status')).toHaveTextContent('2 of 9 models');
    fireEvent.change(screen.getByRole('searchbox',{name:'Search models'}),{target:{value:'gtn'}});
    expect(screen.getByRole('status')).toHaveTextContent('1 of 9 models');
    expect(within(grid).getByRole('link', { name: /^GTN15 / })).toBeVisible();
    fireEvent.change(screen.getByRole('combobox',{name:'Receptacle rating'}),{target:{value:'20A'}});
    expect(within(grid).getByRole('link', { name: /^GTN20 / })).toBeVisible();
    fireEvent.change(screen.getByRole('searchbox',{name:'Search models'}),{target:{value:'unknown'}});
    expect(screen.getByText('No models match your selection.')).toBeVisible();
    fireEvent.click(screen.getByRole('button',{name:'Clear filters'}));
    expect(screen.getByRole('status')).toHaveTextContent('9 of 9 models');
    expect(container.querySelector('.gfci-series__empty')).toBeNull();
  });

  it('keeps the model directory and platform evidence while omitting the three paused sections', () => {
    const { container } = renderSeries();

    expect(container.querySelector('.gfci-series-hero')).toBeInTheDocument();
    expect(container.querySelector('.gfci-product-grid')).toBeInTheDocument();
    expect(container.querySelector('.gfci-comparison')).not.toBeInTheDocument();
    expect(container.querySelector('.gfci-proof-grid')).toBeInTheDocument();
    expect(container.querySelector('.gfci-series__poster--application')).not.toBeInTheDocument();
    expect(container.querySelector('.gfci-series__poster--oem')).not.toBeInTheDocument();

    expect(screen.queryByText('GFCI product family')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', {
      level: 1,
      name: 'GFCI Outlets'
    })).toBeInTheDocument();
    const styles = readFileSync('src/styles/product-experience.css', 'utf8');
    expect(styles).not.toMatch(/\.gfci-series-hero h1\s*\{[^}]*max-width:\s*15ch/);
    expect(screen.queryByText(
      'Compare seven published models, then confirm the finish and program requirements for your market.'
    )).not.toBeInTheDocument();
    expect(screen.queryByText(/seven verified models/i)).not.toBeInTheDocument();

    expect(screen.queryByRole('region', { name: 'GFCI model comparison' })).not.toBeInTheDocument();

    [
      ['Self-test protection', 'Automatic protection monitoring across the published GFCI platform.'],
      ['Reverse-wiring lockout', 'Line/load reversal prevents power at the receptacle face.'],
      [
        'Verified GFCI platform',
        'Six published models are named under UL / cUL file E504391; GL20 documentation remains under review.'
      ]
    ].forEach(([heading, body]) => {
      expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
      expect(screen.getByText(body)).toBeInTheDocument();
    });

    expect(screen.queryByText(/Match the published model, rating and variant to the project brief/)).not.toBeInTheDocument();
    ['Finish coordination', 'Brand marking', 'Packaging coordination', 'Documentation support'].forEach((option) => {
      expect(screen.queryByText(option)).not.toBeInTheDocument();
    });
  });

  it('emits only known lowercase deployment paths for residential and industrial product links', () => {
    const { container } = renderSeries();
    const productLinks = [...container.querySelectorAll('a[href^="/products/gfci/"]')];

    expect(productLinks).toHaveLength(9);
    ['gtn15', 'gtn20'].forEach((sku) => {
      expect(screen.getByRole('link', { name: new RegExp(`^${sku.toUpperCase()} `) })).toHaveAttribute('href', `/products/gfci/${sku}/`);
    });
    productLinks.forEach((link) => {
      expect(link.getAttribute('href')).toMatch(/^\/products\/gfci\/[a-z0-9]+\/$/);
    });
  });

  it('uses the approved scene banner without rendering the paused poster assets', () => {
    const { container } = renderSeries();
    const hero = container.querySelector('.gfci-series__hero img');
    expect(hero).toHaveAttribute('src', publicAsset('assets/images/lines/gfci-series-kitchen-wide-v1.webp'));
    expect(hero).toHaveAttribute('fetchpriority', 'high');
    expect(screen.queryByTestId('gfci-hero-video')).not.toBeInTheDocument();
    expect(screen.queryByTestId('gfci-application-poster')).not.toBeInTheDocument();
    expect(screen.queryByTestId('gfci-oem-poster')).not.toBeInTheDocument();
  });

  it('keeps the series route ahead of product and generic family routes', () => {
    const main = readFileSync('src/App.jsx', 'utf8');
    const lineDetail = readFileSync('src/pages/LineDetail.jsx', 'utf8');
    const seriesRoute = main.indexOf('path="/products/gfci"');
    const productRoute = main.indexOf('path="/products/gfci/:sku"');
    const familyRoute = main.indexOf('path="/products/:line"');

    expect(seriesRoute).toBeGreaterThan(-1);
    expect(seriesRoute).toBeLessThan(productRoute);
    expect(productRoute).toBeLessThan(familyRoute);
    expect(lineDetail).not.toContain('GfciBody');
    expect(lineDetail).toContain('<ModelCatalogue key={line.slug} line={line} />');
    expect(lineDetail).toContain('getCatalogProducts(line.slug)');
  });

  it('defines visible keyboard focus for the comparison region', () => {
    const styles = readFileSync('src/styles.css', 'utf8');

    expect(styles).toMatch(/\.gfci-series__table-wrap:focus-visible\s*\{[\s\S]*?outline:/);
  });

  it('keeps the GFCI catalogue at four columns at 1280, two at 768, and one at 390', () => {
    const styles = readFileSync('src/styles/product-experience.css', 'utf8');

    expect(styles).toMatch(
      /@media \(min-width: 1200px\) and \(max-width: 1439px\)[\s\S]*?\.gfci-series \.gfci-product-grid\s*\{[^}]*grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/
    );
    expect(styles).toMatch(
      /@media \(max-width: 768px\)[\s\S]*?\.gfci-series \.gfci-product-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/
    );
    expect(styles).not.toMatch(
      /@media \(max-width: 520px\)[\s\S]*?\.gfci-series \.gfci-product-grid\s*\{[^}]*grid-template-columns:\s*1fr/
    );
    const shared = readFileSync('src/styles/site-system.css', 'utf8');
    const mobile = shared.slice(shared.indexOf('@media (max-width: 760px)'));
    expect(mobile).toMatch(/\.gfci-series \.gfci-product-grid, \.product-related \.prod-grid\s*\{[^}]*repeat\(2, minmax\(0, 1fr\)\)/);
  });

  it('keeps the mobile hero video unshaded with the introduction beneath it', () => {
    const shared = readFileSync('src/styles/site-system.css', 'utf8');
    const mobile = shared.slice(shared.indexOf('@media (max-width: 760px)'));
    expect(mobile).toMatch(/\.gfci-series \.gfci-series__hero\s*\{[^}]*display:\s*block[^}]*min-height:\s*0[^}]*padding:\s*0/);
    expect(mobile).toMatch(/\.gfci-series \.gfci-series__hero-video\s*\{[^}]*position:\s*relative[^}]*height:\s*auto[^}]*object-fit:\s*contain/);
    expect(mobile).toMatch(/\.gfci-series \.gfci-series__hero-shade\s*\{[^}]*display:\s*none/);
  });

  it('uses the original wide video ratio on mobile without a 16:9 letterbox', () => {
    const shared = readFileSync('src/styles/site-system.css', 'utf8');
    const mobile = shared.slice(shared.indexOf('@media (max-width: 760px)'));
    const video = mobile.match(/\.gfci-series \.gfci-series__hero-video\s*\{([^}]*)\}/)?.[1] || '';
    // Both the source video and poster are 1440 × 572, not 16:9.
    expect(video).toMatch(/aspect-ratio:\s*auto 1440\s*\/\s*572/);
    expect(video).toMatch(/max-height:\s*none/);
    expect(video).toMatch(/height:\s*auto/);
    expect(video).not.toMatch(/aspect-ratio:\s*16\s*\/\s*9/);
  });

  it('uses a pure-white square product stage with restrained card chrome', () => {
    const styles = readFileSync('src/styles/product-experience.css', 'utf8');

    expect(styles).toMatch(/\.pcard\s*\{[^}]*border-radius:\s*12px[^}]*background:\s*#fff/s);
    expect(styles).toMatch(/\.pcard__media\s*\{[^}]*aspect-ratio:\s*1[^}]*background:\s*#fff/s);
    expect(styles).toMatch(/\.pcard__media img\s*\{[^}]*padding:\s*0/s);
    expect(styles).toMatch(/\.pcard__tag\s*\{[^}]*top:\s*14px[^}]*left:\s*14px/s);
  });

  it('gives series inline actions 44px boxes and removes inherited layout motion', () => {
    const styles = readFileSync('src/styles/product-experience.css', 'utf8');
    const reducedMotion = styles.slice(styles.indexOf('@media (prefers-reduced-motion: reduce)'));

    expect(styles).toMatch(/\.gfci-comparison tbody th a\s*\{[^}]*display:\s*inline-flex[^}]*min-width:\s*44px[^}]*min-height:\s*44px[^}]*justify-content:\s*center/s);
    expect(styles).toMatch(/\.gfci-series :where\([^)]*\.btn[^)]*\.textlink[^)]*\)\s*\{[^}]*display:\s*inline-flex[^}]*min-width:\s*44px[^}]*min-height:\s*44px/s);
    expect(styles).toMatch(/\.gfci-comparison tbody tr\s*\{[^}]*transition:\s*none/s);
    expect(styles).toMatch(/[^{}]*\.gfci-series \.textlink:hover[^{}]*\{[^}]*gap:\s*6px/s);
    expect(reducedMotion).toContain('.gfci-series button');
    expect(reducedMotion).toContain('.gfci-series input');
    expect(reducedMotion).toContain('.gfci-series select');
  });
});
