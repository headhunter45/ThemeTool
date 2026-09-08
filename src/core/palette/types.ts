import {ShadeScale} from '../color/types';

export type SemanticRole = 'text'|'background'|'primary'|'secondary'|'accent';

export const SEMANTIC_ROLES: SemanticRole[] = [
  'text',
  'background',
  'primary',
  'secondary',
  'accent',
];

export interface CustomColorSlot {
  id: string;
  name: string;
  hex: string;
  locked?: boolean;
}

export interface PaletteColors {
  text: string;
  background: string;
  primary: string;
  secondary: string;
  accent: string;
}

export interface PaletteLocks {
  text: boolean;
  background: boolean;
  primary: boolean;
  secondary: boolean;
  accent: boolean;
}

export interface PaletteState {
  colors: PaletteColors;
  locks: PaletteLocks;
  custom: CustomColorSlot[];
}

export interface RoleMeta {
  role: SemanticRole;
  label: string;
  description: string;
  defaultHex: string;
}

export const ROLE_METADATA: Record<SemanticRole, RoleMeta> = {
  text: {
    role: 'text',
    label: 'Text',
    description: 'Primary typography, headings, and high-contrast content',
    defaultHex: '#0f172a',
  },
  background: {
    role: 'background',
    label: 'Background',
    description: 'Main canvas, page surface, and container background',
    defaultHex: '#f8fafc',
  },
  primary: {
    role: 'primary',
    label: 'Primary',
    description: 'Key brand actions, CTAs, active states, and focus rings',
    defaultHex: '#3b82f6',
  },
  secondary: {
    role: 'secondary',
    label: 'Secondary',
    description: 'Supporting UI elements, secondary buttons, and borders',
    defaultHex: '#64748b',
  },
  accent: {
    role: 'accent',
    label: 'Accent',
    description: 'Highlights, callouts, badges, and attention-grabbing accents',
    defaultHex: '#f59e0b',
  },
};

export interface RoleShadeScales {
  text: ShadeScale;
  background: ShadeScale;
  primary: ShadeScale;
  secondary: ShadeScale;
  accent: ShadeScale;
}
