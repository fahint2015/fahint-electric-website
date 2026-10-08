# Catalogue search and material follow-up · 2026-10-07

## Scope

Implement the user's six-point follow-up in the current checkout. Preserve the existing layout, earlier uncommitted work, promotional figures, GTN15/GTN20 records and certificate coverage. Do not commit, push or deploy this turn.

1. Add regression tests for exact legacy commercial-name searches in both catalogue views, including filter/reset behavior. Reuse the existing sourceModel-to-sku mapping and keep old product URLs.
2. Show an explanatory old-name/current-catalog-name message only for an exact alias match. Do not silently change the search input or create duplicate products.
3. Update BS1801, BS1801-M and BS1802 material to Polycarbonate (PC), with finish recorded separately. Keep the documented dimensions and glossy/matte availability.
4. Clarify that all six USB 4200 models already appear on catalogue PDF page 10. Do not invent per-port limits or simultaneous output allocations.
5. Add concise, attributed industry examples to the existing receptacle and dimmer guides. Borrow the distinction between specification fields, not another manufacturer's limits or installation instructions.
6. Run focused regressions, the complete test suite, a production build and targeted desktop/mobile browser checks. Update the document-request status.

## Evidence reviewed

### FAHINT originals

- `D:/国际站运营平台/方特插座/FAHINT PRODUCT CATALOG -Louis 13MB.pdf`: page 10 lists FTR15-4200, FTR15C-4200, FTR15DC-4200 and the three corresponding 20A models; USB output 5V, 4.2A, 21W. It does not state individual port current limits or a simultaneous allocation table.
- `D:/国际站运营平台/方特插座/产品图片/07-Wallplates/详情页+副图/副图800/7.jpg` and `images/详情页_06.jpg`: material explicitly labelled PC. No new fire-rating or certification claim is added from these graphics.
- `D:/国际站运营平台/方特插座/产品图片/07-Wallplates/详情页+副图/副图800/9.png`: Glossy / Matte is described as two types of materials, but those words name surface finishes, not two polymer types.
- Same folder `副图800/2.png`: regular size Glossy/Matte; medium size Glossy. Catalogue pages 28/30 and the existing dimension drawings remain the size references.
- Preserve the archived legacy JSON; correct its conflicting Thermoset material only in the normalized BS1801/BS1802 records using the newly reviewed PC source.

### Primary industry references (reviewed 2026-10-07)

- [Leviton 5325-GY](https://leviton.com/products/5325-gy): distinguishes side-terminal and Quickwire conductor requirements. Reference structure only; its conductor/torque limits are not FAHINT specifications.
- [Leviton SureSlide 6674-P0W](https://leviton.com/products/6674-p0w): comparable slide-control format; not proof of DM2010 electrical design or compatibility.
- [Eaton DF10P technical data, page 2](https://www.eaton.com/content/dam/eaton/products/wiring-devices-and-connectivity/wiring-devices/dimmers/decorator-0-10v-dimmer-spec-sheet.pdf): lists switched-lamp rating separately from 0–10V control-circuit current. Do not copy either value into DM2010S.
- [Lutron DVCLN-153P instructions, page 1](https://assets.lutron.com/a/documents/0302209.pdf): multi-gang table depends on load type and gang count. Do not transfer its derating values to DM2010/DM2010S.

## Verification

- Completed the exact-alias search and explanation in both catalogue views; old model URLs remain unchanged. Exact old-name matching respects the selected family/configuration and does not misidentify USB products. Canonical wallplate names still include their finish variants.
- BS1801/BS1801-M/BS1802 now expose Polycarbonate (PC) separately from surface finish. Existing dimensions remain unchanged.
- Rechecked all six 4200 models: their existing 5V DC / 4.2A / 21W rows and PDF page-10 references are present. Removed a contradictory generic note claiming individual port limits were listed; retained the model-specific statement that those limits are unpublished.
- Added one terminal-specific Leviton example and two dimmer examples (Eaton control-circuit rating, Lutron multi-gang limits), with direct primary-source links and explicit boundaries. No competitor numerical limits were inserted into FAHINT model tables.
- Red/green: observed the new alias, PC material, guide-reference and 4200-note regressions fail before the corresponding implementation changes, then pass.
- `npm test`: **50 test files, 974 tests passed**, exit 0 (2026-10-07).
- `npm run build`: exit 0; **181 published pages plus 404** prerendered.
- Browser check script `_qa/search-material-browser.js`: **10 views passed** at desktop 1440 px and mobile 390 px, including both search surfaces and reset/filter transitions, three wallplate configurations, a 4200 detail page and both guides. No horizontal document overflow, loaded-image failures or page errors. Screenshots in `output/playwright/followup-*.png`; desktop family and mobile catalogue/material images visually inspected.
- The first browser-check attempt waited on offscreen lazy images in an article. Corrected the QA helper to decode visible images with a bounded wait and reran all 10 views successfully; no site change was needed for that check issue.
- `git diff --check`: passed. GTN/marketing/certification behavior was not changed in this follow-up; existing prior edits remain in the checkout. No commit, push, merge or deployment performed.
