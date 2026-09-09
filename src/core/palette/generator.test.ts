import {describe, expect, it} from 'vitest';

import {getContrastRatio} from '../color/contrast';

import {generatePaletteFromSeed} from './generator';
import {SEMANTIC_ROLES} from './types';

describe('generatePaletteFromSeed', () => {
  it('generates a full 5-role palette from a blue seed color', () => {
    const palette = generatePaletteFromSeed('#3b82f6');

    for (const role of SEMANTIC_ROLES) {
      expect(palette[role]).toBeDefined();
      expect(palette[role]).toMatch(/^#[0-9a-f]{6}$/);
    }

    expect(palette.primary).toBe('#3b82f6');
    expect(palette.secondary).toBeDefined();
    expect(palette.accent).toBeDefined();
    expect(palette.background).toBeDefined();
    expect(palette.text).toBeDefined();

    // High contrast check
    const contrast = getContrastRatio(palette.text, palette.background);
    expect(contrast).toBeGreaterThanOrEqual(7.0);  // WCAG AAA
  });

  it('supports 3-digit hex codes and normalizes', () => {
    const palette = generatePaletteFromSeed('#38f');
    expect(palette.primary).toBe('#3388ff');
  });

  it('handles achromatic / grayscale seed colors without crashing', () => {
    const paletteBlack = generatePaletteFromSeed('#000000');
    expect(paletteBlack.primary).toBe('#000000');
    expect(paletteBlack.secondary).toBe('#64748b');

    const paletteWhite = generatePaletteFromSeed('#ffffff');
    expect(paletteWhite.primary).toBe('#ffffff');
    expect(paletteWhite.accent).toBe('#0284c7');
  });

  it('throws an error for invalid hex color', () => {
    expect(() => generatePaletteFromSeed('invalid'))
        .toThrowError(/Invalid hex color/i);
  });
});
