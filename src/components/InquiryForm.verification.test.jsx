import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import InquiryForm from './InquiryForm.jsx';
import { MemoryRouter } from 'react-router-dom';
import { productLines } from '../data/lines.js';
import { trackEvent } from '../utils/analytics.js';

vi.mock('../utils/analytics.js', () => ({ trackEvent: vi.fn() }));

let widgets;
let turnstile;
beforeEach(() => {
  trackEvent.mockClear();
  widgets = [];
  turnstile = {
    render: vi.fn((element, options) => { widgets.push(options); return `widget-${widgets.length}`; }),
    remove: vi.fn()
  };
  window.turnstile = turnstile;
});
afterEach(() => { delete window.turnstile; vi.useRealTimers(); });

function fillInquiry() {
  for (const [label, value] of [
    ['Your name *', 'Avery Chen'], ['Business email *', 'avery@example.com'], ['Requirements *', 'Please quote 1200 units.']
  ]) fireEvent.change(screen.getByLabelText(label), { target: { value } });
}
const submit = () => fireEvent.submit(screen.getByRole('button', { name: 'Send inquiry' }).closest('form'));
const endpoint = 'https://fahint.com/api/inquiry';

describe('Verified inquiry submission', () => {
  it.each([
    ['GF15', 'GF20', 'GFCI Outlets'],
    ['R15', 'R15Q', 'Standard Receptacles'],
    ['FTR15-3100', 'FTR15C-3100', 'USB Outlets']
  ])('posts both %s and %s with verified, itemized quantities and finishes', async (first, second, category) => {
    vi.useFakeTimers();
    const request = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><InquiryForm endpoint={endpoint} turnstileSiteKey="public-site-key" request={request}
      categoryOptions={productLines} defaultCategory={category} inquiryItems={[
        { model: first, quantity: '500', finishSlug: 'black' },
        { model: second, quantity: '100', finishSlug: 'white' }
      ]} onItemsChange={vi.fn()} /></MemoryRouter>);
    await act(async () => {});
    fillInquiry();
    act(() => widgets[0].callback('verified-list-token'));
    submit();
    await act(async () => vi.advanceTimersByTimeAsync(1500));
    expect(request).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(request.mock.calls[0][1].body);
    expect(payload.category).toBe(category);
    expect(payload.items.map(item => item.model)).toEqual([first, second]);
    expect(payload.items[0]).toMatchObject({ quantity: '500', finish: 'Black', finishSlug: 'black' });
    expect(payload.items[1]).toMatchObject({ quantity: '100', finish: 'White', finishSlug: 'white' });
    expect(payload).toMatchObject({ turnstileToken: 'verified-list-token', requestId: expect.any(String) });
    expect(payload).not.toHaveProperty('model');
  });

  it('counts a confirmed inquiry once when the same request is resubmitted', async () => {
    vi.useFakeTimers();
    const request = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    render(<InquiryForm endpoint={endpoint} turnstileSiteKey="public-site-key" request={request} />);
    await act(async () => {});
    fillInquiry();
    for (let attempt = 0; attempt < 2; attempt += 1) {
      act(() => widgets[attempt].callback(`token-${attempt}`));
      submit();
      await act(async () => vi.advanceTimersByTimeAsync(1500));
    }
    expect(trackEvent.mock.calls).toEqual([['generate_lead']]);
    fireEvent.change(screen.getByLabelText('Requirements *'), { target: { value: 'A separate order for 2400 units.' } });
    act(() => widgets[2].callback('new-inquiry-token'));
    submit();
    await act(async () => vi.advanceTimersByTimeAsync(1500));
    expect(trackEvent.mock.calls).toEqual([['generate_lead'], ['generate_lead']]);
  });

  it('requires human verification before posting valid buyer data', async () => {
    const request = vi.fn();
    render(<InquiryForm endpoint={endpoint} turnstileSiteKey="public-site-key" request={request} />);
    fillInquiry();
    submit();
    expect(request).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Please complete the verification');
    await waitFor(() => expect(turnstile.render).toHaveBeenCalledOnce());
    expect(widgets[0]).toMatchObject({ sitekey: 'public-site-key', action: 'inquiry' });
  });

  it('refreshes the single-use token after a failure and reuses the request ID on retry', async () => {
    vi.useFakeTimers();
    const request = vi.fn().mockResolvedValue({ ok: false, json: async () => ({ ok: false }) });
    render(<InquiryForm endpoint={endpoint} turnstileSiteKey="public-site-key" request={request} />);
    await act(async () => {});
    fillInquiry();
    expect(widgets).toHaveLength(1);
    act(() => widgets[0].callback('first-token'));
    submit();
    await act(async () => vi.advanceTimersByTimeAsync(1500));
    const first = JSON.parse(request.mock.calls[0][1].body);
    expect(first.turnstileToken).toBe('first-token');
    expect(first.requestId).toMatch(/^[a-f0-9-]{36}$/);
    expect(widgets).toHaveLength(2);
    submit();
    expect(request).toHaveBeenCalledOnce();
    act(() => widgets[1].callback('retry-token'));
    submit();
    await act(async () => vi.advanceTimersByTimeAsync(1500));
    const retry = JSON.parse(request.mock.calls[1][1].body);
    expect(retry.requestId).toBe(first.requestId);
    expect(retry.turnstileToken).toBe('retry-token');
    expect(turnstile.remove).toHaveBeenCalledWith('widget-1');
    fireEvent.change(screen.getByLabelText('Requirements *'), { target: { value: 'Please quote 2400 units instead.' } });
    act(() => widgets[2].callback('edited-token'));
    submit();
    await act(async () => vi.advanceTimersByTimeAsync(1500));
    expect(JSON.parse(request.mock.calls[2][1].body).requestId).not.toBe(first.requestId);
  });

  it('clears expired verification and lets the visitor retry an unavailable widget', async () => {
    const request = vi.fn();
    const { unmount } = render(<InquiryForm endpoint={endpoint} turnstileSiteKey="public-site-key" request={request} />);
    await waitFor(() => expect(widgets).toHaveLength(1));
    fillInquiry();
    act(() => { widgets[0].callback('token'); widgets[0]['expired-callback'](); });
    submit();
    expect(request).not.toHaveBeenCalled();
    act(() => widgets[0]['error-callback']());
    expect(screen.getByText(/Verification is unavailable/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Retry verification' }));
    await waitFor(() => expect(widgets).toHaveLength(2));
    unmount();
    expect(turnstile.remove).toHaveBeenCalledWith('widget-2');
    act(() => widgets[1].callback('late-token'));
    expect(request).not.toHaveBeenCalled();
  });

  it('offers recovery when the verification script cannot load', async () => {
    delete window.turnstile;
    render(<InquiryForm endpoint={endpoint} turnstileSiteKey="public-site-key" />);
    const script = await waitFor(() => {
      const element = document.querySelector('script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]');
      expect(element).not.toBeNull();
      return element;
    });
    fireEvent.error(script);
    expect(await screen.findByText(/Verification is unavailable/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry verification' })).toBeEnabled();
  });
});
