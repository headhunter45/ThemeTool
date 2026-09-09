import {describe, expect, it, vi} from 'vitest';

import {CustomColorSlot, PaletteColors} from '../palette/types';

import {downloadTailwindFile, generateTailwindDualCss, generateTailwindV3, generateTailwindV4, normalizeKey, normalizePrefix,} from './tailwind';

const mockColors: PaletteColors = {
  primary: '#2f27ce',
  secondary: '#dedcff',
  accent: '#433bff',
  background: '#fbfbfe',
  text: '#050315',
};

const mockCustomSlots: CustomColorSlot[] = [
  {id: 'custom-1', name: 'Brand Danger', hex: '#ef4444'},
  {id: 'custom-2', name: 'Status Warning', hex: '#f59e0b'},
];

describe('Tailwind Exporter (TT-015)', () => {
  describe('normalizePrefix', () => {
    it('returns empty string for empty or whitespace input', () => {
      expect(normalizePrefix('')).toBe('');
      expect(normalizePrefix('   ')).toBe('');
      expect(normalizePrefix(undefined)).toBe('');
    });

    it('appends a trailing hyphen if not present', () => {
      expect(normalizePrefix('brand')).toBe('brand-');
      expect(normalizePrefix('app')).toBe('app-');
    });

    it('preserves existing trailing hyphen', () => {
      expect(normalizePrefix('brand-')).toBe('brand-');
    });

    it('lowercases and strips invalid characters', () => {
      expect(normalizePrefix('Brand$Theme ')).toBe('brandtheme-');
    });
  });

  describe('normalizeKey', () => {
    it('converts multi-word names to kebab-case', () => {
      expect(normalizeKey('Brand Danger')).toBe('brand-danger');
      expect(normalizeKey('Status Warning & Alert'))
          .toBe('status-warning-alert');
    });

    it('falls back to "custom" for empty input', () => {
      expect(normalizeKey('')).toBe('custom');
      expect(normalizeKey('$$$')).toBe('custom');
    });
  });

  describe('generateTailwindV4', () => {
    it('generates valid @theme CSS with all 5 semantic roles and 11 shade steps',
       () => {
         const css = generateTailwindV4(mockColors);

         expect(css).toContain('@theme {');
         expect(css).toContain('/* Primary */');
         expect(css).toContain('--color-primary-50:');
         expect(css).toContain('--color-primary-500:');
         expect(css).toContain('--color-primary-950:');
         expect(css).toContain('--color-primary: #2f27ce;');

         expect(css).toContain('/* Secondary */');
         expect(css).toContain('--color-secondary-50:');
         expect(css).toContain('--color-secondary: #dedcff;');

         expect(css).toContain('/* Accent */');
         expect(css).toContain('--color-accent-50:');
         expect(css).toContain('--color-accent: #433bff;');

         expect(css).toContain('/* Background */');
         expect(css).toContain('--color-background: #fbfbfe;');

         expect(css).toContain('/* Text */');
         expect(css).toContain('--color-text: #050315;');
         expect(css.endsWith('}')).toBe(true);
       });

    it('prepends custom prefix to all variable names', () => {
      const css = generateTailwindV4(mockColors, [], {prefix: 'brand'});

      expect(css).toContain('--color-brand-primary-50:');
      expect(css).toContain('--color-brand-primary-500:');
      expect(css).toContain('--color-brand-primary: #2f27ce;');
      expect(css).toContain('--color-brand-accent: #433bff;');
    });

    it('omits shade steps when includeShades is false', () => {
      const css = generateTailwindV4(mockColors, [], {includeShades: false});

      expect(css).toContain('--color-primary: #2f27ce;');
      expect(css).not.toContain('--color-primary-500:');
      expect(css).not.toContain('--color-primary-50:');
    });

    it('includes custom color slots with 11 shade steps', () => {
      const css = generateTailwindV4(mockColors, mockCustomSlots);

      expect(css).toContain('/* Custom Color Slots */');
      expect(css).toContain('--color-brand-danger-50:');
      expect(css).toContain('--color-brand-danger: #ef4444;');
      expect(css).toContain('--color-status-warning-50:');
      expect(css).toContain('--color-status-warning: #f59e0b;');
    });
  });

  describe('generateTailwindV3', () => {
    it('generates valid CJS tailwind.config.js by default', () => {
      const js = generateTailwindV3(mockColors);

      expect(js).toContain('module.exports = {');
      expect(js).toContain('content: [');
      expect(js).toContain('theme: {');
      expect(js).toContain('extend: {');
      expect(js).toContain('colors: {');
      expect(js).toContain('"primary": {');
      expect(js).toContain('"DEFAULT": "#2f27ce"');
      expect(js).toContain('"50":');
      expect(js).toContain('"500":');
      expect(js).toContain('"950":');
      expect(js).toContain('"secondary": {');
      expect(js).toContain('"accent": {');
    });

    it('generates valid ESM config when format is esm', () => {
      const js = generateTailwindV3(mockColors, [], {format: 'esm'});

      expect(js).toContain('export default {');
      expect(js).not.toContain('module.exports');
      expect(js).toContain('"primary": {');
    });

    it('generates raw colors snippet when format is snippet', () => {
      const js = generateTailwindV3(mockColors, [], {format: 'snippet'});

      expect(js.startsWith('colors: {')).toBe(true);
      expect(js).not.toContain('module.exports');
      expect(js).not.toContain('export default');
      expect(js).toContain('"DEFAULT": "#2f27ce"');
    });

    it('prepends custom prefix to color keys', () => {
      const js = generateTailwindV3(mockColors, [], {prefix: 'app'});

      expect(js).toContain('"app-primary": {');
      expect(js).toContain('"app-secondary": {');
      expect(js).toContain('"app-accent": {');
    });

    it('includes custom color slots', () => {
      const js = generateTailwindV3(mockColors, mockCustomSlots);

      expect(js).toContain('"brand-danger": {');
      expect(js).toContain('"status-warning": {');
      expect(js).toContain('"DEFAULT": "#ef4444"');
    });

    it('omits shade scale when includeShades is false', () => {
      const js = generateTailwindV3(mockColors, [], {includeShades: false});

      expect(js).toContain('"primary": "#2f27ce"');
      expect(js).not.toContain('"DEFAULT":');
    });
  });

  describe('downloadTailwindFile', () => {
    it('creates and clicks a temporary download anchor', () => {
      const clickSpy = vi.fn();
      const originalCreate = document.createElement.bind(document);

      vi.spyOn(document, 'createElement')
          .mockImplementation((tagName: string) => {
            const el = originalCreate(tagName);
            if (tagName === 'a') {
              el.click = clickSpy;
            }
            return el;
          });

      downloadTailwindFile('@theme {}', 'theme.css', 'text/css');

      expect(clickSpy).toHaveBeenCalledTimes(1);
      vi.restoreAllMocks();
    });
  });

  describe('generateTailwindDualCss', () => {
    it('generates root and .dark CSS variable declarations for dual palettes',
       () => {
         const darkColors: PaletteColors = {
           primary: '#6b66ff',
           secondary: '#363466',
           accent: '#756eff',
           background: '#12111a',
           text: '#f2f1fc',
         };

         const css =
             generateTailwindDualCss(mockColors, darkColors, mockCustomSlots);

         expect(css).toContain(':root {');
         expect(css).toContain('--color-primary: #2f27ce;');
         expect(css).toContain('--color-background: #fbfbfe;');
         expect(css).toContain('--color-brand-danger: #ef4444;');
         expect(css).toContain('.dark {');
         expect(css).toContain('--color-primary: #6b66ff;');
         expect(css).toContain('--color-background: #12111a;');
       });
  });
});
