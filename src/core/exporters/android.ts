import JSZip from 'jszip';

import {generateShadeScale, getRecommendedTextColor, getRelativeLuminance, SHADE_STEPS} from '../color';
import {CustomColorSlot, PaletteColors} from '../palette/types';

export interface AndroidExportOptions {
  themeName?: string;
  includeShades?: boolean;
}

export interface AndroidTokens {
  light: Record<string, string>;
  dark: Record<string, string>;
}

/**
 * Normalizes a string to a valid Android resource name (lowercase alphanumeric
 * with underscores).
 */
export function normalizeAndroidColorName(name: string): string {
  const normalized = name.toLowerCase()
                         .trim()
                         .replace(/[^a-z0-9]+/g, '_')
                         .replace(/^_+|_+$/g, '');

  return normalized || 'custom_color';
}

/**
 * Computes Material 3 Light and Dark color token mappings from a semantic
 * palette.
 */
export function computeAndroidTokens(colors: PaletteColors): AndroidTokens {
  const bgLuminance = getRelativeLuminance(colors.background);
  const isDark = bgLuminance < 0.5;

  const primaryScale = generateShadeScale(colors.primary);
  const secondaryScale = generateShadeScale(colors.secondary);
  const accentScale = generateShadeScale(colors.accent);
  const bgScale = generateShadeScale(colors.background);
  const textScale = generateShadeScale(colors.text);

  if (!isDark) {
    // Current palette is Light
    return {
      light: {
        primary: colors.primary,
        onPrimary: getRecommendedTextColor(colors.primary),
        primaryContainer: primaryScale['100'].hex,
        onPrimaryContainer: primaryScale['900'].hex,
        secondary: colors.secondary,
        onSecondary: getRecommendedTextColor(colors.secondary),
        secondaryContainer: secondaryScale['100'].hex,
        onSecondaryContainer: secondaryScale['900'].hex,
        tertiary: colors.accent,
        onTertiary: getRecommendedTextColor(colors.accent),
        tertiaryContainer: accentScale['100'].hex,
        onTertiaryContainer: accentScale['900'].hex,
        background: colors.background,
        onBackground: colors.text,
        surface: colors.background,
        onSurface: colors.text,
        surfaceVariant: bgScale['100'].hex,
        onSurfaceVariant: textScale['600'].hex,
        outline: textScale['300'].hex,
        outlineVariant: textScale['200'].hex,
      },
      dark: {
        primary: primaryScale['200'].hex,
        onPrimary: primaryScale['900'].hex,
        primaryContainer: primaryScale['900'].hex,
        onPrimaryContainer: primaryScale['100'].hex,
        secondary: secondaryScale['200'].hex,
        onSecondary: secondaryScale['900'].hex,
        secondaryContainer: secondaryScale['900'].hex,
        onSecondaryContainer: secondaryScale['100'].hex,
        tertiary: accentScale['200'].hex,
        onTertiary: accentScale['900'].hex,
        tertiaryContainer: accentScale['900'].hex,
        onTertiaryContainer: accentScale['100'].hex,
        background: bgScale['950'].hex,
        onBackground: textScale['100'].hex,
        surface: bgScale['900'].hex,
        onSurface: textScale['100'].hex,
        surfaceVariant: bgScale['800'].hex,
        onSurfaceVariant: textScale['400'].hex,
        outline: textScale['700'].hex,
        outlineVariant: textScale['800'].hex,
      },
    };
  } else {
    // Current palette is Dark
    return {
      light: {
        primary: primaryScale['600'].hex,
        onPrimary: primaryScale['50'].hex,
        primaryContainer: primaryScale['100'].hex,
        onPrimaryContainer: primaryScale['900'].hex,
        secondary: secondaryScale['600'].hex,
        onSecondary: secondaryScale['50'].hex,
        secondaryContainer: secondaryScale['100'].hex,
        onSecondaryContainer: secondaryScale['900'].hex,
        tertiary: accentScale['600'].hex,
        onTertiary: accentScale['50'].hex,
        tertiaryContainer: accentScale['100'].hex,
        onTertiaryContainer: accentScale['900'].hex,
        background: bgScale['50'].hex,
        onBackground: textScale['900'].hex,
        surface: bgScale['50'].hex,
        onSurface: textScale['900'].hex,
        surfaceVariant: bgScale['100'].hex,
        onSurfaceVariant: textScale['600'].hex,
        outline: textScale['300'].hex,
        outlineVariant: textScale['200'].hex,
      },
      dark: {
        primary: colors.primary,
        onPrimary: getRecommendedTextColor(colors.primary),
        primaryContainer: primaryScale['900'].hex,
        onPrimaryContainer: primaryScale['100'].hex,
        secondary: colors.secondary,
        onSecondary: getRecommendedTextColor(colors.secondary),
        secondaryContainer: secondaryScale['900'].hex,
        onSecondaryContainer: secondaryScale['100'].hex,
        tertiary: colors.accent,
        onTertiary: getRecommendedTextColor(colors.accent),
        tertiaryContainer: accentScale['900'].hex,
        onTertiaryContainer: accentScale['100'].hex,
        background: colors.background,
        onBackground: colors.text,
        surface: colors.background,
        onSurface: colors.text,
        surfaceVariant: bgScale['800'].hex,
        onSurfaceVariant: textScale['400'].hex,
        outline: textScale['700'].hex,
        outlineVariant: textScale['800'].hex,
      },
    };
  }
}

/**
 * Generates res/values/colors.xml content with core colors, Material 3 tokens,
 * and optional shade scales.
 */
export function generateAndroidColorsXml(
    colors: PaletteColors, custom: CustomColorSlot[] = [],
    options: AndroidExportOptions = {}): string {
  const {includeShades = true} = options;
  const tokens = computeAndroidTokens(colors);
  const lines: string[] = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<!-- Generated by ThemeTool (https://headhunter45.github.io/ThemeTool/) -->',
    '<resources>',
    '    <!-- Base Semantic Colors -->',
    `    <color name="primary">${colors.primary.toLowerCase()}</color>`,
    `    <color name="secondary">${colors.secondary.toLowerCase()}</color>`,
    `    <color name="accent">${colors.accent.toLowerCase()}</color>`,
    `    <color name="background">${colors.background.toLowerCase()}</color>`,
    `    <color name="text">${colors.text.toLowerCase()}</color>`,
    '',
    '    <!-- Material 3 Light Theme Tokens -->',
  ];

  // Light Tokens
  Object.entries(tokens.light).forEach(([key, hex]) => {
    lines.push(
        `    <color name="md_theme_light_${key}">${hex.toLowerCase()}</color>`);
  });

  lines.push('');
  lines.push('    <!-- Material 3 Dark Theme Tokens -->');

  // Dark Tokens
  Object.entries(tokens.dark).forEach(([key, hex]) => {
    lines.push(
        `    <color name="md_theme_dark_${key}">${hex.toLowerCase()}</color>`);
  });

  // Custom Extra Color Slots
  if (custom.length > 0) {
    lines.push('');
    lines.push('    <!-- Custom Brand Color Slots -->');
    custom.forEach((slot) => {
      const slotName = normalizeAndroidColorName(slot.name);
      lines.push(
          `    <color name="${slotName}">${slot.hex.toLowerCase()}</color>`);
      if (includeShades) {
        try {
          const scale = generateShadeScale(slot.hex);
          SHADE_STEPS.forEach((step) => {
            lines.push(`    <color name="${slotName}_${step}">${
                scale[step].hex.toLowerCase()}</color>`);
          });
        } catch {
          // Fallback
        }
      }
    });
  }

  // 50-950 Shade Scales for core roles
  if (includeShades) {
    lines.push('');
    lines.push('    <!-- Semantic Role 50–950 Shade Scales -->');
    const roles: Array<{key: keyof PaletteColors; label: string}> = [
      {key: 'primary', label: 'Primary'},
      {key: 'secondary', label: 'Secondary'},
      {key: 'accent', label: 'Accent'},
      {key: 'background', label: 'Background'},
      {key: 'text', label: 'Text'},
    ];

    roles.forEach(({key, label}) => {
      lines.push(`    <!-- ${label} Shades -->`);
      try {
        const scale = generateShadeScale(colors[key]);
        SHADE_STEPS.forEach((step) => {
          lines.push(`    <color name="${key}_${step}">${
              scale[step].hex.toLowerCase()}</color>`);
        });
      } catch {
        // Fallback
      }
    });
  }

  lines.push('</resources>');
  return lines.join('\n');
}

/**
 * Generates res/values/themes.xml targeting Material 3 DayNight light theme.
 */
export function generateAndroidThemesXml(themeName = 'Theme.ThemeTool'):
    string {
  const validThemeName = themeName.trim() || 'Theme.ThemeTool';

  return `<?xml version="1.0" encoding="utf-8"?>
<!-- Generated by ThemeTool (https://headhunter45.github.io/ThemeTool/) -->
<resources xmlns:tools="http://schemas.android.com/tools">
    <!-- Base Application Theme targeting Material 3 DayNight -->
    <style name="${
      validThemeName}" parent="Theme.Material3.DayNight.NoActionBar">
        <!-- Primary Brand Colors -->
        <item name="colorPrimary">@color/md_theme_light_primary</item>
        <item name="colorOnPrimary">@color/md_theme_light_onPrimary</item>
        <item name="colorPrimaryContainer">@color/md_theme_light_primaryContainer</item>
        <item name="colorOnPrimaryContainer">@color/md_theme_light_onPrimaryContainer</item>

        <!-- Secondary Brand Colors -->
        <item name="colorSecondary">@color/md_theme_light_secondary</item>
        <item name="colorOnSecondary">@color/md_theme_light_onSecondary</item>
        <item name="colorSecondaryContainer">@color/md_theme_light_secondaryContainer</item>
        <item name="colorOnSecondaryContainer">@color/md_theme_light_onSecondaryContainer</item>

        <!-- Tertiary (Accent) Colors -->
        <item name="colorTertiary">@color/md_theme_light_tertiary</item>
        <item name="colorOnTertiary">@color/md_theme_light_onTertiary</item>
        <item name="colorTertiaryContainer">@color/md_theme_light_tertiaryContainer</item>
        <item name="colorOnTertiaryContainer">@color/md_theme_light_onTertiaryContainer</item>

        <!-- Canvas and Surface -->
        <item name="android:colorBackground">@color/md_theme_light_background</item>
        <item name="colorOnBackground">@color/md_theme_light_onBackground</item>
        <item name="colorSurface">@color/md_theme_light_surface</item>
        <item name="colorOnSurface">@color/md_theme_light_onSurface</item>
        <item name="colorSurfaceVariant">@color/md_theme_light_surfaceVariant</item>
        <item name="colorOnSurfaceVariant">@color/md_theme_light_onSurfaceVariant</item>

        <!-- Outlines and Dividers -->
        <item name="colorOutline">@color/md_theme_light_outline</item>
        <item name="colorOutlineVariant">@color/md_theme_light_outlineVariant</item>
    </style>
</resources>`;
}

/**
 * Generates res/values-night/themes.xml targeting Material 3 DayNight dark
 * theme.
 */
export function generateAndroidNightThemesXml(themeName = 'Theme.ThemeTool'):
    string {
  const validThemeName = themeName.trim() || 'Theme.ThemeTool';

  return `<?xml version="1.0" encoding="utf-8"?>
<!-- Generated by ThemeTool (https://headhunter45.github.io/ThemeTool/) -->
<resources xmlns:tools="http://schemas.android.com/tools">
    <!-- Base Application Theme targeting Material 3 DayNight (Night Configuration) -->
    <style name="${
      validThemeName}" parent="Theme.Material3.DayNight.NoActionBar">
        <!-- Primary Brand Colors -->
        <item name="colorPrimary">@color/md_theme_dark_primary</item>
        <item name="colorOnPrimary">@color/md_theme_dark_onPrimary</item>
        <item name="colorPrimaryContainer">@color/md_theme_dark_primaryContainer</item>
        <item name="colorOnPrimaryContainer">@color/md_theme_dark_onPrimaryContainer</item>

        <!-- Secondary Brand Colors -->
        <item name="colorSecondary">@color/md_theme_dark_secondary</item>
        <item name="colorOnSecondary">@color/md_theme_dark_onSecondary</item>
        <item name="colorSecondaryContainer">@color/md_theme_dark_secondaryContainer</item>
        <item name="colorOnSecondaryContainer">@color/md_theme_dark_onSecondaryContainer</item>

        <!-- Tertiary (Accent) Colors -->
        <item name="colorTertiary">@color/md_theme_dark_tertiary</item>
        <item name="colorOnTertiary">@color/md_theme_dark_onTertiary</item>
        <item name="colorTertiaryContainer">@color/md_theme_dark_tertiaryContainer</item>
        <item name="colorOnTertiaryContainer">@color/md_theme_dark_onTertiaryContainer</item>

        <!-- Canvas and Surface -->
        <item name="android:colorBackground">@color/md_theme_dark_background</item>
        <item name="colorOnBackground">@color/md_theme_dark_onBackground</item>
        <item name="colorSurface">@color/md_theme_dark_surface</item>
        <item name="colorOnSurface">@color/md_theme_dark_onSurface</item>
        <item name="colorSurfaceVariant">@color/md_theme_dark_surfaceVariant</item>
        <item name="colorOnSurfaceVariant">@color/md_theme_dark_onSurfaceVariant</item>

        <!-- Outlines and Dividers -->
        <item name="colorOutline">@color/md_theme_dark_outline</item>
        <item name="colorOutlineVariant">@color/md_theme_dark_outlineVariant</item>
    </style>
</resources>`;
}

/**
 * Bundles res/values/colors.xml, res/values/themes.xml, and
 * res/values-night/themes.xml into a downloadable ZIP archive preserving
 * standard Android Studio project hierarchy.
 */
export async function generateAndroidZip(
    colors: PaletteColors, custom: CustomColorSlot[] = [],
    options: AndroidExportOptions = {}): Promise<Blob> {
  const zip = new JSZip();

  const colorsXml = generateAndroidColorsXml(colors, custom, options);
  const themesXml = generateAndroidThemesXml(options.themeName);
  const nightThemesXml = generateAndroidNightThemesXml(options.themeName);

  zip.file('res/values/colors.xml', colorsXml);
  zip.file('res/values/themes.xml', themesXml);
  zip.file('res/values-night/themes.xml', nightThemesXml);

  return await zip.generateAsync({type: 'blob'});
}

/**
 * Triggers a browser download of the generated Android resources ZIP archive.
 */
export function downloadAndroidZip(
    blob: Blob, filename = 'android-theme-resources.zip'): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
