# ThemeTool Task Tracking

This document maintains the master registry of all tasks for **ThemeTool**. Each task has a unique ID for easy reference in conversation, planning, and commit messages.

---

## Task Status Lifecycle

The statuses function as an extended Kanban workflow:

| Status | Definition |
| :--- | :--- |
| **`planning`** | Ideas that are not yet fully fleshed out; not ready for triage. |
| **`triage`** | Features with a clear goal, but requirements and technical specifications must be sorted out before implementation can begin. |
| **`backlog`** | Fully specified tasks that are ready to be picked up and worked on immediately. |
| **`assigned`** | Tasks assigned to a developer (typically skipped in pair-programming workflows). |
| **`in-progress`** | Actively being worked on. **The first step of working on any task is moving it to `in-progress`.** |
| **`testing`** | Implementation is complete in a task branch (`tasks/*`); ready for testing, verification, and pull request to `develop`. |
| **`done`** | Implementation complete, verified, and code has merged into the `develop` branch. |
| **`released`** | Code has merged from `develop` into `main` and is deployed to production. |
| **`cancelled`** | Work that was abandoned or deprecated, retained for historical tracking. |

---

## Task Summary Table

| ID | Title | Status | Category |
| :--- | :--- | :--- | :--- |
| **[TT-001](#tt-001-project-scaffolding--build-pipeline)** | Project Scaffolding & Build Pipeline | `released` | Infrastructure |
| **[TT-002](#tt-002-github-pages-deployment-workflow)** | GitHub Pages Deployment Workflow | `released` | DevOps |
| **[TT-003](#tt-003-core-color-math-and-shade-scale-engine)** | Core Color Math & Shade Scale Engine | `done` | Core Engine |
| **[TT-004](#tt-004-palette-state-management--url-synchronization)** | Palette State Management & URL Synchronization | `done` | Core Engine |
| **[TT-005](#tt-005-coolors--colorkit-url-import-parser)** | Coolors & ColorKit URL Import Parser | `done` | Importers |
| **[TT-006](#tt-006-uicolors-tailwind-format-parser)** | UIColors (Tailwind 3 & 4) Format Parser | `done` | Importers |
| **[TT-007](#tt-007-realtime-colors--raw-format-importer)** | Realtime Colors & Raw Format Importer | `done` | Importers |
| **[TT-008](#tt-008-interactive-palette-editor-ui)** | Interactive Palette Editor UI | `testing` | UI / Shell |
| **[TT-009](#tt-009-preview-target-selection--visibility-controls)** | Preview Target Selection & Visibility Controls | `testing` | UI / Shell |
| **[TT-010](#tt-010-tailwind-web-component-preview)** | Tailwind Web Component Preview | `done` | Previews |
| **[TT-011](#tt-011-react--angular-component-previews)** | React & Angular Previews (Superseded) | `cancelled` | Previews |
| **[TT-012](#tt-012-material-design-m3-component-preview)** | Material Design (M3) Component Preview | `testing` | Previews |
| **[TT-013](#tt-013-android-ui-approximation-preview)** | Android UI Approximation Preview | `triage` | Previews |
| **[TT-014](#tt-014-ios-ui-approximation-preview)** | iOS UI Approximation Preview | `triage` | Previews |
| **[TT-015](#tt-015-tailwind-v3-and-v4-theme-exporter)** | Tailwind v3 and v4 Theme Exporter | `in-progress` | Exporters |
| **[TT-016](#tt-016-android-xml-resource-generator--zip-packager)** | Android XML Resource Generator & Zip Packager | `backlog` | Exporters |
| **[TT-017](#tt-017-ios-swift--xcassets-exporter)** | iOS Swift & xcassets Exporter | `backlog` | Exporters |
| **[TT-018](#tt-018-shareable-url-generator-with-configurable-base-url)** | Shareable URL Generator with Configurable Base URL | `backlog` | Exporters |
| **[TT-019](#tt-019-accessibility--wcag-contrast-validator)** | Accessibility & WCAG Contrast Validator | `backlog` | Quality |
| **[TT-020](#tt-020-gradient-palette-generation--export)** | Gradient Palette Generation & Export | `planning` | Enhancements |
| **[TT-021](#tt-021-extended-theme-tokens-borders-shadows-radii)** | Extended Theme Tokens (Borders, Shadows, Radii) | `planning` | Enhancements |
| **[TT-022](#tt-022-dark-mode-duality-generator)** | Dark Mode Duality Generator | `triage` | Enhancements |
| **[TT-023](#tt-023-automated-continuous-integration-ci-pipeline)** | Automated Continuous Integration (CI) Pipeline | `planning` | DevOps |
| **[TT-024](#tt-024-application-shell-ui-foundation--lightdark-theme)** | Application Shell, UI Foundation & Light/Dark Theme | `released` | UI / Shell |
| **[TT-025](#tt-025-standard-theme-json-exporter--json-schema-specification)** | Standard Theme JSON Exporter & JSON Schema | `testing` | Exporters |
| **[TT-026](#tt-026-base-palette-selection-workflow)** | Base Palette Selection Workflow (Single Color, Presets, Import) | `done` | UI / Shell |
| **[TT-027](#tt-027-app-layout-restructure--system-architecture-navigation)** | App Layout Restructure & System Architecture Navigation | `done` | UI / Shell |
| **[TT-028](#tt-028-contextual-color-inspector--on-demand-shade-studio)** | Contextual Color Inspector & On-Demand Shade Studio | `done` | UI / Shell |
| **[TT-029](#tt-029-consolidate-preview-targets-to-ui-design-systems)** | Consolidate Preview Targets to UI Design Systems | `testing` | Previews |

---

## Detailed Task Specifications

### TT-001: Project Scaffolding & Build Pipeline
- **Status**: `released`
- **Category**: Infrastructure
- **Title**: Project Scaffolding & Build Pipeline
- **Description**: Initialize the project repository with Vite, React 19, TypeScript, Tailwind CSS, and Vitest. Configure TypeScript strict mode, path aliases (`@/*`), and linting/formatting rules. Ensure the app builds clean production bundles.
- **Acceptance Criteria**:
  - Vite + React + TypeScript initialized in project root.
  - Tailwind CSS installed and functioning.
  - Test runner (Vitest) configured with a basic smoke test.
  - `npm run build` succeeds without warnings or type errors.

### TT-002: GitHub Pages Deployment Workflow
- **Status**: `released`
- **Category**: DevOps
- **Title**: GitHub Pages Deployment Workflow
- **Description**: Configure GitHub Pages deployment via GitHub Actions (Option A: single repository, no separate branch or `/docs` bundle commits). Create `.github/workflows/deploy.yml` using `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages`. Workflow triggers on pushes to `main`, compiles the app (`npm run build`), and deploys `dist/` directly to Pages.
- **Acceptance Criteria**:
  - GitHub Actions workflow config created at `.github/workflows/deploy.yml` using modern Pages action suite.
  - Keeps repository clean: zero build artifacts committed into git or `docs/`.
  - Vite `base` configured to support GitHub Pages path (`/ThemeTool/` or repo name) while retaining local dev (`/`).
  - GitHub Pages deployment permissions (`pages: write`, `id-token: write`) configured.

### TT-003: Core Color Math & Shade Scale Engine
- **Status**: `testing`
- **Category**: Core Engine
- **Title**: Core Color Math & Shade Scale Engine
- **Description**: Implement color utilities for format conversions (HEX, RGB, HSL, OKLCH), luminance calculation, and algorithmic generation of 50–950 tonal shade scales (11 shade steps matching Tailwind convention). Ensure smooth perceptual lightness distribution using OKLCH/CIELAB color spaces.
- **Acceptance Criteria**:
  - Conversion functions between HEX, RGB, HSL, and OKLCH.
  - Shade generator producing accurate 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 steps for any base hex color.
  - Unit tests in Vitest covering edge cases (pure black, pure white, neon tones).

### TT-004: Palette State Management & URL Synchronization
- **Status**: `testing`
- **Category**: Core Engine
- **Title**: Palette State Management & URL Synchronization
- **Description**: Build the application state management to hold the active palette (5 semantic roles: Text, Background, Primary, Secondary, Accent, plus custom color slots). Synchronize state bi-directionally with the browser URL (hash or query parameters) so that any palette state can be bookmarked or shared without a backend.
- **Acceptance Criteria**:
  - State store for palette roles (Text, Background, Primary, Secondary, Accent).
  - Changes to colors update URL hash/search params immediately (debounced if needed).
  - Navigating to or refreshing a URL with encoded palette loads the palette state accurately.

### TT-005: Coolors & ColorKit URL Import Parser
- **Status**: `testing`
- **Category**: Importers
- **Title**: Coolors & ColorKit URL Import Parser
- **Description**: Create a URL parser that accepts URLs from Coolors (e.g., `https://coolors.co/palette/6f2dbd-a663cc-b298dc-b8d0eb-b9faf8`) and ColorKit (e.g., `https://colorkit.co/palette/eebea0-ff8d83-ffa89f-ffc2bc-aaae80/`), extracts the hex color values, and populates the active palette.
- **Acceptance Criteria**:
  - Parses 5-hex paths from Coolors URL strings.
  - Parses hex paths from ColorKit URL strings.
  - Validates hex codes, handling optional `#` and casing.
  - Unit tests verifying parsing of sample URLs from `README.md`.

### TT-006: UIColors (Tailwind 3 & 4) Format Parser
- **Status**: `done`
- **Category**: Importers
- **Title**: UIColors (Tailwind 3 & 4) Format Parser
- **Description**: Implement an import parser that accepts copy-pasted UIColors/Tailwind code blocks. Recognizes both Tailwind v3 JavaScript object syntax (`'50': '#faf9ec', ...`) and Tailwind v4 CSS variable definitions (`--color-lucky-50: #faf9ec; ...`). Extracts the base color (the `500` step) into the target semantic role (defaulting to Primary or user-selected role) and re-generates the full perceptual 50–950 shade scale using our calibrated OKLCH math engine.
- **Acceptance Criteria**:
  - Detects and parses Tailwind 3 JS object snippets.
  - Detects and parses Tailwind 4 `--color-*-{50..950}` CSS variable definitions.
  - Extracts the `500` base hex color and loads it into the target semantic role.
  - Generates the full 11-step shade scale via the OKLCH engine.
  - Unit tests verifying parsing of sample snippets from `README.md`.

### TT-007: Realtime Colors & Raw Format Importer
- **Status**: `testing`
- **Category**: Importers
- **Title**: Realtime Colors & Raw Format Importer
- **Description**: Extend the `ImportPaletteModal` to accept Realtime Colors URLs (`https://www.realtimecolors.com/?colors=...`), JSON objects (`{ "text": "...", "background": "...", "primary": "...", "secondary": "...", "accent": "..." }`), and unstructured raw text (comma-separated hex codes, space-separated hex codes, or array syntax).
- **Acceptance Criteria**:
  - Real-time auto-detection in `ImportPaletteModal` for Realtime Colors URLs and JSON payloads.
  - Direct 1:1 mapping of recognized semantic tokens (`text`, `background`, `primary`, `secondary`, `accent`) to application roles.
  - Graceful parser for comma/space-separated hex codes with live swatch previews.
  - Unit tests verifying Realtime Colors URL and JSON format parsing.

### TT-008: Interactive Palette Editor UI
- **Status**: `testing`
- **Category**: UI / Shell
- **Title**: Interactive Palette Editor UI
- **Description**: Enhance the palette editor with professional editing ergonomics: full Undo/Redo history stack for all palette actions, custom color slot management (adding, renaming, and deleting extra color slots beyond the 5 semantic roles), and a quick Role Swap tool to exchange hex values between any two semantic roles (e.g., swapping Primary <-> Secondary or Text <-> Background).
- **Acceptance Criteria**:
  - Undo / Redo history state stack with toolbar action buttons and keyboard shortcuts (Cmd/Ctrl+Z, Cmd/Ctrl+Shift+Z).
  - Add, edit name, and delete custom extra color slots with color pickers and hex inputs.
  - Role Swap modal/dropdown allowing immediate exchange of colors between any two roles.
  - Respects active role locks during randomize and bulk actions.

### TT-009: Preview Target Selection & Visibility Controls
- **Status**: `testing`
- **Category**: UI / Shell
- **Title**: Preview Target Selection & Visibility Controls
- **Description**: Provide intuitive visibility and layout controls for preview targets. Support a segmented target bar offering an "All" view (with individual toggle pills to show or hide specific targets) as well as dedicated single-platform focus tabs focusing on primary UI design systems: Web UI (Tailwind CSS, Material M3) and Mobile UI (Android Jetpack Compose, iOS SwiftUI) for zero-distraction inspection. Persist visibility state in `localStorage`.
- **Acceptance Criteria**:
  - Segmented control supporting "All" mode and single-platform focus tabs.
  - Interactive toggle pills in "All" mode to show/hide individual platform cards.
  - State persistence in `localStorage` so user selections are preserved across reloads.
  - Fluid, responsive layout dynamically rearranging visible preview cards.

### TT-010: Tailwind Web Component Preview
- **Status**: `done`
- **Category**: Previews
- **Title**: Tailwind Web Component Preview
- **Description**: Build a realistic web component preview styled using Tailwind CSS classes wired directly to the active palette, implemented natively in React. Provides web-optimized cards, marketing hero header, button variants, badge pills, interactive form inputs, dismissable alert banner, and live @theme CSS token inspector.
- **Acceptance Criteria**:
  - Components react in real time to palette color changes.
  - Interactive controls (clickable buttons, toggles, form input focus states).
  - Adheres to semantic roles (Background, Text, Primary CTA, Secondary buttons, Accent alerts).

### TT-011: React & Angular Component Previews (Superseded)
- **Status**: `cancelled`
- **Category**: Previews
- **Title**: React & Angular Component Previews (Superseded)
- **Description**: Originally scoped to build separate JS framework component previews (React vs. Angular). Superseded by architectural refinement prioritizing **UI styling and design system frameworks** over JS runtime frameworks. All web previews are natively implemented in React, with focused support for **Tailwind CSS** (TT-010) and **Material Design M3** (TT-012) on the web, alongside native mobile previews for **Android Compose** (TT-013) and **iOS SwiftUI** (TT-014). Separate React/Angular preview tabs are eliminated.
- **Acceptance Criteria**:
  - N/A (Superseded by TT-010 and TT-012; separate JS framework preview tasks retired).

### TT-012: Material Design (M3) Component Preview
- **Status**: `testing`
- **Category**: Previews
- **Title**: Material Design (M3) Component Preview
- **Description**: Build a comprehensive, authentic Material 3 design system component preview based on official M3 specifications (https://m3.material.io/components), implemented natively in React for the web. Includes Top App Bar, Navigation Bar / Rail, common buttons (Filled, Elevated, Tonal, Outlined, Text, FAB), Cards (Elevated, Filled, Outlined), Text Fields (Filled and Outlined with floating labels), Filter Chips, Badges, and Switches/Checkboxes.
- **Acceptance Criteria**:
  - Components accurately match official Material 3 geometry, elevations, and typography.
  - Correct token mapping from active palette roles to M3 color roles (primary, on-primary, primary-container, surface, on-surface, outline).
  - Interactive elements: clickable buttons, togglable switches/checkboxes, and typed inputs.

### TT-013: Android UI Approximation Preview
- **Status**: `triage`
- **Category**: Previews
- **Title**: Android UI Approximation Preview
- **Description**: Build one or more realistic mobile device frames demonstrating an interactive Android app experience (Jetpack Compose / Material Design 3). Use multiple simulated device screens/frames to showcase distinct navigation patterns (e.g., Top App Bar + Bottom Navigation bar feed screen, and an interactive Form / Settings screen) with interactive controls demonstrating active theme colors in an authentic mobile context.
- **Acceptance Criteria**:
  - Realistic Android mobile device silhouettes with status bar and navigation bar.
  - Multiple device screens displaying different navigation paradigms and interactive components.
  - Interactive controls (buttons, switches, inputs) reacting live to theme changes.

### TT-014: iOS UI Approximation Preview
- **Status**: `triage`
- **Category**: Previews
- **Title**: iOS UI Approximation Preview
- **Description**: Build one or more realistic Apple iPhone mobile device frames demonstrating an interactive iOS app experience (Apple Human Interface Guidelines / SwiftUI). Displays dynamic island, translucent navigation bar, grouped inset list style, Cupertino segmented controls, rounded action buttons, and bottom tab bar with interactive states.
- **Acceptance Criteria**:
  - Realistic iPhone mobile device frame matching iOS proportions and SF Pro typography aesthetics.
  - Multiple device screens or navigation views with interactive Cupertino controls.
  - Reactive color theming applied to system tint, backgrounds, and grouped surfaces.

### TT-015: Tailwind v3 and v4 Theme Exporter
- **Status**: `testing`
- **Category**: Exporters
- **Title**: Tailwind v3 and v4 Theme Exporter
- **Description**: Implement export functionality for Tailwind CSS. For Tailwind v4, generate a single `.css` theme file using `@theme` and `--color-*` variables, with a one-click download button and code snippet for importing and setting default theme classes. For Tailwind v3, generate `tailwind.config.js` theme extension code with configurable brand token prefix.
- **Acceptance Criteria**:
  - Generates valid Tailwind v4 CSS containing all 50–950 shade steps and semantic tokens.
  - Generates valid Tailwind v3 JavaScript configuration object.
  - One-click copy snippet button with confirmation toast.
  - One-click download button for `theme.css`.
  - Clear usage instructions included in export drawer.

### TT-016: Android XML Resource Generator & Zip Packager
- **Status**: `testing`
- **Category**: Exporters
- **Title**: Android XML Resource Generator & Zip Packager
- **Description**: Generate native Android XML resource files targeting Material 3 (`Theme.Material3.DayNight.NoActionBar`). Bundles `res/values/colors.xml`, `res/values/themes.xml`, and `res/values-night/themes.xml` into a downloadable `.zip` archive using `jszip`, preserving the exact Android Studio `res/` hierarchy. Also provides copyable XML snippets.
- **Acceptance Criteria**:
  - Formats valid `colors.xml` with color item tags.
  - Generates `themes.xml` referencing color resources in Material 3 conventions.
  - Client-side ZIP generation using `jszip` packaging `res/values/colors.xml` and related theme files.
  - One-click `.zip` file download named `android-theme-resources.zip`.
  - Copyable single-file XML snippet tabs.

### TT-017: iOS Swift & xcassets Exporter
- **Status**: `testing`
- **Category**: Exporters
- **Title**: iOS Swift & xcassets Exporter
- **Description**: Generate iOS theme assets. Produce a copyable `Theme.swift` file with SwiftUI `Color` static constants (`Color.themePrimary`, `Color.themeBackground`, etc.) and UIKit `UIColor` extensions. Also generate a downloadable `.xcassets` color set folder structure packaged in a `.zip` file using `jszip` for Xcode Asset Catalogs.
- **Acceptance Criteria**:
  - Generates Swift code snippet implementing static color definitions for SwiftUI and UIKit.
  - Generates `.zip` download using `jszip` containing `Colors.xcassets` folder with `.colorset` folders and `Contents.json`.
  - One-click copy and download functionality.

### TT-018: Shareable URL Generator with Configurable Base URL
- **Status**: `backlog`
- **Category**: Exporters
- **Title**: Shareable URL Generator with Configurable Base URL
- **Description**: Create a shareable URL export modal/panel. The export encodes the full palette configuration into a shareable URL. Allow user to configure the Base URL (defaults to `https://headhunter45.github.io/ThemeTool/`, with quick toggle for `Current Domain` or `http://localhost:5173/`, and custom domain input). Persists Base URL preference in `localStorage`.
- **Acceptance Criteria**:
  - Input field for Base URL with persistence to local storage.
  - Generated shareable URL updating reactively.
  - One-click copy shareable link with clipboard confirmation.
  - Opening generated URL restores exact palette state.

### TT-019: Accessibility & WCAG Contrast Validator
- **Status**: `backlog`
- **Category**: Quality
- **Title**: Accessibility & WCAG Contrast Validator
- **Description**: Provide a dedicated Accessibility & Contrast Matrix section below the palette editor. Evaluates WCAG 2.1 contrast ratios across all semantic role pairings (Text on Background, Primary on Background, Text on Primary button, Text on Secondary, Text on Accent). Displays AA, AAA, and Fail status badges for normal and large text, with a 1-click "Auto-Fix for AA" suggestion that minimally adjusts lightness in OKLCH to reach compliance.
- **Acceptance Criteria**:
  - Dedicated Accessibility / Contrast Matrix dashboard card.
  - Real-time contrast ratio calculations for all key role pairings.
  - Visual badges showing AA and AAA compliance ratings.
  - Suggestion / auto-fix button to tweak lightness to achieve AA compliance.

### TT-020: Gradient Palette Generation & Export
- **Status**: `planning`
- **Category**: Enhancements
- **Title**: Gradient Palette Generation & Export
- **Description**: Extend palette editor to support linear, radial, and conic gradient definitions between palette colors. Export CSS gradient strings, Tailwind gradient utility classes, and Android `gradient` drawable XML.
- **Acceptance Criteria**:
  - Interactive gradient angle and stop slider.
  - Export CSS `linear-gradient` and Tailwind background gradient syntax.
  - Android gradient drawable XML export.

### TT-021: Extended Theme Tokens (Borders, Shadows, Radii)
- **Status**: `planning`
- **Category**: Enhancements
- **Title**: Extended Theme Tokens (Borders, Shadows, Radii)
- **Description**: Allow configuring border widths, corner radius styles (square, rounded, pill), and shadow depths that apply uniformly across all component previews and export configs.
- **Acceptance Criteria**:
  - Global token sliders for radius and border width.
  - Previews reflect radius and border changes live.
  - Exported configs include extended tokens.

### TT-022: Dark Mode Duality Generator
- **Status**: `triage`
- **Category**: Enhancements
- **Title**: Dark Mode Duality Generator
- **Description**: Maintain dual parallel palette configurations (Light Theme & Dark Theme). Provide a bidirectional translator that derives a dark theme from a light theme (or vice versa) while supporting round-tripping translations (preserving brand hues and chromatic balances across reciprocal conversions).
- **Acceptance Criteria**:
  - Separate state management for Light and Dark palette roles.
  - Bidirectional generator (Light to Dark and Dark to Light).
  - Round-trip fidelity preserving hue and perceptual contrast balance.
  - Dual theme preview toggle across preview targets.

### TT-023: Automated Continuous Integration (CI) Pipeline
- **Status**: `planning`
- **Category**: DevOps
- **Title**: Automated Continuous Integration (CI) Pipeline
- **Description**: Evaluate and configure an automated CI pipeline for pull requests and branch verification (e.g., GitHub Actions or alternate CI providers). The pipeline will execute linting, type-checking (`tsc`), automated unit tests (`vitest`), and build verification to ensure proposed changes meet quality standards before merging into `develop` or `main`.
- **Acceptance Criteria**:
  - Evaluation of CI provider options (GitHub Actions vs alternate external CI tools).
  - Workflow or runner configuration created to execute test and build checks on pull requests without triggering deployments.
  - Required CI check status integrated into repository branch protection rules.

### TT-024: Application Shell, UI Foundation & Light/Dark Theme
- **Status**: `released`
- **Category**: UI / Shell
- **Title**: Application Shell, UI Foundation & Light/Dark Theme
- **Description**: Build the persistent top-level application shell and UI design system foundation supporting light and dark mode. Establish a unified layout containing a brand header (title, logo, GitHub repository link, status pill), theme toggle switch (supporting light, dark, and system preference with local storage persistence), responsive content container, and reusable UI card/panel primitives.
- **Acceptance Criteria**:
  - Top navigation bar featuring ThemeTool branding and theme mode toggle (light / dark / system).
  - Light and dark mode support fully styled with Tailwind CSS, switching dynamically without page reload and persisting to `localStorage`.
  - Main responsive application container and design tokens (borders, surface backgrounds, text colors, card containers) providing a consistent visual foundation for all feature modules.
  - Automated unit tests covering theme toggling and layout rendering.

### TT-025: Standard Theme JSON Exporter & JSON Schema Specification
- **Status**: `testing`
- **Category**: Exporters
- **Title**: Standard Theme JSON Exporter & JSON Schema Specification
- **Description**: Provide a standardized JSON download output option and formal JSON Schema specification for custom automated pipeline processing, CI scripts, and third-party tooling. The JSON file encodes the full active theme (5 semantic roles, custom slots, and 11-step 50–950 shade scales in HEX, RGB, HSL, and OKLCH color models, alongside accessibility ratings and metadata). A formal JSON Schema (`schema/themetool.schema.json`) is maintained and validated.
- **Acceptance Criteria**:
  - Formally validated JSON Schema file at `schema/themetool.schema.json`.
  - Generator producing conformant `theme.json` with semantic roles, custom slots, and full shade scales across color spaces.
  - One-click copy JSON code snippet and one-click `theme.json` file download.
  - Export modal includes an interactive viewer/link for the JSON Schema.
  - Automated unit tests validating exported JSON structures against the JSON Schema.

### TT-026: Base Palette Selection Workflow
- **Status**: `done`
- **Category**: UI / Shell
- **Title**: Base Palette Selection Workflow (Single Color, Presets, Import)
- **Description**: Implement a tutorial-style base palette selection workflow placed directly under the header at the top of the main studio page. The section unites three setup mechanisms into a single row/section:
  1. **Single Seed Color Picker & Generator**: Choose a single seed color (via color picker or hex input) and generate a complete, perceptually balanced 5-role semantic palette (Primary, Secondary, Accent, Background, Text) using OKLCH harmonic and contrast rules.
  2. **Preset Selector**: Fast access to curated theme presets.
  3. **Import Palette**: Quick access to import from external URLs (Coolors, ColorKit, Realtime Colors, UIColors) or code snippets (Tailwind, JSON, raw hex).
  - **Explicit Confirmation**: The user must explicitly click a confirmation button (e.g. "Apply Base Palette") to commit their choice. Picking a color in the picker does not close the section or auto-commit destructively.
  - **Collapsible Section Header**: Once a selection is confirmed, the section shrinks down to just its header bar summarizing the active base choice. Clicking the header expands or collapses the section at any time, allowing the user to return and re-select without friction.
- **Acceptance Criteria**:
  - Unified base selection section rendered under the header at the top of main content.
  - Seed color palette generator derives 5 harmonious semantic roles from any single color input using OKLCH math.
  - Single color, Presets, and Import controls arranged cohesively on one line.
  - Dedicated "Apply Base Palette" confirmation button required to apply any choice.
  - Color picker interactions do not close the section or auto-apply prematurely.
  - Section collapses to an expandable summary header upon confirmation.
  - Unit tests verifying single color palette generation and collapsible UI interaction.

### TT-027: App Layout Restructure & System Architecture Navigation
- **Status**: `done`
- **Category**: UI / Shell
- **Title**: App Layout Restructure, System Architecture Navigation & Public UI Cleanup
- **Description**: Clean up internal development markers from the public user interface and re-organize the application layout to flow naturally like a step-by-step design studio:
  1. **Remove Developer Artifacts**: Remove internal task ID badges and tracking labels (e.g., "TT-004 URL Synced", "TT-003 Live") from user-facing components.
  2. **Dedicated System Architecture Tab**: Move the System Architecture module cards out of the main studio canvas into a dedicated "Architecture" view accessible via header tab navigation (switching between "Studio" and "Architecture").
  3. **Sequential Studio Page Flow**: Restructure the primary Studio page into a logical top-to-bottom hierarchy:
     - Step 1: Base Palette Selection (TT-026 collapsible banner).
     - Step 2: Active Semantic Palette Bar (5 roles, locks, hex inputs, and action buttons).
     - Step 3: Interactive Component & Platform Previews.
- **Acceptance Criteria**:
  - All "TT-*" badges and development status indicators removed from public studio view.
  - Header tab navigation allows toggling between "Studio" and "Architecture".
  - "Architecture" view cleanly presents the foundational modules and system pipeline.
  - Studio view presents a focused, intuitive tutorial flow (Base -> Palette -> Previews).
  - Unit tests updated to reflect cleaned UI labels and view switching.

### TT-028: Contextual Color Inspector & On-Demand Shade Studio
- **Status**: `done`
- **Category**: UI / Shell
- **Title**: Contextual Color Inspector & On-Demand Shade Studio
- **Description**: Transform the static, always-visible Color Math & Shade Studio into an on-demand, contextual deep-dive tool:
  1. **Hidden by Default**: Hide the raw color math conversions and shade tables from the main studio canvas by default to keep the interface focused.
  2. **Trigger from Color Card**: Add an "Inspect" / "Shade Studio" button to each semantic color card in the `PaletteBar`.
  3. **Contextual Inspector**: Clicking opens an inspector drawer or modal tied directly to the clicked color role, presenting:
     - Calibrated 11-step tonal shade scale (50–950) with natural vs 500 anchor toggle.
     - Perceptual color math conversions (RGB, HSL, OKLCH, relative luminance).
     - WCAG contrast metrics against text and background.
  4. **Expandable Tonal Scale**: Provide an expandable toggle for the tonal scale inside or alongside the inspector.
- **Acceptance Criteria**:
  - Standalone Color Math & Shade Studio removed from default page canvas.
  - Each color card in `PaletteBar` features an "Inspect" action opening the contextual shade studio for that specific color.
  - Inspector drawer/modal displays live OKLCH shade steps and color space conversions.
  - Tonal scale expandable/collapsible with clean animation.
  - Responsive, accessible, and supports Light/Dark theme modes.
  - Unit tests verifying contextual trigger and color synchronization.

### TT-029: Consolidate Preview Targets to UI Design Systems
- **Status**: `testing`
- **Category**: Previews
- **Title**: Consolidate Preview Targets to UI Design Systems
- **Description**: Following the architectural refinement prioritizing UI styling/design system frameworks over JS runtime frameworks, update the preview subsystem to remove the legacy `react` and `angular` targets. Consolidate the active preview targets to the 4 canonical UI design systems:
  1. **Tailwind CSS** (`tailwind` - Web UI Framework)
  2. **Material Design M3** (`material` - Web UI Design System)
  3. **Android** (`android` - Mobile UI Framework / Jetpack Compose)
  4. **iOS** (`ios` - Mobile UI Framework / SwiftUI)
- **Acceptance Criteria**:
  - `PreviewTargetId` union updated to `'tailwind' | 'material' | 'android' | 'ios'`.
  - Segmented target bar and toggle pills render only the 4 design systems.
  - Legacy `react` and `angular` cards, types, and references cleanly removed from `src/core/preview/` and `src/components/preview/`.
  - All test suites (`usePreviewTargets.test.ts`, `PreviewSection.test.tsx`, `App.test.tsx`) updated and passing 100%.
