import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
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

  // TT-008: Undo / Redo history & Custom Slots & Role Swap
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  swapRoles: (roleA: SemanticRole, roleB: SemanticRole) => void;
  addCustomSlot: (name?: string, hex?: string) => void;
  updateCustomSlot: (id: string, updates: Partial<CustomColorSlot>) => void;
  removeCustomSlot: (id: string) => void;
  toggleCustomSlotLock: (id: string) => void;
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

  // TT-008: Undo / Redo history state stack
  interface HistorySnapshot {
    colors: PaletteColors;
    custom: CustomColorSlot[];
  }

  const MAX_HISTORY = 50;
  const [past, setPast] = useState<HistorySnapshot[]>([]);
  const [future, setFuture] = useState<HistorySnapshot[]>([]);

  const pastRef = useRef<HistorySnapshot[]>([]);
  const futureRef = useRef<HistorySnapshot[]>([]);
  pastRef.current = past;
  futureRef.current = future;

  const pushSnapshot = useCallback((snapshot: HistorySnapshot) => {
    setPast((prev) => {
      const updated = [...prev, snapshot];
      const trimmed = updated.length > MAX_HISTORY ? updated.slice(updated.length - MAX_HISTORY) : updated;
      pastRef.current = trimmed;
      return trimmed;
    });
    setFuture([]);
    futureRef.current = [];
  }, []);

  const undo = useCallback(() => {
    const currentPast = pastRef.current;
    if (currentPast.length === 0) return;
    const previous = currentPast[currentPast.length - 1];
    const newPast = currentPast.slice(0, -1);

    setState((currentState) => {
      const currentSnapshot: HistorySnapshot = {
        colors: currentState.colors,
        custom: currentState.custom,
      };
      setFuture((prevFuture) => {
        const nextFuture = [currentSnapshot, ...prevFuture];
        futureRef.current = nextFuture;
        return nextFuture;
      });
      return {
        ...currentState,
        colors: previous.colors,
        custom: previous.custom,
      };
    });

    setPast(newPast);
    pastRef.current = newPast;
  }, []);

  const redo = useCallback(() => {
    const currentFuture = futureRef.current;
    if (currentFuture.length === 0) return;
    const next = currentFuture[0];
    const newFuture = currentFuture.slice(1);

    setState((currentState) => {
      const currentSnapshot: HistorySnapshot = {
        colors: currentState.colors,
        custom: currentState.custom,
      };
      setPast((prevPast) => {
        const nextPast = [...prevPast, currentSnapshot];
        pastRef.current = nextPast;
        return nextPast;
      });
      return {
        ...currentState,
        colors: next.colors,
        custom: next.custom,
      };
    });

    setFuture(newFuture);
    futureRef.current = newFuture;
  }, []);

  const undoRef = useRef(undo);
  undoRef.current = undo;
  const redoRef = useRef(redo);
  redoRef.current = redo;

  // Global keyboard shortcuts for Undo / Redo (Cmd/Ctrl+Z, Cmd/Ctrl+Shift+Z, Cmd/Ctrl+Y)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'TEXTAREA' ||
          (target.tagName === 'INPUT' &&
            !['color', 'checkbox', 'radio', 'button', 'submit'].includes(
              (target as HTMLInputElement).type
            )))
      ) {
        return;
      }

      const isModifier = e.metaKey || e.ctrlKey;
      if (!isModifier) return;

      const key = e.key.toLowerCase();
      if (key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redoRef.current();
        } else {
          e.preventDefault();
          undoRef.current();
        }
      } else if (key === 'y') {
        e.preventDefault();
        redoRef.current();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

      if (state.custom && state.custom.length > 0) {
        const encodedCustom = state.custom
          .map((c) => `${encodeURIComponent(c.id)}:${encodeURIComponent(c.name)}:${c.hex.replace(/^#/, '')}`)
          .join(',');
        url.searchParams.set('custom', encodedCustom);
      } else {
        url.searchParams.delete('custom');
      }

      // Cleanly replace URL with relative path without triggering reload
      window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    }, 120);

    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [state.colors, state.custom]);

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
    if (state.colors[role] === hex) return;
    pushSnapshot({ colors: state.colors, custom: state.custom });
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

  // TT-008: Role Swap
  const swapRoles = (roleA: SemanticRole, roleB: SemanticRole) => {
    if (roleA === roleB || state.colors[roleA] === state.colors[roleB]) return;
    pushSnapshot({ colors: state.colors, custom: state.custom });
    setState((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [roleA]: prev.colors[roleB],
        [roleB]: prev.colors[roleA],
      },
    }));
  };

  // TT-008: Custom Extra Color Slots
  const addCustomSlot = (name?: string, hex?: string) => {
    pushSnapshot({ colors: state.colors, custom: state.custom });
    const newSlot: CustomColorSlot = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name?.trim() || `Custom ${state.custom.length + 1}`,
      hex: hex || '#8b5cf6',
      locked: false,
    };
    setState((prev) => ({
      ...prev,
      custom: [...prev.custom, newSlot],
    }));
  };

  const updateCustomSlot = (id: string, updates: Partial<CustomColorSlot>) => {
    const existing = state.custom.find((s) => s.id === id);
    if (!existing) return;
    if (
      (updates.name !== undefined && updates.name !== existing.name) ||
      (updates.hex !== undefined && updates.hex !== existing.hex)
    ) {
      pushSnapshot({ colors: state.colors, custom: state.custom });
    }
    setState((prev) => ({
      ...prev,
      custom: prev.custom.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  };

  const removeCustomSlot = (id: string) => {
    const existing = state.custom.find((s) => s.id === id);
    if (!existing) return;
    pushSnapshot({ colors: state.colors, custom: state.custom });
    setState((prev) => ({
      ...prev,
      custom: prev.custom.filter((s) => s.id !== id),
    }));
  };

  const toggleCustomSlotLock = (id: string) => {
    setState((prev) => ({
      ...prev,
      custom: prev.custom.map((s) => (s.id === id ? { ...s, locked: !s.locked } : s)),
    }));
  };

  const randomizeUnlocked = () => {
    pushSnapshot({ colors: state.colors, custom: state.custom });
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
      const roleKeys: SemanticRole[] = ['primary', 'secondary', 'accent', 'text', 'background'];
      const nextCustom = prev.custom.map((slot) => {
        if (slot.locked) return slot;
        const randomKey = roleKeys[Math.floor(Math.random() * roleKeys.length)];
        return {
          ...slot,
          hex: randomPreset.colors[randomKey],
        };
      });
      return { ...prev, colors: nextColors, custom: nextCustom };
    });
  };

  const applyPreset = (presetId: string) => {
    const preset = PALETTE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    pushSnapshot({ colors: state.colors, custom: state.custom });
    setState((prev) => ({
      ...prev,
      colors: { ...preset.colors },
    }));
  };

  const importPalette = (newColors: Partial<PaletteColors>, custom?: CustomColorSlot[]) => {
    pushSnapshot({ colors: state.colors, custom: state.custom });
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
    pushSnapshot({ colors: state.colors, custom: state.custom });
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
    if (state.custom && state.custom.length > 0) {
      const encodedCustom = state.custom
        .map((c) => `${encodeURIComponent(c.id)}:${encodeURIComponent(c.name)}:${c.hex.replace(/^#/, '')}`)
        .join(',');
      url.searchParams.set('custom', encodedCustom);
    } else {
      url.searchParams.delete('custom');
    }
    return url.toString();
  }, [state.colors, state.custom]);

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
        canUndo: past.length > 0,
        canRedo: future.length > 0,
        undo,
        redo,
        swapRoles,
        addCustomSlot,
        updateCustomSlot,
        removeCustomSlot,
        toggleCustomSlotLock,
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
