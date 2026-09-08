import {hexToRgb} from './conversions';
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
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3.0,
    aaaNormal: ratio >= 7.0,
    aaaLarge: ratio >= 4.5,
  };
}
