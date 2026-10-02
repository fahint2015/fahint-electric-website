import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import GfciSeries from '../../pages/GfciSeries.jsx';
import LineDetail from '../../pages/LineDetail.jsx';
import ProductDetail from '../../pages/ProductDetail.jsx';
import Capabilities from '../../pages/Capabilities.jsx';
import { buyingGuides } from '../../data/buyingGuides.js';

function openPage(path) {
  return render(<MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Routes>
    <Route path="/products/gfci" element={<GfciSeries />} />
    <Route path="/products/:line" element={<LineDetail />} />
    <Route path="/products/:line/:sku" element={<ProductDetail />} />
    <Route path="/capabilities" element={<Capabilities />} />
  </Routes></MemoryRouter>);
}

describe('Purchasing information', () => {
  it.each([
    ['gfci', 'TR / WR'], ['usb-outlets', 'power sharing'], ['receptacles', 'voltage'],
    ['dimmers', 'load'], ['smart-switches', 'neutral'], ['lighting-switches', 'single-pole'], ['wallplates', 'opening'],
  ])('adds a relevant selection guide for %s', (line, topic) => {
    openPage(`/products/${line}`);
    const guide = screen.getByRole('region', { name: /Buying guide:/ });
    expect(guide.textContent.toLowerCase()).toContain(topic.toLowerCase());
    expect(within(guide).getAllByRole('button')).toHaveLength(3);
    expect(within(guide).getByRole('link', { name: /Discuss your selection/ })).toHaveAttribute('href', '/contact?topic=technical');
  });

  it('supports keyboard expansion of the buying questions', async () => {
    openPage('/products/usb-outlets');
    const guide = screen.getByRole('region', { name: /Buying guide:/ });
    const question = within(guide).getByRole('button', { name: /power sharing/i });
    question.focus();
    await userEvent.keyboard('{Enter}');
    expect(question).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById(question.getAttribute('aria-controls'))).toBeVisible();
  });

  it('does not assume every USB model has two ports or an AC receptacle', () => {
    openPage('/products/usb-outlets/f4p');
    const checklist = screen.getByRole('region', { name: 'Before you order F4P' });
    expect(checklist).toHaveTextContent(/input rating/i);
    expect(checklist).toHaveTextContent(/where applicable.*receptacle rating/i);
    expect(buyingGuides['usb-outlets'].questions[1].a).toContain('multiple ports');
  });

  it.each([
    ['gfci/gf15', 'GF15'], ['usb-outlets/ftr15-3100', 'FTR15-3100'], ['gfci/gl20', 'GL20'], ['gfci/gtn15', 'GTN15'],
  ])('includes the exact model in the order checklist for %s', (route, sku) => {
    openPage(`/products/${route}`);
    const checklist = screen.getByRole('region', { name: `Before you order ${sku}` });
    expect(checklist).toHaveTextContent(sku);
    expect(checklist).toHaveTextContent(/packaging/i);
    expect(checklist).toHaveTextContent(/confirmed in your quotation/i);
    if (sku === 'GL20') expect(checklist).toHaveTextContent(/under review/i);
    if (sku === 'GTN15') expect(checklist).toHaveTextContent(/residential.*not.*coverage/i);
  });

  it('makes the OEM quotation inputs explicit without universal promises', () => {
    openPage('/capabilities');
    const brief = screen.getByRole('list', { name: 'OEM quotation checklist' });
    expect(brief).toHaveTextContent(/model.*quantit/i);
    expect(brief).toHaveTextContent(/destination/i);
    expect(brief).toHaveTextContent(/artwork/i);
    expect(brief).not.toHaveTextContent(/free sample|400 cartons|guaranteed|10.day/i);
  });
});
