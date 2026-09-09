import {encodeColorsToParam} from '../palette/serialization';
import {CustomColorSlot, PaletteColors} from '../palette/types';

export const STORAGE_KEY_BASE_URL = 'themetool_share_base_url';
export const DEFAULT_BASE_URL = 'https://headhunter45.github.io/ThemeTool/';
export const LOCAL_DEV_BASE_URL = 'http://localhost:5173/';

/**
 * Returns the current browser origin + path, or DEFAULT_BASE_URL if SSR /
 * undefined.
 */
export function getCurrentOriginBaseUrl(): string {
  if (typeof window !== 'undefined' && window.location) {
    try {
      const path = window.location.pathname || '/';
      return `${window.location.origin}${path}`;
    } catch {
      return DEFAULT_BASE_URL;
    }
  }
  return DEFAULT_BASE_URL;
}

/**
 * Reads user's stored preferred base URL from localStorage, defaulting to
 * DEFAULT_BASE_URL.
 */
export function getStoredBaseUrl(): string {
  if (typeof window === 'undefined' || !window.localStorage) {
    return DEFAULT_BASE_URL;
  }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY_BASE_URL);
    if (stored && stored.trim()) {
      return stored.trim();
    }
  } catch {
    // Fallback if localStorage is inaccessible
  }
  return DEFAULT_BASE_URL;
}

/**
 * Persists user's preferred base URL into localStorage.
 */
export function setStoredBaseUrl(url: string): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const trimmed = url.trim();
    if (trimmed) {
      window.localStorage.setItem(STORAGE_KEY_BASE_URL, trimmed);
    } else {
      window.localStorage.removeItem(STORAGE_KEY_BASE_URL);
    }
  } catch {
    // Ignore storage quota or security errors
  }
}

/**
 * Encodes the active palette and custom slots into a complete, shareable URL
 * based on the provided Base URL.
 */
export function buildShareableUrl(
    baseUrl: string, colors: PaletteColors,
    custom: CustomColorSlot[] = []): string {
  const trimmed = baseUrl.trim();
  let urlObj: URL;

  try {
    urlObj = new URL(trimmed || DEFAULT_BASE_URL);
  } catch {
    // Handle protocol-less inputs like 'localhost:5173' or 'my-site.com'
    try {
      const hasHttp = /^https?:\/\//i.test(trimmed);
      urlObj = new URL(hasHttp ? trimmed : `https://${trimmed}`);
    } catch {
      urlObj = new URL(DEFAULT_BASE_URL);
    }
  }

  // Set colors parameter in format: text-background-primary-secondary-accent
  urlObj.searchParams.set('colors', encodeColorsToParam(colors));

  // Set optional custom slots parameter: id:name:hex,id:name:hex
  if (custom.length > 0) {
    const encodedCustom = custom
                              .map(
                                  (c) => `${c.id}:${c.name}:${
                                      c.hex.replace(/^#/, '').toLowerCase()}`)
                              .join(',');
    urlObj.searchParams.set('custom', encodedCustom);
  } else {
    urlObj.searchParams.delete('custom');
  }

  return urlObj.toString();
}
