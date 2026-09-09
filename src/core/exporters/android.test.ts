import JSZip from 'jszip';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import {PaletteColors} from '../palette/types';

import {computeAndroidTokens, downloadAndroidZip, generateAndroidColorsXml, generateAndroidNightThemesXml, generateAndroidThemesXml, generateAndroidZip, normalizeAndroidColorName,} from './android';

const mockPalette: PaletteColors = {
  primary: '#2563eb',
  secondary: '#475569',
  accent: '#f59e0b',
  background: '#ffffff',
  text: '#0f172a',
};

const mockDarkPalette: PaletteColors = {
  primary: '#38bdf8',
  secondary: '#94a3b8',
  accent: '#fbbf24',
  background: '#090d16',
  text: '#f8fafc',
};

describe('Android Exporter (TT-016)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('normalizeAndroidColorName', () => {
    it('normalizes custom slot names to valid Android resource identifiers',
       () => {
         expect(normalizeAndroidColorName('Brand Primary'))
             .toBe('brand_primary');
         expect(normalizeAndroidColorName('Hero-Action-Color!'))
             .toBe('hero_action_color');
         expect(normalizeAndroidColorName('  Custom 123  ')).toBe('custom_123');
         expect(normalizeAndroidColorName('___test___')).toBe('test');
         expect(normalizeAndroidColorName('!!!')).toBe('custom_color');
       });
  });

  describe('computeAndroidTokens', () => {
    it('computes complete Material 3 Light and Dark token sets for a light palette',
       () => {
         const tokens = computeAndroidTokens(mockPalette);

         expect(tokens.light.primary).toBe('#2563eb');
         expect(tokens.light.onPrimary).toBeDefined();
         expect(tokens.light.primaryContainer).toBeDefined();
         expect(tokens.light.onPrimaryContainer).toBeDefined();
         expect(tokens.light.surface).toBe('#ffffff');
         expect(tokens.light.onSurface).toBe('#0f172a');
         expect(tokens.light.outline).toBeDefined();

         expect(tokens.dark.primary).toBeDefined();
         expect(tokens.dark.onPrimary).toBeDefined();
         expect(tokens.dark.primaryContainer).toBeDefined();
         expect(tokens.dark.surface).toBeDefined();
         expect(tokens.dark.onSurface).toBeDefined();
       });

    it('computes complete Material 3 Light and Dark token sets for a dark palette',
       () => {
         const tokens = computeAndroidTokens(mockDarkPalette);

         expect(tokens.dark.primary).toBe('#38bdf8');
         expect(tokens.dark.surface).toBe('#090d16');
         expect(tokens.dark.onSurface).toBe('#f8fafc');

         expect(tokens.light.primary).toBeDefined();
         expect(tokens.light.surface).toBeDefined();
         expect(tokens.light.onSurface).toBeDefined();
       });
  });

  describe('generateAndroidColorsXml', () => {
    it('generates valid colors.xml with core semantic colors and M3 light/dark tokens',
       () => {
         const xml =
             generateAndroidColorsXml(mockPalette, [], {includeShades: false});

         expect(xml).toContain('<?xml version="1.0" encoding="utf-8"?>');
         expect(xml).toContain('<resources>');
         expect(xml).toContain('</resources>');

         // Base semantic colors
         expect(xml).toContain('<color name="primary">#2563eb</color>');
         expect(xml).toContain('<color name="secondary">#475569</color>');
         expect(xml).toContain('<color name="accent">#f59e0b</color>');
         expect(xml).toContain('<color name="background">#ffffff</color>');
         expect(xml).toContain('<color name="text">#0f172a</color>');

         // M3 light tokens
         expect(xml).toContain('<color name="md_theme_light_primary">');
         expect(xml).toContain('<color name="md_theme_light_onPrimary">');
         expect(xml).toContain(
             '<color name="md_theme_light_primaryContainer">');
         expect(xml).toContain('<color name="md_theme_light_surface">');

         // M3 dark tokens
         expect(xml).toContain('<color name="md_theme_dark_primary">');
         expect(xml).toContain('<color name="md_theme_dark_onPrimary">');
         expect(xml).toContain('<color name="md_theme_dark_primaryContainer">');
         expect(xml).toContain('<color name="md_theme_dark_surface">');

         // Does not contain shade scales when includeShades is false
         expect(xml).not.toContain('<color name="primary_500">');
       });

    it('includes full 50–950 shade scales when includeShades is true', () => {
      const xml =
          generateAndroidColorsXml(mockPalette, [], {includeShades: true});

      expect(xml).toContain('<color name="primary_50">');
      expect(xml).toContain('<color name="primary_500">');
      expect(xml).toContain('<color name="primary_950">');
      expect(xml).toContain('<color name="secondary_500">');
      expect(xml).toContain('<color name="accent_500">');
    });

    it('formats custom color slots and their shade scales', () => {
      const customSlots = [
        {id: '1', name: 'Brand Indigo', hex: '#6366f1', isLocked: false},
        {id: '2', name: 'Success Mint', hex: '#10b981', isLocked: true},
      ];

      const xml = generateAndroidColorsXml(
          mockPalette, customSlots, {includeShades: true});

      expect(xml).toContain('<color name="brand_indigo">#6366f1</color>');
      expect(xml).toContain('<color name="brand_indigo_500">');
      expect(xml).toContain('<color name="success_mint">#10b981</color>');
      expect(xml).toContain('<color name="success_mint_500">');
    });
  });

  describe('generateAndroidThemesXml', () => {
    it('generates valid Material 3 light theme targeting DayNight.NoActionBar', () => {
      const xml = generateAndroidThemesXml('Theme.MyApp');

      expect(xml).toContain(
          '<style name="Theme.MyApp" parent="Theme.Material3.DayNight.NoActionBar">');
      expect(xml).toContain(
          '<item name="colorPrimary">@color/md_theme_light_primary</item>');
      expect(xml).toContain(
          '<item name="colorOnPrimary">@color/md_theme_light_onPrimary</item>');
      expect(xml).toContain(
          '<item name="colorPrimaryContainer">@color/md_theme_light_primaryContainer</item>');
      expect(xml).toContain(
          '<item name="colorSecondary">@color/md_theme_light_secondary</item>');
      expect(xml).toContain(
          '<item name="colorTertiary">@color/md_theme_light_tertiary</item>');
      expect(xml).toContain(
          '<item name="colorSurface">@color/md_theme_light_surface</item>');
    });

    it('uses fallback theme name when empty string is provided', () => {
      const xml = generateAndroidThemesXml('  ');
      expect(xml).toContain('<style name="Theme.ThemeTool"');
    });
  });

  describe('generateAndroidNightThemesXml', () => {
    it('generates valid Material 3 night theme referencing md_theme_dark tokens', () => {
      const xml = generateAndroidNightThemesXml('Theme.MyApp');

      expect(xml).toContain(
          '<style name="Theme.MyApp" parent="Theme.Material3.DayNight.NoActionBar">');
      expect(xml).toContain(
          '<item name="colorPrimary">@color/md_theme_dark_primary</item>');
      expect(xml).toContain(
          '<item name="colorOnPrimary">@color/md_theme_dark_onPrimary</item>');
      expect(xml).toContain(
          '<item name="colorPrimaryContainer">@color/md_theme_dark_primaryContainer</item>');
      expect(xml).toContain(
          '<item name="colorSecondary">@color/md_theme_dark_secondary</item>');
      expect(xml).toContain(
          '<item name="colorTertiary">@color/md_theme_dark_tertiary</item>');
      expect(xml).toContain(
          '<item name="colorSurface">@color/md_theme_dark_surface</item>');
    });
  });

  describe('generateAndroidZip and downloadAndroidZip', () => {
    it('packages all 3 XML files into a valid ZIP archive preserving Android Studio res/ paths',
       async () => {
         const zipBlob = await generateAndroidZip(mockPalette, [], {
           themeName: 'Theme.AcmeApp',
           includeShades: true,
         });

         expect(zipBlob).toBeInstanceOf(Blob);
         expect(zipBlob.size).toBeGreaterThan(0);

         // Verify ZIP contents using JSZip
         const loadedZip = await JSZip.loadAsync(zipBlob);
         const fileNames = Object.keys(loadedZip.files);

         expect(fileNames).toContain('res/values/colors.xml');
         expect(fileNames).toContain('res/values/themes.xml');
         expect(fileNames).toContain('res/values-night/themes.xml');

         const colorsContent =
             await loadedZip.file('res/values/colors.xml')?.async('string');
         expect(colorsContent)
             .toContain('<color name="primary">#2563eb</color>');

         const themesContent =
             await loadedZip.file('res/values/themes.xml')?.async('string');
         expect(themesContent).toContain('Theme.AcmeApp');
         expect(themesContent).toContain('@color/md_theme_light_primary');

         const nightThemesContent =
             await loadedZip.file('res/values-night/themes.xml')
                 ?.async('string');
         expect(nightThemesContent).toContain('Theme.AcmeApp');
         expect(nightThemesContent).toContain('@color/md_theme_dark_primary');
       });

    it('triggers browser file download with created anchor and cleanups',
       () => {
         const mockBlob = new Blob(['mock content'], {type: 'application/zip'});
         const createObjectURLMock =
             vi.fn().mockReturnValue('blob:http://localhost/mock-zip');
         const revokeObjectURLMock = vi.fn();
         URL.createObjectURL = createObjectURLMock;
         URL.revokeObjectURL = revokeObjectURLMock;

         const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click')
                              .mockImplementation(() => {});
         const appendSpy = vi.spyOn(document.body, 'appendChild');
         const removeSpy = vi.spyOn(document.body, 'removeChild');

         downloadAndroidZip(mockBlob, 'android-theme-resources.zip');

         expect(createObjectURLMock).toHaveBeenCalledWith(mockBlob);
         expect(clickSpy).toHaveBeenCalled();
         expect(appendSpy).toHaveBeenCalled();
         expect(removeSpy).toHaveBeenCalled();
         expect(revokeObjectURLMock)
             .toHaveBeenCalledWith('blob:http://localhost/mock-zip');
       });
  });
});
