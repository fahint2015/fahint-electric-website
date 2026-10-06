# Dimmer Buying Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use executing-plans inline. The approved scope calls for the main agent only, not subagents. Steps use checkbox syntax.

**Goal:** Publish one researched English dimmer buying guide locally, connecting two verified FAHINT models to the existing buying and inquiry flow.

**Architecture:** Reuse the existing posts registry and BlogPost table/list/link renderer. Add data, discovery links and focused regression coverage only; do not change article components, CSS, product specifications, domain settings or inquiry behavior.

**Tech Stack:** Existing React 18, React Router 6, Vite 5, Vitest and Testing Library. No dependency additions.

**Approved design:** `docs/superpowers/specs/2026-10-04-dimmer-buying-guide-design.md`, approved by “开始吧” on 2026-10-04.

**Workspace:** Reuse `codex/prelaunch-buyer-tools` in the current checkout. This is a normal checkout, not a linked worktree; no new worktree or subagents. Preserve unrelated untracked files.

---

## File map

Create:
- `src/data/dimmerBuyingGuide.js`: original guide content, source references and linked model table.
- `src/pages/DimmerBuyingGuide.test.jsx`: accessible content, model data boundaries and discovery links.

Modify:
- `src/data/posts.js`: register the new post first.
- `src/data/buyingGuides.js`: dimmer-family guide link only.
- `src/pages/Resources.jsx`: add a second guide entry while retaining USB and downloads.
- `public/sitemap.xml`: add one route, retaining the existing domain.
- `src/pages/Blog.test.jsx`, `src/pages/UsbBuyingGuide.test.jsx`: exact new article/illustration counts.
- `src/prerender.test.jsx`: one static/subpath regression test.

Do not change `BlogPost.jsx`, styles, product records, dependencies, inquiry storage or deployment configuration.

## Task 1: Verify baseline and introduce failing coverage

- [x] Confirm current branch and untracked files; dependencies are already installed.
- [x] Run `npm test -- src/pages/Blog.test.jsx src/pages/UsbBuyingGuide.test.jsx src/pages/Resources.test.jsx src/prerender.test.jsx`. Baseline: 53 tests passed in four files.
- [x] Create `src/pages/DimmerBuyingGuide.test.jsx` with:

```jsx
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Blog from './Blog.jsx';
import BlogPost from './BlogPost.jsx';
import Resources from './Resources.jsx';
import { BuyingGuide } from '../components/products/BuyingGuide.jsx';
import { findPost } from '../data/posts.js';
import { findCatalogProduct } from '../data/catalogProducts.js';

const slug = 'dimmer-buying-guide-led-0-10v';
const path = '/blog/' + slug;
const wrap = children => <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{children}</MemoryRouter>;

describe('Researched dimmer buying guide', () => {
  it('renders the sourced guide with an accessible model table and quotation checklist', () => {
    render(<MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes><Route path="/blog/:slug" element={<BlogPost />} /></Routes>
    </MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dimmer Buying Guide: LED Loads and 0–10V Compatibility');
    const table = screen.getByRole('table', { name: 'FAHINT dimmer model comparison' });
    expect(within(table).getAllByRole('row')).toHaveLength(3);
    expect(within(table).getAllByRole('columnheader')).toHaveLength(4);
    expect(within(table).getAllByRole('rowheader')).toHaveLength(2);
    expect(screen.getByRole('region', { name: 'FAHINT dimmer model comparison' })).toHaveAttribute('tabindex', '0');
    for (const model of ['DM2010', 'DM2010S']) {
      expect(within(table).getByRole('link', { name: model })).toHaveAttribute('href', '/products/dimmers/' + model.toLowerCase());
    }
    const checklist = screen.getByRole('list', { name: 'Dimmer quotation checklist' });
    expect(within(checklist).getAllByRole('listitem')).toHaveLength(7);
    expect(screen.getByRole('link', { name: 'Browse FAHINT dimmer models' })).toHaveAttribute('href', '/products/dimmers');
    expect(screen.getByRole('link', { name: 'Review dimmer product documents' })).toHaveAttribute('href', '/resources?family=dimmers');
    expect(screen.getByRole('link', { name: 'Ask a product question' })).toHaveAttribute('href', '/contact?topic=technical');
    expect(document.title).toBe(findPost(slug).title + ' | FAHINT');
  });

  it('keeps both models and load units tied to the published catalog without inventing compatibility', () => {
    const post = findPost(slug);
    expect(post).toBeDefined();
    const table = post.body.find(block => block.type === 'table');
    expect(table.rows).toHaveLength(2);
    for (const [model, supply, control, load] of table.rows) {
      const product = findCatalogProduct('dimmers', model.href.split('/').pop());
      expect(product?.sku).toBe(model.label);
      const fields = Object.fromEntries(product.specificationGroups.flatMap(group => group.rows));
      expect(supply).toContain(fields['Operating voltage']);
      expect(supply).toContain(fields['Current rating']);
      expect(control).toContain(fields['Control method']);
      expect(control).toContain(fields['Circuit configuration']);
      for (const label of ['LED / CFL load', 'Incandescent load', 'Maximum load']) {
        if (fields[label]) expect(load).toContain(fields[label]);
      }
    }
    const text = post.body.map(block => block.text || '').join(' ');
    expect(text).toContain('600W incandescent limit is not an LED rating');
    expect(text).toContain('specified in VA, not as a 600W LED dimmer');
    expect(text).toContain('do not specify a forward-phase or reverse-phase type');
    expect(text).toContain('do not publish the control-circuit current capacity or maximum driver count');
    expect(text).toContain('not a report of tests already completed by FAHINT');
    expect(text).not.toMatch(/works with all|guaranteed flicker-free|universally compatible/i);
    expect(post.coverCaption).toMatch(/illustrat/i);
    expect(post.coverSource).toMatch(/illustrat/i);
    const sources = post.sources.filter(source => source.href.startsWith('https:'));
    expect(sources).toHaveLength(4);
    expect(new Set(sources.map(source => new URL(source.href).hostname)).size).toBe(3);
  });

  it('appears in Blog alongside the existing USB guide', () => {
    render(wrap(<Blog />));
    expect(screen.getByRole('link', { name: 'Dimmer Buying Guide: LED Loads and 0–10V Compatibility' })).toHaveAttribute('href', path);
    expect(screen.getByRole('link', { name: 'USB Wall Outlet Buying Guide: Ports, PD and Power' })).toHaveAttribute('href', '/blog/usb-wall-outlet-buying-guide');
    expect(screen.getByRole('status')).toHaveTextContent('8 articles');
  });

  it('is linked from the dimmer family buying guide', () => {
    render(wrap(<BuyingGuide line="dimmers" />));
    expect(screen.getByRole('link', { name: 'Read the dimmer buying guide' })).toHaveAttribute('href', path);
  });

  it('is linked from Resources without removing the USB guide or document downloads', () => {
    render(wrap(<Resources />));
    expect(screen.getByRole('link', { name: 'Read the dimmer buying guide' })).toHaveAttribute('href', path);
    expect(screen.getByRole('link', { name: 'Read the USB outlet buying guide' })).toHaveAttribute('href', '/blog/usb-wall-outlet-buying-guide');
    expect(screen.getAllByRole('link', { name: /^Download .* PDF$/ })).toHaveLength(7);
  });
});
```

- [x] Add this test at the start of the published-page describe in `src/prerender.test.jsx`:

```jsx
  it('prerenders the dimmer guide with base-safe model and document links', async () => {
    const html = await renderPage('/blog/dimmer-buying-guide-led-0-10v', '/fahint-electric-website/');
    expect(html).toContain('FAHINT dimmer model comparison');
    expect(html).toContain('<table>');
    expect(html).toContain('600VA');
    expect(html).toContain('Dimmer quotation checklist');
    expect(html).toContain('href="/fahint-electric-website/products/dimmers/dm2010"');
    expect(html).toContain('href="/fahint-electric-website/products/dimmers/dm2010s"');
    expect(html).toContain('href="/fahint-electric-website/resources?family=dimmers"');
    expect(html).not.toContain('Loading page…');
  });
```

- [x] Run `npm test -- src/pages/DimmerBuyingGuide.test.jsx src/prerender.test.jsx`. Expect six new failures caused by the missing article/model table/discovery links, with all existing SSR tests passing. Do not accept syntax/import errors as the red phase.

## Task 2: Add the guide through existing rendering

- [x] Create `src/data/dimmerBuyingGuide.js` with this complete content:

```js
// Buyer guide based on primary references and the published FAHINT dimmer records.
export const dimmerBuyingGuide = {
  "slug": "dimmer-buying-guide-led-0-10v",
  "title": "Dimmer Buying Guide: LED Loads and 0–10V Compatibility",
  "excerpt": "Compare LED load limits, control methods and sample checks. Use FAHINT DM2010 and DM2010S references to prepare a dimmer specification and quotation request.",
  "date": "2026-10-04",
  "updated": "2026-10-04",
  "readMinutes": 6,
  "category": "Buying Guide",
  "cover": "assets/images/home-installations/dm2010-living-installed-v1.webp",
  "coverAlt": "A white slide dimmer beside a living-room doorway in an illustrated interior.",
  "coverCaption": "Illustrated dimmer application. The scene does not verify compatibility with a particular lamp or driver.",
  "coverSource": "Existing FAHINT application illustration — home-installations/dm2010-living-installed-v1.webp",
  "coverWidth": 1536,
  "coverHeight": 1024,
  "sources": [
    {
      "label": "Leviton — Dimmer Buying Guide (industry reference)",
      "href": "https://leviton.com/content/dam/leviton/residential/product_documents/none/leviton-dimmer-buying-guide.pdf"
    },
    {
      "label": "Leviton — 0–10V load requirements (industry reference)",
      "href": "https://leviton.com/support/resources/product-support/dimmers-and-switches/dimmers/what-loads-do-the-0-10v-dimmers-control"
    },
    {
      "label": "Lutron — Application Note 487: LED and CFL load limits (industry reference)",
      "href": "https://support.lutron.com/us/en/product/radiora3/article/system-design-setup/app-note-487-minimum-and-maximum-loads-for-led-and-cfl-lamps-fixtures"
    },
    {
      "label": "Legrand — Guide to LED Dimming Controls in the Home (industry reference)",
      "href": "https://www.legrand.us/ideas/blogs/residential-dimming-guide"
    },
    {
      "label": "FAHINT — DM2010 model specifications and drawings",
      "href": "/products/dimmers/dm2010"
    },
    {
      "label": "FAHINT — DM2010S model specifications and drawings",
      "href": "/products/dimmers/dm2010s"
    }
  ],
  "body": [
    {
      "type": "p",
      "text": "Choose a dimmer around the lamp or driver it will control. First confirm the required control method, then the supply voltage and load-specific limits. Review the intended circuit and agree on sample checks before approving the model. A matching face style or a wattage below the maximum is not enough to establish compatibility."
    },
    {
      "type": "p",
      "text": "This guide helps distributors, private-label buyers and project purchasers prepare a dimmer specification. The FAHINT examples use published model records. The industry references explain selection principles; they do not establish FAHINT compatibility, certification or test results."
    },
    {
      "type": "h2",
      "text": "Start with the lamp or driver"
    },
    {
      "type": "p",
      "text": "Ask for the manufacturer, complete model number and data sheet of the proposed lamp or fixture. For a fixture with a separate driver, include the driver model too. Record the number of lamps or drivers connected to each control, not only the total quantity for the project."
    },
    {
      "type": "p",
      "text": "Check that the intended light source is identified as dimmable and obtain its dimming requirements. Leviton’s guide treats the lamp and dimmer as a pair to be selected together. A dimmable label does not identify every control that will work with that lamp.",
      "source": 0
    },
    {
      "type": "h2",
      "text": "Match the control method"
    },
    {
      "type": "p",
      "text": "Phase control and 0–10V are different control methods. Do not assume a driver accepting one will accept the other. For a 0–10V system, confirm the driver or ballast is specified for that control signal. Leviton makes this distinction when describing the loads for its 0–10V dimmers.",
      "source": 1
    },
    {
      "type": "p",
      "text": "FAHINT DM2010S publishes a 0–10V DC analog control output and requires a compatible driver. DM2010 is published as a digital slide dimmer, but its current model references do not specify a forward-phase or reverse-phase type. Request that detail when the lamp or driver calls for a particular phase-control method; do not infer it from the word “digital”."
    },
    {
      "type": "h2",
      "text": "Read the rating for the load you have"
    },
    {
      "type": "p",
      "text": "Use the lamp’s actual input wattage, not the larger “equivalent wattage” used to compare brightness with an incandescent lamp. Legrand’s guide distinguishes these figures when explaining the total load connected to a dimmer.",
      "source": 3
    },
    {
      "type": "p",
      "text": "For DM2010, the published LED/CFL range is 5–200W; the incandescent range is 20–600W. The 600W incandescent limit is not an LED rating. Keep the load type beside the value throughout the quotation and sample review."
    },
    {
      "type": "p",
      "text": "Total wattage is a starting check, not proof of compatibility. Lutron’s Application Note 487 explains why the lamp model and its electrical behavior affect minimum and maximum loading. Do not calculate an approved lamp count from wattage alone.",
      "source": 2
    },
    {
      "type": "h2",
      "text": "Compare DM2010 and DM2010S"
    },
    {
      "type": "p",
      "text": "These two controls have similar faces but different published electrical specifications. Use the table to choose which model to investigate, then open its full specifications and original drawings."
    },
    {
      "type": "table",
      "caption": "FAHINT dimmer model comparison",
      "columns": [
        "Model",
        "Supply and current",
        "Control / circuit",
        "Published load"
      ],
      "rows": [
        [
          {
            "label": "DM2010",
            "href": "/products/dimmers/dm2010"
          },
          "120V AC · 60Hz; 5A",
          "On/off slide dimmer; Single-pole / 3-way",
          "LED / CFL: 5–200W; Incandescent: 20–600W"
        ],
        [
          {
            "label": "DM2010S",
            "href": "/products/dimmers/dm2010s"
          },
          "120 / 277V AC · 60Hz; 5A at 120V AC · 2A at 277V AC",
          "On/off slide dimmer · 0–10V; Single-pole / 3-way",
          "600VA maximum; compatible 0–10V driver required"
        ]
      ]
    },
    {
      "type": "p",
      "text": "DM2010S is specified in VA, not as a 600W LED dimmer. Check the current limit for the selected supply voltage as well as the load rating. Its current references do not publish the control-circuit current capacity or maximum driver count; request both before approving several drivers on one control."
    },
    {
      "type": "p",
      "text": "Neither the table nor the similar appearance makes the models interchangeable. Keep the full designation, including the S suffix, on the inquiry and sample approval.",
      "links": [
        {
          "label": "Browse FAHINT dimmer models",
          "href": "/products/dimmers"
        }
      ]
    },
    {
      "type": "h2",
      "text": "Confirm the circuit and physical fit"
    },
    {
      "type": "p",
      "text": "Both FAHINT models list single-pole / 3-way configurations. That label does not authorize two dimmers on one circuit or arbitrary multi-location control. Specify the number of control locations and have the proposed arrangement checked against the approved instructions."
    },
    {
      "type": "p",
      "text": "Ask a qualified professional to review supply voltage, conductor requirements, wall-box space and any multi-gang derating conditions. Use the drawing for the exact model to check dimensions and the intended wallplate. Do not infer neutral requirements or installation clearances from a similar-looking device."
    },
    {
      "type": "p",
      "text": "Confirm the finish, plate and items included in the proposed pack. Request model-specific instructions and certification documents for the ordered configuration and market. A marking or file number is not evidence that a particular lamp has passed compatibility testing.",
      "links": [
        {
          "label": "Review dimmer product documents",
          "href": "/resources?family=dimmers"
        }
      ]
    },
    {
      "type": "h2",
      "text": "Agree on the sample checks"
    },
    {
      "type": "p",
      "text": "Before approving an order, agree on checks using the intended lamp or driver and planned quantity per control. Assess startup, brightness changes across the range, the lowest usable level, visible flicker, audible noise and switching from the intended control locations. Record the exact combination used and the acceptance criteria."
    },
    {
      "type": "p",
      "text": "Low-end performance is a separate requirement from the maximum load. Legrand notes that dimming range varies with the light source. Ask for the required behavior to be demonstrated; the FAHINT references do not establish a minimum dimming percentage or a universal flicker-free result.",
      "source": 3
    },
    {
      "type": "p",
      "text": "These are proposed sample-review checks, not a report of tests already completed by FAHINT. Electrical setup and any site diagnosis belong with qualified professionals. This guide does not replace the device’s approved installation instructions."
    },
    {
      "type": "h2",
      "text": "Prepare a useful quotation request"
    },
    {
      "type": "p",
      "text": "Include the following so open compatibility questions can be resolved before the model is approved:"
    },
    {
      "type": "list",
      "label": "Dimmer quotation checklist",
      "items": [
        "Full dimmer model numbers and quantities, keeping DM2010 and DM2010S separate.",
        "Destination market, supply voltage and frequency, plus the control method required by the lighting system.",
        "Lamp or fixture manufacturer, complete model, driver model where applicable, and the relevant data sheets.",
        "Load type, actual input rating and planned lamp or driver quantity per control.",
        "Number of control locations and any installation or multi-gang constraints identified by the project’s qualified professional.",
        "Device finish, wallplate style, pack contents, packaging and authorized brand-marking requirements.",
        "Required sample checks, acceptance criteria, model documents and requested delivery timing."
      ]
    },
    {
      "type": "p",
      "text": "Sample arrangements, minimum order quantities, customization and lead times are confirmed in the quotation. Continue from a model page to add it to the existing inquiry list, or use the product-question link below for an unresolved specification. The approved sample and agreed model documents remain the basis for the order."
    }
  ]
};
```

- [x] In `src/data/posts.js`, import and register:

```js
import { usbBuyingGuide } from './usbBuyingGuide.js';
import { dimmerBuyingGuide } from './dimmerBuyingGuide.js';

export const posts = [
  dimmerBuyingGuide,
  usbBuyingGuide,
```

Keep every other post unchanged.

- [x] In `src/pages/Blog.test.jsx`, set `expect(posts).toHaveLength(8)`; set the distinct-cover `size` expectation to `8`; extend illustration detection to `/application|product-gfci|product-usb|home-installations/` and expect `6` illustrations.
- [x] In the existing USB guide Blog test, change only `'7 articles'` to `'8 articles'`.
- [x] Review the article against the approved source matrix. Keep model-specific and industry statements separate. Verify both load ranges, VA units, unsupported phase type, missing driver-count data and sample-test boundaries.
- [x] Apply copy-editing passes for structure, clarity, evidence, line editing and headline/SEO. Keep the restrained B2B voice; do not add urgency, testimonials, guarantees, legal claims or customer-project claims.

## Task 3: Connect the three entry points

- [x] Replace only `buyingGuides.dimmers.resource` with:

```js
resource: { label: 'Read the dimmer buying guide', to: '/blog/dimmer-buying-guide-led-0-10v' },
```

- [x] In Resources, immediately after the existing USB guide paragraph add:

```jsx
        <p className="resources-scope-note">
          Choosing lighting controls?{' '}
          <Link className="company-text-link" to="/blog/dimmer-buying-guide-led-0-10v">Read the dimmer buying guide <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </p>
```

Preserve the USB guide, all document downloads and filter behavior.

- [x] Before `</urlset>` in the public sitemap add:

```xml
  <url><loc>https://www.fahint.com/blog/dimmer-buying-guide-led-0-10v</loc></url>
```

- [x] Run `npm test -- src/pages/DimmerBuyingGuide.test.jsx src/pages/Blog.test.jsx src/pages/UsbBuyingGuide.test.jsx src/pages/Resources.test.jsx src/prerender.test.jsx src/deployment.test.js`. All tests must pass.
- [x] Inspect the scoped diff; no extra rendering/style/parameter changes.

## Task 4: Verify the local production output

- [x] Run `npm test` and `npm run build`. Require a passing complete suite and successful public-page generation.
- [x] Inspect the generated article HTML: one H1; seven content headings; a two-model/four-column table; seven quotation checklist items; proper title, description and Article metadata; complete text before hydration.
- [x] Confirm asset exists and cover caption visibly says illustration. Existing model documents are linked rather than copied.
- [x] Reuse the running preview at `http://127.0.0.1:4176/blog/dimmer-buying-guide-led-0-10v` if available. Do not terminate another preview.
- [x] Use the Playwright skill and cached CLI for desktop 1440 × 1000 and mobile 390 × 844. Inspect opening and table screenshots; verify no page-level overflow and keyboard-focusable local table scrolling.
- [x] Click Blog, dimmer-family and Resources entries to the guide. Click both model links and the dimmer document link. Do not submit inquiries or change saved selections.
- [x] Check browser console errors. Preserve running preview; close only the browser session created for this check.
- [x] Record verification results here. Run staged diff checks and commit only listed source/test/docs files.
- [x] Request the Codex preview tab and provide the direct URL. Keep the branch and local commit; no push, merge, deployment, domain or email changes.

## Plan self-review

The seven approved sections, four external references, two model links and three discovery entries are fully defined. Existing renderer supports all required block shapes and metadata uses the registered post. Table assertions check actual catalog fields, not invented expected units. Screenshot provenance is explicit. No scope expansion or unresolved implementation choices.

## Verification results — 2026-10-04

- Red phase: the six new guide/entry/SSR checks failed for missing content; the 20 existing SSR checks passed.
- Focused green phase: 97 tests passed across six files.
- Full regression suite: 902 tests passed across 46 files. Production build generated 178 public pages and the 404 fallback.
- Generated HTML contains one H1, seven article sections, the two-model/four-column table and seven quotation checklist items, plus the existing source and inquiry sections. Title, description and Article headline/date metadata match the new post; the full content is present before hydration. The local build intentionally uses the existing unset-site-URL behavior; no domain settings were changed.
- Desktop 1440 × 1000 and mobile 390 × 844 screenshots inspected. Page widths equal their viewports; the mobile table has a 340px viewport over 640px content and keyboard ArrowRight moves its scroll position from 0 to 40 while retaining focus.
- Clicked all three discovery entries, both model table links, the dimmer-family link and the family-filtered document link. Resources correctly keeps Dimmers selected and shows its existing document-request state (no fabricated dimmer PDF). No inquiry was submitted and no saved selection was changed.
- Browser console: zero errors and warnings. Closed only the `dimmer-guide` browser session. The previous preview was no longer listening, so a hidden local preview was started on the same port 4176 and left running.
- QA screenshots: `output/playwright/dimmer-guide/desktop-opening.png`, `desktop-table.png`, `mobile-opening.png`, `mobile-table.png` (ignored local output).
- The new article reuses existing rendering, styles and illustration; no dependency, parameter, domain, email or deployment changes. Preserve the current branch and keep this implementation local.
