import {describe, expect, it} from 'vitest';

import {getContrastRatio, getRecommendedTextColor, getRelativeLuminance, getWcagCompliance, suggestAaColor, WCAG_RATIOS,} from './contrast';
import {hexToOklch} from './conversions';

describe('contrast & WCAG utilities', () => {
  describe('getRelativeLuminance', () => {
    it('returns 0 for pure black and 1 for pure white', () => {
      expect(getRelativeLuminance('#000000')).toBeCloseTo(0, 4);
      expect(getRelativeLuminance('#ffffff')).toBeCloseTo(1, 4);
    });

    it('works with RgbColor object', () => {
      expect(getRelativeLuminance({r: 255, g: 255, b: 255})).toBeCloseTo(1, 4);
      expect(getRelativeLuminance({r: 0, g: 0, b: 0})).toBeCloseTo(0, 4);
    });
  });

  describe('getContrastRatio', () => {
    it('returns 21:1 for black on white', () => {
      expect(getContrastRatio('#000000', '#ffffff')).toBe(21);
      expect(getContrastRatio('#ffffff', '#000000')).toBe(21);
    });

    it('returns 1:1 for identical colors', () => {
      expect(getContrastRatio('#3b82f6', '#3b82f6')).toBe(1);
    });

    it('accurately calculates contrast for typical semantic pairings', () => {
      const ratio = getContrastRatio('#3b82f6', '#ffffff');
      expect(ratio).toBeGreaterThanOrEqual(3.5);
      expect(ratio).toBeLessThanOrEqual(4.0);
    });
  });

  describe('getRecommendedTextColor', () => {
    it('recommends white text for dark backgrounds and black text for light backgrounds',
       () => {
         expect(getRecommendedTextColor('#0f172a')).toBe('#ffffff');
         expect(getRecommendedTextColor('#000000')).toBe('#ffffff');
         expect(getRecommendedTextColor('#ffffff')).toBe('#000000');
         expect(getRecommendedTextColor('#f8fafc')).toBe('#000000');
       });
  });

  describe('getWcagCompliance', () => {
    it('reports correct compliance levels', () => {
      // Black on white (21:1) passes all levels
      const maxPass = getWcagCompliance('#000000', '#ffffff');
      expect(maxPass.ratio).toBe(21);
      expect(maxPass.aaNormal).toBe(true);
      expect(maxPass.aaLarge).toBe(true);
      expect(maxPass.aaaNormal).toBe(true);
      expect(maxPass.aaaLarge).toBe(true);

      // Light blue (#60a5fa) on white (~2.4:1) fails all levels
      const failAll = getWcagCompliance('#60a5fa', '#ffffff');
      expect(failAll.ratio).toBeLessThan(3.0);
      expect(failAll.aaNormal).toBe(false);
      expect(failAll.aaLarge).toBe(false);
      expect(failAll.aaaNormal).toBe(false);
      expect(failAll.aaaLarge).toBe(false);

      // Blue (#3b82f6) on white (~3.7:1) passes AA Large, fails AA Normal
      const midPass = getWcagCompliance('#3b82f6', '#ffffff');
      expect(midPass.ratio).toBeGreaterThanOrEqual(3.0);
      expect(midPass.ratio).toBeLessThan(4.5);
      expect(midPass.aaLarge).toBe(true);
      expect(midPass.aaNormal).toBe(false);
      expect(midPass.aaaNormal).toBe(false);
    });
  });

  describe('suggestAaColor', () => {
    it('returns the same color if already meeting target ratio', () => {
      const result = suggestAaColor('#000000', '#ffffff', 4.5);
      expect(result.toLowerCase()).toBe('#000000');
    });

    it('darkens a color on a white background to achieve >= 4.5:1 contrast',
       () => {
         const original = '#3b82f6';
         const bg = '#ffffff';
         expect(getContrastRatio(original, bg)).toBeLessThan(4.5);

         const fixed = suggestAaColor(original, bg, 4.5);
         const newRatio = getContrastRatio(fixed, bg);

         expect(newRatio).toBeGreaterThanOrEqual(4.5);

         // Check hue preservation in OKLCH
         const origOklch = hexToOklch(original);
         const fixedOklch = hexToOklch(fixed);
         const hueDiff = Math.abs(origOklch.h - fixedOklch.h);
         expect(hueDiff).toBeLessThan(5);  // Preserves blue hue family
       });

    it('lightens a dark color on a dark background to achieve >= 4.5:1 contrast',
       () => {
         const original = '#1e3a8a';  // Dark blue
         const bg = '#0f172a';        // Dark slate
         expect(getContrastRatio(original, bg)).toBeLessThan(4.5);

         const fixed = suggestAaColor(original, bg, 4.5);
         const newRatio = getContrastRatio(fixed, bg);

         expect(newRatio).toBeGreaterThanOrEqual(4.5);

         // Check that lightness increased
         const origOklch = hexToOklch(original);
         const fixedOklch = hexToOklch(fixed);
         expect(fixedOklch.l).toBeGreaterThan(origOklch.l);
       });

    it('supports custom targetRatio such as AAA (7.0)', () => {
      const original = '#3b82f6';
      const bg = '#ffffff';
      const fixed = suggestAaColor(original, bg, WCAG_RATIOS.AAA_NORMAL);
      expect(getContrastRatio(fixed, bg)).toBeGreaterThanOrEqual(7.0);
    });
  });
});
