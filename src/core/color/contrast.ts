import {hexToOklch, hexToRgb, oklchToHex} from './conversions';
import {RgbColor} from './types';

/**
 * Calculates WCAG 2.1 relative luminance for an sRGB color.
 * Result ranges from 0 (deepest black) to 1 (purest white).
 */
export function getRelativeLuminance(color: string|RgbColor): number {
  const rgb = typeof color === 'string' ? hexToRgb(color) : color;

  const linearize = (val: number) => {
    const v = val / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };

  const r = linearize(rgb.r);
  const g = linearize(rgb.g);
  const b = linearize(rgb.b);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculates the WCAG 2.1 contrast ratio between two colors.
 * Returns a number between 1.0 (no contrast) and 21.0 (maximum contrast, black
 * on white).
 */
export function getContrastRatio(
    color1: string|RgbColor, color2: string|RgbColor): number {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}

/**
 * Recommends '#ffffff' or '#000000' text for maximum contrast on a given
 * background.
 */
export function getRecommendedTextColor(bg: string|RgbColor): '#ffffff'|
    '#000000' {
  const whiteContrast = getContrastRatio(bg, {r: 255, g: 255, b: 255});
  const blackContrast = getContrastRatio(bg, {r: 0, g: 0, b: 0});

  return whiteContrast >= blackContrast ? '#ffffff' : '#000000';
}

export const WCAG_RATIOS = {
  AA_NORMAL: 4.5,
  AA_LARGE: 3.0,
  AAA_NORMAL: 7.0,
  AAA_LARGE: 4.5,
} as const;

export interface WcagCompliance {
  ratio: number;
  aaNormal: boolean;   // >= 4.5
  aaLarge: boolean;    // >= 3.0
  aaaNormal: boolean;  // >= 7.0
  aaaLarge: boolean;   // >= 4.5
}

/**
 * Returns full WCAG 2.1 compliance details for foreground on background.
 */
export function getWcagCompliance(
    foreground: string|RgbColor, background: string|RgbColor): WcagCompliance {
  const ratio = getContrastRatio(foreground, background);
  return {
    ratio,
    aaNormal: ratio >= WCAG_RATIOS.AA_NORMAL,
    aaLarge: ratio >= WCAG_RATIOS.AA_LARGE,
    aaaNormal: ratio >= WCAG_RATIOS.AAA_NORMAL,
    aaaLarge: ratio >= WCAG_RATIOS.AAA_LARGE,
  };
}

/**
 * Minimally adjusts the lightness of colorToAdjust in OKLCH color space to
 * achieve at least targetRatio contrast (defaults to 4.5 for WCAG AA normal
 * text) against fixedColor, preserving hue and maintaining maximum possible
 * chroma.
 */
export function suggestAaColor(
    colorToAdjust: string, fixedColor: string, targetRatio = 4.5): string {
  // If already compliant, no adjustment needed
  if (getContrastRatio(colorToAdjust, fixedColor) >= targetRatio) {
    const clean = colorToAdjust.trim();
    return clean.startsWith('#') ? clean.toLowerCase() :
                                   `#${clean.toLowerCase()}`;
  }

  const oklch = hexToOklch(colorToAdjust);
  const originalL = oklch.l;

  const testL = (targetL: number): {hex: string; ratio: number} => {
    const candidateHex = oklchToHex({l: targetL, c: oklch.c, h: oklch.h});
    const ratio = getContrastRatio(candidateHex, fixedColor);
    return {hex: candidateHex, ratio};
  };

  // 1. Search darker: L in [0, originalL]
  let bestDarker: {l: number; hex: string; ratio: number}|null = null;
  if (testL(0).ratio >= targetRatio) {
    let low = 0;
    let high = originalL;
    // Find the highest L in [0, originalL] that satisfies the ratio (minimal
    // change from originalL)
    for (let i = 0; i < 24; i++) {
      const mid = (low + high) / 2;
      const res = testL(mid);
      if (res.ratio >= targetRatio) {
        bestDarker = {l: mid, hex: res.hex, ratio: res.ratio};
        low = mid;
      } else {
        high = mid;
      }
    }
  }

  // 2. Search lighter: L in [originalL, 1]
  let bestLighter: {l: number; hex: string; ratio: number}|null = null;
  if (testL(1).ratio >= targetRatio) {
    let low = originalL;
    let high = 1;
    // Find the lowest L in [originalL, 1] that satisfies the ratio (minimal
    // change from originalL)
    for (let i = 0; i < 24; i++) {
      const mid = (low + high) / 2;
      const res = testL(mid);
      if (res.ratio >= targetRatio) {
        bestLighter = {l: mid, hex: res.hex, ratio: res.ratio};
        high = mid;
      } else {
        low = mid;
      }
    }
  }

  // Pick direction with minimal lightness distance
  if (bestDarker && bestLighter) {
    const distDarker = Math.abs(bestDarker.l - originalL);
    const distLighter = Math.abs(bestLighter.l - originalL);
    return distDarker <= distLighter ? bestDarker.hex : bestLighter.hex;
  }

  if (bestDarker) return bestDarker.hex;
  if (bestLighter) return bestLighter.hex;

  // Fallback if neither reached target (e.g. high-chroma gamut compression):
  // pure black or white
  const whiteRatio = getContrastRatio('#ffffff', fixedColor);
  const blackRatio = getContrastRatio('#000000', fixedColor);
  return whiteRatio >= blackRatio ? '#ffffff' : '#000000';
}
