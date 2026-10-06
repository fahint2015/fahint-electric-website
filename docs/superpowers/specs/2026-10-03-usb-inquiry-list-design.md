# USB multi-model inquiry list

Approved 2026-10-03: connect the completed USB comparison to one inquiry containing several models. Keep the existing site style, email-app/copy delivery and local-only workflow.

## Scope and interaction

- A comparison-dialog action adds its two or three models to the contact page. Existing individual quote links remain unchanged.
- The contact form displays a compact list with thumbnail, model link, optional quantity in pieces, optional catalog finish and removal. No default finish or quantity is inferred. Up to three published USB models; other product families keep their existing forms.
- Quantity, finish and model are stored in a bounded `items` URL parameter. A refresh or shared link restores these choices; customer name, email, company and requirements are never put into the URL. No new browser storage, backend or cart page.
- Inquiry-topic changes preserve items and in-progress contact fields. Removing a row preserves the other rows. Removing all rows restores a normal USB category inquiry. Changing product category clears the USB list, with that behavior explained beside the list.
- Email and copied text contain the same itemized model/quantity/finish/product-page lines. No extra overall quantity or conflicting single-model context. Blank values are explicitly not specified. Invalid quantities are not sent or copied. Existing long-email copy fallback remains available.

## Implementation boundaries

Use the published USB catalog as the only authority for model, finish and source path. Parse compact JSON tuples, discard unknown/draft/non-USB models, deduplicate and cap at three. Ignore unknown fields and arbitrary source URLs. Validate optional quantities as positive whole pieces up to seven digits; do not transform malformed numbers into a different order quantity.

Add one small utility and one scoped list component. Extend Contact, the shared InquiryForm payload/validation, and the USB dialog CTA. No packages, service configuration, domain changes, push, merge or deployment. Preserve seven category options and the existing single-product context workflow.

## Verification

Use failing tests before implementation for URL validation/round trip, itemized output, form delivery/copy safeguards, draft retention, topic/category changes and comparison handoff. Then run the full tests/build and inspect the actual desktop/mobile interaction, refresh, removal/focus and overflow. Never send a real inquiry during verification.
