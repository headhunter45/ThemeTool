import {PaletteColors} from './types';

export interface PalettePreset {
  id: string;
  name: string;
  colors: PaletteColors;
}

export const PALETTE_PRESETS: PalettePreset[] = [
  {
    id: 'modern-indigo',
    name: 'Modern Indigo',
    colors: {
      text: '#0f172a',
      background: '#f8fafc',
      primary: '#4f46e5',
      secondary: '#64748b',
      accent: '#06b6d4',
    },
  },
  {
    id: 'emerald-forest',
    name: 'Emerald Forest',
    colors: {
      text: '#064e3b',
      background: '#f0fdf4',
      primary: '#059669',
      secondary: '#475569',
      accent: '#d97706',
    },
  },
  {
    id: 'sunset-horizon',
    name: 'Sunset Horizon',
    colors: {
      text: '#1c1917',
      background: '#fff7ed',
      primary: '#ea580c',
      secondary: '#78716c',
      accent: '#8b5cf6',
    },
  },
  {
    id: 'midnight-neon',
    name: 'Midnight Neon',
    colors: {
      text: '#f8fafc',
      background: '#090d16',
      primary: '#38bdf8',
      secondary: '#94a3b8',
      accent: '#f43f5e',
    },
  },
  {
    id: 'nordic-slate',
    name: 'Nordic Slate',
    colors: {
      text: '#1e293b',
      background: '#f1f5f9',
      primary: '#2563eb',
      secondary: '#475569',
      accent: '#10b981',
    },
  },
  {
    id: 'berry-wine',
    name: 'Berry Wine',
    colors: {
      text: '#2e1065',
      background: '#faf5ff',
      primary: '#9333ea',
      secondary: '#6b7280',
      accent: '#f43f5e',
    },
  },
];
