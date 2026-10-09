# FAHINT D1 Inquiry Implementation Plan

> **For agentic workers:** Execute inline with executing-plans. The user prefers the main agent and no subagents.

**Goal:** Persist verified inquiries before sending notifications and support private follow-up and CSV export.

**Architecture:** Keep the existing Pages Function and frontend. Add one private D1 table through `INQUIRY_DB`, atomic insertion by request ID, and a background notification task using `waitUntil`. Use Cloudflare's authenticated database tools for management.

**Tech Stack:** Existing React/Vite/Vitest, native Workers crypto and D1 bindings, Node standard library, Wrangler.

## Task 1: Preserve inquiries and notification state

Files: `src/server/inquiry.js`, `src/server/inquiry-store.js`, `src/server/inquiry.test.js`, `migrations/0001_inquiries.sql`.

- [x] Add failing cases asserting a saved row exists before Resend is called, notification failures still return `{ok:true}`, unavailable D1 returns 503, repeated IDs send once, and changed content cannot overwrite an existing row.
- [x] Run `npm test -- src/server/inquiry.test.js` and verify the new behavioral failures.
- [x] Create the table with `request_id TEXT PRIMARY KEY`, normalized buyer fields, `items_json`, `inquiry_text`, `payload_sha256`, follow-up `status`/`notes`, and notification `email_status`/`email_id`.
- [x] Add `saveInquiry(db, requestId, values)` using bound parameters and `INSERT ... ON CONFLICT(request_id) DO NOTHING RETURNING request_id`. On conflict, select the saved hash and return a content conflict without updating customer fields.
- [x] Require `INQUIRY_DB.prepare` and Turnstile before handling valid submissions. Save after verification, then schedule notification with `context.waitUntil(task)` or await the task in tests. Return success based on the saved row, independently of notification outcome.
- [x] Keep Resend's idempotency key. Update email status after the request; if status persistence fails, log only a fixed diagnostic and request ID, leaving the saved inquiry available.
- [x] Run the focused tests again.

## Task 2: Export and operator instructions

Files: `scripts/export-inquiries.mjs`, `src/server/inquiry-export.test.js`, `database/export-inquiries.sql`, `docs/inquiry-d1.md`, `docs/inquiry-email.md`.

- [x] Add failing tests for Wrangler results, Unicode, multiline/quoted fields, formula prefixes, empty results and error results.
- [x] Implement a pure CSV conversion function and a CLI reading an explicit JSON file and writing an explicit local CSV path. Include BOM, stable columns and CSV quoting. Keep customer records out of public/dist folders.
- [x] Add the read-only `SELECT` used for exports and concrete SQL for querying unresolved inquiries and editing status/notes by exact ID.
- [x] Document creation, schema installation, Production binding, redeployment, management, export and database backup. Update email receipt semantics to distinguish persistence from provider acceptance and mailbox delivery.

## Task 3: Native verification and release

- [x] Run the full existing test suite and production build: 53 files / 1,035 tests passed; 181 pages and the fallback built.
- [x] Compile Pages Functions with Wrangler 3.114.17, matching the existing Cloudflare compiler.
- [x] With a local Wrangler D1 binding, apply the actual migration and exercise the compiled handler with mocked external services. Verify SQL persistence, deduplication, canonical items, failed-notification retention and schema constraints. No live email is sent.
- [x] The user chose manual Cloudflare setup and confirmed creation, schema installation and Production `INQUIRY_DB` binding.
- [ ] Commit only this change, merge into main, push and check the deployment.
- [ ] Confirm the production database binding and perform a negative verification probe that cannot send email. Ask the user to submit one real test and confirm the saved row and mailbox receipt.
