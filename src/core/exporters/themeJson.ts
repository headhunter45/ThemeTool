import {generateShadeScale, getContrastRatio, getRecommendedTextColor, getRelativeLuminance, hexToOklch, hexToRgb, rgbToHsl, SHADE_STEPS,} from '../color';
import {CustomColorSlot, PaletteColors, SEMANTIC_ROLES, SemanticRole} from '../palette/types';

import {ColorExportDefinition, ContrastMatrixExport, ContrastRatingExport, CustomColorSlotExport, ShadeExportScale, ThemeJsonExport,} from './types';

export const THEME_JSON_SCHEMA_URL =
    'https://headhunter45.github.io/ThemeTool/schema/themetool.schema.json';

export const THEME_JSON_VERSION = '1.0.0';

export function computeContrastRating(
    foreground: string, background: string): ContrastRatingExport {
  const ratio = getContrastRatio(foreground, background);
  return {
    foreground,
    background,
    ratio,
    normalTextAA: ratio >= 4.5,
    normalTextAAA: ratio >= 7.0,
    largeTextAA: ratio >= 3.0,
    largeTextAAA: ratio >= 4.5,
  };
}

export function buildShadeExportScale(baseHex: string): ShadeExportScale {
  const scale = generateShadeScale(baseHex);
  const result: Partial<ShadeExportScale> = {};

  for (const step of SHADE_STEPS) {
    const info = scale[step];
    result[step] = {
      step,
      hex: info.hex,
      rgb: info.rgb,
      hsl: info.hsl,
      oklch: {
        l: Number(info.oklch.l.toFixed(4)),
        c: Number(info.oklch.c.toFixed(4)),
        h: Number(info.oklch.h.toFixed(2)),
      },
      relativeLuminance: Number(info.relativeLuminance.toFixed(4)),
      contrastAgainstWhite: info.contrastAgainstWhite,
      contrastAgainstBlack: info.contrastAgainstBlack,
      recommendedTextColor: info.recommendedTextColor,
    };
  }

  return result as ShadeExportScale;
}

export function buildColorDefinition(
    role: SemanticRole, hex: string): ColorExportDefinition {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb);
  const oklch = hexToOklch(hex);
  const relativeLuminance = getRelativeLuminance(hex);
  const contrastAgainstWhite = getContrastRatio(hex, '#FFFFFF');
  const contrastAgainstBlack = getContrastRatio(hex, '#000000');
  const recommendedTextColor = getRecommendedTextColor(hex);
  const shades = buildShadeExportScale(hex);

  return {
    role,
    hex,
    rgb,
    hsl: {
      h: Number(hsl.h.toFixed(1)),
      s: Number(hsl.s.toFixed(1)),
      l: Number(hsl.l.toFixed(1)),
    },
    oklch: {
      l: Number(oklch.l.toFixed(4)),
      c: Number(oklch.c.toFixed(4)),
      h: Number(oklch.h.toFixed(2)),
    },
    relativeLuminance: Number(relativeLuminance.toFixed(4)),
    contrastAgainstWhite,
    contrastAgainstBlack,
    recommendedTextColor,
    shades,
  };
}

export function buildCustomSlotExport(slot: CustomColorSlot):
    CustomColorSlotExport {
  const hex = slot.hex || '#000000';
  const label = slot.name || 'Custom';
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb);
  const oklch = hexToOklch(hex);
  const relativeLuminance = getRelativeLuminance(hex);
  const contrastAgainstWhite = getContrastRatio(hex, '#FFFFFF');
  const contrastAgainstBlack = getContrastRatio(hex, '#000000');
  const recommendedTextColor = getRecommendedTextColor(hex);
  const shades = buildShadeExportScale(hex);

  return {
    id: slot.id,
    label,
    hex,
    rgb,
    hsl: {
      h: Number(hsl.h.toFixed(1)),
      s: Number(hsl.s.toFixed(1)),
      l: Number(hsl.l.toFixed(1)),
    },
    oklch: {
      l: Number(oklch.l.toFixed(4)),
      c: Number(oklch.c.toFixed(4)),
      h: Number(oklch.h.toFixed(2)),
    },
    relativeLuminance: Number(relativeLuminance.toFixed(4)),
    contrastAgainstWhite,
    contrastAgainstBlack,
    recommendedTextColor,
    shades,
  };
}

export interface GenerateThemeJsonOptions {
  name?: string;
  description?: string;
}

export function generateThemeJson(
    colors: PaletteColors, custom: CustomColorSlot[] = [],
    options: GenerateThemeJsonOptions = {}): ThemeJsonExport {
  const colorDefs = {} as Record<SemanticRole, ColorExportDefinition>;
  for (const role of SEMANTIC_ROLES) {
    colorDefs[role] = buildColorDefinition(role, colors[role]);
  }

  const customColors =
      custom.length > 0 ? custom.map(buildCustomSlotExport) : undefined;

  const contrastMatrix: ContrastMatrixExport = {
    textOnBackground: computeContrastRating(colors.text, colors.background),
    primaryOnBackground:
        computeContrastRating(colors.primary, colors.background),
    accentOnBackground: computeContrastRating(colors.accent, colors.background),
    secondaryOnBackground:
        computeContrastRating(colors.secondary, colors.background),
  };

  return {
    $schema: THEME_JSON_SCHEMA_URL,
    version: THEME_JSON_VERSION,
    metadata: {
      generator: 'ThemeTool',
      exportedAt: new Date().toISOString(),
      name: options.name || 'Custom Theme',
      description: options.description ||
          'Exported semantic color palette and shade scales from ThemeTool.',
    },
    colors: colorDefs,
    customColors,
    contrastMatrix,
  };
}
