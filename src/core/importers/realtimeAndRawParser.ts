import {CustomColorSlot, PaletteColors, ROLE_METADATA} from '../palette/types';

import {extractHexFromSlug, normalizeHexColor} from './urlParser';

/**
 * Parses Realtime Colors URLs, e.g.:
 * - https://www.realtimecolors.com/?colors=050315-fbfbfe-2f27ce-dedcff-433bff
 * -
 * https://realtimecolors.com/?colors=050315-fbfbfe-2f27ce-dedcff-433bff&mode=light
 */
export function parseRealtimeColorsUrl(url: string): string[]|null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  if (!/realtimecolors\.com/i.test(trimmed)) return null;

  try {
    const parsedUrl =
        new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    const colorsParam = parsedUrl.searchParams.get('colors');
    if (colorsParam) {
      return extractHexFromSlug(colorsParam);
    }
  } catch {
    // Regex fallback
    const match = trimmed.match(/[?&]colors=([a-fA-F0-9\-#]+)/i);
    if (match && match[1]) {
      return extractHexFromSlug(match[1]);
    }
  }

  return null;
}

/**
 * Parses raw JSON string representing a theme palette.
 * Supports:
 * - Object with role names: { "text": "#...", "background": "#...", "primary":
 * "#...", "secondary": "#...", "accent": "#..." }
 * - Object with "bg" shorthand for background: { "bg": "#..." }
 * - Nested object: { "colors": { "text": "...", ... } }
 * - Array of hex strings: ["#111111", "#222222", "#333333", "#444444",
 * "#555555"]
 */
export function parsePaletteJson(input: string):
    {colors: PaletteColors; custom?: CustomColorSlot[];}|null {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();

  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
    return null;
  }

  try {
    const data = JSON.parse(trimmed);

    // Case 1: Array of hex strings
    if (Array.isArray(data)) {
      const validHexes: string[] = [];
      for (const item of data) {
        if (typeof item === 'string') {
          const hex = normalizeHexColor(item);
          if (hex) validHexes.push(hex);
        }
      }

      if (validHexes.length >= 2) {
        const colors: PaletteColors = {
          text: validHexes[0] || ROLE_METADATA.text.defaultHex,
          background: validHexes[1] || ROLE_METADATA.background.defaultHex,
          primary: validHexes[2] || ROLE_METADATA.primary.defaultHex,
          secondary: validHexes[3] || ROLE_METADATA.secondary.defaultHex,
          accent: validHexes[4] || ROLE_METADATA.accent.defaultHex,
        };

        let custom: CustomColorSlot[]|undefined;
        if (validHexes.length > 5) {
          custom = validHexes.slice(5).map((hex, index) => ({
                                             id: `custom-json-${index + 1}`,
                                             name: `Custom ${index + 6}`,
                                             hex,
                                           }));
        }

        return {colors, custom};
      }
      return null;
    }

    // Case 2: Object with roles (or nested in data.colors)
    if (typeof data === 'object' && data !== null) {
      const targetObj =
          (data.colors && typeof data.colors === 'object') ? data.colors : data;

      const rawText =
          targetObj.text || targetObj.textColor || targetObj.foreground;
      const rawBg = targetObj.background || targetObj.bg || targetObj.surface;
      const rawPrimary = targetObj.primary || targetObj.brand || targetObj.main;
      const rawSecondary = targetObj.secondary || targetObj.subtle;
      const rawAccent = targetObj.accent || targetObj.highlight;

      const text = rawText ? normalizeHexColor(String(rawText)) : null;
      const background = rawBg ? normalizeHexColor(String(rawBg)) : null;
      const primary = rawPrimary ? normalizeHexColor(String(rawPrimary)) : null;
      const secondary =
          rawSecondary ? normalizeHexColor(String(rawSecondary)) : null;
      const accent = rawAccent ? normalizeHexColor(String(rawAccent)) : null;

      // At least 2 semantic roles must be successfully parsed
      const parsedCount =
          [text, background, primary, secondary, accent].filter(Boolean).length;
      if (parsedCount < 2) return null;

      const colors: PaletteColors = {
        text: text || ROLE_METADATA.text.defaultHex,
        background: background || ROLE_METADATA.background.defaultHex,
        primary: primary || ROLE_METADATA.primary.defaultHex,
        secondary: secondary || ROLE_METADATA.secondary.defaultHex,
        accent: accent || ROLE_METADATA.accent.defaultHex,
      };

      // Check for custom slots if present
      let custom: CustomColorSlot[]|undefined;
      if (Array.isArray(data.custom)) {
        custom = data.custom
                     .map((slot: unknown, i: number) => {
                       if (typeof slot === 'object' && slot !== null) {
                         const s = slot as Record<string, unknown>;
                         const hex =
                             s.hex ? normalizeHexColor(String(s.hex)) : null;
                         if (hex) {
                           return {
                             id: String(s.id || `custom-json-${i + 1}`),
                             name: String(s.name || `Custom ${i + 6}`),
                             hex,
                           };
                         }
                       }
                       return null;
                     })
                     .filter(Boolean) as CustomColorSlot[];
      }

      return {colors, custom};
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Parses unstructured raw text where hex codes are separated by whitespace,
 * commas, semicolons, or newlines. e.g.
 * - "050315 fbfbfe 2f27ce dedcff 433bff"
 * - "#050315, #fbfbfe, #2f27ce, #dedcff, #433bff"
 * - "#050315\n#fbfbfe\n#2f27ce"
 */
export function parseRawHexDelimited(input: string): string[]|null {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();

  // Avoid parsing single words or JSON brackets
  if (trimmed.startsWith('{') || trimmed.startsWith('[') ||
      trimmed.startsWith('<')) {
    return null;
  }

  // Split by whitespace, comma, semicolon, or pipe
  const tokens = trimmed.split(/[\s,;|]+/).filter((t) => t.length > 0);
  if (tokens.length < 2) return null;

  const validHexes: string[] = [];
  for (const token of tokens) {
    const hex = normalizeHexColor(token);
    if (!hex) {
      // If any non-delimiter token is not a hex code, reject this format
      return null;
    }
    validHexes.push(hex);
  }

  return validHexes.length >= 2 ? validHexes : null;
}
