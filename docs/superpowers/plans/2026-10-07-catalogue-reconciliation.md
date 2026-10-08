# Catalogue and product-library reconciliation

Date: 2026-10-07. Scope: the user's nine product-data requests; certification work is deferred. Preserve all pre-existing local changes. No commit, push or deployment in this request.

## Evidence and decisions

- The supplied `FAHINT PRODUCT CATALOG -Louis 13MB.pdf` is byte-identical to the website download (SHA-256 B5FB21A32DC2B073CC676DF5D28387FF67FCEE341D435A8850968F98B5469CA6).
- PDF p.17 governs CR15 (15A 125V/250V), CR20/CD20 (20A 125V/250V), Industrial Grade, side/back wiring. Remove conflicting legacy NEMA claims; a voltage label alone does not establish plug compatibility. CD20's user-specified photograph shows two opposed T slots.
- Use C15/C15Q/C20, CT15/CT15Q/CT20, CW15/CW15Q/CW20 for public commercial model names. Keep existing URLs and original-library keys; accept old names in saved inquiry context/search. Do not infer certificate coverage from renaming.
- PDF pp.28/30 and `07-Wallplates/BS1801+BS1802/副图-*尺寸.png`: BS1801 70×115×6.5 mm (glossy/matte); BS1802 80×124×6.5 mm (glossy). These are separate models. No evidence identifies two material variants; show material confirmation, not an inferred PC/thermoset assignment.
- PDF p.6: GTN15/GTN20 have no feed-through terminals and nylon front/base/buttons. Keep incompatible legacy feed-through drawings withheld.
- `04-Standard Receptacle/副图/7.png`: shared range drawing, 106 mm overall height, 33.2 mm width, 23.8 mm depth; do not present it as a model-specific approved installation drawing. Attach to R15/R15Q/R20 with scope caption.
- `02-USB Outlet/主图/4200mA/5.png`: shared non-65W reference, width 43.5, body height 69, depth 44.7, recessed depth 37.5, mounting pitch 83.5, tab spacing 23.8, face 33.1×66.5 mm. It does NOT give overall height. Six models retain p.10 combined 5V/4.2A/21W output; individual-port limits remain unconfirmed.
- PDF pp.15–18: non-Q side/back, Q side/push-in; p.18 explicitly limits 15A push-in to #14 AWG. No terminal torque/strip-length values to invent.
- PDF p.13 and both dimmer folders: preserve different loads/control methods; retain each model's dimension and wiring images. Add source-backed operating temperature −20–40°C and recessed depth 21.5 mm. No unsupported derating or compatibility claims.

## Implementation sequence

1. Add failing regression tests for canonical commercial names/old links/inquiries, industrial ratings, scoped drawings, wallplate sizes/material limits, Q wiring and dimmer references.
2. Reuse the existing per-family import script for reviewed drawing assets; retain original catalog and source JSON records. Make corrections in the shared normalization layer, not individual pages.
3. Update buying guides and line summaries that otherwise repeat obsolete names, dimensions or missing-drawing statements. Retain current certificate scope without expanding it.
4. Update the factory request checklist with resolved items and remaining material/installation-document gaps.
5. Run focused tests, the full suite and production build; visually check representative desktop/mobile product pages and inquiry context. Report only verified outcomes.

## Verification record

- TDD: the new regression cases initially failed on the old industrial ratings, commercial names, missing dimension references, wallplate material claims and legacy inquiry context; focused tests then passed after implementation.
- Full test suite: `npm test` passed, 50 files / 970 tests.
- Production build: `npm run build` passed; 181 published pages and the 404 page prerendered.
- `git diff --check` passed (existing LF/CRLF notices only).
- Browser verification against the production preview at `http://127.0.0.1:4174/`: eight desktop/mobile cases passed for CT15Q through its old URL, CD20, R15, BS1802, FTR15C-4200, DM2010S, GTN15 and the old RT15Q-C inquiry URL with the black finish. Checked expected content, image loading, horizontal overflow and page errors; visually reviewed all eight screenshots in `output/playwright/catalog-*.png`.
- CD20's supplied white product photograph matches the existing asset `edcc41a6bd0fac09.webp`; retained the correct existing imagery rather than duplicating it.
- Remaining evidence limits: wallplate material/variant mapping, approved GTN installation drawings, USB 4200 individual-port limits/overall height, and unpublished terminal/derating details require confirmation. Certification review remains deferred.
- Changes are local only; no commit, push, merge or deployment performed for this request.
