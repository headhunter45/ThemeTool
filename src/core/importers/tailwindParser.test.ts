import {describe, expect, it} from 'vitest';

import {parseTailwind3Snippet, parseTailwind4CssSnippet, parseTailwindImport, parseUIColorsUrl,} from './tailwindParser';

const TAILWIND_3_SAMPLE = `'lucky': {
  '50': '#faf9ec',
  '100': '#f4f1ce',
  '200': '#eae3a1',
  '300': '#decf6b',
  '400': '#d2bc40',
  '500': '#b49c2c',
  '600': '#a28425',
  '700': '#806420',
  '800': '#6a5121',
  '900': '#5b4521',
  '950': '#34250f',
}`;

const TAILWIND_4_SAMPLE = `--color-lucky-50: #faf9ec;
--color-lucky-100: #f4f1ce;
--color-lucky-200: #eae3a1;
--color-lucky-300: #decf6b;
--color-lucky-400: #d2bc40;
--color-lucky-500: #b49c2c;
--color-lucky-600: #a28425;
--color-lucky-700: #806420;
--color-lucky-800: #6a5121;
--color-lucky-900: #5b4521;
--color-lucky-950: #34250f;`;

describe('parseTailwind3Snippet', () => {
  it('parses Tailwind 3 sample from README.md', () => {
    const result = parseTailwind3Snippet(TAILWIND_3_SAMPLE);
    expect(result).not.toBeNull();
    expect(result?.name).toBe('lucky');
    expect(result?.baseHex).toBe('#b49c2c');
    expect(result?.format).toBe('tailwind3');
    expect(result?.shades?.['50']).toBe('#faf9ec');
    expect(result?.shades?.['950']).toBe('#34250f');
  });

  it('handles double quotes and unquoted keys', () => {
    const snippet = `brand: {
      50: "#f0fdf4",
      500: "#22c55e",
      900: "#14532d"
    }`;
    const result = parseTailwind3Snippet(snippet);
    expect(result?.name).toBe('brand');
    expect(result?.baseHex).toBe('#22c55e');
  });

  it('falls back to available step if 500 is missing', () => {
    const snippet = `{
      '400': '#38bdf8',
      '600': '#0284c7'
    }`;
    const result = parseTailwind3Snippet(snippet);
    expect(result?.baseHex).toBe('#38bdf8');
  });

  it('returns null for invalid snippets', () => {
    expect(parseTailwind3Snippet('const x = 123;')).toBeNull();
    expect(parseTailwind3Snippet('')).toBeNull();
  });
});

describe('parseTailwind4CssSnippet', () => {
  it('parses Tailwind 4 sample from README.md', () => {
    const result = parseTailwind4CssSnippet(TAILWIND_4_SAMPLE);
    expect(result).not.toBeNull();
    expect(result?.name).toBe('lucky');
    expect(result?.baseHex).toBe('#b49c2c');
    expect(result?.format).toBe('tailwind4');
    expect(result?.shades?.['500']).toBe('#b49c2c');
    expect(result?.shades?.['100']).toBe('#f4f1ce');
  });

  it('parses CSS variables wrapped in @theme block', () => {
    const block = `@theme {
      --color-primary-50: #eff6ff;
      --color-primary-500: #3b82f6;
      --color-primary-950: #172554;
    }`;
    const result = parseTailwind4CssSnippet(block);
    expect(result?.name).toBe('primary');
    expect(result?.baseHex).toBe('#3b82f6');
  });

  it('returns null for non-tailwind CSS', () => {
    expect(parseTailwind4CssSnippet('.card { color: red; }')).toBeNull();
  });
});

describe('parseUIColorsUrl', () => {
  it('parses UIColors URL from README.md', () => {
    const url = 'https://uicolors.app/generate/b49c2c';
    const result = parseUIColorsUrl(url);
    expect(result).not.toBeNull();
    expect(result?.baseHex).toBe('#b49c2c');
    expect(result?.format).toBe('uicolors-url');
  });

  it('extracts name param if present', () => {
    const url = 'https://uicolors.app/generate/b49c2c?name=lucky';
    const result = parseUIColorsUrl(url);
    expect(result?.name).toBe('lucky');
    expect(result?.baseHex).toBe('#b49c2c');
  });

  it('handles short URL and trailing slash', () => {
    const url = 'uicolors.app/generate/3b82f6/';
    const result = parseUIColorsUrl(url);
    expect(result?.baseHex).toBe('#3b82f6');
  });

  it('returns null for non-uicolors URLs', () => {
    expect(parseUIColorsUrl('https://coolors.co/6f2dbd')).toBeNull();
  });
});

describe('parseTailwindImport', () => {
  it('auto-detects Tailwind 3 JS object', () => {
    const res = parseTailwindImport(TAILWIND_3_SAMPLE);
    expect(res?.format).toBe('tailwind3');
    expect(res?.baseHex).toBe('#b49c2c');
  });

  it('auto-detects Tailwind 4 CSS block', () => {
    const res = parseTailwindImport(TAILWIND_4_SAMPLE);
    expect(res?.format).toBe('tailwind4');
    expect(res?.baseHex).toBe('#b49c2c');
  });

  it('auto-detects UIColors URL', () => {
    const res = parseTailwindImport('https://uicolors.app/generate/b49c2c');
    expect(res?.format).toBe('uicolors-url');
    expect(res?.baseHex).toBe('#b49c2c');
  });

  it('returns null for unrecognized text', () => {
    expect(parseTailwindImport('random text here')).toBeNull();
  });
});
