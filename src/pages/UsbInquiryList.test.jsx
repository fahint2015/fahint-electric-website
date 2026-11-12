import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Contact from './Contact.jsx';
import { parseInquiryItems } from '../utils/inquiryList.js';

const listUrl = '/contact?topic=products&items=' + encodeURIComponent(JSON.stringify([
  ['FTR15-3100', '1200', 'black'], ['FTR15C-3100', '', ''], ['FTR20QC-DC65W', '800', 'grey']
]));
function LocationProbe() {
  const location = useLocation();
  return <output aria-label="Current URL">{location.pathname}{location.search}</output>;
}
function renderContact(url = listUrl) {
  return render(<MemoryRouter initialEntries={[url]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes><Route path="/contact" element={<><Contact /><LocationProbe /></>} /></Routes>
  </MemoryRouter>);
}
const currentUrl = () => screen.getByLabelText('Current URL').textContent;
const currentItems = () => parseInquiryItems(new URL(currentUrl(), 'https://example.com').searchParams.get('items'));

describe('USB list contact integration', () => {
  it('restores validated choices without changing the seven-category selector', () => {
    renderContact();
    expect(screen.getByRole('group', { name: 'Your inquiry list' })).toBeInTheDocument();
    expect(screen.getByLabelText('Product category')).toHaveValue('USB Outlets');
    expect(within(screen.getByLabelText('Product category')).getAllByRole('option')).toHaveLength(8);
    expect(screen.getByLabelText('Quantity for FTR15-3100')).toHaveValue('1200');
    expect(screen.getByLabelText('Finish for FTR15-3100')).toHaveValue('black');
    expect(screen.getByLabelText('Finish for FTR15C-3100')).toHaveValue('');
  });

  it('keeps item edits and topic changes while leaving customer details out of the URL', async () => {
    const user = userEvent.setup();
    renderContact();
    await user.type(screen.getByLabelText('Company'), 'Private Company');
    await user.type(screen.getByLabelText('Business email *'), 'private@example.com');
    await user.type(screen.getByLabelText('Requirements *'), 'Private requirements');
    fireEvent.change(screen.getByLabelText('Quantity for FTR15C-3100'), { target: { value: '3000' } });
    await user.selectOptions(screen.getByLabelText('Finish for FTR15C-3100'), 'graphite');
    await user.click(screen.getByRole('link', { name: 'OEM / ODM inquiry', exact: true }));
    expect(currentItems()[1]).toMatchObject({ quantity: '3000', finishSlug: 'graphite' });
    expect(currentUrl()).toContain('topic=oem');
    expect(currentUrl()).not.toMatch(/Private|private|example|requirements/);
    expect(screen.getByLabelText('Company')).toHaveValue('Private Company');
    expect(screen.getByLabelText('Requirements *')).toHaveValue('Private requirements');
  });

  it('restores quantity and finish after a fresh render of the edited URL', async () => {
    const user = userEvent.setup();
    const { unmount } = renderContact();
    fireEvent.change(screen.getByLabelText('Quantity for FTR15-3100'), { target: { value: '2500' } });
    await user.selectOptions(screen.getByLabelText('Finish for FTR15-3100'), 'almond');
    const url = currentUrl();
    unmount();
    renderContact(url);
    expect(screen.getByLabelText('Quantity for FTR15-3100')).toHaveValue('2500');
    expect(screen.getByLabelText('Finish for FTR15-3100')).toHaveValue('almond');
  });

  it('removes rows and the last item without clearing the customer draft or stranding focus', async () => {
    const user = userEvent.setup();
    renderContact();
    await user.type(screen.getByLabelText('Company'), 'Keep this draft');
    await user.click(screen.getByRole('button', { name: 'Remove FTR15C-3100 from inquiry' }));
    expect(currentItems().map(item => item.model)).toEqual(['FTR15-3100', 'FTR20QC-DC65W']);
    expect(screen.getByLabelText('Quantity for FTR20QC-DC65W')).toHaveValue('800');
    await user.click(screen.getByRole('button', { name: 'Remove FTR15-3100 from inquiry' }));
    await user.click(screen.getByRole('button', { name: 'Remove FTR20QC-DC65W from inquiry' }));
    expect(screen.queryByRole('group', { name: 'Your inquiry list' })).not.toBeInTheDocument();
    expect(currentUrl()).not.toContain('items=');
    expect(screen.getByLabelText('Estimated quantity')).toBeInTheDocument();
    expect(screen.getByLabelText('Company')).toHaveValue('Keep this draft');
    await waitFor(() => expect(screen.getByLabelText('Product category')).toHaveFocus());
  });

  it('clears USB items when the customer chooses a different product category', async () => {
    const user = userEvent.setup();
    renderContact();
    await user.type(screen.getByLabelText('Company'), 'Keep this draft');
    await user.selectOptions(screen.getByLabelText('Product category'), 'GFCI Outlets');
    expect(currentUrl()).not.toContain('items=');
    expect(screen.queryByRole('group', { name: 'Your inquiry list' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Technical question', exact: true }));
    expect(screen.getByLabelText('Product category')).toHaveValue('GFCI Outlets');
    expect(screen.getByLabelText('Company')).toHaveValue('Keep this draft');
  });

  it('prefers valid list items over a conflicting single model and discards invalid lists', () => {
    const { unmount } = renderContact(`${listUrl}&model=GF15&finish=white`);
    expect(screen.getByLabelText('Product category')).toHaveValue('USB Outlets');
    expect(screen.queryByRole('group', { name: 'Selected product' })).not.toBeInTheDocument();
    unmount();
    renderContact('/contact?items=' + encodeURIComponent(JSON.stringify([['DM2010S']])));
    expect(screen.queryByRole('group', { name: 'Your inquiry list' })).not.toBeInTheDocument();
    expect(screen.getByLabelText('Product category')).toHaveValue('');
  });

  it.each([
    [['GF15', 'GF20', 'GTN20'], 'GFCI Outlets'],
    [['R15', 'R15Q', 'R20'], 'Standard Receptacles']
  ])('preserves edits, topic and customer draft for the %s list', async (models, category) => {
    const user = userEvent.setup();
    renderContact('/contact?topic=products&items=' + encodeURIComponent(JSON.stringify(models.map(model => [model, '', '']))));
    expect(screen.getByLabelText('Product category')).toHaveValue(category);
    await user.type(screen.getByLabelText('Company'), 'Private buyer');
    fireEvent.change(screen.getByLabelText(`Quantity for ${models[0]}`), { target: { value: '2500' } });
    await user.selectOptions(screen.getByLabelText(`Finish for ${models[0]}`), 'black');
    await user.click(screen.getByRole('link', { name: 'OEM / ODM inquiry', exact: true }));
    expect(currentItems()[0]).toMatchObject({ model: models[0], quantity: '2500', finishSlug: 'black', category });
    expect(currentUrl()).toContain('topic=oem');
    expect(currentUrl()).not.toContain('Private');
    await user.click(screen.getByRole('button', { name: `Remove ${models[1]} from inquiry` }));
    expect(currentItems().map(item => item.model)).toEqual([models[0], models[2]]);
    await user.click(screen.getByRole('button', { name: `Remove ${models[2]} from inquiry` }));
    await user.click(screen.getByRole('button', { name: `Remove ${models[0]} from inquiry` }));
    expect(screen.queryByRole('group', { name: 'Your inquiry list' })).not.toBeInTheDocument();
    expect(screen.getByLabelText('Company')).toHaveValue('Private buyer');
    expect(screen.getByLabelText('Estimated quantity')).toBeVisible();
    expect(currentUrl()).not.toContain('items=');
  });

  it.each([
    ['GF15', 'GF20', 'GFCI Outlets'],
    ['R15', 'R15Q', 'Standard Receptacles']
  ])('clears the %s list when switching product category', async (first, second, category) => {
    const user = userEvent.setup();
    renderContact('/contact?items=' + encodeURIComponent(JSON.stringify([[first], [second]])));
    expect(screen.getByLabelText('Product category')).toHaveValue(category);
    await user.type(screen.getByLabelText('Company'), 'Keep this draft');
    await user.selectOptions(screen.getByLabelText('Product category'), 'USB Outlets');
    expect(currentUrl()).not.toContain('items=');
    expect(screen.queryByRole('group', { name: 'Your inquiry list' })).not.toBeInTheDocument();
    expect(screen.getByLabelText('Company')).toHaveValue('Keep this draft');
  });
});
