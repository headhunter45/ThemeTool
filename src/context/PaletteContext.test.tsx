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

  it('imports full palette atomically and stores custom slots', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <PaletteProvider>{children}</PaletteProvider>
    );

    const { result } = renderHook(() => usePalette(), { wrapper });

    act(() => {
      result.current.importPalette(
        {
          text: '#6f2dbd',
          background: '#a663cc',
          primary: '#b298dc',
          secondary: '#b8d0eb',
          accent: '#b9faf8',
        },
        [
          { id: 'custom-1', name: 'Custom 6', hex: '#123456' },
        ]
      );
    });

    expect(result.current.colors.text).toBe('#6f2dbd');
    expect(result.current.colors.background).toBe('#a663cc');
    expect(result.current.colors.primary).toBe('#b298dc');
    expect(result.current.colors.secondary).toBe('#b8d0eb');
    expect(result.current.colors.accent).toBe('#b9faf8');
    expect(result.current.custom).toHaveLength(1);
    expect(result.current.custom[0].hex).toBe('#123456');
  });

  describe('TT-008: Undo / Redo History Stack', () => {
    it('tracks undo and redo state across color modifications', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <PaletteProvider>{children}</PaletteProvider>
      );

      const { result } = renderHook(() => usePalette(), { wrapper });

      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(false);

      const originalPrimary = result.current.colors.primary;

      act(() => {
        result.current.setColor('primary', '#e11d48');
      });

      expect(result.current.colors.primary).toBe('#e11d48');
      expect(result.current.canUndo).toBe(true);
      expect(result.current.canRedo).toBe(false);

      // Undo
      act(() => {
        result.current.undo();
      });

      expect(result.current.colors.primary).toBe(originalPrimary);
      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(true);

      // Redo
      act(() => {
        result.current.redo();
      });

      expect(result.current.colors.primary).toBe('#e11d48');
      expect(result.current.canUndo).toBe(true);
      expect(result.current.canRedo).toBe(false);
    });

    it('triggers undo and redo via keyboard shortcuts (Cmd+Z, Cmd+Shift+Z, Cmd+Y)', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <PaletteProvider>{children}</PaletteProvider>
      );

      const { result } = renderHook(() => usePalette(), { wrapper });
      const originalText = result.current.colors.text;

      act(() => {
        result.current.setColor('text', '#ffffff');
      });

      expect(result.current.colors.text).toBe('#ffffff');

      // Dispatch Cmd+Z
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', metaKey: true }));
      });

      expect(result.current.colors.text).toBe(originalText);

      // Dispatch Cmd+Shift+Z
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', metaKey: true, shiftKey: true }));
      });

      expect(result.current.colors.text).toBe('#ffffff');

      // Dispatch Ctrl+Z
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true }));
      });

      expect(result.current.colors.text).toBe(originalText);

      // Dispatch Ctrl+Y
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true }));
      });

      expect(result.current.colors.text).toBe('#ffffff');
    });

    it('ignores undo shortcut when active target is a text input', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <PaletteProvider>{children}</PaletteProvider>
      );

      const { result } = renderHook(() => usePalette(), { wrapper });

      act(() => {
        result.current.setColor('primary', '#123123');
      });

      const textInput = document.createElement('input');
      textInput.type = 'text';
      document.body.appendChild(textInput);

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'z', metaKey: true, bubbles: true });
        textInput.dispatchEvent(event);
      });

      // Should not have undone because target was an input
      expect(result.current.colors.primary).toBe('#123123');
      document.body.removeChild(textInput);
    });
  });

  describe('TT-008: Role Swap Tool', () => {
    it('swaps colors between any two semantic roles and records undo state', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <PaletteProvider>{children}</PaletteProvider>
      );

      const { result } = renderHook(() => usePalette(), { wrapper });

      const prevPrimary = result.current.colors.primary;
      const prevSecondary = result.current.colors.secondary;

      act(() => {
        result.current.swapRoles('primary', 'secondary');
      });

      expect(result.current.colors.primary).toBe(prevSecondary);
      expect(result.current.colors.secondary).toBe(prevPrimary);
      expect(result.current.canUndo).toBe(true);

      // Undo restores original roles
      act(() => {
        result.current.undo();
      });

      expect(result.current.colors.primary).toBe(prevPrimary);
      expect(result.current.colors.secondary).toBe(prevSecondary);
    });
  });

  describe('TT-008: Custom Extra Color Slots', () => {
    it('adds, updates, locks, and deletes custom color slots', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <PaletteProvider>{children}</PaletteProvider>
      );

      const { result } = renderHook(() => usePalette(), { wrapper });

      expect(result.current.custom).toHaveLength(0);

      // Add slot
      act(() => {
        result.current.addCustomSlot('Brand Tertiary', '#8b5cf6');
      });

      expect(result.current.custom).toHaveLength(1);
      const slotId = result.current.custom[0].id;
      expect(result.current.custom[0].name).toBe('Brand Tertiary');
      expect(result.current.custom[0].hex).toBe('#8b5cf6');
      expect(result.current.custom[0].locked).toBe(false);

      // Update slot name and hex
      act(() => {
        result.current.updateCustomSlot(slotId, { name: 'Brand Neon', hex: '#00ffcc' });
      });

      expect(result.current.custom[0].name).toBe('Brand Neon');
      expect(result.current.custom[0].hex).toBe('#00ffcc');

      // Toggle lock
      act(() => {
        result.current.toggleCustomSlotLock(slotId);
      });

      expect(result.current.custom[0].locked).toBe(true);

      // Randomize should NOT alter locked custom slot
      act(() => {
        result.current.randomizeUnlocked();
      });

      expect(result.current.custom[0].hex).toBe('#00ffcc');

      // Unlock and randomize alters custom slot
      act(() => {
        result.current.toggleCustomSlotLock(slotId);
      });
      expect(result.current.custom[0].locked).toBe(false);

      // Remove slot
      act(() => {
        result.current.removeCustomSlot(slotId);
      });

      expect(result.current.custom).toHaveLength(0);

      // Undo brings back slot
      act(() => {
        result.current.undo();
      });

      expect(result.current.custom).toHaveLength(1);
      expect(result.current.custom[0].id).toBe(slotId);
    });
  });
});
