import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import ProductDetail from './ProductDetail.jsx';
import {publicAsset} from '../utils/publicAsset.js';
import { products, findProduct } from '../data/products.js';
import { productSpecificationGroups } from '../components/products/ProductTechnicalSections.jsx';

function show(sku, path = `/products/gfci/${sku.toLowerCase()}`) {
  return render(<MemoryRouter initialEntries={[path]} future={{v7_startTransition:true,v7_relativeSplatPath:true}}><Routes>
    <Route path="/products/gfci/:sku" element={<ProductDetail />} />
    <Route path="/products/gfci" element={<div>GFCI series fallback</div>} />
  </Routes></MemoryRouter>);
}

describe('concise GFCI product pages', () => {
  it.each(products.map(p => [p.sku,p]))('keeps exact model data and a contact inquiry on %s', (sku, product) => {
    const {container}=show(sku);
    expect(screen.getByRole('heading',{level:1})).toHaveTextContent(product.name);
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    const table=screen.getByRole('table',{name:`${sku} technical parameters`});
    for (const group of productSpecificationGroups(product)) for (const [label,value] of group.rows) {
      if (!['Factory inspection','Patent protection'].includes(label)) expect(table.textContent).toContain(value);
    }
    expect(screen.getByRole('link',{name:'Request a quote'})).toHaveAttribute('href',`/contact?model=${sku}`);
    expect(container.querySelector('form')).toBeNull();
    expect(container.querySelector('.product-manufacturing,.product-story,.product-certification,.product-inquiry')).toBeNull();
    const parameters=container.querySelector('#technical-details');
    expect(parameters.previousElementSibling).toHaveClass('concise-product-content');
    expect(parameters.nextElementSibling).toHaveClass('concise-product-related');
  });
  it('uses the archived self-test interval instead of competitor copy',()=>{
    show('GF15');
    expect(screen.getByRole('tabpanel',{name:'Features'})).toHaveTextContent('Self-test every 15 minutes');
    expect(screen.getByRole('tabpanel',{name:'Features'})).not.toHaveTextContent('every 5 seconds');
  });
  it('carries the chosen finish into quote and technical contact links',async()=>{
    const user=userEvent.setup(); show('GF15');
    await user.click(screen.getByRole('button',{name:'Show GF15 in Black'}));
    expect(screen.getByRole('img',{name:'GF15 selected product view'})).toHaveAttribute('src',publicAsset('assets/images/products/gf15-black.webp'));
    expect(screen.getByRole('link',{name:'Request a quote'})).toHaveAttribute('href','/contact?model=GF15&finish=black');
    await user.click(screen.getByRole('tab',{name:'Download'}));
    expect(screen.getByRole('link',{name:'Request model-specific documents'}).getAttribute('href')).toContain('model=GF15&finish=black');
  });
  it('switches Features/Download with keyboard focus and retains the parameter table',async()=>{
    const user=userEvent.setup();show('GF15');
    const features=screen.getByRole('tab',{name:'Features'});
    features.focus(); await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab',{name:'Download'})).toHaveFocus();
    expect(screen.getByRole('tab',{name:'Download'})).toHaveAttribute('aria-selected','true');
    expect(screen.queryByRole('tabpanel',{name:'Features'})).not.toBeInTheDocument();
    expect(screen.getByRole('link',{name:/Model certificate/})).toHaveAttribute('href',expect.stringContaining('/assets/documents/certificates/ul-gfci.pdf'));
    expect(screen.getByRole('table',{name:'GF15 technical parameters'})).toBeVisible();
    await user.keyboard('{Home}'); expect(features).toHaveFocus();
    expect(screen.getByRole('tabpanel',{name:'Features'})).toBeVisible();
  });
  it('keeps GL20 certification review distinct from verified models',async()=>{
    const user=userEvent.setup(); const {container}=show('GL20');
    expect(container.querySelector('.product-detail-hero__certification')).not.toHaveClass('is-verified');
    await user.click(screen.getByRole('tab',{name:'Download'}));
    expect(screen.queryByRole('link',{name:'Model certificate'})).not.toBeInTheDocument();
    expect(screen.getByRole('table',{name:'GL20 technical parameters'})).toHaveTextContent('Documentation review required');
  });
  it('keeps current route and query when jumping to parameters',()=>{
    show('GF15','/products/gfci/gf15?source=sample');
    expect(screen.getByRole('link',{name:'Technical Parameters'})).toHaveAttribute('href','/products/gfci/gf15?source=sample#technical-details');
  });
  it('preserves browser metadata and image dimensions',()=>{
    const {container}=show('GT20');
    expect(document.title).toBe('GT20 20A Tamper-Resistant GFCI | FAHINT');
    for (const image of container.querySelectorAll('img')) {expect(image).toHaveAttribute('width');expect(image).toHaveAttribute('height');}
  });
  it('redirects unknown GFCI models to the family',()=>{
    show('unknown');expect(screen.getByText('GFCI series fallback')).toBeInTheDocument();
  });
});
