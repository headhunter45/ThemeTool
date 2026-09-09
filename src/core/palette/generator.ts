import {hexToOklch, oklchToHex} from '../color/conversions';

import {PaletteColors} from './types';

/**
 * Normalizes any 3- or 6-digit hex string into lowercase #rrggbb.
 */
function normalizeHex(hex: string): string {
  const trimmed = hex.trim().replace(/^#/, '');
  if (trimmed.length === 3) {
    return `#${trimmed[0]}${trimmed[0]}${trimmed[1]}${trimmed[1]}${trimmed[2]}${
               trimmed[2]}`
        .toLowerCase();
  }
  if (trimmed.length === 6) {
    return `#${trimmed}`.toLowerCase();
  }
  throw new Error(`Invalid hex color: "${hex}"`);
}

/**
 * Generates a perceptually balanced 5-role semantic palette from a single seed
 * color.
 *
 * Uses the OKLCH color space to ensure:
 * - Primary: Exact seed color.
 * - Secondary: Harmonious analogous hue shift (+35°) with balanced chroma.
 * - Accent: Vibrant complementary/triadic hue shift (+140°) for high-impact
 * callouts.
 * - Background: Ultra-high lightness (L ~ 0.985) subtly tinted with the seed
 * hue.
 * - Text: Ultra-low lightness (L ~ 0.18) with matching seed undertone,
 * guaranteeing WCAG AAA contrast.
 */
export function generatePaletteFromSeed(seedHex: string): PaletteColors {
  const primary = normalizeHex(seedHex);
  const oklch = hexToOklch(primary);

  // If grayscale / achromatic (chroma near zero or undefined hue)
  const isAchromatic = isNaN(oklch.h) || oklch.c < 0.008;

  if (isAchromatic) {
    return {
      primary,
      secondary: '#64748b',  // Slate 500
      accent: '#0284c7',     // Sky 600
      background: '#f8fafc',
      text: '#0f172a',
    };
  }

  const h = oklch.h;
  const c = oklch.c;
  const l = oklch.l;

  // Secondary: Analogous hue (+35°) with softened chroma
  const secH = (h + 35) % 360;
  const secC = Math.max(0.04, Math.min(0.18, c * 0.75));
  const secL = Math.min(0.72, Math.max(0.42, l * 0.95));
  const secondary = oklchToHex({l: secL, c: secC, h: secH});

  // Accent: Vibrant offset (+140°) for high-contrast CTA / badges
  const accH = (h + 140) % 360;
  const accC = Math.max(0.12, Math.min(0.24, c * 1.15));
  const accL = Math.min(0.74, Math.max(0.52, l));
  const accent = oklchToHex({l: accL, c: accC, h: accH});

  // Background: Light surface subtly carrying the seed hue undertone
  const bgC = Math.min(0.012, c * 0.08);
  const background = oklchToHex({l: 0.985, c: bgC, h});

  // Text: Deep dark slate with matching undertone, ensuring >= 10:1 WCAG
  // contrast against background
  const textC = Math.min(0.03, c * 0.15);
  const text = oklchToHex({l: 0.18, c: textC, h});

  return {
    primary,
    secondary,
    accent,
    background,
    text,
  };
}
