---
name: FAHINT
description: Shared brand frame and scoped company editorial system.
colors:
  site-navy: "#071b30"
  site-blue: "#177792"
  site-ink: "#10283f"
  site-muted: "#506578"
  site-paper: "#edf3f5"
  site-line: "#cedce3"
  white: "#ffffff"
typography:
  body: { fontFamily: "'Source Sans 3', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", fontSize: "16px", lineHeight: 1.65 }
  site-page-title: { fontSize: "clamp(42px, 4.5vw, 72px)", fontWeight: 550, lineHeight: 1.08, letterSpacing: "-0.025em" }
  site-section-title: { fontSize: "clamp(32px, 3.2vw, 48px)", fontWeight: 550, lineHeight: 1.16, letterSpacing: "-0.025em" }
  company-display: { fontSize: "clamp(48px, 5.2vw, 88px)", fontWeight: 550, lineHeight: 1.04, letterSpacing: "-0.035em" }
  company-headline: { fontSize: "clamp(36px, 3.6vw, 58px)", fontWeight: 550, lineHeight: 1.08, letterSpacing: "-0.025em" }
  company-action: { fontSize: "16px", fontWeight: 600, lineHeight: 1.5 }
rounded: { site-radius: "14px", radius-pill: "999px" }
spacing: { site-gutter: "clamp(24px, 5vw, 112px)", site-space: "clamp(72px, 7vw, 112px)" }
components:
  company-button: { backgroundColor: "{colors.site-blue}", textColor: "{colors.white}", typography: "{typography.company-action}", rounded: "{rounded.radius-pill}", padding: "13px 23px" }
  company-button-hover: { backgroundColor: "#10566e" }
  company-button-light: { backgroundColor: "{colors.white}", textColor: "{colors.site-ink}", typography: "{typography.company-action}", rounded: "{rounded.radius-pill}", padding: "13px 23px" }
  company-button-light-hover: { backgroundColor: "#dcedf3" }
  company-editorial-callout: { backgroundColor: "{colors.site-paper}", rounded: "0", padding: "32px" }
---

# Design System: FAHINT

## Overview

**Creative North Star: "The Open Workshop"**

FAHINT uses a clear navy-and-blue frame, Source Sans 3, generous margins and familiar pill actions. Real product and company evidence gives the visual system its character.

The documentary treatment recorded here applies to Home's #studio-making chapter, /capabilities and /about. Their larger headings, square-cornered photographs and broad editorial layouts are scoped treatments; product pages, forms, Blog and Contact retain their own implemented patterns.

**Key Characteristics:**

- A shared navy, blue, white and pale-paper palette.
- Documentary photographs with useful captions and restrained surrounding copy.
- Visible keyboard focus, user-controlled factory tabs and complete mobile images.

**The Scope Rule.** Use the shared frame across routes; apply company editorial display, photograph and callout treatments only to their named chapters.

Source of truth: [shared frame](src/styles/site-system.css), [base font and legacy tokens](src/styles.css), [company pages](src/styles/company-pages.css), [Home Studio](src/styles/studio.css) and [shared company components](src/components/company/CompanyShared.jsx). The frontmatter records current shared tokens and explicitly named company roles; it does not replace older contextual tokens.

## Colors

Sidecar tonal ramps are generated preview swatches, not additional production palette tokens.

**Primary.** Deep navy anchors the frame and dark chapters. Blue identifies primary actions and selected factory tabs.

**Neutral.** Ink carries headings; muted blue-gray carries body copy and captions. White and pale paper alternate chapters, with quiet blue-gray rules separating related material. Dark chapters use the existing lighter copy and link colors from the owning stylesheet.

## Typography

Source Sans 3 is bundled as a variable font, with the system fallbacks in the body token. Shared page and section titles are defaults; the company display and headline roles are local to About and Capabilities. Headings in these surfaces use sentence case and balanced wrapping. Company body text is slightly larger than the base body (17px), generally limited to 70ch.

Company display type adapts at 1050px to clamp(44px, 5.6vw, 60px), then at 760px to clamp(40px, 9.8vw, 64px). Company section titles become clamp(34px, 8vw, 42px) on mobile. Home's testing headline has its own scale, clamp(40px, 4vw, 68px), with a mobile size of 42px.

## Layout

The shared content frame caps at 1600px using the gutter token. Company sections use the shared section spacing, changing to 64px at 760px. Home's testing chapter retains its local spacing, clamp(72px, 7vw, 120px).

About and Capabilities open with a roughly 60/40 title-and-summary grid and a broad photograph, capped at 1920px with 24px outer margins. Desktop hero frames use a 2:1 assembly crop or a 2.35:1 workshop crop. At 760px the title grid stacks and the hero photograph returns to its complete natural aspect ratio, edge to edge; captions keep the page gutter.

The factory tour pairs a contained photograph with copy. Portrait equipment remains fully visible. The team gallery uses unequal columns and natural image ratios, then stacks on mobile. Home testing pairs a dominant intact GFCI photo with navy copy; mobile moves the copy above the photograph and stacks the USB support area.

## Elevation & Depth

The company editorial chapters are flat: navy and pale-paper fields, whitespace and thin rules provide separation. Photographs and the documentation callout have no shadow. The shared solid header retains its shallow shadow; the existing site still has contextual card and form shadows outside these chapters.

## Shapes

Pill actions remain the familiar brand control. The shared rounded media/card token remains available for incumbent modules, including certificate cards. Company editorial photographs, OEM packaging and the scoped documentation callout use straight corners. “Square” describes the corners, not a forced 1:1 photograph.

## Components

**Company actions.** Primary blue and inverse white links use the button tokens, a minimum height of 52px and an inline arrow. Hover changes the fill. Text links have a minimum height of 44px and underline on hover. Company controls share a visible focus outline (3px, 5px offset).

**Chapter navigation.** About and manufacturing section links wrap across lines and target real section anchors. About uses a bottom rule; the manufacturing navigation sits on navy. Anchored company sections retain a header offset (110px).

**Factory tour.** Three user-controlled tabs expose assembly, aging tests and laboratory verification. ArrowLeft/ArrowRight select and focus neighboring tabs; Home/End select the endpoints. The selected tab has the blue underline, roving tab index and associated visible panel. There is no automatic advance. The brief image arrival (400ms) runs only without a reduced-motion preference.

**Documentation callout.** The company editorial variant is a pale, square-cornered panel with a heading, model-scope explanation and certificate link. Padding reduces from 32px to 24px on mobile.

**Documentary photography.** Keep captions adjacent to the actual image and explicit intrinsic dimensions. The ten selected factory photographs and their sources are recorded in [the manifest](public/assets/images/company/factory/manifest.json) and adjacent .webp.json files. The broad About workshop uses electronics-workshop-v2.webp (1920 × 1440). Home's existing scroll reveal moves the complete photograph; unsupported and reduced-motion environments receive the complete static image. Reduced-motion styles also disable company transitions and animations.

**The Evidence Rule.** Photographs show specific work. Their captions and neighboring copy must describe the pictured activity and preserve model-specific qualification.

## Do's and Don'ts

- Do preserve the FAHINT identity, source photographs, manifest and adjacent asset provenance files.
- Do show complete mobile photographs and contain portrait equipment images within the factory-tour frame.
- Do retain visible focus, semantic tab/panel relationships and the reduced-motion alternatives.
- Don't spread company editorial heading sizes or square photo corners to products, forms, Blog or Contact.
- Don't label GFCI functional testing as assembly, alter factory evidence with generated content, or substitute lower-resolution catalog crops for the supplied originals.
- Don't turn photographs or certificates into unsupported production, performance, partnership, delivery or range-wide certification claims.
