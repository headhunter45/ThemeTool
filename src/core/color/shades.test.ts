import {describe, expect, it} from 'vitest';

import {generateShadeScale, getClosestStep} from './shades';
import {SHADE_STEPS} from './types';

describe('Shade Scale Engine', () => {
  it('generates all 11 steps for standard brand colors', () => {
    const scale = generateShadeScale('#3b82f6');  // Tailwind Blue 500

    for (const step of SHADE_STEPS) {
      expect(scale[step]).toBeDefined();
      expect(scale[step].hex).toMatch(/^#[0-9a-f]{6}$/i);
      expect(scale[step].rgb).toBeDefined();
      expect(scale[step].hsl).toBeDefined();
      expect(scale[step].oklch).toBeDefined();
      expect(scale[step].contrastAgainstWhite).toBeGreaterThan(0);
      expect(scale[step].contrastAgainstBlack).toBeGreaterThan(0);
      expect([
        '#ffffff', '#000000'
      ]).toContain(scale[step].recommendedTextColor);
    }
  });

  it('maintains monotonic perceptual lightness from 50 (lightest) to 950 (darkest)',
     () => {
       const testHexes =
           ['#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#0f172a', '#fef08a'];

       for (const hex of testHexes) {
         const scale = generateShadeScale(hex);
         for (let i = 0; i < SHADE_STEPS.length - 1; i++) {
           const currentStep = SHADE_STEPS[i];
           const nextStep = SHADE_STEPS[i + 1];

           // Lightness of current must be strictly greater than or equal to
           // next
           expect(scale[currentStep].oklch.l)
               .toBeGreaterThanOrEqual(scale[nextStep].oklch.l);
         }
       }
     });

  it('correctly anchors deep colors to their natural dark step without squashing 500',
     () => {
       const deepNavy = '#0f172a';  // Tailwind slate-900 (very dark)
       const closest = getClosestStep(0.20);
       expect(['900', '950']).toContain(closest);

       const scale = generateShadeScale(deepNavy);
       const baseStep = SHADE_STEPS.find((s) => scale[s].isBaseColor);
       expect(baseStep).toBeDefined();
       expect(Number(baseStep)).toBeGreaterThanOrEqual(800);
     });

  it('correctly anchors pastel colors to their natural light step', () => {
    const pastelYellow = '#fef08a';  // Tailwind yellow-200
    const scale = generateShadeScale(pastelYellow);
    const baseStep = SHADE_STEPS.find((s) => scale[s].isBaseColor);
    expect(baseStep).toBeDefined();
    expect(Number(baseStep)).toBeLessThanOrEqual(300);
  });

  it('supports forcing base color to step 500 when requested', () => {
    const deepNavy = '#0f172a';
    const scale = generateShadeScale(deepNavy, {force500Anchor: true});
    expect(scale['500'].isBaseColor).toBe(true);
  });

  it('handles edge case: pure black (#000000)', () => {
    const scale = generateShadeScale('#000000');
    expect(scale['50'].hex).not.toBe('#000000');
    expect(scale['950'].hex).toBe('#000000');
    expect(scale['50'].oklch.l).toBeGreaterThan(0.9);
  });

  it('handles edge case: pure white (#ffffff)', () => {
    const scale = generateShadeScale('#ffffff');
    expect(scale['50'].hex).toBe('#ffffff');
    expect(scale['950'].hex).not.toBe('#ffffff');
    expect(scale['950'].oklch.l).toBeLessThan(0.2);
  });

  it('handles edge case: neon green (#00ff00)', () => {
    const scale = generateShadeScale('#00ff00');
    expect(scale['50']).toBeDefined();
    expect(scale['950']).toBeDefined();
    for (const step of SHADE_STEPS) {
      expect(scale[step].rgb.r).toBeGreaterThanOrEqual(0);
      expect(scale[step].rgb.r).toBeLessThanOrEqual(255);
      expect(scale[step].rgb.g).toBeGreaterThanOrEqual(0);
      expect(scale[step].rgb.g).toBeLessThanOrEqual(255);
      expect(scale[step].rgb.b).toBeGreaterThanOrEqual(0);
      expect(scale[step].rgb.b).toBeLessThanOrEqual(255);
    }
  });
});
