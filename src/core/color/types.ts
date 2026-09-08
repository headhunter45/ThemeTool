export interface RgbColor {
  r: number;   // 0 - 255
  g: number;   // 0 - 255
  b: number;   // 0 - 255
  a?: number;  // 0 - 1
}

export interface HslColor {
  h: number;   // 0 - 360
  s: number;   // 0 - 100
  l: number;   // 0 - 100
  a?: number;  // 0 - 1
}

export interface OklabColor {
  L: number;  // 0 - 1 (perceptual lightness)
  a: number;  // green (-) to red (+)
  b: number;  // blue (-) to yellow (+)
}

export interface OklchColor {
  l: number;   // 0 - 1 (lightness)
  c: number;   // 0 - ~0.4 (chroma)
  h: number;   // 0 - 360 (hue angle)
  a?: number;  // 0 - 1
}

export type ShadeStep =
    |'50'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'|'950';

export const SHADE_STEPS: ShadeStep[] = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950',
];

export interface ShadeInfo {
  step: ShadeStep;
  hex: string;
  rgb: RgbColor;
  hsl: HslColor;
  oklch: OklchColor;
  relativeLuminance: number;
  contrastAgainstWhite: number;
  contrastAgainstBlack: number;
  recommendedTextColor: '#ffffff'|'#000000';
  isBaseColor?: boolean;
}

export type ShadeScale = Record<ShadeStep, ShadeInfo>;
