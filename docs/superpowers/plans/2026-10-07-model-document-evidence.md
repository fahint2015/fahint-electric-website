# Model-to-document evidence — 2026-10-07

## Purpose and scope

First implementation after reviewing the supplied GEO marketing PDF: make existing product claims easier for buyers and search systems to check against original documents. Reuse the current product pages, purchasing checklists and resource library. Do not add bulk articles, new schema claims, dependencies, domain changes or email configuration. No commit, push or deployment is authorized by this implementation request.

An archived PDF naming a model is **not** a live certification-status check. Missing correspondence in this library is **not** evidence that a product is uncertified. Finish coverage and the ordered configuration still require confirmation.

## Source check

Read the complete supplied PDFs under `public/assets/documents/certificates/` and visually checked their model addenda. Page numbers below are PDF page positions, not a live issuer lookup.

| Document | Report / issue date | Model pages | Matching boundary |
| --- | --- | --- | --- |
| ul-gfci.pdf | E504391-20210212 / August 16, 2022 | 2, 4 | GF15, GF20, GT15, GT20, GTN15, GTN20, GW15, GW20; not GL20 |
| ul-usb.pdf | E498095-20180426 / April 26, 2022 | 2, 3, 5, 6 | Exact FTR15/FTR20, C/DC and 3100/3600 designations plus FTR15QC/FTR20QC; no inferred 4200/5000, wattage suffixes or F4P |
| ul-receptacle.pdf | E498095-20211123 / December 13, 2021 | 2, 4 | Eighteen exact D/DT/DW and R/RT/RW designations; no inferred -C suffix or CR/CD models |
| ul-switch.pdf | E528137-20241016 / October 18, 2024 | 2, 4 | DS15, DS15.3, T15 only; preserve punctuation |
| ul-wallplate.pdf | E501377-20230919 / September 25, 2023 | 2, 4 | Eight listed base models; retain finish caveat |
| ul-wallplate-2018.pdf | E501377-20181016 / August 16, 2022 | 2, 4 | BS1801–BS1804 base models; retain finish caveat |

ISO 9001 is a management-system document, not a model certificate. The existing source-data audit remains at `docs/product-data-audit-2026-10-06.md`; its unresolved factory-confirmation items are outside this change.

## Implementation checklist

- [x] Inspect existing components, model data, original PDFs and relevant test baseline (398 tests passed).
- [x] Add failing tests for exact matching, absent suffixes, model-context safety, PDF destinations and purchasing links.
- [x] Extend `src/data/certificates.js` with report references and explicit model lists; reuse one conservative lookup in catalog data, purchasing notes and documentation sections.
- [x] Update `Resources.jsx`, `ProductTechnicalSections.jsx`, `CatalogProductSections.jsx` and `BuyingGuide.jsx` without replacing their layouts. Expose original PDFs and dates; retain model-specific request links.
- [x] Run focused tests, complete tests, production build and representative desktop/mobile checks. Check rendered HTML contains evidence text and base-safe PDF links.
- [x] Record results and remaining evidence gaps below. Leave changes local for review.

## Verification commands

Use the bundled Node executable with `node_modules/vitest/vitest.mjs run` (focused paths first, then the full suite), followed by `node_modules/vite/bin/vite.js build` and `scripts/prepare-pages.mjs`. Review matched and unmatched USB models, GFCI, switch and wallplate cases. Check a project-base build as well as the default root configuration.

## Results

- Red check: 29 expected failures against the old implementation (missing lookup/metadata, incorrect scan assignment, image rather than PDF destinations, missing notes/links). Existing behavior otherwise passed.
- Final complete suite: **955 tests, 49 files passed**. Includes HTML evidence at both root and project bases, exact suffix boundaries, wallplate finish caveats, GL20 review status, invalid/draft/cross-family URLs and request-model continuity.
- Root and `/fahint-electric-website/` production builds passed; each prerendered 180 published pages and the 404 fallback. Checked the actual project-base product HTML contains the dated evidence text and correct PDF URL.
- All seven certificate/quality PDFs returned HTTP 200 and a `%PDF-` signature from the local preview.
- Chrome review at 1440 px desktop and 390 px mobile: resource context, document disclosure, absent-model notice, matched switch certificate and dark-background buying links. No horizontal overflow or console errors on the reviewed pages. A real click from the FTR15-5000 documentation request opened the technical contact form with that model selected; no inquiry was sent.
- Screenshots and PDF render checks are local ignored artifacts under `output/playwright/model-document-evidence/` and `output/qa/model-document-evidence/`.
- Existing pricing, electrical specifications, inquiry/email behavior, canonical-domain configuration and original source PDFs are unchanged. No dependencies added. No commit, push or deployment performed.

## Remaining factory-document gaps

This counts published website entries, including finish variants, **not distinct certified products**. A match only means the supplied addendum names the designation (or the wallplate base model).

| Family | Published entries | Supplied-document matches | Request / confirm next |
| --- | ---: | ---: | --- |
| GFCI | 9 | 8 | GL20 model documentation |
| USB outlets | 37 | 12 | Six 4200 entries, six 5000 entries, twelve QC-AC/DC wattage-suffix entries (20/36/65W), and F4P |
| Standard receptacles | 30 | 18 | Nine R/RT/RW -C entries plus CR15, CR20 and CD20 |
| Lighting switches | 6 | 3 | T15.3, DS1502 and DS1503; do not substitute DS15/T15 files or mix UL and supplier-stated ETL identifiers |
| Wallplates | 21 | 20 | BS1805; confirm finish designations for the other base-model matches |
| Dimmers | 2 | 0 | DM2010 and DM2010S documents for the intended market |
| Smart switches | 51 | 0 | Model/protocol/market-specific approvals; no standalone PDFs supplied in this library |
| Total | 156 | 61 | 95 entries need corresponding files or designation confirmation |

Prioritize USB wattage suffixes and the -C receptacle designation crosswalk. Request original issuer files and explicit model/configuration coverage; do not infer aliases from similar names. Current certification/mark authorization has not been checked with the issuer. This work improves traceability but makes no claim about search rankings or AI citations.
