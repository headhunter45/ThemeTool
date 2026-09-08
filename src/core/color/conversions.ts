import {HslColor, OklabColor, OklchColor, RgbColor} from './types';

/**
 * Normalizes and parses a hex string into an RGB object.
 * Supports: #RGB, #RGBA, #RRGGBB, #RRGGBBAA (with or without #).
 */
export function hexToRgb(hex: string): RgbColor {
  const cleanHex = hex.trim().replace(/^#/, '');

  let r = 0;
  let g = 0;
  let b = 0;
  let a = 1;

  if (cleanHex.length === 3 || cleanHex.length === 4) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
    if (cleanHex.length === 4) {
      a = Math.round((parseInt(cleanHex[3] + cleanHex[3], 16) / 255) * 100) /
          100;
    }
  } else if (cleanHex.length === 6 || cleanHex.length === 8) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
    if (cleanHex.length === 8) {
      a = Math.round((parseInt(cleanHex.substring(6, 8), 16) / 255) * 100) /
          100;
    }
  } else {
    throw new Error(`Invalid hex color: "${hex}"`);
  }

  if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) {
    throw new Error(`Invalid hex color digits: "${hex}"`);
  }

  return {r, g, b, a};
}

/**
 * Converts RGB components to a standard 6-character hex code (e.g. #3b82f6).
 */
export function rgbToHex(rgb: RgbColor): string {
  const clamp = (val: number) => Math.min(255, Math.max(0, Math.round(val)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, '0');

  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Converts sRGB [0..255] to HSL [0..360, 0..100, 0..100].
 */
export function rgbToHsl(rgb: RgbColor): HslColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case r:
        h = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
    }
    h *= 60;
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
    ...(rgb.a !== undefined && {a: rgb.a}),
  };
}

/**
 * Converts HSL [0..360, 0..100, 0..100] to sRGB [0..255].
 */
export function hslToRgb(hsl: HslColor): RgbColor {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  let r: number;
  let g: number;
  let b: number;

  if (s === 0) {
    r = g = b = l;  // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      let tNorm = t;
      if (tNorm < 0) tNorm += 1;
      if (tNorm > 1) tNorm -= 1;
      if (tNorm < 1 / 6) return p + (q - p) * 6 * tNorm;
      if (tNorm < 1 / 2) return q;
      if (tNorm < 2 / 3) return p + (q - p) * (2 / 3 - tNorm) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
    ...(hsl.a !== undefined && {a: hsl.a}),
  };
}

/**
 * Converts sRGB [0..255] to OKLab.
 */
export function rgbToOklab(rgb: RgbColor): OklabColor {
  // sRGB gamma linearization
  const linearize = (val: number) => {
    const v = val / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };

  const r = linearize(rgb.r);
  const g = linearize(rgb.g);
  const b = linearize(rgb.b);

  // Linear sRGB to cone responses (LMS)
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  // Non-linear step
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  // LMS to OKLab
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const b_val = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  return {L, a, b: b_val};
}

/**
 * Converts OKLab to sRGB [0..255] (unclamped linear transformation).
 */
export function oklabToRgbRaw(oklab: OklabColor):
    {r: number; g: number; b: number} {
  const {L, a, b} = oklab;

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const rLin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bLin = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  // sRGB gamma companding
  const compand = (v: number) => {
    return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  };

  return {
    r: compand(rLin) * 255,
    g: compand(gLin) * 255,
    b: compand(bLin) * 255,
  };
}

/**
 * Converts OKLab to OKLCH.
 */
export function oklabToOklch(oklab: OklabColor): OklchColor {
  const {L, a, b} = oklab;
  const c = Math.sqrt(a * a + b * b);
  let h = (Math.atan2(b, a) * (180 / Math.PI) + 360) % 360;

  // If chroma is nearly zero, hue is indeterminate (achromatic)
  if (c < 0.0001) {
    h = 0;
  }

  return {l: L, c, h};
}

/**
 * Converts OKLCH to OKLab.
 */
export function oklchToOklab(oklch: OklchColor): OklabColor {
  const {l, c, h} = oklch;
  const rad = (h * Math.PI) / 180;
  const a = c * Math.cos(rad);
  const b = c * Math.sin(rad);

  return {L: l, a, b};
}

/**
 * Converts RGB directly to OKLCH.
 */
export function rgbToOklch(rgb: RgbColor): OklchColor {
  const oklab = rgbToOklab(rgb);
  const oklch = oklabToOklch(oklab);
  if (rgb.a !== undefined) {
    oklch.a = rgb.a;
  }
  return oklch;
}

/**
 * Converts HEX to OKLCH.
 */
export function hexToOklch(hex: string): OklchColor {
  return rgbToOklch(hexToRgb(hex));
}

/**
 * Checks whether an RGB coordinate is inside the sRGB gamut [0, 255].
 */
export function isInSrgbGamut(r: number, g: number, b: number): boolean {
  const eps = 0.001;
  return r >= -eps && r <= 255 + eps && g >= -eps && g <= 255 + eps &&
      b >= -eps && b <= 255 + eps;
}

/**
 * Converts OKLCH to sRGB, employing CSS Color 4 standard binary-search
 * chroma reduction if out-of-gamut to strictly preserve hue and lightness.
 */
export function oklchToRgb(oklch: OklchColor): RgbColor {
  // Edge case: lightness limits
  if (oklch.l <= 0) return {r: 0, g: 0, b: 0, a: oklch.a};
  if (oklch.l >= 1) return {r: 255, g: 255, b: 255, a: oklch.a};

  const rawOklab = oklchToOklab(oklch);
  const rawRgb = oklabToRgbRaw(rawOklab);

  if (isInSrgbGamut(rawRgb.r, rawRgb.g, rawRgb.b)) {
    return {
      r: Math.round(Math.min(255, Math.max(0, rawRgb.r))),
      g: Math.round(Math.min(255, Math.max(0, rawRgb.g))),
      b: Math.round(Math.min(255, Math.max(0, rawRgb.b))),
      ...(oklch.a !== undefined && {a: oklch.a}),
    };
  }

  // Binary search chroma reduction to find the sRGB boundary
  let lowC = 0;
  let highC = oklch.c;
  let bestR = 0;
  let bestG = 0;
  let bestB = 0;

  for (let i = 0; i < 20; i++) {
    const midC = (lowC + highC) / 2;
    const testOklab = oklchToOklab({l: oklch.l, c: midC, h: oklch.h});
    const rgb = oklabToRgbRaw(testOklab);

    if (isInSrgbGamut(rgb.r, rgb.g, rgb.b)) {
      bestR = rgb.r;
      bestG = rgb.g;
      bestB = rgb.b;
      lowC = midC;
    } else {
      highC = midC;
    }
  }

  return {
    r: Math.round(Math.min(255, Math.max(0, bestR))),
    g: Math.round(Math.min(255, Math.max(0, bestG))),
    b: Math.round(Math.min(255, Math.max(0, bestB))),
    ...(oklch.a !== undefined && {a: oklch.a}),
  };
}

/**
 * Converts OKLCH directly to 6-digit hex.
 */
export function oklchToHex(oklch: OklchColor): string {
  return rgbToHex(oklchToRgb(oklch));
}
