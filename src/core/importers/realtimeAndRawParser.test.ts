import {describe, expect, it} from 'vitest';

import {parsePaletteJson, parseRawHexDelimited, parseRealtimeColorsUrl,} from './realtimeAndRawParser';
import {parsePaletteUrl} from './urlParser';

describe('parseRealtimeColorsUrl', () => {
  it('parses sample Realtime Colors URL from README', () => {
    const url =
        'https://www.realtimecolors.com/?colors=050315-fbfbfe-2f27ce-dedcff-433bff';
    const result = parseRealtimeColorsUrl(url);
    expect(result).toEqual([
      '#050315',
      '#fbfbfe',
      '#2f27ce',
      '#dedcff',
      '#433bff',
    ]);
  });

  it('handles query parameters like &mode=light and uppercase hexes', () => {
    const url =
        'https://realtimecolors.com/?colors=050315-FBFBFE-2F27CE-DEDCFF-433BFF&mode=light';
    const result = parseRealtimeColorsUrl(url);
    expect(result).toEqual([
      '#050315',
      '#fbfbfe',
      '#2f27ce',
      '#dedcff',
      '#433bff',
    ]);
  });

  it('returns null for non-realtime colors URLs', () => {
    expect(parseRealtimeColorsUrl('https://example.com/?colors=111111-222222'))
        .toBeNull();
    expect(parseRealtimeColorsUrl('')).toBeNull();
  });
});

describe('parsePaletteJson', () => {
  it('parses JSON object with standard semantic role keys', () => {
    const json = JSON.stringify({
      text: '#050315',
      background: '#fbfbfe',
      primary: '#2f27ce',
      secondary: '#dedcff',
      accent: '#433bff',
    });
    const result = parsePaletteJson(json);
    expect(result).not.toBeNull();
    expect(result?.colors.text).toBe('#050315');
    expect(result?.colors.background).toBe('#fbfbfe');
    expect(result?.colors.primary).toBe('#2f27ce');
    expect(result?.colors.secondary).toBe('#dedcff');
    expect(result?.colors.accent).toBe('#433bff');
  });

  it('handles bg and textColor aliases without #', () => {
    const json = `{
      "textColor": "050315",
      "bg": "fbfbfe",
      "primary": "2f27ce"
    }`;
    const result = parsePaletteJson(json);
    expect(result?.colors.text).toBe('#050315');
    expect(result?.colors.background).toBe('#fbfbfe');
    expect(result?.colors.primary).toBe('#2f27ce');
  });

  it('handles nested colors property', () => {
    const json = JSON.stringify({
      name: 'My Palette',
      colors: {
        text: '#111111',
        background: '#ffffff',
        primary: '#3b82f6',
      },
    });
    const result = parsePaletteJson(json);
    expect(result?.colors.primary).toBe('#3b82f6');
  });

  it('parses JSON array of hex strings', () => {
    const json = JSON.stringify(
        ['#050315', '#fbfbfe', '#2f27ce', '#dedcff', '#433bff', '#999999']);
    const result = parsePaletteJson(json);
    expect(result?.colors.text).toBe('#050315');
    expect(result?.colors.accent).toBe('#433bff');
    expect(result?.custom).toHaveLength(1);
    expect(result?.custom?.[0].hex).toBe('#999999');
  });

  it('returns null for invalid JSON or insufficient colors', () => {
    expect(parsePaletteJson('not json')).toBeNull();
    expect(parsePaletteJson(JSON.stringify({onlyOne: '#111'}))).toBeNull();
  });
});

describe('parseRawHexDelimited', () => {
  it('parses space-separated hex codes', () => {
    const text = '050315 fbfbfe 2f27ce dedcff 433bff';
    expect(parseRawHexDelimited(text)).toEqual([
      '#050315',
      '#fbfbfe',
      '#2f27ce',
      '#dedcff',
      '#433bff',
    ]);
  });

  it('parses newline-separated hex codes with hashes', () => {
    const text = '#050315\n#fbfbfe\n#2f27ce';
    expect(parseRawHexDelimited(text)).toEqual([
      '#050315',
      '#fbfbfe',
      '#2f27ce',
    ]);
  });

  it('parses semicolon- and comma-separated hex codes', () => {
    const text = '#050315; #fbfbfe, #2f27ce; #dedcff';
    expect(parseRawHexDelimited(text)).toEqual([
      '#050315',
      '#fbfbfe',
      '#2f27ce',
      '#dedcff',
    ]);
  });

  it('rejects text containing non-hex words', () => {
    expect(parseRawHexDelimited('hello 050315 world')).toBeNull();
  });
});

describe('parsePaletteUrl integration with Realtime Colors and Raw formats', () => {
  it('detects Realtime Colors URL with source realtimecolors', () => {
    const url =
        'https://www.realtimecolors.com/?colors=050315-fbfbfe-2f27ce-dedcff-433bff';
    const result = parsePaletteUrl(url);
    expect(result?.source).toBe('realtimecolors');
    expect(result?.mapped.colors.text).toBe('#050315');
    expect(result?.mapped.colors.background).toBe('#fbfbfe');
  });

  it('detects JSON palette input with source json', () => {
    const json = JSON.stringify({
      text: '#111111',
      background: '#222222',
      primary: '#333333',
    });
    const result = parsePaletteUrl(json);
    expect(result?.source).toBe('json');
    expect(result?.mapped.colors.primary).toBe('#333333');
  });

  it('detects space-separated hex codes with source raw', () => {
    const raw = '#111111 #222222 #333333 #444444 #555555';
    const result = parsePaletteUrl(raw);
    expect(result?.source).toBe('raw');
    expect(result?.mapped.colors.accent).toBe('#555555');
  });
});
