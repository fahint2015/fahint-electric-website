# Light switch guide and verified document corrections implementation plan

> **For agentic workers:** Use executing-plans to implement this plan task-by-task in the current session. The user prefers main-agent execution and preserving the current local draft; do not create subagents or move the work to a new checkout.

**Goal:** Correct the documented GTN/wallplate references and publish a researched lighting-switch guide in the local website.

**Architecture:** Reuse the existing certificate registry, product data adapters, article renderer and resource filters. Add one article data module and one certificate PDF/scan; map wallplate base models to their supplied reference documents without asserting current certification or finish coverage.

**Tech Stack:** React 18, React Router, Vite, Vitest/Testing Library; existing Poppler for rendering the supplied PDF scan.

## Constraints and baseline

- Approved design: `docs/superpowers/specs/2026-10-06-light-switch-buying-guide-design.md`.
- Current branch: `codex/prelaunch-buyer-tools`. Keep existing local wallplate/article changes; no push, merge, deployment, domain or email setup.
- Baseline: `npm test -- --reporter=dot` passed 909 tests in 47 files on 2026-10-06.
- Do not change BS1802 material/thickness, CD20 electrical values, GTN withheld drawings or FLB20 draft status.
- Commit the approved design only. Leave website changes available for local review unless the user requests a commit/push.

## Task 1: Correct document references with regression tests

Files: `src/data/certificates.js`, `src/data/catalogProducts.js`, `src/data/buyingGuides.js`, `src/data/catalogProducts.test.js`, `src/components/products/BuyingGuide.test.jsx`, `src/pages/Resources.test.jsx`, `src/pages/Home.test.jsx`; supplied PDF and scan below.

- [x] Update the GTN expectations first. For both models, assert the date/report, current-coverage caveat, no-feed-through entry and withheld drawings:

```js
expect(p.notes.join(' ')).toMatch(/E504391-20210212.*GTN15.*GTN20/);
expect(p.notes.join(' ')).toMatch(/current.*coverage/i);
expect(p.notes.join(' ')).not.toMatch(/does not establish coverage/);
expect(p.assets.drawings).toEqual([]);
```

- [x] Add wallplate registry/filter checks: two wallplate documents; BS1801/BS1802/BS1803-G/BS1803-M/BS1804 use the 2022-issued base-model reference, BS1806/BS18012/BS18032-M use the 2023-issued reference, BS1805 has no matching scan. Verify finish-mapping caveats in order notes. Expected full Resources downloads become 8, family documents 6, home certificate downloads 7.
- [x] Run `npm test -- src/data/catalogProducts.test.js src/components/products/BuyingGuide.test.jsx src/pages/Resources.test.jsx --reporter=dot`; confirm assertion failures before implementation.
- [x] Copy the original PDF without modification and render its first page:

```powershell
Copy-Item -LiteralPath 'D:/国际站运营平台/方特插座/网站资料/公司资料&产品/产品证书/E501377-Wallplate 1.pdf' -Destination 'public/assets/documents/certificates/ul-wallplate-2018.pdf'
& 'C:/Users/XuWanPi/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe' -f 1 -l 1 -scale-to 1200 -singlefile -jpeg -jpegopt quality=85 'public/assets/documents/certificates/ul-wallplate-2018.pdf' 'public/assets/images/certs/ul-wallplate-2018'
```

- [x] Add an independent `ul-wallplate-2018` entry with file E501377, report E501377-20181016, date August 16, 2022, models BS1801 through BS1804, and the new PDF/JPEG paths. Add the eight exact base models to the existing 2023 wallplate entry without changing its URLs. Share this lookup between the product scan and order note:

```js
export function findWallplateCertificate(model) {
  const baseModel = String(model).replace(/[ -][GM]$/i, '');
  return certificates.find(certificate => certificate.family === 'wallplates' && certificate.models?.includes(baseModel));
}
```

- [x] Update GTN FAQ, order note, product notes and certification label to state that the August 16, 2022 addendum lists GTN15/GTN20 as no-feed-through; retain current-status/configuration review. Use the matching wallplate registry image, or no scan if its base model is unlisted. Keep the legacy certification field clearly separate from the reference-file match.
- [x] Re-run the targeted tests and scan image; verify copied PDF SHA256 matches its source.

## Task 2: Add guide and update its entry points

Files: new `src/data/lightSwitchBuyingGuide.js`, new `src/pages/LightSwitchBuyingGuide.test.jsx`; update `src/data/posts.js`, `src/data/buyingGuides.js`, `src/data/wallplateBuyingGuide.js`, `src/pages/Resources.jsx`, `src/prerender.test.jsx`, `public/sitemap.xml` and existing blog/guide count tests.

- [x] Add a failing rendering/integration test with this core contract:

```jsx
const path = '/blog/light-switch-buying-guide';
render(<MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
  <Routes><Route path="/blog/:slug" element={<BlogPost />} /></Routes>
</MemoryRouter>);
expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Light Switch Buying Guide: Single-Pole, 3-Way and Combination');
const table = screen.getByRole('table', { name: 'FAHINT lighting switch model comparison' });
expect(within(table).getAllByRole('row')).toHaveLength(7);
expect(within(table).getAllByRole('columnheader')).toHaveLength(4);
expect(screen.getByRole('region', { name: 'FAHINT lighting switch model comparison' })).toHaveAttribute('tabindex', '0');
```

- [x] Add assertions for all six model links, a seven-item quotation checklist, library/dimmer/wallplate links, original-source references, the exact certificate limitations, title/description/Article schema and TOC anchors. SSR must include these elements under `/fahint-electric-website/`; all guides must remain available. Blog total becomes 10; Resources PDF total stays 8.
- [x] Run `npm test -- src/pages/LightSwitchBuyingGuide.test.jsx src/prerender.test.jsx --reporter=dot`; observe missing article/route failures.
- [x] Create the data module with approved title/slug, publication and updated date `2026-10-06`, existing switch cover and visible illustration caption. Six model table rows:

```js
[
  [{ label: 'DS15', href: '/products/lighting-switches/ds15' }, 'Paddle / single-pole', '15A, 120/277V AC', 'One location'],
  [{ label: 'DS15.3', href: '/products/lighting-switches/ds15-3' }, 'Paddle / 3-way', '15A, 120/277V AC', 'Two-location circuit'],
  [{ label: 'DS1502', href: '/products/lighting-switches/ds1502' }, 'Two single-pole rockers', '15A, 120/277V AC', 'Separate loads in one device'],
  [{ label: 'DS1503', href: '/products/lighting-switches/ds1503' }, 'Three single-pole rockers', '15A, 120/277V AC', 'Separate loads in one device'],
  [{ label: 'T15', href: '/products/lighting-switches/t15' }, 'Toggle / single-pole', '15A, 125V AC', 'One location'],
  [{ label: 'T15.3', href: '/products/lighting-switches/t15-3' }, 'Toggle / 3-way', '15A, 125V AC', 'Two-location circuit']
]
```

  The prose follows the six approved topics: control positions; face style versus function; six-model comparison; voltage/load limits; wallplate/finish pairing; RFQ and exact model documents. Cite the previously checked Leviton 3-way explanation and Legrand buying guide for concepts, and FAHINT's own catalog/model records for its specifications. Include the distinction between the three names on the supplied UL appendix, the T15.3 document gap and the two ETL source declarations. No wiring tutorial or multiplied rocker ratings.

- [x] Register `lightSwitchBuyingGuide` at the top of `posts`, add `/blog/light-switch-buying-guide` to sitemap, update lighting-family resource and add a Resources guide link. In the wallplate guide, add both archival report references and exact base-model lists, preserving material/thickness and finish-mapping caveats.
- [x] Run focused article, registry, Resources, catalog and prerender tests. Update count-only assertions where the added article/document changes the expected total; do not weaken factual assertions.

## Task 3: Edit, verify, preview

- [x] Copy-edit the article for clarity, voice, purchasing usefulness, proof, specificity, reader concerns and a clear next action. Humanizer pass removes staged introductions and formulaic closers, without deleting electrical/documentation boundaries.
- [x] Run `npm test -- --reporter=dot`, `npm run build`, and `git diff --check`. Inspect generated HTML for the new route, base-safe links and document download paths; no tests rely on the old GTN exclusion.
- [x] In local preview, inspect article at desktop and 390px width. Confirm table-only horizontal scrolling, readable copy, functional TOC and resources link. Check the two wallplate document cards, their independent PDF links and an affected model's order note. Check the home certificate strip for newly hidden/overflowing documents.
- [x] Review only this turn's changes against the approved scope. Preserve all prior work. Record fresh results and open the article preview for the user. Do not push or deploy.

## Completion evidence — 2026-10-06

- Task 1 followed red/green regression checks. Its four targeted suites passed 102 tests after the document mapping and GTN corrections.
- Task 2's focused article/integration checks passed 52 tests in six files. The guide includes all six linked models, seven RFQ items, source references, metadata, TOC and base-path-safe prerendered links.
- Final `npm test -- --reporter=dot`: **925 passed in 48 files**, 19:19:51 local time. Final production build: **180 published pages and the 404 fallback**. `git diff --check` passed; Git only reported existing LF/CRLF conversion notices.
- The copied wallplate PDF matches its source SHA256: `336AE25C35C3E26A73C536A9F066E3004006A9A22C18B8EA004CD7EC404493BD`. The first-page scan was visually checked.
- Browser checks: desktop article/table and TOC; 390px mobile body has no page overflow, with a 640px table scrolling inside its 325px region; the article opens Resources filtered to lighting switches; switching to wallplates exposes two separate PDF paths; BS1801-M shows the 2022-issued report note and matching scan.
- Two small evidence-led adjustments: the proposed 300px cover also depicted other lighting controls, so the article uses the existing 1920×450 ordinary paddle-switch illustration `lines/lighting-series-stair-entry-v1.webp`; no image asset was changed. Adding the seventh certificate exposed the homepage's fixed six-card width, so one flex declaration now shares desktop width automatically, with a regression test and unchanged mobile paging. After the fix, desktop track width equals scroll width (1145px), all seven cards are visible, and mobile Next moves the track.
- Copy-editing and humanizer checks retained model-specific caveats, removed no safety or document boundaries, and introduced no unverified product claims. Main-agent diff review only; no subagents or new dependencies.
- Preview: `http://127.0.0.1:4176/blog/light-switch-buying-guide/`. Screenshot: `output/light-switch-guide-desktop.png`.
- Retain the current branch and existing local draft. Only the approved design was committed (`2ff6d6c`); implementation remains local and uncommitted. No push, merge, deployment, domain or email changes.
