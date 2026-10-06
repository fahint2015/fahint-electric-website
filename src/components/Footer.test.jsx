import { fireEvent, render, screen } from '@testing-library/react';
import { Link, MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Footer from './Footer.jsx';
import { findProduct } from '../data/products.js';

function renderFooter(pathname) {
  return render(
    <MemoryRouter initialEntries={[pathname]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Footer />
    </MemoryRouter>
  );
}

describe('Footer product certification context', () => {
  it('marks only product-detail footers for mobile quote clearance', () => {
    const { container, unmount } = renderFooter('/products/gfci/gf15');

    expect(container.querySelector('footer')).toHaveClass('footer--product-detail');

    unmount();
    const unrelated = renderFooter('/about');
    expect(unrelated.container.querySelector('footer')).not.toHaveClass('footer--product-detail');
  });

  it('does not apply the GFCI file reference to the GL20 detail route', () => {
    renderFooter('/products/gfci/gl20');

    expect(screen.queryByText(/E504391/)).not.toBeInTheDocument();
    expect(screen.getByText(/model-specific certification review required/i)).toBeInTheDocument();
  });

  it.each([
    ['/products/usb-outlets/ftr15-3100', 'E498095'],
    ['/products/receptacles/r15', 'E498095'],
    ['/products/dimmers/dm2010', 'E550002'],
    ['/products/lighting-switches/ds1502', 'ETL'],
    ['/products/wallplates/bs1801', 'E501377']
  ])('uses the model reference and mobile clearance for %s', async (pathname, reference) => {
    const { container } = renderFooter(pathname);

    expect(container.querySelector('footer')).toHaveClass('footer--product-detail');
    expect(screen.queryByText(/E504391/)).not.toBeInTheDocument();
    expect(await screen.findByText(new RegExp(reference))).toBeInTheDocument();
  });

  it('does not give an unlisted smart switch the residential GFCI certification', async () => {
    renderFooter('/products/smart-switches/usw8811');

    expect(await screen.findByText(/model-specific documentation available on request/i)).toBeInTheDocument();
    expect(screen.queryByText(/E504391/)).not.toBeInTheDocument();
  });

  it('keeps the GTN addendum date and current-coverage qualification in the footer', async () => {
    const { container } = renderFooter('/products/gfci/gtn20');

    expect(container.querySelector('footer')).toHaveClass('footer--product-detail');
    expect(await screen.findByText(/E504391.*August 16, 2022.*confirm current coverage/i)).toBeInTheDocument();
    expect(screen.queryByText(/UL File E504391/)).not.toBeInTheDocument();
  });

  it('clears the previous certification immediately when changing model routes', async () => {
    render(
      <MemoryRouter initialEntries={['/products/dimmers/dm2010']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Link to="/products/smart-switches/usw8811">Show smart switch</Link>
        <Footer />
      </MemoryRouter>
    );
    expect(await screen.findByText(/E550002/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('link', { name: 'Show smart switch' }));

    expect(screen.queryByText(/E550002|E504391/)).not.toBeInTheDocument();
    expect(await screen.findByText(/model-specific documentation available on request/i)).toBeInTheDocument();
  });

  it('uses the verified detail product file instead of the company-level file', () => {
    const product = findProduct('GF15');
    const originalListing = product.listing;
    product.listing = { ...originalListing, file: 'MODEL-SCOPED-FILE' };

    try {
      renderFooter('/products/gfci/gf15');
      expect(screen.getByText(/MODEL-SCOPED-FILE/)).toBeInTheDocument();
    } finally {
      product.listing = originalListing;
    }
  });
});
