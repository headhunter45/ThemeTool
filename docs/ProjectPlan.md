# ThemeTool Project Plan

## 1. Executive Summary

**ThemeTool** (formerly ColorTool) is a web-based color palette generator, format converter, component previewer, and multi-target theme exporter. It bridges the gap between web designers, frontend developers (Tailwind, React, Angular, Material), and mobile engineers (Android, iOS) by allowing users to import, generate, preview, and export cohesive color themes across diverse platform conventions.

The application is hosted as a client-side static web app on GitHub Pages for user `headhunter45` at `headhunter45.github.io/themetool` (with configurable base URL support).

---

## 2. Core Objectives & Feature Specifications

### 2.1 Palette Generation & Manipulation
- **Semantic Palette Roles**: Support semantic tokens inspired by Realtime Colors:
  - Background
  - Text (High-contrast content)
  - Primary (Brand / main CTA)
  - Secondary (Supporting elements)
  - Accent (Highlights / badges / focus)
- **Shade Scale Generation**: Generate 50–950 tonal steps (e.g., Tailwind CSS / Material tonal palettes) for each color token with perceptual lightness distribution (using OKLCH or CIELAB).
- **Interactive Color Adjustments**: Hex inputs, color pickers, HSL/OKLCH sliders, randomizer/generator, lockable colors, and WCAG contrast ratio indicators.

### 2.2 Palette Import Engine
Support importing palettes from popular color tools and raw formats:
- **Coolors URLs**: e.g., `https://coolors.co/palette/6f2dbd-a663cc-b298dc-b8d0eb-b9faf8` (5 hex values in path).
- **ColorKit URLs**: e.g., `https://colorkit.co/palette/eebea0-ff8d83-ffa89f-ffc2bc-aaae80/`.
- **UIColors Format**: Tailwind 3 JavaScript config object or Tailwind 4 CSS variable declarations (`--color-*-50` through `950`).
- **Realtime Colors Format**: 5-color semantic sets (Text, Background, Primary, Secondary, Accent).
- **Raw Hex / JSON / CSS Variables**: Copy-paste arbitrary hex lists, JSON color objects, or CSS custom properties.

### 2.3 Multi-Target Component Previews
Provide realistic mockups and UI component sandboxes themed with the active palette. Users can switch between preview targets or show/hide specific targets:
- **Tailwind / Standard Web**: Buttons, badges, cards, navigation bar, hero section, form controls styled with Tailwind classes.
- **React UI**: Reusable modern component library mockup (dialogs, cards, data display).
- **Angular UI**: Angular-flavored component structure preview.
- **Material Design (M3)**: Floating Action Buttons (FAB), top app bars, elevated/filled/outlined cards, chips, navigation rails.
- **Android Approximation**: Mobile viewport preview approximating Jetpack Compose / Material Android screens (status bar, app bar, navigation bar, cards, list items).
- **iOS Approximation**: Mobile viewport preview approximating Apple Human Interface Guidelines / SwiftUI aesthetics (translucent navigation bars, segmented controls, iOS list groups, rounded action buttons).
- **Preview Target Controls**: Toggle visibility per target or switch between individual target views and multi-column grid views.

### 2.4 Multi-Platform Theme Export Engine
Export production-ready theme code and assets tailored to each ecosystem:
- **Tailwind CSS Export**:
  - **Tailwind v4**: Single `.css` theme file with `@theme` block containing `--color-*` variables.
  - **Tailwind v3**: JavaScript/TypeScript `tailwind.config.js` theme extension snippet (`colors: { ... }`).
  - **Installation & Usage Snippet**: Copyable code snippet showing how to import the CSS file and set default classes.
  - **Single `.css` File Download**: One-click download of the theme CSS file.
- **Android Export**:
  - **Downloadable Resource Bundle (`.zip`)**: A ready-to-extract zip containing the proper Android resource tree:
    - `res/values/colors.xml` (Color definitions)
    - `res/values/themes.xml` (Theme tokens mapping to primary, secondary, surface, background, etc.)
    - `res/values-night/themes.xml` (Optional dark theme mapping)
  - **Copyable XML Snippets**: Instant copy of `colors.xml` contents.
- **iOS Export**:
  - **Swift / SwiftUI Snippet**: Copyable Swift file with `Color` extension / asset tokens.
  - **Xcode Asset Catalog (`.xcassets`)**: Downloadable JSON / folder structure for Xcode color sets.
- **Shareable App URL**:
  - Encodes the full active palette and settings in the URL hash or query parameters.
  - Configurable base URL (defaults to `https://headhunter45.github.io/themetool`).
  - Copyable share link for one-click collaboration.

### 2.5 Future Scope & Extensibility
- Additional themable properties: Gradients (linear/radial), border radiuses, typography pairings, shadow depths, and background patterns.
- Dark mode / light mode duality switching.
- Palette history and local storage presets.

---

## 3. Technology Stack & Architecture

### 3.1 Recommended Stack
- **Framework**: React 19 + TypeScript + Vite (fast build, small bundle, high ecosystem compatibility).
- **Styling**: Tailwind CSS v4 (native CSS variables, lightning-fast compiler).
- **Color Manipulation**: `colord` or `culori` (lightweight, supports OKLCH, CIELAB, contrast calculation, and interpolation).
- **Archive Generation**: `jszip` + `file-saver` for in-browser creation of Android resource zip files.
- **Icons**: `lucide-react` for clean, lightweight UI icons.
- **Testing**: Vitest for unit tests (color conversion, parser, export generator) + Playwright for end-to-end component verification.
- **Deployment**: GitHub Pages via GitHub Actions workflow (`gh-pages`).

### 3.2 State Management & Architecture
```
┌────────────────────────────────────────────────────────┐
│                   App State Store                      │
│ (Palette Tokens, Active Target, Visibility, Base URL)  │
└───────▲───────────────────────┬────────────────────────┘
        │                       │
        │ Sync (hash/query)     ▼
┌───────┴──────────────┐ ┌───────────────────────────────┐
│   URL State Engine   │ │     Color Engine (OKLCH)      │
│  - Parser (Coolors,  │ │  - Shade Scale Generator      │
│    ColorKit, etc.)   │ │  - Contrast / Accessibility   │
│  - Serializer        │ │  - Color Space Conversions    │
└──────────────────────┘ └──────────────┬────────────────┘
                                        │
             ┌──────────────────────────┴──────────────────────────┐
             ▼                                                     ▼
┌──────────────────────────────┐              ┌──────────────────────────────┐
│       Preview System         │              │        Export Engine         │
│ - Target Filter / Selector   │              │ - Tailwind v3/v4 Generator   │
│ - Web (Tailwind, React, M3)  │              │ - Android XML & Zip Packager │
│ - Mobile (Android, iOS Sims) │              │ - iOS Swift / Asset Packager │
└──────────────────────────────┘              │ - Configurable Shareable URL │
                                              └──────────────────────────────┘
```

---

## 4. Git Workflow & Release Strategy

- **`tasks/<task-id>-<description>`**: Branch created for each task moving to `in-progress` (with 1 to 5 words describing the task).
- **Branching Base**: Each task branch branches off a commit in `develop` or off another task branch to depend on that task.
- **Pull Request to `develop`**: When implementation is ready for review and testing, open a GitHub Pull Request targeting `develop`. This moves the task to `testing`.
- **Merge into `develop`**: Merging the PR moves the task to `done`.
- **Merge `develop` into `main`**: Merging `develop` into `main` moves the task to `released` and deploys live to GitHub Pages (`headhunter45.github.io/themetool`).
- **Destructive Git Commands**: Never executed automatically; the user will be prompted to run any destructive git operations manually.

---

## 5. Implementation Roadmap & Milestones

- **Milestone 1: Foundation & Project Scaffolding**
  - Project setup (Vite + React + TypeScript + Tailwind CSS).
  - CI/CD workflow for GitHub Pages deployment.
  - Core types, interfaces, and architecture definition.

- **Milestone 2: Color Engine & Import/Share Engine**
  - Color space conversion & shade scale algorithms (50–950).
  - URL parser for Coolors, ColorKit, and custom URL schema.
  - Importers for Tailwind 3/4 code blocks, JSON, and Realtime Colors.
  - Configurable base URL generator for shareable links.

- **Milestone 3: Palette Editor & UI Shell**
  - Interactive palette bar with color pickers, locks, and shade inspection.
  - Semantic token assignment (Background, Text, Primary, Secondary, Accent).
  - Randomizer & WCAG contrast audit display.

- **Milestone 4: Multi-Target Component Preview Sandbox**
  - Preview switcher and visibility manager (select/hide individual targets).
  - Component mockups: Tailwind Web, React UI, Material Design (M3).
  - Mobile mockups: Android (Jetpack Compose simulation) & iOS (SwiftUI simulation).

- **Milestone 5: Production Exporters**
  - Tailwind v4 single `.css` theme generator and setup code snippet.
  - Tailwind v3 configuration snippet generator.
  - Android XML exporter and in-memory `.zip` packager (`res/values/colors.xml`, etc.).
  - iOS Swift color extensions and Xcode asset format exporter.
  - Single-click copy / download interactions.

- **Milestone 6: Polish, Testing & Release**
  - Responsive design optimization.
  - Accessibility and end-to-end verification.
  - Documentation and release to `main` (`headhunter45.github.io/themetool`).
