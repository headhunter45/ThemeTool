import {beforeEach, describe, expect, it, vi} from 'vitest';

import {decodePaletteFromUrl} from '../palette/serialization';
import {CustomColorSlot, PaletteColors} from '../palette/types';

import {buildShareableUrl, DEFAULT_BASE_URL, getCurrentOriginBaseUrl, getStoredBaseUrl, LOCAL_DEV_BASE_URL, setStoredBaseUrl, STORAGE_KEY_BASE_URL,} from './shareUrl';

const mockPalette: PaletteColors = {
  primary: '#2563eb',
  secondary: '#475569',
  accent: '#f59e0b',
  background: '#ffffff',
  text: '#0f172a',
};

const mockCustomSlots: CustomColorSlot[] = [
  {id: 'custom-1', name: 'Brand Indigo', hex: '#6366f1', locked: false},
  {id: 'custom-2', name: 'Mint Leaf', hex: '#10b981', locked: true},
];

describe('Shareable URL Generator (TT-018)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  describe('buildShareableUrl', () => {
    it('generates shareable URL with default GitHub Pages base URL', () => {
      const url = buildShareableUrl(DEFAULT_BASE_URL, mockPalette);

      expect(url).toContain('https://headhunter45.github.io/ThemeTool/');
      expect(url).toContain('colors=0f172a-ffffff-2563eb-475569-f59e0b');
      expect(url).not.toContain('custom=');
    });

    it('generates shareable URL with custom base URL and local dev base URL',
       () => {
         const localUrl = buildShareableUrl(LOCAL_DEV_BASE_URL, mockPalette);
         expect(localUrl).toContain('http://localhost:5173/');
         expect(localUrl).toContain(
             'colors=0f172a-ffffff-2563eb-475569-f59e0b');

         const customBase = 'https://mythemes.example.com/editor';
         const customUrl = buildShareableUrl(customBase, mockPalette);
         expect(customUrl).toContain(
             'https://mythemes.example.com/editor?colors=');
       });

    it('handles protocol-less inputs safely', () => {
      const url = buildShareableUrl('localhost:3000', mockPalette);
      expect(url).toContain('localhost:3000');
      expect(url).toContain('colors=');
    });

    it('encodes custom extra color slots in query string', () => {
      const url =
          buildShareableUrl(DEFAULT_BASE_URL, mockPalette, mockCustomSlots);

      expect(url).toContain('custom=');
      expect(url).toContain('Brand+Indigo%3A6366f1');
      expect(url).toContain('Mint+Leaf%3A10b981');
    });

    it('roundtrips: opening generated URL with decodePaletteFromUrl restores exact palette state',
       () => {
         const generatedUrl =
             buildShareableUrl(DEFAULT_BASE_URL, mockPalette, mockCustomSlots);
         const decoded = decodePaletteFromUrl(generatedUrl);

         expect(decoded).not.toBeNull();
         expect(decoded?.colors).toEqual(mockPalette);
         expect(decoded?.custom?.length).toBe(2);
         expect(decoded?.custom?.[0].name).toBe('Brand Indigo');
         expect(decoded?.custom?.[0].hex).toBe('#6366f1');
         expect(decoded?.custom?.[1].name).toBe('Mint Leaf');
         expect(decoded?.custom?.[1].hex).toBe('#10b981');
       });
  });

  describe('getStoredBaseUrl and setStoredBaseUrl', () => {
    it('returns DEFAULT_BASE_URL when nothing is stored', () => {
      expect(getStoredBaseUrl()).toBe(DEFAULT_BASE_URL);
    });

    it('persists and restores custom base URL to/from localStorage', () => {
      const custom = 'https://cool-theme-studio.org/';
      setStoredBaseUrl(custom);

      expect(localStorage.getItem(STORAGE_KEY_BASE_URL)).toBe(custom);
      expect(getStoredBaseUrl()).toBe(custom);

      // Clearing returns default
      setStoredBaseUrl('');
      expect(getStoredBaseUrl()).toBe(DEFAULT_BASE_URL);
    });
  });

  describe('getCurrentOriginBaseUrl', () => {
    it('returns current window origin and pathname in browser environment',
       () => {
         const originBase = getCurrentOriginBaseUrl();
         expect(originBase).toBeDefined();
         expect(typeof originBase).toBe('string');
         expect(originBase.startsWith('http')).toBe(true);
       });
  });
});
