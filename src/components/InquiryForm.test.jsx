import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import InquiryForm, { buildInquiryText, buildMailtoUrl, validateInquiry } from './InquiryForm.jsx';
import { productLines } from '../data/lines.js';

const validForm = {
  name: 'Avery Chen',
  email: 'avery@example.com',
  company: 'Northstar',
  country: 'Canada',
  model: 'GF15',
  quantity: '5,000 pcs',
  message: 'Please quote private-label packaging.'
};

async function completeRequiredFields(user) {
  await user.type(screen.getByLabelText('Your name *'), validForm.name);
  await user.type(screen.getByLabelText('Business email *'), validForm.email);
  await user.type(screen.getByLabelText('Requirements *'), validForm.message);
}

describe('InquiryForm helpers', () => {
  it.each(['USB Outlets', ''])('labels category inquiries correctly, including an optional empty selection: %s', (category) => {
    const { model, ...details } = validForm;
    const inquiry = { ...details, category };
    const expected = `Product category: ${category || 'Not specified'}`;
    const body = new URLSearchParams(buildMailtoUrl(inquiry).split('?')[1]).get('body');
    expect(body).toContain(expected);
    expect(body).not.toContain('Model of interest:');
    expect(buildInquiryText(inquiry)).toContain(expected);
    expect(buildInquiryText(inquiry)).not.toContain('Model of interest:');
  });

  it('preserves category and model together with finish, topic and source in both outputs', () => {
    const inquiry = { ...validForm, category: 'GFCI Outlets', finish: 'Black',
      topic: 'Technical question', source: '/products/gfci/gf15' };
    const body = new URLSearchParams(buildMailtoUrl(inquiry).split('?')[1]).get('body');
    expect(body).toContain('Product category: GFCI Outlets');
    expect(body).toContain('Model of interest: GF15');
    expect(body).toContain('Finish: Black');
    expect(body).toContain('Inquiry type: Technical question');
    expect(body).toContain('Product page: /products/gfci/gf15');
    expect(buildInquiryText(inquiry)).toBe(`To: louis@fahint.com\n\n${body}`);
  });

  it('returns the exact errors for trimmed required fields and an invalid email', () => {
    expect(
      validateInquiry({
        ...validForm,
        name: '   ',
        email: 'not-an-email',
        message: '\n  '
      })
    ).toEqual({
      name: 'Enter your name.',
      email: 'Enter a valid business email.',
      message: 'Describe the product or project you need.'
    });

    expect(validateInquiry({ ...validForm, name: ' Avery ', email: ' a@b.co ', message: ' Need samples ' })).toEqual({});
  });

  it('builds an encoded mailto containing all fields and preserves special characters and newlines', () => {
    const url = buildMailtoUrl({
      ...validForm,
      name: 'Ana & Luis',
      email: 'buyers+gfci@example.com',
      company: 'A&B / Lighting',
      country: 'México',
      model: '',
      quantity: '',
      message: 'Need white & black.\nShip to México?'
    });
    const [address, query = ''] = url.split('?');
    const params = new URLSearchParams(query);

    expect(address).toBe('mailto:louis@fahint.com');
    expect(params.get('subject')).toBe('Product inquiry from A&B / Lighting');
    expect(params.get('body')).toBe(
      'Name: Ana & Luis\n' +
        'Email: buyers+gfci@example.com\n' +
        'Company: A&B / Lighting\n' +
        'Country: México\n' +
        'Model of interest: Not specified\n' +
        'Estimated quantity: Not specified\n\n' +
        'Requirements:\n' +
        'Need white & black.\nShip to México?'
    );
  });

  it('builds reusable plain-text inquiry details with the destination email', () => {
    expect(buildInquiryText(validForm)).toBe(
      'To: louis@fahint.com\n\n' +
        'Name: Avery Chen\n' +
        'Email: avery@example.com\n' +
        'Company: Northstar\n' +
        'Country: Canada\n' +
        'Model of interest: GF15\n' +
        'Estimated quantity: 5,000 pcs\n\n' +
        'Requirements:\n' +
        'Please quote private-label packaging.'
    );
  });
});

describe('InquiryForm', () => {
  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', (callback) => setTimeout(callback, 0));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('preselects the requested product model', () => {
    render(<InquiryForm defaultModel="GF15" />);

    expect(screen.getByLabelText('Model of interest')).toHaveValue('GF15');
  });

  it.each([
    ['GF15', 'GFCI Outlets', '/products/gfci/gf15'],
    ['FTR15C-3100', 'USB Outlets', '/products/usb-outlets/ftr15c-3100']
  ])('composes and copies the same selected %s brief from a category form', async (model, category, source) => {
    const user = userEvent.setup();
    const delivery = vi.fn();
    const clipboardWriter = vi.fn();
    const productContext = { model, category, finish: 'Black', finishSlug: 'black', source };
    render(<InquiryForm defaultCategory={category} categoryOptions={productLines}
      productContext={productContext} topic="OEM / ODM inquiry"
      delivery={delivery} clipboardWriter={clipboardWriter} />);
    expect(screen.getByRole('group', { name: 'Selected product' })).toHaveTextContent(`${model} · Finish: Black`);
    await completeRequiredFields(user);
    await user.click(screen.getByRole('button', { name: 'Open email app' }));
    const body = new URLSearchParams(delivery.mock.calls[0][0].split('?')[1]).get('body');
    expect(body).toContain(`Product category: ${category}\nModel of interest: ${model}\nFinish: Black`);
    expect(body).toContain('Inquiry type: OEM / ODM inquiry');
    expect(body).toContain(`Product page: ${source}`);
    await user.click(await screen.findByRole('button', { name: 'Copy inquiry details' }));
    expect(clipboardWriter).toHaveBeenCalledWith(`To: louis@fahint.com\n\n${body}`);
  });

  it('includes the selected category in the email and copy recovery without a model field', async () => {
    const user = userEvent.setup();
    const delivery = vi.fn();
    const clipboardWriter = vi.fn();
    render(<InquiryForm categoryOptions={productLines} delivery={delivery} clipboardWriter={clipboardWriter} />);
    await completeRequiredFields(user);
    await user.selectOptions(screen.getByRole('combobox'), 'USB Outlets');
    await user.click(screen.getByRole('button', { name: 'Open email app' }));
    const body = new URLSearchParams(delivery.mock.calls[0][0].split('?')[1]).get('body');
    expect(body).toContain('Product category: USB Outlets');
    expect(body).not.toContain('Model of interest:');
    await user.click(await screen.findByRole('button', { name: 'Copy inquiry details' }));
    expect(clipboardWriter.mock.calls[0][0]).toContain('Product category: USB Outlets');
    expect(clipboardWriter.mock.calls[0][0]).not.toContain('Model of interest:');
  });

  it('sends the selected category instead of a model to a configured inquiry service', async () => {
    const request = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    render(<InquiryForm categoryOptions={productLines} endpoint="https://forms.example.com/inquiry" request={request} />);
    fireEvent.change(screen.getByLabelText('Your name *'), { target: { value: validForm.name } });
    fireEvent.change(screen.getByLabelText('Business email *'), { target: { value: validForm.email } });
    fireEvent.change(screen.getByLabelText('Requirements *'), { target: { value: validForm.message } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Wallplates' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Send inquiry' }).closest('form'));
    expect(request).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(request.mock.calls[0][1].body);
    expect(payload).toMatchObject({ category: 'Wallplates', name: validForm.name, message: validForm.message });
    expect(payload).not.toHaveProperty('model');
    expect(await screen.findByRole('status')).toHaveTextContent('Your inquiry has been received.');
  });

  it('updates the model when defaultModel changes without clearing other fields', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<InquiryForm defaultModel="GF15" />);

    await user.type(screen.getByLabelText('Your name *'), 'Avery Chen');
    await user.type(screen.getByLabelText('Company'), 'Northstar');
    rerender(<InquiryForm defaultModel="GT20" />);

    expect(screen.getByLabelText('Model of interest')).toHaveValue('GT20');
    expect(screen.getByLabelText('Your name *')).toHaveValue('Avery Chen');
    expect(screen.getByLabelText('Company')).toHaveValue('Northstar');
  });

  it('clears validation feedback when defaultModel changes', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<InquiryForm defaultModel="GF15" delivery={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'Open email app' }));
    expect(screen.getByText('Please correct the highlighted fields.')).toHaveAttribute('role', 'alert');

    rerender(<InquiryForm defaultModel="GT20" delivery={vi.fn()} />);

    expect(screen.getByLabelText('Model of interest')).toHaveValue('GT20');
    expect(screen.queryByText('Please correct the highlighted fields.')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Your name *')).not.toHaveAttribute('aria-invalid');
  });

  it('clears handoff and copy feedback when defaultModel changes', async () => {
    const delivery = vi.fn();
    const clipboardWriter = vi.fn();
    const { rerender } = render(
      <InquiryForm defaultModel="GF15" delivery={delivery} clipboardWriter={clipboardWriter} />
    );
    fireEvent.change(screen.getByLabelText('Your name *'), { target: { value: validForm.name } });
    fireEvent.change(screen.getByLabelText('Business email *'), { target: { value: validForm.email } });
    fireEvent.change(screen.getByLabelText('Requirements *'), { target: { value: validForm.message } });
    fireEvent.submit(screen.getByRole('button', { name: 'Open email app' }).closest('form'));
    expect(await screen.findByText('Your email app should now be open with the inquiry pre-filled.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Copy inquiry details' }));
    expect(await screen.findByText('Inquiry details copied.')).toBeInTheDocument();

    rerender(<InquiryForm defaultModel="GT20" delivery={delivery} clipboardWriter={clipboardWriter} />);

    expect(screen.queryByText('Your email app should now be open with the inquiry pre-filled.')).not.toBeInTheDocument();
    expect(screen.queryByText('Inquiry details copied.')).not.toBeInTheDocument();
  });

  it('validates explicitly, announces errors, connects field errors, and focuses the first invalid field', async () => {
    const user = userEvent.setup();
    render(<InquiryForm delivery={vi.fn()} />);

    const form = screen.getByRole('button', { name: 'Open email app' }).closest('form');
    expect(form).toHaveAttribute('novalidate');

    await user.click(screen.getByRole('button', { name: 'Open email app' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Please correct the highlighted fields.');
    const name = screen.getByLabelText('Your name *');
    const email = screen.getByLabelText('Business email *');
    const message = screen.getByLabelText('Requirements *');
    await waitFor(() => expect(name).toHaveFocus());
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(message).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Enter your name.')).toHaveAttribute('id', name.getAttribute('aria-describedby'));
    expect(screen.getByText('Enter a valid business email.')).toHaveAttribute('id', email.getAttribute('aria-describedby'));
    expect(screen.getByText('Describe the product or project you need.')).toHaveAttribute(
      'id',
      message.getAttribute('aria-describedby')
    );

    await user.type(name, 'Avery');
    expect(name).not.toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByText('Enter your name.')).not.toBeInTheDocument();
  });

  it('delivers a valid mailto once while pending and announces the successful handoff', async () => {
    let finishDelivery;
    const delivery = vi.fn(
      () =>
        new Promise((resolve) => {
          finishDelivery = resolve;
        })
    );
    const user = userEvent.setup();
    render(<InquiryForm delivery={delivery} />);
    await completeRequiredFields(user);

    const button = screen.getByRole('button', { name: 'Open email app' });
    const form = button.closest('form');
    await user.click(button);

    expect(delivery).toHaveBeenCalledTimes(1);
    expect(delivery.mock.calls[0][0]).toMatch(/^mailto:louis@fahint\.com\?/);
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Opening email app…');
    fireEvent.submit(form);
    expect(delivery).toHaveBeenCalledTimes(1);

    finishDelivery();
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Your email app should now be open with the inquiry pre-filled.'
    );
  });

  it('keeps a synchronous mail handoff locked against rapid duplicate submits, then unlocks', async () => {
    vi.useFakeTimers();
    const delivery = vi.fn();

    try {
      render(<InquiryForm delivery={delivery} />);
      fireEvent.change(screen.getByLabelText('Your name *'), { target: { value: validForm.name } });
      fireEvent.change(screen.getByLabelText('Business email *'), { target: { value: validForm.email } });
      fireEvent.change(screen.getByLabelText('Requirements *'), { target: { value: validForm.message } });

      const button = screen.getByRole('button', { name: /Open email app|Opening email app/ });
      const form = button.closest('form');
      fireEvent.submit(form);
      await act(async () => {});
      fireEvent.submit(form);

      expect(delivery).toHaveBeenCalledTimes(1);
      expect(button).toBeDisabled();

      await act(async () => {
        vi.advanceTimersByTime(2_000);
      });
      expect(button).toBeEnabled();
    } finally {
      vi.useRealTimers();
    }
  });

  it('offers an independent copy recovery after a normal mail handoff', async () => {
    const delivery = vi.fn();
    const clipboardWriter = vi.fn();
    const user = userEvent.setup();
    render(<InquiryForm delivery={delivery} clipboardWriter={clipboardWriter} />);
    await completeRequiredFields(user);

    await user.click(screen.getByRole('button', { name: 'Open email app' }));

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Your email app should now be open with the inquiry pre-filled.'
    );
    expect(screen.getByText(/If it did not open, copy the inquiry details and send them to/)).toHaveTextContent(
      'louis@fahint.com'
    );
    expect(screen.getByText('louis@fahint.com', { selector: 'strong' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Copy inquiry details' }));

    expect(clipboardWriter).toHaveBeenCalledTimes(1);
    expect(clipboardWriter).toHaveBeenCalledWith(
      expect.stringContaining('To: louis@fahint.com\n\nName: Avery Chen')
    );
    expect(await screen.findByText('Inquiry details copied.')).toHaveAttribute('role', 'status');
  });

  it('uses copy recovery instead of opening an excessively long mailto URL', async () => {
    const delivery = vi.fn();
    render(<InquiryForm delivery={delivery} clipboardWriter={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('Your name *'), { target: { value: validForm.name } });
    fireEvent.change(screen.getByLabelText('Business email *'), { target: { value: validForm.email } });
    fireEvent.change(screen.getByLabelText('Requirements *'), { target: { value: 'x'.repeat(2_000) } });

    fireEvent.submit(screen.getByRole('button', { name: 'Open email app' }).closest('form'));

    expect(delivery).not.toHaveBeenCalled();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'This inquiry is too long to open reliably in an email app.'
    );
    expect(screen.getByRole('button', { name: 'Copy inquiry details' })).toBeEnabled();
    expect(screen.queryByText('Your email app should now be open with the inquiry pre-filled.')).not.toBeInTheDocument();
  });

  it('shows a direct email fallback after failure and allows a retry', async () => {
    const delivery = vi.fn().mockRejectedValueOnce(new Error('blocked')).mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    render(<InquiryForm delivery={delivery} />);
    await completeRequiredFields(user);

    await user.click(screen.getByRole('button', { name: 'Open email app' }));

    const failure = await screen.findByRole('alert');
    expect(failure).toHaveTextContent('We could not open your email app.');
    expect(failure).toHaveTextContent(/try again\./i);
    expect(screen.getByRole('link', { name: 'Email us directly' })).toHaveAttribute('href', 'mailto:louis@fahint.com');
    expect(screen.getByRole('button', { name: 'Copy inquiry details' })).toBeEnabled();

    const retryButton = await screen.findByRole('button', { name: 'Open email app' }, { timeout: 2_000 });
    await user.click(retryButton);

    await waitFor(() => expect(delivery).toHaveBeenCalledTimes(2));
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Your email app should now be open with the inquiry pre-filled.'
    );
  });

  it('provides useful autocomplete attributes', () => {
    render(<InquiryForm />);

    expect(screen.getByLabelText('Your name *')).toHaveAttribute('autocomplete', 'name');
    expect(screen.getByLabelText('Business email *')).toHaveAttribute('autocomplete', 'email');
    expect(screen.getByLabelText('Company')).toHaveAttribute('autocomplete', 'organization');
    expect(screen.getByLabelText('Country / region')).toHaveAttribute('autocomplete', 'country-name');
  });

  it('uses unique control and error ids across multiple forms and disables email spellcheck', async () => {
    render(
      <>
        <InquiryForm title="First inquiry" />
        <InquiryForm title="Second inquiry" />
      </>
    );
    const names = screen.getAllByLabelText('Your name *');
    const emails = screen.getAllByLabelText('Business email *');

    expect(names[0].id).not.toBe(names[1].id);
    expect(emails[0].id).not.toBe(emails[1].id);
    expect(emails[0]).toHaveAttribute('spellcheck', 'false');
    expect(emails[1]).toHaveAttribute('spellcheck', 'false');

    screen.getAllByRole('button', { name: 'Open email app' }).forEach((button) => fireEvent.submit(button.closest('form')));
    await waitFor(() => expect(names[0]).toHaveAttribute('aria-describedby'));
    expect(names[0].getAttribute('aria-describedby')).not.toBe(names[1].getAttribute('aria-describedby'));
    expect(document.getElementById(names[0].getAttribute('aria-describedby'))).toHaveTextContent('Enter your name.');
    expect(document.getElementById(names[1].getAttribute('aria-describedby'))).toHaveTextContent('Enter your name.');
  });

  it('explains that the customer still sends the composed email', () => {
    render(<InquiryForm />);

    expect(screen.getByText(/You can review and send the message from there\./)).toBeInTheDocument();
  });

  it('sends to a configured HTTPS service only after validation and confirms its receipt', async () => {
    const request = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    const delivery = vi.fn();
    render(<InquiryForm endpoint="https://forms.example.com/inquiry" request={request} delivery={delivery} />);
    const button = screen.getByRole('button', { name: 'Send inquiry' });
    fireEvent.submit(button.closest('form'));
    expect(request).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText('Your name *'), { target: { value: ' Avery Chen ' } });
    fireEvent.change(screen.getByLabelText('Business email *'), { target: { value: validForm.email } });
    fireEvent.change(screen.getByLabelText('Requirements *'), { target: { value: 'x'.repeat(2000) } });
    fireEvent.submit(button.closest('form'));
    fireEvent.submit(button.closest('form'));
    expect(request).toHaveBeenCalledTimes(1);
    const [url, options] = request.mock.calls[0];
    expect(url).toBe('https://forms.example.com/inquiry');
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toMatchObject({ name: 'Avery Chen', email: validForm.email, message: 'x'.repeat(2000) });
    expect(await screen.findByRole('status')).toHaveTextContent('Your inquiry has been received.');
    expect(delivery).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Your name *')).toHaveValue(' Avery Chen ');
  });

  it.each([
    ['server failure', { ok: false, json: async () => ({ error: 'unavailable' }) }],
    ['unconfirmed response', { ok: true, json: async () => ({}) }],
    ['HTML fallback', { ok: true, json: async () => { throw new Error('not JSON'); } }]
  ])('keeps the message and offers recovery after %s', async (_, response) => {
    const request = vi.fn().mockResolvedValue(response);
    render(<InquiryForm endpoint="https://forms.example.com/inquiry" request={request} />);
    fireEvent.change(screen.getByLabelText('Your name *'), { target: { value: validForm.name } });
    fireEvent.change(screen.getByLabelText('Business email *'), { target: { value: validForm.email } });
    fireEvent.change(screen.getByLabelText('Requirements *'), { target: { value: validForm.message } });
    fireEvent.submit(screen.getByRole('button', { name: 'Send inquiry' }).closest('form'));
    expect(await screen.findByRole('alert')).toHaveTextContent('We could not confirm delivery.');
    expect(screen.getByRole('button', { name: 'Copy inquiry details' })).toBeEnabled();
    expect(screen.getByLabelText('Requirements *')).toHaveValue(validForm.message);
    expect(screen.queryByText('Your inquiry has been received.')).not.toBeInTheDocument();
  });

  it('does not expose buyer information to an insecure or malformed service URL', () => {
    const request = vi.fn();
    const { rerender } = render(<InquiryForm endpoint="http://forms.example.com/inquiry" request={request} />);
    expect(screen.getByRole('button', { name: 'Open email app' })).toBeEnabled();
    rerender(<InquiryForm endpoint="not-a-url" request={request} />);
    expect(screen.getByRole('button', { name: 'Open email app' })).toBeEnabled();
    expect(request).not.toHaveBeenCalled();
  });

  it('times out a stalled request, preserves the form and enables retry', async () => {
    vi.useFakeTimers();
    const request = vi.fn((_, { signal }) => new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true });
    }));
    try {
      render(<InquiryForm endpoint="https://forms.example.com/inquiry" request={request} />);
      fireEvent.change(screen.getByLabelText('Your name *'), { target: { value: validForm.name } });
      fireEvent.change(screen.getByLabelText('Business email *'), { target: { value: validForm.email } });
      fireEvent.change(screen.getByLabelText('Requirements *'), { target: { value: validForm.message } });
      fireEvent.submit(screen.getByRole('button', { name: 'Send inquiry' }).closest('form'));
      expect(screen.getByRole('button', { name: 'Sending inquiry…' })).toBeDisabled();
      await act(async () => vi.advanceTimersByTime(12_000));
      expect(request.mock.calls[0][1].signal.aborted).toBe(true);
      expect(screen.getByRole('alert')).toHaveTextContent('We could not confirm delivery.');
      expect(screen.getByRole('button', { name: 'Send inquiry' })).toBeEnabled();
      expect(screen.getByLabelText('Requirements *')).toHaveValue(validForm.message);
    } finally { vi.useRealTimers(); }
  });

  it('aborts the request when the form is unmounted', async () => {
    const request = vi.fn((_, { signal }) => new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true });
    }));
    const { unmount } = render(<InquiryForm endpoint="https://forms.example.com/inquiry" request={request} />);
    fireEvent.change(screen.getByLabelText('Your name *'), { target: { value: validForm.name } });
    fireEvent.change(screen.getByLabelText('Business email *'), { target: { value: validForm.email } });
    fireEvent.change(screen.getByLabelText('Requirements *'), { target: { value: validForm.message } });
    fireEvent.submit(screen.getByRole('button', { name: 'Send inquiry' }).closest('form'));
    unmount();
    await act(async () => {});
    expect(request.mock.calls[0][1].signal.aborted).toBe(true);
  });

  it.each(['Requirements *', 'Model of interest'])('does not confirm an unsent draft after editing %s during submission', async (label) => {
    let resolveRequest;
    const request = vi.fn(() => new Promise((resolve) => { resolveRequest = resolve; }));
    render(<InquiryForm endpoint="https://forms.example.com/inquiry" request={request} />);
    fireEvent.change(screen.getByLabelText('Your name *'), { target: { value: validForm.name } });
    fireEvent.change(screen.getByLabelText('Business email *'), { target: { value: validForm.email } });
    fireEvent.change(screen.getByLabelText('Requirements *'), { target: { value: validForm.message } });
    fireEvent.submit(screen.getByRole('button', { name: 'Send inquiry' }).closest('form'));
    const changedValue = label === 'Requirements *' ? 'Different, unsent requirements' : 'GT20';
    fireEvent.change(screen.getByLabelText(label), { target: { value: changedValue } });
    await act(async () => resolveRequest({ ok: true, json: async () => ({ ok: true }) }));
    expect(JSON.parse(request.mock.calls[0][1].body).message).toBe(validForm.message);
    expect(screen.getByLabelText(label)).toHaveValue(changedValue);
    expect(screen.queryByText(/Your inquiry has been received/)).not.toBeInTheDocument();
  });

  it('does not show a stale clipboard confirmation after the draft changes', async () => {
    let finishCopy;
    const clipboardWriter = vi.fn(() => new Promise((resolve) => { finishCopy = resolve; }));
    render(<InquiryForm delivery={vi.fn()} clipboardWriter={clipboardWriter} />);
    fireEvent.change(screen.getByLabelText('Your name *'), { target: { value: validForm.name } });
    fireEvent.change(screen.getByLabelText('Business email *'), { target: { value: validForm.email } });
    fireEvent.change(screen.getByLabelText('Requirements *'), { target: { value: validForm.message } });
    fireEvent.submit(screen.getByRole('button', { name: 'Open email app' }).closest('form'));
    await screen.findByRole('button', { name: 'Copy inquiry details' });
    fireEvent.click(screen.getByRole('button', { name: 'Copy inquiry details' }));
    fireEvent.change(screen.getByLabelText('Requirements *'), { target: { value: 'New unsent draft' } });
    await act(async () => finishCopy());
    expect(clipboardWriter).toHaveBeenCalledWith(expect.stringContaining(validForm.message));
    expect(screen.queryByText('Inquiry details copied.')).not.toBeInTheDocument();
  });

  it.each(['finish', 'topic'])('does not confirm an old submission after changing the %s', async field => {
    let resolveRequest;
    const request = vi.fn(() => new Promise(resolve => { resolveRequest = resolve; }));
    const context = { model: 'GF15', category: 'GFCI Outlets', finish: 'Black',
      finishSlug: 'black', source: '/products/gfci/gf15' };
    const props = { defaultCategory: 'GFCI Outlets', categoryOptions: productLines,
      productContext: context, topic: 'Product inquiry', endpoint: 'https://forms.example.com/inquiry', request };
    const { rerender } = render(<InquiryForm {...props} />);
    fireEvent.change(screen.getByLabelText('Your name *'), { target: { value: validForm.name } });
    fireEvent.change(screen.getByLabelText('Business email *'), { target: { value: validForm.email } });
    fireEvent.change(screen.getByLabelText('Requirements *'), { target: { value: validForm.message } });
    fireEvent.submit(screen.getByRole('button', { name: 'Send inquiry' }).closest('form'));
    rerender(<InquiryForm {...props} {...(field === 'finish'
      ? { productContext: { ...context, finish: 'White', finishSlug: 'white' } }
      : { topic: 'Technical question' })} />);
    await act(async () => resolveRequest({ ok: true, json: async () => ({ ok: true }) }));
    expect(JSON.parse(request.mock.calls[0][1].body)).toMatchObject({ finish: 'Black', topic: 'Product inquiry' });
    expect(screen.queryByText(/Your inquiry has been received/)).not.toBeInTheDocument();
  });
});
