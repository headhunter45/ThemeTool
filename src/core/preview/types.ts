export type PreviewTargetId = 'tailwind'|'material'|'android'|'ios';

export type PreviewMode = 'all'|PreviewTargetId;

export interface TargetMetadata {
  id: PreviewTargetId;
  label: string;
  framework: string;
  description: string;
  category: 'web'|'mobile';
}

export const PREVIEW_TARGETS: TargetMetadata[] = [
  {
    id: 'tailwind',
    label: 'Tailwind CSS',
    framework: 'Tailwind v3 / v4',
    description:
        'Web utility classes with reactive theme tokens and component styles.',
    category: 'web',
  },
  {
    id: 'material',
    label: 'Material M3',
    framework: 'Material Design 3',
    description:
        'Official Material You token hierarchy, elevation, and shape geometry.',
    category: 'web',
  },
  {
    id: 'android',
    label: 'Android',
    framework: 'Jetpack Compose / XML',
    description:
        'Native Android mobile frame with Material 3 dynamic color theming.',
    category: 'mobile',
  },
  {
    id: 'ios',
    label: 'iOS',
    framework: 'SwiftUI / HIG',
    description:
        'Apple Human Interface Guidelines with system tints and grouped surfaces.',
    category: 'mobile',
  },
];

export const PREVIEW_TARGET_IDS: PreviewTargetId[] =
    PREVIEW_TARGETS.map((t) => t.id);

export const PREVIEW_STORAGE_KEYS = {
  MODE: 'themetool_preview_mode',
  VISIBILITY: 'themetool_preview_visibility',
} as const;

export const DEFAULT_TARGET_VISIBILITY: Record<PreviewTargetId, boolean> = {
  tailwind: true,
  material: true,
  android: true,
  ios: true,
};
