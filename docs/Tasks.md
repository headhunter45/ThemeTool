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
| **[TT-003](#tt-003-core-color-math-and-shade-scale-engine)** | Core Color Math & Shade Scale Engine | `released` | Core Engine |
| **[TT-004](#tt-004-palette-state-management--url-synchronization)** | Palette State Management & URL Synchronization | `released` | Core Engine |
| **[TT-005](#tt-005-coolors--colorkit-url-import-parser)** | Coolors & ColorKit URL Import Parser | `released` | Importers |
| **[TT-006](#tt-006-uicolors-tailwind-format-parser)** | UIColors (Tailwind 3 & 4) Format Parser | `released` | Importers |
| **[TT-007](#tt-007-realtime-colors--raw-format-importer)** | Realtime Colors & Raw Format Importer | `released` | Importers |
| **[TT-008](#tt-008-interactive-palette-editor-ui)** | Interactive Palette Editor UI | `released` | UI / Shell |
| **[TT-009](#tt-009-preview-target-selection--visibility-controls)** | Preview Target Selection & Visibility Controls | `released` | UI / Shell |
| **[TT-010](#tt-010-tailwind-web-component-preview)** | Tailwind Web Component Preview | `released` | Previews |
| **[TT-011](#tt-011-react--angular-component-previews)** | React & Angular Previews (Superseded) | `cancelled` | Previews |
| **[TT-012](#tt-012-material-design-m3-component-preview)** | Material Design (M3) Component Preview | `released` | Previews |
| **[TT-013](#tt-013-android-ui-approximation-preview)** | Android UI Approximation Preview | `released` | Previews |
| **[TT-014](#tt-014-ios-ui-approximation-preview)** | iOS UI Approximation Preview | `released` | Previews |
| **[TT-015](#tt-015-tailwind-v3-and-v4-theme-exporter)** | Tailwind v3 and v4 Theme Exporter | `released` | Exporters |
| **[TT-016](#tt-016-android-xml-resource-generator--zip-packager)** | Android XML Resource Generator & Zip Packager | `released` | Exporters |
| **[TT-017](#tt-017-ios-swift--xcassets-exporter)** | iOS Swift & xcassets Exporter | `released` | Exporters |
| **[TT-018](#tt-018-shareable-url-generator-with-configurable-base-url)** | Shareable URL Generator with Configurable Base URL | `released` | Exporters |
| **[TT-019](#tt-019-accessibility--wcag-contrast-validator)** | Accessibility & WCAG Contrast Validator | `released` | Quality |
| **[TT-020](#tt-020-gradient-palette-generation--export)** | Gradient Palette Generation & Export | `planning` | Enhancements |
| **[TT-021](#tt-021-extended-theme-tokens-borders-shadows-radii)** | Extended Theme Tokens (Borders, Shadows, Radii) | `planning` | Enhancements |
| **[TT-022](#tt-022-dark-mode-duality-generator)** | Dark Mode Duality Generator | `released` | Enhancements |
| **[TT-023](#tt-023-automated-continuous-integration-ci-pipeline)** | Automated Continuous Integration (CI) Pipeline | `planning` | DevOps |
| **[TT-024](#tt-024-application-shell-ui-foundation--lightdark-theme)** | Application Shell, UI Foundation & Light/Dark Theme | `released` | UI / Shell |
| **[TT-025](#tt-025-standard-theme-json-exporter--json-schema-specification)** | Standard Theme JSON Exporter & JSON Schema | `released` | Exporters |
| **[TT-026](#tt-026-base-palette-selection-workflow)** | Base Palette Selection Workflow (Single Color, Presets, Import) | `released` | UI / Shell |
| **[TT-027](#tt-027-app-layout-restructure--system-architecture-navigation)** | App Layout Restructure & System Architecture Navigation | `released` | UI / Shell |
| **[TT-028](#tt-028-contextual-color-inspector--on-demand-shade-studio)** | Contextual Color Inspector & On-Demand Shade Studio | `released` | UI / Shell |
| **[TT-029](#tt-029-consolidate-preview-targets-to-ui-design-systems)** | Consolidate Preview Targets to UI Design Systems | `released` | Previews |
| **[TT-030](#tt-030-compact-hero-section--remove-system-architecture-tab)** | Compact Hero Section & Remove System Architecture Tab | `backlog` | UI / Shell |
| **[TT-031](#tt-031-studio-5-step-workflow-reorganization--dedicated-export-section)** | Studio 5-Step Workflow Reorganization & Dedicated Export Section | `backlog` | UI / Shell |
| **[TT-032](#tt-032-shade-studio--palette-cards-cleanup)** | Shade Studio & Palette Cards Cleanup | `backlog` | UI / Shell |
| **[TT-033](#tt-033-accessibility-section-header--indicator-cleanup)** | Accessibility Section Header & Indicator Cleanup | `backlog` | Quality |
| **[TT-034](#tt-034-preview-component-interactivity--common-app-chrome)** | Preview Component Interactivity & Common App Chrome | `backlog` | Previews |
| **[TT-035](#tt-035-standardized-preview-viewport-sizing--edge-to-edge-diagnostics)** | Standardized Preview Viewport Sizing & Edge-to-Edge Diagnostics | `backlog` | Previews |

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
- **Status**: `released`
- **Category**: Core Engine
- **Title**: Core Color Math & Shade Scale Engine
- **Description**: Implement color utilities for format conversions (HEX, RGB, HSL, OKLCH), luminance calculation, and algorithmic generation of 50–950 tonal shade scales (11 shade steps matching Tailwind convention). Ensure smooth perceptual lightness distribution using OKLCH/CIELAB color spaces.
- **Acceptance Criteria**:
  - Conversion functions between HEX, RGB, HSL, and OKLCH.
  - Shade generator producing accurate 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 steps for any base hex color.
  - Unit tests in Vitest covering edge cases (pure black, pure white, neon tones).

### TT-004: Palette State Management & URL Synchronization
- **Status**: `released`
- **Category**: Core Engine
- **Title**: Palette State Management & URL Synchronization
- **Description**: Build the application state management to hold the active palette (5 semantic roles: Text, Background, Primary, Secondary, Accent, plus custom color slots). Synchronize state bi-directionally with the browser URL (hash or query parameters) so that any palette state can be bookmarked or shared without a backend.
- **Acceptance Criteria**:
  - State store for palette roles (Text, Background, Primary, Secondary, Accent).
  - Changes to colors update URL hash/search params immediately (debounced if needed).
  - Navigating to or refreshing a URL with encoded palette loads the palette state accurately.

### TT-005: Coolors & ColorKit URL Import Parser
- **Status**: `released`
- **Category**: Importers
- **Title**: Coolors & ColorKit URL Import Parser
- **Description**: Create a URL parser that accepts URLs from Coolors (e.g., `https://coolors.co/palette/6f2dbd-a663cc-b298dc-b8d0eb-b9faf8`) and ColorKit (e.g., `https://colorkit.co/palette/eebea0-ff8d83-ffa89f-ffc2bc-aaae80/`), extracts the hex color values, and populates the active palette.
- **Acceptance Criteria**:
  - Parses 5-hex paths from Coolors URL strings.
  - Parses hex paths from ColorKit URL strings.
  - Validates hex codes, handling optional `#` and casing.
  - Unit tests verifying parsing of sample URLs from `README.md`.

### TT-006: UIColors (Tailwind 3 & 4) Format Parser
- **Status**: `released`
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
- **Status**: `released`
- **Category**: Importers
- **Title**: Realtime Colors & Raw Format Importer
- **Description**: Extend the `ImportPaletteModal` to accept Realtime Colors URLs (`https://www.realtimecolors.com/?colors=...`), JSON objects (`{ "text": "...", "background": "...", "primary": "...", "secondary": "...", "accent": "..." }`), and unstructured raw text (comma-separated hex codes, space-separated hex codes, or array syntax).
- **Acceptance Criteria**:
  - Real-time auto-detection in `ImportPaletteModal` for Realtime Colors URLs and JSON payloads.
  - Direct 1:1 mapping of recognized semantic tokens (`text`, `background`, `primary`, `secondary`, `accent`) to application roles.
  - Graceful parser for comma/space-separated hex codes with live swatch previews.
  - Unit tests verifying Realtime Colors URL and JSON format parsing.

### TT-008: Interactive Palette Editor UI
- **Status**: `released`
- **Category**: UI / Shell
- **Title**: Interactive Palette Editor UI
- **Description**: Enhance the palette editor with professional editing ergonomics: full Undo/Redo history stack for all palette actions, custom color slot management (adding, renaming, and deleting extra color slots beyond the 5 semantic roles), and a quick Role Swap tool to exchange hex values between any two semantic roles (e.g., swapping Primary <-> Secondary or Text <-> Background).
- **Acceptance Criteria**:
  - Undo / Redo history state stack with toolbar action buttons and keyboard shortcuts (Cmd/Ctrl+Z, Cmd/Ctrl+Shift+Z).
  - Add, edit name, and delete custom extra color slots with color pickers and hex inputs.
  - Role Swap modal/dropdown allowing immediate exchange of colors between any two roles.
  - Respects active role locks during randomize and bulk actions.

### TT-009: Preview Target Selection & Visibility Controls
- **Status**: `released`
- **Category**: UI / Shell
- **Title**: Preview Target Selection & Visibility Controls
- **Description**: Provide intuitive visibility and layout controls for preview targets. Support a segmented target bar offering an "All" view (with individual toggle pills to show or hide specific targets) as well as dedicated single-platform focus tabs focusing on primary UI design systems: Web UI (Tailwind CSS, Material M3) and Mobile UI (Android Jetpack Compose, iOS SwiftUI) for zero-distraction inspection. Persist visibility state in `localStorage`.
- **Acceptance Criteria**:
  - Segmented control supporting "All" mode and single-platform focus tabs.
  - Interactive toggle pills in "All" mode to show/hide individual platform cards.
  - State persistence in `localStorage` so user selections are preserved across reloads.
  - Fluid, responsive layout dynamically rearranging visible preview cards.

### TT-010: Tailwind Web Component Preview
- **Status**: `released`
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
- **Status**: `released`
- **Category**: Previews
- **Title**: Material Design (M3) Component Preview
- **Description**: Build a comprehensive, authentic Material 3 design system component preview based on official M3 specifications (https://m3.material.io/components), implemented natively in React for the web. Includes Top App Bar, Navigation Bar / Rail, common buttons (Filled, Elevated, Tonal, Outlined, Text, FAB), Cards (Elevated, Filled, Outlined), Text Fields (Filled and Outlined with floating labels), Filter Chips, Badges, and Switches/Checkboxes.
- **Acceptance Criteria**:
  - Components accurately match official Material 3 geometry, elevations, and typography.
  - Correct token mapping from active palette roles to M3 color roles (primary, on-primary, primary-container, surface, on-surface, outline).
  - Interactive elements: clickable buttons, togglable switches/checkboxes, and typed inputs.

### TT-013: Android UI Approximation Preview
- **Status**: `released`
- **Category**: Previews
- **Title**: Android UI Approximation Preview
- **Description**: Build a realistic mobile device frame demonstrating an authentic Android application experience (Jetpack Compose / Material Design 3). The preview renders inside an Android smartphone chassis (camera punch-hole cutout, status bar, gesture navigation pill, and chassis bevels) and provides an interactive toggle for **Edge-to-Edge rendering** (comparing modern Android 15 `enableEdgeToEdge()` transparent system bar bleeding vs. legacy solid system bars). Features a multi-screen switcher navigating between a **Feed & Media Dashboard** (Top App Bar, M3 filter chips, media cards with interactive like/bookmark actions, and an Extended Floating Action Button) and an **Interactive Settings & Forms Screen** (M3 switches, radio options, OutlinedTextField with floating label, and sliders).
- **Acceptance Criteria**:
  - Realistic Android smartphone chassis with status bar (clock, battery, Wi-Fi), top camera punch-hole, and bottom gesture navigation pill.
  - **Interactive Edge-to-Edge Toggle**:
    - `On` (Modern Android 15 default): App content extends seamlessly behind transparent status and navigation bars with contrast-aware system icons and a floating gesture pill.
    - `Off` (Legacy mode): System bars render with dedicated opaque surface boundaries (`surfaceContainer`).
  - **Dual Screen Switcher**:
    - Feed / Media Dashboard (`Home`) with Top App Bar, M3 filter chips, feed cards with like/bookmark actions, and Extended Floating Action Button (FAB).
    - Settings & Form Controls (`Settings`) with switches, radio options, OutlinedTextField, and sliders.
  - Interactive state management for all controls (toggling switches, clicking chips/buttons, switching screens, typing in inputs, incrementing FAB counter).
  - Real-time reactivity to active palette changes and M3 color roles (`primary`, `onPrimary`, `primaryContainer`, `surface`, `onSurface`, `tertiary`, `outline`).
  - Quick-action "Export Android XML" button opening `ExportAndroidModal`.
  - Comprehensive unit test suite in `src/components/preview/android/AndroidPreview.test.tsx` verifying screen transitions, edge-to-edge toggling, and interactive controls.

### TT-014: iOS UI Approximation Preview
- **Status**: `released`
- **Category**: Previews
- **Title**: iOS UI Approximation Preview
- **Description**: Build a realistic Apple iPhone mobile device frame demonstrating an authentic iOS application experience (Apple Human Interface Guidelines / SwiftUI). The preview renders inside an iPhone chassis silhouette (Dynamic Island sensor cutout, SF Pro typography, status bar, home indicator, and chassis bevels with Action Button / volume notches). Derives adaptive iOS Light/Dark appearance directly from active palette background luminance (`getRelativeLuminance(colors.background) < 0.5`). Features a multi-screen switcher navigating between an **App Store / Featured Feed View** (Large Title navigation bar, Cupertino segmented control, hero highlight card, and "GET" pill action buttons) and a **Grouped Inset Settings View** (`List(style: .insetGrouped)` cells, disclosure chevrons, system icon badges, interactive Cupertino toggle switches, and sliders). Features a frosted translucent bottom tab bar (`.ultraThinMaterial` / `backdrop-blur-md`) with tab switching.
- **Acceptance Criteria**:
  - Realistic iPhone mobile device chassis with centered Dynamic Island, iOS status bar (time, cellular signal, Wi-Fi, battery pill), and bottom home indicator.
  - Adaptive iOS Light/Dark appearance driven automatically by palette background luminance.
  - Frosted translucent navigation bar and bottom tab bar with interactive tab switching (`Featured`, `Search`, `Settings`).
  - **Dual Screen Switcher**:
    - Featured / App Store screen (`Featured`) with Cupertino segmented controls, hero highlight cards, and "GET" pill action buttons.
    - Grouped Inset Settings screen (`Settings`) with `List(style: .insetGrouped)` cells, disclosure chevrons, system icon badges, Cupertino toggle switches, and sliders.
  - Interactive state management for all controls (tab navigation, segmented control toggling, Cupertino switch toggling, button clicks).
  - Real-time reactivity to active palette changes and iOS system semantic roles (`systemTint` mapped to `colors.primary`, `systemBackground`, `label` mapped to `colors.text`, and `accentColor` mapped to `colors.accent`).
  - Quick-action "Export iOS Assets" button opening `ExportIosModal` (TT-017).
  - Comprehensive unit test suite in `src/components/preview/ios/IosPreview.test.tsx` verifying chassis, tab switching, and Cupertino controls.

### TT-015: Tailwind v3 and v4 Theme Exporter
- **Status**: `released`
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
- **Status**: `released`
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
- **Status**: `released`
- **Category**: Exporters
- **Title**: iOS Swift & xcassets Exporter
- **Description**: Generate iOS theme assets. Produce a copyable `Theme.swift` file with SwiftUI `Color` static constants (`Color.themePrimary`, `Color.themeBackground`, etc.) and UIKit `UIColor` extensions. Also generate a downloadable `.xcassets` color set folder structure packaged in a `.zip` file using `jszip` for Xcode Asset Catalogs.
- **Acceptance Criteria**:
  - Generates Swift code snippet implementing static color definitions for SwiftUI and UIKit.
  - Generates `.zip` download using `jszip` containing `Colors.xcassets` folder with `.colorset` folders and `Contents.json`.
  - One-click copy and download functionality.

### TT-018: Shareable URL Generator with Configurable Base URL
- **Status**: `released`
- **Category**: Exporters
- **Title**: Shareable URL Generator with Configurable Base URL
- **Description**: Create a shareable URL export modal/panel. The export encodes the full palette configuration into a shareable URL. Allow user to configure the Base URL (defaults to `https://headhunter45.github.io/ThemeTool/`, with quick toggle for `Current Domain` or `http://localhost:5173/`, and custom domain input). Persists Base URL preference in `localStorage`.
- **Acceptance Criteria**:
  - Input field for Base URL with persistence to local storage.
  - Generated shareable URL updating reactively.
  - One-click copy shareable link with clipboard confirmation.
  - Opening generated URL restores exact palette state.

### TT-019: Accessibility & WCAG Contrast Validator
- **Status**: `released`
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
- **Status**: `released`
- **Category**: Enhancements
- **Title**: Dark Mode Duality Generator
- **Description**: Enable ThemeTool to manage parallel Light and Dark palette configurations simultaneously. Provides a bidirectional color generator in the perceptual OKLCH color space that automatically derives a balanced dark theme from a light theme (or vice-versa) while supporting round-trip fidelity, manual per-mode fine-tuning, and dual-mode exports. The generator maps light canvases to elevated dark surfaces while preserving subtle background hue tint, transforms dark text to high-legibility light text, scales brand role lightness ($L \to 0.70–0.80$), and softens chroma to prevent chromatic aberration against dark backgrounds without eye fatigue. Includes an active mode switcher on the palette bar (`☀️ Light` / `🌙 Dark`), a side-by-side comparison modal with live contrast audits before applying, and multi-target preview integration.
- **Acceptance Criteria**:
  - Dual palette state management in `PaletteContext` maintaining independent `light` and `dark` configurations with backward-compatible accessors.
  - Active mode switcher (`☀️ Light` / `🌙 Dark`) in `PaletteBar` with 1-click `Generate Dark Counterpart` / `Generate Light Counterpart` action buttons.
  - Bidirectional OKLCH duality generator (`generateDarkPalette` and `generateLightPalette`) preserving hue fidelity within 2° across round-trips.
  - Side-by-side comparison dialog displaying paired colors and contrast ratios before committing generated themes.
  - Preview section controls to toggle or compare Light and Dark theme appearances across preview cards.
  - Exporter integration packaging both light and dark definitions into Theme JSON, Tailwind, Android XML (`values` and `values-night`), and iOS (`Colors.xcassets`).
  - Comprehensive unit test suite verifying duality math, round-trip fidelity, context state toggling, and UI components.

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
- **Status**: `released`
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
- **Status**: `released`
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
- **Status**: `released`
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
- **Status**: `released`
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
- **Status**: `released`
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

### TT-030: Compact Hero Section & Remove System Architecture Tab
- **Status**: `backlog`
- **Category**: UI / Shell
- **Title**: Compact Hero Section & Remove System Architecture Tab
- **Description**: Streamline the ThemeTool header and hero layout to maximize vertical studio canvas space and focus the application exclusively as a design system studio:
  1. **Compact Hero Section**: Significantly reduce the vertical height of the hero banner in `App.tsx`. Reduce padding (e.g. from `p-8 sm:p-10` down to `p-4 sm:p-6`), scale down headline typography, streamline supporting copy, and compact the export target pills to keep primary interactive controls visible above the fold.
  2. **Remove System Architecture Tab**: Remove the "System Architecture" navigation tab and toggle from `Header.tsx` and eliminate the `SystemArchitectureView` switching branch in `App.tsx`. Retain the underlying architectural documentation in docs, but dedicate the live app exclusively to the hands-on Theme Studio workflow.
- **Acceptance Criteria**:
  - Hero banner vertical footprint reduced by at least 40% with responsive padding and compact typography.
  - Interactive palette and base workflow elements appear higher on the screen without unnecessary scrolling.
  - Header navigation tab bar removed; header retains brand logo, version badge, GitHub link, and theme toggle.
  - `SystemArchitectureView` component unmounted from `AppContent` flow.
  - Automated tests updated and passing without regressions.

### TT-031: Studio 5-Step Workflow Reorganization & Dedicated Export Section
- **Status**: `backlog`
- **Category**: UI / Shell
- **Title**: Studio 5-Step Workflow Reorganization & Dedicated Export Section
- **Description**: Establish a clear, sequential 5-step tutorial flow across the entire studio canvas, giving each primary phase a standardized "Step X" title prefix and collecting all export/share capabilities into a dedicated final station:
  1. **Standardized Step Naming & Ordering**:
     - **Step 1: Choose Base**: Seed color generator, preset selector, and external palette import.
     - **Step 2: Experiment**: Active semantic color roles, custom color slots, dark mode duality, role swapping, and theme adjustment controls.
     - **Step 3: Preview**: Multi-target design system component previews (Tailwind, Material M3, Android, iOS).
     - **Step 4: Accessibility**: Real-time WCAG 2.1 contrast ratio audit matrix and 1-click OKLCH auto-fix suggestions.
     - **Step 5: Export**: Centralized save, export, and sharing station.
  2. **Decouple Exporters from Experimentation**: Remove the export buttons (Export JSON, Export Tailwind, Export Android, Export iOS), Share URL button, and import/load preset controls from the `PaletteBar` toolbar. Move import/presets to Step 1 (Choose Base) and all export/share tools to Step 5 (Export).
  3. **Dedicated Step 5 Export Component**: Build a dedicated `ExportSection` card featuring one-click copyable snippets, file downloads (`.css`, `.json`, `.swift`), downloadable Android resource `.zip` archives, Xcode `.xcassets` bundles, and shareable link generator with configurable base URL.
- **Acceptance Criteria**:
  - Every main studio phase is clearly numbered and labeled: Step 1 (Choose Base), Step 2 (Experiment), Step 3 (Preview), Step 4 (Accessibility), Step 5 (Export).
  - Studio sections follow the specified vertical order (Base -> Experiment -> Preview -> Accessibility -> Export).
  - `PaletteBar` toolbar is simplified to focus on experimentation (undo/redo, randomize, swap roles, duality, mode switcher).
  - New Step 5 `ExportSection` component hosts all export targets, file downloads, and share URL tools.
  - Unit tests updated to verify 5-step structure and new export section.

### TT-032: Shade Studio & Palette Cards Cleanup
- **Status**: `backlog`
- **Category**: UI / Shell
- **Title**: Shade Studio & Palette Cards Cleanup
- **Description**: Refine the visual consistency, clarity, and user experience of color cards and the on-demand shade inspector:
  1. **Rename to Shade Studio**: Rename "Color Math & Shade Studio" to simply "Shade Studio" across inspector modal titles, palette card action buttons, and descriptive tooltips.
  2. **Unified Custom Color Slots**:
     - Render custom color slot cards inside the **same container/grid** alongside the 5 fixed semantic roles, eliminating the separate secondary section.
     - Use the identical card layout and controls as the fixed semantic roles (color swatch, native color picker overlay, lock toggle, manual hex input, and copy button) plus a distinct remove/delete button.
     - Add the "Inspect Shades" action button to every custom color slot card, allowing custom tokens to open the Shade Studio.
  3. **Color Cards Hex Field & Copy Usability**:
     - Clarify the manual text input and copy button on all color cards so their function is immediately obvious (e.g. add a subtle "HEX" prefix or placeholder, and provide clear tooltip/copy feedback).
  4. **Shade Studio Conversions Copy Polish**:
     - Update the copy buttons on the color math conversion cards (HEX, RGB, HSL, OKLCH, Luminance) to display clear text and visual feedback (e.g. "Copy" / "Copied!" state or explicit label) rather than an unlabeled icon.
- **Acceptance Criteria**:
  - "Color Math & Shade Studio" modal title and labels updated to "Shade Studio".
  - Custom color slots rendered in the primary color grid alongside fixed roles.
  - Custom color cards feature the "Inspect Shades" button and open the Shade Studio with accurate tonal scales.
  - Custom color cards match fixed role cards in layout, sizing, and controls, while including a remove button.
  - Manual hex input on all cards has clear "HEX" labeling/placeholder and copy button provides visible confirmation feedback.
  - Color math readouts in Shade Studio provide clear copy button text / accessible labels and feedback.
  - Unit tests updated to verify unified grid and custom slot inspection.

### TT-033: Accessibility Section Header & Indicator Cleanup
- **Status**: `backlog`
- **Category**: Quality
- **Title**: Accessibility Section Header & Indicator Cleanup
- **Description**: Streamline and give purposeful utility to the decorative indicators in the Accessibility & WCAG Contrast Matrix header:
  1. **Clarify or Clean Up Decorative Elements**: Review the decorative shield icon (`ShieldCheck`) and static "WCAG 2.1" pill badge in `ContrastMatrix.tsx`.
  2. **Purposeful Interaction**: Replace static, non-functional badges with either an informative popover/tooltip detailing WCAG 2.1 contrast level requirements (3:1 for large text/UI components, 4.5:1 for normal text, 7:1 for AAA compliance) or eliminate visual clutter to keep the card header clean and focused.
- **Acceptance Criteria**:
  - Unclear static badges in the accessibility card header are either removed or converted into informative, interactive elements.
  - If retained as an interactive element, hovering or clicking displays an explanatory guide to WCAG 2.1 AA/AAA compliance thresholds.
  - Contrast matrix header visually aligns with the other studio step cards.
  - Unit tests updated to verify accessible header structure.

### TT-034: Preview Component Interactivity & Common App Chrome
- **Status**: `backlog`
- **Category**: Previews
- **Title**: Preview Component Interactivity & Common App Chrome
- **Description**: Bring dynamic interactivity and consistent mobile/web application chrome to all preview targets:
  1. **Material Design M3 Interactivity**:
     - Wire up the hamburger menu button to open an interactive navigation drawer with icons and text (drawer closes when clicking an item or the backdrop).
     - Wire up the search action to expand an active search bar that allows typing, clearing, and displaying sample filtered results.
     - Wire up the overflow menu (`MoreVertical`) to display a floating menu with clickable items that close on click.
  2. **Android Preview Interactivity**:
     - Implement the same interactive hamburger drawer, search box with type/clear and mock results, and overflow menu in the Android phone preview.
  3. **iOS Preview Search Results & Interactivity**:
     - Expand the iOS search view so that typing in the search bar dynamically filters and displays realistic mock app/theme search results.
  4. **Consistent App Chrome Across Platforms**:
     - Wire up the profile avatar button across platforms (iOS, Android, M3, Web) to trigger an interactive profile sheet or dropdown previewing user account and active theme settings.
     - Ensure consistent availability of core navigation patterns (hamburger menu, search, profile) across all preview viewports where appropriate.
- **Acceptance Criteria**:
  - Clicking hamburger menu on Material M3 and Android previews opens a functional drawer that dismisses on item click or outside tap.
  - Search input on M3, Android, and iOS previews accepts text, has a working clear button, and displays generated/filtered preview results.
  - Overflow menus (`MoreVertical`) display dropdown items that dismiss upon selection.
  - Profile avatar buttons across previews trigger an interactive profile sheet or popup.
  - Navigation interactions maintain full theme reactivity with active palette colors.
  - Unit and interaction tests added for preview drawers, search inputs, and menus.

### TT-035: Standardized Preview Viewport Sizing & Edge-to-Edge Diagnostics
- **Status**: `backlog`
- **Category**: Previews
- **Title**: Standardized Preview Viewport Sizing & Edge-to-Edge Diagnostics
- **Description**: Standardize preview frame dimensions across tabs and resolve rendering edge cases in mobile previews:
  1. **Standardized Representative Viewport Sizing**:
     - Align and lock preview container heights and aspect ratios across the platform tabs (Tailwind, Material M3, Android, iOS) to eliminate jarring layout jumps when toggling between platforms.
     - Provide consistent viewport framing in both multi-target grid view and focused single-platform mode.
  2. **Edge-to-Edge vs Solid System Bars Diagnostic**:
     - Investigate and resolve rendering ambiguity in the Android Preview "Solid Color Bars" vs "Edge-to-Edge" toggle.
     - Ensure "Solid Bars" applies an unmistakable, distinct background color (e.g. contrasting `surfaceContainer` or primary tint) to the status bar and navigation pill area, while "Edge-to-Edge" renders a true transparent scrim with content visibly flowing underneath across all palette themes (light, dark, neon, and high-contrast).
- **Acceptance Criteria**:
  - Preview card heights and frame boundaries are standardized and locked to consistent representative dimensions across all platforms.
  - Switching between preview tabs produces smooth, stable layout transitions without jumping.
  - Android Preview clearly displays visible, distinct differences between "Solid Color Bars" and "Edge-to-Edge" modes across diverse color palettes.
  - Unit tests verify toggle state rendering and frame container styling.
