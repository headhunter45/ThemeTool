import {CustomColorSlot, PaletteColors, ROLE_METADATA} from '../palette/types';

export type PaletteSource = 'coolors'|'colorkit'|'themetool'|'raw';

export interface ParsedPaletteResult {
  colors: string[];
  source: PaletteSource;
  mapped: {colors: PaletteColors; custom?: CustomColorSlot[];};
}

const HEX_COLOR_REGEX = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

/**
 * Normalizes any 3- or 6-digit hex string (with or without `#`) into a standard
 * `#rrggbb` lowercase string. Returns null if the string is not a valid hex
 * color code.
 */
export function normalizeHexColor(raw: string): string|null {
  const trimmed = raw.trim();
  if (!HEX_COLOR_REGEX.test(trimmed)) return null;
  const noHash = trimmed.replace(/^#/, '');
  if (noHash.length === 3) {
    return `#${noHash[0]}${noHash[0]}${noHash[1]}${noHash[1]}${noHash[2]}${
               noHash[2]}`
        .toLowerCase();
  }
  return `#${noHash.toLowerCase()}`;
}

/**
 * Splits a dash- or hyphen-separated hex string, validates each part, and
 * returns normalized hex codes.
 */
export function extractHexFromSlug(slug: string): string[]|null {
  if (!slug) return null;
  // Clean off any trailing slashes, query params, or hashes
  const cleanSlug = slug.split(/[?#/]/)[0].trim();
  if (!cleanSlug) return null;

  const parts = cleanSlug.split('-');
  if (parts.length === 0) return null;

  const normalized: string[] = [];
  for (const part of parts) {
    if (!part) return null;
    const hex = normalizeHexColor(part);
    if (!hex) return null;
    normalized.push(hex);
  }

  return normalized.length > 0 ? normalized : null;
}

/**
 * Parses a Coolors URL and extracts normalized `#rrggbb` hex color codes.
 * Supports:
 * - https://coolors.co/palette/6f2dbd-a663cc-b298dc-b8d0eb-b9faf8
 * - https://coolors.co/6f2dbd-a663cc-b298dc-b8d0eb-b9faf8
 * - www.coolors.co or http variants, trailing slashes, and query params.
 */
export function parseCoolorsUrl(url: string): string[]|null {
  if (!url || typeof url !== 'string') return null;

  const trimmed = url.trim();
  // Match coolors.co/(palette/)?{hexSlug}
  const match = trimmed.match(
      /(?:^|https?:\/\/)?(?:www\.)?coolors\.co\/(?:palette\/)?([a-fA-F0-9\-#]+)/i);
  if (!match || !match[1]) return null;

  return extractHexFromSlug(match[1]);
}

/**
 * Parses a ColorKit URL and extracts normalized `#rrggbb` hex color codes.
 * Supports:
 * - https://colorkit.co/palette/eebea0-ff8d83-ffa89f-ffc2bc-aaae80/
 * - https://colorkit.co/palette/eebea0-ff8d83-ffa89f-ffc2bc-aaae80
 * - colorkit.co/eebea0-ff8d83-...
 */
export function parseColorKitUrl(url: string): string[]|null {
  if (!url || typeof url !== 'string') return null;

  const trimmed = url.trim();
  // Match colorkit.co/(palette/)?{hexSlug}
  const match = trimmed.match(
      /(?:^|https?:\/\/)?(?:www\.)?colorkit\.co\/(?:palette\/)?([a-fA-F0-9\-#]+)/i);
  if (!match || !match[1]) return null;

  return extractHexFromSlug(match[1]);
}

/**
 * Maps an arbitrary array of hex colors to the 5 semantic roles (text,
 * background, primary, secondary, accent). Additional colors beyond 5 are
 * mapped to custom color slots. Colors fewer than 5 fallback to default role
 * metadata colors.
 */
export function mapColorsToPalette(hexCodes: string[]):
    {colors: PaletteColors; custom?: CustomColorSlot[];} {
  const resultColors: PaletteColors = {
    text: hexCodes[0] || ROLE_METADATA.text.defaultHex,
    background: hexCodes[1] || ROLE_METADATA.background.defaultHex,
    primary: hexCodes[2] || ROLE_METADATA.primary.defaultHex,
    secondary: hexCodes[3] || ROLE_METADATA.secondary.defaultHex,
    accent: hexCodes[4] || ROLE_METADATA.accent.defaultHex,
  };

  let custom: CustomColorSlot[]|undefined;
  if (hexCodes.length > 5) {
    custom = hexCodes.slice(5).map((hex, index) => ({
                                     id: `custom-import-${index + 1}`,
                                     name: `Custom ${index + 6}`,
                                     hex,
                                   }));
  }

  return {colors: resultColors, custom};
}

/**
 * Universal palette parser that detects whether an input is a Coolors URL,
 * ColorKit URL, ThemeTool share URL/query, or raw dash-separated hex string.
 */
export function parsePaletteUrl(input: string): ParsedPaletteResult|null {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();

  // 1. Coolors URL
  if (/coolors\.co/i.test(trimmed)) {
    const colors = parseCoolorsUrl(trimmed);
    if (colors && colors.length > 0) {
      return {
        colors,
        source: 'coolors',
        mapped: mapColorsToPalette(colors),
      };
    }
  }

  // 2. ColorKit URL
  if (/colorkit\.co/i.test(trimmed)) {
    const colors = parseColorKitUrl(trimmed);
    if (colors && colors.length > 0) {
      return {
        colors,
        source: 'colorkit',
        mapped: mapColorsToPalette(colors),
      };
    }
  }

  // 3. ThemeTool URL or query with ?colors= or #colors=
  if (/[?#&]colors=/i.test(trimmed)) {
    try {
      const match = trimmed.match(/[?#&]colors=([a-fA-F0-9\-#]+)/i);
      if (match && match[1]) {
        const colors = extractHexFromSlug(match[1]);
        if (colors && colors.length > 0) {
          return {
            colors,
            source: 'themetool',
            mapped: mapColorsToPalette(colors),
          };
        }
      }
    } catch {
      // Fall through
    }
  }

  // 4. Raw comma-separated hex codes
  // e.g. #6f2dbd, #a663cc, #b298dc
  const commaSeparated = trimmed.split(',').map((s) => s.trim());
  if (commaSeparated.length > 1) {
    const validHexes: string[] = [];
    for (const item of commaSeparated) {
      const hex = normalizeHexColor(item);
      if (!hex) break;
      validHexes.push(hex);
    }
    if (validHexes.length === commaSeparated.length) {
      return {
        colors: validHexes,
        source: 'raw',
        mapped: mapColorsToPalette(validHexes),
      };
    }
  }

  // 5. Raw dash-separated hex codes
  const slugColors = extractHexFromSlug(trimmed);
  if (slugColors && slugColors.length >= 2) {
    return {
      colors: slugColors,
      source: 'raw',
      mapped: mapColorsToPalette(slugColors),
    };
  }

  return null;
}
