# Published page body prerendering

## Approved scope

The user approved the next prelaunch step: put the homepage, product families and product detail content in initial HTML, preserve the existing design and buyer tools, and verify core content without JavaScript. Work stays on the current local feature branch. No push, deployment, email delivery or domain changes are authorized in this step.

## Design

- Extract the existing route/layout tree into `src/App.jsx`. Both browser and build-time rendering use it; no second copy of product or marketing content.
- Use the installed React 18 server renderer with `onAllReady`, waiting for lazy routes before collecting HTML. Use a StaticRouter with the same deployment base as BrowserRouter.
- Extend the existing Pages artifact preparation with a render callback. Validate every route and finish rendering before writing route files; render failures must stop the build. Only existing published routes are emitted, plus the noindex 404 fallback.
- Build the server entry using the installed Vite API into ignored `output/prerender/`, outside the public artifact. Keep client JavaScript lazy-loaded. Emit one shared stylesheet so prerendered pages are styled without waiting for route JavaScript.
- `npm run build` produces the full static artifact. CI calls that command once, with its existing SITE_BASE and CUSTOM_DOMAIN values. Canonical, sitemap and domain policy remain unchanged.
- Hydrate a matching query-free prerendered path. Use normal client rendering for query-bearing pages, preview routes and fallback paths, avoiding a mismatch between static default content and personalized filter/inquiry state. Keep trailing-slash routing consistent on server and client.
- Make homepage browser preferences effect-driven so initial markup is deterministic. Existing reveal content already defaults to visible before JavaScript enhancement.
- Disable inquiry submission until its client effect runs, so a no-script form cannot submit customer details through the browser's default GET. Keep a no-script explanation and the existing email/WhatsApp links. This does not change delivery configuration.
- Reuse the same mechanism for the other existing published routes (resources, contact, company and articles), avoiding a separate fallback pipeline.

## Deliberate limits

- Query-specific selections are not separately indexed or generated as files. They remain browser interactions.
- No new hosting framework, crawler-specific content, runtime server, dependencies or SEO promises.
- Consolidated CSS is a small, cacheable shared asset; route-specific CSS extraction can be revisited only if measured transfer cost warrants it.

## Verification

Automated checks cover actual React rendering for representative routes, all published route output, model names/specifications/links, deployment subpaths, complete lazy content, deterministic first render, and failure-before-write. Browser checks cover disabled-JavaScript desktop/mobile content, hydration without errors, URL filters/comparison/inquiry state, navigation and 404 behavior. Run the full existing suite and production builds for `/` and the GitHub project subpath.

Technical references: [React static generation](https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation), [React hydration](https://react.dev/reference/react-dom/client/hydrateRoot), [Vite 5 SSR build](https://v5.vite.dev/guide/ssr).
