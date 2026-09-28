import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import Footer from './components/Footer.jsx';
import ProductsOverview from './pages/ProductsOverview.jsx';
import Capabilities from './pages/Capabilities.jsx';
import { ProductManufacturingProof } from './components/products/ProductTechnicalSections.jsx';
import ProductDetailHero from './components/products/ProductDetailHero.jsx';
import { getCatalogProducts } from './data/catalogProducts.js';
import { publicAssetFile } from './test/publicAssetFile.js';

const show = (Component) => render(<MemoryRouter future={{ v7_startTransition:true,v7_relativeSplatPath:true }}><Component /></MemoryRouter>);

describe('Shared visual finish and original company imagery', () => {
  it('uses the official FAHINT wordmark in the footer', () => {
    show(Footer);
    expect(screen.getByRole('img', { name:'FAHINT' })).toHaveAttribute('src',expect.stringContaining('assets/images/brand/fahint-logo-navy.png'));
    expect(document.querySelector('.footer .logo__mark')).toBeNull();
  });
  it('replaces the early generated product montage with the real exhibition display', () => {
    show(ProductsOverview);
    const section = screen.getByRole('region',{name:'Built for brands and OEM programs.'});
    expect(within(section).getByRole('img')).toHaveAttribute('src',expect.stringContaining('company/exhibition-source.webp'));
    expect(section.querySelector('figcaption')).toHaveTextContent('FAHINT exhibition');
    expect(section.querySelector('img[src*="brand-program-review-v2"]')).toBeNull();
  });
  it('pairs the supplied factory photographs with accurate assembly, testing and laboratory captions', () => {
    show(ProductManufacturingProof);
    const examples = [
      ['Component assembly', 'product-assembly-workshop-v1.webp', 1600, 900, 'FAHINT staff working at wiring-device assembly benches'],
      ['GFCI functional testing', 'product-gfci-testing-v1.webp', 1600, 900, 'FAHINT staff operating GFCI functional testing stations'],
      ['Laboratory verification', 'product-laboratory-v1.webp', 1600, 900, 'FAHINT laboratory with test benches and a temperature and humidity chamber']
    ];
    expect(screen.getAllByRole('img')).toHaveLength(3);
    for(const [caption, filename, width, height, alt] of examples) {
      const figure = screen.getByText(caption).closest('figure');
      const image = within(figure).getByRole('img', { name: alt });
      expect(image).toHaveAttribute('src', expect.stringContaining(`company/factory/${filename}`));
      expect(image).toHaveAttribute('width', String(width));
      expect(image).toHaveAttribute('height', String(height));
      expect(existsSync(publicAssetFile(image.getAttribute('src')))).toBe(true);
    }
    expect(screen.queryByText('Production')).not.toBeInTheDocument();
    expect(screen.queryByText('Tooling')).not.toBeInTheDocument();
    expect(screen.getByText('Factory photographs from FAHINT. Test requirements and documentation are confirmed for the selected model.')).toBeInTheDocument();
    const styles = readFileSync('src/styles/site-system.css', 'utf8');
    expect(styles).toMatch(/\.product-manufacturing__grid figure img\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*9[^}]*object-fit:\s*cover/);
    expect(styles.match(/\.product-manufacturing__grid figure\s*\{([^}]*)\}/)?.[1]).toContain('border-radius: 0;');
    expect(styles.match(/\.product-manufacturing__grid figure img\s*\{([^}]*)\}/)?.[1]).toContain('border-radius: var(--site-radius);');
  });
  it('illustrates each visible manufacturing stage with a distinct original factory photograph', () => {
    show(Capabilities);
    const production=document.getElementById('production');
    const stages=within(production).getAllByRole('article');
    expect(stages).toHaveLength(3);
    const images=stages.map(stage=>within(stage).getByRole('img'));
    expect(new Set(images.map(image=>image.getAttribute('src'))).size).toBe(3);
    for(const image of images) {
      expect(image.getAttribute('src')).toContain('company/factory/');
      expect(Number(image.getAttribute('width'))).toBeGreaterThan(700);
      expect(existsSync(publicAssetFile(image.getAttribute('src')))).toBe(true);
    }
  });
  it('loads a shared system without altering the retained homepage source', () => {
    expect(existsSync('src/styles/site-system.css')).toBe(true);
    expect(readFileSync('src/main.jsx','utf8')).toContain("import './styles/site-system.css'");
  });
  it('keeps USB connector names together when a model heading wraps', () => {
    const product=getCatalogProducts('usb-outlets').find(model=>model.sku==='FTR15C-3100');
    show(()=> <ProductDetailHero product={product} />);
    const heading=screen.getByRole('heading',{level:1});
    expect(heading).toHaveTextContent(product.name);
    expect([...heading.querySelectorAll('.product-name-token')].map(node=>node.textContent)).toEqual(['USB-A','USB-C']);
  });
  it('owns the foreground of dark product sections instead of inheriting page ink', () => {
    const styles = readFileSync('src/styles/site-system.css', 'utf8');
    expect(styles).toMatch(/:is\(\.product-story--application,\.product-certification\)\s*\{[^}]*color:\s*#fff/);
    expect(styles).toMatch(/:is\(\.product-story--application,\.product-certification\) h2\s*\{[^}]*color:\s*#fff/);
    expect(styles).not.toMatch(/\.product-story--application h2\s*\{[^}]*color:\s*inherit/);
  });
  it('keeps packaging comparison text readable and certificate previews bounded', () => {
    const styles = readFileSync('src/styles/product-experience.css', 'utf8');
    expect(styles).toMatch(/\.product-packaging__program-panel thead th\s*\{[^}]*font-size:\s*14px/);
    expect(styles).toMatch(/\.product-packaging__program-panel tbody td\s*\{[^}]*font-size:\s*16px/);
    expect(styles).toMatch(/\.product-certification__document-viewer\s*\{[^}]*max-width:\s*480px/);
    expect(styles).toMatch(/\.product-certification__verification h2\s*\{[^}]*max-width:\s*24ch/);
  });
  it('lets long catalogue configuration actions wrap instead of widening a phone viewport', () => {
    const styles = readFileSync('src/styles/site-system.css', 'utf8');
    expect(styles).toMatch(/\.catalog-presentation__body > \*\s*\{[^}]*min-width:\s*0/);
    expect(styles).toMatch(/\.catalog-presentation__copy \.btn\s*\{[^}]*max-width:\s*100%[^}]*white-space:\s*normal/);
  });

  it('keeps model cards in two readable columns on phones and three on wider mobile screens', () => {
    const catalogue = readFileSync('src/styles/catalog.css', 'utf8');
    const smallPhone = catalogue.slice(catalogue.indexOf('@media (max-width: 420px)'));
    expect(smallPhone).not.toMatch(/\.catalog-model-grid[^{}]*\{[^}]*grid-template-columns:\s*1fr\s*;/);
    const styles = readFileSync('src/styles/site-system.css', 'utf8');
    const mobile = styles.slice(styles.indexOf('@media (max-width: 760px)'));
    expect(mobile).toMatch(/\.catalog-model-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
    expect(mobile).toMatch(/\.catalog-model-card h3\s*\{[^}]*font-size:\s*clamp\(14px, 3\.4vw, 18px\)[^}]*overflow-wrap:\s*anywhere/);
    expect(mobile).toMatch(/\.catalog-model-card__image\s*\{[^}]*padding:\s*12px[^}]*aspect-ratio:\s*1/);
    expect(mobile).toMatch(/@media \(min-width: 600px\) and \(max-width: 760px\)[\s\S]*?\.catalog-model-grid\s*\{[^}]*repeat\(3, minmax\(0, 1fr\)\)/);
    const product = readFileSync('src/styles/product-experience.css', 'utf8');
    const gfciMobile = product.slice(product.indexOf('@media (max-width: 700px)'));
    expect(gfciMobile).not.toMatch(/\.gfci-series \.gfci-product-grid\s*\{[^}]*grid-template-columns:\s*1fr\s*;/);
    expect(gfciMobile).not.toMatch(/\.product-related \.prod-grid\s*\{[^}]*grid-template-columns:\s*1fr\s*;/);
  });

  it('keeps mobile contact actions visible and reuses the desktop navy square icons', () => {
    const styles = readFileSync('src/styles/site-system.css', 'utf8');
    const mobile = styles.slice(styles.indexOf('@media (max-width: 760px)'));
    const rail = mobile.match(/\.rail\s*\{([^}]*)\}/)?.[1] || '';
    expect(rail).toMatch(/display:\s*flex/);
    expect(rail).toMatch(/top:\s*auto/);
    expect(rail).toMatch(/right:\s*max\(16px, env\(safe-area-inset-right/);
    expect(rail).toMatch(/bottom:\s*calc\(16px \+ env\(safe-area-inset-bottom/);
    const base = readFileSync('src/styles.css', 'utf8');
    expect(base).toMatch(/\.rail__icon\s*\{[^}]*width:\s*46px[^}]*height:\s*46px[^}]*border-radius:\s*12px[^}]*background:\s*var\(--navy\)/);
    expect(mobile).not.toMatch(/\.rail[^{}]*\{[^}]*(?:border-radius|background|box-shadow|order):/);
    expect(mobile).toMatch(/\.rail__panel\s*\{[^}]*display:\s*none/);
  });
});
