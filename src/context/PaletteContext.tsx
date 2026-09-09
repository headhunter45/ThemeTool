import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { generateShadeScale, ShadeScale } from '../core/color';
import {
    CustomColorSlot,
    decodePaletteFromUrl,
    DualPaletteState,
    encodeColorsToParam,
    generateCounterpartPalette,
    generateDarkPalette,
    generateLightPalette,
    ModePalette,
    PALETTE_PRESETS,
    PaletteColors,
    PaletteLocks,
    PaletteMode,
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

  // TT-022: Dark Mode Duality Generator
  activeMode: PaletteMode;
  setActiveMode: (mode: PaletteMode) => void;
  palettes: { light: ModePalette; dark: ModePalette };
  setModePalette: (mode: PaletteMode, colors: PaletteColors, custom?: CustomColorSlot[]) => void;
  generateCounterpart: (fromMode?: PaletteMode) => ModePalette;
  applyDuality: (fromMode: PaletteMode) => void;
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

function getInitialDualState(initial?: Partial<PaletteState>): DualPaletteState {
  let baseColors = DEFAULT_COLORS;
  let baseLocks = DEFAULT_LOCKS;
  let baseCustom: CustomColorSlot[] = [];
  let explicitMode: PaletteMode = 'light';

  if (typeof window !== 'undefined') {
    try {
      const url = new URL(window.location.href);
      const modeParam = url.searchParams.get('mode');
      if (modeParam === 'dark' || modeParam === 'light') {
        explicitMode = modeParam;
      }
    } catch {
      // Fallback in test/headless environments
    }

    const fromUrl = decodePaletteFromUrl(window.location.href);
    if (fromUrl?.colors) {
      baseColors = {
        text: fromUrl.colors.text || DEFAULT_COLORS.text,
        background: fromUrl.colors.background || DEFAULT_COLORS.background,
        primary: fromUrl.colors.primary || DEFAULT_COLORS.primary,
        secondary: fromUrl.colors.secondary || DEFAULT_COLORS.secondary,
        accent: fromUrl.colors.accent || DEFAULT_COLORS.accent,
      };
      if (fromUrl.custom) baseCustom = fromUrl.custom;
    }
  }

  if (initial?.colors) baseColors = { ...baseColors, ...initial.colors };
  if (initial?.locks) baseLocks = { ...baseLocks, ...initial.locks };
  if (initial?.custom) baseCustom = initial.custom;

  let lightPalette: ModePalette;
  let darkPalette: ModePalette;

  if (explicitMode === 'dark') {
    darkPalette = { colors: baseColors, custom: baseCustom };
    lightPalette = generateLightPalette(baseColors, baseCustom);
  } else {
    lightPalette = { colors: baseColors, custom: baseCustom };
    darkPalette = generateDarkPalette(baseColors, baseCustom);
  }

  return {
    activeMode: explicitMode,
    palettes: {
      light: lightPalette,
      dark: darkPalette,
    },
    locks: baseLocks,
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
  const [dualState, setDualState] = useState<DualPaletteState>(() =>
    getInitialDualState(initialPalette)
  );

  const [activeRole, setActiveRole] = useState<SemanticRole>('primary');
  const debounceTimerRef = useRef<number | null>(null);

  // Undo / Redo history snapshot
  interface HistorySnapshot {
    activeMode: PaletteMode;
    palettes: {
      light: ModePalette;
      dark: ModePalette;
    };
    locks: PaletteLocks;
  }

  const MAX_HISTORY = 50;
  const [past, setPast] = useState<HistorySnapshot[]>([]);
  const [future, setFuture] = useState<HistorySnapshot[]>([]);

  const pastRef = useRef<HistorySnapshot[]>([]);
  const futureRef = useRef<HistorySnapshot[]>([]);
  pastRef.current = past;
  futureRef.current = future;

  const pushSnapshot = useCallback((currentState: DualPaletteState) => {
    setPast((prev) => {
      const updated = [
        ...prev,
        {
          activeMode: currentState.activeMode,
          palettes: {
            light: {
              colors: { ...currentState.palettes.light.colors },
              custom: currentState.palettes.light.custom.map((c) => ({ ...c })),
            },
            dark: {
              colors: { ...currentState.palettes.dark.colors },
              custom: currentState.palettes.dark.custom.map((c) => ({ ...c })),
            },
          },
          locks: { ...currentState.locks },
        },
      ];
      const trimmed =
        updated.length > MAX_HISTORY
          ? updated.slice(updated.length - MAX_HISTORY)
          : updated;
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

    setDualState((currentState) => {
      const currentSnapshot: HistorySnapshot = {
        activeMode: currentState.activeMode,
        palettes: {
          light: {
            colors: { ...currentState.palettes.light.colors },
            custom: currentState.palettes.light.custom.map((c) => ({ ...c })),
          },
          dark: {
            colors: { ...currentState.palettes.dark.colors },
            custom: currentState.palettes.dark.custom.map((c) => ({ ...c })),
          },
        },
        locks: { ...currentState.locks },
      };

      setFuture((prevFuture) => {
        const nextFuture = [currentSnapshot, ...prevFuture];
        futureRef.current = nextFuture;
        return nextFuture;
      });

      return {
        activeMode: previous.activeMode,
        palettes: {
          light: {
            colors: { ...previous.palettes.light.colors },
            custom: previous.palettes.light.custom.map((c) => ({ ...c })),
          },
          dark: {
            colors: { ...previous.palettes.dark.colors },
            custom: previous.palettes.dark.custom.map((c) => ({ ...c })),
          },
        },
        locks: { ...previous.locks },
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

    setDualState((currentState) => {
      const currentSnapshot: HistorySnapshot = {
        activeMode: currentState.activeMode,
        palettes: {
          light: {
            colors: { ...currentState.palettes.light.colors },
            custom: currentState.palettes.light.custom.map((c) => ({ ...c })),
          },
          dark: {
            colors: { ...currentState.palettes.dark.colors },
            custom: currentState.palettes.dark.custom.map((c) => ({ ...c })),
          },
        },
        locks: { ...currentState.locks },
      };

      setPast((prevPast) => {
        const nextPast = [...prevPast, currentSnapshot];
        pastRef.current = nextPast;
        return nextPast;
      });

      return {
        activeMode: next.activeMode,
        palettes: {
          light: {
            colors: { ...next.palettes.light.colors },
            custom: next.palettes.light.custom.map((c) => ({ ...c })),
          },
          dark: {
            colors: { ...next.palettes.dark.colors },
            custom: next.palettes.dark.custom.map((c) => ({ ...c })),
          },
        },
        locks: { ...next.locks },
      };
    });

    setFuture(newFuture);
    futureRef.current = newFuture;
  }, []);

  const undoRef = useRef(undo);
  undoRef.current = undo;
  const redoRef = useRef(redo);
  redoRef.current = redo;

  // Global keyboard shortcuts for Undo / Redo
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

  const activeMode = dualState.activeMode;
  const activePalette = dualState.palettes[activeMode];
  const colors = activePalette.colors;
  const custom = activePalette.custom;
  const locks = dualState.locks;

  // Bi-directional sync to URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = window.setTimeout(() => {
        const url = new URL(window.location.href);
        const encodedParam = encodeColorsToParam(colors);
        url.searchParams.set('colors', encodedParam);

        if (activeMode === 'dark') {
          url.searchParams.set('mode', 'dark');
        } else {
          url.searchParams.delete('mode');
        }

        if (custom && custom.length > 0) {
          const encodedCustom = custom
            .map(
              (c) =>
                `${encodeURIComponent(c.id)}:${encodeURIComponent(c.name)}:${c.hex.replace(/^#/, '')}`
            )
            .join(',');
          url.searchParams.set('custom', encodedCustom);
        } else {
          url.searchParams.delete('custom');
        }

        window.history.replaceState(
          null,
          '',
          url.pathname + url.search + url.hash
        );
      }, 120);

      return () => {
        if (debounceTimerRef.current) {
          window.clearTimeout(debounceTimerRef.current);
        }
      };
    }
  }, [colors, custom, activeMode]);

  // Listen to popstate
  useEffect(() => {
    const handlePopState = () => {
      const fromUrl = decodePaletteFromUrl(window.location.href);
      if (fromUrl?.colors) {
        setDualState((prev) => {
          const newColors: PaletteColors = {
            text: fromUrl.colors?.text || prev.palettes[prev.activeMode].colors.text,
            background:
              fromUrl.colors?.background || prev.palettes[prev.activeMode].colors.background,
            primary: fromUrl.colors?.primary || prev.palettes[prev.activeMode].colors.primary,
            secondary:
              fromUrl.colors?.secondary || prev.palettes[prev.activeMode].colors.secondary,
            accent: fromUrl.colors?.accent || prev.palettes[prev.activeMode].colors.accent,
          };
          const newCustom = fromUrl.custom !== undefined ? fromUrl.custom : prev.palettes[prev.activeMode].custom;

          return {
            ...prev,
            palettes: {
              ...prev.palettes,
              [prev.activeMode]: {
                colors: newColors,
                custom: newCustom,
              },
            },
          };
        });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setActiveMode = useCallback((mode: PaletteMode) => {
    setDualState((prev) => {
      if (prev.activeMode === mode) return prev;
      return { ...prev, activeMode: mode };
    });
  }, []);

  const setModePalette = useCallback(
    (mode: PaletteMode, newColors: PaletteColors, newCustom?: CustomColorSlot[]) => {
      setDualState((prev) => {
        pushSnapshot(prev);
        return {
          ...prev,
          palettes: {
            ...prev.palettes,
            [mode]: {
              colors: { ...newColors },
              custom:
                newCustom !== undefined
                  ? newCustom
                  : prev.palettes[mode].custom,
            },
          },
        };
      });
    },
    [pushSnapshot]
  );

  const generateCounterpart = useCallback(
    (fromMode?: PaletteMode): ModePalette => {
      const sourceMode = fromMode || dualState.activeMode;
      const sourcePalette = dualState.palettes[sourceMode];
      return generateCounterpartPalette(
        sourcePalette.colors,
        sourcePalette.custom,
        sourceMode
      );
    },
    [dualState.activeMode, dualState.palettes]
  );

  const applyDuality = useCallback(
    (fromMode: PaletteMode) => {
      const targetMode: PaletteMode = fromMode === 'light' ? 'dark' : 'light';
      setDualState((prev) => {
        pushSnapshot(prev);
        const counterpart = generateCounterpartPalette(
          prev.palettes[fromMode].colors,
          prev.palettes[fromMode].custom,
          fromMode
        );
        return {
          ...prev,
          palettes: {
            ...prev.palettes,
            [targetMode]: counterpart,
          },
        };
      });
    },
    [pushSnapshot]
  );

  const setColor = (role: SemanticRole, hex: string) => {
    if (colors[role] === hex) return;
    pushSnapshot(dualState);
    setDualState((prev) => ({
      ...prev,
      palettes: {
        ...prev.palettes,
        [prev.activeMode]: {
          ...prev.palettes[prev.activeMode],
          colors: {
            ...prev.palettes[prev.activeMode].colors,
            [role]: hex,
          },
        },
      },
    }));
  };

  const setLock = (role: SemanticRole, locked: boolean) => {
    setDualState((prev) => ({
      ...prev,
      locks: {
        ...prev.locks,
        [role]: locked,
      },
    }));
  };

  const toggleLock = (role: SemanticRole) => {
    setDualState((prev) => ({
      ...prev,
      locks: {
        ...prev.locks,
        [role]: !prev.locks[role],
      },
    }));
  };

  const swapRoles = (roleA: SemanticRole, roleB: SemanticRole) => {
    if (roleA === roleB || colors[roleA] === colors[roleB]) return;
    pushSnapshot(dualState);
    setDualState((prev) => ({
      ...prev,
      palettes: {
        ...prev.palettes,
        [prev.activeMode]: {
          ...prev.palettes[prev.activeMode],
          colors: {
            ...prev.palettes[prev.activeMode].colors,
            [roleA]: prev.palettes[prev.activeMode].colors[roleB],
            [roleB]: prev.palettes[prev.activeMode].colors[roleA],
          },
        },
      },
    }));
  };

  const addCustomSlot = (name?: string, hex?: string) => {
    pushSnapshot(dualState);
    const newSlot: CustomColorSlot = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name?.trim() || `Custom ${custom.length + 1}`,
      hex: hex || '#8b5cf6',
      locked: false,
    };
    setDualState((prev) => ({
      ...prev,
      palettes: {
        ...prev.palettes,
        [prev.activeMode]: {
          ...prev.palettes[prev.activeMode],
          custom: [...prev.palettes[prev.activeMode].custom, newSlot],
        },
      },
    }));
  };

  const updateCustomSlot = (id: string, updates: Partial<CustomColorSlot>) => {
    const existing = custom.find((s) => s.id === id);
    if (!existing) return;
    if (
      (updates.name !== undefined && updates.name !== existing.name) ||
      (updates.hex !== undefined && updates.hex !== existing.hex)
    ) {
      pushSnapshot(dualState);
    }
    setDualState((prev) => ({
      ...prev,
      palettes: {
        ...prev.palettes,
        [prev.activeMode]: {
          ...prev.palettes[prev.activeMode],
          custom: prev.palettes[prev.activeMode].custom.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        },
      },
    }));
  };

  const removeCustomSlot = (id: string) => {
    const existing = custom.find((s) => s.id === id);
    if (!existing) return;
    pushSnapshot(dualState);
    setDualState((prev) => ({
      ...prev,
      palettes: {
        ...prev.palettes,
        [prev.activeMode]: {
          ...prev.palettes[prev.activeMode],
          custom: prev.palettes[prev.activeMode].custom.filter((s) => s.id !== id),
        },
      },
    }));
  };

  const toggleCustomSlotLock = (id: string) => {
    setDualState((prev) => ({
      ...prev,
      palettes: {
        ...prev.palettes,
        [prev.activeMode]: {
          ...prev.palettes[prev.activeMode],
          custom: prev.palettes[prev.activeMode].custom.map((s) =>
            s.id === id ? { ...s, locked: !s.locked } : s
          ),
        },
      },
    }));
  };

  const randomizeUnlocked = () => {
    pushSnapshot(dualState);
    const availablePresets = PALETTE_PRESETS;
    const randomPreset: PalettePreset =
      availablePresets[Math.floor(Math.random() * availablePresets.length)];

    setDualState((prev) => {
      const currentActive = prev.palettes[prev.activeMode];
      const nextColors = { ...currentActive.colors };
      for (const role of SEMANTIC_ROLES) {
        if (!prev.locks[role]) {
          nextColors[role] = randomPreset.colors[role];
        }
      }
      const roleKeys: SemanticRole[] = ['primary', 'secondary', 'accent', 'text', 'background'];
      const nextCustom = currentActive.custom.map((slot) => {
        if (slot.locked) return slot;
        const randomKey = roleKeys[Math.floor(Math.random() * roleKeys.length)];
        return {
          ...slot,
          hex: randomPreset.colors[randomKey],
        };
      });

      return {
        ...prev,
        palettes: {
          ...prev.palettes,
          [prev.activeMode]: {
            colors: nextColors,
            custom: nextCustom,
          },
        },
      };
    });
  };

  const applyPreset = (presetId: string) => {
    const preset = PALETTE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    pushSnapshot(dualState);
    setDualState((prev) => {
      const isLight = prev.activeMode === 'light';
      const newActiveColors = { ...preset.colors };
      const currentCustom = prev.palettes[prev.activeMode].custom;
      const counterpart = isLight
        ? generateDarkPalette(newActiveColors, currentCustom)
        : generateLightPalette(newActiveColors, currentCustom);

      const newActivePalette: ModePalette = {
        colors: newActiveColors,
        custom: currentCustom,
      };

      return {
        ...prev,
        palettes: {
          light: isLight ? newActivePalette : counterpart,
          dark: isLight ? counterpart : newActivePalette,
        },
      };
    });
  };

  const importPalette = (
    newColors: Partial<PaletteColors>,
    newCustom?: CustomColorSlot[]
  ) => {
    pushSnapshot(dualState);
    setDualState((prev) => {
      const currentActive = prev.palettes[prev.activeMode];
      const mergedColors: PaletteColors = {
        ...currentActive.colors,
        ...newColors,
      };
      const mergedCustom =
        newCustom !== undefined ? newCustom : currentActive.custom;
      const isLight = prev.activeMode === 'light';
      const counterpart = isLight
        ? generateDarkPalette(mergedColors, mergedCustom)
        : generateLightPalette(mergedColors, mergedCustom);

      const newActivePalette: ModePalette = {
        colors: mergedColors,
        custom: mergedCustom,
      };

      return {
        ...prev,
        palettes: {
          light: isLight ? newActivePalette : counterpart,
          dark: isLight ? counterpart : newActivePalette,
        },
      };
    });
  };

  const resetToDefault = () => {
    pushSnapshot(dualState);
    setDualState({
      activeMode: 'light',
      palettes: {
        light: { colors: DEFAULT_COLORS, custom: [] },
        dark: generateDarkPalette(DEFAULT_COLORS, []),
      },
      locks: DEFAULT_LOCKS,
    });
  };

  // Memoized 50-950 shade scales for all 5 roles of the active palette
  const shadeScales = useMemo<RoleShadeScales>(() => {
    const computeSafeScale = (hex: string): ShadeScale => {
      try {
        return generateShadeScale(hex);
      } catch {
        return generateShadeScale('#3b82f6');
      }
    };

    return {
      text: computeSafeScale(colors.text),
      background: computeSafeScale(colors.background),
      primary: computeSafeScale(colors.primary),
      secondary: computeSafeScale(colors.secondary),
      accent: computeSafeScale(colors.accent),
    };
  }, [colors]);

  const shareableUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('colors', encodeColorsToParam(colors));
      if (activeMode === 'dark') {
        url.searchParams.set('mode', 'dark');
      } else {
        url.searchParams.delete('mode');
      }
      if (custom && custom.length > 0) {
        const encodedCustom = custom
          .map(
            (c) =>
              `${encodeURIComponent(c.id)}:${encodeURIComponent(c.name)}:${c.hex.replace(/^#/, '')}`
          )
          .join(',');
        url.searchParams.set('custom', encodedCustom);
      } else {
        url.searchParams.delete('custom');
      }
      return url.toString();
    } catch {
      return '';
    }
  }, [colors, custom, activeMode]);

  const state: PaletteState = useMemo(
    () => ({
      colors,
      locks,
      custom,
    }),
    [colors, locks, custom]
  );

  return (
    <PaletteContext.Provider
      value={{
        state,
        colors,
        locks,
        custom,
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
        activeMode,
        setActiveMode,
        palettes: dualState.palettes,
        setModePalette,
        generateCounterpart,
        applyDuality,
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
