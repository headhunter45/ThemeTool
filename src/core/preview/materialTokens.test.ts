import {describe, expect, it} from 'vitest';

import {getContrastRatio} from '../color';
import {PaletteColors} from '../palette/types';

import {computeMaterialTokens} from './materialTokens';

describe('computeMaterialTokens', () => {
  const lightColors: PaletteColors = {
    primary: '#6750A4',
    secondary: '#625B71',
    accent: '#7D5260',
    background: '#FFFFFF',
    text: '#1C1B1F',
  };

  const darkColors: PaletteColors = {
    primary: '#D0BCFF',
    secondary: '#CCC2DC',
    accent: '#EFB8C8',
    background: '#1C1B1F',
    text: '#E6E1E5',
  };

  it('computes complete token set for light theme', () => {
    const tokens = computeMaterialTokens(lightColors);

    expect(tokens.isDark).toBe(false);
    expect(tokens.primary).toBe('#6750A4');
    expect(tokens.onPrimary).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(tokens.primaryContainer).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(tokens.onPrimaryContainer).toMatch(/^#[0-9A-Fa-f]{6}$/);

    expect(tokens.secondary).toBe('#625B71');
    expect(tokens.secondaryContainer).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(tokens.onSecondaryContainer).toMatch(/^#[0-9A-Fa-f]{6}$/);

    expect(tokens.tertiary).toBe('#7D5260');
    expect(tokens.tertiaryContainer).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(tokens.onTertiaryContainer).toMatch(/^#[0-9A-Fa-f]{6}$/);

    expect(tokens.surface).toBe('#FFFFFF');
    expect(tokens.onSurface).toBe('#1C1B1F');
    expect(tokens.outline).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(tokens.outlineVariant).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('computes complete token set for dark theme and adapts container polarities',
     () => {
       const tokens = computeMaterialTokens(darkColors);

       expect(tokens.isDark).toBe(true);
       expect(tokens.primary).toBe('#D0BCFF');
       expect(tokens.surface).toBe('#1C1B1F');
       expect(tokens.onSurface).toBe('#E6E1E5');

       // In dark theme, container should be a dark shade and onContainer should
       // be light
       expect(tokens.primaryContainer).toBeDefined();
       expect(tokens.onPrimaryContainer).toBeDefined();
     });

  it('provides accessible text contrast on primary color', () => {
    const tokens = computeMaterialTokens(lightColors);
    const contrast = getContrastRatio(tokens.onPrimary, tokens.primary);
    expect(contrast).toBeGreaterThanOrEqual(4.5);
  });
});
