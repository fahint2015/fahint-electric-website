import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import Contact from './Contact.jsx';
import ProductDetail from './ProductDetail.jsx';
import ApplicationDetail from './ApplicationDetail.jsx';
import Applications from './Applications.jsx';

function renderJourney(entry) {
  return render(<MemoryRouter initialEntries={[entry]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes>
      <Route path="/products/:line/:sku" element={<ProductDetail />} />
      {['residential', 'workplace', 'hospitality'].map(application =>
        <Route key={application} path={`/applications/${application}`} element={<ApplicationDetail application={application} />} />)}
      <Route path="/contact" element={<><Contact />
        <Link to="/contact?model=GF20">Select another GFCI</Link>
      </>} />
    </Routes>
  </MemoryRouter>);
}

const summary = () => screen.getByRole('group', { name: 'Selected product' });

describe('inquiry product continuity', () => {
  it('opens the form directly for a valid model while ordinary Contact stays at the page top', async () => {
    const scrollIntoView = vi.fn();
    const original = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = scrollIntoView;
    try {
      const plain = renderJourney('/contact');
      expect(scrollIntoView).not.toHaveBeenCalled();
      plain.unmount();
      renderJourney('/contact?model=GF15&finish=black');
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'instant', block: 'start' });
      await waitFor(() => expect(document.getElementById('inquiry')).toHaveFocus());
      expect(summary()).toHaveTextContent('GF15 · Finish: Black');
    } finally {
      if (original) Element.prototype.scrollIntoView = original;
      else delete Element.prototype.scrollIntoView;
    }
  });

  it('also locates the form when an application inquiry carries a known setting', () => {
    const scrollIntoView = vi.fn();
    const original = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = scrollIntoView;
    try {
      renderJourney('/contact?topic=technical&application=workplace');
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'instant', block: 'start' });
      expect(screen.getByRole('group', { name: 'Project setting' })).toHaveTextContent('Workplace');
    } finally {
      if (original) Element.prototype.scrollIntoView = original;
      else delete Element.prototype.scrollIntoView;
    }
  });

  it.each([
    ['residential', 'Residential'], ['workplace', 'Workplace'], ['hospitality', 'Hospitality']
  ])('carries the %s application into the technical inquiry and keeps it on topic changes', async (slug, name) => {
    const user = userEvent.setup();
    renderJourney(`/applications/${slug}`);
    expect(screen.getByRole('link', { name: 'Contact us' })).toHaveAttribute('href', `/contact/?topic=technical&application=${slug}`);
    await user.click(screen.getByRole('link', { name: 'Contact us' }));
    expect(screen.getByRole('group', { name: 'Project setting' })).toHaveTextContent(name);
    expect(screen.getByRole('link', { name: 'Product inquiry' })).toHaveAttribute('href', `/contact/?topic=products&application=${slug}`);
    await user.click(screen.getByRole('link', { name: 'Product inquiry' }));
    expect(screen.getByRole('group', { name: 'Project setting' })).toHaveTextContent(name);
  });

  it('uses a concrete applications title and ignores an unknown application query', () => {
    const page = render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Applications /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Wiring devices for homes, workplaces and hotels.');
    page.unmount();
    for (const value of ['unknown', 'toString']) {
      const contact = renderJourney(`/contact?application=${value}`);
      expect(screen.queryByRole('group', { name: 'Project setting' })).not.toBeInTheDocument();
      contact.unmount();
    }
  });

  it.each([
    ['gfci', 'gf15', 'GF15', 'GFCI Outlets'],
    ['usb-outlets', 'ftr15c-3100', 'FTR15C-3100', 'USB Outlets']
  ])('carries an explicit %s finish through the gallery, anchors, Contact and topics', async (line, slug, sku, category) => {
    const user = userEvent.setup();
    renderJourney(`/products/${line}/${slug}`);
    expect(screen.getByRole('link', {name:'Request a quote'})).toHaveAttribute('href', `/contact/?model=${sku}`);
    await user.click(screen.getByRole('button', { name: `Show ${sku} in Black` }));
    await user.click(screen.getByRole('tab', {name:'Download'}));
    expect(screen.getByRole('link', {name:'Request model-specific documents'})).toHaveAttribute('href', `/contact/?topic=technical&model=${sku}&finish=black`);
    await user.click(screen.getByRole('button', { name: `View ${sku} image 2` }));
    expect(screen.getByRole('link', {name:'Request a quote'})).toHaveAttribute('href', `/contact/?model=${sku}&finish=black`);
    expect(screen.getByRole('button', { name: `Show ${sku} in Black` })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('link', {name:'Request a quote'}));
    expect(summary()).toHaveTextContent(`${sku} · Finish: Black`);
    expect(screen.getByLabelText('Product category')).toHaveValue(category);
    expect(within(screen.getByRole('combobox')).getAllByRole('option')).toHaveLength(8);
    fireEvent.change(screen.getByLabelText('Company'), { target: { value: 'Northstar' } });
    await user.click(screen.getByRole('link', { name: 'Technical question' }));
    expect(summary()).toHaveTextContent(`${sku} · Finish: Black`);
    expect(screen.getByLabelText('Company')).toHaveValue('Northstar');
    expect(screen.getByRole('link', { name: 'OEM / ODM inquiry' })).toHaveAttribute('href', `/contact/?topic=oem&model=${sku}&finish=black`);
  });

  it.each(['clear', 'category'])('removes stale product context on %s without deleting the draft or selected category', async action => {
    const user = userEvent.setup();
    renderJourney('/contact?model=GF15&finish=black&topic=oem');
    fireEvent.change(screen.getByLabelText('Your name *'), { target: { value: 'Avery' } });
    fireEvent.change(screen.getByLabelText('Business email *'), { target: { value: 'buyer@example.com' } });
    fireEvent.change(screen.getByLabelText('Requirements *'), { target: { value: 'Please quote 500 pieces.' } });
    if (action === 'clear') await user.click(screen.getByRole('button', { name: 'Clear selected product' }));
    else await user.selectOptions(screen.getByLabelText('Product category'), 'USB Outlets');
    expect(screen.queryByRole('group', { name: 'Selected product' })).not.toBeInTheDocument();
    expect(screen.getByLabelText('Product category')).toHaveValue(action === 'clear' ? 'GFCI Outlets' : 'USB Outlets');
    expect(screen.getByLabelText('Product category')).toHaveFocus();
    await user.click(screen.getByRole('link', { name: 'Technical question' }));
    expect(screen.queryByRole('group', { name: 'Selected product' })).not.toBeInTheDocument();
    expect(screen.getByLabelText('Your name *')).toHaveValue('Avery');
    expect(screen.getByLabelText('Business email *')).toHaveValue('buyer@example.com');
    expect(screen.getByLabelText('Requirements *')).toHaveValue('Please quote 500 pieces.');
    expect(screen.getByRole('link', { name: 'Product inquiry' })).toHaveAttribute('href', '/contact/?topic=products');
  });

  it('resets the finish when the Contact model changes within a category', async () => {
    const user = userEvent.setup();
    renderJourney('/contact?model=GF15&finish=black');
    await user.click(screen.getByRole('link', { name: 'Select another GFCI' }));
    expect(summary()).toHaveTextContent('GF20 · Finish: Not specified');
  });

  it('keeps the product page concise and puts inquiry editing on Contact', async () => {
    const user = userEvent.setup();
    const {container} = renderJourney('/products/gfci/gf15');
    expect(container.querySelector('form')).toBeNull();
    await user.click(screen.getByRole('link', {name:'Request a quote'}));
    expect(summary()).toHaveTextContent('GF15 · Finish: Not specified');
    expect(screen.getByLabelText('Product category')).toBeInTheDocument();
  });

  it('does not restore a stale finish after navigating between related models', async () => {
    const user = userEvent.setup();
    renderJourney('/products/gfci/gf15');
    await user.click(screen.getByRole('button', { name: 'Show GF15 in Black' }));
    await user.click(screen.getByRole('link', { name: 'GF20 20A Self-Test GFCI Receptacle' }));
    expect(screen.getByRole('link', {name:'Request a quote'})).toHaveAttribute('href','/contact/?model=GF20');
    await user.click(screen.getByRole('link', { name: 'GF15 15A Self-Test GFCI Receptacle' }));
    expect(screen.getByRole('link', {name:'Request a quote'})).toHaveAttribute('href','/contact/?model=GF15');
  });

  it.each(['unknown', 'FLB20'])('does not expose unvalidated model %s', model => {
    renderJourney(`/contact?model=${model}&finish=black`);
    expect(screen.queryByRole('group', { name: 'Selected product' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Technical question' })).toHaveAttribute('href', '/contact/?topic=technical');
  });

  it('ignores invalid finishes and untrusted source URLs', () => {
    renderJourney('/contact?model=GF15&finish=gold&source=https://untrusted.example');
    expect(summary()).toHaveTextContent('GF15 · Finish: Not specified');
    expect(screen.getByRole('link', { name: 'Technical question' })).toHaveAttribute('href', '/contact/?topic=technical&model=GF15');
  });

  it.each([
    ['/products/gfci/gl20', 'GL20', 'Request model-specific documents'],
    ['/products/usb-outlets/ftr15c-3100', 'FTR15C-3100', 'Request model-specific documents'],
    ['/products/receptacles/r15', 'R15', 'Request model-specific documents']
  ])('keeps the selected finish on technical document links for %s', async (path, model, label) => {
    const user = userEvent.setup();
    renderJourney(path);
    await user.click(screen.getByRole('button', { name: `Show ${model} in Black` }));
    await user.click(screen.getByRole('tab', {name:'Download'}));
    expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', `/contact/?topic=technical&model=${model}&finish=black`);
  });
});
