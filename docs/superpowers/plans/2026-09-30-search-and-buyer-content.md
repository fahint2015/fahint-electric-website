# Search information and buyer content implementation plan

> **For agentic workers:** Use executing-plans inline, following the user's no-delegation preference. Steps use checkbox syntax for tracking.

**Goal:** Implement the two items selected from the September 28 audit: consistent page search information and useful purchasing content, preserving FAHINT's visual design.

**Architecture:** Share lightweight metadata factories between existing page hooks and the Pages HTML preparation step. Browser pages receive their own product/article data; the shared metadata module must not import the complete catalogue. Reuse the current FAQ, typography, spacing and colours for family-specific buyer questions and model-specific inquiry checklists.

**Tech Stack:** React 18, React Router 6, Vite, native DOM/URL APIs, Vitest and existing browser tooling. No new dependency.

## Approved scope and boundaries

The user selected “完善页面搜索信息，增强采购内容” from the written audit. Implement unique titles/descriptions, Open Graph/Twitter images, truthful Organization/Product/Article/BreadcrumbList metadata; buying questions for the seven families; model-specific order preparation; and clearer OEM quotation inputs. Reuse existing specifications, certificate limitations and product links. Keep existing URLs, colour palette and product imagery. Do not deploy, migrate domains, add analytics, change inquiry delivery, invent claims or create a full HTML-body prerenderer.

Canonical policy is a separate question already sent to the user. Until confirmed, keep `VITE_SITE_URL` optional and omit canonical rather than asserting that the old brand-domain site serves the new pages. Share-image URLs can use the actual current deployment address. Preview and unknown routes remain noindex. Full body prerendering and the existing sitemap/domain mismatch remain separate audit items.

## Task 1 — Shared page metadata

Files: `src/seo/metadata.js`, `src/seo/usePageMetadata.js`, `src/seo/metadata.test.jsx`; existing company/studio metadata wrappers, GFCI/line/product pages and BlogPost.

- [x] Add tests for a missing description element, unique family/product metadata, absolute share images under a repository base, route cleanup, preview noindex, optional canonical without query/hash, safe JSON-LD and truthful product schema without fabricated offers/reviews.
- [x] Run `npm test -- src/seo/metadata.test.jsx`; confirm the new expectations fail before implementation.
- [x] Implement factories accepting existing page data and one effect-based head updater. Metadata entries include title, description, robots, OG title/description/type/image/image alt/URL, Twitter card/title/description/image and JSON-LD. Configured canonical addresses use the chosen site base; missing configuration does not silently point to the legacy domain.
- [x] Replace the existing duplicate effects/wrappers and run the focused tests plus page regression tests. Preserve not-found/preview robots cleanup and query-based inquiry interactions.

Key acceptance checks:

```js
expect(document.querySelector('meta[property="og:image"]').content).toMatch(/^https?:\/\//);
expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(0); // no configured site URL
expect(JSON.stringify(productSchema)).not.toMatch(/"offers"|"aggregateRating"|"review"/);
```

## Task 2 — Search information in initial HTML

Files: `scripts/page-metadata.mjs`, `scripts/prepare-pages.mjs`, `index.html`, `src/deployment.test.js`.

- [x] Add a failing deployment test that two product entry files contain different titles, correct descriptions and product images, while preserving the application entry script and base URL.
- [x] Build a server-only route metadata map from published data. Render metadata into a bounded head region with HTML escaping and script-safe JSON serialization. Keep full page bodies client-rendered; do not describe this as body prerendering.
- [x] Include route-specific noindex metadata in the fallback file. Reject invalid configured URL input before modifying output. Leave existing custom-domain validation and safe-path checks intact.
- [x] Run deployment tests, build and prepare a temporary production artifact. Confirm all 175 published routes have metadata and no draft/preview page is added.

## Task 3 — Purchasing content

Files: `src/data/buyingGuides.js`, `src/components/products/BuyingGuide.jsx`, `src/components/products/BuyingGuide.test.jsx`, GFCI/line/product pages, `src/pages/Capabilities.jsx`, scoped styles and the existing company FAQs.

- [x] Test that each family has distinct model-selection questions, internal links resolve to actual pages, and each model's checklist names its own SKU. Assert GL20/industrial GFCI documentation is not described as verified by the residential certificate.
- [x] Add compact family FAQs about the relevant choices: GFCI configurations; USB outputs/port sharing; receptacle ratings; dimmer load/control type; smart-switch wiring/protocol; switch circuits; wallplate openings/gangs.
- [x] Add quotation preparation beside the existing model inquiry: exact model/market/quantity, finish and plate, relevant model documentation, packaging and requested timing. State that commercial terms and sample approval need written confirmation.
- [x] Refine OEM order steps with explicit buyer inputs and approval checkpoints; use visible links to model pages, certificates and the existing sourcing guide. Do not invent author credentials or safety/installation advice.
- [x] Use the copy-editing checks for clarity, evidence and concrete next steps. Keep mobile content readable using the current design tokens and existing accessible FAQ controls.

## Verification and handoff

- [x] Run full tests, production build and `git diff --check`.
- [x] Inspect browser-rendered metadata on home, two families, two models, OEM and a blog article. Inspect buyer sections at 390px and 1440px, including keyboard interaction and overflow.
- [x] Review changed files against scope. Keep unrelated untracked directories/files untouched.
- [x] Prepare local preview and provide the preview links at handoff, reporting what remains pending (canonical/domain choice, full prerendering). Do not push or deploy unless the user asks.

## Verification notes — September 30

- Full suite: 747 tests passed across 34 files.
- Root-base and GitHub project-base production builds passed; all 175 generated entry heads checked, including absolute images and parseable JSON-LD.
- Browser checks: 11 published pages had matching initial/rendered head data. Article-to-home navigation removed article-only tags. No JavaScript errors.
- Responsive checks: selection guides, product inquiry and OEM brief at 1440px, 390px and 320px; no horizontal overflow; selection shortcut and keyboard FAQ expansion worked.
- Independent review found a USB charger exception (F4P has four USB ports, not an AC receptacle); corrected the generic wording and added a regression test.
- Local QA artifacts: `output/playwright/search-buyer-content/` (ignored, not release content).
- Canonical configuration, domain/sitemap alignment and full body prerendering remain pending. No deployment or GitHub write was made.
