# Inquiry Product Context Implementation Plan

> **For agentic workers:** Use the executing-plans skill to implement this plan inline, task by task. The approved design explicitly keeps this work with the main agent in the current project; do not create subagents or another checkout. Steps use checkbox syntax for tracking.

**Goal:** Preserve an explicitly selected product and finish through product-page inquiries, Contact, composed email and copy recovery.

**Architecture:** Validate product context against the existing published catalog. Lift inquiry selection to each product page while leaving image browsing local to the hero. Keep category and model as distinct form fields, with Contact query parameters carrying only validated model, finish and inquiry topic. Reuse all current delivery, validation and draft safeguards.

**Tech Stack:** React 18, React Router 6, existing CSS variables, Vitest and Testing Library.

---

## Scope and baseline

- Current branch: `codex/prelaunch-buyer-tools`; no remote operations.
- Leave unrelated untracked files untouched.
- Leave email-service and domain configuration untouched.
- Baseline: four relevant suites pass, 400 tests.
- Approved design: `docs/superpowers/specs/2026-10-02-prelaunch-buyer-tools-design.md`.

## File responsibilities

- Create `src/utils/inquiryContext.js`: catalog-backed resolution and Contact URL construction only.
- Create `src/utils/inquiryContext.test.js`: public/draft/invalid product and finish boundaries.
- Modify `src/components/InquiryForm.jsx`: separate category/model, context summary, consistent serialized fields and feedback invalidation.
- Modify `src/components/InquiryForm.test.jsx`: context serialization and copy regression coverage.
- Modify `src/components/products/ProductDetailHero.jsx`: report selected finish independently of gallery view.
- Modify `src/pages/ProductDetail.jsx` and `src/pages/CatalogProductDetail.jsx`: lift model/finish selection and wire form/full-Contact link.
- Modify `src/pages/Contact.jsx`: validated query context, topic preservation and clearing product context.
- Create `src/pages/InquiryContext.test.jsx`: real-page integration coverage without mocking page components.
- Create `src/components/inquiry-context.css`: compact, wrapping summary using existing color/radius tokens; import from the form.

### Task 1: Catalog-backed context

- [x] Add and run a failing test for validated fields:

```js
expect(resolveInquiryContext('gf15', 'black')).toMatchObject({
  model: 'GF15', category: 'GFCI Outlets', finish: 'Black',
  finishSlug: 'black', source: '/products/gfci/gf15'
});
expect(resolveInquiryContext('unknown', 'white')).toBeNull();
expect(resolveInquiryContext('GF15', 'invalid').finish).toBe('Not specified');
```

Run: `npm test -- src/utils/inquiryContext.test.js`. Expect missing utility/behavior failure before implementation.

- [x] Implement resolution and URL construction with these contracts:

```js
export function resolveInquiryContext(model, finishSlug = '') {
  const product = findProduct(model) || catalogProducts.find(candidate =>
    !candidate.draft && modelKey(candidate.sku) === modelKey(model));
  if (!product || product.draft) return null;
  const finish = (product.finishes ?? colors).find(item => item.slug === finishSlug);
  return {
    model: product.sku,
    category: findLine(product.line || 'gfci').name,
    finish: finish?.name || 'Not specified',
    finishSlug: finish?.slug || '',
    source: product.line ? productHref(product) : `/products/gfci/${product.sku.toLowerCase()}`
  };
}

export function inquiryContactHref(context, topic) {
  const params = new URLSearchParams();
  if (['products', 'oem', 'technical'].includes(topic)) params.set('topic', topic);
  if (context) {
    params.set('model', context.model);
    if (context.finishSlug) params.set('finish', context.finishSlug);
  }
  return `/contact${params.size ? `?${params}` : ''}`;
}
```

- [x] Rerun the utility suite; all tests pass, including draft rejection and encoded URL fields.

### Task 2: Form context and output

- [x] Add failing serialization tests for simultaneous category/model/finish/topic/source and identical email/copy bodies. Category-only fixtures must omit model, instead of expecting the old category-overwrites-model bug.

```js
const inquiry = { ...validForm, category: 'GFCI Outlets', finish: 'Black',
  topic: 'Technical question', source: '/products/gfci/gf15' };
const body = new URLSearchParams(buildMailtoUrl(inquiry).split('?')[1]).get('body');
expect(body).toContain('Model of interest: GF15');
expect(body).toContain('Finish: Black');
expect(body).toContain('Inquiry type: Technical question');
expect(body).toContain('Product page: /products/gfci/gf15');
expect(buildInquiryText(inquiry)).toBe(`To: louis@fahint.com\n\n${body}`);
```

- [x] Run: `npm test -- src/components/InquiryForm.test.jsx`; verify only new behavior fails.
- [x] Add `category` to draft state; add `defaultCategory`, `productContext`, `topic`, `onClearProduct`, `onModelChange` props. Category select reads/writes `form.category`; model select stays `form.model`. Synchronizing a new nonempty default category must preserve personal fields; clearing context keeps the category.
- [x] Normalize both model and category if explicitly present. Append optional finish/topic/source fields without changing legacy helper output when they are absent. Build both delivery modes from the same body.
- [x] Render the shared summary beneath the category/model row:

```jsx
{context && <div className="inquiry-product-context" role="group" aria-label="Selected product">
  <div aria-live="polite" aria-atomic="true">
    <span className="inquiry-product-context__label">Selected product</span>
    <p><strong>{context.model}</strong><span> · Finish: {context.finish}</span></p>
  </div>
  {onClearProduct && <button type="button" onClick={onClearProduct}
    aria-label="Clear selected product">Clear</button>}
</div>}
```

- [x] Use flex-wrap, min-width:0, overflow-wrap:anywhere, existing navy/teal/paper and radius tokens; Clear has a 44px minimum target and visible keyboard focus. No new overlay.
- [x] Invalidate in-flight feedback when model, finish or topic changes; retain the existing submit lock, timeout and copy fallback.
- [x] Rerun form tests, including actual component handoff via injected delivery/clipboard functions.

### Task 3: Product-to-Contact continuity

- [x] Add real-page tests for GFCI and USB paths, no implicit white selection, gallery browsing retaining finish, model changes resetting finish, topic retention, clear/category changes and preserved personal drafts. Invalid query values must not be displayed or propagated.
- [x] Run: `npm test -- src/pages/InquiryContext.test.jsx`; verify new behaviors fail.
- [x] Lift selection to both page parents with product identity guarding route changes:

```js
const [selection, setSelection] = useState(null);
const selectedModel = selection && selection.pageModel === product?.sku ? selection.model : product?.sku;
const selectedFinish = selection && selection.pageModel === product?.sku ? selection.finish : '';
const context = resolveInquiryContext(selectedModel, selectedFinish);
const selectModel = model => setSelection({ pageModel: product.sku, model, finish: '' });
const selectFinish = finish => setSelection({ pageModel: product.sku, model: product.sku, finish });
```

- [x] Pass controlled finish to the hero and report color swatch changes. Keep selectedImage/display-finish local; gallery clicks must not call the inquiry finish callback. Pass model/context/model callback into form and build the full-Contact URL from the same context.
- [x] In Contact resolve `model`/`finish`, pass category and context separately, preserve valid context in topic URLs, and delete `model`/`finish` on clear or category mismatch:

```js
const clearProduct = () => setSearchParams(current => {
  const next = new URLSearchParams(current);
  next.delete('model');
  next.delete('finish');
  return next;
}, { replace: true, preventScrollReset: true });
```

- [x] Run the five form/page suites and utility suite. Preserve existing anchors and existing seven-category select behavior.

### Task 4: Verify and preview

- [x] Run `npm test` and `npm run build`; investigate any new failure and repeat affected checks.
- [x] Review `git diff --check` and scoped diff; confirm no email/domain or unrelated changes.
- [x] Reuse or start local Vite server on a verified available port. Inspect Contact at desktop and mobile widths and GFCI/USB selected-finish links, clearing, topic changes and keyboard focus. No real email is sent.
- [x] Open local Contact preview with a real published product/finish for the user. Record any browser limitation honestly.
- [x] Commit only completed scoped files locally if verified; do not push, merge or deploy. Give the user the preview URL and concise change summary.

## Plan self-review

The plan covers every first-batch behavior, keeps seven categories, uses catalog-backed values and generated product paths, preserves drafts, and excludes later batches and external configuration. Existing checkout/topic branch is retained per the approved design. No delegation or additional design gate is needed; the user has requested implementation and preview.

## Execution record — 2026-10-02

- RED cases reproduced missing selected-product summaries, lost model/finish data, and lost finish on alternate application/OEM/document links. GREEN cases cover those paths across the shared GFCI and catalog templates.
- Updated two older swatch assertions intentionally: browsing a structural view no longer deselects the inquiry finish. Gallery thumbnails still track the displayed photograph independently.
- Added optional Contact URLs to `ProductStorySections`, `ProductTechnicalSections`, `CatalogProductSections` and `ReceptacleOutline` so all product-specific Contact entrances carry validated selections and appropriate topics.
- Browser testing exposed query changes jumping to the page top. Added an explicit `preserveScroll` navigation flag in `RouteFocusManager`, used only by Contact form changes. Clear now restores focus to the category control. The regression test failed before the fix and passed after it.
- A route round-trip test exposed an old GFCI finish reappearing. Reset lifted selection on product identity changes while retaining existing inquiry personal fields.
- Final verification: `npm test` — 36 files, 775 tests passed; `npm run build` passed; `git diff --check` passed (existing line-ending conversion warnings only).
- Real Chromium: Contact at 1440/1024/768/390/320 widths; no horizontal page overflow. A long USB SKU and Light Almond wrap inside the 320px layout. Clear was keyboard-focusable with a visible outline. Clearing at scrollY 1103 kept scrollY 1103 and focused the retained USB category. Browser console: 0 errors, 0 warnings.
- Preview: `http://127.0.0.1:4175/contact?model=GF15&finish=black#inquiry`. Open requested in the Codex panel; app returned queued. Local Vite server is left running for review.
- Chromium also verified selecting Black on FTR15C-3100, seeing the product-page summary and following the full Contact link with the same selected model and finish. The automation-only browser session was closed after verification; the local preview server remains available.
- Screenshots: `output/playwright/inquiry-contact-desktop.png`, `inquiry-contact-mobile.png`, `inquiry-summary-320.png`.
- No email sent, service/domain setting changed, remote pushed, PR created or deployment triggered.
