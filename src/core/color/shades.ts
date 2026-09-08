import {getContrastRatio, getRecommendedTextColor, getRelativeLuminance} from './contrast';
import {hexToOklch, oklchToHex, oklchToRgb, rgbToHex, rgbToHsl} from './conversions';
import {OklchColor, SHADE_STEPS, ShadeScale, ShadeStep} from './types';

/**
 * Designer-calibrated target lightness values in OKLCH perceptual space (0 to
 * 1). Matches Tailwind CSS and modern design system tonal distributions.
 */
export const TARGET_LIGHTNESS: Record<ShadeStep, number> = {
  '50': 0.975,
  '100': 0.940,
  '200': 0.880,
  '300': 0.800,
  '400': 0.690,
  '500': 0.570,
  '600': 0.460,
  '700': 0.360,
  '800': 0.270,
  '900': 0.190,
  '950': 0.125,
};

/**
 * Chroma tapering factors to ensure light tints are clean (not radioactive)
 * and deep shadows are rich (not muddy or clipped).
 */
export const CHROMA_FACTORS: Record<ShadeStep, number> = {
  '50': 0.22,
  '100': 0.45,
  '200': 0.72,
  '300': 0.90,
  '400': 0.98,
  '500': 1.0,
  '600': 0.98,
  '700': 0.92,
  '800': 0.80,
  '900': 0.65,
  '950': 0.48,
};

export interface ShadeScaleOptions {
  /**
   * If true, forces the base color to sit strictly at step '500'.
   * If false (default), automatically detects the natural step based on base
   * color lightness.
   */
  force500Anchor?: boolean;
}

/**
 * Finds the natural step in the 50-950 scale closest to the given OKLCH
 * lightness.
 */
export function getClosestStep(lightness: number): ShadeStep {
  let closestStep: ShadeStep = '500';
  let minDiff = Infinity;

  for (const step of SHADE_STEPS) {
    const diff = Math.abs(TARGET_LIGHTNESS[step] - lightness);
    if (diff < minDiff) {
      minDiff = diff;
      closestStep = step;
    }
  }

  return closestStep;
}

/**
 * Generates an 11-step designer-friendly tonal shade scale (50–950) from any
 * input hex color.
 */
export function generateShadeScale(
    baseHex: string, options: ShadeScaleOptions = {}): ShadeScale {
  const baseOklch = hexToOklch(baseHex);
  const isAchromatic = baseOklch.c < 0.005;

  // Determine anchor step
  const anchorStep: ShadeStep =
      options.force500Anchor ? '500' : getClosestStep(baseOklch.l);

  const anchorIndex = SHADE_STEPS.indexOf(anchorStep);
  const baseLightness = Math.min(0.99, Math.max(0.01, baseOklch.l));

  const scale: Partial<ShadeScale> = {};

  for (let i = 0; i < SHADE_STEPS.length; i++) {
    const step = SHADE_STEPS[i];
    let stepLightness: number;
    let stepChroma: number;

    if (i === anchorIndex) {
      // Exactly preserve the base color at its anchor step
      stepLightness = baseLightness;
      stepChroma = baseOklch.c;
    } else if (i < anchorIndex) {
      // Steps lighter than the anchor (e.g. 50 to anchor - 1)
      const t = i / anchorIndex;  // 0 at step 50, approaching 1 at anchor
      const maxLightness = Math.max(0.978, baseLightness + 0.02);
      // Interpolate between maxLightness (at step 0) and baseLightness (at
      // anchor)
      stepLightness = maxLightness - t * (maxLightness - baseLightness);

      // Chroma tapering
      const factor = CHROMA_FACTORS[step];
      stepChroma = isAchromatic ? 0 : baseOklch.c * factor;
    } else {
      // Steps darker than the anchor (e.g. anchor + 1 to 950)
      const remainingSteps = SHADE_STEPS.length - 1 - anchorIndex;
      const t = (i - anchorIndex) /
          remainingSteps;  // approaching 0 at anchor, 1 at 950
      const minLightness = Math.min(0.12, baseLightness - 0.02);
      // Interpolate between baseLightness and minLightness
      stepLightness = baseLightness - t * (baseLightness - minLightness);

      // Chroma tapering
      const factor = CHROMA_FACTORS[step];
      stepChroma = isAchromatic ? 0 : baseOklch.c * factor;
    }

    // Ensure strictly clamped and monotonic lightness
    stepLightness = Math.min(0.99, Math.max(0.01, stepLightness));

    const stepOklch: OklchColor = {
      l: stepLightness,
      c: stepChroma,
      h: baseOklch.h,
    };

    const stepRgb = oklchToRgb(stepOklch);
    const stepHex =
        i === anchorIndex ? oklchToHex(baseOklch) : rgbToHex(stepRgb);
    const stepHsl = rgbToHsl(stepRgb);
    const relLuminance = getRelativeLuminance(stepRgb);
    const contrastAgainstWhite =
        getContrastRatio(stepRgb, {r: 255, g: 255, b: 255});
    const contrastAgainstBlack = getContrastRatio(stepRgb, {r: 0, g: 0, b: 0});
    const recommendedTextColor = getRecommendedTextColor(stepRgb);

    scale[step] = {
      step,
      hex: stepHex,
      rgb: stepRgb,
      hsl: stepHsl,
      oklch: stepOklch,
      relativeLuminance: Math.round(relLuminance * 1000) / 1000,
      contrastAgainstWhite,
      contrastAgainstBlack,
      recommendedTextColor,
      isBaseColor: i === anchorIndex,
    };
  }

  return scale as ShadeScale;
}
