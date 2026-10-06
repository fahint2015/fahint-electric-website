# Resource Center Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. User-approved execution is inline by the main agent, in the current topic branch, without subagents.

**Goal:** Publish a local-preview Resources page containing the seven existing PDFs, product-family filtering and validated model context.

**Architecture:** Reuse `certificates.js`, `documents.js`, `productLines`, the inquiry context resolver and shared company UI. Keep filter state in the URL, original PDFs behind native links, and certificate scope separate from selected-model context. Add no dependencies or services.

**Tech Stack:** React 18, React Router 6, Vite, existing CSS tokens, Vitest and Testing Library.

---

Approved design: `docs/superpowers/specs/2026-10-02-resource-center-design.md`.

## Task 1: Resources page and source data

Files: create `src/pages/Resources.jsx`, `src/pages/resources.css`, `src/pages/Resources.test.jsx`; modify `src/data/certificates.js` and `src/data/documents.js`.

- [x] Write real-render tests for seven existing file links, family filtering, model context, invalid/draft/mismatched models, keyboard access to scope details and native download links. Core assertion:

```jsx
render(<MemoryRouter initialEntries={['/resources?family=usb-outlets&model=FTR15C-3100']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Resources /></MemoryRouter>);
expect(screen.getByLabelText('Product family')).toHaveValue('usb-outlets');
expect(screen.getByRole('link', { name: 'Return to FTR15C-3100' })).toHaveAttribute('href', '/products/usb-outlets/ftr15c-3100');
expect(screen.getByRole('link', { name: 'Request model documents' })).toHaveAttribute('href', '/contact?topic=technical&model=FTR15C-3100');
```

- [x] Run `npm test -- src/pages/Resources.test.jsx` and verify the new behavior is absent before implementation.
- [x] Add the five explicit `family` fields to existing certificate records: `gfci`, `receptacles`, `usb-outlets`, `wallplates`, `lighting-switches`. ISO remains unassigned to a product family. Do not infer model coverage from this mapping.
- [x] Add this small link helper to `documents.js`, retaining its existing catalog export:

```js
export function resourcesHref(product) {
  return `/resources?${new URLSearchParams({ family: product.line || 'gfci', model: product.sku })}`;
}
```

- [x] Build the page around native links, `<select>` and `<details>`. Use the following validated state and query update logic; raw query text is never rendered as a model or used as a file URL:

```jsx
const [params, setParams] = useSearchParams();
const requestedFamily = findLine(params.get('family'));
const candidate = resolveInquiryContext(params.get('model'));
const context = candidate && (!requestedFamily || requestedFamily.name === candidate.category) ? candidate : null;
const family = requestedFamily || productLines.find(line => line.name === context?.category);
const files = certificates.filter(file => file.family && (!family || file.family === family.slug));
const changeFamily = event => {
  const slug = event.target.value;
  const next = new URLSearchParams();
  if (slug) next.set('family', slug);
  if (context && slug && findLine(slug)?.name === context.category) next.set('model', context.model);
  setParams(next, { replace: true, preventScrollReset: true, state: { preserveScroll: true } });
};
```

When selecting All explicitly, clear the source model so it cannot implicitly re-select its family. Keep a native status message for the number of family files and an empty state for dimmers/smart switches. Preserve the ISO row outside the filtered product documents. Use `inquiryContactHref(context, 'technical')` for the request action.

- [x] Apply scoped responsive CSS using existing site/company tokens. The shared row structure is a certificate thumbnail, its text/details and native PDF actions:

```css
.resources-document { display:grid; grid-template-columns:64px minmax(0,1fr); gap:16px; border:1px solid var(--site-line); border-radius:var(--site-radius); padding:20px; }
.resources-document__actions { grid-column:1 / -1; display:flex; flex-wrap:wrap; gap:12px 24px; }
@media (min-width:768px) {
  .resources-document { grid-template-columns:88px minmax(0,1fr) auto; gap:24px; }
  .resources-document__actions { grid-column:auto; flex-direction:column; align-items:flex-start; }
}
```

Use a compact paper-colored heading, a navy catalog feature, white document rows and a small technical-document request panel. Maintain 44px controls and visible focus; no PDF iframe, carousel or decorative hero photograph.
- [x] Re-run the page tests and confirm native actions, existing file paths and query behavior pass.

## Task 2: Connect navigation, product pages and search metadata

Files: modify `src/main.jsx`, `src/components/Header.jsx`, `src/components/Footer.jsx`, `src/components/company/CertificateLibrary.jsx`, `src/components/products/ProductTechnicalSections.jsx`, `src/components/products/CatalogProductSections.jsx`, `src/seo/metadata.js`, `scripts/prepare-pages.mjs`, `public/sitemap.xml`; extend the resource tests and `src/publishedRoutes.test.jsx`.

- [x] Add failing integration checks for both GFCI certification branches and catalog product documentation. Check `GF15`, `GL20`, `GTN15` and `FTR15C-3100` resolve to their own resource URL, not another family's file. Check header/mobile menu/footer/About resources entries.
- [x] Run `npm test -- src/pages/Resources.test.jsx src/publishedRoutes.test.jsx` and confirm missing integration failures.
- [x] Add a lazy route and replace the product-specific suspense loading text with a page-neutral one:

```jsx
const Resources = lazy(() => import('./pages/Resources.jsx'));
<Route path="/resources" element={<Resources />} />
```

- [x] Add `Resources` links pointing to `/resources` to desktop/mobile navigation and footer, and `Browse all resources` to the existing About certificate library. Keep all existing routes and anchors.
- [x] Add a shared-link-pattern action in both branches of `ProductCertification` and in `CatalogDocumentation` using the helper (imported from `../../data/documents.js`):

```jsx
<Link className="textlink" to={resourcesHref(product)}>
  Browse product resources <ArrowRight size={15} aria-hidden="true" />
</Link>
```

- [x] Add the following `/resources` static metadata, add `resources` to `STATIC_ROUTES`, and add only its URL to the existing sitemap without changing the domain or SEO policy:

```js
'/resources': {
  title: 'Product Catalog & Certificate Downloads | FAHINT',
  description: 'Download the FAHINT product catalog and original product-family certificates. Find model references and request installation or technical documents for your device.',
  image: 'assets/images/company/factory/showroom-samples-v1.webp',
  imageAlt: 'FAHINT wiring-device samples', label: 'Resources',
},
```

- [x] Run `npm test -- src/pages/Resources.test.jsx src/publishedRoutes.test.jsx src/deployment.test.js src/components/Header.test.jsx src/components/Footer.test.jsx src/pages/CompanyPages.test.jsx src/pages/InquiryContext.test.jsx` and verify no existing inquiry behavior is changed.

## Task 3: Verify and hand off a local preview

- [x] Run `npm test`, `npm run build` and `git diff --check` with no outstanding failures.
- [x] Check the existing preview server before starting another. Open `/resources` and a product-specific resource URL in a real browser.
- [x] Check 320, 390, 768, 1024 and 1440px widths, no horizontal document overflow, clear control focus, one-column mobile rows and navigation fit. Adjust only scoped styles and necessary header gaps if the additional navigation link needs space.
- [x] Open a real PDF, confirm seven file requests return PDF content, test a repository-base build/route, switch families without resetting scroll, and follow the model-specific technical inquiry. Do not send an actual inquiry.
- [x] Inspect final diff for domain/email/service changes, accidental product certification changes and unrelated edits. Keep existing untracked user files untouched.
- [x] Record verification results here, commit only this batch's files locally and request the local Resources preview for the user. Do not push or merge.

## Self-review

The plan covers the approved document inventory, all seven families, ISO separation, missing-document states, two product-page systems, existing About links, navigation, shareable validated context, SEO metadata and Pages route generation. No CMS, new dependency, speculative downloads or installation instructions are added.

## Execution record

Completed on 2026-10-02 in `codex/prelaunch-buyer-tools`, with main-agent inline implementation and review.

- TDD: verified missing-page and route failures before implementation; added 22 regression checks (21 Resources tests and one published-route test).
- Final full run: `npm test` passed 37 files / 797 tests. `npm run build` passed. `git diff --check` passed.
- Real Chromium checks at 320, 390, 768, 961, 1024 and 1440px found no horizontal overflow or desktop navigation collision. Inspected desktop and stable mobile screenshots.
- Native disclosure opens with Enter and has visible focus. Family selection preserves scroll (519px before and after), clears unrelated source models and restores all five product-family files with All.
- All seven file requests returned 200 with PDF content; real PDF opening and the FTR15C-3100 technical-inquiry handoff were exercised without sending any message.
- A production build with `/fahint-electric-website/` generated the Resources entry and its metadata; the real browser loaded correct prefixed file paths and images.
- Reviewed the original GFCI certificate addendum, kept supplied certificate descriptions and existing product-level documentation-review cautions unchanged. No domain, mail-service or dependency configuration changed.
- Final browser checks reported zero errors and warnings after restarting the stopped local preview service.
- Local preview: `http://127.0.0.1:4175/resources`. The app accepted the request to open it with status `queued`; the preview URL is supplied separately for access.
- Keep this batch local. No push, merge or deployment. Existing unrelated untracked user files remain untouched.
