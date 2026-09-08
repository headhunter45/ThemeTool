import {describe, expect, it} from 'vitest';

import {getContrastRatio, getRecommendedTextColor, getRelativeLuminance} from './contrast';
import {hexToOklch, hexToRgb, hslToRgb, oklabToOklch, oklchToHex, oklchToOklab, oklchToRgb, rgbToHex, rgbToHsl, rgbToOklab, rgbToOklch,} from './conversions';

describe('Color Conversions', () => {
  describe('HEX <-> RGB', () => {
    it('converts 6-digit hex to RGB correctly', () => {
      expect(hexToRgb('#3b82f6')).toEqual({r: 59, g: 130, b: 246, a: 1});
      expect(hexToRgb('10b981')).toEqual({r: 16, g: 185, b: 129, a: 1});
    });

    it('converts 3-digit shorthand hex to RGB', () => {
      expect(hexToRgb('#fff')).toEqual({r: 255, g: 255, b: 255, a: 1});
      expect(hexToRgb('#000')).toEqual({r: 0, g: 0, b: 0, a: 1});
    });

    it('converts RGB to 6-digit lowercase hex', () => {
      expect(rgbToHex({r: 59, g: 130, b: 246})).toBe('#3b82f6');
      expect(rgbToHex({r: 0, g: 0, b: 0})).toBe('#000000');
      expect(rgbToHex({r: 255, g: 255, b: 255})).toBe('#ffffff');
    });

    it('throws on invalid hex formats', () => {
      expect(() => hexToRgb('not-a-hex')).toThrowError(/Invalid hex color/);
      expect(() => hexToRgb('#12')).toThrowError(/Invalid hex color/);
    });
  });

  describe('RGB <-> HSL', () => {
    it('roundtrips RGB -> HSL -> RGB accurately', () => {
      const colors = [
        {r: 255, g: 0, b: 0},      // Red
        {r: 0, g: 255, b: 0},      // Green
        {r: 0, g: 0, b: 255},      // Blue
        {r: 245, g: 158, b: 11},   // Amber
        {r: 128, g: 128, b: 128},  // Gray
      ];

      for (const color of colors) {
        const hsl = rgbToHsl(color);
        const rgb = hslToRgb(hsl);
        expect(Math.abs(rgb.r - color.r)).toBeLessThanOrEqual(1);
        expect(Math.abs(rgb.g - color.g)).toBeLessThanOrEqual(1);
        expect(Math.abs(rgb.b - color.b)).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('RGB <-> OKLab <-> OKLCH', () => {
    it('accurately converts pure black', () => {
      const blackRgb = {r: 0, g: 0, b: 0};
      const oklab = rgbToOklab(blackRgb);
      expect(oklab.L).toBeCloseTo(0, 3);

      const oklch = rgbToOklch(blackRgb);
      expect(oklch.l).toBeCloseTo(0, 3);
      expect(oklch.c).toBeCloseTo(0, 3);

      const backToHex = oklchToHex(oklch);
      expect(backToHex).toBe('#000000');
    });

    it('accurately converts pure white', () => {
      const whiteRgb = {r: 255, g: 255, b: 255};
      const oklab = rgbToOklab(whiteRgb);
      expect(oklab.L).toBeCloseTo(1, 3);

      const oklch = rgbToOklch(whiteRgb);
      expect(oklch.l).toBeCloseTo(1, 3);
      expect(oklch.c).toBeCloseTo(0, 3);

      const backToHex = oklchToHex(oklch);
      expect(backToHex).toBe('#ffffff');
    });

    it('roundtrips OKLab <-> OKLCH', () => {
      const originalOklab = {L: 0.65, a: 0.12, b: -0.08};
      const oklch = oklabToOklch(originalOklab);
      const backToOklab = oklchToOklab(oklch);

      expect(backToOklab.L).toBeCloseTo(originalOklab.L, 5);
      expect(backToOklab.a).toBeCloseTo(originalOklab.a, 5);
      expect(backToOklab.b).toBeCloseTo(originalOklab.b, 5);
    });

    it('handles out-of-gamut high-chroma colors safely without clipping crashes',
       () => {
         // Very high chroma OKLCH that exceeds sRGB gamut
         const neonOklch = {l: 0.8, c: 0.4, h: 140};
         const rgb = oklchToRgb(neonOklch);

         expect(rgb.r).toBeGreaterThanOrEqual(0);
         expect(rgb.r).toBeLessThanOrEqual(255);
         expect(rgb.g).toBeGreaterThanOrEqual(0);
         expect(rgb.g).toBeLessThanOrEqual(255);
         expect(rgb.b).toBeGreaterThanOrEqual(0);
         expect(rgb.b).toBeLessThanOrEqual(255);
       });

    it('converts HEX to OKLCH and back with high fidelity', () => {
      const hexes = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];

      for (const hex of hexes) {
        const oklch = hexToOklch(hex);
        const backHex = oklchToHex(oklch);
        // Compare RGB values
        const originalRgb = hexToRgb(hex);
        const backRgb = hexToRgb(backHex);

        expect(Math.abs(originalRgb.r - backRgb.r)).toBeLessThanOrEqual(1);
        expect(Math.abs(originalRgb.g - backRgb.g)).toBeLessThanOrEqual(1);
        expect(Math.abs(originalRgb.b - backRgb.b)).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('WCAG 2.1 Luminance & Contrast', () => {
    it('computes expected relative luminance for white and black', () => {
      expect(getRelativeLuminance({r: 0, g: 0, b: 0})).toBe(0);
      expect(getRelativeLuminance({r: 255, g: 255, b: 255})).toBe(1);
    });

    it('computes correct contrast ratios', () => {
      // Black on White is 21:1
      expect(getContrastRatio('#000000', '#ffffff')).toBe(21);
      // Same color on same color is 1:1
      expect(getContrastRatio('#3b82f6', '#3b82f6')).toBe(1);
      // Standard Tailwind Blue 500 on white
      expect(getContrastRatio('#3b82f6', '#ffffff')).toBeGreaterThan(3);
    });

    it('correctly recommends white or black text based on background', () => {
      expect(getRecommendedTextColor('#000000')).toBe('#ffffff');
      expect(getRecommendedTextColor('#ffffff')).toBe('#000000');
      expect(getRecommendedTextColor('#1e293b')).toBe('#ffffff');  // Dark Slate
      expect(getRecommendedTextColor('#f8fafc'))
          .toBe('#000000');  // Light Slate
    });
  });
});
