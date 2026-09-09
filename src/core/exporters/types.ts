import {HslColor, OklchColor, RgbColor, ShadeStep} from '../color/types';
import {SemanticRole} from '../palette/types';

export interface ThemeJsonMetadata {
  generator: string;
  exportedAt: string;
  name: string;
  description?: string;
  [key: string]: unknown;
}

export interface RgbColorExport {
  r: number;
  g: number;
  b: number;
}

export interface HslColorExport {
  h: number;
  s: number;
  l: number;
}

export interface OklchColorExport {
  l: number;
  c: number;
  h: number;
}

export interface ShadeExportItem {
  step: ShadeStep;
  hex: string;
  rgb: RgbColor;
  hsl: HslColor;
  oklch: OklchColor;
  relativeLuminance: number;
  contrastAgainstWhite: number;
  contrastAgainstBlack: number;
  recommendedTextColor: string;
}

export type ShadeExportScale = Record<ShadeStep, ShadeExportItem>;

export interface ColorExportDefinition {
  role: SemanticRole;
  hex: string;
  rgb: RgbColor;
  hsl: HslColor;
  oklch: OklchColor;
  relativeLuminance: number;
  contrastAgainstWhite: number;
  contrastAgainstBlack: number;
  recommendedTextColor: string;
  shades: ShadeExportScale;
}

export interface CustomColorSlotExport {
  id: string;
  label: string;
  hex: string;
  rgb: RgbColor;
  hsl: HslColor;
  oklch: OklchColor;
  relativeLuminance: number;
  contrastAgainstWhite: number;
  contrastAgainstBlack: number;
  recommendedTextColor: string;
  shades: ShadeExportScale;
}

export interface ContrastRatingExport {
  foreground: string;
  background: string;
  ratio: number;
  normalTextAA: boolean;
  normalTextAAA: boolean;
  largeTextAA: boolean;
  largeTextAAA: boolean;
}

export interface ContrastMatrixExport {
  textOnBackground: ContrastRatingExport;
  primaryOnBackground: ContrastRatingExport;
  accentOnBackground: ContrastRatingExport;
  secondaryOnBackground: ContrastRatingExport;
  [key: string]: ContrastRatingExport;
}

export interface ThemeJsonExport {
  $schema: string;
  version: string;
  metadata: ThemeJsonMetadata;
  colors: Record<SemanticRole, ColorExportDefinition>;
  customColors?: CustomColorSlotExport[];
  contrastMatrix: ContrastMatrixExport;
}
