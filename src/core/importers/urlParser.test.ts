import {describe, expect, it} from 'vitest';

import {extractHexFromSlug, mapColorsToPalette, normalizeHexColor, parseColorKitUrl, parseCoolorsUrl, parsePaletteUrl,} from './urlParser';

describe('normalizeHexColor', () => {
  it('normalizes 6-digit hex without #', () => {
    expect(normalizeHexColor('6f2dbd')).toBe('#6f2dbd');
  });

  it('normalizes 6-digit hex with # and uppercase', () => {
    expect(normalizeHexColor('#A663CC')).toBe('#a663cc');
  });

  it('normalizes 3-digit hex expanding to 6 digits', () => {
    expect(normalizeHexColor('abc')).toBe('#aabbcc');
    expect(normalizeHexColor('#FFF')).toBe('#ffffff');
  });

  it('returns null for invalid strings', () => {
    expect(normalizeHexColor('xyz123')).toBeNull();
    expect(normalizeHexColor('#12')).toBeNull();
    expect(normalizeHexColor('#1234567')).toBeNull();
    expect(normalizeHexColor('')).toBeNull();
  });
});

describe('extractHexFromSlug', () => {
  it('extracts and normalizes dash-separated hex codes', () => {
    const slug = '6f2dbd-a663cc-b298dc-b8d0eb-b9faf8';
    expect(extractHexFromSlug(slug)).toEqual([
      '#6f2dbd',
      '#a663cc',
      '#b298dc',
      '#b8d0eb',
      '#b9faf8',
    ]);
  });

  it('strips trailing slashes and query params', () => {
    const slug = 'eebea0-ff8d83-ffa89f-ffc2bc-aaae80/?mode=dark';
    expect(extractHexFromSlug(slug)).toEqual([
      '#eebea0',
      '#ff8d83',
      '#ffa89f',
      '#ffc2bc',
      '#aaae80',
    ]);
  });

  it('returns null if any segment is invalid', () => {
    expect(extractHexFromSlug('6f2dbd-nothex-b298dc')).toBeNull();
  });
});

describe('parseCoolorsUrl', () => {
  it('parses sample Coolors URL from README.md', () => {
    const url = 'https://coolors.co/palette/6f2dbd-a663cc-b298dc-b8d0eb-b9faf8';
    const result = parseCoolorsUrl(url);
    expect(result).toEqual([
      '#6f2dbd',
      '#a663cc',
      '#b298dc',
      '#b8d0eb',
      '#b9faf8',
    ]);
  });

  it('parses short Coolors URL without /palette/', () => {
    const url = 'https://coolors.co/6f2dbd-a663cc-b298dc-b8d0eb-b9faf8';
    expect(parseCoolorsUrl(url)).toEqual([
      '#6f2dbd',
      '#a663cc',
      '#b298dc',
      '#b8d0eb',
      '#b9faf8',
    ]);
  });

  it('handles uppercase, http, www, and query params', () => {
    const url =
        'http://www.coolors.co/palette/6F2DBD-A663CC-B298DC-B8D0EB-B9FAF8?test=1';
    expect(parseCoolorsUrl(url)).toEqual([
      '#6f2dbd',
      '#a663cc',
      '#b298dc',
      '#b8d0eb',
      '#b9faf8',
    ]);
  });

  it('returns null for non-coolors URLs or malformed URLs', () => {
    expect(parseCoolorsUrl('https://example.com/palette/6f2dbd')).toBeNull();
    expect(parseCoolorsUrl('https://coolors.co/blog/post-1')).toBeNull();
    expect(parseCoolorsUrl('')).toBeNull();
  });
});

describe('parseColorKitUrl', () => {
  it('parses sample ColorKit URL from README.md with trailing slash', () => {
    const url =
        'https://colorkit.co/palette/eebea0-ff8d83-ffa89f-ffc2bc-aaae80/';
    const result = parseColorKitUrl(url);
    expect(result).toEqual([
      '#eebea0',
      '#ff8d83',
      '#ffa89f',
      '#ffc2bc',
      '#aaae80',
    ]);
  });

  it('parses ColorKit URL without trailing slash', () => {
    const url =
        'https://colorkit.co/palette/eebea0-ff8d83-ffa89f-ffc2bc-aaae80';
    expect(parseColorKitUrl(url)).toEqual([
      '#eebea0',
      '#ff8d83',
      '#ffa89f',
      '#ffc2bc',
      '#aaae80',
    ]);
  });

  it('returns null for invalid URLs', () => {
    expect(parseColorKitUrl('https://colorkit.co/tools/contrast-checker'))
        .toBeNull();
  });
});

describe('mapColorsToPalette', () => {
  it('maps 5 colors to semantic roles in order', () => {
    const hexes = ['#111111', '#222222', '#333333', '#444444', '#555555'];
    const {colors, custom} = mapColorsToPalette(hexes);
    expect(colors).toEqual({
      text: '#111111',
      background: '#222222',
      primary: '#333333',
      secondary: '#444444',
      accent: '#555555',
    });
    expect(custom).toBeUndefined();
  });

  it('maps extra colors (>5) to custom color slots', () => {
    const hexes = [
      '#111111', '#222222', '#333333', '#444444', '#555555', '#666666',
      '#777777'
    ];
    const {colors, custom} = mapColorsToPalette(hexes);
    expect(colors.primary).toBe('#333333');
    expect(custom).toHaveLength(2);
    expect(custom?.[0]).toEqual({
      id: 'custom-import-1',
      name: 'Custom 6',
      hex: '#666666',
    });
    expect(custom?.[1]).toEqual({
      id: 'custom-import-2',
      name: 'Custom 7',
      hex: '#777777',
    });
  });

  it('gracefully falls back for fewer than 5 colors', () => {
    const hexes = ['#111111', '#222222'];
    const {colors} = mapColorsToPalette(hexes);
    expect(colors.text).toBe('#111111');
    expect(colors.background).toBe('#222222');
    expect(colors.primary).toBe('#3b82f6');  // default primary
  });
});

describe('parsePaletteUrl', () => {
  it('identifies Coolors source', () => {
    const res = parsePaletteUrl(
        'https://coolors.co/palette/6f2dbd-a663cc-b298dc-b8d0eb-b9faf8');
    expect(res).not.toBeNull();
    expect(res?.source).toBe('coolors');
    expect(res?.mapped.colors.text).toBe('#6f2dbd');
  });

  it('identifies ColorKit source', () => {
    const res = parsePaletteUrl(
        'https://colorkit.co/palette/eebea0-ff8d83-ffa89f-ffc2bc-aaae80/');
    expect(res).not.toBeNull();
    expect(res?.source).toBe('colorkit');
    expect(res?.mapped.colors.text).toBe('#eebea0');
    expect(res?.mapped.colors.accent).toBe('#aaae80');
  });

  it('identifies ThemeTool ?colors= parameter source', () => {
    const res = parsePaletteUrl(
        'https://headhunter45.github.io/ThemeTool/?colors=0f172a-f8fafc-4f46e5-64748b-06b6d4');
    expect(res).not.toBeNull();
    expect(res?.source).toBe('themetool');
    expect(res?.mapped.colors.primary).toBe('#4f46e5');
  });

  it('identifies raw dash-separated hex codes', () => {
    const res = parsePaletteUrl('6f2dbd-a663cc-b298dc-b8d0eb-b9faf8');
    expect(res).not.toBeNull();
    expect(res?.source).toBe('raw');
    expect(res?.colors).toHaveLength(5);
  });

  it('identifies raw comma-separated hex codes', () => {
    const res = parsePaletteUrl('#6f2dbd, #a663cc, #b298dc, #b8d0eb, #b9faf8');
    expect(res).not.toBeNull();
    expect(res?.source).toBe('raw');
    expect(res?.colors).toHaveLength(5);
  });

  it('returns null for unparseable strings', () => {
    expect(parsePaletteUrl('hello world')).toBeNull();
  });
});
