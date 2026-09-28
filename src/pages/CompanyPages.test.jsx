import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Capabilities from './Capabilities.jsx';
import About from './About.jsx';
import { certificates } from '../data/certificates.js';
import { publicAsset } from '../utils/publicAsset.js';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function renderPage(Page) {
  return render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Page /></MemoryRouter>);
}

describe('Manufacturing and company information', () => {
  it('introduces manufacturing with actual factory images and an OEM anchor', () => {
    renderPage(Capabilities);
    expect(screen.getByRole('heading', { level: 1, name: 'Your product. Our production.' })).toBeInTheDocument();
    expect(screen.getByAltText('FAHINT staff assembling wiring-device components')).toHaveAttribute('src', publicAsset('assets/images/company/factory/device-assembly-v1.webp'));
    expect(screen.getByRole('heading', { name: 'Assembly & automation' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Aging tests' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Laboratory verification' })).toBeVisible();
    expect(document.getElementById('oem')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Discuss your OEM / ODM project' })).toHaveAttribute('href', '/contact?topic=oem');
    const styles = readFileSync('src/styles/capabilities.css', 'utf8');
    expect(styles.match(/\.capabilities-page\.company-page h2\s*\{/g)).toHaveLength(2);
  });
  it('shows the three factory stages without hiding the testing photographs behind tabs', () => {
    renderPage(Capabilities);
    const stages = within(document.getElementById('production')).getAllByRole('article');
    expect(stages).toHaveLength(3);
    for (const stage of stages) expect(within(stage).getByRole('img')).toBeVisible();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    expect(screen.getByRole('article', { name: 'Aging tests' })).toHaveTextContent('Test conditions and duration');
    expect(screen.getByRole('article', { name: 'Laboratory verification' })).toHaveTextContent('temperature and humidity');
    expect(screen.getByRole('link', { name: 'See our testing stations' })).toHaveAttribute('href', '/#studio-making');
  });
  it('keeps chapter navigation on the manufacturing route and joins documentation with the project inquiry', () => {
    renderPage(Capabilities);
    const nav = screen.getByRole('navigation', { name: 'Manufacturing sections' });
    for (const [name, anchor] of [['Inside production', 'production'], ['OEM / ODM', 'oem'], ['Working with us', 'process']]) {
      expect(within(nav).getByRole('link', { name })).toHaveAttribute('href', `/capabilities#${anchor}`);
      expect(document.getElementById(anchor)).toBeInTheDocument();
    }
    const nextStep = screen.getByRole('region', { name: 'Bring us your product brief.' });
    expect(within(nextStep).getByRole('link', { name: 'Start a project' })).toHaveAttribute('href', '/contact?topic=oem');
    expect(within(nextStep).getByRole('link', { name: 'Review certificates' })).toHaveAttribute('href', '/about#certifications');
    expect(nextStep).toHaveTextContent('A company certificate does not certify every product in the range.');
  });
  it('provides a sequenced cooperation process and model-scoped documentation', () => {
    renderPage(Capabilities);
    const process = screen.getByRole('list', { name: 'From brief to production' });
    expect(within(process).getAllByRole('listitem')).toHaveLength(4);
    expect(screen.getByRole('link', { name: /Review certificates/ })).toHaveAttribute('href', '/about#certifications');
    expect(document.body).not.toHaveTextContent(/400 cartons|within 6 hours|98%|3-day shipment|10-day delivery|exceeds the UL/i);
  });
  it('distinguishes the FAHINT brand from private-label manufacturing', () => {
    renderPage(About);
    expect(screen.getByRole('heading', { level: 1, name: 'Everyday power. Made by FAHINT.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'FAHINT products' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Your brand, our manufacturing' })).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(/400 cartons|6-hour|3-year warranty|ALDI|zero Category A|98%/i);
  });
  it('provides every original certificate with model scope and PDF access', () => {
    renderPage(About);
    const library = document.getElementById('certifications');
    expect(library).toBeInTheDocument();
    for (const certificate of certificates) {
      expect(within(library).getByRole('link', { name: `Open ${certificate.name} PDF` })).toHaveAttribute('href', publicAsset(certificate.document));
      expect(within(library).getByRole('link', { name: `Download ${certificate.name} PDF` })).toHaveAttribute('download');
      expect(within(library).getByText(certificate.scope)).toBeInTheDocument();
    }
  });
  it('explains the company background, actual manufacturing stages and export relationships', () => {
    renderPage(About);
    expect(screen.getByText('2015')).toBeInTheDocument();
    expect(screen.getByText('Yueqing, Wenzhou, Zhejiang, China')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'The people behind the product.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Built in Wenzhou. Working across markets.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'A conversation around real products.' })).toBeInTheDocument();
    expect(screen.getByText(/United States, Canada and Mexico/)).toBeInTheDocument();
    expect(screen.getByAltText('The FAHINT team in front of the company product display')).toBeInTheDocument();
    expect(screen.getByAltText('FAHINT colleagues reviewing a product drawing together')).toBeInTheDocument();
    expect(screen.getByAltText('Electronic assembly equipment in the FAHINT workshop')).toHaveAttribute('width', '1920');
    expect(screen.getByAltText('Wiring-device samples in the FAHINT showroom')).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(/70,000|2,400|5500|100\+|20\+ patents|2005/);
  });
  it('keeps section navigation on the About route when a deployment base URL is present', () => {
    render(<MemoryRouter initialEntries={['/about']} future={{ v7_startTransition:true, v7_relativeSplatPath:true }}><About /></MemoryRouter>);
    const nav = screen.getByRole('navigation', { name:'About FAHINT sections' });
    expect(within(nav).getByRole('link', { name:'Our markets' })).toHaveAttribute('href','/about#our-markets');
    expect(within(nav).getByRole('link', { name:'Inside FAHINT' })).toHaveAttribute('href','/about#inside-fahint');
  });
  it('uses separate, traceable factory photographs across the three updated surfaces', () => {
    const factoryDirectory = join('public', 'assets', 'images', 'company', 'factory');
    const manifest = JSON.parse(readFileSync(join(factoryDirectory, 'manifest.json'), 'utf8').replace(/^\uFEFF/, ''));
    expect(manifest).toHaveLength(13);
    expect(new Set(manifest.map(photo => photo.source_sha256)).size).toBe(13);
    for (const photo of manifest) {
      expect(existsSync(join(factoryDirectory, photo.asset))).toBe(true);
      expect(photo.bytes).toBeLessThan(500000);
    }
    for (const [Page, page] of [[Capabilities, 'Capabilities'], [About, 'About']]) {
      const { container, unmount } = renderPage(Page);
      const images = Array.from(container.querySelectorAll('img[src*="/company/factory/"]'));
      const expected = manifest.filter(photo => photo.page === page);
      expect(images).toHaveLength(expected.length);
      for (const photo of expected) {
        const image = images.find(item => item.getAttribute('src') === publicAsset(`assets/images/company/factory/${photo.asset}`));
        expect(image).toHaveAttribute('width', String(photo.width));
        expect(image).toHaveAttribute('height', String(photo.height));
      }
      expect(container.querySelector('img[src*="factory-optimized"],img[src*="catalog-production"],img[src*="catalog-tooling"]')).toBeNull();
      unmount();
    }
  });
});
