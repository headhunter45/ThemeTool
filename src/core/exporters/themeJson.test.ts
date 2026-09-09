import {describe, expect, it} from 'vitest';

import {SHADE_STEPS} from '../color/types';
import {CustomColorSlot, PaletteColors, SEMANTIC_ROLES} from '../palette/types';

import {generateThemeJson, THEME_JSON_SCHEMA_URL, THEME_JSON_VERSION} from './themeJson';

describe('generateThemeJson (TT-025)', () => {
  const sampleColors: PaletteColors = {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#EC4899',
    background: '#FFFFFF',
    text: '#0F172A',
  };

  const sampleCustomSlots: CustomColorSlot[] = [
    {
      id: 'custom-warning',
      name: 'Warning',
      hex: '#F59E0B',
      locked: false,
    },
  ];

  it('generates a complete theme JSON document matching schema requirements',
     () => {
       const exported =
           generateThemeJson(sampleColors, [], {name: 'My Enterprise Theme'});

       expect(exported.$schema).toBe(THEME_JSON_SCHEMA_URL);
       expect(exported.version).toBe(THEME_JSON_VERSION);
       expect(exported.metadata.name).toBe('My Enterprise Theme');
       expect(exported.metadata.generator).toBe('ThemeTool');
       expect(exported.metadata.exportedAt).toBeDefined();

       // Check all 5 core semantic roles are present
       for (const role of SEMANTIC_ROLES) {
         const def = exported.colors[role];
         expect(def).toBeDefined();
         expect(def.role).toBe(role);
         expect(def.hex).toBe(sampleColors[role]);

         // Check RGB, HSL, OKLCH models
         expect(def.rgb).toHaveProperty('r');
         expect(def.rgb).toHaveProperty('g');
         expect(def.rgb).toHaveProperty('b');

         expect(def.hsl).toHaveProperty('h');
         expect(def.hsl).toHaveProperty('s');
         expect(def.hsl).toHaveProperty('l');

         expect(def.oklch).toHaveProperty('l');
         expect(def.oklch).toHaveProperty('c');
         expect(def.oklch).toHaveProperty('h');

         expect(typeof def.relativeLuminance).toBe('number');
         expect(typeof def.contrastAgainstWhite).toBe('number');
         expect(typeof def.contrastAgainstBlack).toBe('number');
         expect(def.recommendedTextColor).toMatch(/^#[0-9A-Fa-f]{6}$/);

         // Check all 11 shade steps
         for (const step of SHADE_STEPS) {
           const shade = def.shades[step];
           expect(shade).toBeDefined();
           expect(shade.step).toBe(step);
           expect(shade.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
           expect(shade.rgb).toBeDefined();
           expect(shade.hsl).toBeDefined();
           expect(shade.oklch).toBeDefined();
           expect(shade.relativeLuminance).toBeDefined();
           expect(shade.contrastAgainstWhite).toBeDefined();
           expect(shade.contrastAgainstBlack).toBeDefined();
           expect(shade.recommendedTextColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
         }
       }
     });

  it('includes custom color slots when provided', () => {
    const exported = generateThemeJson(sampleColors, sampleCustomSlots);

    expect(exported.customColors).toBeDefined();
    expect(exported.customColors).toHaveLength(1);
    const slot = exported.customColors![0];
    expect(slot.id).toBe('custom-warning');
    expect(slot.label).toBe('Warning');
    expect(slot.hex).toBe('#F59E0B');
    expect(slot.shades['500']).toBeDefined();
  });

  it('omits customColors property when no custom slots exist', () => {
    const exported = generateThemeJson(sampleColors, []);
    expect(exported.customColors).toBeUndefined();
  });

  it('computes WCAG contrast matrix with ratios and compliance ratings', () => {
    const exported = generateThemeJson(sampleColors);

    const matrix = exported.contrastMatrix;
    expect(matrix).toBeDefined();

    // text on background (#0F172A on #FFFFFF)
    expect(matrix.textOnBackground.ratio).toBeGreaterThan(15);
    expect(matrix.textOnBackground.normalTextAA).toBe(true);
    expect(matrix.textOnBackground.normalTextAAA).toBe(true);

    // primary on background
    expect(matrix.primaryOnBackground).toBeDefined();
    expect(typeof matrix.primaryOnBackground.ratio).toBe('number');

    // accent on background
    expect(matrix.accentOnBackground).toBeDefined();

    // secondary on background
    expect(matrix.secondaryOnBackground).toBeDefined();
  });
});
