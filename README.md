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
```

## Deployment

Every push to the `main` branch is built and deployed automatically by the GitHub Pages workflow in `.github/workflows/deploy.yml`.

The workflow is preconfigured for this GitHub project path:

```text
/fahint-electric-website/
```

For a custom domain, add a repository variable named `SITE_BASE` with the value `/`, then set `CUSTOM_DOMAIN` to the domain name.

## Page search information

`src/seo/metadata.js` provides titles, descriptions, Open Graph/Twitter share images and JSON-LD for the browser and deployment build. The Pages preparation step writes a distinct HTML head for each published route. Page bodies still render in React; this is not full-page prerendering.

Canonical URLs are intentionally omitted until the production address is confirmed. To enable them later, provide the same **`VITE_SITE_URL`** to both `npm run build` and `scripts/prepare-pages.mjs`. Use the complete site base, including the repository path for project Pages (for example, `https://example.github.io/project/`), or the approved custom-domain root. Setting a GitHub repository variable alone is not enough: it must also be exposed to both steps in the workflow's build-job environment.

Without `VITE_SITE_URL`, share-image URLs and structured-data URLs use the actual deployment address inferred from `CUSTOM_DOMAIN`, `GITHUB_REPOSITORY` and `SITE_BASE`. Confirm the sitemap and robots domain at the same time as any domain migration; these files are not rewritten by the metadata step. Product metadata deliberately omits unverified prices, stock, reviews and ratings, and does not promise rich-result eligibility.

To inspect the prepared route HTML locally after a root-base build:

```bash
npm run build
node --input-type=module -e "import {preparePages} from './scripts/prepare-pages.mjs'; await preparePages({expectedBase:'/',publicUrl:'http://127.0.0.1:4175/'});"
npm run preview -- --host 127.0.0.1 --port 4175
```

Use trailing-slash page URLs when checking raw metadata with Vite preview (for example, `/products/gfci/`). The preview server falls back to the root HTML for some slashless directory requests; GitHub Pages resolves the published directory entry files.

## Purchasing guidance

The seven family selection guides and model inquiry checklists share `src/data/buyingGuides.js`. Keep this guidance consistent with the published model data and certificate scope. GL20 documentation remains under review, and the residential GFCI report does not establish coverage for GTN15/GTN20. Sample approval, minimum quantities, packaging and delivery terms require confirmation in the quotation; do not replace these with universal promises.
