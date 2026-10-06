# USB Buying Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking. The approved scope requires the main agent; do not delegate.

**Goal:** Publish one researched English USB buying guide locally, with seven verified model examples and existing buying-tool entry points.

**Architecture:** Keep the existing posts/BlogPost flow and add only native table/list rendering plus paragraph links. The new long-form post lives in one focused data file imported by posts; catalog data remains unchanged. Reuse BuyingGuide, Resources, metadata and prerendering without adding dependencies or services.

**Tech Stack:** React 18, React Router 6, Vite 5, Vitest/Testing Library, plain CSS.

---

Approved design: `docs/superpowers/specs/2026-10-04-usb-buying-guide-design.md`.
Continue in the existing `codex/prelaunch-buyer-tools` checkout as agreed for this batch. Preserve unrelated untracked files. No push, merge, deployment, domain or delivery-service changes.

## File map

- Create `src/data/usbBuyingGuide.js`: one sourced post, not a second catalog or content framework.
- Modify `src/data/posts.js`: import and list the new guide first.
- Modify `src/pages/BlogPost.jsx`: render native lists, tables and descriptive paragraph links.
- Modify `src/styles/company-pages.css`: article-only list/table styles and overflow containment.
- Modify `src/data/buyingGuides.js`, `src/pages/Resources.jsx`: visible article entry links.
- Modify `public/sitemap.xml`: one new route using the existing host.
- Modify `src/pages/Blog.test.jsx`, `src/prerender.test.jsx`; create `src/pages/UsbBuyingGuide.test.jsx`: targeted content, linking and server-body checks.
- The article's accepted full outline, seven-model values, source URLs and ten title candidates are in the approved design; no more market research or title-selection gate is needed.

## Task 1: Lock the new behavior with failing tests

- [x] Check the current branch and clean tracked baseline. Existing Blog/Resources/deployment tests: 66 passed.
- [x] Create `src/pages/UsbBuyingGuide.test.jsx`:

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

const slug = 'usb-wall-outlet-buying-guide';
const path = '/blog/' + slug;
const wrap = children => <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{children}</MemoryRouter>;

describe('Researched USB buying guide', () => {
  it('renders the sourced guide with an accessible, linked model table', () => {
    render(<MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes><Route path="/blog/:slug" element={<BlogPost />} /></Routes>
    </MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('USB Wall Outlet Buying Guide: Ports, PD and Power');
    const table = screen.getByRole('table', { name: 'FAHINT USB outlet shortlist' });
    expect(within(table).getAllByRole('row')).toHaveLength(8);
    expect(within(table).getAllByRole('columnheader')).toHaveLength(4);
    expect(within(table).getAllByRole('rowheader')).toHaveLength(7);
    expect(screen.getByRole('region', { name: 'FAHINT USB outlet shortlist' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByText(/Do not add the two port ratings together/)).toBeVisible();
    expect(screen.getByText(/four-port USB charger without AC receptacle openings/)).toBeVisible();
    expect(screen.getByRole('list', { name: 'USB outlet quotation checklist' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Browse USB outlet models' })).toHaveAttribute('href', '/products/usb-outlets');
    expect(screen.getByRole('link', { name: 'Compare A + C configurations' })).toHaveAttribute('href', '/products/usb-outlets?ports=a-c');
    expect(screen.getByRole('link', { name: 'View 65W PD models' })).toHaveAttribute('href', '/products/usb-outlets?charging=pd-65w');
    expect(screen.getByRole('link', { name: 'Review USB product documents' })).toHaveAttribute('href', '/resources?family=usb-outlets');
    expect(screen.getByRole('link', { name: /USB-IF/ })).toHaveAttribute('href', expect.stringContaining('usb.org'));
    expect(document.title).toBe(findPost(slug).title + ' | FAHINT');
  });

  it('keeps every shortlist model and charging figure tied to the published catalog', () => {
    const post = findPost(slug);
    expect(post).toBeDefined();
    const table = post.body.find(block => block.type === 'table');
    expect(table.rows).toHaveLength(7);
    for (const [model, ports, rating, charging] of table.rows) {
      const product = findCatalogProduct('usb-outlets', model.href.split('/').pop());
      expect(product?.sku).toBe(model.label);
      const summary = Object.fromEntries(product.specificationSummary);
      expect(ports).toBe(summary.Interfaces);
      expect(rating).toContain(summary.Receptacle || summary.Input);
      expect(charging.replaceAll(' ', '')).toContain(summary.Charging.replaceAll(' ', ''));
    }
    const content = post.body.map(block => block.text || '').join(' ');
    expect(content).toMatch(/USB-C connector does not by itself establish PD support/);
    expect(content).toMatch(/simultaneous-port power sharing is not published/);
    expect(content).not.toMatch(/130W|charges all|guaranteed|USB-IF certified/i);
    expect(post.coverCaption).toMatch(/illustrat/i);
    expect(new Set(post.sources.filter(source => source.href.startsWith('https:')).map(source => new URL(source.href).hostname)).size).toBe(4);
  });

  it('appears in the existing blog', () => {
    render(wrap(<Blog />));
    expect(screen.getByRole('link', { name: 'USB Wall Outlet Buying Guide: Ports, PD and Power' })).toHaveAttribute('href', path);
    expect(screen.getByRole('status')).toHaveTextContent('7 articles');
  });

  it('is linked from the USB family buying guide', () => {
    render(wrap(<BuyingGuide line="usb-outlets" />));
    expect(screen.getByRole('link', { name: 'Read the USB outlet buying guide' })).toHaveAttribute('href', path);
  });

  it('is linked from resources without replacing any document downloads', () => {
    render(wrap(<Resources />));
    expect(screen.getByRole('link', { name: 'Read the USB outlet buying guide' })).toHaveAttribute('href', path);
    expect(screen.getAllByRole('link', { name: /^Download .* PDF$/ })).toHaveLength(7);
  });
});
```

- [x] Run `npm test -- src/pages/UsbBuyingGuide.test.jsx`. Expect failures for missing guide, table and entry links, not import or syntax errors.
- [x] In `src/prerender.test.jsx`, add this case inside the published-page describe:

```jsx
it('prerenders the USB guide and preserves base-safe model and filter links', async () => {
  const html = await renderPage('/blog/usb-wall-outlet-buying-guide', '/fahint-electric-website/');
  expect(html).toContain('FAHINT USB outlet shortlist');
  expect(html).toContain('<table>');
  expect(html).toContain('FTR15QC-DC65W');
  expect(html).toContain('href="/fahint-electric-website/products/usb-outlets?ports=a-c"');
  expect(html).toContain('href="/fahint-electric-website/products/usb-outlets/f4p"');
  expect(html).toContain('USB outlet quotation checklist');
  expect(html).not.toContain('Loading page…');
});
```

- [x] Run that targeted prerender case with `npm test -- src/prerender.test.jsx -t "prerenders the USB guide"`; expect the missing-content assertion to fail.

## Task 2: Write the guide and add the minimum article rendering

- [x] Create the guide data with the following contract. Populate the approved seven sections as original English prose, using the primary research already reviewed. Include the exact seven approved models, quote checklist, four external references and own USB resource reference. The strings below define the real public title, route and required links:

```js
// Buyer guide based on the primary references and verified FAHINT model data.
export const usbBuyingGuide = {
  "slug": "usb-wall-outlet-buying-guide",
  "title": "USB Wall Outlet Buying Guide: Ports, PD and Power",
  "excerpt": "Compare USB ports, PD output, shared power and AC ratings. Use FAHINT model examples and a purchasing checklist to prepare your USB wall outlet inquiry.",
  "date": "2026-10-04",
  "updated": "2026-10-04",
  "readMinutes": 6,
  "category": "Buying Guide",
  "cover": "assets/images/editorial-home/product-usb-optimized.webp",
  "coverAlt": "USB charging outlet beside a laptop on a desk in an illustrated interior",
  "coverCaption": "Illustrated USB charging setup. The scene is not a device-compatibility or charging-performance test.",
  "coverSource": "Existing FAHINT application illustration — editorial-home/product-usb-optimized.webp",
  "coverWidth": 1600,
  "coverHeight": 889,
  "sources": [
    {
      "label": "USB-IF — USB Type-C terminology and capabilities",
      "href": "https://www.usb.org/sites/default/files/usb_type-c_language_product_and_packaging_guidelines_20230320.pdf"
    },
    {
      "label": "Leviton — USB outlet comparison brochure (industry reference)",
      "href": "https://leviton.com/content/dam/leviton/residential/product_documents/brochure/USB_Brochure.pdf"
    },
    {
      "label": "Legrand — radiant 65W USB outlet specifications (industry reference)",
      "href": "https://www.legrand.us/wiring-devices/radiant-collection/radiant-65w-usb-outlet-type-c-15a-tamper-resistant-black/p/rd-r26usbpd65bk"
    },
    {
      "label": "Eaton — USB receptacle range (industry reference)",
      "href": "https://www.eaton.com/us/en-us/catalog/wiring-devices-and-connectivity/usb-receptacles.html"
    },
    {
      "label": "FAHINT — USB product-family documents",
      "href": "/resources?family=usb-outlets"
    }
  ],
  "body": [
    {
      "type": "p",
      "text": "To choose a USB wall outlet, start with the devices and cables it needs to serve. Then compare the port arrangement, published USB output and simultaneous-port limits. Check the AC receptacle rating separately, followed by physical fit, model documentation and sample requirements."
    },
    {
      "type": "p",
      "text": "This guide is for distributors, private-label buyers and project purchasers selecting wiring devices for North American markets. The examples use FAHINT’s published model data. Industry references explain the selection questions; they do not establish FAHINT performance or certification."
    },
    {
      "type": "h2",
      "text": "Start with the devices and cables"
    },
    {
      "type": "p",
      "text": "Write a short charging brief before choosing a wattage. Will users bring USB-A cables, USB-C cables or both? Is the requirement one device at a time, or two devices charging together? A bedside charging point and a desk used with a laptop can have different requirements, even when the wall outlets look similar."
    },
    {
      "type": "p",
      "text": "Record the intended device models and their charging requirements from the device documentation. For a laptop, include its required USB-C Power Delivery profile rather than assuming any USB-C outlet will replace its charger. Ask for the proposed outlet to be checked with the intended devices and suitably rated cables during sample review."
    },
    {
      "type": "h2",
      "text": "USB-A, USB-C and PD are different choices"
    },
    {
      "type": "p",
      "text": "USB-C describes the connector; USB Power Delivery, or PD, describes a power capability that must be supported separately. A USB-C connector does not by itself establish PD support. Check the stated charging profiles instead of choosing by the shape of the port.",
      "source": 0
    },
    {
      "type": "p",
      "text": "For example, FTR15C-3100 combines USB-A and USB-C with a published combined output of 3.1A at 5V DC. It is a conventional 5V model, not one of the PD models in the FAHINT range. FTR15-3100 offers dual USB-A with the same published combined output.",
      "links": [
        {
          "label": "Compare A + C configurations",
          "href": "/products/usb-outlets?ports=a-c"
        }
      ]
    },
    {
      "type": "p",
      "text": "The dual USB-C FTR15QC-DC20W, FTR15QC-DC36W and FTR15QC-DC65W publish different PD output profiles. These are alternatives to investigate against the charging brief, not fixed categories for phones, tablets and laptops. Match the required voltage and current, not only the largest wattage printed in the name."
    },
    {
      "type": "h2",
      "text": "Separate single-port and shared output"
    },
    {
      "type": "p",
      "text": "Read three figures separately: the maximum for one port, the combined output for the device, and the allocation when multiple ports are occupied. Leviton’s ordering table separates single-port and combined power, which is a useful way to structure any USB outlet comparison.",
      "source": 1
    },
    {
      "type": "p",
      "text": "On FTR15C-3100, the published individual limits are 5V DC / 2.4A for USB-A and 5V DC / 3.0A for USB-C. The published combined limit is 3.1A at 5V DC. Those individual limits do not mean both ports can deliver their respective maximum currents together."
    },
    {
      "type": "p",
      "text": "For the FAHINT PD examples below, simultaneous-port power sharing is not published in the current model references. Each USB-C port has an advertised maximum, but that does not establish what both ports deliver together. Ask for the shared-output specification and a sample check if two-device charging is part of the brief."
    },
    {
      "type": "p",
      "text": "A higher advertised maximum is not a promise that every connected device charges faster. Use the device’s required profiles, the cable specification and the proposed charging combination as the basis for approval.",
      "links": [
        {
          "label": "View 65W PD models",
          "href": "/products/usb-outlets?charging=pd-65w"
        }
      ]
    },
    {
      "type": "h2",
      "text": "Choose the AC rating separately"
    },
    {
      "type": "p",
      "text": "The 15A or 20A designation describes the AC receptacle, not the speed of USB charging. FTR15QC-DC65W has a 15A, 125V NEMA 5-15R receptacle; FTR20QC-DC65W has a 20A, 125V NEMA 5-20R receptacle. Both publish USB-C output up to 65W, so the higher AC rating alone does not mean higher USB output."
    },
    {
      "type": "p",
      "text": "F4P is a four-port USB charger without AC receptacle openings. Its published input is 125V / 60Hz and its combined USB output is 5V DC / 4.2A / 21W. Keep USB-only chargers separate from combination receptacles when preparing an assortment."
    },
    {
      "type": "p",
      "text": "Have a qualified professional confirm the circuit, location and installation requirements. Selecting a USB charging function does not by itself establish any required ground-fault protection, weather resistance or suitability for a particular location."
    },
    {
      "type": "h2",
      "text": "A practical FAHINT shortlist"
    },
    {
      "type": "p",
      "text": "Use these seven examples to narrow the configuration, then open the model page for its specifications and available documents. They are reference choices, not a ranking or a tested compatibility list."
    },
    {
      "type": "table",
      "caption": "FAHINT USB outlet shortlist",
      "columns": [
        "Model",
        "USB ports",
        "AC rating / input",
        "Published USB output"
      ],
      "rows": [
        [
          {
            "label": "FTR15-3100",
            "href": "/products/usb-outlets/ftr15-3100"
          },
          "Dual USB-A",
          "15A,125V NEMA 5-15R",
          "3.1A, 5V DC combined"
        ],
        [
          {
            "label": "FTR15C-3100",
            "href": "/products/usb-outlets/ftr15c-3100"
          },
          "USB-A + USB-C",
          "15A,125V NEMA 5-15R",
          "3.1A, 5V DC combined"
        ],
        [
          {
            "label": "FTR15QC-DC20W",
            "href": "/products/usb-outlets/ftr15qc-dc20w"
          },
          "Dual USB-C",
          "15A,125V NEMA 5-15R",
          "USB-C up to 20W per port*"
        ],
        [
          {
            "label": "FTR15QC-DC36W",
            "href": "/products/usb-outlets/ftr15qc-dc36w"
          },
          "Dual USB-C",
          "15A,125V NEMA 5-15R",
          "USB-C up to 36W per port*"
        ],
        [
          {
            "label": "FTR15QC-DC65W",
            "href": "/products/usb-outlets/ftr15qc-dc65w"
          },
          "Dual USB-C",
          "15A,125V NEMA 5-15R",
          "USB-C up to 65W per port*"
        ],
        [
          {
            "label": "FTR20QC-DC65W",
            "href": "/products/usb-outlets/ftr20qc-dc65w"
          },
          "Dual USB-C",
          "20A,125V NEMA 5-20R",
          "USB-C up to 65W per port*"
        ],
        [
          {
            "label": "F4P",
            "href": "/products/usb-outlets/f4p"
          },
          "4 × USB-A",
          "125V 60Hz input; no AC receptacle",
          "5V DC · 4.2A · 21W combined"
        ]
      ]
    },
    {
      "type": "p",
      "text": "*PD figures are individual-port maxima from the published model references. Do not add the two port ratings together. Confirm the available output when both ports are used before specifying a multi-device charging requirement."
    },
    {
      "type": "p",
      "text": "On the USB models page, filter by ports, AC rating and charging output. Select two or three models for comparison, then add suitable models to your inquiry list. Record quantities and finishes there so the quotation request reflects the actual shortlist.",
      "links": [
        {
          "label": "Browse USB outlet models",
          "href": "/products/usb-outlets"
        }
      ]
    },
    {
      "type": "h2",
      "text": "Check fit, finish and documentation"
    },
    {
      "type": "p",
      "text": "Physical fit deserves its own check. Eaton highlights device depth in its USB range information. Include depth and wiring space in the review rather than treating the face dimensions as the whole device.",
      "source": 3
    },
    {
      "type": "p",
      "text": "Legrand’s 65W product page lists dimensions and wallplate requirements alongside electrical specifications. Apply that same separation when preparing your shortlist: the charging specification and the installation fit each need to be checked.",
      "source": 2
    },
    {
      "type": "p",
      "text": "Use the drawing for the exact FAHINT model, not a similar-looking device. Some models do not yet have a published original dimension drawing. Request the missing information rather than inferring it from another model, and confirm whether the intended wallplate is included or ordered separately."
    },
    {
      "type": "p",
      "text": "Approve the device finish and matching plate together. For branded packaging, confirm the authorized markings, artwork and pack format against the sample. Check the exact model designation and conditions in the relevant certificate, and confirm current status before ordering. ISO 9001 concerns the quality management system; it is not a product listing.",
      "links": [
        {
          "label": "Review USB product documents",
          "href": "/resources?family=usb-outlets"
        }
      ]
    },
    {
      "type": "h2",
      "text": "Prepare a useful quotation request"
    },
    {
      "type": "p",
      "text": "A clear brief gives the supplier enough information to resolve open questions before you approve an order. Include:"
    },
    {
      "type": "list",
      "label": "USB outlet quotation checklist",
      "items": [
        "Full model numbers and quantities for each configuration, rather than a request for “USB outlets” alone.",
        "Intended devices and cables, required output profiles, and whether two or more devices must charge at the same time.",
        "AC receptacle rating and configuration, or a clear statement that a USB-only charger is required.",
        "Device finish, wallplate style, physical-fit requirements and any missing drawings you need reviewed.",
        "Destination market and the model-specific documents or sample checks required by your project.",
        "Packaging, authorized brand markings and quantities by finish or pack format.",
        "Requested samples and delivery timing, with unresolved power-sharing or compatibility questions called out."
      ]
    },
    {
      "type": "p",
      "text": "Sample arrangements, minimum quantities, customization options and lead times are confirmed in the quotation. The guide helps prepare the request; the agreed model documents and approved sample remain the basis for the order."
    }
  ]
};
```

- [x] Register the post with `import { usbBuyingGuide } from './usbBuyingGuide.js';` and put `usbBuyingGuide,` first in the existing posts array.
- [x] Replace only the body map in BlogPost; keep old h2/p/source behavior. The implementation shape is:

```jsx
{post.body.map((block, index) => {
  if (block.type === 'h2') return <h2 id={'article-section-' + index} key={index}>{block.text}</h2>;
  if (block.type === 'list') return <ul className="reading-checklist" aria-label={block.label} key={index}>{block.items.map(item => <li key={item}>{item}</li>)}</ul>;
  if (block.type === 'table') return <div className="reading-table-scroll" role="region" aria-label={block.caption} tabIndex={0} key={index}>
    <table><caption>{block.caption}<span aria-hidden="true">Scroll sideways on smaller screens.</span></caption>
      <thead><tr>{block.columns.map(column => <th scope="col" key={column}>{column}</th>)}</tr></thead>
      <tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => {
        const content = typeof cell === 'string' ? cell : <SourceLink source={cell} />;
        return cellIndex === 0 ? <th scope="row" key={cellIndex}>{content}</th> : <td key={cellIndex}>{content}</td>;
      })}</tr>)}</tbody>
    </table>
  </div>;
  return <p key={index}>{block.text}
    {Number.isInteger(block.source) && post.sources[block.source] && <> <SourceLink className="reading-inline-source" source={post.sources[block.source]}>[Source]</SourceLink></>}
    {block.links?.map(link => <SourceLink className="reading-action-link" key={link.href} source={link} />)}
  </p>;
})}
```

- [x] Add only these article-scoped styles, refining if browser measurements show overflow:

```css
.reading-article { min-width:0; }
.reading-checklist { margin:24px 0 0; padding-left:24px; color:#344f63; font-size:18px; line-height:1.8; }
.reading-checklist li + li { margin-top:12px; }
.reading-action-link { display:block; width:fit-content; padding-block:8px; min-height:44px; font-size:16px; font-weight:600; }
.reading-table-scroll { max-width:100%; overflow-x:auto; margin-top:24px; border:1px solid var(--cp-line); border-radius:14px; }
.reading-table-scroll table { width:100%; min-width:640px; border-collapse:collapse; font-size:15px; line-height:1.6; }
.reading-table-scroll caption { padding:16px; text-align:left; font-weight:600; }
.reading-table-scroll caption span { display:block; color:var(--cp-muted); font-size:13px; font-weight:400; }
.reading-table-scroll th, .reading-table-scroll td { padding:14px 16px; text-align:left; vertical-align:top; border-top:1px solid var(--cp-line); }
.reading-table-scroll thead { background:var(--cp-paper); }
.reading-table-scroll th[scope="row"] { white-space:nowrap; }
.reading-table-scroll td { color:#344f63; }
```

- [x] Update old Blog tests: count 7 posts/covers; compare the GFCI article's title by slug, not array index; include `product-usb` in illustration detection (5 illustrations).
- [x] Run the article and existing Blog tests together with Task 3 entry-link tests. The combined targeted run passed after implementing the entry links; the initial six missing-guide/SSR/entry checks were confirmed red first.
- [x] Review the finished English text for structure, clarity, evidence, line editing and headline/SEO; use the copy-editing checklist without adding unsupported urgency, guarantees or certifications.

## Task 3: Make the guide discoverable

- [x] Replace the USB-only buying-guide resource:
```js
resource: { label: 'Read the USB outlet buying guide', to: '/blog/usb-wall-outlet-buying-guide' },
```
- [x] After the catalog block in Resources, add this paragraph using existing link styling; do not alter the document list:
```jsx
<p className="resources-scope-note">
  Choosing USB charging outlets?{' '}
  <Link className="company-text-link" to="/blog/usb-wall-outlet-buying-guide">Read the USB outlet buying guide <ArrowUpRight size={16} aria-hidden="true" /></Link>
</p>
```
- [x] Add before `</urlset>`:
```xml
  <url><loc>https://www.fahint.com/blog/usb-wall-outlet-buying-guide</loc></url>
```
- [x] Run `npm test -- src/pages/UsbBuyingGuide.test.jsx src/pages/Blog.test.jsx src/pages/Resources.test.jsx src/prerender.test.jsx src/deployment.test.js`; expect all green.
- [x] Commit only planned files after inspection; retain all unrelated files.

## Task 4: Verify locally and hand off

- [x] Run the complete existing `npm test` suite and `npm run build`.
- [x] Inspect new root HTML: complete article, one H1, table/list, Article metadata, original source links, no loading placeholder.
- [x] Use the existing preview at `http://127.0.0.1:4176/blog/usb-wall-outlet-buying-guide`; start it only if absent.
- [x] Browser check at desktop and 390px mobile: readable table, keyboard-focusable local scrolling, no body overflow, correct article entry points, A+C filter link restores filters. Preserve existing compare/inquiry state; do not submit anything.
- [x] Existing prerender test verifies the GitHub Pages subpath; do not change domain configuration or re-run slow-network benchmarks for this content-only change.
- [x] Run `git diff --check`, inspect scoped diff, record tests and preview URL in this plan, commit finished local changes. No remote mutation.
- [x] Request opening the article preview in Codex (queued by the app); provide the preview URL and local-only status in the handoff.

## Self-review

All seven content sections, seven model references, four external references, three entry points, native table/list accessibility, metadata/prerender and sitemap checks are mapped above. Local editing is authorized by the approved design. No new product claims, tool state changes, dependencies or deployment are included.

## Execution results — 2026-10-04

- Implemented one researched guide, seven linked FAHINT model examples, a quotation checklist, three discovery entry points and sitemap coverage. Existing website colors and rounded styling are retained; no new dependencies or comparison/inquiry state behavior.
- Baseline: 66 tests passed. Red phase: six new missing-guide/entry/SSR checks failed as expected. Targeted green phase: 91 tests passed.
- Final full suite: **896 tests passed in 45 files**. Production build succeeded with **177 public pages and a 404 page**.
- Built HTML contains one H1, all seven model rows, all seven checklist items and Article metadata. The prerender test also confirms GitHub Pages subpath-safe model and filter links.
- Browser QA: desktop 1440 × 1000 and mobile 390 × 844. No page-level horizontal overflow (mobile document width 390px). The model table scrolls locally (340px container / 640px content); keyboard ArrowRight moved it by 40px while focused. Desktop/mobile screenshots were inspected.
- Blog → guide, USB buying-guide entry → guide, Resources → guide all passed. The A+C action opens the correct USB filter with “USB-A + USB-C” selected and 14 of 37 models. Browser console: zero errors or warnings.
- Five editing passes covered structure, clarity, evidence, line editing and headline/SEO. Competitor references explain selection concepts only; FAHINT ratings come from the local model records. Unpublished dual-port sharing, compatibility, MOQ and lead times are not invented.
- `git diff --check` passed. Only the planned files are included in the local implementation commit; unrelated untracked files are preserved.
- Preview: http://127.0.0.1:4176/blog/usb-wall-outlet-buying-guide
- The app queued the preview-open request. Keep the existing preview server running. No remote push, merge, deployment, domain change, email setup or real inquiry submission.
