# FAHINT GA4

Measurement ID: `G-N7PBW2XWRV` (public identifier supplied by the site owner).

`src/utils/analytics.js` initializes the Google tag once from the shared client entry, on HTTPS `fahint.com` and `www.fahint.com` only. Localhost, local previews, Pages previews and GitHub Pages addresses do not send GA4 traffic. Both the production design and the unpublished local redesign use this integration. Google advertising signals and advertising personalization are disabled.

## Events

| Event | Meaning |
| --- | --- |
| `page_view` | Initial page load and React Router navigation, through GA4 enhanced measurement. |
| `file_download` | Supported document link clicks, through GA4 enhanced measurement. This is a click, not proof a download finished. |
| `contact_whatsapp` | A WhatsApp link was clicked; does not mean a message was sent. |
| `contact_email` | An email link was clicked; does not mean an email was sent. |
| `generate_lead` | The inquiry endpoint returned a successful receipt. Not emitted for invalid fields, failed requests or opening an email app. The same confirmed request ID is counted once per mounted form. |

Custom events carry no inquiry fields, customer contact details, message text, request IDs or destination URL queries. A blocked or unavailable tracker does not interrupt submitting an inquiry. GA4 reports are not a replacement for the D1 inquiry database; browser blocking may prevent measurement.

## GA4 settings and verification

Keep Enhanced measurement enabled for this web stream, including Page views → advanced settings → page changes based on browser history, and File downloads. Do not add a second manual page-view tracker or another copy of this tag. Automatic `form_submit` indicates an attempt; use `generate_lead` for confirmed inquiries. The owner can mark `generate_lead` as a key event in GA4; contact clicks are separate micro-conversions.

Open GA4's installation test and Realtime report after deployment. Normal report processing can lag behind Realtime. No GA4 account settings or key-event flags were changed by this code update. No historical data can be recovered for periods before collection was installed.

Validation on 2026-10-17: production 1,051 tests passed; local redesign 116 relevant tests passed. Builds produced 181 production and 182 local public pages plus the 404 fallback and inquiry Functions. Browser interception confirmed one tag and one page view each for Home → About → Blog → Back, with correct titles/referrers; contact clicks triggered their separate events. Pre-deployment collection requests were intercepted, and no real inquiry, email or WhatsApp message was sent.

References: [Google SPA measurement](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications), [enhanced measurement](https://support.google.com/analytics/answer/9216061).
