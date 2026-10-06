# Page Prerender Implementation Plan

> Execute inline on `codex/prelaunch-buyer-tools`; the user approved the scope and asked to begin. Use existing React/Vite/Node APIs (ponytail full). No subagents, new worktree, remote writes, email or domain changes.

**Goal:** Published HTML contains the real page body and works with the existing client interactions and deployment base.

**Design:** `docs/superpowers/specs/2026-10-03-page-prerender-design.md`.

## Tasks

- [x] Establish baseline: `npm test -- src/deployment.test.js src/publishedRoutes.test.jsx src/pages/StudioPages.test.jsx src/pages/UsbInquiryList.test.jsx`.
- [x] Add failing tests in `src/prerender.test.jsx` for real server rendering (home, all family types, representative details, 404, base links), and `src/deployment.test.js` for body injection, all published routes and atomic failure. Add hydration selection checks and deterministic hero first-render coverage.
- [x] Extract shared routes into `src/App.jsx`; add `src/entry-server.jsx` using StaticRouter + React's completed stream. Update source-level route assertions to the shared file without weakening them.
- [x] Extend `scripts/prepare-pages.mjs`, add the small Vite server-build helper, and update `package.json`, `vite.config.js` and `.github/workflows/deploy.yml`. Keep all existing validation and head metadata behavior.
- [x] Hydrate matching static paths in `src/main.jsx`; preserve client rendering for query state and fallback paths. Keep initial homepage preference state server-safe.
- [x] Run focused tests, then `npm test`, `npm run build`, and `git diff --check`. Build again with `SITE_BASE=/fahint-electric-website/` and inspect the artifact.
- [x] Browser QA on the production preview: no-JS core content and styles at desktop/mobile sizes; JS hydration, family filtering, comparison, itemized inquiry, gallery/navigation, hash links, 404 and reduced motion. Check browser errors and missing assets. Do not submit inquiries.
- [x] Record results and remaining limits. Keep work local for review; do not push/merge/deploy.

## Results

- Baseline: 93 tests in four focused files passed before implementation.
- Red checks confirmed the previous build had no body renderer or hydration marker, did not reject incomplete rendering, and did not guard a second preparation. Additional red/green checks cover trailing-slash consistency, SVG title text-node warnings and no-script inquiry submission.
- Full final suite: **882 tests / 44 files passed**. Production client build: **1664 modules**; build-time renderer: **76 modules**. Both `/` and `/fahint-electric-website/` builds generated **176 published pages plus 404**.
- Artifact audit: one H1, populated root and a stylesheet in every published file; about **6.8 MB total HTML**. No server bundle or unconfigured CNAME in the public artifact. No added dependencies.
- Browser no-script verification: homepage, product overview, GFCI and USB families, GF15 and FTR15-3100 display actual headings, links, photographs and specifications. Reveal content is visible before enhancement. Checked desktop and 390 px mobile; no horizontal overflow.
- Browser JavaScript verification: 12 representative pages hydrate with no console errors/warnings; reduced-motion hero pauses; 404 uses its own body. USB images and Black finish switch correctly. USB-A + USB-C filtering shows 14 of 37 models; two-model comparison survives refresh and transfers into Contact. Item quantity `500` and White finish survive refresh. No inquiry was sent.
- GitHub subpath verification: four representative mobile pages checked with JS both disabled and enabled; links keep the base, assets have no HTTP errors, and query-selected comparison still restores correctly.
- Inquiry fallback protection: with JavaScript disabled the submit button remains disabled, the explanation is visible, and Enter in a populated name field causes no navigation/request. With JavaScript enabled the button enables after hydration without warnings.
- QA screenshots/scripts are local ignored files under `output/playwright/`. Existing unrelated untracked files remain untouched.

## Remaining limits

- Interactive filters, comparison and inquiry composition require JavaScript. Query-specific HTML is not generated or indexed separately. This is the same published body, not bot-specific or hidden SEO copy.
- Vite preview may use the root fallback for slashless directory URLs; inspect raw/no-script route HTML at trailing-slash URLs. GitHub Pages resolves/redirects directory entries. Hydration handles both pathname forms without changing the browser URL.
- Deployment, domain/canonical/sitemap migration and direct inquiry email remain deferred. No ranking or AI citation guarantee is implied.
