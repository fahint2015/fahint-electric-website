# Wallplate Buying Guide Implementation Plan

> **For agentic workers:** Use executing-plans for inline execution. The approved scope specifies main-agent work in the existing checkout, with no subagents or remote changes.

**Goal:** Add a researched English wallplate guide with eight FAHINT configurations, a quotation checklist and existing-site discovery links.

**Architecture:** One data module uses the existing BlogPost paragraph, heading, list and accessible table renderer. Register it in posts, then link it from the wallplate buying guide and Resources. Existing metadata and prerendering remain unchanged.

**Tech Stack:** React, React Router, Vite, Vitest, Testing Library. No new dependencies.

## Scope and evidence

The user approved proceeding on 2026-10-06 after the recommendation summarized the scope. Use `docs/superpowers/specs/2026-10-04-wallplate-buying-guide-design.md` for the researched source map, selected title and eight-row table. Rechecked Leviton and Legrand official sources on 2026-10-06. All eight dimensions and summary fields agree with the current catalog.

Keep the earlier humanization edits in `posts.js`, `usbBuyingGuide.js` and `dimmerBuyingGuide.js`. Leave unrelated untracked files alone. Work on `codex/prelaunch-buyer-tools`; do not commit, push, merge, deploy or change email/domain settings in this local-preview task.

## Task 1: Test the article contract before adding it

**Files:** Create `src/pages/WallplateBuyingGuide.test.jsx`; modify `src/prerender.test.jsx`, `src/pages/Blog.test.jsx`, `src/pages/UsbBuyingGuide.test.jsx`, `src/pages/DimmerBuyingGuide.test.jsx`.

- [x] Baseline: `npm test -- src/pages/Blog.test.jsx src/pages/DimmerBuyingGuide.test.jsx src/pages/UsbBuyingGuide.test.jsx` (17 passed).
- [x] Add tests for one H1, a four-column/eight-model accessible table, seven checklist entries, model/document/finish links, metadata, source/illustration boundaries and the three discovery paths.
- [x] Compare each row against `findCatalogProduct('wallplates', slug)` using `specificationSummary` and the millimeter values in `Product width` / `Product height`.
- [x] Add a base-path prerender test and update only article-count assertions from eight to nine.
- [x] Run `npm test -- src/pages/WallplateBuyingGuide.test.jsx src/pages/Blog.test.jsx src/pages/UsbBuyingGuide.test.jsx src/pages/DimmerBuyingGuide.test.jsx src/prerender.test.jsx`; expect missing article/discovery assertions to fail before implementation.

Core data check:

```js
const post = findPost('wallplate-buying-guide');
expect(post).toBeDefined();
const table = post.body.find(block => block.type === 'table');
expect(table.rows).toHaveLength(8);
for (const [model, opening, finish, dimensions] of table.rows) {
  const product = findCatalogProduct('wallplates', model.href.split('/').pop());
  const summary = Object.fromEntries(product.specificationSummary);
  const fields = Object.fromEntries(product.specificationGroups.flatMap(group => group.rows));
  expect(opening).toBe(`${summary.Opening} / ${summary.Gangs}`);
  expect(finish).toBe(`${summary.Surface} / ${summary.Fixing}`);
  const mm = value => value.match(/\(([\d.]+)\s*mm\)/)[1];
  expect(dimensions).toBe(`${mm(fields['Product width'])} × ${mm(fields['Product height'])} mm`);
}
```

## Task 2: Write the guide and connect existing entry points

**Files:** Create `src/data/wallplateBuyingGuide.js`; modify `src/data/posts.js`, `src/data/buyingGuides.js`, `src/pages/Resources.jsx`, `public/sitemap.xml`.

- [x] Write the seven sections from the approved spec in the same plain purchasing voice as the revised USB/dimmer guides. Use approximately 900–1,100 words if useful, with no filler to reach a count. Date the local article 2026-10-06 and set reading time from the finished text.
- [x] Use the eight verified rows from the spec, labeled as exterior width × height. Include two primary external sources plus local model/family sources. Keep inline attribution next to the relevant industry concepts.
- [x] Keep BS1802 material/thickness out of published numeric claims. Preserve model-specific fit, pack contents, sample approval and documentation caveats. Distinguish website finish aliases from BS1803 G/M source model designations.
- [x] Reuse `assets/images/editorial-home/category-wallplates-scene.webp` (1600 × 900), visibly captioned as an illustration. Edit with humanizer and copy-editing; no invented experience, performance, certification or commercial guarantees.
- [x] Register the data module before the existing guides:

```js
import { wallplateBuyingGuide } from './wallplateBuyingGuide.js';
```

The first item in `posts` becomes `wallplateBuyingGuide`. Preserve every existing item.

- [x] Replace only `wallplates.resource` with:

```js
resource: { label: 'Read the wallplate buying guide', to: '/blog/wallplate-buying-guide' },
```

- [x] Append this Resources entry after the dimmer guide:

```jsx
<p className="resources-scope-note">
  Matching devices and wallplates?{' '}
  <Link className="company-text-link" to="/blog/wallplate-buying-guide">Read the wallplate buying guide <ArrowUpRight size={16} aria-hidden="true" /></Link>
</p>
```

- [x] Append this sitemap entry without changing its existing domain:

```xml
<url><loc>https://www.fahint.com/blog/wallplate-buying-guide</loc></url>
```

- [x] Repeat the targeted tests; expect all to pass. Confirm each internal source link points to an existing route and no automatic inquiry-list mutation is introduced.

## Task 3: Verify and show the local result

- [x] Run `npm test` and `npm run build`; all existing tests must pass and the new route must be prerendered.
- [x] Check built HTML for one H1, matching title/description/Open Graph/Article metadata, seven working section anchors, eight product links and a sitemap entry.
- [x] Inspect the local article at desktop and 390px width. Verify the table scrolls within its own keyboard-focusable region, the page does not overflow horizontally, the image loads and the console has no errors. Check the Resources and wallplate-family links. Do not submit inquiries or open email actions.
- [x] Run `git diff --check`, review the diff and update these checkboxes with actual results.
- [x] Open the finished local article for the user and report the local-only/unpublished status.

Self-review: the plan covers the approved guide, eight configurations, documented caveats, existing visual style, discovery links and static search information. No catalog correction, new UI system or unrelated cleanup is included.

## Verification results — 2026-10-06

- Baseline: 17 tests passed. Initial article/entry-point red phase: 11 expected failures, 34 passes. Targeted green run: 45 tests passed.
- Final full suite: 909 tests passed in 47 files. Final production build: 179 published pages plus the 404 fallback.
- Final built-HTML check passed for one H1, title/description/Open Graph/Article metadata, seven valid section anchors, eight existing model-page files and the sitemap entry. Canonical is intentionally omitted when `VITE_SITE_URL` is unconfigured; separately verified the configured base-path output without changing domain settings.
- Desktop preview: no page overflow; the 773px table fits its container. At a 390px viewport, the page remains within the viewport and the 325px table region scrolls its 640px content; keyboard ArrowRight also moves it. Cover loads and the console has no errors.
- Browser navigation verified Resources → guide → wallplate family → guide. The final article remains open at `http://127.0.0.1:4176/blog/wallplate-buying-guide`.
- Self-review corrected the inquiry instruction to the existing single-model product-page flow. Bulk inquiry lists currently support USB only. Added a failing guard test before the wording correction; the final suite includes it.
- No new dependencies, template/CSS changes, catalog-parameter corrections, commits, pushes, merges, deployments or inquiry submissions. Earlier humanization edits and unrelated untracked files remain intact.
