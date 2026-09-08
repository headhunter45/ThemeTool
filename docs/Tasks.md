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
| **[TT-003](#tt-003-core-color-math-and-shade-scale-engine)** | Core Color Math & Shade Scale Engine | `testing` | Core Engine |
| **[TT-004](#tt-004-palette-state-management--url-synchronization)** | Palette State Management & URL Synchronization | `testing` | Core Engine |
| **[TT-005](#tt-005-coolors--colorkit-url-import-parser)** | Coolors & ColorKit URL Import Parser | `backlog` | Importers |
| **[TT-006](#tt-006-uicolors-tailwind-format-parser)** | UIColors (Tailwind 3 & 4) Format Parser | `triage` | Importers |
| **[TT-007](#tt-007-realtime-colors--raw-format-importer)** | Realtime Colors & Raw Format Importer | `triage` | Importers |
| **[TT-008](#tt-008-interactive-palette-editor-ui)** | Interactive Palette Editor UI | `triage` | UI / Shell |
| **[TT-009](#tt-009-preview-target-selection--visibility-controls)** | Preview Target Selection & Visibility Controls | `triage` | UI / Shell |
| **[TT-010](#tt-010-tailwind-web-component-preview)** | Tailwind Web Component Preview | `triage` | Previews |
| **[TT-011](#tt-011-react--angular-component-previews)** | React & Angular Component Previews | `triage` | Previews |
| **[TT-012](#tt-012-material-design-m3-component-preview)** | Material Design (M3) Component Preview | `triage` | Previews |
| **[TT-013](#tt-013-android-ui-approximation-preview)** | Android UI Approximation Preview | `triage` | Previews |
| **[TT-014](#tt-014-ios-ui-approximation-preview)** | iOS UI Approximation Preview | `triage` | Previews |
| **[TT-015](#tt-015-tailwind-v3-and-v4-theme-exporter)** | Tailwind v3 and v4 Theme Exporter | `triage` | Exporters |
| **[TT-016](#tt-016-android-xml-resource-generator--zip-packager)** | Android XML Resource Generator & Zip Packager | `triage` | Exporters |
| **[TT-017](#tt-017-ios-swift--xcassets-exporter)** | iOS Swift & xcassets Exporter | `triage` | Exporters |
| **[TT-018](#tt-018-shareable-url-generator-with-configurable-base-url)** | Shareable URL Generator with Configurable Base URL | `triage` | Exporters |
| **[TT-019](#tt-019-accessibility--wcag-contrast-validator)** | Accessibility & WCAG Contrast Validator | `planning` | Quality |
| **[TT-020](#tt-020-gradient-palette-generation--export)** | Gradient Palette Generation & Export | `planning` | Enhancements |
| **[TT-021](#tt-021-extended-theme-tokens-borders-shadows-radii)** | Extended Theme Tokens (Borders, Shadows, Radii) | `planning` | Enhancements |
| **[TT-022](#tt-022-dark-mode-duality-generator)** | Dark Mode Duality Generator | `planning` | Enhancements |
| **[TT-023](#tt-023-automated-continuous-integration-ci-pipeline)** | Automated Continuous Integration (CI) Pipeline | `planning` | DevOps |
| **[TT-024](#tt-024-application-shell-ui-foundation--lightdark-theme)** | Application Shell, UI Foundation & Light/Dark Theme | `released` | UI / Shell |

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
- **Status**: `triage`
- **Category**: Importers
- **Title**: UIColors (Tailwind 3 & 4) Format Parser
- **Description**: Implement an import parser that accepts copy-pasted UIColors/Tailwind code blocks. It should recognize both Tailwind v3 JavaScript object syntax (`'50': '#faf9ec', ...`) and Tailwind v4 CSS variable definitions (`--color-lucky-50: #faf9ec; ...`), extract the shade mapping, and load it into the application.
- **Acceptance Criteria**:
  - Detects and parses Tailwind 3 JS object snippets.
  - Detects and parses Tailwind 4 `--color-*-{50..950}` CSS rules.
  - Maps shades to the active palette's primary/brand scale or allows assigning to a semantic role.

### TT-007: Realtime Colors & Raw Format Importer
- **Status**: `triage`
- **Category**: Importers
- **Title**: Realtime Colors & Raw Format Importer
- **Description**: Support importing palettes formatted as Realtime Colors JSON or query strings, as well as unstructured raw text (comma-separated hex codes, space-separated hex codes, or array of strings).
- **Acceptance Criteria**:
  - Modal or input drawer for pasting raw hex lists or JSON.
  - Maps recognized tokens (text, background, primary, secondary, accent) to the corresponding roles.
  - Graceful fallback for arbitrary color counts (auto-assigns to closest semantic roles).

### TT-008: Interactive Palette Editor UI
- **Status**: `triage`
- **Category**: UI / Shell
- **Title**: Interactive Palette Editor UI
- **Description**: Design and build the primary palette manipulation bar. Each color card displays its semantic name, hex code, color swatch, lock toggle (to keep color when randomizing), shade preview dropdown, and native/custom color picker. Include a "Randomize / Generate" button and undo/redo capability.
- **Acceptance Criteria**:
  - Responsive top/sidebar palette toolbar displaying all active colors.
  - Clicking color opens interactive picker / hex editor.
  - Lock button prevents color from changing during random generation.
  - Randomize button generates visually balanced palettes for unlocked slots.

### TT-009: Preview Target Selection & Visibility Controls
- **Status**: `triage`
- **Category**: UI / Shell
- **Title**: Preview Target Selection & Visibility Controls
- **Description**: Provide controls allowing the user to select which preview targets to inspect. Users can choose a single target (tabbed view) or toggle visibility checkboxes for individual targets (multi-grid view) so they only see the platforms they care about (e.g., only Tailwind and Android).
- **Acceptance Criteria**:
  - Toggle between "Single Target" view and "Custom Grid" view.
  - Show/hide checkboxes for Tailwind, React, Angular, Material, Android, iOS.
  - Selected target preferences saved in session / local storage or URL state.

### TT-010: Tailwind Web Component Preview
- **Status**: `triage`
- **Category**: Previews
- **Title**: Tailwind Web Component Preview
- **Description**: Build a realistic standard web component preview styled using Tailwind CSS classes wired to the current palette. Includes a landing page hero section, navigation bar, primary/secondary buttons, badge pills, cards with text and media, form inputs, and alert boxes.
- **Acceptance Criteria**:
  - Components visually react in real time to palette color changes.
  - Adheres to semantic roles (Background, Text, Primary CTA, Secondary buttons, Accent alerts).
  - Clean, modern layout matching high-quality web UI standards.

### TT-011: React & Angular Component Previews
- **Status**: `triage`
- **Category**: Previews
- **Title**: React & Angular Component Previews
- **Description**: Build component previews showcasing React-idiomatic components (cards, interactive tabs, modals) and Angular-idiomatic component structures.
- **Acceptance Criteria**:
  - Component views reflecting idiomatic web design system conventions.
  - Live reactive updates when palette changes.

### TT-012: Material Design (M3) Component Preview
- **Status**: `triage`
- **Category**: Previews
- **Title**: Material Design (M3) Component Preview
- **Description**: Build a Material 3 design system component preview. Includes Top App Bar, Floating Action Button (FAB), Filled Button, Outlined Button, Elevated Cards, Filter Chips, and Navigation Bar utilizing M3 color roles (primary, on-primary, primary-container, surface, etc.).
- **Acceptance Criteria**:
  - Components match Material 3 elevation, rounding, and typography aesthetics.
  - Correct role mapping from active palette to M3 tokens.

### TT-013: Android UI Approximation Preview
- **Status**: `triage`
- **Category**: Previews
- **Title**: Android UI Approximation Preview
- **Description**: Build a mobile device frame simulating an Android (Jetpack Compose / Material) app screen. Displays an Android status bar, top app bar, list views with avatars, FAB, and system navigation bar with palette theme applied.
- **Acceptance Criteria**:
  - Visual mobile device frame resembling modern Android devices.
  - Android-specific component styling (pill buttons, M3 ripple indicators, system bars).
  - Responsive toggle to view in light or simulated dark theme.

### TT-014: iOS UI Approximation Preview
- **Status**: `triage`
- **Category**: Previews
- **Title**: iOS UI Approximation Preview
- **Description**: Build a mobile device frame simulating an Apple iOS (Human Interface Guidelines / SwiftUI) app screen. Displays dynamic island / notch, translucent navigation bar, grouped inset list style, iOS segmented control, rounded action buttons, and bottom tab bar.
- **Acceptance Criteria**:
  - Visual mobile frame matching iOS proportions and typography (SF Pro styling).
  - Inset grouped list, Cupertino-style segmented controls, and bottom navigation.
  - Reactive color theming for accent/tint colors.

### TT-015: Tailwind v3 and v4 Theme Exporter
- **Status**: `triage`
- **Category**: Exporters
- **Title**: Tailwind v3 and v4 Theme Exporter
- **Description**: Implement export functionality for Tailwind CSS. For Tailwind v4, generate a single `.css` theme file using `@theme` and `--color-*` variables, with a one-click download button and code snippet for importing and setting default theme classes. For Tailwind v3, generate `tailwind.config.js` theme extension code.
- **Acceptance Criteria**:
  - Generates valid Tailwind v4 CSS containing all 50–950 shade steps and semantic tokens.
  - Generates valid Tailwind v3 JavaScript configuration object.
  - One-click copy snippet button with confirmation toast.
  - One-click download button for `theme.css`.
  - Clear usage instructions included in export drawer.

### TT-016: Android XML Resource Generator & Zip Packager
- **Status**: `triage`
- **Category**: Exporters
- **Title**: Android XML Resource Generator & Zip Packager
- **Description**: Generate native Android XML resource files. If multiple XML files are required (`res/values/colors.xml`, `res/values/themes.xml`, and `res/values-night/themes.xml`), bundle them into a downloadable `.zip` file preserving the exact `res/` directory hierarchy ready to drop into an Android Studio project. Also provide a copyable XML snippet for `colors.xml`.
- **Acceptance Criteria**:
  - Formats valid `colors.xml` with color item tags.
  - Generates `themes.xml` referencing color resources.
  - In-browser ZIP archive generation creating `res/values/colors.xml` and related files.
  - One-click `.zip` file download named `android-theme-resources.zip`.
  - Copyable single-file XML snippet.

### TT-017: iOS Swift & xcassets Exporter
- **Status**: `triage`
- **Category**: Exporters
- **Title**: iOS Swift & xcassets Exporter
- **Description**: Generate iOS theme assets. Produce a copyable Swift code file with a `Color` extension (SwiftUI) and `UIColor` extensions (UIKit), as well as a downloadable `.xcassets` color set folder structure.
- **Acceptance Criteria**:
  - Generates Swift code snippet implementing static color definitions.
  - Optional `.zip` download containing `.colorset` folders with `Contents.json` for Xcode Asset Catalogs.
  - One-click copy and download functionality.

### TT-018: Shareable URL Generator with Configurable Base URL
- **Status**: `triage`
- **Category**: Exporters
- **Title**: Shareable URL Generator with Configurable Base URL
- **Description**: Create a shareable URL export modal/panel. The export encodes the full palette configuration into a shareable URL. Allow user to configure the Base URL (defaults to `https://headhunter45.github.io/ThemeTool/`, with option to change to custom domain or localhost).
- **Acceptance Criteria**:
  - Input field for Base URL with persistence to local storage.
  - Generated shareable URL updating reactively.
  - One-click copy shareable link with clipboard confirmation.
  - Opening generated URL restores exact palette state.

### TT-019: Accessibility & WCAG Contrast Validator
- **Status**: `planning`
- **Category**: Quality
- **Title**: Accessibility & WCAG Contrast Validator
- **Description**: Calculate and display WCAG 2.1 contrast ratios between Text and Background, Primary and Background, and on-button text colors. Show compliance badges (AA / AAA / Fail for normal and large text).
- **Acceptance Criteria**:
  - Real-time contrast ratio calculations.
  - Visual badges showing AA and AAA compliance ratings.
  - Suggestion or auto-fix button to tweak lightness to achieve AA compliance.

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
- **Status**: `planning`
- **Category**: Enhancements
- **Title**: Dark Mode Duality Generator
- **Description**: Automatically derive a high-quality dark mode pairing for any light palette (inverting lightness while preserving hue/chroma in OKLCH space). Allow user to toggle previews between light and dark mode simultaneously.
- **Acceptance Criteria**:
  - One-click "Generate Dark Theme" button.
  - Dual theme preview mode.
  - Generates `res/values-night/` XML and Tailwind dark mode classes (`dark:` / CSS media query).

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
