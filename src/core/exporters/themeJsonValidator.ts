import {SHADE_STEPS, ShadeStep} from '../color/types';
import {SEMANTIC_ROLES, SemanticRole} from '../palette/types';

import {ColorExportDefinition, ContrastRatingExport, CustomColorSlotExport, ShadeExportItem, ThemeJsonExport,} from './types';

const HEX_REGEX = /^#[0-9A-Fa-f]{6}$/;
const VERSION_REGEX = /^[0-9]+\.[0-9]+\.[0-9]+$/;

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function validateRgb(rgb: unknown, path: string, errors: string[]): void {
  if (typeof rgb !== 'object' || rgb === null) {
    errors.push(`${path}: expected RGB object`);
    return;
  }
  const r = (rgb as Record<string, unknown>).r;
  const g = (rgb as Record<string, unknown>).g;
  const b = (rgb as Record<string, unknown>).b;

  if (typeof r !== 'number' || r < 0 || r > 255) {
    errors.push(`${path}.r: must be an integer between 0 and 255`);
  }
  if (typeof g !== 'number' || g < 0 || g > 255) {
    errors.push(`${path}.g: must be an integer between 0 and 255`);
  }
  if (typeof b !== 'number' || b < 0 || b > 255) {
    errors.push(`${path}.b: must be an integer between 0 and 255`);
  }
}

function validateHsl(hsl: unknown, path: string, errors: string[]): void {
  if (typeof hsl !== 'object' || hsl === null) {
    errors.push(`${path}: expected HSL object`);
    return;
  }
  const h = (hsl as Record<string, unknown>).h;
  const s = (hsl as Record<string, unknown>).s;
  const l = (hsl as Record<string, unknown>).l;

  if (typeof h !== 'number' || h < 0 || h > 360) {
    errors.push(`${path}.h: must be a number between 0 and 360`);
  }
  if (typeof s !== 'number' || s < 0 || s > 100) {
    errors.push(`${path}.s: must be a number between 0 and 100`);
  }
  if (typeof l !== 'number' || l < 0 || l > 100) {
    errors.push(`${path}.l: must be a number between 0 and 100`);
  }
}

function validateOklch(oklch: unknown, path: string, errors: string[]): void {
  if (typeof oklch !== 'object' || oklch === null) {
    errors.push(`${path}: expected OKLCH object`);
    return;
  }
  const l = (oklch as Record<string, unknown>).l;
  const c = (oklch as Record<string, unknown>).c;
  const h = (oklch as Record<string, unknown>).h;

  if (typeof l !== 'number' || l < 0 || l > 1) {
    errors.push(`${path}.l: must be a number between 0 and 1`);
  }
  if (typeof c !== 'number' || c < 0) {
    errors.push(`${path}.c: must be a positive number`);
  }
  if (typeof h !== 'number' || h < 0 || h > 360) {
    errors.push(`${path}.h: must be a number between 0 and 360`);
  }
}

function validateShadeItem(
    item: unknown, path: string, expectedStep: ShadeStep,
    errors: string[]): void {
  if (typeof item !== 'object' || item === null) {
    errors.push(`${path}: expected shade object`);
    return;
  }
  const s = item as Partial<ShadeExportItem>;
  if (s.step !== expectedStep) {
    errors.push(`${path}.step: expected "${expectedStep}", got "${s.step}"`);
  }
  if (!s.hex || !HEX_REGEX.test(s.hex)) {
    errors.push(
        `${path}.hex: must be a valid 6-character hex code, got "${s.hex}"`);
  }
  validateRgb(s.rgb, `${path}.rgb`, errors);
  validateHsl(s.hsl, `${path}.hsl`, errors);
  validateOklch(s.oklch, `${path}.oklch`, errors);

  if (typeof s.relativeLuminance !== 'number' || s.relativeLuminance < 0 ||
      s.relativeLuminance > 1) {
    errors.push(`${path}.relativeLuminance: must be between 0 and 1`);
  }
  if (typeof s.contrastAgainstWhite !== 'number' ||
      s.contrastAgainstWhite < 1 || s.contrastAgainstWhite > 21) {
    errors.push(`${path}.contrastAgainstWhite: must be between 1 and 21`);
  }
  if (typeof s.contrastAgainstBlack !== 'number' ||
      s.contrastAgainstBlack < 1 || s.contrastAgainstBlack > 21) {
    errors.push(`${path}.contrastAgainstBlack: must be between 1 and 21`);
  }
  if (!s.recommendedTextColor || !HEX_REGEX.test(s.recommendedTextColor)) {
    errors.push(`${path}.recommendedTextColor: must be valid hex code`);
  }
}

function validateColorDefinition(
    def: unknown, path: string, expectedRole?: SemanticRole,
    errors: string[] = []): void {
  if (typeof def !== 'object' || def === null) {
    errors.push(`${path}: expected color definition object`);
    return;
  }
  const c = def as Partial<ColorExportDefinition>;

  if (expectedRole && c.role !== expectedRole) {
    errors.push(`${path}.role: expected "${expectedRole}", got "${c.role}"`);
  }
  if (!c.hex || !HEX_REGEX.test(c.hex)) {
    errors.push(
        `${path}.hex: must be a valid 6-character hex code, got "${c.hex}"`);
  }
  validateRgb(c.rgb, `${path}.rgb`, errors);
  validateHsl(c.hsl, `${path}.hsl`, errors);
  validateOklch(c.oklch, `${path}.oklch`, errors);

  if (typeof c.relativeLuminance !== 'number' || c.relativeLuminance < 0 ||
      c.relativeLuminance > 1) {
    errors.push(`${path}.relativeLuminance: must be between 0 and 1`);
  }
  if (typeof c.contrastAgainstWhite !== 'number' ||
      c.contrastAgainstWhite < 1 || c.contrastAgainstWhite > 21) {
    errors.push(`${path}.contrastAgainstWhite: must be between 1 and 21`);
  }
  if (typeof c.contrastAgainstBlack !== 'number' ||
      c.contrastAgainstBlack < 1 || c.contrastAgainstBlack > 21) {
    errors.push(`${path}.contrastAgainstBlack: must be between 1 and 21`);
  }
  if (!c.recommendedTextColor || !HEX_REGEX.test(c.recommendedTextColor)) {
    errors.push(`${path}.recommendedTextColor: must be valid hex code`);
  }

  if (typeof c.shades !== 'object' || c.shades === null) {
    errors.push(`${path}.shades: expected shade scale object`);
  } else {
    for (const step of SHADE_STEPS) {
      const shadeItem = (c.shades as Record<string, unknown>)[step];
      validateShadeItem(shadeItem, `${path}.shades.${step}`, step, errors);
    }
  }
}

function validateCustomSlot(
    slot: unknown, path: string, errors: string[]): void {
  if (typeof slot !== 'object' || slot === null) {
    errors.push(`${path}: expected custom color slot object`);
    return;
  }
  const s = slot as Partial<CustomColorSlotExport>;
  if (!s.id || typeof s.id !== 'string') {
    errors.push(`${path}.id: must be a non-empty string`);
  }
  if (!s.label || typeof s.label !== 'string') {
    errors.push(`${path}.label: must be a non-empty string`);
  }
  validateColorDefinition(slot, path, undefined, errors);
}

function validateContrastRating(
    rating: unknown, path: string, errors: string[]): void {
  if (typeof rating !== 'object' || rating === null) {
    errors.push(`${path}: expected contrast rating object`);
    return;
  }
  const r = rating as Partial<ContrastRatingExport>;
  if (!r.foreground || !HEX_REGEX.test(r.foreground)) {
    errors.push(`${path}.foreground: must be a valid hex code`);
  }
  if (!r.background || !HEX_REGEX.test(r.background)) {
    errors.push(`${path}.background: must be a valid hex code`);
  }
  if (typeof r.ratio !== 'number' || r.ratio < 1 || r.ratio > 21) {
    errors.push(`${path}.ratio: must be a number between 1 and 21`);
  }
  if (typeof r.normalTextAA !== 'boolean')
    errors.push(`${path}.normalTextAA: must be boolean`);
  if (typeof r.normalTextAAA !== 'boolean')
    errors.push(`${path}.normalTextAAA: must be boolean`);
  if (typeof r.largeTextAA !== 'boolean')
    errors.push(`${path}.largeTextAA: must be boolean`);
  if (typeof r.largeTextAAA !== 'boolean')
    errors.push(`${path}.largeTextAAA: must be boolean`);
}

export function validateThemeJson(data: unknown): ValidationResult {
  const errors: string[] = [];

  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return {valid: false, errors: ['Root theme document must be an object']};
  }

  const doc = data as Partial<ThemeJsonExport>;

  // $schema
  if (typeof doc.$schema !== 'string' || !doc.$schema.startsWith('http')) {
    errors.push('$schema: must be a valid schema URI');
  }

  // version
  if (typeof doc.version !== 'string' || !VERSION_REGEX.test(doc.version)) {
    errors.push('version: must follow semver format (x.y.z)');
  }

  // metadata
  if (typeof doc.metadata !== 'object' || doc.metadata === null) {
    errors.push('metadata: must be an object');
  } else {
    if (!doc.metadata.generator || typeof doc.metadata.generator !== 'string') {
      errors.push('metadata.generator: required non-empty string');
    }
    if (!doc.metadata.exportedAt ||
        typeof doc.metadata.exportedAt !== 'string') {
      errors.push('metadata.exportedAt: required ISO date-time string');
    }
    if (!doc.metadata.name || typeof doc.metadata.name !== 'string') {
      errors.push('metadata.name: required theme name string');
    }
  }

  // colors
  if (typeof doc.colors !== 'object' || doc.colors === null) {
    errors.push('colors: must be an object');
  } else {
    for (const role of SEMANTIC_ROLES) {
      const def = doc.colors[role];
      if (!def) {
        errors.push(`colors.${role}: missing required semantic role`);
      } else {
        validateColorDefinition(def, `colors.${role}`, role, errors);
      }
    }
  }

  // customColors (optional)
  if (doc.customColors !== undefined) {
    if (!Array.isArray(doc.customColors)) {
      errors.push('customColors: must be an array of custom color slots');
    } else {
      doc.customColors.forEach((slot, index) => {
        validateCustomSlot(slot, `customColors[${index}]`, errors);
      });
    }
  }

  // contrastMatrix
  if (typeof doc.contrastMatrix !== 'object' || doc.contrastMatrix === null) {
    errors.push('contrastMatrix: must be an object');
  } else {
    const requiredPairs =
        ['textOnBackground', 'primaryOnBackground', 'accentOnBackground'] as
        const;
    for (const pair of requiredPairs) {
      if (!doc.contrastMatrix[pair]) {
        errors.push(`contrastMatrix.${pair}: missing required contrast pair`);
      } else {
        validateContrastRating(
            doc.contrastMatrix[pair], `contrastMatrix.${pair}`, errors);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
