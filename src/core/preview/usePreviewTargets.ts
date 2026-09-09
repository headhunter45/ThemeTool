import {useEffect, useState} from 'react';

import {DEFAULT_TARGET_VISIBILITY, PREVIEW_STORAGE_KEYS, PREVIEW_TARGET_IDS, PREVIEW_TARGETS, PreviewMode, PreviewTargetId, TargetMetadata,} from './types';

function getStoredMode(): PreviewMode {
  if (typeof window === 'undefined' || !window.localStorage) return 'all';
  try {
    const raw = window.localStorage.getItem(PREVIEW_STORAGE_KEYS.MODE);
    if (raw === 'all' ||
        (raw && PREVIEW_TARGET_IDS.includes(raw as PreviewTargetId))) {
      return raw as PreviewMode;
    }
  } catch {
    // Storage access failure fallback
  }
  return 'all';
}

function getStoredVisibility(): Record<PreviewTargetId, boolean> {
  if (typeof window === 'undefined' || !window.localStorage)
    return DEFAULT_TARGET_VISIBILITY;
  try {
    const raw = window.localStorage.getItem(PREVIEW_STORAGE_KEYS.VISIBILITY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        const result:
            Record<PreviewTargetId, boolean> = {...DEFAULT_TARGET_VISIBILITY};
        for (const id of PREVIEW_TARGET_IDS) {
          if (typeof parsed[id] === 'boolean') {
            result[id] = parsed[id];
          }
        }
        return result;
      }
    }
  } catch {
    // Parsing or storage error fallback
  }
  return DEFAULT_TARGET_VISIBILITY;
}

export interface UsePreviewTargetsReturn {
  mode: PreviewMode;
  setMode: (mode: PreviewMode) => void;
  visibleTargets: Record<PreviewTargetId, boolean>;
  toggleTargetVisibility: (id: PreviewTargetId) => void;
  showAllTargets: () => void;
  hideAllTargets: () => void;
  resetToDefaults: () => void;
  isTargetVisible: (id: PreviewTargetId) => boolean;
  visibleCount: number;
  allTargets: TargetMetadata[];
}

export function usePreviewTargets(): UsePreviewTargetsReturn {
  const [mode, setModeState] = useState<PreviewMode>(getStoredMode);
  const [visibleTargets, setVisibleTargets] =
      useState<Record<PreviewTargetId, boolean>>(getStoredVisibility);

  // Persist mode changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(PREVIEW_STORAGE_KEYS.MODE, mode);
    } catch {
      // Storage write error fallback
    }
  }, [mode]);

  // Persist visibility changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(
          PREVIEW_STORAGE_KEYS.VISIBILITY, JSON.stringify(visibleTargets));
    } catch {
      // Storage write error fallback
    }
  }, [visibleTargets]);

  const setMode = (newMode: PreviewMode) => {
    setModeState(newMode);
  };

  const toggleTargetVisibility = (id: PreviewTargetId) => {
    setVisibleTargets((prev) => ({
                        ...prev,
                        [id]: !prev[id],
                      }));
  };

  const showAllTargets = () => {
    setVisibleTargets({
      tailwind: true,
      react: true,
      angular: true,
      material: true,
      android: true,
      ios: true,
    });
  };

  const hideAllTargets = () => {
    setVisibleTargets({
      tailwind: false,
      react: false,
      angular: false,
      material: false,
      android: false,
      ios: false,
    });
  };

  const resetToDefaults = () => {
    setModeState('all');
    setVisibleTargets(DEFAULT_TARGET_VISIBILITY);
  };

  const isTargetVisible = (id: PreviewTargetId): boolean => {
    if (mode === 'all') {
      return !!visibleTargets[id];
    }
    return mode === id;
  };

  const visibleCount =
      PREVIEW_TARGET_IDS.filter((id) => isTargetVisible(id)).length;

  return {
    mode,
    setMode,
    visibleTargets,
    toggleTargetVisibility,
    showAllTargets,
    hideAllTargets,
    resetToDefaults,
    isTargetVisible,
    visibleCount,
    allTargets: PREVIEW_TARGETS,
  };
}
