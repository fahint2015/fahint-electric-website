import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import LineDetail from './LineDetail.jsx';

function LocationProbe() {
  const { search } = useLocation();
  return <span data-testid="comparison-url">{search}</span>;
}
function renderListing(search = '', line = 'usb-outlets') {
  return render(<MemoryRouter initialEntries={[`/products/${line}${search}`]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes><Route path="/products/:line" element={<LineDetail />} /></Routes><LocationProbe />
  </MemoryRouter>);
}
const choice = sku => screen.getByRole('checkbox', { name: `Compare ${sku}` });
const toolbar = () => screen.getByRole('region', { name: 'Model comparison' });
const open = () => screen.getByRole('button', { name: 'Compare models' });

describe('USB comparison flow', () => {
  let originalShowModal;
  let originalClose;
  beforeEach(() => {
    originalShowModal = HTMLDialogElement.prototype.showModal;
    originalClose = HTMLDialogElement.prototype.close;
    HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    };
  });
  afterEach(() => {
    HTMLDialogElement.prototype.showModal = originalShowModal;
    HTMLDialogElement.prototype.close = originalClose;
  });

  it('requires two models and caps selection at three without preventing removal', async () => {
    const user = userEvent.setup();
    renderListing();
    expect(open()).toBeDisabled();
    expect(within(toolbar()).getByText('Select 2–3 models')).toBeVisible();
    await user.click(choice('FTR15-3100'));
    expect(open()).toBeDisabled();
    expect(within(toolbar()).getByText('1 selected · Add one more')).toBeVisible();
    await user.click(choice('FTR15C-3100'));
    expect(open()).toBeEnabled();
    await user.click(choice('FTR15DC-3100'));
    expect(choice('FTR20-3100')).toBeDisabled();
    expect(within(toolbar()).getByText(/3 of 3 selected/)).toBeVisible();
    await user.click(choice('FTR15C-3100'));
    expect(choice('FTR20-3100')).toBeEnabled();
    expect(choice('FTR15C-3100')).not.toBeChecked();
    await user.click(within(toolbar()).getByRole('button', { name: 'Remove FTR15-3100 from comparison' }));
    expect(open()).toBeDisabled();
  });

  it('restores only valid distinct USB selections from the URL', () => {
    renderListing('?compare=GF15,F4P,invalid,FTR15-3100,F4P,FTR20-3100,FTR15C-3100');
    expect(choice('F4P')).toBeChecked();
    expect(choice('FTR15-3100')).toBeChecked();
    expect(choice('FTR20-3100')).toBeChecked();
    expect(choice('FTR15C-3100')).not.toBeChecked();
    expect(within(toolbar()).queryByText('invalid')).not.toBeInTheDocument();
  });

  it('preserves selection when filters change or clear, and preserves filters when comparison clears', async () => {
    const user = userEvent.setup();
    renderListing('?compare=FTR15-3100,F4P');
    await user.selectOptions(screen.getByRole('combobox', { name: 'USB ports' }), 'dual-c');
    expect(within(toolbar()).getByText('F4P')).toBeVisible();
    expect(screen.getByTestId('comparison-url')).toHaveTextContent('compare=FTR15-3100%2CF4P');
    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(choice('FTR15-3100')).toBeChecked();
    expect(choice('F4P')).toBeChecked();
    await user.selectOptions(screen.getByRole('combobox', { name: 'USB ports' }), 'four-a');
    await user.click(within(toolbar()).getByRole('button', { name: 'Clear comparison' }));
    expect(screen.getByRole('combobox', { name: 'USB ports' })).toHaveValue('four-a');
    expect(screen.getByTestId('comparison-url')).toHaveTextContent(/^\?ports=four-a$/);
  });

  it('shows a semantic comparison table, safe links and difference-only rows', async () => {
    const user = userEvent.setup();
    renderListing('?compare=FTR15-3100,FTR20QC-DC65W');
    await user.click(open());
    const dialog = screen.getByRole('dialog', { name: 'Compare USB models' });
    const table = within(dialog).getByRole('table', { name: 'USB model specifications' });
    expect(within(table).getByRole('columnheader', { name: /FTR15-3100/ })).toHaveAttribute('scope', 'col');
    expect(within(table).getByRole('rowheader', { name: /USB ports/ })).toHaveAttribute('scope', 'row');
    expect(within(dialog).getByRole('link', { name: 'View FTR15-3100 details' })).toHaveAttribute('href', '/products/usb-outlets/ftr15-3100');
    expect(within(dialog).getByRole('link', { name: 'Request quote for FTR20QC-DC65W' })).toHaveAttribute('href', '/contact?topic=products&model=FTR20QC-DC65W');
    const inquiryLink = within(dialog).getByRole('link', { name: 'Add selected to inquiry' });
    const inquiryParams = new URL(inquiryLink.href).searchParams;
    expect(inquiryParams.get('topic')).toBe('products');
    expect(JSON.parse(inquiryParams.get('items'))).toEqual([['FTR15-3100', '', ''], ['FTR20QC-DC65W', '', '']]);
    expect(new URL(inquiryLink.href).hash).toBe('#inquiry');
    expect(within(table).getByText('Up to 65W per USB-C port')).toBeVisible();
    expect(within(table).getByText('Confirm dual-port power sharing')).toBeVisible();
    expect(within(dialog).getByText(/not simultaneous/)).toBeVisible();
    await user.click(within(dialog).getByRole('checkbox', { name: 'Show differences only' }));
    expect(within(table).queryByRole('rowheader', { name: 'Device width' })).not.toBeInTheDocument();
    expect(within(table).getByRole('rowheader', { name: /Device depth/ })).toBeVisible();
  });

  it('closes with its button or Escape cancellation and returns focus to the opener', async () => {
    const user = userEvent.setup();
    renderListing('?compare=FTR15-3100,FTR15C-3100');
    await user.click(open());
    await user.click(screen.getByRole('button', { name: 'Close comparison' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(open()).toHaveFocus();
    await user.click(open());
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true, bubbles: true }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(open()).toHaveFocus();
  });

  it('does not expose USB comparison in other families', () => {
    renderListing('?compare=FTR15-3100,F4P', 'dimmers');
    expect(screen.queryByRole('region', { name: 'Model comparison' })).not.toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });
});
