import {describe, expect, it} from 'vitest';

import {PaletteColors} from '../palette/types';

import {generateThemeJson} from './themeJson';
import {validateThemeJson} from './themeJsonValidator';

describe('validateThemeJson (TT-025)', () => {
  const sampleColors: PaletteColors = {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#EC4899',
    background: '#FFFFFF',
    text: '#0F172A',
  };

  it('validates a conformant generated Theme JSON output without errors',
     () => {
       const validData = generateThemeJson(sampleColors);
       const result = validateThemeJson(validData);

       expect(result.valid).toBe(true);
       expect(result.errors).toHaveLength(0);
     });

  it('fails when root is not an object', () => {
    expect(validateThemeJson(null).valid).toBe(false);
    expect(validateThemeJson('string').valid).toBe(false);
    expect(validateThemeJson([1, 2, 3]).valid).toBe(false);
  });

  it('fails when required top-level fields are missing', () => {
    const data =
        generateThemeJson(sampleColors) as unknown as Record<string, unknown>;
    delete data.$schema;
    delete data.version;

    const result = validateThemeJson(data);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('$schema'))).toBe(true);
    expect(result.errors.some((e) => e.includes('version'))).toBe(true);
  });

  it('fails when an invalid hex string is supplied', () => {
    const data = generateThemeJson(sampleColors);
    data.colors.primary.hex = 'not-a-hex';

    const result = validateThemeJson(data);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('valid 6-character hex code')))
        .toBe(true);
  });

  it('fails when version is not valid semver', () => {
    const data = generateThemeJson(sampleColors);
    data.version = 'v1';

    const result = validateThemeJson(data);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('semver'))).toBe(true);
  });

  it('fails when a semantic role is missing', () => {
    const data =
        generateThemeJson(sampleColors) as unknown as Record<string, unknown>;
    const colors = data.colors as Record<string, unknown>;
    delete colors.primary;

    const result = validateThemeJson(data);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('colors.primary'))).toBe(true);
  });
});
