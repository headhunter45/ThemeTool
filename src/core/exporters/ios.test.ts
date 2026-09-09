import JSZip from 'jszip';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import {CustomColorSlot, PaletteColors} from '../palette/types';

import {collectColorTokens, downloadIosZip, downloadSwiftFile, generateColorsetJson, generateIosZip, generateSwiftTheme, generateXcassetsRootJson, hexToRgbFloat, normalizeAssetCatalogName, normalizeSwiftIdentifier,} from './ios';

const mockPalette: PaletteColors = {
  primary: '#2563eb',
  secondary: '#475569',
  accent: '#f59e0b',
  background: '#ffffff',
  text: '#0f172a',
};

const mockCustomSlots: CustomColorSlot[] = [
  {id: '1', name: 'Brand Indigo', hex: '#6366f1', locked: false},
  {id: '2', name: 'Success Mint', hex: '#10b981', locked: true},
];

describe('iOS Exporter (TT-017)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('hexToRgbFloat', () => {
    it('converts hex colors to normalized 0.0–1.0 float components', () => {
      const rgb = hexToRgbFloat('#2563eb');
      expect(rgb.r).toBe('0.145');
      expect(rgb.g).toBe('0.388');
      expect(rgb.b).toBe('0.922');
    });

    it('falls back safely on invalid hex strings', () => {
      const rgb = hexToRgbFloat('invalid-hex');
      expect(rgb.r).toBe('0.000');
      expect(rgb.g).toBe('0.000');
      expect(rgb.b).toBe('0.000');
    });
  });

  describe('normalizeSwiftIdentifier', () => {
    it('generates camelCase identifiers with prefix', () => {
      expect(normalizeSwiftIdentifier('primary', 'theme')).toBe('themePrimary');
      expect(normalizeSwiftIdentifier('Brand Indigo', 'theme'))
          .toBe('themeBrandIndigo');
      expect(normalizeSwiftIdentifier('accent-color', 'brand'))
          .toBe('brandAccentColor');
      expect(normalizeSwiftIdentifier('success', '')).toBe('success');
    });
  });

  describe('normalizeAssetCatalogName', () => {
    it('generates PascalCase names for Xcode .colorset folders', () => {
      expect(normalizeAssetCatalogName('primary', 'Theme'))
          .toBe('ThemePrimary');
      expect(normalizeAssetCatalogName('Brand Indigo', 'Theme'))
          .toBe('ThemeBrandIndigo');
      expect(normalizeAssetCatalogName('accent', '')).toBe('Accent');
    });
  });

  describe('collectColorTokens', () => {
    it('collects 5 core roles with optional custom slots and shades', () => {
      const tokensWithShades =
          collectColorTokens(mockPalette, mockCustomSlots, {
            prefix: 'theme',
            includeShades: true,
          });

      // 5 core + 2 custom + (5 * 11) core shades + (2 * 11) custom shades = 7 +
      // 77 = 84 tokens
      expect(tokensWithShades.length).toBe(84);
      expect(tokensWithShades.some((t) => t.identifier === 'themePrimary'))
          .toBe(true);
      expect(tokensWithShades.some((t) => t.identifier === 'themeBrandIndigo'))
          .toBe(true);
      expect(tokensWithShades.some((t) => t.identifier === 'themePrimary500'))
          .toBe(true);

      const tokensWithoutShades =
          collectColorTokens(mockPalette, mockCustomSlots, {
            prefix: 'theme',
            includeShades: false,
          });
      // 5 core + 2 custom = 7 tokens
      expect(tokensWithoutShades.length).toBe(7);
    });
  });

  describe('generateSwiftTheme', () => {
    it('generates valid Swift code with SwiftUI Color and UIKit UIColor extensions',
       () => {
         const swift = generateSwiftTheme(mockPalette, mockCustomSlots, {
           prefix: 'theme',
           includeShades: true,
           includeUiKit: true,
         });

         expect(swift).toContain('import SwiftUI');
         expect(swift).toContain('public extension Color {');
         expect(swift).toContain(
             'static let themePrimary = Color(red: 0.145, green: 0.388, blue: 0.922)');
         expect(swift).toContain('static let themeSecondary = Color(');
         expect(swift).toContain('static let themeBrandIndigo = Color(');
         expect(swift).toContain('static let themePrimary500 = Color(');

         // UIKit section
         expect(swift).toContain('#if canImport(UIKit)');
         expect(swift).toContain('import UIKit');
         expect(swift).toContain('public extension UIColor {');
         expect(swift).toContain(
             'static let themePrimary = UIColor(red: 0.145, green: 0.388, blue: 0.922, alpha: 1.0)');
       });

    it('omits UIKit extensions when includeUiKit is false', () => {
      const swift = generateSwiftTheme(mockPalette, [], {
        includeUiKit: false,
      });

      expect(swift).toContain('public extension Color');
      expect(swift).not.toContain('#if canImport(UIKit)');
      expect(swift).not.toContain('public extension UIColor');
    });

    it('honors custom prefix', () => {
      const swift = generateSwiftTheme(mockPalette, [], {
        prefix: 'brand',
      });

      expect(swift).toContain('static let brandPrimary =');
      expect(swift).toContain('static let brandSecondary =');
    });
  });

  describe('generateColorsetJson and generateXcassetsRootJson', () => {
    it('generates valid JSON for Xcode .colorset/Contents.json', () => {
      const jsonStr = generateColorsetJson('0.145', '0.388', '0.922');
      const parsed = JSON.parse(jsonStr);

      expect(parsed.info.author).toBe('xcode');
      expect(parsed.info.version).toBe(1);
      expect(parsed.colors[0].idiom).toBe('universal');
      expect(parsed.colors[0].color['color-space']).toBe('srgb');
      expect(parsed.colors[0].color.components.red).toBe('0.145');
      expect(parsed.colors[0].color.components.alpha).toBe('1.000');
    });

    it('generates Contents.json with dark appearance when darkRgb is provided',
       () => {
         const jsonStr = generateColorsetJson('0.145', '0.388', '0.922', {
           r: '0.220',
           g: '0.510',
           b: '0.950',
         });
         const parsed = JSON.parse(jsonStr);

         expect(parsed.colors).toHaveLength(2);
         expect(parsed.colors[1].idiom).toBe('universal');
         expect(parsed.colors[1].appearances).toBeDefined();
         expect(parsed.colors[1].appearances[0].appearance).toBe('luminosity');
         expect(parsed.colors[1].appearances[0].value).toBe('dark');
         expect(parsed.colors[1].color.components.red).toBe('0.220');
       });

    it('generates root Colors.xcassets/Contents.json', () => {
      const jsonStr = generateXcassetsRootJson();
      const parsed = JSON.parse(jsonStr);

      expect(parsed.info.author).toBe('xcode');
      expect(parsed.info.version).toBe(1);
    });
  });

  describe('generateIosZip and download helpers', () => {
    it('packages Theme.swift and Colors.xcassets directory tree into valid ZIP archive',
       async () => {
         const blob = await generateIosZip(mockPalette, mockCustomSlots, {
           prefix: 'theme',
           includeShades: false,
           includeUiKit: true,
         });

         expect(blob).toBeInstanceOf(Blob);
         expect(blob.size).toBeGreaterThan(0);

         const zip = await JSZip.loadAsync(blob);
         const fileNames = Object.keys(zip.files);

         expect(fileNames).toContain('Theme.swift');
         expect(fileNames).toContain('Colors.xcassets/Contents.json');
         expect(fileNames).toContain(
             'Colors.xcassets/ThemePrimary.colorset/Contents.json');
         expect(fileNames).toContain(
             'Colors.xcassets/ThemeSecondary.colorset/Contents.json');
         expect(fileNames).toContain(
             'Colors.xcassets/ThemeBrandIndigo.colorset/Contents.json');

         const swiftContent = await zip.file('Theme.swift')?.async('string');
         expect(swiftContent).toContain('static let themePrimary = Color(');

         const primaryColorset =
             await zip
                 .file('Colors.xcassets/ThemePrimary.colorset/Contents.json')
                 ?.async('string');
         expect(primaryColorset).toContain('"color-space": "srgb"');
         expect(primaryColorset).toContain('"red": "0.145"');
       });

    it('triggers single Swift file download', () => {
      const createObjectURLMock = vi.fn().mockReturnValue('blob:mock-swift');
      const revokeObjectURLMock = vi.fn();
      URL.createObjectURL = createObjectURLMock;
      URL.revokeObjectURL = revokeObjectURLMock;

      const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click')
                           .mockImplementation(() => {});
      const appendSpy = vi.spyOn(document.body, 'appendChild');
      const removeSpy = vi.spyOn(document.body, 'removeChild');

      downloadSwiftFile('// Swift Code', 'Theme.swift');

      expect(createObjectURLMock).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(appendSpy).toHaveBeenCalled();
      expect(removeSpy).toHaveBeenCalled();
      expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-swift');
    });

    it('triggers iOS assets ZIP file download', () => {
      const mockBlob = new Blob(['zip'], {type: 'application/zip'});
      const createObjectURLMock = vi.fn().mockReturnValue('blob:mock-zip');
      const revokeObjectURLMock = vi.fn();
      URL.createObjectURL = createObjectURLMock;
      URL.revokeObjectURL = revokeObjectURLMock;

      const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click')
                           .mockImplementation(() => {});
      const appendSpy = vi.spyOn(document.body, 'appendChild');
      const removeSpy = vi.spyOn(document.body, 'removeChild');

      downloadIosZip(mockBlob, 'ios-theme-assets.zip');

      expect(createObjectURLMock).toHaveBeenCalledWith(mockBlob);
      expect(clickSpy).toHaveBeenCalled();
      expect(appendSpy).toHaveBeenCalled();
      expect(removeSpy).toHaveBeenCalled();
      expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-zip');
    });
  });
});
