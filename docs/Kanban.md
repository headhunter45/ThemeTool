# ThemeTool Kanban Board

This board tracks active work from readiness (`Backlog`) through implementation (`In-Progress`), review/testing (`Testing`), to merge into the `develop` branch (`Done`).

> **Workflow Rule**: The very first step of beginning work on any task is moving its card and status to **`In-Progress`**.

---

## Visual Board Overview

| 📋 Backlog (Ready to Work) | 🚀 In-Progress (Active Branch) | 🧪 Testing (PR / Verification) | ✅ Done (Merged / Released) |
| :--- | :--- | :--- | :--- |
| **[TT-007](Tasks.md#tt-007-realtime-colors--raw-format-importer)**<br>Realtime Colors Importer | *(None)* | **[TT-006](Tasks.md#tt-006-uicolors-tailwind-format-parser)**<br>UIColors Tailwind Parser<br>*(PR to `develop`)* | **[TT-001](Tasks.md#tt-001-project-scaffolding--build-pipeline)**<br>Project Scaffolding & Build Pipeline<br>*(Released to Production)* |
| **[TT-008](Tasks.md#tt-008-interactive-palette-editor-ui)**<br>Interactive Palette Editor | | **[TT-005](Tasks.md#tt-005-coolors--colorkit-url-import-parser)**<br>Coolors & ColorKit URL Parser<br>*(PR to `develop`)* | **[TT-002](Tasks.md#tt-002-github-pages-deployment-workflow)**<br>GitHub Pages Deployment Workflow<br>*(Released to Production)* |
| **[TT-009](Tasks.md#tt-009-preview-target-selection--visibility-controls)**<br>Preview Target Selection | | **[TT-004](Tasks.md#tt-004-palette-state-management--url-synchronization)**<br>Palette State & URL Sync<br>*(PR to `develop`)* | **[TT-024](Tasks.md#tt-024-application-shell-ui-foundation--lightdark-theme)**<br>App Shell & Light/Dark Theme<br>*(Released to Production)* |
| **[TT-012](Tasks.md#tt-012-material-design-m3-component-preview)**<br>Material Design (M3) Preview | | **[TT-003](Tasks.md#tt-003-core-color-math-and-shade-scale-engine)**<br>Core Color Math & Shade Engine<br>*(PR to `develop`)* | |
| **[TT-015](Tasks.md#tt-015-tailwind-v3-and-v4-theme-exporter)**<br>Tailwind Theme Exporter | | | |
| **[TT-016](Tasks.md#tt-016-android-xml-resource-generator--zip-packager)**<br>Android XML Zip Packager | | | |
| **[TT-017](Tasks.md#tt-017-ios-swift--xcassets-exporter)**<br>iOS Swift & xcassets Exporter | | | |
| **[TT-018](Tasks.md#tt-018-shareable-url-generator-with-configurable-base-url)**<br>Shareable URL Generator | | | |
| **[TT-019](Tasks.md#tt-019-accessibility--wcag-contrast-validator)**<br>WCAG Contrast Validator | | | |
| **[TT-025](Tasks.md#tt-025-standard-theme-json-exporter--json-schema-specification)**<br>Theme JSON & Schema | | | |

---

## Detailed Column Lists

### 📋 Backlog
Tasks that are fully defined, specified, and ready to be picked up immediately:

- [ ] **[TT-007](Tasks.md#tt-007-realtime-colors--raw-format-importer)** — *Realtime Colors & Raw Format Importer*
  - **Category**: Importers
  - **Summary**: Support Realtime Colors URLs, JSON payloads, and raw hex strings directly in the Import Palette modal.
- [ ] **[TT-008](Tasks.md#tt-008-interactive-palette-editor-ui)** — *Interactive Palette Editor UI*
  - **Category**: UI / Shell
  - **Summary**: Undo/Redo history stack, custom color slot management, and quick semantic role swap tool.
- [ ] **[TT-009](Tasks.md#tt-009-preview-target-selection--visibility-controls)** — *Preview Target Selection & Visibility Controls*
  - **Category**: UI / Shell
  - **Summary**: Segmented target bar with "All" toggle pills and single-platform focus tabs with persistent state.
- [ ] **[TT-012](Tasks.md#tt-012-material-design-m3-component-preview)** — *Material Design (M3) Component Preview*
  - **Category**: Previews
  - **Summary**: Authentic M3 design system preview (Top App Bar, FAB, buttons, cards, text fields, chips, switches).
- [ ] **[TT-015](Tasks.md#tt-015-tailwind-v3-and-v4-theme-exporter)** — *Tailwind v3 and v4 Theme Exporter*
  - **Category**: Exporters
  - **Summary**: Generate downloadable Tailwind v4 `theme.css` and copyable Tailwind v3 `tailwind.config.js`.
- [ ] **[TT-016](Tasks.md#tt-016-android-xml-resource-generator--zip-packager)** — *Android XML Resource Generator & Zip Packager*
  - **Category**: Exporters
  - **Summary**: Generate Material 3 Android XML and package `res/` tree into downloadable `.zip` via `jszip`.
- [ ] **[TT-017](Tasks.md#tt-017-ios-swift--xcassets-exporter)** — *iOS Swift & xcassets Exporter*
  - **Category**: Exporters
  - **Summary**: Generate `Theme.swift` code and downloadable `.xcassets` zip archive via `jszip`.
- [ ] **[TT-018](Tasks.md#tt-018-shareable-url-generator-with-configurable-base-url)** — *Shareable URL Generator with Configurable Base URL*
  - **Category**: Exporters
  - **Summary**: Export palette state as shareable URL with configurable base URL and localStorage persistence.
- [ ] **[TT-019](Tasks.md#tt-019-accessibility--wcag-contrast-validator)** — *Accessibility & WCAG Contrast Validator*
  - **Category**: Quality
  - **Summary**: Dedicated Accessibility & Contrast Matrix dashboard card with AA/AAA badges and 1-click auto-fix.
- [ ] **[TT-025](Tasks.md#tt-025-standard-theme-json-exporter--json-schema-specification)** — *Standard Theme JSON Exporter & JSON Schema Specification*
  - **Category**: Exporters
  - **Summary**: Downloadable `theme.json` export and formal `themetool.schema.json` for custom pipeline automation.

---

### 🚀 In-Progress
Tasks currently being coded in active task branches (`tasks/<id>-<description>` with 1–5 words, branching off `develop` or a dependency task branch):

*(Currently empty. When starting a task, move its entry here, create the task branch, and begin implementation).*

---

### 🧪 Testing
Tasks where branch implementation is complete and a GitHub Pull Request to `develop` is open for review, testing, and verification:

- [ ] **[TT-006](Tasks.md#tt-006-uicolors-tailwind-format-parser)** — *UIColors (Tailwind 3 & 4) Format Parser*
  - **Branch**: `tasks/tt-006-uicolors-parser`
  - **Category**: Importers
  - **Status**: Pull Request to `develop` open / ready for review
  - **Summary**: Parse Tailwind 3 JS objects, Tailwind 4 CSS variables, and UIColors URLs, extracting the base 500 step and generating the full OKLCH shade scale.
- [ ] **[TT-005](Tasks.md#tt-005-coolors--colorkit-url-import-parser)** — *Coolors & ColorKit URL Import Parser*
  - **Branch**: `tasks/tt-005-url-import-parser`
  - **Category**: Importers
  - **Status**: Pull Request to `develop` open / ready for review
  - **Summary**: Parse and extract color palettes from Coolors and ColorKit URLs and map to active semantic roles.
- [ ] **[TT-004](Tasks.md#tt-004-palette-state-management--url-synchronization)** — *Palette State Management & URL Synchronization*
  - **Branch**: `tasks/tt-004-palette-state-sync`
  - **Category**: Core Engine
  - **Status**: Pull Request to `develop` open / ready for review
  - **Summary**: Manage 5 semantic color roles with two-way URL hash/parameter synchronization.
- [ ] **[TT-003](Tasks.md#tt-003-core-color-math-and-shade-scale-engine)** — *Core Color Math & Shade Scale Engine*
  - **Branch**: `tasks/tt-003-color-math-engine`
  - **Category**: Core Engine
  - **Status**: Pull Request to `develop` open / ready for review
  - **Summary**: Implement color conversions and perceptual 50–950 tonal shade scale generation.

---

### ✅ Done
Tasks whose code has been verified and merged into `develop` or deployed to production:

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

## Beyond the Board

- **Triage & Planning**: Upstream ideas and tasks requiring specification live in [`docs/Tasks.md`](Tasks.md). Once technical details and requirements are finalized, they move into the **Backlog** column on this board.
- **Release to Production**: When the `develop` branch is merged into `main`, completed tasks advance from `Done` to **`Released`** in [`docs/Tasks.md`](Tasks.md) and deploy live to GitHub Pages.
