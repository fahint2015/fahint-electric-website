# USB Product Filters Implementation Plan

> **For agentic workers:** Use executing-plans inline in the current topic branch. No subagents or extra worktree; the user has approved in-place implementation. Track completion below.

**Goal:** Add three accurate USB specification filters to the existing product listing without changing other families.

**Architecture:** Normalize existing product summaries into USB-only facets, compose with the existing search helper, and retain validated selection in URL parameters. Reuse native controls and current site CSS.

**Tech Stack:** React, React Router, existing CSS, Vitest / Testing Library, Playwright CLI.

## Task 1 — Reliable USB facets

Files: create `src/data/usbFilters.js` and `src/data/usbFilters.test.js`.

- [x] Write failing tests covering all 37 products, port aliases, 15A / 20A / USB-only classification, seven charging profiles, intersecting conditions and empty matches. Representative contract:

```js
expect(filterUsbProducts(getCatalogProducts('usb-outlets'), {
  ports: 'dual-c', rating: '20a', charging: 'pd-65w',
}).map(product => product.sku)).toEqual(['FTR20QC-DC65W']);
```

- [x] Verify red with `npm test -- src/data/usbFilters.test.js` before implementation.
- [x] Export `usbFilters` (three labeled option arrays), `usbFilterValues(product)` and `filterUsbProducts(products, selected = {})`. Derive ports and receptacle rating from `new Map(product.specificationSummary)`, normalize Dual / 2 × aliases, use the existing PD group and published combined USB output for charging. Missing values stay blank, not inferred from model names.

```js
export function filterUsbProducts(products, selected = {}) {
  return products.filter(product => {
    const values = usbFilterValues(product);
    return usbFilters.every(({ name }) => !selected[name] || selected[name] === values[name]);
  });
}
```

- [x] Re-run the facet tests and verify exact counts: ports 8/14/14/1, ratings 18/18/1, charging 6/6/7/6/4/4/4.

## Task 2 — Existing listing integration

Files: modify `src/pages/LineDetail.jsx`, `src/pages/LineDetail.test.jsx`, `src/styles/catalog.css`.

- [x] Add failing real-render tests for new labels, combined selection, search, always-available reset, query restoration, invalid parameters, non-USB isolation and empty results.

```jsx
await user.selectOptions(screen.getByRole('combobox', { name: 'USB ports' }), 'dual-c');
await user.selectOptions(screen.getByRole('combobox', { name: 'Receptacle rating' }), '20a');
await user.selectOptions(screen.getByRole('combobox', { name: 'Charging output' }), 'pd-65w');
expect(screen.getByText('1 of 37 models')).toBeVisible();
expect(screen.getByRole('link', { name: 'View FTR20QC-DC65W details' })).toBeVisible();
```

- [x] Run `npm test -- src/pages/LineDetail.test.jsx` and observe missing-control failures.
- [x] In `ModelCatalogue`, add `useSearchParams`. USB uses `q` and the three validated facet keys; other series retain local query/group state. Compose `filterCatalogProducts(models, { query, group })` with `filterUsbProducts` only for USB. Build clean parameters from recognized selections when changing filters:

```js
setParams(next, { replace: true, preventScrollReset: true, state: { preserveScroll: true } });
```

- [x] Render the three USB select controls from `usbFilters` instead of Configuration, with ordinary labels, default All options, a brief output explanation and result count. Keep a single Clear filters button in the USB filter area (disabled with no active filters), retaining the existing empty-state reset for other families. Keep product cards and links intact.
- [x] Add scoped `.catalog-filters--usb` styles: four columns on desktop, two below 1100px; below 760px search and port selection span both columns. Use site tokens, existing 8px control corners, 44px-plus controls and visible focus. Do not alter the existing product grid.
- [x] Re-run page, facet, inquiry, metadata and catalog-data tests; inspect all affected callers.

## Task 3 — Validate and hand off

- [x] Check a running local preview and use a named Playwright CLI session. Verify intersection selection, empty/reset, refresh/back, keyboard focus and preserved scroll.
- [x] Inspect desktop/mobile screenshots and geometry at 320, 390, 768, 1024 and 1440px. Confirm no overflow, no control truncation that prevents use and unchanged mobile product columns.
- [x] Run `npm test`, `npm run build`, `git diff --check`, review scope, then commit only this batch locally. Leave user-owned untracked files and all deployment/email configuration alone.
- [x] Request the local USB product preview in the app and hand off the URL. No push, merge or deployment.

## Execution record

Completed 2026-10-02 by the main agent in `codex/prelaunch-buyer-tools`. Baseline LineDetail and catalog-data suites passed (32 tests); no existing tracked changes were overwritten.

- TDD red verified: missing USB controls and unimplemented facet rules failed before implementation. The new batch adds 12 regression tests.
- Full test suite: 38 files / 809 tests passed. `npm run build` and `git diff --check` passed.
- Inline review covered the data normalization, URL validation, existing catalog callers, query/history behavior, metadata and scoped CSS. No product specification, source file, certification or other family's filter behavior changed.
- Real Chromium: combined Dual USB-C + 20A + PD 65W returned only FTR20QC-DC65W. Scroll stayed at 446px during the three selections. Reload and browser Back from the real product page restored the chosen filters and result.
- Tab then ArrowDown selected Dual USB-A, retained focus on the select, showed a solid focus outline and returned eight models. Incompatible Dual USB-A + PD 65W returned zero; Clear filters restored all 37 models and the plain series URL.
- Widths 320, 390, 768, 1024 and 1440px had no horizontal page overflow. Inspected desktop, 390px and 320px screenshots. Phone product grids remained two columns and all filter controls exceeded 44px height.
- Browser console: zero errors and warnings. No dependency or service added; email, domain and deployment configuration unchanged.
- Preview: `http://127.0.0.1:4175/products/usb-outlets`. The app accepted the open request with status `queued`; provide the link directly as well.
- This batch is saved locally only; no push, merge or deployment. Unrelated `%SystemDrive%/`, `.planning/` and `Start-FAHINT-Preview.cmd` remain untouched.
