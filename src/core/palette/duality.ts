import {hexToOklch, oklchToHex} from '../color/conversions';

import {CustomColorSlot, ModePalette, PaletteColors, PaletteMode, SemanticRole} from './types';

/**
 * Transforms a single hex color from Light mode to Dark mode in OKLCH color
 * space.
 */
export function transformColorLightToDark(
    hex: string, role: SemanticRole|'custom'): string {
  const oklch = hexToOklch(hex);

  if (role === 'background') {
    // Light canvas (L ~ 0.95-0.99) -> Elevated dark surface (L ~ 0.10-0.14)
    // Preserve subtle tint chroma (C ~ 0.01-0.018) and keep exact hue
    const l = Math.max(0.09, Math.min(0.14, 0.11 + (1 - oklch.l) * 0.05));
    const c = Math.min(oklch.c * 0.6, 0.018);
    return oklchToHex({l, c, h: oklch.h});
  }

  if (role === 'text') {
    // Light-mode dark text (L ~ 0.10-0.25) -> High-contrast light text (L ~
    // 0.93-0.96)
    const l = Math.max(0.92, Math.min(0.96, 0.95 - (oklch.l - 0.1) * 0.08));
    const c = Math.min(oklch.c * 0.5, 0.015);
    return oklchToHex({l, c, h: oklch.h});
  }

  if (role === 'custom') {
    // Classify custom slots by lightness
    if (oklch.l >= 0.82) {
      return transformColorLightToDark(hex, 'background');
    }
    if (oklch.l <= 0.32) {
      return transformColorLightToDark(hex, 'text');
    }
    // Fallthrough to brand role
  }

  // Brand roles: Primary, Secondary, Accent (and midtone custom)
  // Scale lightness up to 0.70-0.80 for high legibility against dark canvas
  // Soften chroma by ~18% to eliminate chromatic aberration/vibration
  const l = Math.max(0.68, Math.min(0.82, 0.35 + oklch.l * 0.62));
  const c = Math.max(0, oklch.c * 0.82);
  return oklchToHex({l, c, h: oklch.h});
}

/**
 * Transforms a single hex color from Dark mode to Light mode in OKLCH color
 * space.
 */
export function transformColorDarkToLight(
    hex: string, role: SemanticRole|'custom'): string {
  const oklch = hexToOklch(hex);

  if (role === 'background') {
    // Dark surface (L ~ 0.09-0.16) -> Crisp light canvas (L ~ 0.96-0.98)
    const l = Math.max(0.95, Math.min(0.98, 0.97 - (oklch.l - 0.1) * 0.15));
    const c = Math.min(oklch.c * 1.4, 0.016);
    return oklchToHex({l, c, h: oklch.h});
  }

  if (role === 'text') {
    // Dark-mode light text (L ~ 0.90-0.98) -> High-contrast dark text (L ~
    // 0.12-0.16)
    const l = Math.max(0.11, Math.min(0.16, 0.13 + (0.95 - oklch.l) * 0.1));
    const c = Math.min(oklch.c * 1.5, 0.02);
    return oklchToHex({l, c, h: oklch.h});
  }

  if (role === 'custom') {
    // Classify custom slots by lightness
    if (oklch.l <= 0.25) {
      return transformColorDarkToLight(hex, 'background');
    }
    if (oklch.l >= 0.88) {
      return transformColorDarkToLight(hex, 'text');
    }
    // Fallthrough to brand role
  }

  // Brand roles: Reciprocal transform back to light mode
  // Restore lower lightness (0.40-0.65) and unsupress chroma
  const l = Math.max(0.35, Math.min(0.65, (oklch.l - 0.35) / 0.62));
  const c = Math.min(0.35, oklch.c / 0.82);
  return oklchToHex({l, c, h: oklch.h});
}

/**
 * Generates a complete dark mode palette from a light mode palette.
 */
export function generateDarkPalette(
    lightColors: PaletteColors,
    lightCustom: CustomColorSlot[] = []): ModePalette {
  const darkColors: PaletteColors = {
    text: transformColorLightToDark(lightColors.text, 'text'),
    background: transformColorLightToDark(lightColors.background, 'background'),
    primary: transformColorLightToDark(lightColors.primary, 'primary'),
    secondary: transformColorLightToDark(lightColors.secondary, 'secondary'),
    accent: transformColorLightToDark(lightColors.accent, 'accent'),
  };

  const darkCustom: CustomColorSlot[] =
      lightCustom.map((slot) => ({
                        ...slot,
                        hex: transformColorLightToDark(slot.hex, 'custom'),
                      }));

  return {
    colors: darkColors,
    custom: darkCustom,
  };
}

/**
 * Generates a complete light mode palette from a dark mode palette.
 */
export function generateLightPalette(
    darkColors: PaletteColors,
    darkCustom: CustomColorSlot[] = []): ModePalette {
  const lightColors: PaletteColors = {
    text: transformColorDarkToLight(darkColors.text, 'text'),
    background: transformColorDarkToLight(darkColors.background, 'background'),
    primary: transformColorDarkToLight(darkColors.primary, 'primary'),
    secondary: transformColorDarkToLight(darkColors.secondary, 'secondary'),
    accent: transformColorDarkToLight(darkColors.accent, 'accent'),
  };

  const lightCustom: CustomColorSlot[] =
      darkCustom.map((slot) => ({
                       ...slot,
                       hex: transformColorDarkToLight(slot.hex, 'custom'),
                     }));

  return {
    colors: lightColors,
    custom: lightCustom,
  };
}

/**
 * Generates the counterpart palette based on current active mode.
 */
export function generateCounterpartPalette(
    colors: PaletteColors, custom: CustomColorSlot[] = [],
    fromMode: PaletteMode = 'light'): ModePalette {
  return fromMode === 'light' ? generateDarkPalette(colors, custom) :
                                generateLightPalette(colors, custom);
}

/**
 * Computes angular difference between two hue angles in degrees [0, 180].
 */
export function getHueDelta(hue1: number, hue2: number): number {
  const diff = Math.abs(hue1 - hue2) % 360;
  return diff > 180 ? 360 - diff : diff;
}
