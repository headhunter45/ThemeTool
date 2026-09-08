import {CustomColorSlot, PaletteColors, SEMANTIC_ROLES} from './types';

const CLEAN_HEX_REGEX = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function normalizeHex(raw: string): string|null {
  const trimmed = raw.trim();
  if (!CLEAN_HEX_REGEX.test(trimmed)) return null;
  const noHash = trimmed.replace(/^#/, '');
  if (noHash.length === 3) {
    return `#${noHash[0]}${noHash[0]}${noHash[1]}${noHash[1]}${noHash[2]}${
               noHash[2]}`
        .toLowerCase();
  }
  return `#${noHash.toLowerCase()}`;
}

/**
 * Serializes the 5 semantic colors into a compact URL query string parameter:
 * e.g. "0f172a-f8fafc-4f46e5-64748b-06b6d4"
 */
export function encodeColorsToParam(colors: PaletteColors): string {
  const sanitize = (hex: string) =>
      hex.replace(/^#/, '').toLowerCase().padStart(6, '0');
  return [
    sanitize(colors.text),
    sanitize(colors.background),
    sanitize(colors.primary),
    sanitize(colors.secondary),
    sanitize(colors.accent),
  ].join('-');
}

/**
 * Encodes the entire palette (including optional custom slots) into a URL
 * search query string.
 */
export function encodePaletteToQuery(
    colors: PaletteColors, custom: CustomColorSlot[] = []): string {
  const params = new URLSearchParams();
  params.set('colors', encodeColorsToParam(colors));

  if (custom.length > 0) {
    const encodedCustom =
        custom.map((c) => `${c.id}:${c.name}:${c.hex.replace(/^#/, '')}`)
            .join(',');
    params.set('custom', encodedCustom);
  }

  return params.toString();
}

/**
 * Decodes palette colors from a full URL, search query string, or hash string.
 * Supports:
 * - Query param: ?colors=0f172a-f8fafc-4f46e5-64748b-06b6d4
 * - Hash format: #colors=0f172a-f8fafc-4f46e5-64748b-06b6d4
 * - Direct hash string: #0f172a-f8fafc-4f46e5-64748b-06b6d4
 * - Named parameters:
 * ?text=0f172a&bg=f8fafc&primary=4f46e5&secondary=64748b&accent=06b6d4
 */
export function decodePaletteFromUrl(urlOrQuery: string):
    {colors?: Partial<PaletteColors>; custom?: CustomColorSlot[]}|null {
  if (!urlOrQuery || typeof urlOrQuery !== 'string') return null;

  try {
    let search = '';
    let hash = '';

    if (urlOrQuery.includes('#')) {
      const hashSplit = urlOrQuery.split('#');
      hash = hashSplit[1] || '';
      const beforeHash = hashSplit[0];
      if (beforeHash.includes('?')) {
        search = beforeHash.split('?')[1] || '';
      }
    } else if (urlOrQuery.includes('?')) {
      search = urlOrQuery.split('?')[1] || '';
    } else {
      search = urlOrQuery;
    }

    const searchParams = new URLSearchParams(search);
    const hashParams = new URLSearchParams(hash);

    // 1. Check colors param from search or hash
    const colorsParam = searchParams.get('colors') || hashParams.get('colors');
    if (colorsParam) {
      const hexParts = colorsParam.split('-');
      if (hexParts.length >= 5) {
        const text = normalizeHex(hexParts[0]);
        const background = normalizeHex(hexParts[1]);
        const primary = normalizeHex(hexParts[2]);
        const secondary = normalizeHex(hexParts[3]);
        const accent = normalizeHex(hexParts[4]);

        if (text && background && primary && secondary && accent) {
          const result: {colors: PaletteColors; custom?: CustomColorSlot[]} = {
            colors: {text, background, primary, secondary, accent},
          };

          // Check custom
          const customParam =
              searchParams.get('custom') || hashParams.get('custom');
          if (customParam) {
            result.custom = parseCustomParam(customParam);
          }
          return result;
        }
      }
    }

    // 2. Check direct dash-separated hex in hash (e.g.
    // #0f172a-f8fafc-4f46e5-64748b-06b6d4)
    if (hash && hash.includes('-') && !hash.includes('=')) {
      const hexParts = hash.split('-');
      if (hexParts.length >= 5) {
        const text = normalizeHex(hexParts[0]);
        const background = normalizeHex(hexParts[1]);
        const primary = normalizeHex(hexParts[2]);
        const secondary = normalizeHex(hexParts[3]);
        const accent = normalizeHex(hexParts[4]);

        if (text && background && primary && secondary && accent) {
          return {colors: {text, background, primary, secondary, accent}};
        }
      }
    }

    // 3. Check individual named query params
    const partialColors: Partial<PaletteColors> = {};
    for (const role of SEMANTIC_ROLES) {
      const val = searchParams.get(role) ||
          searchParams.get(role === 'background' ? 'bg' : role);
      if (val) {
        const normalized = normalizeHex(val);
        if (normalized) {
          partialColors[role] = normalized;
        }
      }
    }

    if (Object.keys(partialColors).length > 0) {
      return {colors: partialColors};
    }
  } catch {
    return null;
  }

  return null;
}

function parseCustomParam(param: string): CustomColorSlot[] {
  const slots: CustomColorSlot[] = [];
  const entries = param.split(',');
  for (const entry of entries) {
    const parts = entry.split(':');
    if (parts.length >= 3) {
      const id = decodeURIComponent(parts[0]);
      const name = decodeURIComponent(parts[1]);
      const hex = normalizeHex(parts[2]);
      if (hex) {
        slots.push({id, name, hex});
      }
    }
  }
  return slots;
}
