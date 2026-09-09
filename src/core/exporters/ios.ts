import JSZip from 'jszip';

import {generateShadeScale, hexToRgb, SHADE_STEPS} from '../color';
import {CustomColorSlot, PaletteColors} from '../palette/types';

export interface IosExportOptions {
  prefix?: string;
  includeShades?: boolean;
  includeUiKit?: boolean;
}

export interface RgbFloatComponents {
  r: string;
  g: string;
  b: string;
}

/**
 * Converts a hex color string into normalized 0.0–1.0 float RGB components
 * formatted to 3 decimal places.
 */
export function hexToRgbFloat(hex: string): RgbFloatComponents {
  try {
    const {r, g, b} = hexToRgb(hex);
    return {
      r: (r / 255).toFixed(3),
      g: (g / 255).toFixed(3),
      b: (b / 255).toFixed(3),
    };
  } catch {
    return {r: '0.000', g: '0.000', b: '0.000'};
  }
}

/**
 * Normalizes a string to a Swift camelCase identifier.
 * e.g. ('primary', 'theme') -> 'themePrimary'
 *      ('Brand Indigo', 'theme') -> 'themeBrandIndigo'
 */
export function normalizeSwiftIdentifier(
    name: string, prefix = 'theme'): string {
  const clean = name.replace(/[^a-zA-Z0-9]+/g, ' ')
                    .trim()
                    .split(/\s+/)
                    .map(
                        (word) => word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase())
                    .join('');

  if (!prefix) {
    return clean ? clean.charAt(0).toLowerCase() + clean.slice(1) : 'color';
  }

  const cleanPrefix = prefix.replace(/[^a-zA-Z0-9]+/g, ' ')
                          .trim()
                          .split(/\s+/)
                          .map(
                              (w, idx) =>
                                  (idx === 0 ? w.toLowerCase() :
                                               w.charAt(0).toUpperCase() +
                                           w.slice(1).toLowerCase()))
                          .join('');

  return `${cleanPrefix}${clean}`;
}

/**
 * Normalizes a string to an Xcode Asset Catalog PascalCase name.
 * e.g. ('primary', 'Theme') -> 'ThemePrimary'
 */
export function normalizeAssetCatalogName(
    name: string, prefix = 'Theme'): string {
  const clean = name.replace(/[^a-zA-Z0-9]+/g, ' ')
                    .trim()
                    .split(/\s+/)
                    .map(
                        (word) => word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase())
                    .join('');

  const cleanPrefix = prefix ?
      prefix.replace(/[^a-zA-Z0-9]+/g, ' ')
          .trim()
          .split(/\s+/)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join('') :
      '';

  return `${cleanPrefix}${clean}`;
}

interface ColorTokenEntry {
  identifier: string;
  assetName: string;
  hex: string;
  r: string;
  g: string;
  b: string;
  category: 'core'|'custom'|'shade';
  comment?: string;
}

/**
 * Collects all color tokens (core roles, custom slots, and shade scales).
 */
export function collectColorTokens(
    colors: PaletteColors, custom: CustomColorSlot[] = [],
    options: IosExportOptions = {}): ColorTokenEntry[] {
  const {prefix = 'theme', includeShades = true} = options;
  const tokens: ColorTokenEntry[] = [];

  const roles: Array<{key: keyof PaletteColors; label: string}> = [
    {key: 'primary', label: 'Primary'},
    {key: 'secondary', label: 'Secondary'},
    {key: 'accent', label: 'Accent'},
    {key: 'background', label: 'Background'},
    {key: 'text', label: 'Text'},
  ];

  // 1. Core Semantic Roles
  roles.forEach(({key, label}) => {
    const hex = colors[key];
    const {r, g, b} = hexToRgbFloat(hex);
    tokens.push({
      identifier: normalizeSwiftIdentifier(key, prefix),
      assetName: normalizeAssetCatalogName(key, prefix ? 'Theme' : ''),
      hex,
      r,
      g,
      b,
      category: 'core',
      comment: label,
    });
  });

  // 2. Custom Color Slots
  if (custom.length > 0) {
    custom.forEach((slot) => {
      const {r, g, b} = hexToRgbFloat(slot.hex);
      tokens.push({
        identifier: normalizeSwiftIdentifier(slot.name, prefix),
        assetName: normalizeAssetCatalogName(slot.name, prefix ? 'Theme' : ''),
        hex: slot.hex,
        r,
        g,
        b,
        category: 'custom',
        comment: slot.name,
      });

      if (includeShades) {
        try {
          const scale = generateShadeScale(slot.hex);
          SHADE_STEPS.forEach((step) => {
            const stepHex = scale[step].hex;
            const rgb = hexToRgbFloat(stepHex);
            tokens.push({
              identifier:
                  `${normalizeSwiftIdentifier(slot.name, prefix)}${step}`,
              assetName: `${
                  normalizeAssetCatalogName(
                      slot.name, prefix ? 'Theme' : '')}${step}`,
              hex: stepHex,
              r: rgb.r,
              g: rgb.g,
              b: rgb.b,
              category: 'shade',
            });
          });
        } catch {
          // Fallback
        }
      }
    });
  }

  // 3. 50-950 Shade Scales for core roles
  if (includeShades) {
    roles.forEach(({key}) => {
      try {
        const scale = generateShadeScale(colors[key]);
        SHADE_STEPS.forEach((step) => {
          const stepHex = scale[step].hex;
          const rgb = hexToRgbFloat(stepHex);
          tokens.push({
            identifier: `${normalizeSwiftIdentifier(key, prefix)}${step}`,
            assetName: `${
                normalizeAssetCatalogName(key, prefix ? 'Theme' : '')}${step}`,
            hex: stepHex,
            r: rgb.r,
            g: rgb.g,
            b: rgb.b,
            category: 'shade',
          });
        });
      } catch {
        // Fallback
      }
    });
  }

  return tokens;
}

/**
 * Generates Theme.swift source code implementing SwiftUI Color and UIKit
 * UIColor extensions.
 */
export function generateSwiftTheme(
    colors: PaletteColors, custom: CustomColorSlot[] = [],
    options: IosExportOptions = {}): string {
  const {includeUiKit = true} = options;
  const tokens = collectColorTokens(colors, custom, options);

  const lines: string[] = [
    '//',
    '//  Theme.swift',
    '//  Generated by ThemeTool (https://headhunter45.github.io/ThemeTool/)',
    '//',
    'import SwiftUI',
    '',
    '// MARK: - SwiftUI Color Extensions',
    'public extension Color {',
  ];

  // Core Roles
  lines.push('    // MARK: Core Semantic Roles');
  tokens.filter((t) => t.category === 'core').forEach((t) => {
    lines.push(`    /// ${t.comment} (${t.hex})`);
    lines.push(`    static let ${t.identifier} = Color(red: ${t.r}, green: ${
        t.g}, blue: ${t.b})`);
  });

  // Custom Slots
  const customTokens = tokens.filter((t) => t.category === 'custom');
  if (customTokens.length > 0) {
    lines.push('');
    lines.push('    // MARK: Custom Color Slots');
    customTokens.forEach((t) => {
      lines.push(`    /// ${t.comment} (${t.hex})`);
      lines.push(`    static let ${t.identifier} = Color(red: ${t.r}, green: ${
          t.g}, blue: ${t.b})`);
    });
  }

  // Shade Scales
  const shadeTokens = tokens.filter((t) => t.category === 'shade');
  if (shadeTokens.length > 0) {
    lines.push('');
    lines.push('    // MARK: 50–950 Shade Scales');
    shadeTokens.forEach((t) => {
      lines.push(`    static let ${t.identifier} = Color(red: ${t.r}, green: ${
          t.g}, blue: ${t.b})`);
    });
  }

  lines.push('}');

  // Optional UIKit extensions
  if (includeUiKit) {
    lines.push('');
    lines.push('#if canImport(UIKit)');
    lines.push('import UIKit');
    lines.push('');
    lines.push('// MARK: - UIKit UIColor Extensions');
    lines.push('public extension UIColor {');

    lines.push('    // MARK: Core Semantic Roles');
    tokens.filter((t) => t.category === 'core').forEach((t) => {
      lines.push(`    /// ${t.comment} (${t.hex})`);
      lines.push(`    static let ${t.identifier} = UIColor(red: ${
          t.r}, green: ${t.g}, blue: ${t.b}, alpha: 1.0)`);
    });

    if (customTokens.length > 0) {
      lines.push('');
      lines.push('    // MARK: Custom Color Slots');
      customTokens.forEach((t) => {
        lines.push(`    /// ${t.comment} (${t.hex})`);
        lines.push(`    static let ${t.identifier} = UIColor(red: ${
            t.r}, green: ${t.g}, blue: ${t.b}, alpha: 1.0)`);
      });
    }

    if (shadeTokens.length > 0) {
      lines.push('');
      lines.push('    // MARK: 50–950 Shade Scales');
      shadeTokens.forEach((t) => {
        lines.push(`    static let ${t.identifier} = UIColor(red: ${
            t.r}, green: ${t.g}, blue: ${t.b}, alpha: 1.0)`);
      });
    }

    lines.push('}');
    lines.push('#endif');
  }

  return lines.join('\n');
}

/**
 * Generates Contents.json for an Xcode Asset Catalog .colorset folder.
 * Supports universal light color, with optional dark appearance variant.
 */
export function generateColorsetJson(
    r: string, g: string, b: string,
    darkRgb?: {r: string; g: string; b: string}): string {
  const colorsEntry: Array<Record<string, unknown>> = [
    {
      idiom: 'universal',
      color: {
        'color-space': 'srgb',
        components: {
          red: r,
          green: g,
          blue: b,
          alpha: '1.000',
        },
      },
    },
  ];

  if (darkRgb) {
    colorsEntry.push({
      idiom: 'universal',
      appearances: [
        {
          appearance: 'luminosity',
          value: 'dark',
        },
      ],
      color: {
        'color-space': 'srgb',
        components: {
          red: darkRgb.r,
          green: darkRgb.g,
          blue: darkRgb.b,
          alpha: '1.000',
        },
      },
    });
  }

  const json = {
    colors: colorsEntry,
    info: {
      author: 'xcode',
      version: 1,
    },
  };

  return JSON.stringify(json, null, 2);
}

/**
 * Generates root Contents.json for Colors.xcassets.
 */
export function generateXcassetsRootJson(): string {
  const json = {
    info: {
      author: 'xcode',
      version: 1,
    },
  };
  return JSON.stringify(json, null, 2);
}

/**
 * Bundles Theme.swift and Colors.xcassets tree into a downloadable ZIP archive.
 */
export async function generateIosZip(
    colors: PaletteColors, custom: CustomColorSlot[] = [],
    options: IosExportOptions = {}): Promise<Blob> {
  const zip = new JSZip();

  // 1. Theme.swift
  const swiftCode = generateSwiftTheme(colors, custom, options);
  zip.file('Theme.swift', swiftCode);

  // 2. Colors.xcassets/Contents.json
  const rootJson = generateXcassetsRootJson();
  zip.file('Colors.xcassets/Contents.json', rootJson);

  // 3. Colors.xcassets/<Name>.colorset/Contents.json
  const tokens = collectColorTokens(colors, custom, options);
  tokens.forEach((t) => {
    const colorsetJson = generateColorsetJson(t.r, t.g, t.b);
    zip.file(
        `Colors.xcassets/${t.assetName}.colorset/Contents.json`, colorsetJson);
  });

  return await zip.generateAsync({type: 'blob'});
}

/**
 * Downloads a string content as a single Swift file.
 */
export function downloadSwiftFile(
    content: string, filename = 'Theme.swift'): void {
  const blob = new Blob([content], {type: 'text/x-swift;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Downloads the generated iOS theme assets ZIP archive.
 */
export function downloadIosZip(
    blob: Blob, filename = 'ios-theme-assets.zip'): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
