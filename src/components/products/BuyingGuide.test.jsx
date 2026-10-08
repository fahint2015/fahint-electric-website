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
    ['gfci/gf15', 'GF15'], ['usb-outlets/ftr15-3100', 'FTR15-3100'], ['gfci/gl20', 'GL20'], ['gfci/gtn15', 'GTN15'], ['gfci/gtn20', 'GTN20'],
  ])('includes the exact model in the order checklist for %s', (route, sku) => {
    openPage(`/products/${route}`);
    const checklist = screen.getByRole('region', { name: `Before you order ${sku}` });
    expect(checklist).toHaveTextContent(sku);
    expect(checklist).toHaveTextContent(/packaging/i);
    expect(checklist).toHaveTextContent(/confirmed in your quotation/i);
    if (sku === 'GL20') expect(checklist).toHaveTextContent(/under review/i);
    if (/^GTN/.test(sku)) {
      expect(checklist).toHaveTextContent(/August 16, 2022.*E504391/);
      expect(checklist).toHaveTextContent(/current coverage.*ordered configuration/i);
      expect(checklist).not.toHaveTextContent(/does not establish coverage/);
    }
  });

  it('describes the supplied GFCI addendum without excluding its GTN models', () => {
    const answer = buyingGuides.gfci.questions.find(question => /certificate/.test(question.q)).a;
    expect(answer).toMatch(/August 16, 2022.*E504391-20210212/);
    expect(answer).toMatch(/GTN15.*GTN20.*no feed-through/i);
    expect(answer).toMatch(/GL20.*under review/);
    expect(answer).toMatch(/current.*coverage/i);
    expect(answer).not.toMatch(/does not establish/);
  });

  it('connects the buying checklist to a dated original PDF and its existing buying guide', () => {
    openPage('/products/usb-outlets/ftr15c-3100');
    const checklist = screen.getByRole('region', { name: 'Before you order FTR15C-3100' });
    expect(checklist).toHaveTextContent(/April 26, 2022.*E498095-20180426/);
    expect(within(checklist).getByRole('link', { name: 'View original certificate PDF' })).toHaveAttribute('href', '/assets/documents/certificates/ul-usb.pdf');
    expect(within(checklist).getByRole('link', { name: 'Read the USB outlet buying guide' })).toHaveAttribute('href', '/blog/usb-wall-outlet-buying-guide');
  });

  it('explains missing exact-model documents without calling the product uncertified', () => {
    openPage('/products/usb-outlets/ftr15qc-ac65w');
    const checklist = screen.getByRole('region', { name: 'Before you order FTR15QC-AC65W' });
    expect(checklist).toHaveTextContent(/No matching certificate PDF for FTR15QC-AC65W.*library/);
    expect(checklist).not.toHaveTextContent(/uncertified|not certified/i);
    expect(within(checklist).queryByRole('link', { name: 'View original certificate PDF' })).not.toBeInTheDocument();
  });

  it.each([
    ['bs1801-m', 'BS1801-M', 'E501377-20181016', 'August 16, 2022'],
    ['bs1803-g', 'BS1803-G', 'E501377-20181016', 'August 16, 2022'],
    ['bs18032-m', 'BS18032-M', 'E501377-20230919', 'September 25, 2023'],
  ])('keeps the base-model document and finish caveat together for %s', (slug, sku, report, date) => {
    openPage(`/products/wallplates/${slug}`);
    const checklist = screen.getByRole('region', { name: `Before you order ${sku}` });
    expect(checklist).toHaveTextContent(report);
    expect(checklist).toHaveTextContent(date);
    expect(checklist).toHaveTextContent(/base model/i);
    expect(checklist).toHaveTextContent(/finish.*current coverage/i);
  });

  it('requests a matching document when the wallplate base model is absent', () => {
    openPage('/products/wallplates/bs1805');
    const checklist = screen.getByRole('region', { name: 'Before you order BS1805' });
    expect(checklist).toHaveTextContent(/not named in the.*wallplate.*addenda/i);
    expect(checklist).toHaveTextContent(/request.*model.*document/i);
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
