import {describe, expect, it} from 'vitest';

import {getContrastRatio, hexToOklch} from '../color';

import {generateCounterpartPalette, generateDarkPalette, generateLightPalette, getHueDelta,} from './duality';
import {CustomColorSlot, PaletteColors} from './types';

describe('duality.ts - OKLCH Dark Mode Duality Generator', () => {
  const sampleLightPalette: PaletteColors = {
    background: '#f8fafc',  // Very light slate
    text: '#0f172a',        // Deep slate dark text
    primary: '#3b82f6',     // Blue 500
    secondary: '#64748b',   // Slate 500
    accent: '#f59e0b',      // Amber 500
  };

  const sampleCustomSlots: CustomColorSlot[] = [
    {id: 'custom-1', name: 'Brand Violet', hex: '#8b5cf6'},
    {id: 'custom-2', name: 'Muted Card', hex: '#f1f5f9'},
    {id: 'custom-3', name: 'Deep Label', hex: '#1e293b'},
  ];

  describe('generateDarkPalette', () => {
    it('transforms light canvas to an elevated dark surface while preserving subtle tint and hue',
       () => {
         const dark = generateDarkPalette(sampleLightPalette);
         const bgOklch = hexToOklch(dark.colors.background);

         // Elevated dark surface: L between 0.08 and 0.16
         expect(bgOklch.l).toBeGreaterThanOrEqual(0.08);
         expect(bgOklch.l).toBeLessThanOrEqual(0.16);

         // Chroma is subtle
         expect(bgOklch.c).toBeLessThanOrEqual(0.025);
       });

    it('transforms dark text to high-contrast light text', () => {
      const dark = generateDarkPalette(sampleLightPalette);
      const textOklch = hexToOklch(dark.colors.text);

      // Light text: L >= 0.90
      expect(textOklch.l).toBeGreaterThanOrEqual(0.90);
    });

    it('ensures dark palette text on background satisfies WCAG AA contrast (>= 4.5:1)',
       () => {
         const dark = generateDarkPalette(sampleLightPalette);
         const contrast =
             getContrastRatio(dark.colors.text, dark.colors.background);
         expect(contrast).toBeGreaterThanOrEqual(4.5);
       });

    it('elevates lightness and softens chroma for brand roles', () => {
      const dark = generateDarkPalette(sampleLightPalette);

      const lightPrimaryOklch = hexToOklch(sampleLightPalette.primary);
      const darkPrimaryOklch = hexToOklch(dark.colors.primary);

      // Lightness elevated into comfortable 0.65 - 0.85 range for dark mode
      expect(darkPrimaryOklch.l).toBeGreaterThan(lightPrimaryOklch.l);
      expect(darkPrimaryOklch.l).toBeGreaterThanOrEqual(0.68);
      expect(darkPrimaryOklch.l).toBeLessThanOrEqual(0.85);

      // Chroma softened compared to light mode to prevent chromatic aberration
      expect(darkPrimaryOklch.c).toBeLessThan(lightPrimaryOklch.c);

      // Hue strictly preserved within 2 degrees
      const hueDelta = getHueDelta(darkPrimaryOklch.h, lightPrimaryOklch.h);
      expect(hueDelta).toBeLessThanOrEqual(2);
    });

    it('transforms custom slots according to their lightness category', () => {
      const dark = generateDarkPalette(sampleLightPalette, sampleCustomSlots);

      expect(dark.custom).toHaveLength(3);

      // Brand Violet (chromatic midtone)
      const violetOklch = hexToOklch(dark.custom[0].hex);
      expect(violetOklch.l).toBeGreaterThanOrEqual(0.68);

      // Muted Card (light surface) -> dark surface
      const cardOklch = hexToOklch(dark.custom[1].hex);
      expect(cardOklch.l).toBeLessThanOrEqual(0.20);

      // Deep Label (dark text-like) -> light text
      const labelOklch = hexToOklch(dark.custom[2].hex);
      expect(labelOklch.l).toBeGreaterThanOrEqual(0.90);
    });
  });

  describe('generateLightPalette', () => {
    it('transforms dark surface to light canvas and light text to dark text',
       () => {
         const darkPalette = generateDarkPalette(sampleLightPalette);
         const restoredLight = generateLightPalette(darkPalette.colors);

         const bgOklch = hexToOklch(restoredLight.colors.background);
         const textOklch = hexToOklch(restoredLight.colors.text);

         expect(bgOklch.l).toBeGreaterThanOrEqual(0.94);
         expect(textOklch.l).toBeLessThanOrEqual(0.20);
         expect(getContrastRatio(
                    restoredLight.colors.text, restoredLight.colors.background))
             .toBeGreaterThanOrEqual(4.5);
       });
  });

  describe('Round-Trip Fidelity', () => {
    it('preserves hue angles within 2 degrees across Light -> Dark -> Light conversion',
       () => {
         const dark =
             generateDarkPalette(sampleLightPalette, sampleCustomSlots);
         const roundTripLight = generateLightPalette(dark.colors, dark.custom);

         // Check primary (blue)
         const initialPrimary = hexToOklch(sampleLightPalette.primary);
         const roundTripPrimary = hexToOklch(roundTripLight.colors.primary);
         expect(getHueDelta(roundTripPrimary.h, initialPrimary.h))
             .toBeLessThanOrEqual(2);

         // Check accent (amber)
         const initialAccent = hexToOklch(sampleLightPalette.accent);
         const roundTripAccent = hexToOklch(roundTripLight.colors.accent);
         expect(getHueDelta(roundTripAccent.h, initialAccent.h))
             .toBeLessThanOrEqual(2);

         // Check custom slot (violet)
         const initialViolet = hexToOklch(sampleCustomSlots[0].hex);
         const roundTripViolet = hexToOklch(roundTripLight.custom[0].hex);
         expect(getHueDelta(roundTripViolet.h, initialViolet.h))
             .toBeLessThanOrEqual(2);
       });
  });

  describe('generateCounterpartPalette & getHueDelta', () => {
    it('delegates correctly based on fromMode parameter', () => {
      const darkCounterpart =
          generateCounterpartPalette(sampleLightPalette, [], 'light');
      expect(hexToOklch(darkCounterpart.colors.background).l)
          .toBeLessThan(0.25);

      const lightCounterpart =
          generateCounterpartPalette(darkCounterpart.colors, [], 'dark');
      expect(hexToOklch(lightCounterpart.colors.background).l)
          .toBeGreaterThan(0.90);
    });

    it('calculates hue delta correctly wrapping around 360 degrees', () => {
      expect(getHueDelta(10, 350)).toBe(20);
      expect(getHueDelta(355, 5)).toBe(10);
      expect(getHueDelta(100, 100)).toBe(0);
      expect(getHueDelta(90, 270)).toBe(180);
    });
  });
});
