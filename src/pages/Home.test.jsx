import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import Home from './Home.jsx';
import { productLines } from '../data/lines.js';

function renderHome() {
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Home />
    </MemoryRouter>
  );
}

describe('Home', () => {
  it('keeps the classic homepage identifiable and places customization beside the OEM process', () => {
    const { container } = renderHome();
    expect(container.querySelector('#homepage')).toHaveAttribute('data-home-version', 'classic');
    const process = screen.getByRole('heading', { name: 'From specification to production.' }).closest('section');
    expect(process.nextElementSibling).toContainElement(screen.getByRole('heading', { name: 'Customize your product range.' }));
  });
  it('keeps every homepage chapter inside one shared presentation frame', () => {
    const { container } = renderHome();
    const homepage = container.querySelector('#homepage');
    expect(homepage).not.toBeNull();
    expect(within(homepage).getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(within(homepage).getAllByRole('heading', { level: 2 })).toHaveLength(10);
    expect(homepage).toContainElement(screen.getByLabelText('Fahint manufacturing highlights'));
    expect(homepage).toContainElement(screen.getByLabelText('Your name *'));
  });

  it('keeps the factory photo full bleed and its supporting points outside the photographic stage', () => {
    renderHome();
    const section = screen.getByRole('heading', { name: 'Quality checked on the line.' }).closest('section');
    const stage = section.querySelector('.homepage-factory-stage');
    expect(stage).toContainElement(within(section).getByAltText('Fahint production and testing line'));
    expect(stage).toContainElement(within(section).getByRole('heading', { level: 2 }));
    const points = within(section).getByRole('list', { name: 'Manufacturing capabilities' });
    expect(stage).not.toContainElement(points);
    expect(section.querySelector('.homepage-factory-proof')).toContainElement(points);
    expect(within(points).getAllByRole('listitem')).toHaveLength(4);
  });

  it('gives application scenes separate readable captions without covering the photograph', () => {
    const { container } = renderHome();
    const applications = container.querySelectorAll('.editorial-application');
    expect(applications).toHaveLength(4);
    applications.forEach((card) => {
      const image = card.querySelector('img');
      const caption = card.querySelector('.editorial-application__copy');
      expect(image.nextElementSibling).toBe(caption);
      expect(card.querySelector('.editorial-application__shade')).toBeNull();
      expect(caption.querySelector('.editorial-application__heading')).toContainElement(card.querySelector('h3'));
      expect(caption).toContainElement(card.querySelector('.editorial-application__arrow'));
    });
  });

  it('uses canonical catalog names for featured ranges and links to the complete directory', () => {
    const { container } = renderHome();
    expect(screen.getByRole('heading', { name: 'Featured product ranges.' })).toBeInTheDocument();
    container.querySelectorAll('.editorial-product-panel').forEach((card) => {
      const line = productLines.find((item) => `/products/${item.slug}` === card.getAttribute('href'));
      expect(card.querySelector('h3').textContent).toBe(line.name);
    });
    expect(screen.getByRole('link', { name: 'Browse all 7 product ranges' })).toHaveAttribute('href', '/products');
  });
  it('does not add the full model catalogue to the homepage initial bundle', () => {
    const source = readFileSync('src/components/home/HomeFaqInquiry.jsx', 'utf8');
    expect(source).not.toMatch(/import\s+\{[^}]*catalogProducts[^}]*\}\s+from/);
    expect(source).toContain("import('../../data/catalogProducts.js')");
  });
  it('keeps small labels and the hero action readable against their backgrounds', () => {
    const css = readFileSync('src/styles.css', 'utf8');
    const declaration = (selector, property) => {
      let value;
      for (const [, selectors, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
        if (selectors.split(',').some((entry) => entry.trim() === selector)) {
          value = body.match(new RegExp(`(?:^|;)\\s*${property}:\\s*(#[a-fA-F0-9]{6})`))?.[1] || value;
        }
      }
      expect(value, selector).toBeTruthy();
      return value;
    };
    const luminance = (hex) => {
      const values = hex.slice(1).match(/.{2}/g).map((part) => parseInt(part, 16) / 255)
        .map((part) => part <= .04045 ? part / 12.92 : ((part + .055) / 1.055) ** 2.4);
      return values[0] * .2126 + values[1] * .7152 + values[2] * .0722;
    };
    for (const [selector, background] of [
      ['.homepage-why-fahint .editorial-eyebrow', '#eef3f6'],
      ['.editorial-applications > .editorial-heading .editorial-eyebrow', '#edf2f5'],
      ['.home-certificates .home-section-label', '#edf2f5'],
      ['.home-faq .home-section-label', '#f3f5f6']
    ]) {
      const a = luminance(declaration(selector, 'color'));
      const b = luminance(background);
      expect((Math.max(a, b) + .05) / (Math.min(a, b) + .05), selector).toBeGreaterThanOrEqual(4.5);
    }
    expect(1.05 / (luminance(declaration('.editorial-hero .editorial-button', 'background')) + .05)).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps commercial terms model-specific and makes documents useful to buyers', () => {
    const { container } = renderHome();
    expect(container.textContent).not.toMatch(/400 cartons|as fast as 10 days|Every product carries a 3-year|Five product platforms|Browse certified models/);
    expect(screen.getByRole('link', { name: /Download product catalog/i })).toHaveAttribute('href', 'assets/documents/fahint-product-catalog.pdf');
    expect(screen.getAllByRole('link', { name: /^Download .* PDF$/ })).toHaveLength(7);
  });
  it('reserves the correct aspect ratio for every homepage image', () => {
    const { container } = renderHome();

    const imagesWithoutDimensions = [...container.querySelectorAll('img')]
      .filter((image) => !image.hasAttribute('width') || !image.hasAttribute('height'))
      .map((image) => image.getAttribute('src'));

    expect(imagesWithoutDimensions).toEqual([]);
  });

  it('identifies the manufacturer and exposes both buyer routes in the first chapter', () => {
    renderHome();

    expect(screen.getByText('FAHINT · Wiring-device manufacturer')).toBeInTheDocument();
    const hero = screen.getByRole('heading', { name: 'Wiring devices for your market.' }).closest('section');
    expect(hero).toBeInTheDocument();
    expect(within(hero).getByRole('link', { name: /Explore FAHINT products/i })).toHaveAttribute('href', '/products');
    expect(within(hero).getByRole('link', { name: /Discuss OEM\/ODM/i })).toHaveAttribute('href', '/contact');
    expect(hero).toHaveTextContent('Choose FAHINT products or work with our manufacturing team on OEM/ODM orders.');
    expect(hero).toHaveTextContent('North American wiring devices for distributors, contractors and private-label brands.');
    expect(screen.getByText('Selected listed models')).toBeInTheDocument();
  });

  it('shows all six product systems in the editorial product mosaic', () => {
    renderHome();

    [
      'GFCI Outlets',
      'USB Outlets',
      'Standard Receptacles',
      'Dimmers',
      'Smart Switches',
      'Wallplates'
    ].forEach((name) => {
      expect(screen.getByRole('heading', { name })).toBeInTheDocument();
    });
  });

  it('uses high-resolution category artwork for switches and wall plates', () => {
    renderHome();

    const switchesImage = screen.getByRole('heading', { name: 'Dimmers' })
      .closest('a')
      ?.querySelector('img');
    const wallplatesImage = screen.getByRole('heading', { name: 'Wallplates' })
      .closest('a')
      ?.querySelector('img');

    expect(switchesImage).toHaveAttribute('src', 'assets/images/editorial-home/category-switches-scene.webp');
    expect(switchesImage).toHaveAttribute('width', '1600');
    expect(switchesImage).toHaveAttribute('height', '900');
    expect(wallplatesImage).toHaveAttribute('src', 'assets/images/editorial-home/category-wallplates-scene.webp');
    expect(wallplatesImage).toHaveAttribute('width', '1600');
    expect(wallplatesImage).toHaveAttribute('height', '900');
  });

  it('makes each editorial product card a full-card link', () => {
    renderHome();

    [
      ['GFCI Outlets', '/products/gfci'],
      ['USB Outlets', '/products/usb-outlets'],
      ['Standard Receptacles', '/products/receptacles'],
      ['Dimmers', '/products/dimmers'],
      ['Smart Switches', '/products/smart-switches'],
      ['Wallplates', '/products/wallplates']
    ].forEach(([name, href]) => {
      const heading = screen.getByRole('heading', { name });
      expect(heading.closest('a')).toHaveAttribute('href', href);
    });
  });

  it('separates each category image from its concise caption', () => {
    const { container } = renderHome();
    const cards = [...container.querySelectorAll('.homepage-product-portfolio .editorial-product-panel')];

    expect(cards).toHaveLength(6);
    cards.forEach((card) => {
      const image = card.querySelector('img');
      const caption = card.querySelector('.editorial-panel__content');
      expect(image.nextElementSibling).toBe(caption);
      expect(card.querySelector('.editorial-panel__shade')).toBeNull();
      expect(caption.querySelector('.editorial-panel__number')).toBeNull();
      expect(caption.querySelector('.editorial-panel__label')).toBeNull();
      expect(caption.querySelectorAll('p')).toHaveLength(1);
      expect(caption.querySelector('p').textContent.length).toBeLessThan(110);
      expect(caption.querySelector('.editorial-panel__heading h3')).toBeInTheDocument();
      expect(caption.querySelector('.editorial-panel__heading .editorial-panel__arrow')).toHaveAttribute('aria-hidden', 'true');
    });
    expect(cards.map((card) => card.querySelector('img').getAttribute('src'))).toEqual([
      'assets/images/editorial-home/product-gfci-optimized.webp',
      'assets/images/editorial-home/product-usb-optimized.webp',
      'assets/images/editorial-home/product-receptacle-optimized.webp',
      'assets/images/editorial-home/category-switches-scene.webp',
      'assets/images/editorial-home/product-smart-optimized.webp',
      'assets/images/editorial-home/category-wallplates-scene.webp'
    ]);
  });

  it('keeps rounded portfolio captions in normal flow on an opaque surface', () => {
    const styles = readFileSync('src/styles.css', 'utf8');
    const card = styles.match(/\.homepage-product-portfolio \.editorial-product-panel\s*\{([^}]*)\}/)?.[1] ?? '';
    const caption = styles.match(/\.homepage-product-portfolio \.editorial-panel__content\s*\{([^}]*)\}/)?.[1] ?? '';
    const description = styles.match(/\.homepage-product-portfolio \.editorial-panel__content > p\s*\{([^}]*)\}/)?.[1] ?? '';

    expect(card).toMatch(/display:\s*grid/);
    expect(card).toMatch(/grid-template-rows:\s*auto 1fr/);
    expect(card).toMatch(/aspect-ratio:\s*auto/);
    expect(card).toMatch(/border-radius:\s*var\(--product-radius-card,\s*15px\)/);
    expect(caption).toMatch(/position:\s*static/);
    expect(caption).toMatch(/background:\s*var\(--portfolio-card-surface\)/);
    expect(styles).toMatch(/--portfolio-card-surface:\s*#10213b/);
    expect(description).toMatch(/display:\s*block/);
    expect(description).toMatch(/font-size:\s*16px/);
    expect(description).toMatch(/line-height:\s*1\.6/);
    expect(caption + description).not.toMatch(/(?:^|;)\s*(?:height|max-height|(?:-webkit-)?line-clamp)\s*:/);
  });

  it('keeps the restored engineering and OEM posters in the homepage sequence', () => {
    renderHome();

    const headings = [
      'Wiring devices for your market.',
      'Featured product ranges.',
      'FAHINT products. Manufacturing expertise.',
      'Engineering across the range.',
      'Quality checked on the line.',
      'From specification to production.',
      'Customize your product range.',
      'Certifications & compliance.',
      'Built for homes and businesses.',
      'Buyer questions, answered.',
      'Request a quote.'
    ].map((name) => screen.getByRole('heading', { name }));

    headings.slice(1).forEach((heading, index) => {
      expect(headings[index].compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });
  });

  it('keeps the factory-area proof consistent with the company profile', () => {
    renderHome();

    expect(screen.getByText('70,000')).toBeInTheDocument();
    expect(screen.getByText('Factory area (sq ft)')).toBeInTheDocument();
    expect(screen.queryByText('2,400m²')).not.toBeInTheDocument();
  });

  it('keeps the manufacturing photograph full-bleed with a low four-column proof strip', () => {
    renderHome();

    const title = screen.getByRole('heading', { name: 'Quality checked on the line.' });
    const section = title.closest('section');
    const image = within(section).getByAltText('Fahint production and testing line');
    expect(section).toHaveClass('editorial-factory');
    expect(image).toHaveAttribute('src', 'assets/images/editorial-home/factory-optimized.webp');
    expect(image).toHaveAttribute('width', '1600');
    expect(image).toHaveAttribute('height', '900');
    expect(image.parentElement).toBe(section.querySelector('.homepage-factory-stage'));
    expect(image.closest('.container')).toBeNull();
    expect(section.querySelector('.editorial-factory__shade')).toHaveAttribute('aria-hidden', 'true');
    const facts = within(section).getByRole('list', { name: 'Manufacturing capabilities' });
    expect(facts).toHaveClass('editorial-factory__points');
    expect(facts.parentElement).toBe(section.querySelector('.homepage-factory-proof'));
    expect(section.querySelector('.homepage-factory-stage').nextElementSibling).toBe(facts.parentElement);
    expect(within(facts).getAllByRole('listitem').map((item) => within(item).getByRole('heading').textContent)).toEqual([
      'Integrated production', 'Functional inspection', 'Laboratory support', 'Export experience'
    ]);
    const styles = readFileSync('src/styles.css', 'utf8');
    expect(styles).toMatch(/\.homepage-restored-poster \.editorial-factory__points\s*\{[^}]*grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/);
    expect(styles).toMatch(/\.editorial-factory__points h3\s*\{[^}]*color:\s*#fff/);
  });

  it('gives the brand photograph and introduction their own space above all four support items', () => {
    renderHome();

    const section = screen.getByRole('heading', { name: 'FAHINT products. Manufacturing expertise.' }).closest('section');
    const overview = section.querySelector('.editorial-brand__grid');
    const support = within(section).getByRole('list', { name: 'Fahint program support' });
    expect(overview.nextElementSibling).toBe(support);
    expect(overview).not.toContainElement(support);
    expect(overview.parentElement).toHaveClass('container');
    expect(within(support).getAllByRole('listitem').map((item) => [
      within(item).getByRole('heading', { level: 3 }).textContent,
      item.querySelector('p').textContent
    ])).toEqual([
      ['Model selection', 'Compare ratings, functions and installation requirements before you choose.'],
      ['Document review', 'Check model-specific specifications and certification references in one place.'],
      ['Matched finishes', 'Coordinate device colors and wall plates across your selected range.'],
      ['Sample approval', 'Review the product, packaging and markings before confirming production.']
    ]);
    expect(within(overview).getByAltText('Fahint coordinated wiring-device product family'))
      .toHaveAttribute('src', 'assets/images/editorial-home/brand-system-family-final-optimized.webp');
    expect(within(overview).getByRole('link', { name: /Discover Fahint/i })).toHaveAttribute('href', '/about');
    expect(within(overview).getByRole('link', { name: /Download product catalog/i })).toHaveAttribute('download');
  });

  it('separates poster chapters and reflows open support rows without cropping the brand image', () => {
    const styles = readFileSync('src/styles.css', 'utf8');
    expect(styles).toMatch(/--home-chapter-gap:\s*clamp\(64px,\s*6vw,\s*112px\)/);
    expect(styles).toMatch(/\.homepage-restored-poster \+ \.homepage-restored-poster\s*\{[^}]*margin-top:\s*var\(--home-chapter-gap\)/);
    expect(styles).toMatch(/\.editorial-brand__support\s*\{[^}]*grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/);
    expect(styles).toMatch(/\.homepage-why-fahint \.editorial-brand__media img\s*\{[^}]*height:\s*auto[^}]*object-fit:\s*contain/);
    expect(styles).toMatch(/\.homepage-restored-poster \.editorial-process\s*\{[^}]*background:\s*transparent/);
    expect(styles).toMatch(/\.homepage-restored-poster \.editorial-process > li:not\(:last-child\)::after\s*\{/);
    expect(styles).toMatch(/@media \(max-width:\s*1100px\)\s*\{\s*\/\* Brand[\s\S]*?\.editorial-brand__support\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
    expect(styles).toMatch(/@media \(max-width:\s*760px\)\s*\{\s*\/\* Chapter[\s\S]*?\.editorial-brand__support\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  });

  it('uses homepage-specific hooks for the proof bridge and portfolio transition', () => {
    renderHome();

    expect(screen.getByLabelText('Fahint manufacturing highlights')).toHaveClass('homepage-proof-bridge');
    expect(screen.getByRole('heading', { name: 'Featured product ranges.' }).closest('section'))
      .toHaveClass('homepage-product-portfolio');
  });

  it('makes each application panel a full-card link', () => {
    renderHome();

    [
      ['Kitchens & Wet Areas', '/products/gfci'],
      ['Hospitality & Multifamily', '/products/usb-outlets'],
      ['Commercial Fit-Out', '/capabilities'],
      ['Bathrooms & Renovation', '/products/receptacles']
    ].forEach(([name, href]) => {
      const heading = screen.getByRole('heading', { name });
      expect(heading.closest('a')).toHaveAttribute('href', href);
    });
  });

  it('keeps compliance, FAQ and the full inquiry form in the shortened homepage', async () => {
    renderHome();

    [
      'Certifications & compliance.',
      'Buyer questions, answered.',
      'Request a quote.',
      'Tell us what you need'
    ].forEach((name) => {
      expect(screen.getByRole('heading', { name })).toBeInTheDocument();
    });
    expect(screen.getByLabelText('Your name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Business email *')).toBeInTheDocument();
    expect(screen.getByLabelText('Requirements *')).toBeInTheDocument();
    await screen.findByRole('option', { name: /^FTR15C-3100 —/ });
    const models = within(screen.getByLabelText('Model of interest')).getAllByRole('option');
    expect(models.some((option) => option.value === 'FTR15C-3100')).toBe(true);
    expect(models.some((option) => option.value === 'GF15')).toBe(true);
  });

  it('defers additional model data until the inquiry is approached or focused', async () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    vi.stubGlobal('IntersectionObserver', class {
      observe = observe;
      disconnect = disconnect;
    });
    try {
      renderHome();
      expect(screen.queryByRole('option', { name: /^FTR15C-3100 —/ })).not.toBeInTheDocument();
      fireEvent.focusIn(screen.getByLabelText('Your name *'));
      expect(await screen.findByRole('option', { name: /^FTR15C-3100 —/ })).toBeInTheDocument();
      expect(observe).toHaveBeenCalled();
      expect(disconnect).toHaveBeenCalled();
    } finally { vi.unstubAllGlobals(); }
  });

  it('restores the engineering and OEM artwork and keeps their original content', () => {
    renderHome();

    const engineering = screen.getByRole('heading', { name: 'Engineering across the range.' }).closest('section');
    expect(engineering).toHaveClass('editorial-engineering');
    expect(within(engineering).getByAltText('Fahint wiring-device engineering platform')).toHaveAttribute('src', 'assets/images/editorial-home/product-gfci-optimized.webp');
    ['Safety & compliance', 'Charging performance', 'Control intelligence', 'Coordinated form & finish'].forEach((text) => {
      expect(within(engineering).getByText(text)).toBeVisible();
    });
    expect(within(engineering).getByRole('link', { name: /Explore engineering capability/ })).toHaveAttribute('href', '/capabilities');
    const oem = screen.getByRole('heading', { name: 'From specification to production.' }).closest('section');
    expect(oem).toHaveClass('editorial-oem');
    expect(within(oem).getByAltText('Fahint automated manufacturing equipment')).toHaveAttribute('src', 'assets/images/editorial-home/about-fahint-optimized.webp');
    expect(within(oem).getByRole('list', { name: 'OEM program steps' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Customize your product range.' }).closest('section').querySelector('.homepage-oem-program__process')).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Build the Line Your Market Needs.' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Latest From Fahint.' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Discover Fahint/i })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: /View certification details/i })).toHaveAttribute('href', '/about#certifications');
  });

  it('keeps separate floating actions in a vertical mobile safe-area stack', () => {
    const styles = readFileSync('src/styles.css', 'utf8');

    expect(styles).toMatch(
      /@media \(max-width:\s*700px\)[\s\S]*?\.rail\s*\{[\s\S]*?bottom:\s*calc\(16px \+ env\(safe-area-inset-bottom, 0px\)\)[\s\S]*?flex-direction:\s*column/
    );
    expect(styles).toMatch(/@media \(max-width:\s*700px\)[\s\S]*?\.rail__icon\s*\{[\s\S]*?width:\s*46px;[\s\S]*?height:\s*46px/);
  });

  it('keeps homepage chapters stable and limits reveal motion to media and groups', () => {
    renderHome();

    [
      'Featured product ranges.',
      'FAHINT products. Manufacturing expertise.',
      'Quality checked on the line.',
      'Certifications & compliance.',
      'Customize your product range.',
      'Built for homes and businesses.',
      'Buyer questions, answered.',
      'Request a quote.'
    ].forEach((name) => {
      const section = screen.getByRole('heading', { name }).closest('section');
      expect(section).not.toHaveClass('reveal--from-left');
      expect(section).not.toHaveClass('reveal--from-right');
    });

    expect(screen.getByAltText('Fahint coordinated wiring-device product family').parentElement).toHaveClass(
      'reveal--media'
    );
    expect(screen.getByAltText('Fahint retail packaging and matching GFCI wall plate').parentElement).toHaveClass(
      'reveal--media'
    );
  });

  it('groups the real packaging image and six capabilities above one shared inquiry footer', () => {
    renderHome();

    const title = screen.getByRole('heading', { name: 'Customize your product range.' });
    const section = title.closest('section');
    expect(title.closest('header')).toHaveClass('homepage-oem-program__intro');
    const options = within(section).getByRole('list', { name: 'Customization options' });
    const cards = within(options).getAllByRole('listitem');
    expect(cards.map((card) => within(card).getByRole('heading', { level: 3 }).textContent)).toEqual([
      'Product mix', 'Colors & finishes', 'Logo & markings', 'Packaging', 'Compliance files', 'Samples & testing'
    ]);
    cards.forEach((card) => {
      expect(card.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
      expect(card.querySelector('p').textContent.length).toBeGreaterThan(30);
      expect(card.querySelector('button, a')).toBeNull();
    });
    const image = within(section).getByAltText('Fahint retail packaging and matching GFCI wall plate');
    expect(image).toHaveAttribute('src', 'assets/images/products/gf15-package-standard-white-v1.jpg');
    expect(image.closest('figure')).toBeInTheDocument();
    const workspace = section.querySelector('.homepage-oem-program__workspace');
    expect(workspace).toContainElement(image);
    expect(workspace).toContainElement(options);
    const footer = workspace.querySelector('.homepage-oem-program__footer');
    expect(footer).not.toBeNull();
    expect(footer).not.toContainElement(image);
    const cta = within(section).getByRole('link', { name: /Request a quote/i });
    expect(cta).toHaveAttribute('href', '/contact');
    expect(footer).toContainElement(cta);
    expect(image.closest('figure')).not.toContainElement(cta);
    expect(within(footer).getByRole('heading', { name: 'Your packaging. Your presentation.' })).toBeVisible();
    expect(footer).toHaveTextContent('brand authorization and sample approval');
  });

  it('presents the restored OEM process as one ordered sequence with decorative markers', () => {
    renderHome();

    const steps = screen.getByRole('list', { name: 'OEM program steps' });
    expect(steps.tagName).toBe('OL');
    const items = within(steps).getAllByRole('listitem');
    expect(items.map((item) => within(item).getByRole('heading').textContent)).toEqual([
      'Requirement review', 'Product configuration', 'Sample & verification', 'Production & delivery'
    ]);
    expect(items.map((item) => item.querySelector('.editorial-process__number')?.textContent)).toEqual([
      '01', '02', '03', '04'
    ]);
    items.forEach((item) => expect(item.querySelector('svg')).toHaveAttribute('aria-hidden', 'true'));
    items.forEach((item) => expect(item.querySelector('p').textContent.length).toBeGreaterThan(30));
  });

  it('keeps the packaging palette cool and its photograph uncropped', () => {
    const styles = readFileSync('src/styles.css', 'utf8');
    const rule = (selector) => {
      const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return styles.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
    };
    expect(rule('.editorial-customization.homepage-oem-program')).toMatch(/background:\s*#e4edf2/);
    expect(rule('.homepage-oem-program__workspace')).toMatch(/border-radius:\s*var\(--product-radius-card,\s*15px\)/);
    expect(rule('.homepage-oem-program .editorial-customization__media')).toMatch(/min-height:\s*0/);
    const imageRule = rule('.homepage-oem-program .editorial-customization__media img');
    expect(imageRule).toMatch(/height:\s*auto/);
    expect(imageRule).toMatch(/max-width:\s*380px/);
    expect(imageRule).toMatch(/object-fit:\s*contain/);
    expect(rule('.homepage-oem-program__footer')).toMatch(/display:\s*flex/);
    expect(rule('.homepage-oem-program__option')).toMatch(/border-bottom:/);
    expect(rule('.homepage-oem-program__option p')).toMatch(/font-size:\s*15px/);
  });

  it('uses one left-first heading layout for product, OEM, certification, customization and application chapters', () => {
    renderHome();

    [
      'Featured product ranges.',
      'From specification to production.',
      'Certifications & compliance.',
      'Customize your product range.',
      'Built for homes and businesses.'
    ].forEach((name) => {
      const heading = screen.getByRole('heading', { name });
      const header = heading.parentElement.parentElement;
      expect(header).toHaveClass('homepage-section-heading');
      expect(header.firstElementChild).toContainElement(heading);
      expect(header.children).toHaveLength(2);
    });
    expect(screen.getByRole('heading', { name: 'Buyer questions, answered.' }).closest('section'))
      .toHaveAttribute('data-title-align', 'left');

    const styles = readFileSync('src/styles.css', 'utf8');
    expect(styles).toMatch(/\.editorial-home-front \.homepage-section-heading\s*\{[^}]*align-items:\s*center/);
    expect(styles).not.toContain('.editorial-heading--applications');
    expect(styles).toMatch(/@media \(max-width:\s*760px\)[\s\S]*?\.editorial-home-front \.homepage-section-heading\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  });

  it('keeps a stronger hero and shared responsive title roles without changing the typeface', () => {
    const styles = readFileSync('src/styles.css', 'utf8');
    const titleTokens = ['--home-display-size', '--home-poster-title-size', '--home-title-size'];
    const titleSize = (token, viewport, mobile) => {
      const definitions = [...styles.matchAll(new RegExp(`${token}:\\s*clamp\\(([^)]+)\\)`, 'g'))];
      expect(definitions.length, token).toBe(2);
      const parts = definitions[mobile ? 1 : 0][1].split(',').map((part) => part.trim());
      const pixels = parts.map((part) => parseFloat(part) * (part.endsWith('rem') ? 16 : viewport / 100));
      return Math.max(pixels[0], Math.min(pixels[1], pixels[2]));
    };
    [320, 390, 760, 768, 1024, 1440, 1920].forEach((viewport) => {
      const [hero, poster, section] = titleTokens.map((token) => titleSize(token, viewport, viewport <= 760));
      expect(hero, `hero at ${viewport}`).toBeGreaterThan(poster);
      expect(poster, `poster at ${viewport}`).toBeGreaterThan(section);
    });
    expect(styles).toMatch(/\.editorial-home-front \.editorial-hero h1\s*\{[^}]*font-size:\s*var\(--home-display-size\)/);
    expect(styles).toMatch(/\.editorial-home-front \.homepage-restored-poster h2\s*\{[^}]*font-size:\s*var\(--home-poster-title-size\)/);
    expect(styles).toContain("--font: 'Source Sans 3'");
    expect(styles).toMatch(/\.editorial-factory\.homepage-restored-poster\s*\{[^}]*min-height:\s*920px/);
  });

  it('centers the certificate strip and balances the OEM CTA at wide desktop widths', () => {
    const styles = readFileSync('src/styles.css', 'utf8');

    expect(styles).toMatch(
      /@media \(min-width:\s*1500px\)[\s\S]*?\.home-certificates \.certcar__track\s*\{[\s\S]*?display:\s*grid;[\s\S]*?grid-template-columns:\s*repeat\(6,\s*minmax\(0,\s*1fr\)\)/
    );
    expect(styles).toMatch(
      /\.home-cta\[data-title-align='right'\] \.container\.home-cta__inner\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/
    );
  });

  it('includes reduced-motion and complete-image mobile editorial cards', () => {
    const styles = readFileSync('src/styles.css', 'utf8');

    expect(styles).toMatch(/prefers-reduced-motion:\s*reduce/);
    expect(styles).toMatch(
      /@media \(max-width:\s*760px\)[\s\S]*?\.editorial-product-mosaic\s*\{[^}]*grid-auto-rows:\s*auto/
    );
    expect(styles).toMatch(
      /@media \(max-width:\s*760px\)[\s\S]*?\.editorial-product-panel\s*>\s*img\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*9[^}]*object-fit:\s*contain/
    );
    expect(styles).toMatch(
      /@media \(max-width:\s*760px\)[\s\S]*?\.editorial-application-grid\s*\{[^}]*grid-auto-rows:\s*auto/
    );
  });

  it('labels application scenes for phone focal positioning', () => {
    const { container } = renderHome();
    const scenes = [...container.querySelectorAll('.editorial-application')];

    expect(scenes.map((scene) => scene.dataset.mobileFocal)).toEqual([
      'right',
      'left',
      'center',
      'center'
    ]);
  });

  it('uses one short hero sequence and restrained interaction timings', () => {
    const styles = readFileSync('src/styles.css', 'utf8');

    expect(styles).toMatch(
      /\.editorial-hero__image\s*\{[\s\S]*?animation:\s*editorial-hero-image-in\s+800ms/
    );
    expect(styles).toMatch(
      /\.editorial-hero__content\s*>\s*\*\s*\{[\s\S]*?animation:\s*editorial-hero-copy-in\s+520ms/
    );
    expect(styles).toMatch(/transform:\s*scale\(1\.016\)/);
    expect(styles).toMatch(/\.reveal--media\[data-motion='ready'\]/);
    expect(styles).toMatch(/\.reveal--group\[data-motion='ready'\]/);
  });

  it('uses the condensed homepage rhythm and accessible mobile controls', () => {
    const styles = readFileSync('src/styles.css', 'utf8');

    expect(styles).toMatch(/\.homepage-why-fahint[\s\S]*?padding:\s*clamp\(88px,\s*7vw,\s*128px\)/);
    expect(styles).toMatch(/\.homepage-oem-program[\s\S]*?padding:\s*clamp\(88px,\s*7vw,\s*128px\)/);
    expect(styles).toMatch(
      /@media \(max-width:\s*760px\)[\s\S]*?\.editorial-button[\s\S]*?min-height:\s*44px/
    );
    expect(styles).toMatch(/\.editorial-hero__actions \.editorial-text-link\s*\{[^}]*min-height:\s*44px/);
    expect(styles).toMatch(
      /@media \(max-width:\s*760px\)[\s\S]*?\.editorial-hero h1[\s\S]*?font-size:\s*clamp\(38px,\s*11vw,\s*52px\)/
    );
  });

  it('keeps product-card hover zoom free of a flashing divider seam', () => {
    const styles = readFileSync('src/styles.css', 'utf8');
    const imageRule = styles.match(/\.editorial-product-panel\s*>\s*img,\s*\.editorial-application\s*>\s*img\s*\{([^}]*)\}/)?.[1] ?? '';
    const metaRule = styles.match(/\.editorial-panel__meta\s*\{([^}]*)\}/)?.[1] ?? '';

    expect(imageRule).toMatch(/backface-visibility:\s*hidden/);
    expect(imageRule).toMatch(/will-change:\s*transform/);
    expect(metaRule).not.toMatch(/border-top/);
  });

  it('bridges the hero, proof rail and light content without abrupt white bands', () => {
    const styles = readFileSync('src/styles.css', 'utf8');

    expect(styles).toMatch(
      /\.homepage-proof-bridge\s*\{[^}]*margin-top:\s*-42px[^}]*background:\s*linear-gradient/
    );
    expect(styles).toMatch(
      /\.homepage-proof-bridge \.editorial-proof__grid\s*\{[^}]*backdrop-filter:\s*blur\(14px\)/
    );
    expect(styles).toMatch(
      /\.editorial-home-front \.editorial-hero__note\s*\{[^}]*bottom:\s*72px/
    );
    expect(styles).toMatch(
      /\.homepage-product-portfolio\s*\{[^}]*padding-top:\s*clamp\(96px,\s*7vw,\s*128px\)[^}]*padding-bottom:\s*clamp\(64px,\s*5vw,\s*80px\)[^}]*background:\s*#07152c/
    );
    expect(styles).toMatch(
      /\.homepage-product-portfolio \.editorial-product-mosaic\s*\{[^}]*width:\s*min\(100%\s*-\s*clamp\(32px,\s*7vw,\s*128px\),\s*1680px\)[^}]*margin-inline:\s*auto[^}]*grid-auto-rows:\s*auto/
    );
    expect(styles).toMatch(
      /\.homepage-product-portfolio \.editorial-product-panel > img\s*\{[^}]*height:\s*auto[^}]*aspect-ratio:\s*16\s*\/\s*9[^}]*object-fit:\s*contain/
    );
    expect(styles).toMatch(
      /\.homepage-why-fahint\s*\{[^}]*margin-top:\s*0[^}]*padding-block:\s*clamp\(112px,\s*9vw,\s*160px\)[^}]*border-radius:\s*0[^}]*box-shadow:\s*none/
    );
    expect(styles).toMatch(
      /@media \(max-width:\s*760px\)[\s\S]*?\.homepage-proof-bridge \.editorial-proof__grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/
    );
  });

});
