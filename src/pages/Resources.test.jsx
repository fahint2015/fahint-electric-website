import { readFileSync } from 'node:fs';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { certificates } from '../data/certificates.js';
import * as documents from '../data/documents.js';
import { findProduct } from '../data/products.js';
import { findCatalogProduct } from '../data/catalogProducts.js';
import { publicAsset } from '../utils/publicAsset.js';
import { ProductCertification } from '../components/products/ProductTechnicalSections.jsx';
import { CatalogDocumentation } from '../components/products/CatalogProductSections.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import CertificateLibrary from '../components/company/CertificateLibrary.jsx';
import Contact from './Contact.jsx';

function LocationProbe() {
  const location = useLocation();
  return <span data-testid="route">{location.pathname}{location.search}</span>;
}

const wrap = children => <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{children}</MemoryRouter>;

async function show(path = '/resources') {
  const { default: Resources } = await import('./Resources.jsx');
  return render(<MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes><Route path="/resources" element={<Resources />} /><Route path="/contact" element={<Contact />} /></Routes>
    <LocationProbe />
  </MemoryRouter>);
}

afterEach(() => vi.unstubAllEnvs());

describe('Resources', () => {
  it('assigns product families without classifying ISO as a product listing', () => {
    expect(certificates.map(file => file.family)).toEqual(['gfci', 'receptacles', 'usb-outlets', 'wallplates', 'wallplates', 'lighting-switches', undefined]);
    expect(documents.resourcesHref(findProduct('GF15'))).toBe('/resources?family=gfci&model=GF15');
  });

  it('offers the eight real PDFs with base-safe native open and download links', async () => {
    vi.stubEnv('BASE_URL', '/fahint-electric-website/');
    await show();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Product resources.');
    const paths = [documents.catalogueDocument, ...certificates.map(file => file.document)];
    const downloads = screen.getAllByRole('link', { name: /^Download .* PDF$/ });
    expect(downloads).toHaveLength(8);
    for (const path of paths) {
      expect(readFileSync(`public/${path}`).subarray(0, 5).toString()).toBe('%PDF-');
      const download = downloads.find(link => link.getAttribute('href') === publicAsset(path));
      expect(download).toHaveAttribute('download');
      const open = screen.getAllByRole('link').find(link => link.getAttribute('href') === publicAsset(path) && link.target === '_blank');
      expect(open).toHaveAttribute('rel', 'noreferrer');
    }
    expect(screen.getByText(/ISO 9001 relates to the quality management system, not a product listing/)).toBeVisible();
    expect(screen.getByLabelText('Product family').options).toHaveLength(8);
  });

  it('filters family files while keeping the catalog and ISO available', async () => {
    await show();
    fireEvent.change(screen.getByLabelText('Product family'), { target: { value: 'usb-outlets' } });
    expect(screen.getByRole('status')).toHaveTextContent('1 product-family document');
    expect(screen.getByRole('link', { name: 'Download UL — USB Outlets PDF' })).toBeVisible();
    expect(screen.queryByRole('link', { name: 'Download UL — GFCI Receptacles PDF' })).not.toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /^Download .* PDF$/ })).toHaveLength(3);
    expect(screen.getByTestId('route')).toHaveTextContent('/resources?family=usb-outlets');
  });

  it('keeps the two wallplate addenda separate with their exact base-model scopes', async () => {
    await show('/resources?family=wallplates&model=BS1805');
    expect(screen.getByRole('status')).toHaveTextContent('2 product-family documents');
    const files = certificates.filter(file => file.family === 'wallplates');
    expect(files.map(file => file.models)).toEqual([
      ['BS1806', 'BS1807', 'BS18012', 'BS18013', 'BS18014', 'BS18032', 'BS18033', 'BS18034'],
      ['BS1801', 'BS1802', 'BS1803', 'BS1804'],
    ]);
    expect(new Set(files.map(file => file.document)).size).toBe(2);
    for (const file of files) {
      const card = screen.getByRole('article', { name: file.name });
      fireEvent.click(within(card).getByText('Scope & document date'));
      expect(card).toHaveTextContent(file.issued);
      expect(card).toHaveTextContent(/finish.*current/i);
      expect(card).not.toHaveTextContent('BS1805');
    }
    expect(screen.getByText(/E501377-20181016/)).toBeVisible();
    expect(screen.getByText(/E501377-20230919/)).toBeVisible();
    expect(screen.getAllByRole('link', { name: /^Download .* PDF$/ })).toHaveLength(4);
    expect(screen.getByRole('link', { name: 'Return to BS1805' })).toHaveAttribute('href', '/products/wallplates/bs1805');
    expect(screen.getByText(/Selecting a model does not confirm its certification coverage/)).toBeVisible();
  });

  it.each(['dimmers', 'smart-switches'])('explains missing standalone files for %s without a fake download', async family => {
    await show(`/resources?family=${family}`);
    expect(screen.getByText(/No separate certificate PDF is published here for this family/)).toBeVisible();
    expect(screen.getAllByRole('link', { name: /^Download .* PDF$/ })).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'Browse this product family' })).toHaveAttribute('href', `/products/${family}`);
    expect(screen.getByRole('link', { name: 'Request model documents' })).toHaveAttribute('href', '/contact?topic=technical');
  });

  it.each([
    ['GF15', 'gfci', '/products/gfci/gf15'],
    ['FTR15C-3100', 'usb-outlets', '/products/usb-outlets/ftr15c-3100'],
    ['GL20', 'gfci', '/products/gfci/gl20'],
    ['GTN15', 'gfci', '/products/gfci/gtn15']
  ])('keeps %s model context separate from certificate coverage', async (model, family, source) => {
    await show(`/resources?family=${family}&model=${model}`);
    expect(screen.getByLabelText('Product family')).toHaveValue(family);
    expect(screen.getByRole('link', { name: `Return to ${model}` })).toHaveAttribute('href', source);
    expect(screen.getByRole('link', { name: 'Request model documents' })).toHaveAttribute('href', `/contact?topic=technical&model=${model}`);
    expect(screen.getByText(/Selecting a model does not confirm its certification coverage/)).toBeVisible();
  });

  it.each(['family=invalid&model=unknown', 'family=receptacles&model=FLB20', 'family=usb-outlets&model=GF15'])('does not display untrusted, draft or mismatched model context: %s', async query => {
    await show(`/resources?${query}&source=https%3A%2F%2Fevil.example`);
    expect(screen.queryByRole('link', { name: /^Return to / })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Request model documents' })).toHaveAttribute('href', '/contact?topic=technical');
    expect(within(document.querySelector('.resources-page')).queryByText(/unknown|FLB20|evil\.example/)).not.toBeInTheDocument();
  });

  it('clears model context when changing families, and All restores all files', async () => {
    await show('/resources?family=gfci&model=GF15');
    fireEvent.change(screen.getByLabelText('Product family'), { target: { value: 'usb-outlets' } });
    expect(screen.queryByRole('link', { name: 'Return to GF15' })).not.toBeInTheDocument();
    expect(screen.getByTestId('route')).toHaveTextContent('/resources?family=usb-outlets');
    fireEvent.change(screen.getByLabelText('Product family'), { target: { value: '' } });
    expect(screen.getByRole('status')).toHaveTextContent('6 product-family documents');
    expect(screen.getByTestId('route')).toHaveTextContent(/^\/resources$/);
  });

  it('preserves the model when opening the existing technical inquiry form', async () => {
    const user = userEvent.setup();
    await show('/resources?family=usb-outlets&model=FTR15C-3100');
    await user.click(screen.getByRole('link', { name: 'Request model documents' }));
    expect(screen.getByRole('group', { name: 'Selected product' })).toHaveTextContent('FTR15C-3100');
    expect(screen.getByTestId('route')).toHaveTextContent('/contact?topic=technical&model=FTR15C-3100');
  });

  it('exposes document scope through a focusable native disclosure', async () => {
    const user = userEvent.setup();
    await show('/resources?family=gfci');
    const card = screen.getByRole('article', { name: 'UL — GFCI Receptacles' });
    const summary = within(card).getByText('Scope & document date');
    summary.focus();
    expect(summary.tagName).toBe('SUMMARY');
    expect(summary).toHaveFocus();
    await user.click(summary);
    expect(summary.closest('details')).toHaveAttribute('open');
    expect(within(card).getByText(certificates[0].scope)).toBeVisible();
  });

  it('has page-specific indexable metadata without using filter URLs as page identity', async () => {
    await show('/resources?family=usb-outlets');
    expect(document.title).toBe('Product Catalog & Certificate Downloads | FAHINT');
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
    expect(document.querySelector('meta[property="og:url"]').content).toMatch(/\/resources\/$/);
  });
});

describe('Resource entry points', () => {
  it.each(['GF15', 'GL20'])('connects the GFCI documentation section for %s', model => {
    render(wrap(<ProductCertification product={findProduct(model)} />));
    expect(screen.getByRole('link', { name: 'Browse product resources' })).toHaveAttribute('href', `/resources?family=gfci&model=${model}`);
  });

  it.each([['usb-outlets', 'ftr15c-3100', 'FTR15C-3100'], ['gfci', 'gtn15', 'GTN15']])('connects the catalog documentation section for %s/%s', (family, slug, model) => {
    render(wrap(<CatalogDocumentation product={findCatalogProduct(family, slug)} />));
    expect(screen.getByRole('link', { name: 'Browse product resources' })).toHaveAttribute('href', `/resources?family=${family}&model=${model}`);
  });

  it('provides resources from desktop/mobile navigation, footer and the existing library', () => {
    render(wrap(<><Header /><Footer /><CertificateLibrary /></>));
    expect(screen.getAllByRole('link', { name: 'Resources' })).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: 'Toggle menu' }));
    expect(screen.getAllByRole('link', { name: 'Resources' })).toHaveLength(3);
    for (const link of screen.getAllByRole('link', { name: 'Resources' })) expect(link).toHaveAttribute('href', '/resources');
    expect(screen.getByRole('link', { name: 'Browse all resources' })).toHaveAttribute('href', '/resources');
  });
});
