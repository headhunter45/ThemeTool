import {describe, expect, it} from 'vitest';

import {decodePaletteFromUrl, encodeColorsToParam, encodePaletteToQuery} from './serialization';
import {PaletteColors} from './types';

describe('Palette URL Serialization', () => {
  const sampleColors: PaletteColors = {
    text: '#0f172a',
    background: '#f8fafc',
    primary: '#4f46e5',
    secondary: '#64748b',
    accent: '#06b6d4',
  };

  it('encodes colors into a clean dash-separated parameter', () => {
    const param = encodeColorsToParam(sampleColors);
    expect(param).toBe('0f172a-f8fafc-4f46e5-64748b-06b6d4');
  });

  it('encodes full palette into search query string', () => {
    const query = encodePaletteToQuery(sampleColors);
    expect(query).toBe('colors=0f172a-f8fafc-4f46e5-64748b-06b6d4');
  });

  it('encodes custom slots if provided', () => {
    const custom = [{id: 'brand-muted', name: 'Brand Muted', hex: '#e0e7ff'}];
    const query = encodePaletteToQuery(sampleColors, custom);
    expect(query).toContain('colors=0f172a-f8fafc-4f46e5-64748b-06b6d4');
    expect(query).toContain('custom=brand-muted%3ABrand+Muted%3Ae0e7ff');
  });

  it('decodes colors from query param ?colors=...', () => {
    const url =
        'https://headhunter45.github.io/ThemeTool/?colors=0f172a-f8fafc-4f46e5-64748b-06b6d4';
    const decoded = decodePaletteFromUrl(url);

    expect(decoded).not.toBeNull();
    expect(decoded?.colors).toEqual(sampleColors);
  });

  it('decodes colors from hash string #colors=...', () => {
    const url =
        'https://headhunter45.github.io/ThemeTool/#colors=0f172a-f8fafc-4f46e5-64748b-06b6d4';
    const decoded = decodePaletteFromUrl(url);

    expect(decoded).not.toBeNull();
    expect(decoded?.colors).toEqual(sampleColors);
  });

  it('decodes colors from direct hash #0f172a-f8fafc-4f46e5-64748b-06b6d4', () => {
    const url =
        'https://headhunter45.github.io/ThemeTool/#0f172a-f8fafc-4f46e5-64748b-06b6d4';
    const decoded = decodePaletteFromUrl(url);

    expect(decoded).not.toBeNull();
    expect(decoded?.colors).toEqual(sampleColors);
  });

  it('decodes individual named query parameters', () => {
    const url =
        'https://headhunter45.github.io/ThemeTool/?primary=2563eb&bg=ffffff';
    const decoded = decodePaletteFromUrl(url);

    expect(decoded).not.toBeNull();
    expect(decoded?.colors?.primary).toBe('#2563eb');
    expect(decoded?.colors?.background).toBe('#ffffff');
  });

  it('handles 3-digit shorthand hex gracefully', () => {
    const url = '?colors=000-fff-38f-678-f90';
    const decoded = decodePaletteFromUrl(url);

    expect(decoded).not.toBeNull();
    expect(decoded?.colors?.text).toBe('#000000');
    expect(decoded?.colors?.background).toBe('#ffffff');
    expect(decoded?.colors?.primary).toBe('#3388ff');
  });

  it('returns null on invalid or malformed strings', () => {
    expect(decodePaletteFromUrl('')).toBeNull();
    expect(decodePaletteFromUrl('not-valid')).toBeNull();
    expect(decodePaletteFromUrl('?colors=invalid-hex-codes-here')).toBeNull();
  });
});
