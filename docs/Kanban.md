# ThemeTool Kanban Board

This board tracks active work from readiness (`Backlog`) through implementation (`In-Progress`), review/testing (`Testing`), to merge into the `develop` branch (`Done`).

> **Workflow Rule**: The very first step of beginning work on any task is moving its card and status to **`In-Progress`**.

---

## Visual Board Overview

| 📋 Backlog | 🚀 In-Progress | 🧪 Testing | ✅ Done / Released |
| :--- | :--- | :--- | :--- |
| **[TT-033](Tasks.md#tt-033-accessibility-section-header--indicator-cleanup)**: Accessibility Header Cleanup<br>**[TT-034](Tasks.md#tt-034-preview-component-interactivity--common-app-chrome)**: Preview Interactivity & Chrome<br>**[TT-035](Tasks.md#tt-035-standardized-preview-viewport-sizing--edge-to-edge-diagnostics)**: Preview Sizing & Edge-to-Edge | *(None)* | **[TT-030](Tasks.md#tt-030-compact-hero-section--remove-system-architecture-tab)**: Compact Hero & Remove Architecture Tab<br>**[TT-031](Tasks.md#tt-031-studio-5-step-workflow-reorganization--dedicated-export-section)**: 5-Step Flow & Dedicated Export<br>**[TT-032](Tasks.md#tt-032-shade-studio--palette-cards-cleanup)**: Shade Studio & Palette Cards | **[TT-001](Tasks.md#tt-001-project-scaffolding--build-pipeline)**: Project Scaffolding *(Released)*<br>**[TT-002](Tasks.md#tt-002-github-pages-deployment-workflow)**: GitHub Pages Workflow *(Released)*<br>**[TT-003](Tasks.md#tt-003-core-color-math-and-shade-scale-engine)**: Color Math & Shade Engine *(Released)*<br>**[TT-004](Tasks.md#tt-004-palette-state-management--url-synchronization)**: Palette State & URL Sync *(Released)*<br>**[TT-005](Tasks.md#tt-005-coolors--colorkit-url-import-parser)**: Coolors & ColorKit Parser *(Released)*<br>**[TT-006](Tasks.md#tt-006-uicolors-tailwind-format-parser)**: UIColors Tailwind Parser *(Released)*<br>**[TT-007](Tasks.md#tt-007-realtime-colors--raw-format-importer)**: Realtime Colors Importer *(Released)*<br>**[TT-008](Tasks.md#tt-008-interactive-palette-editor-ui)**: Palette Editor UI *(Released)*<br>**[TT-009](Tasks.md#tt-009-preview-target-selection--visibility-controls)**: Preview Target Controls *(Released)*<br>**[TT-010](Tasks.md#tt-010-tailwind-web-component-preview)**: Tailwind Web Preview *(Released)*<br>**[TT-012](Tasks.md#tt-012-material-design-m3-component-preview)**: Material M3 Preview *(Released)*<br>**[TT-013](Tasks.md#tt-013-android-ui-approximation-preview)**: Android UI Preview *(Released)*<br>**[TT-014](Tasks.md#tt-014-ios-ui-approximation-preview)**: iOS UI Preview *(Released)*<br>**[TT-015](Tasks.md#tt-015-tailwind-v3-and-v4-theme-exporter)**: Tailwind Theme Exporter *(Released)*<br>**[TT-016](Tasks.md#tt-016-android-xml-resource-generator--zip-packager)**: Android XML Exporter *(Released)*<br>**[TT-017](Tasks.md#tt-017-ios-swift--xcassets-exporter)**: iOS Swift Exporter *(Released)*<br>**[TT-018](Tasks.md#tt-018-shareable-url-generator-with-configurable-base-url)**: Shareable URL Generator *(Released)*<br>**[TT-019](Tasks.md#tt-019-accessibility--wcag-contrast-validator)**: WCAG Contrast Validator *(Released)*<br>**[TT-022](Tasks.md#tt-022-dark-mode-duality-generator)**: Dark Mode Duality *(Released)*<br>**[TT-024](Tasks.md#tt-024-application-shell-ui-foundation--lightdark-theme)**: App Shell & Themes *(Released)*<br>**[TT-025](Tasks.md#tt-025-standard-theme-json-exporter--json-schema-specification)**: Theme JSON & Schema *(Released)*<br>**[TT-026](Tasks.md#tt-026-base-palette-selection-workflow)**: Base Palette Workflow *(Released)*<br>**[TT-027](Tasks.md#tt-027-app-layout-restructure--system-architecture-navigation)**: App Layout Restructure *(Released)*<br>**[TT-028](Tasks.md#tt-028-contextual-color-inspector--on-demand-shade-studio)**: Contextual Color Inspector *(Released)*<br>**[TT-029](Tasks.md#tt-029-consolidate-preview-targets-to-ui-design-systems)**: Consolidate Preview Targets *(Released)* |

---

## Detailed Column Lists

### 📋 Backlog
Tasks that are fully defined, specified, and ready to be picked up immediately:

- [ ] **[TT-033](Tasks.md#tt-033-accessibility-section-header--indicator-cleanup)** — *Accessibility Section Header & Indicator Cleanup*
  - **Category**: Quality
  - **Status**: Ready for implementation (`backlog`)
  - **Summary**: Replace static shield and WCAG 2.1 badge with a dynamic compliance indicator and interactive WCAG conformance threshold criteria popover.

- [ ] **[TT-034](Tasks.md#tt-034-preview-component-interactivity--common-app-chrome)** — *Preview Component Interactivity & Common App Chrome*
  - **Category**: Previews
  - **Status**: Ready for implementation (`backlog`)
  - **Summary**: Wire up navigation drawers, active search inputs with generated results, overflow dropdowns, and profile popovers across Material M3, Android, and iOS previews.

- [ ] **[TT-035](Tasks.md#tt-035-standardized-preview-viewport-sizing--edge-to-edge-diagnostics)** — *Standardized Preview Viewport Sizing & Edge-to-Edge Diagnostics*
  - **Category**: Previews
  - **Status**: Ready for implementation (`backlog`)
  - **Summary**: Lock preview containers to standardized uniform dimensions across platform tabs, and fix Edge-to-Edge padding to enable true system bar bleeding with high-contrast solid bars.

---

### 🚀 In-Progress
Tasks currently being coded in active task branches (`tasks/<id>-<description>` with 1–5 words, branching off `develop` or a dependency task branch):

*(No tasks currently in progress)*

---

### 🧪 Testing
Tasks where branch implementation is complete and a GitHub Pull Request to `develop` is open for review, testing, and verification:

- [ ] **[TT-030](Tasks.md#tt-030-compact-hero-section--remove-system-architecture-tab)** — *Compact Hero Section & Remove System Architecture Tab*
  - **Branch**: `tasks/tt-030-compact-hero`
  - **Category**: UI / Shell
  - **Status**: Ready for Review / Testing
  - **Summary**: Reduced hero banner vertical height by ~50% and removed system architecture tab and view, focusing ThemeTool exclusively as a design system studio.

- [ ] **[TT-031](Tasks.md#tt-031-studio-5-step-workflow-reorganization--dedicated-export-section)** — *Studio 5-Step Workflow Reorganization & Dedicated Export Section*
  - **Branch**: `tasks/tt-031-dedicated-export-section`
  - **Category**: UI / Shell
  - **Status**: Ready for Review / Testing
  - **Summary**: Reorganized studio into sequential 5-step flow (Step 1: Choose Base -> Step 2: Experiment -> Step 3: Preview -> Step 4: Accessibility -> Step 5: Export) and built dedicated Step 5 ExportSection component.

- [ ] **[TT-032](Tasks.md#tt-032-shade-studio--palette-cards-cleanup)** — *Shade Studio & Palette Cards Cleanup*
  - **Branch**: `tasks/tt-032-shade-studio-cleanup`
  - **Category**: UI / Shell
  - **Status**: Ready for Review / Testing
  - **Summary**: Renamed to Shade Studio, unified custom color slots into primary grid with Inspect Shades support, added clear HEX input labels, and added explicit conversion Copy/Copied feedback.

---

### 🧪 Testing
Tasks where branch implementation is complete and a GitHub Pull Request to `develop` is open for review, testing, and verification:

- [ ] **[TT-030](Tasks.md#tt-030-compact-hero-section--remove-system-architecture-tab)** — *Compact Hero Section & Remove System Architecture Tab*
  - **Branch**: `tasks/tt-030-compact-hero`
  - **Category**: UI / Shell
  - **Status**: Ready for Review / Testing
  - **Summary**: Reduced hero banner vertical height by ~50% and removed system architecture tab and view, focusing ThemeTool exclusively as a design system studio.

- [ ] **[TT-031](Tasks.md#tt-031-studio-5-step-workflow-reorganization--dedicated-export-section)** — *Studio 5-Step Workflow Reorganization & Dedicated Export Section*
  - **Branch**: `tasks/tt-031-dedicated-export-section`
  - **Category**: UI / Shell
  - **Status**: Ready for Review / Testing
  - **Summary**: Reorganized studio into sequential 5-step flow (Step 1: Choose Base -> Step 2: Experiment -> Step 3: Preview -> Step 4: Accessibility -> Step 5: Export) and built dedicated Step 5 ExportSection component.

---

### 🧪 Testing
Tasks where branch implementation is complete and a GitHub Pull Request to `develop` is open for review, testing, and verification:

- [ ] **[TT-030](Tasks.md#tt-030-compact-hero-section--remove-system-architecture-tab)** — *Compact Hero Section & Remove System Architecture Tab*
  - **Branch**: `tasks/tt-030-compact-hero`
  - **Category**: UI / Shell
  - **Status**: Ready for Review / Testing
  - **Summary**: Reduced hero banner vertical height by ~50% and removed system architecture tab and view, focusing ThemeTool exclusively as a design system studio.

---

### ✅ Done / Released
Tasks whose code has been verified, merged into `develop` and `main`, and deployed to production:

- [x] **[TT-001](Tasks.md#tt-001-project-scaffolding--build-pipeline)** — *Project Scaffolding & Build Pipeline*
  - **Category**: Infrastructure
  - **Status**: Released to Production
  - **Summary**: Initialized Vite + React 19 + TypeScript + Tailwind CSS with strict typing and test runner.

- [x] **[TT-002](Tasks.md#tt-002-github-pages-deployment-workflow)** — *GitHub Pages Deployment Workflow*
  - **Category**: DevOps
  - **Status**: Released to Production
  - **Summary**: Configured GitHub Actions workflow (.github/workflows/deploy.yml) for automated Pages deployment.

- [x] **[TT-003](Tasks.md#tt-003-core-color-math-and-shade-scale-engine)** — *Core Color Math & Shade Scale Engine*
  - **Category**: Core Engine
  - **Status**: Released to Production
  - **Summary**: Implement color conversions and perceptual 50–950 tonal shade scale generation.

- [x] **[TT-004](Tasks.md#tt-004-palette-state-management--url-synchronization)** — *Palette State Management & URL Synchronization*
  - **Category**: Core Engine
  - **Status**: Released to Production
  - **Summary**: Manage 5 semantic color roles with two-way URL hash/parameter synchronization.

- [x] **[TT-005](Tasks.md#tt-005-coolors--colorkit-url-import-parser)** — *Coolors & ColorKit URL Import Parser*
  - **Category**: Importers
  - **Status**: Released to Production
  - **Summary**: Parse and extract color palettes from Coolors and ColorKit URLs and map to active semantic roles.

- [x] **[TT-006](Tasks.md#tt-006-uicolors-tailwind-format-parser)** — *UIColors (Tailwind 3 & 4) Format Parser*
  - **Category**: Importers
  - **Status**: Released to Production
  - **Summary**: Parsed Tailwind 3 JS objects, Tailwind 4 CSS variables, and UIColors URLs into active semantic roles.

- [x] **[TT-007](Tasks.md#tt-007-realtime-colors--raw-format-importer)** — *Realtime Colors & Raw Format Importer*
  - **Category**: Importers
  - **Status**: Released to Production
  - **Summary**: Support Realtime Colors URLs, JSON payloads, and raw hex strings directly in the Import Palette modal.

- [x] **[TT-008](Tasks.md#tt-008-interactive-palette-editor-ui)** — *Interactive Palette Editor UI*
  - **Category**: UI / Shell
  - **Status**: Released to Production
  - **Summary**: Full Undo/Redo history state stack with keyboard shortcuts, custom extra color slots management, and quick role swap tool.

- [x] **[TT-009](Tasks.md#tt-009-preview-target-selection--visibility-controls)** — *Preview Target Selection & Visibility Controls*
  - **Category**: UI / Shell
  - **Status**: Released to Production
  - **Summary**: Segmented target bar with "All" toggle pills and single-platform focus tabs with persistent state.

- [x] **[TT-010](Tasks.md#tt-010-tailwind-web-component-preview)** — *Tailwind Web Component Preview*
  - **Category**: Previews
  - **Status**: Released to Production
  - **Summary**: Authentic Tailwind CSS web component preview canvas with marketing hero, button variants, stats cards, form controls, and live @theme inspector.

- [x] **[TT-012](Tasks.md#tt-012-material-design-m3-component-preview)** — *Material Design (M3) Component Preview*
  - **Category**: Previews
  - **Status**: Released to Production
  - **Summary**: Authentic M3 design system preview (Top App Bar, FAB, buttons, cards, text fields, chips, switches).

- [x] **[TT-013](Tasks.md#tt-013-android-ui-approximation-preview)** — *Android UI Approximation Preview*
  - **Category**: Previews
  - **Status**: Released to Production
  - **Summary**: Realistic Android phone chassis with status bar, gesture pill, Edge-to-Edge toggle, dual-screen navigation, and M3 Compose controls.

- [x] **[TT-014](Tasks.md#tt-014-ios-ui-approximation-preview)** — *iOS UI Approximation Preview*
  - **Category**: Previews
  - **Status**: Released to Production
  - **Summary**: Realistic iPhone chassis with Dynamic Island, frosted translucent bars, adaptive Light/Dark mode, dual-screen navigation, and Cupertino controls.

- [x] **[TT-015](Tasks.md#tt-015-tailwind-v3-and-v4-theme-exporter)** — *Tailwind v3 and v4 Theme Exporter*
  - **Category**: Exporters
  - **Status**: Released to Production
  - **Summary**: Generate downloadable Tailwind v4 `theme.css` with `@theme` and copyable Tailwind v3 `tailwind.config.js` with configurable prefix and scale options.

- [x] **[TT-016](Tasks.md#tt-016-android-xml-resource-generator--zip-packager)** — *Android XML Resource Generator & Zip Packager*
  - **Category**: Exporters
  - **Status**: Released to Production
  - **Summary**: Generate Material 3 Android XML (`colors.xml`, `themes.xml`, and `themes.xml` (Night)) and package `res/` tree into downloadable `android-theme-resources.zip` via `jszip`.

- [x] **[TT-017](Tasks.md#tt-017-ios-swift--xcassets-exporter)** — *iOS Swift & xcassets Exporter*
  - **Category**: Exporters
  - **Status**: Released to Production
  - **Summary**: Generate `Theme.swift` code and downloadable `Colors.xcassets` zip archive via `jszip`.

- [x] **[TT-018](Tasks.md#tt-018-shareable-url-generator-with-configurable-base-url)** — *Shareable URL Generator with Configurable Base URL*
  - **Category**: Exporters
  - **Status**: Released to Production
  - **Summary**: Export palette state as shareable URL with configurable base URL and localStorage persistence.

- [x] **[TT-019](Tasks.md#tt-019-accessibility--wcag-contrast-validator)** — *Accessibility & WCAG Contrast Validator*
  - **Category**: Quality
  - **Status**: Released to Production
  - **Summary**: Dedicated Accessibility & Contrast Matrix dashboard card with AA/AAA badges and 1-click auto-fix in OKLCH.

- [x] **[TT-022](Tasks.md#tt-022-dark-mode-duality-generator)** — *Dark Mode Duality Generator*
  - **Category**: Enhancements
  - **Status**: Released to Production
  - **Summary**: Dual Light & Dark palette state management with bidirectional OKLCH translation, side-by-side comparison modal, and dual-mode export.

- [x] **[TT-024](Tasks.md#tt-024-application-shell-ui-foundation--lightdark-theme)** — *Application Shell, UI Foundation & Light/Dark Theme*
  - **Category**: UI / Shell
  - **Status**: Released to Production
  - **Summary**: Established cohesive app shell, responsive layout, and persistent light/dark/system theme toggle.

- [x] **[TT-025](Tasks.md#tt-025-standard-theme-json-exporter--json-schema-specification)** — *Standard Theme JSON Exporter & JSON Schema Specification*
  - **Category**: Exporters
  - **Status**: Released to Production
  - **Summary**: Downloadable `theme.json` export and formal `themetool.schema.json` for custom pipeline automation.

- [x] **[TT-026](Tasks.md#tt-026-base-palette-selection-workflow)** — *Base Palette Selection Workflow (Single Color, Presets, Import)*
  - **Category**: UI / Shell
  - **Status**: Released to Production
  - **Summary**: Top-of-page collapsible banner with single color seed palette generator, presets, and import with explicit confirmation button.

- [x] **[TT-027](Tasks.md#tt-027-app-layout-restructure--system-architecture-navigation)** — *App Layout Restructure & System Architecture Navigation*
  - **Category**: UI / Shell
  - **Status**: Released to Production
  - **Summary**: Strip internal TT-* badges, move System Architecture to a dedicated navigation tab, and establish clean tutorial-style studio flow.

- [x] **[TT-028](Tasks.md#tt-028-contextual-color-inspector--on-demand-shade-studio)** — *Contextual Color Inspector & On-Demand Shade Studio*
  - **Category**: UI / Shell
  - **Status**: Released to Production
  - **Summary**: Transformed color math and shade studio into an on-demand modal triggered directly from color cards with expandable 11-step scale.

- [x] **[TT-029](Tasks.md#tt-029-consolidate-preview-targets-to-ui-design-systems)** — *Consolidate Preview Targets to UI Design Systems*
  - **Category**: Previews
  - **Status**: Released to Production
  - **Summary**: Remove legacy `react` and `angular` targets from target bar and preview grid, consolidating to the 4 canonical UI design systems (Tailwind, Material M3, Android, iOS).

---

### 🚫 Cancelled / Superseded
Tasks retired due to architectural refinements:

- **[TT-011](Tasks.md#tt-011-react--angular-component-previews)** — *React & Angular Component Previews*
  - **Status**: Cancelled / Superseded
  - **Rationale**: Prioritizing UI design systems and styling frameworks over JS runtime frameworks. Web component previews focus on Tailwind CSS (TT-010) and Material Design M3 (TT-012), implemented natively in React.

---

## Beyond the Board

- **Triage & Planning**: Upstream ideas and tasks requiring specification live in [`docs/Tasks.md`](Tasks.md). Once technical details and requirements are finalized, they move into the **Backlog** column on this board.
- **Release to Production**: When the `develop` branch is merged into `main`, completed tasks advance from `Done` to **`Released`** in [`docs/Tasks.md`](Tasks.md) and deploy live to GitHub Pages.
