import {generateShadeScale, SHADE_STEPS} from '../color';
import {CustomColorSlot, PaletteColors, SEMANTIC_ROLES} from '../palette/types';

export interface TailwindExportOptions {
  prefix?: string;
  format?: 'cjs'|'esm'|'snippet';
  includeShades?: boolean;
}

/**
 * Normalizes a user prefix (e.g., "brand" or "brand-" -> "brand-")
 */
export function normalizePrefix(prefix?: string): string {
  if (!prefix || !prefix.trim()) return '';
  const cleaned = prefix.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  if (!cleaned) return '';
  return cleaned.endsWith('-') ? cleaned : `${cleaned}-`;
}

/**
 * Normalizes custom slot name to valid identifier
 */
export function normalizeKey(name: string): string {
  const cleaned =
      name.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-|-$/g, '');
  return cleaned || 'custom';
}

/**
 * Generates Tailwind v4 @theme CSS block
 */
export function generateTailwindV4(
    colors: PaletteColors, custom: CustomColorSlot[] = [],
    options: TailwindExportOptions = {}): string {
  const prefix = normalizePrefix(options.prefix);
  const includeShades = options.includeShades !== false;

  const lines: string[] = ['@theme {'];

  // Semantic roles
  SEMANTIC_ROLES.forEach((role) => {
    const baseHex = colors[role];
    const roleKey = `${prefix}${role}`;

    lines.push(`  /* ${role.charAt(0).toUpperCase() + role.slice(1)} */`);

    if (includeShades) {
      try {
        const scale = generateShadeScale(baseHex);
        SHADE_STEPS.forEach((step) => {
          lines.push(`  --color-${roleKey}-${step}: ${scale[step].hex};`);
        });
      } catch {
        // Fallback if scale generation fails
      }
    }

    lines.push(`  --color-${roleKey}: ${baseHex};`);
    lines.push('');
  });

  // Custom slots
  if (custom.length > 0) {
    lines.push('  /* Custom Color Slots */');
    custom.forEach((slot) => {
      const slotKey = `${prefix}${normalizeKey(slot.name)}`;
      if (includeShades) {
        try {
          const scale = generateShadeScale(slot.hex);
          SHADE_STEPS.forEach((step) => {
            lines.push(`  --color-${slotKey}-${step}: ${scale[step].hex};`);
          });
        } catch {
          // Fallback
        }
      }
      lines.push(`  --color-${slotKey}: ${slot.hex};`);
      lines.push('');
    });
  }

  // Remove trailing empty line before closing brace if present
  if (lines[lines.length - 1] === '') {
    lines.pop();
  }

  lines.push('}');
  return lines.join('\n');
}

/**
 * Generates Tailwind v3 configuration JavaScript
 */
export function generateTailwindV3(
    colors: PaletteColors, custom: CustomColorSlot[] = [],
    options: TailwindExportOptions = {}): string {
  const prefix = normalizePrefix(options.prefix);
  const format = options.format || 'cjs';
  const includeShades = options.includeShades !== false;

  const colorsObj: Record<string, Record<string, string>|string> = {};

  SEMANTIC_ROLES.forEach((role) => {
    const baseHex = colors[role];
    const roleKey = `${prefix}${role}`;

    if (includeShades) {
      const shadeMap: Record<string, string> = {
        DEFAULT: baseHex,
      };
      try {
        const scale = generateShadeScale(baseHex);
        SHADE_STEPS.forEach((step) => {
          shadeMap[step] = scale[step].hex;
        });
      } catch {
        // Fallback
      }
      colorsObj[roleKey] = shadeMap;
    } else {
      colorsObj[roleKey] = baseHex;
    }
  });

  if (custom.length > 0) {
    custom.forEach((slot) => {
      const slotKey = `${prefix}${normalizeKey(slot.name)}`;
      if (includeShades) {
        const shadeMap: Record<string, string> = {
          DEFAULT: slot.hex,
        };
        try {
          const scale = generateShadeScale(slot.hex);
          SHADE_STEPS.forEach((step) => {
            shadeMap[step] = scale[step].hex;
          });
        } catch {
          // Fallback
        }
        colorsObj[slotKey] = shadeMap;
      } else {
        colorsObj[slotKey] = slot.hex;
      }
    });
  }

  const formattedColorsJson =
      JSON.stringify(colorsObj, null, 6)
          .split('\n')
          .map((line, idx) => (idx === 0 ? line : `    ${line}`))
          .join('\n');

  if (format === 'snippet') {
    return `colors: ${JSON.stringify(colorsObj, null, 2)}`;
  }

  if (format === 'esm') {
    return `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: ${formattedColorsJson.trimStart()},
    },
  },
  plugins: [],
};`;
  }

  // Default: CJS
  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: ${formattedColorsJson.trimStart()},
    },
  },
  plugins: [],
};`;
}

/**
 * Triggers a browser file download of string content
 */
export function downloadTailwindFile(
    content: string, filename: string,
    mimeType: string = 'text/plain;charset=utf-8'): void {
  if (typeof document === 'undefined') return;
  const blob = new Blob([content], {type: mimeType});
  const url = typeof URL.createObjectURL === 'function' ?
      URL.createObjectURL(blob) :
      `data:${mimeType},${encodeURIComponent(content)}`;
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  if (typeof URL.revokeObjectURL === 'function') {
    URL.revokeObjectURL(url);
  }
}
