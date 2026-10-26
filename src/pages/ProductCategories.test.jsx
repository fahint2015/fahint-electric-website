import { render, screen, within, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import ProductsStudio from './ProductsStudio.jsx';
import { productCategories, productCategory } from '../data/productCategories.js';

function show() { return render(<MemoryRouter initialEntries={['/products']} future={{v7_startTransition:true,v7_relativeSplatPath:true}}><ProductsStudio /></MemoryRouter>); }
describe('two-level product categories', () => {
  it('collapses and reopens a selected family without clearing its child filter', () => {
    show();
    const family = screen.getByRole('button', {name:'Filter GFCI Outlets'});
    fireEvent.click(family);
    fireEvent.click(screen.getByRole('button', {name:'Industrial GFCI'}));
    fireEvent.click(family);
    expect(family).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('button', {name:'Industrial GFCI'})).not.toBeInTheDocument();
    expect(screen.getByRole('link', {name:'View GTN15'})).toBeInTheDocument();
    fireEvent.click(family);
    expect(family).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', {name:'Industrial GFCI'})).toHaveAttribute('aria-pressed', 'true');
  });
  it('returns All products to unfiltered product ranges after selecting a child and searching', () => {
    show();
    fireEvent.click(screen.getByRole('button', {name:'Filter USB Outlets'}));
    fireEvent.click(screen.getByRole('button', {name:'3.1A USB'}));
    fireEvent.change(screen.getByRole('searchbox', {name:'Search model or feature'}), {target:{value:'FTR15'}});
    fireEvent.click(screen.getByRole('button', {name:'All products',exact:true}));
    expect(screen.getByRole('region', {name:'Product ranges'})).toBeVisible();
    expect(screen.getByRole('searchbox', {name:'Search model or feature'})).toHaveValue('');
    expect(screen.getByRole('button', {name:'Filter USB Outlets'})).toHaveAttribute('aria-expanded','false');
    fireEvent.click(screen.getByRole('button', {name:'Filter USB Outlets'}));
    expect(screen.getByRole('button', {name:'All USB',exact:true})).toHaveAttribute('aria-pressed','true');
  });
  it('makes All models reset a selected family while showing the full model catalog', () => {
    show();fireEvent.click(screen.getByRole('button', {name:'Filter GFCI Outlets'}));
    fireEvent.click(screen.getByRole('button', {name:'Industrial GFCI'}));
    fireEvent.click(screen.getByRole('button', {name:'Browse all models'}));
    expect(screen.getByRole('status')).toHaveTextContent('156 models');
    expect(screen.getByRole('button', {name:'All products',exact:true})).toHaveAttribute('aria-pressed','true');
    expect(screen.getByRole('link', {name:'View GF15'})).toBeInTheDocument();
  });
  it('keeps all nine GFCI models across the real subcategories', () => {
    const gfci = productCategories.find(range => range.slug === 'gfci');
    expect(gfci.models.map(product => product.sku)).toEqual(expect.arrayContaining(['GF15','GF20','GT15','GT20','GW15','GW20','GL20','GTN15','GTN20']));
    expect(gfci.models.filter(product => productCategory(product) === 'Industrial GFCI').map(product => product.sku)).toEqual(['GTN15','GTN20']);
    expect(gfci.children).toEqual(['Standard','Tamper-resistant','Tamper & weather-resistant','Blank face','Industrial GFCI']);
    for (const range of productCategories) expect(range.children.length).toBeGreaterThan(1);
  });
  it('removes grouping counts and uses one white-background product for each range', () => {
    show();
    const filters = screen.getByRole('complementary', {name:'Product family filters'});
    expect(filters).not.toHaveTextContent(/\b156\b/);
    for (const button of filters.querySelectorAll('button')) expect(button.textContent).not.toMatch(/\d+\s*$/);
    for (const card of screen.getByRole('region',{name:'Product ranges'}).querySelectorAll('article[aria-label]')) {
      expect(card.querySelectorAll('img')).toHaveLength(1);
      expect(card.querySelector('img').getAttribute('src')).toContain('/catalog-products/');
      expect(card.textContent).not.toMatch(/\d+ models/);
    }
  });
  it('filters industrial GFCI children and clears the child on a new family', () => {
    show(); fireEvent.click(screen.getByRole('button',{name:'Filter GFCI Outlets'}));
    expect(screen.getByRole('button',{name:'Filter GFCI Outlets'})).toHaveAttribute('aria-expanded','true');
    fireEvent.click(screen.getByRole('button',{name:'Industrial GFCI'}));
    expect(screen.getByRole('link',{name:'View GTN15'})).toHaveAttribute('href','/products/gfci/gtn15/');
    expect(screen.getByRole('link',{name:'View GTN20'})).toBeInTheDocument();
    expect(screen.queryByRole('link',{name:'View GF15'})).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:'Filter Dimmers'}));
    expect(screen.getByRole('link',{name:'View DM2010'})).toBeInTheDocument();
    expect(screen.getByRole('link',{name:'View DM2010S'})).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:'0–10V dimming'}));
    expect(screen.queryByRole('link',{name:'View DM2010'})).not.toBeInTheDocument();
    expect(screen.getByRole('link',{name:'View DM2010S'})).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:'Product ranges'}));
    expect(screen.getByRole('region',{name:'Product ranges'})).toBeVisible();
  });
  it('keeps USB category search and legacy model aliases', () => {
    show();fireEvent.click(screen.getByRole('button',{name:'Filter USB Outlets'}));
    fireEvent.click(screen.getByRole('button',{name:'3.1A USB'}));
    fireEvent.change(screen.getByRole('searchbox',{name:'Search model or feature'}),{target:{value:'FTR15C-3100'}});
    expect(screen.getByRole('link',{name:'View FTR15C-3100'})).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:'Reset filters'}));
    fireEvent.change(screen.getByRole('searchbox',{name:'Search model or feature'}),{target:{value:'R15-C'}});
    expect(screen.getByRole('link',{name:'View C15'})).toHaveAttribute('href','/products/receptacles/r15-c/');
  });
});
