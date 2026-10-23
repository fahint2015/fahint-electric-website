import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { useState } from 'react';
import { findProduct, productFinishImage } from '../../data/products.js';
import ProductGallery from './ProductGallery.jsx';

describe('ProductGallery', () => {
  let originalShowModal;
  let originalClose;

  beforeEach(() => {
    originalShowModal = HTMLDialogElement.prototype.showModal;
    originalClose = HTMLDialogElement.prototype.close;
    HTMLDialogElement.prototype.showModal = vi.fn(function showModal() {
      this.setAttribute('open', '');
    });
    HTMLDialogElement.prototype.close = vi.fn(function close() {
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    HTMLDialogElement.prototype.showModal = originalShowModal;
    HTMLDialogElement.prototype.close = originalClose;
  });

  it('renders the finish image selected by the product detail panel', () => {
    const product = findProduct('GF15');
    render(
      <ProductGallery
        product={product}
        selectedImage={productFinishImage(product.sku, 'black')}
        selectedFinish="black"
        onSelectImage={vi.fn()}
      />
    );

    expect(screen.getByRole('img', { name: 'GF15 selected product view' })).toHaveAttribute(
      'src',
      `${import.meta.env.BASE_URL}assets/images/products/gf15-black.webp`
    );
    expect(screen.getByRole('img', { name: 'GF15 selected product view' })).toHaveAttribute(
      'width',
      '620'
    );
    expect(screen.getByRole('img', { name: 'GF15 selected product view' })).toHaveAttribute(
      'height',
      '620'
    );
  });

  it('renders five thumbnails without finish controls in the gallery', () => {
    const product = findProduct('GF15');
    const { container } = render(
      <ProductGallery
        product={product}
        selectedImage={product.assets.hero}
        selectedFinish={null}
        onSelectImage={vi.fn()}
      />
    );

    const main = screen.getByTestId('product-gallery-main');
    const mainImage = within(main).getByRole('img', { name: 'GF15 selected product view' });
    expect(main).toHaveClass('product-media-square');
    expect(mainImage).toHaveAttribute('width', '800');
    expect(mainImage).toHaveAttribute('height', '800');
    expect(mainImage).toHaveAttribute('loading', 'eager');

    const thumbnails = screen.getAllByRole('button', { name: /^View GF15 image [1-5]$/ });
    expect(thumbnails).toHaveLength(5);
    expect(thumbnails.map((thumbnail) => thumbnail.querySelector('img')?.getAttribute('src'))).toEqual([
      `${import.meta.env.BASE_URL}assets/images/products/gf15-main.webp`,
      `${import.meta.env.BASE_URL}assets/images/products/gf15-sides.webp`,
      `${import.meta.env.BASE_URL}assets/images/products/gf15-back.webp`,
      `${import.meta.env.BASE_URL}assets/images/products/gf15-standard-plate.png`,
      `${import.meta.env.BASE_URL}assets/images/products/gf15-plate.webp`
    ]);
    thumbnails.forEach((thumbnail) => {
      const image = thumbnail.querySelector('img');
      expect(thumbnail).toHaveAttribute('data-testid', 'product-gallery-thumb');
      expect(thumbnail).toHaveClass('product-media-square');
      expect(image).toHaveAttribute('alt', '');
      expect(image).toHaveAttribute('width', '800');
      expect(image).toHaveAttribute('height', '800');
      expect(image).toHaveAttribute('loading', 'lazy');
    });
    expect(container.querySelector('button button')).toBeNull();

    expect(screen.queryByRole('button', { name: 'Show GF15 in Black' })).toBeNull();
  });

  it('reports thumbnail selection to the product detail panel', async () => {
    const user = userEvent.setup();
    const product = findProduct('GF15');
    const onSelectImage = vi.fn();
    render(
      <ProductGallery
        product={product}
        selectedImage={product.assets.hero}
        selectedFinish={null}
        onSelectImage={onSelectImage}
      />
    );

    await user.click(screen.getByRole('button', { name: 'View GF15 image 2' }));

    expect(onSelectImage).toHaveBeenCalledWith(product.assets.gallery[1]);
  });

  it('keeps arrows, keyboard, thumbnails and horizontal gestures in sync without opening zoom after a swipe', async () => {
    const product = findProduct('GF15');
    function Gallery() {
      const [image, select] = useState(product.assets.hero);
      return <ProductGallery product={product} selectedImage={image} selectedFinish={null} onSelectImage={select} />;
    }
    render(<Gallery />);
    const user = userEvent.setup();
    const main = screen.getByTestId('product-gallery-main');
    const previous = screen.getByRole('button', { name: 'Previous GF15 image' });
    const next = screen.getByRole('button', { name: 'Next GF15 image' });
    expect(previous).toBeDisabled();
    await user.click(next);
    expect(screen.getByRole('button', { name: 'View GF15 image 2' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.keyDown(main, { key: 'End' });
    expect(next).toBeDisabled();
    expect(screen.getByRole('button', { name: 'View GF15 image 5' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.keyDown(main, { key: 'Home' });
    function pointer(type, x, y) {
      fireEvent(main, Object.assign(new Event(type, { bubbles: true }), { isPrimary: true, button: 0, pointerId: 1, clientX: x, clientY: y }));
    }
    pointer('pointerdown', 200, 100);
    pointer('pointerup', 70, 110);
    fireEvent.click(main, { detail: 1 });
    expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open');
    expect(screen.getByRole('button', { name: 'View GF15 image 2' })).toHaveAttribute('aria-pressed', 'true');
    pointer('pointerdown', 100, 100);
    pointer('pointerup', 120, 250);
    expect(screen.getByRole('button', { name: 'View GF15 image 2' })).toHaveAttribute('aria-pressed', 'true');
    await user.click(previous);
    expect(previous).toBeDisabled();
  });

  it.each([false, true])('animates a loaded replacement image only when reduced motion is %s', async reducedMotion => {
    vi.stubGlobal('matchMedia', () => ({ matches: reducedMotion }));
    const product = findProduct('GF15');
    const { rerender } = render(<ProductGallery product={product} selectedImage={product.assets.hero} selectedFinish={null} onSelectImage={vi.fn()} />);
    const image = screen.getByRole('img', { name: 'GF15 selected product view' });
    image.animate = vi.fn();
    fireEvent.load(image);
    expect(image.animate).not.toHaveBeenCalled();
    rerender(<ProductGallery product={product} selectedImage={product.assets.gallery[1]} selectedFinish={null} onSelectImage={vi.fn()} />);
    fireEvent.load(image);
    expect(image.animate).toHaveBeenCalledTimes(reducedMotion ? 0 : 1);
  });

  it('uses one compact horizontally scrollable mobile strip for every product family', () => {
    const css = readFileSync('src/styles/site-system.css', 'utf8');
    const mobile = css.slice(css.indexOf('@media (max-width: 760px)'));
    const strip = mobile.match(/\.product-detail-hero \.product-gallery__thumbs\s*\{([^}]*)\}/)?.[1] || '';
    expect(strip).toMatch(/display:\s*flex/);
    expect(strip).toMatch(/flex-wrap:\s*nowrap/);
    expect(strip).toMatch(/overflow-x:\s*auto/);
    expect(strip).toMatch(/gap:\s*8px/);
    expect(mobile).toMatch(/\.product-detail-hero \.product-gallery__thumb\s*\{[^}]*flex:\s*0 0 max\(52px, calc\(\(100% - 32px\) \/ 5\)\)/);
    const catalogue = readFileSync('src/styles/catalog.css', 'utf8');
    expect(catalogue.slice(catalogue.indexOf('@media (max-width: 420px)'))).not.toMatch(/product-gallery__thumbs/);
  });

  it('opens an accessible native dialog and closes it by button, backdrop, or native cancel', async () => {
    const user = userEvent.setup();
    const product = findProduct('GF15');
    render(
      <ProductGallery
        product={product}
        selectedImage={product.assets.hero}
        selectedFinish={null}
        onSelectImage={vi.fn()}
      />
    );

    const trigger = screen.getByRole('button', { name: /GF15 selected product view Enlarge/ });
    const dialog = screen.getByRole('dialog', { hidden: true });

    await user.click(trigger);
    expect(dialog).toHaveAttribute('open');
    const enlargedImage = screen.getByRole('img', { name: 'GF15 enlarged product view' });
    expect(enlargedImage).toHaveAttribute('width', '800');
    expect(enlargedImage).toHaveAttribute('height', '800');

    const styles = readFileSync('src/styles/product-experience.css', 'utf8');
    const dialogImageRules = styles.match(/\.product-gallery__dialog-inner\s*>\s*img\s*\{[^}]+\}/)?.[0] || '';
    expect(dialogImageRules).toMatch(/width:\s*auto/);
    expect(dialogImageRules).toMatch(/height:\s*auto/);
    expect(dialogImageRules).toMatch(/max-width:\s*100%/);
    expect(dialogImageRules).toMatch(/max-height:\s*calc\(90vh\s*-\s*96px\)/);
    expect(dialogImageRules).toMatch(/object-fit:\s*contain/);

    await user.click(screen.getByRole('button', { name: 'Close enlarged product image' }));
    expect(dialog).not.toHaveAttribute('open');
    expect(trigger).toHaveFocus();

    await user.click(trigger);
    fireEvent.click(dialog);
    expect(dialog).not.toHaveAttribute('open');

    await user.click(trigger);
    fireEvent(dialog, new Event('cancel', { cancelable: true }));
    expect(dialog).not.toHaveAttribute('open');
    expect(trigger).toHaveFocus();
  });
});
