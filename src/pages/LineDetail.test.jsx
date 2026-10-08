import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import userEvent from '@testing-library/user-event';
import LineDetail from './LineDetail.jsx';
import { publicAsset } from '../utils/publicAsset.js';

function LocationProbe() {
  const location = useLocation();
  return <span data-testid="listing-location">{location.pathname}{location.search}</span>;
}

function renderSeries(line = 'usb-outlets', search = '') {
  return render(
    <MemoryRouter initialEntries={[`/products/${line}${search}`]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes><Route path="/products/:line" element={<LineDetail />} /></Routes>
      <LocationProbe />
    </MemoryRouter>
  );
}

describe('model catalogue', () => {
  it('explains an exact legacy name match without changing the input, route or configuration filter', async () => {
    const user = userEvent.setup();
    renderSeries('receptacles');
    const search = screen.getByRole('searchbox', { name: 'Search models' });
    await user.type(search, 'RT15Q-C');
    expect(search).toHaveValue('RT15Q-C');
    expect(screen.getByText('RT15Q-C is listed in the current catalog as CT15Q.')).toBeVisible();
    expect(screen.getByRole('link', { name: 'View CT15Q details' })).toHaveAttribute('href', '/products/receptacles/rt15q-c');
    expect(screen.getByText('1 of 30 models')).toBeVisible();
    await user.selectOptions(screen.getByRole('combobox', { name: 'Configuration' }), 'Duplex Receptacle');
    expect(screen.getByRole('status')).toHaveTextContent('No models match');
    expect(screen.queryByText(/is listed in the current catalog as/)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    await user.type(search, 'CT15Q');
    expect(screen.getByRole('link', { name: 'View CT15Q details' })).toBeVisible();
    expect(screen.queryByText(/is listed in the current catalog as/)).not.toBeInTheDocument();
  });

  it('offers USB specification controls in place of the generic configuration field', () => {
    renderSeries();
    expect(screen.getByRole('combobox', { name: 'USB ports' }).options).toHaveLength(5);
    expect(screen.getByRole('combobox', { name: 'Receptacle rating' }).options).toHaveLength(4);
    expect(screen.getByRole('combobox', { name: 'Charging output' }).options).toHaveLength(8);
    expect(screen.queryByRole('combobox', { name: 'Configuration' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeDisabled();
    expect(screen.getByText(/PD values are USB-C single-port maximums/)).toBeVisible();
  });

  it('combines USB specifications with search and clears every selection together', async () => {
    const user = userEvent.setup();
    renderSeries();
    await user.selectOptions(screen.getByRole('combobox', { name: 'USB ports' }), 'dual-c');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Receptacle rating' }), '20a');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Charging output' }), 'pd-65w');
    expect(screen.getByText('1 of 37 models')).toBeVisible();
    expect(screen.getByRole('link', { name: 'View FTR20QC-DC65W details' })).toHaveAttribute('href', '/products/usb-outlets/ftr20qc-dc65w');
    expect(screen.getByTestId('listing-location')).toHaveTextContent('ports=dual-c&rating=20a&charging=pd-65w');
    const search = screen.getByRole('searchbox', { name: 'Search models' });
    await user.type(search, 'FTR15');
    expect(screen.getByRole('status')).toHaveTextContent('No models match');
    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(screen.getByText('37 of 37 models')).toBeVisible();
    expect(search).toHaveValue('');
    for (const select of screen.getAllByRole('combobox')) expect(select).toHaveValue('');
    expect(screen.getByTestId('listing-location')).toHaveTextContent(/^\/products\/usb-outlets$/);
  });

  it('restores a filtered USB listing from its URL while keeping series metadata', () => {
    renderSeries('usb-outlets', '?ports=dual-c&rating=20a&charging=pd-65w&q=FTR20QC');
    expect(screen.getByRole('searchbox', { name: 'Search models' })).toHaveValue('FTR20QC');
    expect(screen.getByRole('combobox', { name: 'USB ports' })).toHaveValue('dual-c');
    expect(screen.getByRole('combobox', { name: 'Receptacle rating' })).toHaveValue('20a');
    expect(screen.getByRole('combobox', { name: 'Charging output' })).toHaveValue('pd-65w');
    expect(screen.getByText('1 of 37 models')).toBeVisible();
    expect(document.querySelector('meta[property="og:url"]').content).toMatch(/\/products\/usb-outlets\/$/);
  });

  it('ignores invalid USB filter values and unrelated query fields', async () => {
    const user = userEvent.setup();
    renderSeries('usb-outlets', '?ports=unknown&rating=130a&charging=pd-130w&source=https://example.invalid');
    expect(screen.getByText('37 of 37 models')).toBeVisible();
    for (const select of screen.getAllByRole('combobox')) expect(select).toHaveValue('');
    await user.selectOptions(screen.getByRole('combobox', { name: 'USB ports' }), 'four-a');
    expect(screen.getByText('1 of 37 models')).toBeVisible();
    expect(screen.getByRole('link', { name: 'View F4P details' })).toBeVisible();
    expect(screen.getByTestId('listing-location')).toHaveTextContent(/^\/products\/usb-outlets\?ports=four-a$/);
  });

  it('preserves an incompatible selection until the user resets it', async () => {
    const user = userEvent.setup();
    renderSeries('usb-outlets', '?ports=dual-a&charging=pd-65w');
    expect(screen.getByRole('status')).toHaveTextContent('No models match');
    expect(screen.getByRole('combobox', { name: 'USB ports' })).toHaveValue('dual-a');
    expect(screen.getByRole('combobox', { name: 'Charging output' })).toHaveValue('pd-65w');
    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(screen.getByText('37 of 37 models')).toBeVisible();
  });

  it('does not apply USB-specific controls or URL parameters to another family', () => {
    renderSeries('dimmers', '?ports=dual-c&rating=20a&charging=pd-65w&q=nonexistent');
    expect(screen.queryByRole('combobox', { name: 'USB ports' })).not.toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Configuration' })).toHaveValue('');
    expect(screen.getByRole('searchbox', { name: 'Search models' })).toHaveValue('');
    expect(screen.getByText('2 of 2 models')).toBeVisible();
  });

  it.each([
    ['usb-outlets', 'USB Outlets', 'usb-series-desktop-charging-v1.webp', 37],
    ['dimmers', 'Dimmers', 'dimmer-series-living-room-v1.webp', 2],
    ['receptacles', 'Standard Receptacles', 'receptacle-series-desk-power-v1.webp', 30],
    ['smart-switches', 'Smart Switches', 'smart-series-bedside-touch-v1.webp', 51],
    ['lighting-switches', 'Lighting Switches', 'lighting-series-stair-entry-v1.webp', 6],
  ])('overlays the %s introduction on its supplied full-width poster', (line, title, file, count) => {
    renderSeries(line);
    const intro = screen.getByRole('heading', { level: 1, name: title }).closest('section');
    const poster = intro.querySelector('.catalog-series__poster');
    const asset = `assets/images/lines/${file}`;
    expect(intro).toHaveClass('catalog-series__intro--poster');
    expect(poster).toHaveAttribute('src', publicAsset(asset));
    expect(poster).toHaveAttribute('width', '1920');
    expect(poster).toHaveAttribute('height', '450');
    expect(poster).toHaveAttribute('alt', '');
    expect(poster).toHaveAttribute('loading', 'eager');
    expect(poster).toHaveAttribute('fetchpriority', 'high');
    expect(existsSync(`public/${asset}`)).toBe(true);
    expect(intro.querySelector('.catalog-series__poster-shade')).toHaveAttribute('aria-hidden', 'true');
    expect(intro.querySelector('.container')).toContainElement(screen.getByRole('heading', { level: 1 }));
    expect(intro).toHaveTextContent(`${count} model configurations`);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    if (['usb-outlets', 'dimmers'].includes(line)) expect(intro.querySelector('.catalog-section-heading > p')).not.toBeEmptyDOMElement();

    const css = readFileSync('src/styles/catalog.css', 'utf8');
    const shade = css.match(/\.catalog-series__poster-shade\s*\{([^}]*)\}/)?.[1] || '';
    expect(shade).toMatch(/linear-gradient\(90deg/);
    expect(shade).toMatch(/pointer-events:\s*none/);
    expect(css).toMatch(/\.catalog-series__poster\s*\{[^}]*position:\s*absolute[^}]*object-fit:\s*cover/);
    expect(css).toMatch(/\.catalog-series__intro--poster \.catalog-section-heading h1\s*\{[^}]*color:\s*#fff/);
    const mobile = css.slice(css.indexOf('@media (max-width: 760px)'));
    expect(mobile).toMatch(/\.catalog-series__poster\s*\{[^}]*position:\s*relative[^}]*height:\s*clamp\(220px, 64vw, 320px\)[^}]*object-position:\s*74%/);
    expect(mobile).toMatch(/\.catalog-series__poster-shade\s*\{[^}]*display:\s*none/);
    expect(mobile).toMatch(/\.catalog-series__intro--poster > \.container\s*\{[^}]*min-height:\s*0/);
    expect(mobile).not.toMatch(/min-height:\s*640px/);
  });

  it.each([
    ['receptacles', 'Standard Receptacles', 30],
    ['smart-switches', 'Smart Switches', 51],
  ])('omits the %s description and keeps its centered product clear of the desktop shade', (line, title, count) => {
    renderSeries(line);
    const intro = screen.getByRole('heading', { level: 1, name: title }).closest('section');
    expect(intro).toHaveClass('catalog-series__intro--centered');
    expect(intro.querySelector('.catalog-section-heading > p')).toBeNull();
    expect(intro.querySelector('.catalog-series__meta').children).toHaveLength(3);
    expect(screen.getByRole('searchbox', { name: /Search models/i })).toBeInTheDocument();
    expect(screen.getByText(`${count} of ${count} models`)).toBeInTheDocument();
    const css = readFileSync('src/styles/catalog.css', 'utf8');
    expect(css).toMatch(/\.catalog-series__intro--centered \.catalog-series__poster\s*\{[^}]*object-position:\s*50% center/);
    const desktop = css.slice(css.indexOf('@media (min-width: 761px)'));
    expect(desktop).toMatch(/\.catalog-series__intro--centered \.catalog-series__poster-shade\s*\{[^}]*linear-gradient\(90deg[^}]*rgba\(7,27,48,0\) 56%/);
  });

  it('keeps lighting poster copy to the right and below the product on narrow screens', async () => {
    const user = userEvent.setup();
    renderSeries('lighting-switches');
    const intro = screen.getByRole('heading', { level: 1, name: 'Lighting Switches' }).closest('section');
    expect(intro).toHaveClass('catalog-series__intro--right');
    expect(intro).not.toHaveClass('catalog-series__intro--centered');
    expect(intro.querySelector('.catalog-section-heading > p')).toBeNull();
    expect(intro.querySelector('.catalog-series__meta').children).toHaveLength(3);
    expect(screen.getByText('6 of 6 models')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /^View .+ details$/ })).toHaveLength(6);
    const css = readFileSync('src/styles/catalog.css', 'utf8');
    const desktop = css.slice(css.indexOf('@media (min-width: 761px)'), css.indexOf('.catalog-series__models'));
    expect(desktop).toMatch(/\.catalog-series__intro--right > \.container > \*\s*\{[^}]*width:\s*min\(520px, 44%\)[^}]*justify-self:\s*end/);
    expect(desktop).toMatch(/\.catalog-series__intro--right \.catalog-series__poster-shade\s*\{[^}]*linear-gradient\(90deg[^}]*rgba\(7,27,48,0\) 40%[^}]*rgba\(7,27,48,\.96\) 100%/);
    const mobile = css.slice(css.indexOf('@media (max-width: 760px)'));
    expect(mobile).toMatch(/\.catalog-series__intro--right \.catalog-series__poster\s*\{[^}]*object-position:\s*30% center/);
    expect(mobile).toMatch(/\.catalog-series__intro--centered \.catalog-series__poster\s*\{[^}]*object-position:\s*50% center/);
    expect(mobile).not.toMatch(/padding-top:\s*380px/);
    expect(mobile).toMatch(/\.catalog-series__poster-shade\s*\{[^}]*display:\s*none/);
    await user.selectOptions(screen.getByRole('combobox', { name: 'Configuration' }), 'Toggle switches');
    expect(screen.getByText('2 of 6 models')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View T15 details' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'View DS15 details' })).not.toBeInTheDocument();
  });

  it.each(['wallplates'])
    ('keeps the existing plain introduction on %s', (line) => {
      const { container } = renderSeries(line);
      expect(container.querySelector('.catalog-series__intro--poster')).toBeNull();
      expect(container.querySelector('.catalog-series__poster')).toBeNull();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(container.querySelector('.catalog-series__intro .catalog-section-heading > p')).not.toBeEmptyDOMElement();
    });

  it('links USB models to their own detail pages instead of the series landing page', () => {
    renderSeries();
    expect(screen.getByRole('link', { name: /View FTR15-3100 details/i }))
      .toHaveAttribute('href', '/products/usb-outlets/ftr15-3100');
    expect(screen.getByRole('link', { name: /View FTR20QC-DC65W details/i }))
      .toHaveAttribute('href', '/products/usb-outlets/ftr20qc-dc65w');
    expect(screen.queryByText(/Full specifications and datasheets for any model below are available on request/i))
      .not.toBeInTheDocument();
  });

  it('lists all US smart switches before EU models, including after searching', async () => {
    const user = userEvent.setup();
    renderSeries('smart-switches');
    const listedModels = () => screen.getAllByRole('link', { name: /^View (?:US|EU).* details$/ })
      .map((link) => link.getAttribute('aria-label').slice(5, -8));
    const expectUSFirst = (models) => {
      const us = models.filter((sku) => sku.startsWith('US'));
      const eu = models.filter((sku) => sku.startsWith('EU'));
      expect(us.length).toBeGreaterThan(0);
      expect(eu.length).toBeGreaterThan(0);
      expect(models).toEqual([...us, ...eu]);
    };
    expect(listedModels()).toHaveLength(51);
    expectUSFirst(listedModels());
    await user.type(screen.getByRole('searchbox', { name: /Search models/i }), '8811');
    expectUSFirst(listedModels());
  });

  it('searches across models and can reset an empty result', async () => {
    const user = userEvent.setup();
    renderSeries();
    const search = screen.getByRole('searchbox', { name: /Search models/i });
    await user.type(search, 'FTR20QC DC65W');
    expect(screen.getByRole('link', { name: /View FTR20QC-DC65W details/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /View FTR15-3100 details/i })).not.toBeInTheDocument();
    await user.clear(search);
    await user.type(search, 'not-a-real-model');
    expect(screen.getByRole('status')).toHaveTextContent(/No models match/i);
    await user.click(screen.getByRole('button', { name: /Clear filters/i }));
    expect(search).toHaveValue('');
    expect(screen.getByRole('link', { name: /View FTR15-3100 details/i })).toBeInTheDocument();
  });
});
