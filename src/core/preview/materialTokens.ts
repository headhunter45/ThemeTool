import {generateShadeScale, getRecommendedTextColor, getRelativeLuminance,} from '../color';
import {PaletteColors} from '../palette/types';

export interface MaterialTokens {
  // Primary
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;

  // Secondary
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;

  // Tertiary (Accent)
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;

  // Surface & Canvas
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerLow: string;

  // Outline / Borders
  outline: string;
  outlineVariant: string;

  // Meta
  isDark: boolean;
}

export function computeMaterialTokens(colors: PaletteColors): MaterialTokens {
  const bgLuminance = getRelativeLuminance(colors.background);
  const isDark = bgLuminance < 0.5;

  const primaryScale = generateShadeScale(colors.primary);
  const secondaryScale = generateShadeScale(colors.secondary);
  const accentScale = generateShadeScale(colors.accent);
  const bgScale = generateShadeScale(colors.background);
  const textScale = generateShadeScale(colors.text);

  const primary = colors.primary;
  const onPrimary = getRecommendedTextColor(primary);

  const primaryContainer =
      isDark ? primaryScale['900'].hex : primaryScale['100'].hex;
  const onPrimaryContainer =
      isDark ? primaryScale['100'].hex : primaryScale['900'].hex;

  const secondary = colors.secondary;
  const onSecondary = getRecommendedTextColor(secondary);
  const secondaryContainer =
      isDark ? secondaryScale['900'].hex : secondaryScale['100'].hex;
  const onSecondaryContainer =
      isDark ? secondaryScale['100'].hex : secondaryScale['900'].hex;

  const tertiary = colors.accent;
  const onTertiary = getRecommendedTextColor(tertiary);
  const tertiaryContainer =
      isDark ? accentScale['900'].hex : accentScale['100'].hex;
  const onTertiaryContainer =
      isDark ? accentScale['100'].hex : accentScale['900'].hex;

  const surface = colors.background;
  const onSurface = colors.text;

  // Surface elevation containers
  const surfaceVariant = isDark ? bgScale['800'].hex : bgScale['100'].hex;
  const onSurfaceVariant = isDark ? textScale['400'].hex : textScale['600'].hex;

  const surfaceContainer = isDark ? bgScale['900'].hex : bgScale['50'].hex;
  const surfaceContainerHigh = isDark ? bgScale['800'].hex : '#ffffff';
  const surfaceContainerLow = isDark ? bgScale['950'].hex : bgScale['100'].hex;

  // Outline
  const outline = isDark ? textScale['700'].hex : textScale['300'].hex;
  const outlineVariant = isDark ? textScale['800'].hex : textScale['200'].hex;

  return {
    primary,
    onPrimary,
    primaryContainer,
    onPrimaryContainer,
    secondary,
    onSecondary,
    secondaryContainer,
    onSecondaryContainer,
    tertiary,
    onTertiary,
    tertiaryContainer,
    onTertiaryContainer,
    surface,
    onSurface,
    surfaceVariant,
    onSurfaceVariant,
    surfaceContainer,
    surfaceContainerHigh,
    surfaceContainerLow,
    outline,
    outlineVariant,
    isDark,
  };
}
