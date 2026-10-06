# Mobile Loading Performance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. 用户已选择当前会话主代理执行，不创建子代理或工作树。

**Goal:** Reduce unnecessary first-load contention and script waterfalls without changing the website design or buyer workflows.

**Architecture:** Keep the existing prerendered React pages, shared stylesheet and verified product data. Use native image priorities, the existing route-level lazy loading pattern and, if needed after measurement, route-specific module preloads from Vite's client build manifest.

**Tech Stack:** React 18, React Router 6, Vite 5, Vitest, existing Playwright CLI; no new dependency.

---

## Task 1: Native image priority

Files: `src/components/studio/StudioShared.jsx`, `src/pages/HomeStudio.jsx`, `src/pages/StudioPages.test.jsx`.

- [x] Add a regression test that the active hero image is eager/high, inactive images and category images are lazy/low, and selecting another scene transfers high priority to it. Preserve the existing image URLs and counts.

```js
expect(images.map(image => image.getAttribute('fetchpriority'))).toEqual(['high', 'low', 'low']);
fireEvent.click(screen.getByRole('button', { name: 'Bedside charging' }));
expect(images.map(image => image.getAttribute('fetchpriority'))).toEqual(['low', 'high', 'low']);
```

- [x] Run `npm test -- src/pages/StudioPages.test.jsx` and observe the missing low-priority assertion fail.
- [x] Use `fetchpriority={priority ? 'high' : 'low'}` in StudioImage and `priority={index === active}` in the homepage scene map. No image processing, CSS or layout edits.
- [x] Run the focused test, build, and compare the same browser probe before proceeding.

## Task 2: Load only the current content route

Files: `src/App.jsx`, `src/publishedRoutes.test.jsx`.

- [x] Add a source boundary test that Blog, BlogPost, Capabilities and About use the same lazy import pattern already used by product pages, with no direct imports. Existing prerender tests verify all route bodies.

```js
for (const name of ['Blog', 'BlogPost', 'Capabilities', 'About']) {
  expect(source).toContain(`const ${name} = lazy(() => import('./pages/${name}.jsx'))`);
  expect(source).not.toContain(`import ${name} from`);
}
```

- [x] Run `npm test -- src/publishedRoutes.test.jsx` and observe failure.
- [x] Replace the four imports with `const Name = lazy(() => import('./pages/Name.jsx'));`, keeping route JSX, Suspense and immediate 404 unchanged.
- [x] Run `npm test -- src/pages/StudioPages.test.jsx src/publishedRoutes.test.jsx src/prerender.test.jsx`, then `npm run build`; inspect the main-entry reduction and run the same cold mobile probe.

## Task 3: Current-page module preloads, if the waterfall remains

Files: `vite.config.js`, `scripts/prepare-pages.mjs`, `scripts/build-page-renderer.mjs`, `src/deployment.test.js`.

- [x] If requests still wait for the main entry before fetching the current route, add a deployment regression fixture with an index entry, a current-page dynamic entry, shared imports, and unrelated dynamic pages. After the measured adjustment below, assert only the current page entry is preloaded at low priority and prefixed by expectedBase; shared and unrelated dynamic entries must not be added. Assert a missing mapped entry/file or unsafe asset path fails before writing any route.
- [x] Run `npm test -- src/deployment.test.js` and observe the new assertions fail.
- [x] Enable `build.manifest: true` in the client config and override `manifest: false` in the build-only server config. Pass parsed `dist/.vite/manifest.json` as optional `clientManifest` to preparePages in the real CLI path.
- [x] Add a small build-time helper mapping public paths to existing page entry names: home → HomeStudio; products → ProductsStudio; products/gfci → GfciSeries; other families → LineDetail; all product models → ProductDetail; blog → Blog; blog articles → BlogPost; about/capabilities/resources/contact → corresponding pages; 404 → no additional entry. Preload only the mapped page entry. Do not walk its `imports` or `dynamicImports`: the full dependency-tree prototype regressed cold mobile LCP and was removed.

```js
const tag = file => `<link rel="modulepreload" crossorigin fetchpriority="low" href="${escapeHtml(expectedBase + file)}">`;
// Only build-produced assets are accepted; do not accept external, absolute or parent paths.
if (!/^assets\/[A-Za-z0-9_./-]+\.js$/.test(file) || file.split('/').includes('..')) throw new Error('Unsafe module asset');
```

- [x] Insert generated tags before `</head>` while preparing every route; calculate all preloads before the existing writes. Existing no-manifest unit fixtures remain supported, but real builds must provide their manifest.
- [x] Run focused deployment and prerender tests, build, and remeasure. Keep only if the request trace confirms earlier fetching without visual/interaction regressions.

## Task 4: Verify and hand off locally

- [x] Run `npm test` and root-base `npm run build`. Check no-JS content, all 176 page roots, one H1 each, and every modulepreload target exists inside dist.
- [x] Run at least three final cold mobile measurements, report medians and limitations. No field INP or ranking claim from laboratory data.
- [x] Verify mobile scene switching/menu, USB filtering/comparison, inquiry-list configuration and refresh recovery. Inspect unchanged desktop/mobile screenshots; no real form submission.
- [x] Build with SITE_BASE `/fahint-electric-website/`; verify current-page module preloads, links and no-JS content. Restore root-base build for the user's preview.
- [x] Update this plan and README with evidence, run `git diff --check`, and save a scoped local commit. No push, merge, deployment or unrelated cleanup.

## Self-review

This plan covers the approved A scope, keeps prior prerender safety guards, and does not modify catalogue facts, styling, images, font files, email delivery or domains. Unrelated untracked folders and preview launcher stay untouched.

## Execution evidence — 2026-10-03

- Red/green confirmed for image priority, lazy route boundaries and preload generation; the initial image/route tests failed twice as expected. Deployment tests initially failed six assertions; narrowing preloads and specifying low priority each produced two expected failures before their fixes.
- A full dependency-tree preload prototype fetched route scripts early but regressed homepage LCP to 5.18–5.27 seconds and detail LCP to 2.47–2.48 seconds. Low-priority full-tree preloads still regressed these pages. It was replaced with one low-priority entry hint per page, without a custom runtime loader.
- Current page-entry requests now start around 0.19–0.20 seconds instead of waiting roughly 2.2–2.4 seconds for the main entry. Other dependencies continue to load normally. This does not mean that the whole page is interactive at that time.

### Final cold mobile results

Same production preview, 390 × 844 viewport, cache disabled, 1.6 Mbps down, 150 ms latency, 4× CPU and reduced motion. Baseline: two runs; final: three runs. LCP is local laboratory data, not field Core Web Vitals. Small differences are treated as noise, not proven gains.

| Page | Baseline LCP median | Final LCP median (range) | Initial JavaScript transfer before → after |
| --- | --- | --- | --- |
| Home | 3.708 s | 3.640 s (3.112–3.656 s) | 175 → 165 KiB |
| USB list | 3.894 s | 3.540 s (3.500–3.884 s) | 170 → 159 KiB |
| FTR15-3100 | 2.026 s | 2.072 s (1.936–2.096 s) | 187 → 176 KiB |

USB list median improved approximately 9%; home and detail do not show a substantial stable LCP improvement. The small detail median increase is within the observed run-to-run range and is explicitly reported. Original image and font bytes remain unchanged. No claim is made about field INP, overall PageSpeed score or search rankings.

### Verification

- `npm test`: **890 tests in 44 files passed**.
- Root and `/fahint-electric-website/` builds passed. Each of 176 static page bodies has one H1, shared styles and exactly one valid low-priority page-entry preload. The 404 is noindex with no extra page preload; no server bundle is present in public dist.
- Browser checks: 12 representative routes hydrated without errors; three measured mobile routes had no errors or horizontal overflow. Desktop/mobile screenshots were inspected against previous output; no layout/CSS source changes.
- Mobile hero scenes, menu, 14-of-37 USB filtering, comparison and two-model inquiry handoff work. Quantity 500 / White finish and both models survive refresh. No live inquiry was sent.
- No-JS content/styles checked on three routes at 390 and 1440 widths; no-JS contact submission remains disabled. Project-path JavaScript/no-JavaScript checks, links, filtering/comparison and submission guards passed.
- The root build was restored for `http://127.0.0.1:4176/`. Temporary port 4177 preview was stopped after checking its process identity.
- Raw probes, three final runs and QA screenshots remain local in ignored `output/playwright/` (`mobile-performance-probe.js`, `mobile-performance-before.json`, `mobile-performance-after.json`, `mobile-performance-qa.js`, `mobile-performance-artifacts.mjs`).

The main agent reviewed the scoped diff in the current checkout. No dependencies, image files, CSS files, buying data, mail delivery or domain configuration changed. No remote push, merge or deployment was performed.
