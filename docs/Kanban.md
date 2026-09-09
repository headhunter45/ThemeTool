# ThemeTool Kanban Board

This board tracks active work from readiness (`Backlog`) through implementation (`In-Progress`), review/testing (`Testing`), to merge into the `develop` branch (`Done`).

> **Workflow Rule**: The very first step of beginning work on any task is moving its card and status to **`In-Progress`**.

---

## Visual Board Overview

| *(None)* | *(None)* | **[TT-014](Tasks.md#tt-014-ios-ui-approximation-preview)**<br>iOS UI Preview<br>*(Ready for PR / testing)* | **[TT-010](Tasks.md#tt-010-tailwind-web-component-preview)**<br>Tailwind Web Preview<br>*(Merged to `develop`)* |
| | | **[TT-013](Tasks.md#tt-013-android-ui-approximation-preview)**<br>Android UI Preview<br>*(Ready for PR / testing)* | **[TT-027](Tasks.md#tt-027-app-layout-restructure--system-architecture-navigation)**<br>Layout Restructure & Architecture Tab<br>*(Merged to `develop`)* |
| | | **[TT-022](Tasks.md#tt-022-dark-mode-duality-generator)**<br>Dark Mode Duality<br>*(Ready for PR / testing)* | **[TT-028](Tasks.md#tt-028-contextual-color-inspector--on-demand-shade-studio)**<br>Contextual Color Inspector<br>*(Merged to `develop`)* |
| | | **[TT-019](Tasks.md#tt-019-accessibility--wcag-contrast-validator)**<br>WCAG Contrast Validator<br>*(Ready for PR / testing)* | **[TT-026](Tasks.md#tt-026-base-palette-selection-workflow)**<br>Base Palette Selection Workflow<br>*(Merged to `develop`)* |
| | | **[TT-018](Tasks.md#tt-018-shareable-url-generator-with-configurable-base-url)**<br>Shareable URL Generator<br>*(Ready for PR / testing)* | **[TT-007](Tasks.md#tt-007-realtime-colors--raw-format-importer)**<br>Realtime Colors Importer<br>*(Merged to `develop`)* |
| | | **[TT-015](Tasks.md#tt-015-tailwind-v3-and-v4-theme-exporter)**<br>Tailwind Theme Exporter<br>*(Ready for PR / testing)* | **[TT-004](Tasks.md#tt-004-palette-state-management--url-synchronization)**<br>Palette State & URL Sync<br>*(Merged to `develop`)* |
| | | **[TT-025](Tasks.md#tt-025-standard-theme-json-exporter--json-schema-specification)**<br>Theme JSON & Schema<br>*(Ready for PR / testing)* | **[TT-003](Tasks.md#tt-003-core-color-math-and-shade-scale-engine)**<br>Core Color Math & Shade Engine<br>*(Merged to `develop`)* |
| | | **[TT-012](Tasks.md#tt-012-material-design-m3-component-preview)**<br>Material Design (M3) Preview<br>*(Ready for PR / testing)* | **[TT-001](Tasks.md#tt-001-project-scaffolding--build-pipeline)**<br>Project Scaffolding & Build Pipeline<br>*(Released to Production)* |
| | | **[TT-009](Tasks.md#tt-009-preview-target-selection--visibility-controls)**<br>Preview Target Selection<br>*(Ready for PR / testing)* | **[TT-002](Tasks.md#tt-002-github-pages-deployment-workflow)**<br>GitHub Pages Deployment Workflow<br>*(Released to Production)* |
| | | **[TT-008](Tasks.md#tt-008-interactive-palette-editor-ui)**<br>Interactive Palette Editor UI<br>*(Ready for PR / testing)* | **[TT-024](Tasks.md#tt-024-application-shell-ui-foundation--lightdark-theme)**<br>App Shell & Light/Dark Theme<br>*(Released to Production)* |

---

## Detailed Column Lists

### 📋 Backlog
Tasks that are fully defined, specified, and ready to be picked up immediately:

*(No tasks currently in backlog)*

---

### 🚀 In-Progress
Tasks currently being coded in active task branches (`tasks/<id>-<description>` with 1–5 words, branching off `develop` or a dependency task branch):

*(No tasks currently in progress)*

---

### 🧪 Testing
Tasks where branch implementation is complete and a GitHub Pull Request to `develop` is open for review, testing, and verification:

- [ ] **[TT-014](Tasks.md#tt-014-ios-ui-approximation-preview)** — *iOS UI Approximation Preview*
  - **Branch**: `tasks/tt-014-ios-preview`
  - **Category**: Previews
  - **Status**: Ready for review / testing
  - **Summary**: Realistic iPhone chassis with Dynamic Island, frosted translucent bars, adaptive Light/Dark mode, dual-screen navigation, and Cupertino controls.

- [ ] **[TT-013](Tasks.md#tt-013-android-ui-approximation-preview)** — *Android UI Approximation Preview*
  - **Branch**: `tasks/tt-013-android-preview`
  - **Category**: Previews
  - **Status**: Ready for review / testing
  - **Summary**: Realistic Android phone chassis with status bar, gesture pill, Edge-to-Edge toggle, dual-screen navigation, and M3 Compose controls.

- [ ] **[TT-022](Tasks.md#tt-022-dark-mode-duality-generator)** — *Dark Mode Duality Generator*
  - **Branch**: `tasks/tt-022-dark-mode-duality`
  - **Category**: Enhancements
  - **Status**: Ready for review / testing
  - **Summary**: Dual Light & Dark palette state management with bidirectional OKLCH translation, side-by-side comparison modal, and dual-mode export.

- [ ] **[TT-019](Tasks.md#tt-019-accessibility--wcag-contrast-validator)** — *Accessibility & WCAG Contrast Validator*
  - **Branch**: `tasks/tt-019-wcag-validator`
  - **Category**: Quality
  - **Status**: Ready for review / testing
  - **Summary**: Dedicated Accessibility & Contrast Matrix dashboard card with AA/AAA badges and 1-click auto-fix in OKLCH.

- [ ] **[TT-018](Tasks.md#tt-018-shareable-url-generator-with-configurable-base-url)** — *Shareable URL Generator with Configurable Base URL*
  - **Branch**: `tasks/tt-018-shareable-url-generator`
  - **Category**: Exporters
  - **Status**: Ready for review / testing
  - **Summary**: Export palette state as shareable URL with configurable base URL and localStorage persistence.

- [ ] **[TT-017](Tasks.md#tt-017-ios-swift--xcassets-exporter)** — *iOS Swift & xcassets Exporter*
  - **Branch**: `tasks/tt-017-ios-exporter`
  - **Category**: Exporters
  - **Status**: Ready for review / testing
  - **Summary**: Generate `Theme.swift` code and downloadable `Colors.xcassets` zip archive via `jszip`.

- [ ] **[TT-016](Tasks.md#tt-016-android-xml-resource-generator--zip-packager)** — *Android XML Resource Generator & Zip Packager*
  - **Branch**: `tasks/tt-016-android-exporter`
  - **Category**: Exporters
  - **Status**: Ready for review / testing
  - **Summary**: Generate Material 3 Android XML (`colors.xml`, `themes.xml`, and `themes.xml` (Night)) and package `res/` tree into downloadable `android-theme-resources.zip` via `jszip`.

- [ ] **[TT-015](Tasks.md#tt-015-tailwind-v3-and-v4-theme-exporter)** — *Tailwind v3 and v4 Theme Exporter*
  - **Branch**: `tasks/tt-015-tailwind-exporter`
  - **Category**: Exporters
  - **Status**: Ready for review / testing
  - **Summary**: Generate downloadable Tailwind v4 `theme.css` with `@theme` and copyable Tailwind v3 `tailwind.config.js` with configurable prefix and scale options.

- [ ] **[TT-029](Tasks.md#tt-029-consolidate-preview-targets-to-ui-design-systems)** — *Consolidate Preview Targets to UI Design Systems*
  - **Branch**: `tasks/tt-029-consolidate-preview-targets`
  - **Category**: Previews
  - **Status**: Ready for review / testing
  - **Summary**: Remove legacy `react` and `angular` targets from target bar and preview grid, consolidating to the 4 canonical UI design systems (Tailwind, Material M3, Android, iOS).

- [ ] **[TT-025](Tasks.md#tt-025-standard-theme-json-exporter--json-schema-specification)** — *Standard Theme JSON Exporter & JSON Schema Specification*
  - **Branch**: `tasks/tt-025-theme-json`
  - **Category**: Exporters
  - **Status**: Ready for review / testing
  - **Summary**: Downloadable `theme.json` export and formal `themetool.schema.json` for custom pipeline automation.

- [ ] **[TT-012](Tasks.md#tt-012-material-design-m3-component-preview)** — *Material Design (M3) Component Preview*
  - **Branch**: `tasks/tt-012-material-preview`
  - **Category**: Previews
  - **Status**: Ready for review / testing
  - **Summary**: Authentic M3 design system preview (Top App Bar, FAB, buttons, cards, text fields, chips, switches).
- [ ] **[TT-009](Tasks.md#tt-009-preview-target-selection--visibility-controls)** — *Preview Target Selection & Visibility Controls*
  - **Branch**: `tasks/tt-009-preview-targets`
  - **Category**: UI / Shell
  - **Status**: Ready for review / testing
  - **Summary**: Segmented target bar with "All" toggle pills and single-platform focus tabs with persistent state.
- [ ] **[TT-008](Tasks.md#tt-008-interactive-palette-editor-ui)** — *Interactive Palette Editor UI*
  - **Branch**: `tasks/tt-008-palette-editor`
  - **Category**: UI / Shell
  - **Status**: Ready for review / testing
  - **Summary**: Full Undo/Redo history state stack with keyboard shortcuts, custom extra color slots management, and quick role swap tool.

---

### ✅ Done
Tasks whose code has been verified and merged into `develop` or deployed to production:

- [x] **[TT-010](Tasks.md#tt-010-tailwind-web-component-preview)** — *Tailwind Web Component Preview*
  - **Category**: Previews
  - **Status**: Merged to `develop`
  - **Summary**: Authentic Tailwind CSS web component preview canvas with marketing hero, button variants, stats cards, form controls, and live @theme inspector.
- [x] **[TT-027](Tasks.md#tt-027-app-layout-restructure--system-architecture-navigation)** — *App Layout Restructure & System Architecture Navigation*
  - **Category**: UI / Shell
  - **Status**: Merged to `develop`
  - **Summary**: Strip internal TT-* badges, move System Architecture to a dedicated navigation tab, and establish clean tutorial-style studio flow.
- [x] **[TT-028](Tasks.md#tt-028-contextual-color-inspector--on-demand-shade-studio)** — *Contextual Color Inspector & On-Demand Shade Studio*
  - **Category**: UI / Shell
  - **Status**: Merged to `develop`
  - **Summary**: Transformed color math and shade studio into an on-demand modal triggered directly from color cards with expandable 11-step scale.
- [x] **[TT-026](Tasks.md#tt-026-base-palette-selection-workflow)** — *Base Palette Selection Workflow (Single Color, Presets, Import)*
  - **Category**: UI / Shell
  - **Status**: Merged to `develop`
  - **Summary**: Top-of-page collapsible banner with single color seed palette generator, presets, and import with explicit confirmation button.
- [x] **[TT-007](Tasks.md#tt-007-realtime-colors--raw-format-importer)** — *Realtime Colors & Raw Format Importer*
  - **Category**: Importers
  - **Status**: Merged to `develop`
  - **Summary**: Support Realtime Colors URLs, JSON payloads, and raw hex strings directly in the Import Palette modal.
- [x] **[TT-006](Tasks.md#tt-006-uicolors-tailwind-format-parser)** — *UIColors (Tailwind 3 & 4) Format Parser*
  - **Category**: Importers
  - **Status**: Merged to `develop`
  - **Summary**: Parsed Tailwind 3 JS objects, Tailwind 4 CSS variables, and UIColors URLs into active semantic roles.
- [x] **[TT-005](Tasks.md#tt-005-coolors--colorkit-url-import-parser)** — *Coolors & ColorKit URL Import Parser*
  - **Category**: Importers
  - **Status**: Merged to `develop`
  - **Summary**: Parse and extract color palettes from Coolors and ColorKit URLs and map to active semantic roles.
- [x] **[TT-004](Tasks.md#tt-004-palette-state-management--url-synchronization)** — *Palette State Management & URL Synchronization*
  - **Category**: Core Engine
  - **Status**: Merged to `develop`
  - **Summary**: Manage 5 semantic color roles with two-way URL hash/parameter synchronization.
- [x] **[TT-003](Tasks.md#tt-003-core-color-math-and-shade-scale-engine)** — *Core Color Math & Shade Scale Engine*
  - **Category**: Core Engine
  - **Status**: Merged to `develop`
  - **Summary**: Implement color conversions and perceptual 50–950 tonal shade scale generation.
- [x] **[TT-001](Tasks.md#tt-001-project-scaffolding--build-pipeline)** — *Project Scaffolding & Build Pipeline*
  - **Category**: Infrastructure
  - **Status**: Released to Production
  - **Summary**: Initialized Vite + React 19 + TypeScript + Tailwind CSS with strict typing and test runner.
- [x] **[TT-002](Tasks.md#tt-002-github-pages-deployment-workflow)** — *GitHub Pages Deployment Workflow*
  - **Category**: DevOps
  - **Status**: Released to Production
  - **Summary**: Configured GitHub Actions workflow (.github/workflows/deploy.yml) for automated Pages deployment.
- [x] **[TT-024](Tasks.md#tt-024-application-shell-ui-foundation--lightdark-theme)** — *Application Shell, UI Foundation & Light/Dark Theme*
  - **Category**: UI / Shell
  - **Status**: Released to Production
  - **Summary**: Established cohesive app shell, responsive layout, and persistent light/dark/system theme toggle.

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
