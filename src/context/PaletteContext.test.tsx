import { act, renderHook } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PaletteProvider, usePalette } from './PaletteContext';

describe('PaletteContext', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.history.replaceState(null, '', '/');
  });

  it('initializes with 5 default semantic roles', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <PaletteProvider>{children}</PaletteProvider>
    );

    const { result } = renderHook(() => usePalette(), { wrapper });

    expect(result.current.colors.text).toBe('#0f172a');
    expect(result.current.colors.background).toBe('#f8fafc');
    expect(result.current.colors.primary).toBe('#3b82f6');
    expect(result.current.colors.secondary).toBe('#64748b');
    expect(result.current.colors.accent).toBe('#f59e0b');
  });

  it('updates a specific color role', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <PaletteProvider>{children}</PaletteProvider>
    );

    const { result } = renderHook(() => usePalette(), { wrapper });

    act(() => {
      result.current.setColor('primary', '#10b981');
    });

    expect(result.current.colors.primary).toBe('#10b981');
    // Shade scale should recompute
    expect(result.current.shadeScales.primary).toBeDefined();
    expect(result.current.shadeScales.primary['500']).toBeDefined();
  });

  it('manages role locks and respects them during randomize', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <PaletteProvider>{children}</PaletteProvider>
    );

    const { result } = renderHook(() => usePalette(), { wrapper });

    // Lock primary
    act(() => {
      result.current.setColor('primary', '#ff0055');
      result.current.setLock('primary', true);
    });

    expect(result.current.locks.primary).toBe(true);

    // Randomize unlocked
    act(() => {
      result.current.randomizeUnlocked();
    });

    // Primary should remain unchanged
    expect(result.current.colors.primary).toBe('#ff0055');
  });

  it('syncs state changes to URL search params', async () => {
    vi.useFakeTimers();
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState');

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <PaletteProvider>{children}</PaletteProvider>
    );

    const { result } = renderHook(() => usePalette(), { wrapper });

    act(() => {
      result.current.setColor('accent', '#ec4899');
    });

    // Fast-forward debounce
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(replaceStateSpy).toHaveBeenCalled();
    const lastCallUrl = replaceStateSpy.mock.calls[replaceStateSpy.mock.calls.length - 1][2] as string;
    expect(lastCallUrl).toContain('colors=');
    expect(lastCallUrl).toContain('ec4899');

    vi.useRealTimers();
  });

  it('loads palette from initial URL parameter if present', () => {
    window.history.replaceState(
      null,
      '',
      '/?colors=111111-222222-333333-444444-555555'
    );

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <PaletteProvider>{children}</PaletteProvider>
    );

    const { result } = renderHook(() => usePalette(), { wrapper });

    expect(result.current.colors.text).toBe('#111111');
    expect(result.current.colors.background).toBe('#222222');
    expect(result.current.colors.primary).toBe('#333333');
    expect(result.current.colors.secondary).toBe('#444444');
    expect(result.current.colors.accent).toBe('#555555');
  });
});
