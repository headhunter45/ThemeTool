import {normalizeHexColor} from './urlParser';

export type TailwindImportFormat = 'tailwind3'|'tailwind4'|'uicolors-url';

export interface ParsedTailwindResult {
  name?: string;
  baseHex: string;
  shades?: Record<string, string>;
  format: TailwindImportFormat;
}

const SHADE_STEP_KEYS = [
  '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'
];

/**
 * Parses a UIColors.app generation URL, e.g.:
 * - https://uicolors.app/generate/b49c2c
 * - https://uicolors.app/generate/b49c2c?name=lucky
 */
export function parseUIColorsUrl(input: string): ParsedTailwindResult|null {
  if (!input || typeof input !== 'string') return null;

  const trimmed = input.trim();
  const match = trimmed.match(
      /(?:https?:\/\/)?(?:www\.)?uicolors\.app\/generate\/([0-9a-fA-F]{3,6})(?:[/?#]|$)/i);
  if (!match || !match[1]) return null;

  const baseHex = normalizeHexColor(match[1]);
  if (!baseHex) return null;

  let name: string|undefined;
  try {
    const url =
        new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    const nameParam = url.searchParams.get('name');
    if (nameParam && nameParam.trim()) {
      name = nameParam.trim();
    }
  } catch {
    // Ignore URL parse error
  }

  return {
    name,
    baseHex,
    format: 'uicolors-url',
  };
}

/**
 * Parses Tailwind v4 CSS variable definitions, e.g.:
 * --color-lucky-50: #faf9ec;
 * ...
 * --color-lucky-500: #b49c2c;
 * ...
 */
export function parseTailwind4CssSnippet(code: string): ParsedTailwindResult|
    null {
  if (!code || typeof code !== 'string') return null;
  if (!code.includes('--color-')) return null;

  const shades: Record<string, string> = {};
  let detectedName: string|undefined;

  // Match: --color-[name-]step: #hex;
  // e.g. --color-lucky-50: #faf9ec; or --color-50: #faf9ec;
  const regex =
      /--color-(?:([a-zA-Z0-9_-]+)-)?(50|100|200|300|400|500|600|700|800|900|950)\s*:\s*([^;]+);/gi;

  let match: RegExpExecArray|null;
  while ((match = regex.exec(code)) !== null) {
    const namePart = match[1];
    const step = match[2];
    const rawVal = match[3].trim();

    if (namePart && !detectedName) {
      detectedName = namePart;
    }

    const hex = normalizeHexColor(rawVal);
    if (hex) {
      shades[step] = hex;
    }
  }

  const stepsFound = Object.keys(shades);
  if (stepsFound.length === 0) return null;

  // Base hex priority: 500 -> 400 -> 600 -> first found
  const baseHex =
      shades['500'] || shades['400'] || shades['600'] || shades[stepsFound[0]];

  if (!baseHex) return null;

  return {
    name: detectedName,
    baseHex,
    shades,
    format: 'tailwind4',
  };
}

/**
 * Parses Tailwind v3 JavaScript object syntax, e.g.:
 * 'lucky': {
 *   '50': '#faf9ec',
 *   ...
 *   '500': '#b49c2c',
 *   ...
 * }
 */
export function parseTailwind3Snippet(code: string): ParsedTailwindResult|null {
  if (!code || typeof code !== 'string') return null;

  // Extract optional outer name, e.g. 'lucky': { or lucky: { or "lucky": {
  let detectedName: string|undefined;
  const nameMatch = code.match(/['"]?([a-zA-Z0-9_-]+)['"]?\s*:\s*\{/i);
  if (nameMatch && nameMatch[1]) {
    // Avoid mistaking numeric step keys for the outer name
    if (!SHADE_STEP_KEYS.includes(nameMatch[1])) {
      detectedName = nameMatch[1];
    }
  }

  const shades: Record<string, string> = {};

  // Match step-value pairs: '50': '#faf9ec', or 50: "#faf9ec",
  const stepRegex =
      /['"]?(50|100|200|300|400|500|600|700|800|900|950)['"]?\s*:\s*['"]([^'"]+)['"]/gi;

  let match: RegExpExecArray|null;
  while ((match = stepRegex.exec(code)) !== null) {
    const step = match[1];
    const rawVal = match[2].trim();
    const hex = normalizeHexColor(rawVal);
    if (hex) {
      shades[step] = hex;
    }
  }

  const stepsFound = Object.keys(shades);
  if (stepsFound.length === 0) return null;

  const baseHex =
      shades['500'] || shades['400'] || shades['600'] || shades[stepsFound[0]];

  if (!baseHex) return null;

  return {
    name: detectedName,
    baseHex,
    shades,
    format: 'tailwind3',
  };
}

/**
 * Unified Tailwind / UIColors parser checking URL, Tailwind 4 CSS, or Tailwind
 * 3 JS.
 */
export function parseTailwindImport(input: string): ParsedTailwindResult|null {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();

  // 1. UIColors URL
  if (/uicolors\.app/i.test(trimmed)) {
    const urlResult = parseUIColorsUrl(trimmed);
    if (urlResult) return urlResult;
  }

  // 2. Tailwind 4 CSS variables
  if (trimmed.includes('--color-')) {
    const cssResult = parseTailwind4CssSnippet(trimmed);
    if (cssResult) return cssResult;
  }

  // 3. Tailwind 3 JS object
  const jsResult = parseTailwind3Snippet(trimmed);
  if (jsResult) return jsResult;

  return null;
}
