# Capabilities photography refresh

> Implementation: execute inline on `codex/capabilities-photography`. The user delegates visual choices and requested implementation, not another design approval round. No commit, push or deployment is included.

**Goal:** Replace the four disliked factory pictures on `/capabilities` with newly generated editorial images based on different supplied originals. Keep FAHINT's navy/blue frame and the existing inquiry, documentation and product routes.

**Approach:** Built-in image generation for four independent photographs; WebP export with FFmpeg; a page-specific photo map and provenance manifest; scoped CSS. No dependencies or shared-image replacements. Preserve the original factory assets and unchanged GF15 packaging image. Identify the new factory images as AI-refined promotional visuals, not test evidence.

## 1. Source selection and image generation

- [x] Review workshop/equipment contact sheets and inspect four different originals.
- [x] Generate workshop overview (16:9), component assembly, GFCI functional testing and laboratory bench (three at 3:2).
- [x] Inspect the four outputs for subject, composition and suitability.
- [x] Export `public/assets/images/company/capabilities/*-editorial-v1.webp`; hero 1600 × 900, stories 960 × 640, each below 500 kB.
- [x] Record source/output hashes, dimensions and full generation prompts in `docs/assets/capabilities-photography-2026-10-08.json` and the asset manifest. Retain generated PNG originals at their generation locations.

Selected original files under `网站资料/工厂视频+照片/照片/生产车间`:

| Role | Original |
| --- | --- |
| Workshop overview | `2023_04_03_15_27_IMG_8117.JPG` |
| Component assembly | `微信图片_20230323160550.jpg` |
| GFCI functional testing | `2023_04_01_23_16_IMG_8087.JPG` |
| Laboratory bench | `微信图片_20230404104624.jpg` |

## 2. Regression coverage first

- [x] Update `src/pages/CompanyPages.test.jsx` to require the new hero and accurate stage descriptions, preserved inquiry/navigation/documentation, four unique traceable images, matching intrinsic dimensions and disclosure.
- [x] Keep the existing original-factory asset integrity and About-page tests; do not rewrite or remove unrelated assertions.
- [x] Run `npm run test -- src/pages/CompanyPages.test.jsx --maxWorkers=2 --minWorkers=1` and confirm expected failures before implementation.

## 3. Page implementation

- [x] Add `src/data/capabilitiesPhotos.js`; do not modify the shared `companyPhotos` selections.
- [x] Update `src/pages/Capabilities.jsx`: wider workshop hero, three visible landscape stories, concise image-matched copy and a visible AI-refinement note. Keep all existing conversion/documentation links and OEM packaging.
- [x] Update only `src/styles/capabilities.css`: consistent landscape media, brand 14px corners, three readable desktop columns and full-width stacked mobile images. No carousel, animation or tabs.
- [x] Update the scoped Capabilities sections in `DESIGN.md`, making the promotional-image exception explicit while leaving documentary evidence elsewhere untouched.

## 4. Verification and handoff

- [x] Run focused page/asset/media tests, then production-base tests and build with constrained test workers.
- [x] Run the Impeccable detector once against changed UI files.
- [x] Inspect desktop and mobile previews as one batch: loaded images, consistent ratios, readable captions, no overflow and working section/inquiry links.
- [x] Address any clear issue in one fix batch and confirm it. No visual correction was needed after the screenshot review.
- [x] Prepare the local Capabilities preview and request opening it in Codex (queued); provide the direct preview URL. Do not push or deploy without a new request.

**Plan review:** Scope is limited to four new promotional images and one page. Original manufacturing evidence, product photographs, specifications, certifications and contact behavior remain unchanged. The existing stylesheet/data patterns suffice; no abstractions or dependencies are needed.

## Verification record

- Red: 3 expected failures for the missing new hero, testing story and manifest; 7 existing page tests passed.
- Green: 37 focused page, image, asset-path and media tests passed. React 18 uses lowercase `fetchpriority`, consistent with existing components.
- `SITE_BASE=/fahint-electric-website/ npm run build`: passed; 181 published pages plus the 404 fallback prerendered.
- Same production base, `npm run test -- --maxWorkers=2 --minWorkers=1`: 50 files, 977 tests passed.
- Four WebP files total 537,218 bytes. New source files have four distinct SHA-256 hashes; originals remain unchanged. Capabilities' sharing image now matches its new hero.
- Browser QA: 1440px, 768px and 390px viewports have no horizontal overflow. All story images display at 3:2 and all four new images have 14px corners. Image decoding, production-anchor navigation and OEM contact navigation succeeded.
- Screenshots: `output/playwright/capabilities-{1440,390}-{hero,stories}.png`. QA script: `output/playwright/capabilities-photography-qa.js`.
- Impeccable detector: only advisory flags for three pre-existing dark-section colors (`#c4d5df`, `#a4c5d6`, `#40576a`); retained to preserve the existing brand treatment. No new color introduced.
- `git diff --check`: passed. No new dependencies, commits, pushes or deployments.
- Local preview: http://127.0.0.1:4174/capabilities (Vite session left running).
