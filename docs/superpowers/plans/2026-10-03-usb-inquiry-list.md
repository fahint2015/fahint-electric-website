# USB inquiry list implementation plan

Execute inline on the existing local branch, without subagents or another worktree. Use the approved 2026-10-03 USB inquiry-list design and ponytail full: reuse the existing form and delivery mechanism.

## 1. URL and payload contract

- [x] Add failing tests for validated/deduplicated/capped USB items, compact URL round trips, invalid input, finish validation and quantities.
- [x] Add failing form-helper tests for identical itemized email/copied text, no conflicting single-model/overall quantity and no arbitrary product source.
- [x] Implement `src/utils/inquiryList.js`; extend normalization, output and validation in `src/components/InquiryForm.jsx`. Keep legacy single-product output intact.

## 2. Contact and comparison interaction

- [x] Add failing tests for the comparison CTA and contact list editing, topic persistence, refresh restoration, privacy, removing/clearing/category changes, quantity validation and stale copy feedback.
- [x] Add a scoped `InquiryList` component and responsive styles, using existing tokens, SafeImage, catalog finishes and 44px controls.
- [x] Connect Contact URL state, InquiryForm items and the comparison action. Preserve existing customer draft fields and individual quote links.
- [x] Verify focused tests and inspect the diff for unwanted behavior changes.

## 3. Verification and handoff

- [x] Run full tests, production build and `git diff --check`.
- [x] Verify desktop/mobile comparison-to-contact, per-item changes, topic changes, refresh, removal/focus, overflow and copy without sending mail. Save local screenshots under ignored `output/playwright/`.
- [x] Record evidence and commit only feature source/tests/docs locally. Do not push, merge or deploy; preserve unrelated untracked paths.

## Execution record

Completed 2026-10-03 in the approved inline/local-only workflow.

- RED: the empty URL helper and unchanged form failed 14 new assertions; Contact failed six missing-list/URL assertions; the comparison CTA and form-anchor assertions failed before their implementation. A later deferred-update focus regression also failed before its fix.
- GREEN: final full run passed all 857 tests in 43 files. Production build passed (1662 modules). `git diff --check` passed. No package, product-data, domain, endpoint or delivery-service changes.
- Browser: followed the actual comparison action into Contact with three blank quantities/finishes. Edited two rows to 1200/Black and 2500/Grey, switched to OEM, and confirmed choices plus the contact draft survived topic changes. A refresh restored model choices but not personal fields, as designed. Customer text was absent from the URL.
- Real Copy inquiry details returned its copied confirmation. An invalid quantity of zero blocked copying, showed its error and focused the quantity field. Helper/form tests confirmed email/copy body parity, invalid-quantity mail prevention and long-email copy recovery. No real email or network inquiry was sent.
- At 320/390/768/1024/1440px, the document stayed within the viewport. The 320px check revealed clipped finish placeholder text; below 361px, quantity/finish now stack. The mobile comparison retains a 44px close/action and an internally scrollable table.
- A real-browser removal check revealed requestAnimationFrame could focus a row before a deferred Router update removed it. A failing deferred-parent regression reproduced this. Focus now restores after committed item state; the real browser verified focus on the category select after removing the last row. Other rows and the customer draft remained intact.
- Inline review covered all changed files, validation boundaries, generated source paths, no default finish, seven-category compatibility, preservation of single-model flows, scoped CSS and no additional storage/services.
- Browser console: zero warnings/errors. QA session closed. Screenshots in ignored `output/playwright/`: `usb-inquiry-comparison.png`, `usb-inquiry-comparison-mobile.png`, `usb-inquiry-contact-desktop.png`, `usb-inquiry-mobile.png`, `usb-inquiry-320.png`.
- Local preview is served at `http://127.0.0.1:4175`. No push, merge or deployment. Existing `%SystemDrive%/`, `.planning/` and `Start-FAHINT-Preview.cmd` remain untouched.
