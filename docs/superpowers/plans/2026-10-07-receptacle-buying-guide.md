# Standard receptacle buying guide implementation plan

> Execute inline with executing-plans. Preserve the current checkout and earlier uncommitted work; no subagents, commits, publishing, domain changes or email configuration.

**Goal:** Add a researched receptacle purchasing guide and a usable factory-document request list.

**Architecture:** Reuse the existing article data format, BlogPost renderer, family buying guide, model checklist and Resources links. One new article module; no new components, dependencies or styles. Industry sources explain terminology, while FAHINT records supply every model-specific claim.

**Tech Stack:** React/Vite, static article data, existing Vitest and prerender checks.

## Approved scope and evidence

The user approved the recommended standard-receptacle guide first, with a later smart-switch guide. PRODUCT.md delegates implementation without design-document approval rounds. Keep the existing brand and article layout.

Read on 2026-10-07:

- Legrand residential outlet guide: https://www.legrand.us/faq/residential-outlets (selection by location, rating and protection; do not adopt its brand-specific claims).
- Leviton straight-blade overview: https://leviton.com/products/commercial/straight-blade-receptacles (NEMA configuration and separate TR/WR features).
- Leviton terminal explanation: https://leviton.com/support/literature/blogs/back-wiring-vs-side-wiring (back clamp versus side screw, not a FAHINT wiring instruction).
- Leviton TR explanation: https://leviton.com/support/resources/infographics/tamper-resistant (shutter function).
- FAHINT product catalog PDF pages 15-18; pages 15-17 visually inspected. Original receptacle certificate page 2 visually checked, report E498095-20211123, issued December 13, 2021.
- Existing model records and `docs/product-data-audit-2026-10-06.md`.

Important findings: R15/R15Q differ in terminals despite a shared face image. Q and non-Q variants must remain separate. The certificate names 18 R/D models, not their -C counterparts. Catalog page 17 uses C/CT/CW designations; do not infer their mapping to website -C models. CR15/CR20 website records state 250V, but catalog page 17 prints 125V/250V; CD20 has an additional plug-configuration conflict. Keep these outside the guide's confirmed 125V comparison and request approved documentation.

## Editorial brief

Audience: distributors and project/private-label buyers preparing a model/finish schedule. No keyword-volume or ranking claims. One useful purchasing article, not an installation tutorial.

Ten title candidates considered before drafting:

1. Standard receptacle buying guide: ratings, TR/WR and wiring (selected; covers the whole purchase decision).
2. Choosing standard receptacles for a mixed order.
3. How to specify a standard receptacle.
4. Receptacle ratings and terminals: a buyer's checklist.
5. Comparing FAHINT standard receptacles.
6. TR, WR and quick-wire receptacles explained.
7. What to check before ordering wall receptacles.
8. From a receptacle model number to a purchase specification.
9. Duplex or decorator: preparing your receptacle order.
10. Receptacle documents to review before sample approval.

Structure: rating/NEMA; TR/WR/GFCI distinctions; ten-model comparison; termination; plate/finish; document gaps; RFQ checklist. Use the existing 1920 x 450 desk/receptacle illustration with a visible illustration caption. Date this local draft 2026-10-07; check publication date when releasing.

## Tasks

- [x] Add failing rendering, exact-model/rating/terminal and evidence-boundary tests in `src/pages/ReceptacleBuyingGuide.test.jsx`. Test Blog, Resources, family and model checklist links. Add root and project-base prerender assertions in `src/prerender.test.jsx`.

```js
expect(findPost('standard-receptacle-buying-guide')).toBeDefined();
expect(PUBLIC_ROUTES).toContain('blog/standard-receptacle-buying-guide');
```

- [x] Run `npm test -- src/pages/ReceptacleBuyingGuide.test.jsx src/prerender.test.jsx --reporter=dot`; confirm missing-article failures before adding implementation.
- [x] Create `src/data/receptacleBuyingGuide.js`. Reuse the `{ slug, title, excerpt, date, updated, cover, sources, body }` contract. Table rows: D15, D15Q, D20, DT15, DW20, R15, R15Q, RT20, RW20, RT15-C. Columns: model, face/protection, published rating, terminals. State the -C document gap explicitly, and keep CR15/CR20/CD20 out of this table.
- [x] Import and prepend `receptacleBuyingGuide` in `src/data/posts.js`; set the receptacles resource to `{ label: 'Read the standard receptacle buying guide', to: '/blog/standard-receptacle-buying-guide' }` in `src/data/buyingGuides.js`. Add the same Resources entry and one sitemap URL. Existing shared model checklists inherit the link.
- [x] Update exact article count assertions from 10 to 11 in existing guide/Blog tests; preserve their other contracts. Add a reciprocal link from the existing wallplate guide to the new article.
- [x] Create `docs/factory-document-request-2026-10-07.md`: prioritize disputed ratings, missing drawings, exact-model certificates and designation mappings; list required file/version/sample information. No external messages or certification judgments.
- [x] Review in five passes: structure; plain language; source fidelity; sentence-level humanizer edit; title/SEO/internal links. Keep all uncertainty and safety boundaries. Do not introduce fictional customers, results, rankings, prices, MOQ or lead times.
- [x] Run focused tests, all tests, root build, project-base build to a separate ignored output directory, and `git diff --check`. Inspect real generated HTML, new route/sitemap and base-safe links. Verify desktop/390px preview, table scrolling, TOC, document and inquiry navigation without sending a form.
- [x] Open the local article for review. Record fresh results here and leave all implementation uncommitted.

## Verification and handoff · 2026-10-07

- Red: the initial focused run failed the eight new guide/prerender cases while the 26 existing cases passed; the missing article was the expected cause.
- The first implemented run exposed a test assertion bug: `non-TR` contains the substring `TR`. Replaced substring checks with exact expected protection-field equality; no product fact was changed to satisfy that test.
- Focused final run: **63 tests passed across 7 files** at 18:04 local time.
- Full final run: **963 tests passed across 50 files** at 18:05 local time.
- `npm run build`: passed; **181 published pages plus the 404 fallback** prerendered. The new article's actual HTML includes the table, RFQ checklist, report reference and Article metadata. All 18 article-body links resolve to generated routes; sitemap includes the new route.
- Separate `/fahint-electric-website/` build in `output/qa/receptacle-project-base`: passed. Verified article prerender marker and base-safe model, Resources and technical inquiry links in the generated HTML. The root `dist` remains available for local preview.
- Playwright at 1440 × 1000 and 390 × 844: inspected title, cover and model table; TOC targets clear the fixed header; no page-wide horizontal overflow. Mobile table viewport is 325px with 640px scrollable content; a keyboard right-arrow changes scroll position from 0 to 40px.
- Followed article → R15Q → article, article → receptacle-filtered Resources, and article → technical inquiry. Original receptacle PDF returns HTTP 200 with `application/pdf`. No inquiry was submitted. Browser console reported zero errors/warnings during these flows.
- Screenshots: `output/playwright/receptacle-guide-desktop.png`, `receptacle-guide-desktop-table.png`, `receptacle-guide-mobile.png`, `receptacle-guide-mobile-table.png`, `receptacle-guide-mobile-table-scroll.png`.
- Copy review: checked clarity, consistent purchasing tone, usefulness, proof, specificity, real purchasing concerns and clear next steps. Removed wording that could imply an attachment-upload feature. Approximately 973 words excluding the comparison table; six references; seven sections. No unverifiable rankings, performance claims or commercial promises added.
- `git diff --check`: passed. No new dependency, component or style; reused existing article and procurement patterns (ponytail full). Existing unrelated changes preserved.
- Branch remains `codex/model-document-evidence`; no commit, push, merge, deployment, domain edit or email configuration. Preview: http://127.0.0.1:4174/blog/standard-receptacle-buying-guide.

Factory confirmation is still needed for the items in `docs/factory-document-request-2026-10-07.md`. The article describes these limits; it does not resolve the disputed specifications or certify current listing status.
