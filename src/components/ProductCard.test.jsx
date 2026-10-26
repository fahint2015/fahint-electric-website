import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import ProductCard from './ProductCard.jsx';

const product = {
  sku: 'GF15',
  name: '15A Self-Test GFCI Receptacle',
  category: 'standard',
  feature: 'Standard',
  rating: '15A, 125V',
  nema: '5-15R'
};

describe('ProductCard', () => {
  it('uses one accessible full-card link with no nested controls', () => {
    const { container } = render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ProductCard product={product} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', {
      name: 'GF15 15A Self-Test GFCI Receptacle'
    });
    expect(link).toHaveAttribute('href', '/products/gfci/gf15/');
    expect(link).toHaveClass('pcard');
    expect(container.querySelectorAll('a')).toHaveLength(1);
    expect(link.querySelectorAll('button, input, select, textarea')).toHaveLength(0);
    expect(within(link).getByText('View details')).toBeVisible();
    const image = within(link).getByRole('img', { name: /GF15/ });
    expect(image).toHaveAttribute(
      'src',
      expect.stringContaining('assets/images/products/gf15-main.webp')
    );
    expect(image).toHaveAttribute('width', '800');
    expect(image).toHaveAttribute('height', '800');
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it.each([
    ['standard', 'STANDARD'],
    ['tr', 'TR'],
    ['wr', 'TR + WR'],
    ['blank', 'BLANK FACE']
  ])('maps the %s category to the published %s badge', (category, label) => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ProductCard product={{ ...product, category, feature: 'Do not use feature copy' }} />
      </MemoryRouter>
    );

    expect(screen.getByText(label)).toHaveClass('pcard__tag');
  });
});
