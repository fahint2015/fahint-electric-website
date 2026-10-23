import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import ProductDetail from './ProductDetail.jsx';
import { catalogProducts, findCatalogProduct, productHref } from '../data/catalogProducts.js';
import { publicAsset } from '../utils/publicAsset.js';
import { existsSync } from 'node:fs';

function show(product) {
  return render(<MemoryRouter initialEntries={[typeof product==='string'?product:productHref(product)]} future={{v7_startTransition:true,v7_relativeSplatPath:true}}><Routes>
    <Route path="/products/:line/:sku" element={<ProductDetail />} />
    <Route path="/products/:line" element={<div>Series fallback</div>} />
  </Routes></MemoryRouter>);
}
describe('concise catalog product pages',()=>{
  it.each(catalogProducts.filter(p=>!p.draft).map(p=>[p.line,p.sku,p]))('keeps all approved %s/%s specifications and the right inquiry',(_line,_sku,product)=>{
    const {container}=show(product);
    expect(screen.getByRole('heading',{level:1}).textContent).toBe(product.name);
    expect(screen.getByRole('img',{name:`${product.sku} selected product view`})).toHaveAttribute('src',publicAsset(product.assets.hero));
    const table=screen.getByRole('table',{name:`${product.sku} technical parameters`});
    for(const group of product.specificationGroups) for(const [,value] of group.rows) expect(table.textContent).toContain(value);
    expect(screen.getByRole('link',{name:'Request a quote'})).toHaveAttribute('href',`/contact?model=${encodeURIComponent(product.sku)}`);
    expect(container.querySelector('form')).toBeNull();
    if(product.reviewNotice) expect(screen.getByRole('note')).toHaveTextContent(product.reviewNotice);
    expect(screen.getByRole('tabpanel',{name:'Features'}).querySelectorAll('li').length).toBeGreaterThan(0);
  });
  it.each([['smart-switches','USW8811'],['usb-outlets','FTR15C-3100'],['lighting-switches','DS15']])('retains exact finish photos and contact context for %s/%s',async(line,sku)=>{
    const user=userEvent.setup();const product=findCatalogProduct(line,sku);show(product);
    const image=screen.getByRole('img',{name:`${sku} selected product view`});
    for(const finish of product.finishes){
      await user.click(screen.getByRole('button',{name:`Show ${sku} in ${finish.name}`}));
      expect(image).toHaveAttribute('src',publicAsset(product.assets.finishes[finish.slug]));
      expect(screen.getByRole('link',{name:'Request a quote'})).toHaveAttribute('href',`/contact?model=${encodeURIComponent(sku)}&finish=${finish.slug}`);
    }
  });
  it('keeps industrial limitations and withholds conflicting drawings in Download',async()=>{
    const user=userEvent.setup();show(findCatalogProduct('gfci','GTN15'));
    await user.click(screen.getByRole('tab',{name:'Download'}));
    await user.click(screen.getByText('Specification notes'));
    expect(screen.getByRole('tabpanel',{name:'Download'})).toHaveTextContent('no feed-through terminals');
    expect(screen.queryByRole('link',{name:/Dimensions & wiring reference/})).not.toBeInTheDocument();
  });
  it('retains USB shared-output notes without duplicating product-page sections',async()=>{
    const user=userEvent.setup();const {container}=show(findCatalogProduct('usb-outlets','FTR15C-3100'));
    await user.click(screen.getByRole('tab',{name:'Download'}));await user.click(screen.getByText('Specification notes'));
    expect(screen.getByRole('tabpanel',{name:'Download'})).toHaveTextContent('shared across the charging ports');
    expect(container.querySelector('.catalog-presentation,.catalog-applications,.catalog-drawings')).toBeNull();
  });
  it('keeps four-port charger ratings distinct from AC receptacles',()=>{
    show(findCatalogProduct('usb-outlets','F4P'));
    const table=screen.getByRole('table',{name:'F4P technical parameters'});
    expect(table).toHaveTextContent('5V');expect(table).toHaveTextContent('4.2A');expect(table).toHaveTextContent('21W');
  });
  it.each([
    ['usb-outlets','FTR15QC-DC20W','PD USB outlets · catalog sheet (PDF)','pd-usb-outlets.pdf'],
    ['dimmers','DM2010','DM2010 / DM2010S · catalog sheet (PDF)','dm2010-dm2010s.pdf']
  ])('offers the original catalog sheet for %s/%s without treating it as certification',async(line,sku,label,file)=>{
    const user=userEvent.setup();show(findCatalogProduct(line,sku));
    await user.click(screen.getByRole('tab',{name:'Download'}));
    const href=`assets/documents/catalog-sheets/${file}`;
    expect(screen.getByRole('link',{name:label})).toHaveAttribute('href',publicAsset(href));
    expect(existsSync(`public/${href}`)).toBe(true);
    expect(screen.queryByRole('link',{name:'Model certificate'})).not.toBeInTheDocument();
    expect(screen.getByRole('tabpanel',{name:'Download'})).toHaveTextContent(`No matching certificate PDF for ${sku}`);
    if(sku==='FTR15QC-DC20W'){
      expect(screen.getByRole('table')).toHaveTextContent('Charging protocols (catalogue)PD 2.0 / 3.0 / PPS');
      await user.click(screen.getByText('Specification notes'));
      expect(screen.getByRole('tabpanel',{name:'Download'})).toHaveTextContent('does not give a port-by-port protocol matrix');
      expect(screen.getByRole('tabpanel',{name:'Download'})).toHaveTextContent('confirm dual-port power sharing');
    }
  });
  it('does not resolve a product in the wrong family',()=>{
    show('/products/wallplates/gf20');expect(screen.getByText('Series fallback')).toBeInTheDocument();
  });
});
