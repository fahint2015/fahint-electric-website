# Fahint Electric Website

Official source repository for the Fahint Electric international website.

## Local preview

```bash
npm install
npm run dev
```

## Production build

```bash
npm test
npm run build
npm run preview
```

The build generates static HTML for every published page, with the same React components used by the browser. The build-only server bundle stays in ignored `output/prerender/`; deploy only `dist/`. No runtime Node server or extra dependency is required. A missing page heading or rendering failure stops artifact preparation.

## Loading strategy

Published content pages use route-level lazy imports. During the build, `scripts/prepare-pages.mjs` reads Vite's client manifest and adds one low-priority module preload for the current page entry. It does not preload other pages or the full dependency tree: the latter competed with the main image in cold mobile measurements. Missing entries or unsafe asset paths stop preparation before route files are written. The 404 page receives no extra page preload, and root and project-path builds use the same rules.

The active homepage poster is eager/high priority; inactive scenes and other `StudioImage` images are lazy/low priority. This changes scheduling, not image size or quality. The shared stylesheet and prerendered content remain available without JavaScript. See `docs/superpowers/plans/2026-10-03-mobile-performance.md` for the local test conditions, measured results and limitations; these are not field Core Web Vitals or a search-ranking guarantee.

## Deployment

Every push to the `main` branch is built and deployed automatically by the GitHub Pages workflow in `.github/workflows/deploy.yml`.

The workflow is preconfigured for this GitHub project path:

```text
/fahint-electric-website/
```

For a custom domain, add a repository variable named `SITE_BASE` with the value `/`, then set `CUSTOM_DOMAIN` to the domain name.

## Page search information

`src/seo/metadata.js` provides titles, descriptions, Open Graph/Twitter share images and JSON-LD for the browser and deployment build. `npm run build` writes a distinct head and the complete default React page body for every published route (including home, seven families and model pages). Product names, specifications and important links are available without JavaScript. Preview aliases, drafts and query-specific selections are not emitted as separate public pages; the 404 file has its own body and noindex metadata.

Matching static pages are hydrated; URL filters, comparison selections and inquiry lists use client rendering so the initial state matches the URL. A shared stylesheet keeps generated pages styled before route JavaScript loads. Interactive filters, galleries and forms still require JavaScript. Inquiry submission stays disabled until the form is interactive, preventing a native GET submission of customer details when JavaScript is unavailable; direct email and WhatsApp links remain available.

Canonical URLs are intentionally omitted until the production address is confirmed. To enable them later, provide **`VITE_SITE_URL`** to `npm run build` (which includes Pages preparation). Use the complete site base, including the repository path for project Pages (for example, `https://example.github.io/project/`), or the approved custom-domain root. Setting a GitHub repository variable alone is not enough: it must also be exposed to the workflow's build-job environment.

Without `VITE_SITE_URL`, share-image URLs and structured-data URLs use the actual deployment address inferred from `CUSTOM_DOMAIN`, `GITHUB_REPOSITORY` and `SITE_BASE`. Confirm the sitemap and robots domain at the same time as any domain migration; these files are not rewritten by the metadata step. Product metadata deliberately omits unverified prices, stock, reviews and ratings, and does not promise rich-result eligibility.

To inspect the prepared route HTML locally after a root-base build:

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4175
```

Use trailing-slash page URLs when checking raw metadata with Vite preview (for example, `/products/gfci/`). The preview server falls back to the root HTML for some slashless directory requests; GitHub Pages resolves the published directory entry files.

## Purchasing guidance

The seven family selection guides and model inquiry checklists share `src/data/buyingGuides.js`. Keep this guidance consistent with the published model data and certificate scope. GL20 documentation remains under review, and the residential GFCI report does not establish coverage for GTN15/GTN20. Sample approval, minimum quantities, packaging and delivery terms require confirmation in the quotation; do not replace these with universal promises.
