import {act, renderHook} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import {PREVIEW_STORAGE_KEYS} from './types';
import {usePreviewTargets} from './usePreviewTargets';

describe('usePreviewTargets (TT-009)', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('initializes with default mode "all" and all 4 targets visible', () => {
    const {result} = renderHook(() => usePreviewTargets());

    expect(result.current.mode).toBe('all');
    expect(result.current.visibleCount).toBe(4);
    expect(result.current.isTargetVisible('tailwind')).toBe(true);
    expect(result.current.isTargetVisible('material')).toBe(true);
    expect(result.current.isTargetVisible('android')).toBe(true);
    expect(result.current.isTargetVisible('ios')).toBe(true);
  });

  it('switches between "all" mode and single-platform focus mode', () => {
    const {result} = renderHook(() => usePreviewTargets());

    act(() => {
      result.current.setMode('android');
    });

    expect(result.current.mode).toBe('android');
    expect(result.current.visibleCount).toBe(1);
    expect(result.current.isTargetVisible('android')).toBe(true);
    expect(result.current.isTargetVisible('tailwind')).toBe(false);
    expect(result.current.isTargetVisible('ios')).toBe(false);

    // Switch back to all
    act(() => {
      result.current.setMode('all');
    });

    expect(result.current.mode).toBe('all');
    expect(result.current.visibleCount).toBe(4);
  });

  it('toggles visibility of individual targets in "all" mode', () => {
    const {result} = renderHook(() => usePreviewTargets());

    // Toggle material off
    act(() => {
      result.current.toggleTargetVisibility('material');
    });

    expect(result.current.visibleTargets.material).toBe(false);
    expect(result.current.isTargetVisible('material')).toBe(false);
    expect(result.current.visibleCount).toBe(3);

    // Toggle material back on
    act(() => {
      result.current.toggleTargetVisibility('material');
    });

    expect(result.current.visibleTargets.material).toBe(true);
    expect(result.current.isTargetVisible('material')).toBe(true);
    expect(result.current.visibleCount).toBe(4);
  });

  it('supports showAllTargets and hideAllTargets bulk operations', () => {
    const {result} = renderHook(() => usePreviewTargets());

    act(() => {
      result.current.hideAllTargets();
    });

    expect(result.current.visibleCount).toBe(0);
    expect(result.current.isTargetVisible('tailwind')).toBe(false);

    act(() => {
      result.current.showAllTargets();
    });

    expect(result.current.visibleCount).toBe(4);
    expect(result.current.isTargetVisible('tailwind')).toBe(true);
  });

  it('persists mode and visibility to localStorage across reloads', () => {
    const {result, unmount} = renderHook(() => usePreviewTargets());

    act(() => {
      result.current.setMode('material');
      result.current.toggleTargetVisibility('ios');
    });

    expect(window.localStorage.getItem(PREVIEW_STORAGE_KEYS.MODE))
        .toBe('material');
    const storedVisibility = JSON.parse(
        window.localStorage.getItem(PREVIEW_STORAGE_KEYS.VISIBILITY) || '{}');
    expect(storedVisibility.ios).toBe(false);

    unmount();

    // Re-render hook
    const {result: reloaded} = renderHook(() => usePreviewTargets());
    expect(reloaded.current.mode).toBe('material');
    expect(reloaded.current.visibleTargets.ios).toBe(false);
  });

  it('gracefully handles invalid JSON in localStorage', () => {
    window.localStorage.setItem(
        PREVIEW_STORAGE_KEYS.VISIBILITY, 'invalid-json{{{');
    window.localStorage.setItem(
        PREVIEW_STORAGE_KEYS.MODE, 'non-existent-target');

    const {result} = renderHook(() => usePreviewTargets());
    expect(result.current.mode).toBe('all');
    expect(result.current.visibleCount).toBe(4);
  });
});
