---
name: "Zhiyin Career"
description: "A focused indigo career operations system for continuous job-search work."
colors:
  brand-indigo: "#5b4ce2"
  brand-indigo-strong: "#4334c8"
  brand-indigo-soft: "#efedff"
  career-aqua: "#20b8b0"
  ink: "#171924"
  muted: "#62697a"
  line: "#e7e8ee"
  control-line: "#dfe1e8"
  surface: "#ffffff"
  soft: "#f7f7fa"
  workbench-ground: "#fafafd"
  dark-field: "#191922"
  success-ink: "#08775d"
  success-soft: "#ecf9f5"
  danger-ink: "#a32e37"
  danger-soft: "#fff4f4"
typography:
  display:
    fontFamily: 'Inter, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif'
    fontSize: "clamp(38px, 5vw, 60px)"
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: "-0.05em"
  headline:
    fontFamily: 'Inter, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif'
    fontSize: "clamp(34px, 4vw, 52px)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.045em"
  title:
    fontFamily: 'Inter, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif'
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: 'Inter, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif'
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.75
  control:
    fontFamily: 'Inter, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif'
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.4
  label:
    fontFamily: 'Inter, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif'
    fontSize: "11px"
    fontWeight: 800
    lineHeight: 1.4
    letterSpacing: "0.14em"
rounded:
  sm: "10px"
  md: "16px"
  lg: "24px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
  3xl: "48px"
  4xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.brand-indigo}"
    textColor: "{colors.surface}"
    typography: "{typography.control}"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
    height: "44px"
  button-danger:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger-ink}"
    typography: "{typography.control}"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
    height: "44px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "12px 13px"
  workbench-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "24px"
  icon-box:
    backgroundColor: "{colors.brand-indigo-soft}"
    textColor: "{colors.brand-indigo}"
    rounded: "14px"
    size: "46px"
---

# Design System: Zhiyin Career

## Overview

**Creative North Star: "The Career Operations Desk"**

Zhiyin Career is a focused operating environment for continuous job-search work. It uses strong indigo for action, near-black workbench fields for orientation, white cards on a faint cool ground, and compact controls that keep real application data, documents, tasks, and AI context easy to scan. The system feels capable and calm rather than promotional.

The same visual language now spans global navigation and footer, authentication, Jobs, Applications, Resume, Application Assistant, AI Career, Today, Profile, and the Web-to-mini-program interview handoff. Each workflow can change its information architecture while keeping the same tokens, control states, card construction, and responsive logic. The `/preview` editorial evidence sheet remains a route-scoped marketing extension governed by its surface brief; its Smiley Sans headings, warm paper, registration marks, and proof narrative are not global product defaults.

**Key Characteristics:**

- Indigo identifies primary action, active navigation, selected tools, and linked workflow context.
- Near-black fields anchor high-level orientation without turning every card dark.
- White surfaces, cool grounds, and hairline borders carry most of the hierarchy.
- Aqua marks completion, safety, connected context, and other confirmed positive states.
- Inter carries all product headings, body copy, controls, labels, and dense metadata.
- Real workbench states include loading, empty, error, success, disabled, pending, and confirmation-required treatments.
- Lucide outline icons reinforce labels and state while text keeps every action explicit.

## Colors

The global product palette is a restrained indigo-and-neutral system with aqua reserved for confirmed positive state.

### Primary

- **Brand Indigo:** the default primary button, active item, progress, link, score, and icon accent.
- **Strong Indigo:** the primary hover field and the deepest interactive brand state.
- **Soft Indigo:** icon tiles, selected options, tags, and quiet contextual emphasis.

### Secondary

- **Career Aqua:** completed tasks, safety context, shared-source indicators, and confirmed active status.
- **Success Ink and Success Soft:** readable positive notices and preserved-content messages.
- **Danger Ink and Danger Soft:** destructive controls and error surfaces; pair them with explicit wording.

### Neutral

- **Ink:** default text and high-priority information.
- **Muted:** secondary copy, metadata, helper text, and inactive context.
- **Surface:** cards, controls, menus, drawers, dialogs, and input fields.
- **Soft and Workbench Ground:** grouped controls and full-page workbench backgrounds.
- **Line and Control Line:** card boundaries, section dividers, and interactive field strokes.
- **Dark Field:** Jobs hero, login introduction, Today next action, and other high-level orientation blocks.

**The Indigo Means Action Rule.** Use indigo for actions, selection, and linked workflow context; use aqua only for completion, safety, or confirmed positive state.

**The Dark Field Is Orientation Rule.** Reserve the near-black field for page-level or workflow-level orientation; ordinary content stays on light surfaces.

## Typography

**Display Font:** Inter with PingFang SC, Microsoft YaHei, and system fallbacks  
**Body Font:** Inter with the same Chinese system fallbacks  
**Label Font:** Inter

**Character:** Tight, bold page headings establish direction quickly. Product copy then becomes smaller and more spacious so dense records, metadata, and controls remain readable without visual noise.

### Hierarchy

- **Display:** Bold, tightly tracked, and fluid; used by dark Jobs and job-detail heroes.
- **Headline:** Bold and fluid; used for workbench page headings, login positioning, and major handoff titles.
- **Title:** Bold Inter; used for panel, card, modal, and workflow section titles.
- **Body:** Regular Inter with generous line height; used for explanations, job details, forms, and AI output.
- **Control:** Bold Inter; used for buttons and compact direct actions.
- **Label:** Heavy, tracked Inter; used for kickers, status labels, and short metadata.

**The Density Has Levels Rule.** Keep the strongest type at page and workflow boundaries, then step down through titles, body, and metadata; do not make every card compete at headline scale.

## Layout

Global pages use an 1180px centered shell with 24px desktop gutters and 16px compact gutters. A 68px sticky header and a full site footer frame both public and authenticated routes. Standard workbench pages use a pale ground, 64px top spacing, and a flexible page head that holds one thesis, short supporting copy, and an optional status or action.

Workflow layouts follow the task: Applications uses a five-column horizontal board; Jobs uses a results list and a sticky 310px application panel; AI Career uses a 250px context rail and a flexible chat; Today uses a primary summary plus a 300px side rail; Application Assistant uses 250px / fluid / 240px columns; Profile keeps forms within 860px. Drawers, dialogs, and empty or loading states use the same shell, card, and control language.

At 1160px, the footer reduces its wide column plan. At 820px, navigation becomes a full-width disclosure menu, workbench side rails stack, sticky detail panels become static, and board columns become horizontally scrollable snap targets. At 520px, the shell uses 16px gutters, form rows stack, drawer and modal padding contracts, job actions wrap, and dense task controls simplify.

**The Workflow Chooses the Grid Rule.** Reuse tokens and component behavior across tools, but choose columns from the task sequence and collapse them in source-order for small screens.

## Elevation & Depth

The global system is flat by default. White surfaces separate from the cool page ground with one-pixel borders; broad, low-contrast shadows are reserved for mega menus, authentication containers, drawers, dialogs, and the few panels that genuinely float. Hover shadows remain subtle and accompany a border shift or one-pixel lift.

### Shadow Vocabulary

- **Floating Surface:** broad low-contrast depth for mega menus and authentication containers.
- **Raised State:** restrained depth for login gates, empty states, and AI workspaces.
- **Hover Card:** a small shadow paired with an indigo-tinted border on interactive records.
- **Drawer:** directional leftward depth that makes an overlay panel distinct from the underlying workbench.
- **Modal:** the strongest elevation, paired with a dark scrim and scroll-safe viewport bounds.

**The Border Before Shadow Rule.** Use surface contrast and a one-pixel border for normal cards; add a shadow only when the object floats, overlays, or responds to interaction.

## Shapes

The global radius scale is deliberately narrow: compact controls use the small radius, recurring cards use the medium radius, and authentication containers or major state panels use the large radius. Small tags and task checks may use 5–9px corners; avatars, counters, and status dots may be circular when their meaning benefits from it.

The Z brand mark is a compact indigo square with a slight skew and no shadow. Chat bubbles may use one reduced corner to establish speaker direction. The `/preview` proof stamp and registration marks remain route-specific shapes.

## Components

### Buttons

- **Shape:** 44px minimum height, small radius, 10px by 16px padding, bold 13px label, and optional 14–16px Lucide icon.
- **Primary:** white on indigo; hover changes to strong indigo and lifts by one pixel.
- **Secondary:** ink on white with a control-line border.
- **Danger:** danger ink on a pale danger field with a matching soft border.
- **Disabled:** 55% opacity, default cursor, and no lift.
- **Focus:** shared visible 3px indigo focus ring with a 3px offset.

### Chips

- **Style:** compact text labels with 5–9px corners. Soft indigo marks selection or linked context; pale aqua or green marks confirmed positive state; pale gold marks priority or review state.
- **State:** always include readable words or values because color is supporting information.

### Cards / Containers

- **Corner Style:** medium radius for standard panels; small radius for list cards and nested blocks; large radius for major gates or grouped entry experiences.
- **Background:** white on workbench ground, with soft neutral fill for internal grouping.
- **Border:** one-pixel neutral line at rest; interactive records may shift toward an indigo-tinted border on hover.
- **Internal Padding:** 18–24px for standard panels, 26–38px for dialogs and gate states, and 30–42px for large orientation blocks.

### Inputs / Fields

- **Style:** white field, one-pixel control border, small radius, and 12px by 13px padding at 14px type.
- **Focus:** use the shared visible focus ring; do not remove the outline without an equally visible replacement.
- **Structure:** labels sit above fields, helper copy remains muted, two-column rows stack at compact widths, and textareas keep readable line height.
- **State:** error and success messages sit near the affected workflow and use explicit copy.

### Navigation

The 68px sticky header uses the skewed Z mark, text-first top-level routes, and keyboard-accessible mega menus. Hover and focus shift links to indigo. At 820px and below, a native disclosure opens a full-width, scrollable menu with 44px minimum targets. The dark footer organizes real site routes into labeled groups and includes a concrete WeChat handoff.

### Workbench States

Loading and empty states preserve the surrounding layout instead of collapsing it. Drawers retain the current board or list as context. AI output distinguishes user and assistant messages, shows privacy and source context, and surfaces pending write confirmation as a separate action block. Task completion uses aqua plus a check and text treatment; status never depends on color alone.

## Do's and Don'ts

### Do:

- **Do** build new product routes from the shared indigo, aqua, neutral, radius, control, and workbench tokens.
- **Do** keep one clear page thesis and let the workflow determine the columns beneath it.
- **Do** implement loading, empty, error, success, disabled, pending, and confirmation-required states where the workflow can produce them.
- **Do** keep drawers and dialogs scroll-safe and preserve the underlying work context.
- **Do** use explicit text with status color, Lucide icons, and visible keyboard focus.
- **Do** validate the global system at 375px, 768px, 1024px, and 1440px.

### Don't:

- **Don't** reuse the `/preview` editorial composition, Smiley Sans display treatment, registration marks, or proof narrative as a default product template.
- **Don't** turn aqua into a decorative secondary brand color or an alternative primary CTA.
- **Don't** add card shadows at rest when a surface shift and hairline border already establish hierarchy.
- **Don't** shrink product metadata until it becomes illegible; remove or reflow secondary information at compact widths.
- **Don't** hide destructive, AI write, or privacy-sensitive actions behind icon-only controls or implicit state.
- **Don't** fabricate customer evidence, outcome metrics, certifications, or partner marks in public-facing surfaces.
