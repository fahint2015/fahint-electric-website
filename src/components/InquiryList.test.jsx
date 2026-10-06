import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import InquiryForm, { buildInquiryText, buildMailtoUrl, validateInquiry } from './InquiryForm.jsx';
import { productLines } from '../data/lines.js';

const items = [
  { model: 'FTR15-3100', quantity: '1200', finishSlug: 'black', source: 'https://evil.example' },
  { model: 'FTR20QC-DC65W', quantity: '', finishSlug: '' }
];
const brief = { name: 'Avery', email: 'buyer@example.com', company: 'Northstar', country: 'Canada',
  category: 'USB Outlets', model: 'GF15', quantity: '999', finish: 'White', source: 'bad-source',
  topic: 'OEM / ODM inquiry', message: 'Please quote these models.', items };
const routerFlags = { v7_startTransition: true, v7_relativeSplatPath: true };
const renderList = (props = {}) => render(<MemoryRouter future={routerFlags}><InquiryForm categoryOptions={productLines}
  defaultCategory="USB Outlets" inquiryItems={items} onItemsChange={vi.fn()} {...props} /></MemoryRouter>);
function fillRequired() {
  fireEvent.change(screen.getByLabelText('Your name *'), { target: { value: brief.name } });
  fireEvent.change(screen.getByLabelText('Business email *'), { target: { value: brief.email } });
  fireEvent.change(screen.getByLabelText('Requirements *'), { target: { value: brief.message } });
}

describe('itemized inquiry output', () => {
  it('uses the same validated itemized body for mail and copying without conflicting global choices', () => {
    const body = new URLSearchParams(buildMailtoUrl(brief).split('?')[1]).get('body');
    expect(body).toContain('Inquiry list (2 models):');
    expect(body).toContain('1. FTR15-3100\nQuantity: 1200 pcs\nFinish: Black\nProduct page: /products/usb-outlets/ftr15-3100');
    expect(body).toContain('2. FTR20QC-DC65W\nQuantity: Not specified\nFinish: Not specified');
    expect(body).toContain('Inquiry type: OEM / ODM inquiry');
    expect(body).not.toMatch(/GF15|999|White|bad-source|evil|Estimated quantity|Model of interest/);
    expect(buildInquiryText(brief)).toBe(`To: louis@fahint.com\n\n${body}`);
  });

  it('validates per-item quantities without requiring a quantity or finish', () => {
    expect(validateInquiry(brief)).toEqual({});
    expect(validateInquiry({ ...brief, items: [{ model: 'FTR15-3100', quantity: '0' }] })).toHaveProperty('items');
  });
});

describe('USB inquiry list form', () => {
  it('restores focus after the updated items actually commit, including a deferred parent update', async () => {
    const user = userEvent.setup();
    function DeferredList() {
      const [selected, setSelected] = useState([items[0]]);
      return <InquiryForm categoryOptions={productLines} defaultCategory="USB Outlets" inquiryItems={selected}
        onItemsChange={next => setTimeout(() => setSelected(next), 100)} />;
    }
    render(<MemoryRouter future={routerFlags}><DeferredList /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Remove FTR15-3100 from inquiry' }));
    await waitFor(() => expect(screen.queryByRole('group', { name: 'Your inquiry list' })).not.toBeInTheDocument());
    expect(screen.getByLabelText('Product category')).toHaveFocus();
  });

  it('shows optional per-item fields, product links and catalog finishes, not a global quantity', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    renderList({ onItemsChange: change });
    expect(screen.queryByLabelText('Estimated quantity')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Quantity for FTR15-3100')).toHaveValue('1200');
    expect(screen.getByLabelText('Finish for FTR20QC-DC65W')).toHaveValue('');
    expect(screen.getByRole('link', { name: 'FTR15-3100' })).toHaveAttribute('href', '/products/usb-outlets/ftr15-3100');
    await user.selectOptions(screen.getByLabelText('Finish for FTR15-3100'), 'grey');
    expect(change.mock.calls.at(-1)[0][0]).toMatchObject({ model: 'FTR15-3100', finishSlug: 'grey', quantity: '1200' });
  });

  it('opens a single itemized email and offers copying directly, without contacting a service', async () => {
    const user = userEvent.setup();
    const delivery = vi.fn();
    const clipboardWriter = vi.fn();
    const request = vi.fn();
    renderList({ delivery, clipboardWriter, request });
    fillRequired();
    await user.click(screen.getByRole('button', { name: 'Copy inquiry details' }));
    expect(clipboardWriter).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('button', { name: 'Open email app' }));
    expect(delivery).toHaveBeenCalledTimes(1);
    const body = new URLSearchParams(delivery.mock.calls[0][0].split('?')[1]).get('body');
    expect(clipboardWriter).toHaveBeenCalledWith(`To: louis@fahint.com\n\n${body}`);
    expect(body).toContain('Quantity: 1200 pcs');
    expect(request).not.toHaveBeenCalled();
  });

  it('blocks both mail and copying when a URL-supplied quantity is invalid', async () => {
    const user = userEvent.setup();
    const delivery = vi.fn(), clipboardWriter = vi.fn();
    renderList({ inquiryItems: [{ model: 'FTR15-3100', quantity: '1.5' }], delivery, clipboardWriter });
    fillRequired();
    await user.click(screen.getByRole('button', { name: 'Open email app' }));
    await user.click(screen.getByRole('button', { name: 'Copy inquiry details' }));
    expect(screen.getByLabelText('Quantity for FTR15-3100')).toHaveAttribute('aria-invalid', 'true');
    expect(delivery).not.toHaveBeenCalled();
    expect(clipboardWriter).not.toHaveBeenCalled();
  });

  it('keeps all item details available through the long-email copy fallback', async () => {
    const user = userEvent.setup();
    const delivery = vi.fn(), clipboardWriter = vi.fn();
    renderList({ delivery, clipboardWriter });
    fillRequired();
    fireEvent.change(screen.getByLabelText('Requirements *'), { target: { value: 'Long brief. '.repeat(200) } });
    await user.click(screen.getByRole('button', { name: 'Open email app' }));
    expect(screen.getByRole('alert')).toHaveTextContent('too long');
    await user.click(screen.getByRole('button', { name: 'Copy inquiry details' }));
    expect(delivery).not.toHaveBeenCalled();
    expect(clipboardWriter.mock.calls[0][0]).toContain('2. FTR20QC-DC65W');
  });

  it('does not show a stale copied confirmation after the item choices change', async () => {
    const user = userEvent.setup();
    let resolveCopy;
    const clipboardWriter = vi.fn(() => new Promise(resolve => { resolveCopy = resolve; }));
    const { rerender } = renderList({ clipboardWriter });
    await user.click(screen.getByRole('button', { name: 'Copy inquiry details' }));
    rerender(<MemoryRouter future={routerFlags}><InquiryForm categoryOptions={productLines} defaultCategory="USB Outlets"
      inquiryItems={[{ model: 'FTR15-3100', quantity: '250', finishSlug: 'grey' }]} onItemsChange={vi.fn()} clipboardWriter={clipboardWriter} /></MemoryRouter>);
    await act(async () => resolveCopy());
    await waitFor(() => expect(screen.getByRole('button', { name: 'Copy inquiry details' })).toBeEnabled());
    expect(screen.queryByText('Inquiry details copied.')).not.toBeInTheDocument();
  });
});
