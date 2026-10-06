import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import ProductDetail from './ProductDetail.jsx';
import { catalogProducts, findCatalogProduct, productHref } from '../data/catalogProducts.js';
import { publicAsset } from '../utils/publicAsset.js';
import { CatalogDrawings } from '../components/products/CatalogProductSections.jsx';

function renderModel(path) {
  return render(
    <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/products/:line/:sku" element={<ProductDetail />} />
        <Route path="/products/:line" element={<div>Series fallback</div>} />
        <Route path="/products" element={<div>Products fallback</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('catalogue product details', () => {
  it.each(['gfci', 'usb-outlets', 'receptacles', 'dimmers', 'smart-switches', 'lighting-switches', 'wallplates'])('keeps one model-specific inquiry icon on %s detail pages', (line) => {
    const product = catalogProducts.find((candidate) => candidate.line === line && !candidate.draft);
    const path = `${productHref(product)}?source=mobile`;
    renderModel(path);
    const quote = screen.getByRole('link', { name: `Request quote for ${product.sku}` });
    expect(quote).toHaveAttribute('href', `${path}#inquiry`);
    expect(quote).toHaveAttribute('aria-label', `Request quote for ${product.sku}`);
    expect(quote.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(quote.textContent.trim()).toBe('');
  });

  it.each(catalogProducts.filter((product) => !product.draft).map((product) => [product.sku, product]))('renders the correct image, model and inquiry for %s', (_sku, product) => {
    const { container } = renderModel(productHref(product));
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(product.name);
    expect(screen.getByRole('img', { name: `${product.sku} selected product view` })).toHaveAttribute('src', publicAsset(product.assets.hero));
    expect(screen.getByLabelText('Model of interest')).toHaveValue(product.sku);
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    const specs = container.querySelector('#technical-details');
    expect(specs).not.toBeNull();
    for (const group of product.specificationGroups) {
      for (const [, value] of group.rows) expect(specs.textContent).toContain(value);
    }
    if (product.reviewNotice) expect(screen.getByRole('note')).toHaveTextContent(product.reviewNotice);
  });

  it.each(['USW8811', 'EUW8811'])('switches %s to the exact selected finish photograph', async (sku) => {
    const user = userEvent.setup();
    const product = findCatalogProduct('smart-switches', sku);
    renderModel(productHref(product));
    const image = screen.getByRole('img', { name: `${sku} selected product view` });
    for (const finish of product.finishes) {
      await user.click(screen.getByRole('button', { name: `Show ${sku} in ${finish.name}` }));
      expect(image).toHaveAttribute('src', publicAsset(product.assets.finishes[finish.slug]));
    }
  });

  it('shows all seven original finishes on FTR15C-3100 and changes the actual product photograph', async () => {
    const user = userEvent.setup();
    const product = findCatalogProduct('usb-outlets', 'FTR15C-3100');
    renderModel(productHref(product));
    expect(screen.getByRole('group', { name: 'Available finishes' })).toBeInTheDocument();
    const image = screen.getByRole('img', { name: `${product.sku} selected product view` });
    for (const name of ['White', 'Ivory', 'Light Almond', 'Black', 'Grey', 'Brown', 'Graphite']) {
      const button = screen.getByRole('button', { name: `Show ${product.sku} in ${name}` });
      await user.click(button);
      const finish = product.finishes.find((f) => f.name === name);
      expect(image).toHaveAttribute('src', publicAsset(finish.image));
      expect(button).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByRole('img', { name: `${product.sku} enlarged product view`, hidden: true })).toHaveAttribute('src', publicAsset(finish.image));
    }
    await user.click(screen.getByRole('button', { name: `View ${product.sku} image 1` }));
    expect(image).toHaveAttribute('src', publicAsset(product.assets.gallery[0]));
    expect(screen.getByRole('button', { name: `Show ${product.sku} in Graphite` })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('group', { name: 'Selected product' })).toHaveTextContent('Finish: Graphite');
  });

  it('does not resolve a model from the wrong product family', () => {
    renderModel('/products/wallplates/gf20');
    expect(screen.getByText('Series fallback')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });
  it('renders the USB model with its own ratings, ports and inquiry model', () => {
    const { container } = renderModel('/products/usb-outlets/ftr15-3100');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/15A.*USB-A/i);
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(container.querySelector('.product-detail-hero__model')).toHaveTextContent('FTR15-3100');
    const specs = container.querySelector('#technical-details');
    expect(specs).toHaveTextContent(/3\.1\s?A/);
    expect(specs).toHaveClass('product-specifications--matrix');
    expect(screen.queryByRole('button', { name: 'Expand all specifications' })).not.toBeInTheDocument();
    expect(specs).toHaveTextContent(/5-15R/);
    expect(specs).not.toHaveTextContent(/Trip level|4–6 mA|UL 943/);
    expect(screen.getByRole('link', { name: 'Technical details' })).toHaveAttribute('href', '/products/usb-outlets/ftr15-3100#technical-details');
    expect(screen.getByRole('heading', { name: 'Request a quotation for FTR15-3100.' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View original model specifications/i }))
      .toHaveAttribute('href', 'https://www.fahint.com/?pro3/175.html');
    expect(container.querySelectorAll('img:not([width]), img:not([height])')).toHaveLength(0);
  });

  it.each(catalogProducts.filter((p) => p.line === 'usb-outlets').map((p) => [p.sku, p]))('uses the direct, always-visible USB specification layout for %s', (_sku, product) => {
    const { container } = renderModel(productHref(product));
    const specs = container.querySelector('#technical-details');
    expect(container.querySelector('.product-detail-hero').nextElementSibling).toBe(specs);
    expect(specs).toHaveClass('product-specifications--matrix');
    expect(specs.querySelectorAll('details, summary, button')).toHaveLength(0);
    expect(specs.querySelectorAll('.product-specification-panel')).toHaveLength(product.specificationGroups.length);
    expect(screen.queryByRole('navigation', { name: 'Product sections' })).not.toBeInTheDocument();
    const thumbs = screen.getAllByTestId('product-gallery-thumb');
    expect(thumbs).toHaveLength(product.assets.gallery.length);
    expect(thumbs.length).toBeLessThanOrEqual(6);
    const drawing = container.querySelector('#installation-reference');
    if (product.assets.drawings.length) {
      expect(drawing.querySelectorAll('svg[role="img"]')).toHaveLength(3);
      expect(drawing.querySelector('.catalog-drawings__grid')).toBeNull();
      expect(screen.getByRole('link', { name: `Open ${product.sku} original dimension drawing` }))
        .toHaveAttribute('href', publicAsset(product.assets.drawings[0].src));
    } else {
      expect(drawing).toBeNull();
    }
  });

  it.each(catalogProducts.filter((p) => p.line === 'receptacles').map((p) => [p.sku, p]))('uses the approved direct specification layout and preserves existing drawings for %s', (_sku, product) => {
    const { container } = renderModel(productHref(product));
    const specs = container.querySelector('#technical-details');
    expect(container.querySelector('.product-detail-hero').nextElementSibling).toBe(specs);
    expect(specs).toHaveClass('product-specifications--matrix');
    expect(specs.querySelectorAll('details, summary, button')).toHaveLength(0);
    expect(container.querySelectorAll('#technical-details')).toHaveLength(1);
    expect(screen.queryByRole('navigation', { name: 'Product sections' })).not.toBeInTheDocument();
    expect(screen.getAllByTestId('product-gallery-thumb')).toHaveLength(product.assets.gallery.length);
    for (const [index, drawing] of product.assets.drawings.entries()) {
      expect(screen.getByRole('img', { name: `${product.sku} original reference drawing ${index + 1}` }))
        .toHaveAttribute('src', publicAsset(drawing.src));
    }
  });

  it.each(['R15', 'R15Q', 'R20'])('supplies a model-specific unmeasured outline for %s', (sku) => {
    const { container } = renderModel(`/products/receptacles/${sku.toLowerCase()}`);
    const drawing = container.querySelector('#installation-reference');
    expect(drawing).not.toBeNull();
    expect(drawing.querySelectorAll('svg[role="img"]')).toHaveLength(2);
    expect(screen.getByRole('img', { name: `${sku} front view line drawing` })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: `${sku} rear view line drawing` })).toBeInTheDocument();
    expect(drawing).toHaveTextContent(/not to scale/i);
    expect(drawing).not.toHaveTextContent(/\d+(?:\.\d+)?\s*mm/);
    expect(drawing.querySelector('[data-receptacle-type]')).toHaveAttribute('data-receptacle-type', sku === 'R20' ? '5-20R' : '5-15R');
    expect(drawing.querySelector('[data-rear-wiring]')).toHaveAttribute('data-rear-wiring', sku === 'R15Q' ? 'push-in' : 'back-wire');
  });

  it('gives a supplied original drawing priority over a fallback outline', () => {
    const product = findCatalogProduct('receptacles', 'R15');
    const drawings = findCatalogProduct('receptacles', 'RT15').assets.drawings;
    const { container } = render(<CatalogDrawings product={{ ...product, assets: { ...product.assets, drawings } }} />);
    expect(screen.getByRole('img', { name: 'R15 original reference drawing 1' })).toHaveAttribute('src', publicAsset(drawings[0].src));
    expect(container.querySelectorAll('svg[role="img"]')).toHaveLength(0);
  });

  it('keeps the existing section navigation and accordion for other catalogue families', () => {
    renderModel(productHref(findCatalogProduct('wallplates', 'BS1801')));
    expect(screen.getByRole('navigation', { name: 'Product sections' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Expand all specifications' })).toBeInTheDocument();
  });

  it.each(['DS15', 'DS15.3', 'DS1502', 'DS1503', 'T15', 'T15.3'])('uses the compact lighting gallery and upfront specification matrix for %s', async (sku) => {
    const product = findCatalogProduct('lighting-switches', sku);
    const user = userEvent.setup();
    const { container } = renderModel(productHref(product));
    const specs = container.querySelector('#technical-details');
    expect(container.querySelector('.catalog-product-detail')).toHaveClass('catalog-product-detail--lighting');
    expect(container.querySelector('.product-detail-hero').nextElementSibling).toBe(specs);
    expect(specs).toHaveClass('product-specifications--matrix');
    expect(specs.querySelectorAll('details, summary, button')).toHaveLength(0);
    expect(container.querySelectorAll('#technical-details')).toHaveLength(1);
    expect(screen.queryByRole('navigation', { name: 'Product sections' })).not.toBeInTheDocument();
    const count = sku.startsWith('T') ? 4 : 5;
    expect(screen.getAllByTestId('product-gallery-thumb')).toHaveLength(count);
    const image = screen.getByRole('img', { name: `${sku} selected product view` });
    expect(image).toHaveAttribute('src', publicAsset(product.assets.gallery[0]));
    await user.click(screen.getByRole('button', { name: `Show ${sku} in Black` }));
    expect(image).toHaveAttribute('src', publicAsset(product.assets.finishes.black));
    expect(screen.getAllByTestId('product-gallery-thumb')).toHaveLength(count);
    for (let index = 0; index < count; index++) {
      const thumb = screen.getByRole('button', { name: `View ${sku} image ${index + 1}` });
      await user.click(thumb);
      expect(thumb).toHaveAttribute('aria-pressed', 'true');
      expect(image).toHaveAttribute('src', publicAsset(product.assets.gallery[index]));
    }
    expect(screen.getByRole('button', { name: `Show ${sku} in Black` })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('group', { name: 'Selected product' })).toHaveTextContent('Finish: Black');
    expect(screen.getByRole('img', { name: `${sku} product detail reference` }))
      .toHaveAttribute('src', publicAsset(product.assets.gallery[1]));
  });

  it.each(catalogProducts.filter((p) => p.line === 'smart-switches').map((p) => [p.sku, p]))('updates smart-switch specifications, structural details and references for %s', (_sku, product) => {
    const { container } = renderModel(productHref(product));
    const specs = container.querySelector('#technical-details');
    expect(container.querySelector('.product-detail-hero').nextElementSibling).toBe(specs);
    expect(specs).toHaveClass('product-specifications--matrix');
    expect(specs.querySelectorAll('details, summary, button')).toHaveLength(0);
    expect(container.querySelectorAll('#technical-details')).toHaveLength(1);
    expect(screen.queryByRole('navigation', { name: 'Product sections' })).not.toBeInTheDocument();
    expect(screen.getAllByTestId('product-gallery-thumb')).toHaveLength(product.sku.startsWith('US') ? 5 : 4);
    const details = container.querySelector('.smart-product-details');
    expect(details.querySelectorAll('figure')).toHaveLength(3);
    expect(details).toHaveTextContent('Glass face');
    expect(details).toHaveTextContent('Side profile');
    expect(details).toHaveTextContent('Rear housing');
    expect(details.querySelector('.catalog-features__list')).toBeNull();
    for (const image of product.assets.detailViews) {
      expect(screen.getByRole('img', { name: `${product.sku} ${image.kind} detail` })).toHaveAttribute('src', publicAsset(image.src));
    }
    const references = container.querySelector('#installation-reference');
    expect(references).toHaveTextContent('Dimensions');
    expect(references).toHaveTextContent('Installation & wiring');
    expect(references).toHaveTextContent('source reference');
    if (product.reviewNotice) expect(references).toHaveTextContent(product.reviewNotice);
    for (const drawing of product.assets.drawings) {
      expect(screen.getByRole('link', { name: `Open ${product.sku} ${drawing.kind} source reference` }))
        .toHaveAttribute('href', publicAsset(drawing.src));
    }
  });

  it.each(['DM2010', 'DM2010S'])('uses the approved direct dimmer specifications for %s', (sku) => {
    const product = findCatalogProduct('dimmers', sku);
    const { container } = renderModel(productHref(product));
    const specs = container.querySelector('#technical-details');
    expect(container.querySelector('.product-detail-hero').nextElementSibling).toBe(specs);
    expect(specs).toHaveClass('product-specifications--matrix');
    expect(specs.querySelectorAll('details, summary, button')).toHaveLength(0);
    expect(container.querySelectorAll('#technical-details')).toHaveLength(1);
    expect(screen.queryByRole('navigation', { name: 'Product sections' })).not.toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    for (const [index, drawing] of product.assets.drawings.entries()) {
      expect(screen.getByRole('img', { name: `${sku} original reference drawing ${index + 1}` }))
        .toHaveAttribute('src', publicAsset(drawing.src));
    }
  });

  it.each(['UST8811', 'EUW8811'])('switches between structural views and finishes without adding color thumbnails on %s', async (sku) => {
    const product = findCatalogProduct('smart-switches', sku);
    const user = userEvent.setup();
    renderModel(productHref(product));
    const count = sku.startsWith('US') ? 5 : 4;
    await user.click(screen.getByRole('button', { name: `View ${sku} image 3` }));
    expect(screen.getByRole('img', { name: `${sku} selected product view` })).toHaveAttribute('src', publicAsset(product.assets.gallery[2]));
    await user.click(screen.getByRole('button', { name: `Show ${sku} in White` }));
    expect(screen.getByRole('img', { name: `${sku} selected product view` })).toHaveAttribute('src', publicAsset(product.assets.finishes.white));
    expect(screen.getAllByTestId('product-gallery-thumb')).toHaveLength(count);
    await user.click(screen.getByRole('button', { name: `View ${sku} image 2` }));
    expect(screen.getByRole('img', { name: `${sku} selected product view` })).toHaveAttribute('src', publicAsset(product.assets.gallery[1]));
    expect(screen.getByRole('img', { name: `${sku} enlarged product view`, hidden: true })).toHaveAttribute('src', publicAsset(product.assets.gallery[1]));
  });

  it.each(['DM2010', 'DM2010S'])('shows the new dimmer plate and paired packages for %s', async (sku) => {
    const user = userEvent.setup();
    const product = findCatalogProduct('dimmers', sku);
    const { container } = renderModel(productHref(product));
    const screwless = `assets/images/catalog/dimmers/${product.slug}-screwless-plate-v1.png`;
    const packaged = `assets/images/catalog/dimmers/${product.slug}-screwless-package-v1.png`;
    expect(screen.getAllByTestId('product-gallery-thumb')).toHaveLength(6);
    await user.click(screen.getByRole('button', { name: `View ${sku} image 3` }));
    expect(screen.getByRole('img', { name: `${sku} selected product view` })).toHaveAttribute('src', publicAsset(screwless));
    expect(screen.getByRole('img', { name: `${sku} enlarged product view`, hidden: true })).toHaveAttribute('src', publicAsset(screwless));
    await user.click(screen.getByRole('button', { name: `View ${sku} image 5` }));
    expect(screen.getByRole('img', { name: `${sku} selected product view` })).toHaveAttribute('src', publicAsset(packaged));
    expect(screen.getByRole('img', { name: `${sku} enlarged product view`, hidden: true })).toHaveAttribute('src', publicAsset(packaged));
    await user.click(screen.getByRole('button', { name: `Show ${sku} in Black` }));
    expect(screen.getByRole('img', { name: `${sku} selected product view` })).toHaveAttribute('src', publicAsset(product.assets.finishes.black));
    const presentation = container.querySelector('.catalog-presentation__photos');
    expect(presentation.querySelectorAll('img')).toHaveLength(2);
    expect(screen.getByRole('img', { name: `${sku} Screwless plate · packaged` }))
      .toHaveAttribute('src', publicAsset(`assets/images/catalog/dimmers/${product.slug}-screwless-package-v1.png`));
    expect(screen.getByRole('img', { name: `${sku} Standard screw plate · packaged` }))
      .toHaveAttribute('src', publicAsset('assets/images/catalog/models/cb4dfb328d0db950.webp'));
    expect(presentation).not.toHaveTextContent('Presentation reference');
  });

  it.each([
    ['ftr15-3100', '44.7 mm'], ['f4p', '41.1 mm'], ['ftr20qc-ac65w', '47 mm']
  ])('uses the actual source dimensions for %s', (sku, depth) => {
    const { container } = renderModel(`/products/usb-outlets/${sku}`);
    const drawing = container.querySelector('#installation-reference');
    expect(drawing).toHaveTextContent(depth);
    expect(drawing).not.toHaveTextContent('39.7 mm');
  });

  it.each([
    ['ftr15-3100', ['A', 'A'], '5-15R'],
    ['ftr20c-3600', ['A', 'C'], '5-20R'],
    ['ftr20qc-dc65w', ['C', 'C'], '5-20R'],
    ['f4p', ['A', 'A', 'A', 'A'], null]
  ])('draws the correct port and receptacle configuration for %s', (sku, ports, nema) => {
    const { container } = renderModel(`/products/usb-outlets/${sku}`);
    const drawing = container.querySelector('#installation-reference svg');
    expect([...drawing.querySelectorAll('[data-port-type]')].map((port) => port.dataset.portType)).toEqual(ports);
    const receptacles = [...drawing.querySelectorAll('[data-receptacle]')];
    expect(receptacles).toHaveLength(nema ? 2 : 0);
    for (const receptacle of receptacles) expect(receptacle.dataset.receptacle).toBe(nema);
  });
});
