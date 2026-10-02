import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import userEvent from '@testing-library/user-event';
import ProductDetail from './ProductDetail.jsx';
import { ProductCertification, productSpecificationGroups } from '../components/products/ProductTechnicalSections.jsx';
import { findProduct } from '../data/products.js';

const OTHER_GFCI_MODELS = ['GF20', 'GT15', 'GT20', 'GW15', 'GW20', 'GL20'];

function LocationProbe() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname}{location.search}{location.hash}</span>;
}

function renderDetail(sku, initialPath = `/products/gfci/${sku}`) {
  return render(
    <MemoryRouter
      initialEntries={[initialPath]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/products/gfci/:sku" element={<ProductDetail />} />
        <Route path="/products/gfci" element={<div>GFCI series fallback</div>} />
      </Routes>
      <LocationProbe />
    </MemoryRouter>
  );
}

describe('ProductDetail', () => {
  it.each(['GF15', ...OTHER_GFCI_MODELS])('uses the corrected shared factory context on %s', (sku) => {
    renderDetail(sku.toLowerCase());
    const manufacturing = screen.getByRole('region', { name: 'Manufacturing evidence.' });
    expect(within(manufacturing).getAllByRole('img')).toHaveLength(3);
    expect([...manufacturing.querySelectorAll('figcaption')].map(caption => caption.textContent)).toEqual([
      'Component assembly', 'GFCI functional testing', 'Laboratory verification'
    ]);
  });

  it('reserves the correct aspect ratio for every product-page image', () => {
    const { container } = renderDetail('gf15');

    const imagesWithoutDimensions = [...container.querySelectorAll('img')]
      .filter((image) => !image.hasAttribute('width') || !image.hasAttribute('height'))
      .map((image) => image.getAttribute('src'));

    expect(imagesWithoutDimensions).toEqual([]);
  });

  it('publishes model-specific browser metadata', () => {
    document.title = 'Fahint Electric';
    const description = document.createElement('meta');
    description.name = 'description';
    description.content = 'Default description';
    const openGraphTitle = document.createElement('meta');
    openGraphTitle.setAttribute('property', 'og:title');
    openGraphTitle.content = 'Default title';
    const openGraphDescription = document.createElement('meta');
    openGraphDescription.setAttribute('property', 'og:description');
    openGraphDescription.content = 'Default description';
    document.head.append(description, openGraphTitle, openGraphDescription);

    renderDetail('gt20');

    expect(document.title).toBe('GT20 20A Tamper-Resistant GFCI | FAHINT');
    expect(description).toHaveAttribute(
      'content',
      expect.stringMatching(/20A, 125V.*tamper-resistant.*GFCI/i)
    );
    expect(openGraphTitle).toHaveAttribute(
      'content',
      'GT20 20A Tamper-Resistant GFCI | FAHINT'
    );
    expect(openGraphDescription).toHaveAttribute(
      'content',
      expect.stringMatching(/20A, 125V.*tamper-resistant.*GFCI/i)
    );
  });

  it('makes the verified certificate legible and directly accessible', () => {
    const product = findProduct('gf15');
    const { container } = render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ProductCertification product={product} />
      </MemoryRouter>
    );

    const section = screen.getByRole('region', { name: 'Certification your team can verify.' });
    expect(section).toHaveAttribute('id', 'certification-evidence');
    expect(section.querySelector('.product-certification__document-viewer')).toBeInTheDocument();
    expect(section.querySelector('.product-certification__verification')).toBeInTheDocument();

    const fullCertificate = within(section).getByRole('link', { name: /Open full UL certificate/i });
    expect(fullCertificate.getAttribute('href')).toContain('assets/images/certs/ul-gfci.webp');
    expect(fullCertificate).toHaveAttribute('target', '_blank');

    const facts = within(section).getByRole('list', { name: 'Certificate verification details' });
    expect(facts).toHaveTextContent(/Certificate number.*UL-US-2016865-1/i);
    expect(facts).toHaveTextContent(/UL file.*E504391/i);
    expect(facts).toHaveTextContent(/Report reference.*E504391-20210212/i);
    expect(facts).toHaveTextContent(/Standard.*UL 943.*5th Edition/i);
    expect(container.querySelector('.product-certification__grid')).not.toBeInTheDocument();
  });

  it('exposes product documents as a keyboard-focusable disclosure with direct links', async () => {
    const user = userEvent.setup();
    const product = {
      ...findProduct('gf15'),
      documents: [{ href: '/documents/gf15-datasheet.pdf', label: 'GF15 datasheet' }]
    };
    const { container } = render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ProductCertification product={product} />
      </MemoryRouter>
    );

    const disclosure = container.querySelector('details.product-documents');
    const summary = within(disclosure).getByText('Product documents').closest('summary');
    expect(summary).toHaveAttribute('tabindex', '0');
    expect(disclosure).not.toHaveAttribute('open');
    summary.focus();
    expect(summary).toHaveFocus();
    await user.click(summary);
    expect(disclosure).toHaveAttribute('open');
    expect(within(disclosure).getByRole('link', { name: 'GF15 datasheet' }))
      .toHaveAttribute('href', '/documents/gf15-datasheet.pdf');
  });

  it('places the GF15 technical specification before its engineering story', () => {
    const { container } = renderDetail('gf15');

    expect(screen.getByRole('heading', {
      level: 1,
      name: '15A Self-Test GFCI Receptacle'
    })).toBeInTheDocument();
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(container.querySelector('.product-detail-hero__model')).toHaveTextContent('GF15');

    const facts = container.querySelector('.product-detail-hero__facts');
    expect(facts).not.toBeNull();
    expect(within(facts).getByText('Rating').nextElementSibling).toHaveTextContent('15A, 125V');
    expect(within(facts).getByText('Configuration').nextElementSibling).toHaveTextContent('NEMA 5-15R');
    expect(screen.getByText('UL / cUL listed · file E504391')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Request a quote/ })).toHaveAttribute(
      'href',
      '/products/gfci/gf15#inquiry'
    );
    expect(screen.getByRole('link', { name: 'Technical details' })).toHaveAttribute(
      'href',
      '/products/gfci/gf15#technical-details'
    );

    const headings = [
      'Technical specifications.',
      'Protection, clearly documented.',
      'Designed for the environments in the specification.',
      'Configure the product around your program.',
      'Wiring and dimensions.',
      'Certification your team can verify.',
      'Manufacturing evidence.',
      'Other verified GFCI models.',
      'Request a quotation for GF15.'
    ];
    const renderedHeadings = headings.map((heading) =>
      screen.getByRole('heading', { level: 2, name: heading })
    );
    const allSectionHeadings = Array.from(container.querySelectorAll('h2'));
    const sectionIndexes = renderedHeadings.map((heading) => allSectionHeadings.indexOf(heading));
    expect(sectionIndexes).toEqual([...sectionIndexes].sort((a, b) => a - b));
  });

  it.each(OTHER_GFCI_MODELS)('places %s specifications before engineering with the approved installation spacing', (sku) => {
    const { container } = renderDetail(sku.toLowerCase());
    const headings = Array.from(container.querySelectorAll('h2'));
    const engineering = screen.getByRole('heading', { level: 2, name: 'Protection, clearly documented.' });
    const specifications = screen.getByRole('heading', { level: 2, name: 'Technical specifications.' });

    expect(headings.indexOf(specifications)).toBeLessThan(headings.indexOf(engineering));
    expect(container.querySelector('.product-detail-hero').nextElementSibling).toHaveAttribute('id', 'technical-details');
    expect(container.querySelector('.product-story--oem').nextElementSibling).toHaveClass('product-installation');
  });

  it('removes the duplicated section gap before the GF15 installation reference', () => {
    const styles = readFileSync('src/styles/product-experience.css', 'utf8');

    expect(styles).toMatch(
      /\.product-story--oem\s*\+\s*\.product-installation\s*\{[^}]*padding-top:\s*0/
    );
  });

  it('uses unlabeled visual swatches in the right product information panel', async () => {
    const user = userEvent.setup();
    const { container } = renderDetail('gf15');
    const content = container.querySelector('.product-detail-hero__content');
    const gallery = container.querySelector('.product-gallery');
    const finishes = within(content).getByRole('group', { name: 'Available finishes' });

    expect(within(gallery).queryByRole('button', { name: 'Show GF15 in Black' })).toBeNull();
    expect(within(finishes).queryByText('White')).toBeNull();
    expect(within(finishes).queryByText('Light Almond')).toBeNull();

    await user.click(within(finishes).getByRole('button', { name: 'Show GF15 in Black' }));

    expect(within(finishes).queryByText('Selected: Black')).toBeNull();
    expect(within(finishes).getByRole('button', { name: 'Show GF15 in Black' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(within(gallery).getByRole('img', { name: 'GF15 selected product view' })).toHaveAttribute(
      'src',
      `${import.meta.env.BASE_URL}assets/images/products/gf15-black.webp`
    );
  });

  it('replaces the duplicated GF15 finish strip with seven retail packaging references', () => {
    renderDetail('gf15');

    expect(screen.getByTestId('product-oem-story')).toHaveClass('product-story--cool');
    expect(screen.queryAllByTestId('product-finish-cell')).toHaveLength(0);

    const packagingReferences = screen.getAllByTestId('product-packaging-showcase-cell');
    expect(packagingReferences).toHaveLength(7);
    const expectedFinishes = ['White', 'Black', 'Grey', 'Graphite', 'Ivory', 'Light Almond', 'Brown'];
    packagingReferences.forEach((reference, index) => {
      const image = within(reference).getByRole('img', {
        name: `GF15 ${expectedFinishes[index]} standard retail packaging`
      });
      expect(image).toHaveAttribute('src', expect.stringMatching(
        /assets\/images\/products\/gf15-package-standard-(white|black|grey|graphite|ivory|almond|brown)-v1\.jpg$/
      ));
      expect(image).toHaveAttribute('width', '620');
      expect(image).toHaveAttribute('height', '620');
      expect(image).toHaveAttribute('loading', 'lazy');
      expect(within(reference).getByText(expectedFinishes[index])).toBeInTheDocument();
    });
  });

  it.each(OTHER_GFCI_MODELS)('shows seven %s packaging photographs instead of a duplicate finish strip', (sku) => {
    renderDetail(sku.toLowerCase());

    expect(screen.queryAllByTestId('product-finish-cell')).toHaveLength(0);
    expect(screen.getAllByTestId('product-packaging-showcase-cell')).toHaveLength(7);
    const finishes = [
      ['White', 'white'], ['Black', 'black'], ['Grey', 'grey'], ['Graphite', 'graphite'],
      ['Ivory', 'ivory'], ['Light Almond', 'almond'], ['Brown', 'brown']
    ];
    for (const [name, slug] of finishes) {
      expect(screen.getByRole('img', { name: `${sku} ${name} standard retail packaging` }))
        .toHaveAttribute('src', `${import.meta.env.BASE_URL}assets/images/products/${sku.toLowerCase()}-package-standard-${slug}-v1.jpg`);
    }
    expect(screen.getByRole('group', { name: 'Available finishes' })).toBeInTheDocument();
  });

  it('separates GF15 wall-plate choices from the packaging logistics matrix', () => {
    const { container } = renderDetail('gf15');
    const oem = container.querySelector('[data-testid="product-oem-story"]');
    const packaging = oem.querySelector('.product-packaging');

    expect(packaging).toBeInTheDocument();
    expect(within(packaging).getByRole('heading', { level: 3, name: 'Packaging & program options.' }))
      .toBeInTheDocument();
    expect(within(packaging).getByRole('heading', { level: 4, name: 'Wall plate options' }))
      .toBeInTheDocument();
    expect(within(packaging).getByRole('img', { name: 'GF15 with standard screw wall plate and retail box' }))
      .toHaveAttribute('src', expect.stringMatching(/gf15-package-standard-white-v1\.jpg$/));
    expect(within(packaging).getByRole('img', { name: 'GF15 with screwless wall plate and retail box' }))
      .toHaveAttribute('src', expect.stringMatching(/gf15-package-screwless-white-v1\.jpg$/));
    expect(within(packaging).getByText('Standard screw plate')).toBeInTheDocument();
    expect(within(packaging).getByText('Screwless plate')).toBeInTheDocument();
    expect(packaging.querySelector('.product-packaging__media')).toBeNull();

    const programs = within(packaging).getByRole('table', { name: 'GF15 packaging programs' });
    ['Program', 'Retail presentation', 'Wall plate', 'Inner box', 'Carton'].forEach((heading) => {
      expect(within(programs).getByRole('columnheader', { name: heading })).toBeInTheDocument();
    });
    const rows = within(programs).getAllByRole('row').slice(1);
    expect(rows).toHaveLength(3);
    expect(rows[0]).toHaveTextContent(/Package A.*Color retail box.*Included.*10 pcs.*50 pcs/i);
    expect(rows[1]).toHaveTextContent(/Package B.*Blank white box.*Included.*10 pcs.*50 pcs/i);
    expect(rows[2]).toHaveTextContent(/Package C.*Color retail box.*Not included.*10 pcs.*100 pcs/i);
    expect(packaging).toHaveTextContent(/registered trademark.*brand authorization/i);
    expect(packaging).not.toHaveTextContent(/registered patent/i);
    expect(within(packaging).getByRole('link', { name: /Discuss GF15 configuration/i })).toBeInTheDocument();
  });

  it('prevents wall-plate images from inheriting their 1000px HTML height', () => {
    const styles = readFileSync('src/styles/product-experience.css', 'utf8');
    const wallPlateImageRules = styles.match(/\.product-wallplate-option img\s*\{[^}]+\}/)?.[0] || '';

    expect(wallPlateImageRules).toMatch(/height:\s*auto/);
    expect(wallPlateImageRules).toMatch(/aspect-ratio:\s*1\s*\/\s*1/);
    expect(wallPlateImageRules).toMatch(/object-fit:\s*contain/);
  });

  it('presents GF15 engineering in a real application scene with the complete proof set', () => {
    const { container } = renderDetail('gf15');
    const featureStory = container.querySelector('.product-story--feature');
    const editorial = featureStory.querySelector('.product-engineering-editorial');
    const expectedProofs = [
      'UL / cUL listed · UL 943 5th Edition',
      'Patent protected · US / CN',
      'Anti-interference',
      'Self-test every 15 minutes',
      'Reverse-wiring protection',
      '20A feed-through',
      'Dual-color LED indicator',
      '3-year warranty',
    ];

    expect(editorial).not.toBeNull();
    expect(editorial.querySelector('.product-engineering-editorial__head-main')).not.toBeNull();
    expect(featureStory.querySelector('.product-feature-showcase')).toBeNull();
    expect(featureStory.querySelector('.product-story__split')).toBeNull();
    expect(within(editorial).getByRole('img', { name: 'GF15 installed in a bathroom vanity' }))
      .toHaveAttribute('src', expect.stringMatching(/gf15-feature-application-v3\.jpg$/));
    expect(within(editorial).getAllByRole('listitem')).toHaveLength(8);
    expectedProofs.forEach((proof) => {
      expect(within(editorial).getByText(proof)).toBeInTheDocument();
    });
  });

  it('uses a dedicated GF15 application-review image instead of reusing the gallery lifestyle image', () => {
    renderDetail('gf15');
    const applicationStory = screen
      .getByRole('heading', { level: 2, name: 'Designed for the environments in the specification.' })
      .closest('section');
    const applicationImage = within(applicationStory)
      .getByRole('img', { name: 'GF15 representative application setting' });

    expect(applicationImage).toHaveAttribute(
      'src',
      expect.stringMatching(/gf15-application-kitchen-v2\.jpg$/)
    );
    expect(applicationImage).not.toHaveAttribute(
      'src',
      expect.stringMatching(/gf15-lifestyle\.webp$/)
    );
  });

  it('keeps related products as four lowercase full-card links', () => {
    const { container } = renderDetail('gf15');
    const related = container.querySelector('.product-related');
    const cards = within(related).getAllByRole('link');

    expect(cards).toHaveLength(4);
    cards.forEach((card) => {
      expect(card).toHaveClass('pcard');
      expect(card.getAttribute('href')).toMatch(/^\/products\/gfci\/[a-z0-9-]+$/);
      expect(within(card).getByRole('img')).toBeInTheDocument();
    });
  });

  it('defines square contained media, subtle radii, cool surfaces, and responsive related grids', () => {
    const styles = readFileSync('src/styles/product-experience.css', 'utf8');
    const mediaRules = (maxWidth) => {
      const start = styles.indexOf(`@media (max-width: ${maxWidth}px)`);
      const end = styles.indexOf('\n@media ', start + 1);
      return styles.slice(start, end === -1 ? undefined : end);
    };

    expect(styles).toMatch(/--product-surface-strong:\s*#[0-9a-f]{6}/i);
    expect(styles).not.toMatch(/--product-warm|beige|warm media surfaces/i);
    expect(styles).toMatch(/\.product-media-square\s*\{[\s\S]*?aspect-ratio:\s*1\s*\/\s*1/);
    expect(styles).toMatch(/\.product-gallery__main\s*>\s*img[\s\S]*?object-fit:\s*contain[\s\S]*?object-position:\s*center/);
    expect(styles).toMatch(/\.product-gallery__main[\s\S]*?border-radius:\s*12px/);
    const thumbRules = styles.match(/\.product-gallery__thumb\s*\{[^}]+\}/)?.[0] || '';
    expect(thumbRules).toMatch(/border-radius:\s*9px/);
    expect(styles).toMatch(/\.product-finish-strip\s*\{[\s\S]*?grid-template-columns:\s*repeat\(6,[^;]+\)[\s\S]*?border-radius:\s*12px/);
    const finishCellRules = styles.match(/\.product-finish-strip figure\s*\{[^}]+\}/)?.[0] || '';
    expect(finishCellRules).toMatch(/border-radius:\s*12px/);
    const finishImageRules = styles.match(/\.product-finish-strip img\s*\{[^}]+\}/)?.[0] || '';
    expect(finishImageRules).toMatch(/height:\s*auto/);
    expect(finishImageRules).toMatch(/object-fit:\s*contain/);
    expect(finishImageRules).toMatch(/border-radius:\s*var\(--product-radius-sm\)/);
    expect(styles).toMatch(/\.product-related \.prod-grid\s*\{[\s\S]*?grid-template-columns:\s*repeat\(4,/);
    expect(mediaRules(1024)).toMatch(/\.product-related \.prod-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,/);
    expect(mediaRules(700)).not.toMatch(/\.product-related \.prod-grid/);
    expect(mediaRules(520)).not.toMatch(/\.product-related \.prod-grid\s*\{[^}]*grid-template-columns:\s*1fr/);
    expect(mediaRules(520)).toMatch(/\.product-finish-strip\s*\{[^}]*grid-template-columns:\s*1fr/);
    const reducedMotion = styles.slice(styles.indexOf('@media (prefers-reduced-motion: reduce)'));
    expect(reducedMotion).toContain('.product-gallery img');
    expect(reducedMotion).toContain('.product-finish-strip img');
    expect(reducedMotion).toMatch(/animation:\s*none\s*!important/);
    expect(reducedMotion).toMatch(/transform:\s*none\s*!important/);
    expect(reducedMotion).toMatch(/transition:\s*none\s*!important/);
  });

  it('uses source-aspect mobile story scenes so the product remains visible', () => {
    const styles = readFileSync('src/styles/product-experience.css', 'utf8');
    const phone = styles.slice(styles.indexOf('@media (max-width: 700px)'));

    expect(phone).toMatch(
      /\.product-engineering-editorial__scene\s*\{[^}]*aspect-ratio:\s*3\s*\/\s*2/
    );
    expect(phone).toMatch(/\.product-story__media--cover\s*\{[^}]*aspect-ratio:\s*3\s*\/\s*2/);
  });

  it('uses one pure-white square product stage across catalogues, galleries, finishes, and related cards', () => {
    const styles = readFileSync('src/styles/product-experience.css', 'utf8');
    const productCardRules = styles.match(/\.pcard\s*\{[^}]+\}/)?.[0] || '';
    const productCardMediaRules = styles.match(/\.pcard__media\s*\{[^}]+\}/)?.[0] || '';
    const productCardImageRules = styles.match(/\.pcard__media img\s*\{[^}]+\}/)?.[0] || '';
    const galleryMainRules = styles.match(/\.product-gallery__main\s*\{[^}]+\}/)?.[0] || '';
    const galleryThumbRules = styles.match(/\.product-gallery__thumb\s*\{[^}]+\}/)?.[0] || '';
    const finishCellRules = styles.match(/\.product-finish-strip figure\s*\{[^}]+\}/)?.[0] || '';
    const finishImageRules = styles.match(/\.product-finish-strip img\s*\{[^}]+\}/)?.[0] || '';

    expect(productCardRules).toMatch(/border-radius:\s*12px/);
    expect(productCardRules).toMatch(/background:\s*#fff/);
    expect(productCardMediaRules).toMatch(/aspect-ratio:\s*1/);
    expect(productCardMediaRules).toMatch(/background:\s*#fff/);
    expect(productCardImageRules).toMatch(/padding:\s*0/);
    expect(galleryMainRules).toMatch(/padding:\s*clamp\(12px,\s*2vw,\s*24px\)/);
    expect(galleryMainRules).toMatch(/border-radius:\s*12px/);
    expect(galleryMainRules).toMatch(/background:\s*#fff/);
    expect(galleryThumbRules).toMatch(/background:\s*#fff/);
    expect(finishCellRules).toMatch(/border-radius:\s*12px/);
    expect(finishCellRules).toMatch(/background:\s*#fff/);
    expect(finishImageRules).toMatch(/padding:\s*0/);
    expect(finishImageRules).toMatch(/background:\s*#fff/);
  });

  it('gives breadcrumbs and detail action links real touch boxes without layout motion', () => {
    const styles = readFileSync('src/styles/product-experience.css', 'utf8');
    const reducedMotion = styles.slice(styles.indexOf('@media (prefers-reduced-motion: reduce)'));

    expect(styles).toMatch(/\.product-detail-breadcrumb a,[\s\S]*?\.product-inquiry \.textlink\s*\{[^}]*display:\s*inline-flex[^}]*min-width:\s*44px[^}]*min-height:\s*44px[^}]*align-items:\s*center/s);
    const textLinkHoverRule = styles.match(/[^{}]*\.product-story \.textlink:hover[^{}]*\.product-inquiry \.textlink:hover[^{}]*\{[^}]+\}/)?.[0] || '';
    expect(textLinkHoverRule).toMatch(/gap:\s*6px/);
    expect(styles).not.toMatch(/\.product-(?:detail|story|technical|inquiry)[^}]*transition:\s*all/);
    expect(reducedMotion).toContain('.product-detail-breadcrumb a');
    expect(reducedMotion).toContain('.product-gallery button');
    expect(reducedMotion).toContain('.product-story a');
    expect(reducedMotion).toContain('.product-technical a');
    expect(reducedMotion).toContain('.product-inquiry button');
  });

  it('renders the complete GF15 specification as an always-visible grouped matrix', () => {
    const { container } = renderDetail('gf15');

    expect(container.querySelectorAll('#technical-details')).toHaveLength(1);
    const technical = container.querySelector('#technical-details');
    expect(technical).not.toBeNull();
    expect(technical).toHaveClass('product-specifications--matrix');

    const summary = within(technical).getByRole('list', { name: 'Key specifications' });
    expect(within(summary).getByText('15A, 125V')).toBeInTheDocument();
    expect(within(summary).getByText('NEMA 5-15R')).toBeInTheDocument();
    expect(within(summary).getByText('4–6 mA · <25 ms')).toBeInTheDocument();
    expect(within(summary).getByText('Side wire & back wire')).toBeInTheDocument();
    expect(within(summary).getByText(/E504391/)).toBeInTheDocument();

    const headings = [
      'Electrical performance',
      'Installation & configuration',
      'Compliance & application',
      'Materials & construction',
      'Quality & durability'
    ];
    headings.forEach((heading) => {
      expect(within(technical).getByRole('heading', { level: 3, name: heading })).toBeInTheDocument();
    });

    expect(within(technical).queryByRole('button', { name: /all specifications/i })).not.toBeInTheDocument();
    const matrix = technical.querySelector('.product-specification-matrix');
    expect(matrix).not.toBeNull();
    expect(technical.querySelectorAll('.product-specification-panel')).toHaveLength(5);
    expect(within(matrix).getByText('102–132V AC')).toBeVisible();
    expect(within(matrix).getByText('Side wire & back wire')).toBeVisible();

    expect(within(technical).getByText('0.8 mm high-precision phosphor bronze')).toBeInTheDocument();
    expect(within(technical).getByText('100% automated inspection · stated qualified rate 99.99%'))
      .toBeInTheDocument();
    expect(within(technical).getByText('3 years')).toBeInTheDocument();
    expect(technical.querySelector('.product-technical-table')).not.toBeInTheDocument();
    expect(technical.querySelector('.product-spec-mobile')).not.toBeInTheDocument();
    expect(technical.querySelector('.product-construction')).not.toBeInTheDocument();
    expect(container.querySelector('.product-key-facts')).toBeInTheDocument();
  });

  it('styles the always-visible specification matrix as two columns with a mobile stack', () => {
    const styles = readFileSync('src/styles/product-experience.css', 'utf8');
    const summaryRules = styles.match(/\.product-specifications--matrix \.product-specification-summary\s*\{[^}]+\}/)?.[0] || '';
    const matrixRules = styles.match(/\.product-specification-matrix\s*\{[^}]+\}/)?.[0] || '';
    const panelRules = styles.match(/\.product-specification-panel\s*\{[^}]+\}/)?.[0] || '';
    const labelRules = styles.match(/\.product-specification-panel dt\s*\{[^}]+\}/)?.[0] || '';

    expect(styles).toMatch(/\.product-specification-matrix\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/s);
    expect(styles).toMatch(/@media\s*\(max-width:\s*760px\)[\s\S]*?\.product-specification-matrix\s*\{[^}]*grid-template-columns:\s*1fr/s);
    expect(summaryRules).toMatch(/background:\s*var\(--product-navy-soft\)/);
    expect(summaryRules).toMatch(/border-radius:\s*16px/);
    expect(matrixRules).toMatch(/gap:\s*16px/);
    expect(matrixRules).toMatch(/border:\s*0/);
    expect(panelRules).toMatch(/border-radius:\s*16px/);
    expect(labelRules).toMatch(/text-transform:\s*none/);
  });

  it.each(OTHER_GFCI_MODELS)('renders every %s specification in the approved always-visible matrix', (sku) => {
    const { container } = renderDetail(sku.toLowerCase());
    const technical = container.querySelector('#technical-details');

    expect(container.querySelectorAll('#technical-details')).toHaveLength(1);
    expect(technical).toHaveClass('product-specifications--matrix');
    expect(within(technical).queryByRole('button', { name: /all specifications/i })).not.toBeInTheDocument();
    expect(technical.querySelector('details')).toBeNull();
    const matrix = technical.querySelector('.product-specification-matrix');
    expect(matrix).not.toBeNull();
    const groups = productSpecificationGroups(findProduct(sku));
    expect(matrix.querySelectorAll('.product-specification-panel')).toHaveLength(groups.length);
    for (const group of groups) {
      const panel = within(matrix).getByRole('region', { name: group.title });
      for (const [label, value] of group.rows) {
        expect(within(panel).getByText(label).nextElementSibling).toHaveTextContent(value);
        expect(within(panel).getByText(label).nextElementSibling).toBeVisible();
      }
    }
  });

  it('keeps GL20 certification neutral everywhere', () => {
    const { container } = renderDetail('gl20');

    expect(screen.getByRole('heading', {
      level: 1,
      name: '20A Blank Face GFCI Module'
    })).toBeInTheDocument();
    expect(screen.queryByText(/E504391/)).not.toBeInTheDocument();
    expect(screen.queryByAltText(/UL.*certification/i)).not.toBeInTheDocument();

    const technical = container.querySelector('#technical-details');
    expect(technical).not.toBeNull();
    expect(within(technical).getAllByText('Certification')).toHaveLength(2);
    expect(within(technical).getAllByText(/documentation review required/i)).toHaveLength(2);
    expect(screen.getByRole('heading', { level: 2, name: 'Documentation review for GL20.' })).toBeInTheDocument();
  });

  it('keeps the complete GF15 engineering proof set and removes unrelated commercial promises', () => {
    const { container } = renderDetail('gf15');
    const featureStory = screen
      .getByRole('heading', { level: 2, name: 'Protection, clearly documented.' })
      .closest('section');

    expect(featureStory).not.toBeNull();
    const engineeringPoints = within(featureStory).getAllByRole('listitem');
    expect(engineeringPoints).toHaveLength(8);
    expect(engineeringPoints.filter((point) => /self-test/i.test(point.textContent))).toHaveLength(1);
    expect(container).not.toHaveTextContent(/400 cartons|within 6 hours|warehouse stock|MOQ from/i);
  });

  it('prefills the inquiry model and exposes one non-colliding mobile quote action', () => {
    const { container } = renderDetail('gf15');

    expect(container.querySelectorAll('#inquiry')).toHaveLength(1);
    expect(screen.getByLabelText('Model of interest')).toHaveValue('GF15');
    expect(screen.getByRole('heading', { level: 3, name: 'Send a product brief.' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Request quote for GF15' })).toHaveAttribute(
      'href',
      '/products/gfci/gf15#inquiry'
    );
    const quote = screen.getByRole('link', { name: 'Request quote for GF15' });
    expect(quote).toHaveAttribute('aria-label', 'Request quote for GF15');
    expect(quote.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(quote.textContent.trim()).toBe('');

    const styles = readFileSync('src/styles.css', 'utf8');
    expect(styles).toMatch(/@media \(min-width:\s*701px\)[\s\S]*?\.product-mobile-quote\s*\{[\s\S]*?display:\s*none/);
    expect(styles).toMatch(/@media \(max-width:\s*700px\)[\s\S]*?\.product-mobile-quote\s*\{[\s\S]*?right:\s*(?:7[0-9]|[89][0-9])px/);
    expect(styles).toMatch(
      /@media \(max-width:\s*700px\)[\s\S]*?\.footer--product-detail\s*\{[\s\S]*?padding-bottom:\s*calc\([^}]*env\(safe-area-inset-bottom/
    );
    expect(styles).toMatch(/\.footer--product-detail\s*\{[\s\S]*?padding-bottom:\s*calc\(176px\s*\+/);
    const shared = readFileSync('src/styles/site-system.css', 'utf8');
    const mobile = shared.slice(shared.indexOf('@media (max-width: 760px)'));
    const quoteStyle = mobile.match(/\.product-mobile-quote\s*\{([^}]*)\}/)?.[1] || '';
    expect(quoteStyle).toMatch(/position:\s*fixed/);
    expect(quoteStyle).toMatch(/left:\s*max\(16px, env\(safe-area-inset-left/);
    expect(quoteStyle).toMatch(/right:\s*auto/);
    expect(quoteStyle).toMatch(/width:\s*46px/);
    expect(quoteStyle).toMatch(/height:\s*46px/);
    expect(quoteStyle).toMatch(/border-radius:\s*12px/);
    expect(quoteStyle).toMatch(/background:\s*var\(--navy\)/);
  });

  it('preserves the exact current pathname when navigating to same-page anchors', async () => {
    const user = userEvent.setup();
    renderDetail('GF15', '/Products/GFCI/GF15/?source=review');

    expect(screen.getByRole('link', { name: /Request a quote/ })).toHaveAttribute(
      'href',
      '/Products/GFCI/GF15/?source=review#inquiry'
    );
    const technicalLink = screen.getByRole('link', { name: 'Technical details' });
    expect(technicalLink).toHaveAttribute('href', '/Products/GFCI/GF15/?source=review#technical-details');

    await user.click(technicalLink);
    expect(screen.getByTestId('location')).toHaveTextContent(
      '/Products/GFCI/GF15/?source=review#technical-details'
    );
  });

  it('keeps inquiry fields and synchronizes the model after related-product navigation', async () => {
    const user = userEvent.setup();
    renderDetail('gf15');

    await user.type(screen.getByLabelText('Your name *'), 'Avery Chen');
    await user.click(screen.getByRole('link', { name: 'GF20 20A Self-Test GFCI Receptacle' }));

    expect(await screen.findByRole('heading', { level: 1, name: '20A Self-Test GFCI Receptacle' })).toBeInTheDocument();
    expect(screen.getByLabelText('Model of interest')).toHaveValue('GF20');
    expect(screen.getByLabelText('Your name *')).toHaveValue('Avery Chen');
  });

  it('presents installation data in one asymmetric technical canvas', () => {
    renderDetail('gf15');

    const installation = screen.getByRole('region', { name: 'Wiring and dimensions.' });
    expect(installation).toHaveAttribute('id', 'installation-reference');
    expect(installation.querySelector('.product-installation__canvas')).toBeInTheDocument();
    expect(installation.querySelector('.product-installation__grid')).not.toBeInTheDocument();

    expect(within(installation).getByRole('heading', { name: 'Wire by terminal, not by position.' })).toBeInTheDocument();
    expect(installation.querySelector('[data-wire="neutral"]')).toHaveTextContent(/Neutral.*white conductor.*silver screw/i);
    expect(installation.querySelector('[data-wire="hot"]')).toHaveTextContent(/Hot.*black conductor.*brass screw/i);
    expect(installation.querySelector('[data-wire="ground"]')).toHaveTextContent(/Ground.*copper or green conductor.*green screw/i);
    expect(installation.querySelector('.product-installation__device-note')).toHaveTextContent(/LINE and LOAD markings/i);
    expect(installation.querySelector('.product-installation__sequence')).toHaveTextContent(
      /terminal holes.*tighten.*clockwise.*RESET.*green LED/i
    );

    expect(within(installation).getByRole('heading', { name: 'Three views. Three critical dimensions.' })).toBeInTheDocument();
    const metrics = installation.querySelector('.product-installation__metrics');
    expect(metrics).toHaveTextContent(/Overall height.*4\.53 in.*115 mm/i);
    expect(metrics).toHaveTextContent(/Plate width.*2\.75 in.*70 mm/i);
    expect(metrics).toHaveTextContent(/Body depth.*1\.56 in.*39\.7 mm/i);
  });

  it('redirects an unknown sku to the GFCI series route', () => {
    renderDetail('unknown-model');

    expect(screen.getByText('GFCI series fallback')).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/products/gfci');
  });

  it('defines visible focus states for the gallery controls and enlarged view', () => {
    const styles = readFileSync('src/styles.css', 'utf8');

    expect(styles).toMatch(/\.product-gallery__main:focus-visible\s*\{[\s\S]*?outline:/);
    expect(styles).toMatch(/\.product-gallery__dialog-close:focus-visible\s*\{[\s\S]*?outline:/);
  });

  it('stacks the product hero at tablet widths', () => {
    const styles = readFileSync('src/styles.css', 'utf8');

    expect(styles).toMatch(
      /@media \(max-width:\s*900px\)[\s\S]*?\.product-detail-hero__grid\s*\{[\s\S]*?grid-template-columns:\s*1fr/
    );
  });
});
