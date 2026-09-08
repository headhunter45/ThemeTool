import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { generateShadeScale, ShadeScale } from '../core/color';
import {
    CustomColorSlot,
    decodePaletteFromUrl,
    encodeColorsToParam,
    PALETTE_PRESETS,
    PaletteColors,
    PaletteLocks,
    PalettePreset,
    PaletteState,
    ROLE_METADATA,
    RoleShadeScales,
    SEMANTIC_ROLES,
    SemanticRole,
} from '../core/palette';

export interface PaletteContextType {
  state: PaletteState;
  colors: PaletteColors;
  locks: PaletteLocks;
  custom: CustomColorSlot[];
  shadeScales: RoleShadeScales;
  activeRole: SemanticRole;
  setActiveRole: (role: SemanticRole) => void;
  setColor: (role: SemanticRole, hex: string) => void;
  setLock: (role: SemanticRole, locked: boolean) => void;
  toggleLock: (role: SemanticRole) => void;
  randomizeUnlocked: () => void;
  applyPreset: (presetId: string) => void;
  importPalette: (newColors: Partial<PaletteColors>, custom?: CustomColorSlot[]) => void;
  resetToDefault: () => void;
  shareableUrl: string;
}

const DEFAULT_COLORS: PaletteColors = {
  text: ROLE_METADATA.text.defaultHex,
  background: ROLE_METADATA.background.defaultHex,
  primary: ROLE_METADATA.primary.defaultHex,
  secondary: ROLE_METADATA.secondary.defaultHex,
  accent: ROLE_METADATA.accent.defaultHex,
};

const DEFAULT_LOCKS: PaletteLocks = {
  text: false,
  background: false,
  primary: false,
  secondary: false,
  accent: false,
};

const PaletteContext = createContext<PaletteContextType | undefined>(undefined);

function getInitialPalette(): PaletteState {
  if (typeof window !== 'undefined') {
    const fromUrl = decodePaletteFromUrl(window.location.href);
    if (fromUrl?.colors) {
      return {
        colors: {
          text: fromUrl.colors.text || DEFAULT_COLORS.text,
          background: fromUrl.colors.background || DEFAULT_COLORS.background,
          primary: fromUrl.colors.primary || DEFAULT_COLORS.primary,
          secondary: fromUrl.colors.secondary || DEFAULT_COLORS.secondary,
          accent: fromUrl.colors.accent || DEFAULT_COLORS.accent,
        },
        locks: DEFAULT_LOCKS,
        custom: fromUrl.custom || [],
      };
    }
  }

  return {
    colors: DEFAULT_COLORS,
    locks: DEFAULT_LOCKS,
    custom: [],
  };
}

export interface PaletteProviderProps {
  children: React.ReactNode;
  initialPalette?: Partial<PaletteState>;
}

export const PaletteProvider: React.FC<PaletteProviderProps> = ({
  children,
  initialPalette,
}) => {
  const [state, setState] = useState<PaletteState>(() => {
    const base = getInitialPalette();
    if (initialPalette?.colors) {
      base.colors = { ...base.colors, ...initialPalette.colors };
    }
    if (initialPalette?.locks) {
      base.locks = { ...base.locks, ...initialPalette.locks };
    }
    if (initialPalette?.custom) {
      base.custom = initialPalette.custom;
    }
    return base;
  });

  const [activeRole, setActiveRole] = useState<SemanticRole>('primary');
  const debounceTimerRef = useRef<number | null>(null);

  // Bi-directional sync to URL
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      const url = new URL(window.location.href);
      const encodedParam = encodeColorsToParam(state.colors);
      url.searchParams.set('colors', encodedParam);

      // Cleanly replace URL with relative path without triggering reload
      window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    }, 120);

    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [state.colors]);

  // Listen to popstate (back / forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const fromUrl = decodePaletteFromUrl(window.location.href);
      if (fromUrl?.colors) {
        setState((prev) => ({
          ...prev,
          colors: {
            text: fromUrl.colors?.text || prev.colors.text,
            background: fromUrl.colors?.background || prev.colors.background,
            primary: fromUrl.colors?.primary || prev.colors.primary,
            secondary: fromUrl.colors?.secondary || prev.colors.secondary,
            accent: fromUrl.colors?.accent || prev.colors.accent,
          },
          ...(fromUrl.custom && { custom: fromUrl.custom }),
        }));
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setColor = (role: SemanticRole, hex: string) => {
    setState((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [role]: hex,
      },
    }));
  };

  const setLock = (role: SemanticRole, locked: boolean) => {
    setState((prev) => ({
      ...prev,
      locks: {
        ...prev.locks,
        [role]: locked,
      },
    }));
  };

  const toggleLock = (role: SemanticRole) => {
    setState((prev) => ({
      ...prev,
      locks: {
        ...prev.locks,
        [role]: !prev.locks[role],
      },
    }));
  };

  const randomizeUnlocked = () => {
    // Select a random curated preset and apply only to unlocked slots
    const availablePresets = PALETTE_PRESETS;
    const randomPreset: PalettePreset =
      availablePresets[Math.floor(Math.random() * availablePresets.length)];

    setState((prev) => {
      const nextColors = { ...prev.colors };
      for (const role of SEMANTIC_ROLES) {
        if (!prev.locks[role]) {
          nextColors[role] = randomPreset.colors[role];
        }
      }
      return { ...prev, colors: nextColors };
    });
  };

  const applyPreset = (presetId: string) => {
    const preset = PALETTE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setState((prev) => ({
      ...prev,
      colors: { ...preset.colors },
    }));
  };

  const importPalette = (newColors: Partial<PaletteColors>, custom?: CustomColorSlot[]) => {
    setState((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        ...newColors,
      },
      ...(custom !== undefined && { custom }),
    }));
  };

  const resetToDefault = () => {
    setState({
      colors: DEFAULT_COLORS,
      locks: DEFAULT_LOCKS,
      custom: [],
    });
  };

  // Memoized 50-950 shade scales for all 5 roles
  const shadeScales = useMemo<RoleShadeScales>(() => {
    const computeSafeScale = (hex: string): ShadeScale => {
      try {
        return generateShadeScale(hex);
      } catch {
        return generateShadeScale('#3b82f6');
      }
    };

    return {
      text: computeSafeScale(state.colors.text),
      background: computeSafeScale(state.colors.background),
      primary: computeSafeScale(state.colors.primary),
      secondary: computeSafeScale(state.colors.secondary),
      accent: computeSafeScale(state.colors.accent),
    };
  }, [state.colors]);

  const shareableUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.href);
    url.searchParams.set('colors', encodeColorsToParam(state.colors));
    return url.toString();
  }, [state.colors]);

  return (
    <PaletteContext.Provider
      value={{
        state,
        colors: state.colors,
        locks: state.locks,
        custom: state.custom,
        shadeScales,
        activeRole,
        setActiveRole,
        setColor,
        setLock,
        toggleLock,
        randomizeUnlocked,
        applyPreset,
        importPalette,
        resetToDefault,
        shareableUrl,
      }}
    >
      {children}
    </PaletteContext.Provider>
  );
};

export const usePalette = (): PaletteContextType => {
  const context = useContext(PaletteContext);
  if (!context) {
    throw new Error('usePalette must be used within a PaletteProvider');
  }
  return context;
};
