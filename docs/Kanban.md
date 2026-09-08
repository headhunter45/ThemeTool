# ThemeTool Kanban Board

This board tracks active work from readiness (`Backlog`) through implementation (`In-Progress`), review/testing (`Testing`), to merge into the `develop` branch (`Done`).

> **Workflow Rule**: The very first step of beginning work on any task is moving its card and status to **`In-Progress`**.

---

## Visual Board Overview

| 📋 Backlog (Ready to Work) | 🚀 In-Progress (Active Branch) | 🧪 Testing (PR / Verification) | ✅ Done (Merged / Released) |
| :--- | :--- | :--- | :--- |
| **[TT-005](Tasks.md#tt-005-coolors--colorkit-url-import-parser)**<br>Coolors & ColorKit URL Parser | *(None)* | **[TT-004](Tasks.md#tt-004-palette-state-management--url-synchronization)**<br>Palette State & URL Sync<br>*(PR to `develop`)* | **[TT-001](Tasks.md#tt-001-project-scaffolding--build-pipeline)**<br>Project Scaffolding & Build Pipeline<br>*(Released to Production)* |
| | | **[TT-003](Tasks.md#tt-003-core-color-math-and-shade-scale-engine)**<br>Core Color Math & Shade Engine<br>*(PR to `develop`)* | **[TT-002](Tasks.md#tt-002-github-pages-deployment-workflow)**<br>GitHub Pages Deployment Workflow<br>*(Released to Production)* |
| | | | **[TT-024](Tasks.md#tt-024-application-shell-ui-foundation--lightdark-theme)**<br>App Shell & Light/Dark Theme<br>*(Released to Production)* |

---

## Detailed Column Lists

### 📋 Backlog
Tasks that are fully defined, specified, and ready to be picked up immediately:

- [ ] **[TT-005](Tasks.md#tt-005-coolors--colorkit-url-import-parser)** — *Coolors & ColorKit URL Import Parser*
  - **Category**: Importers
  - **Summary**: Parse and extract color palettes from Coolors and ColorKit URLs.

---

### 🚀 In-Progress
Tasks currently being coded in active task branches (`tasks/<id>-<description>` with 1–5 words, branching off `develop` or a dependency task branch):

*(Currently empty. When starting a task, move its entry here, create the task branch, and begin implementation).*

---

### 🧪 Testing
Tasks where branch implementation is complete and a GitHub Pull Request to `develop` is open for review, testing, and verification:

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
