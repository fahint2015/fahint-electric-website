import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Contact from './Contact.jsx';
import { productLines } from '../data/lines.js';

function renderContact(entry) {
  return render(
    <MemoryRouter initialEntries={[entry]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/contact" element={<><Contact /><Link to="/contact?model=FTR20QC-DC65W">Select USB Outlets</Link></>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Contact product categories', () => {
  it('offers exactly the seven homepage product categories instead of model options', () => {
    renderContact('/contact');
    const category = screen.getByRole('combobox', { name: 'Product category' });
    expect(within(category).getAllByRole('option').map(option => option.textContent)).toEqual([
      'Select a product category', ...productLines.map(line => line.name)
    ]);
    expect(category).toHaveAttribute('name', 'category');
    expect(screen.queryByLabelText('Model of interest')).not.toBeInTheDocument();
  });

  it('provides a clear OEM inquiry context and maps the linked model to its category', () => {
    renderContact('/contact?topic=oem&model=GF15');
    expect(screen.getByRole('heading', { level: 1, name: 'Let’s talk about your next project.' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'OEM / ODM inquiry' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByLabelText('Product category')).toHaveValue('GFCI Outlets');
    expect(screen.getByRole('link', { name: 'Technical question' })).toHaveAttribute('href', '/contact?topic=technical&model=GF15');
  });
  it('falls back to product inquiry for an unsupported topic', () => {
    renderContact('/contact?topic=invalid');
    expect(screen.getByRole('link', { name: 'Product inquiry' })).toHaveAttribute('aria-current', 'page');
    expect(document.title).toBe('Contact FAHINT | Product & OEM Inquiries');
  });
  it.each([
    ['GTN15', 'GFCI Outlets'],
    ['FTR20QC-DC65W', 'USB Outlets'],
    ['R15', 'Standard Receptacles'],
    ['DM2010S', 'Dimmers'],
    ['EUW8811C', 'Smart Switches'],
    ['DS15.3', 'Lighting Switches'],
    ['BS1803-M', 'Wallplates']
  ])('maps the public model %s to %s without adding a model option', (sku, category) => {
    renderContact(`/contact?model=${encodeURIComponent(sku)}`);
    const select = screen.getByLabelText('Product category');
    expect(select).toHaveValue(category);
    expect(within(select).getAllByRole('option')).toHaveLength(8);
  });
  it('prefills a validated public product from the query without unsafe response promises', () => {
    renderContact('/contact?model=gw15');

    expect(screen.getByLabelText('Product category')).toHaveValue('GFCI Outlets');
    expect(screen.queryByText(/within 6 hours/i)).not.toBeInTheDocument();
  });

  it('keeps the expanded FAQ model-scoped for GL20 documentation review', () => {
    renderContact('/contact?model=GL20');

    expect(screen.queryByText(/all Fahint GFCI receptacles are .*listed/i)).not.toBeInTheDocument();
    expect(screen.getByText(
      'Fahint maintains UL / cUL listing documentation under file E504391 for applicable GFCI models. Confirm model-specific coverage in the product documentation or with our team before ordering.'
    )).toBeInTheDocument();
  });

  it('ignores an unknown model query', () => {
    renderContact('/contact?model=unknown');

    expect(screen.getByLabelText('Product category')).toHaveValue('');
  });

  it('synchronizes a changed query while preserving the rest of the brief', async () => {
    const user = userEvent.setup();
    renderContact('/contact?model=GF15');

    await user.type(screen.getByLabelText('Company'), 'Northstar');
    await user.click(screen.getByRole('link', { name: 'Select USB Outlets' }));

    expect(screen.getByLabelText('Product category')).toHaveValue('USB Outlets');
    expect(screen.getByLabelText('Company')).toHaveValue('Northstar');
  });
});
