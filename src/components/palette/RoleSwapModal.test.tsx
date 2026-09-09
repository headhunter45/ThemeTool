import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PaletteProvider } from '../../context/PaletteContext';
import { RoleSwapModal } from './RoleSwapModal';

const renderWithContext = (isOpen = true, onClose = vi.fn()) => {
  return render(
    <PaletteProvider>
      <RoleSwapModal isOpen={isOpen} onClose={onClose} />
    </PaletteProvider>
  );
};

describe('RoleSwapModal (TT-008)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('does not render when isOpen is false', () => {
    renderWithContext(false);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders modal dialog when isOpen is true', () => {
    renderWithContext(true);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Quick Role Swap')).toBeInTheDocument();
  });

  it('allows clicking quick preset swaps and inverting roles', () => {
    renderWithContext(true);

    // Click "Text ↔ Background" shortcut
    const textBgBtn = screen.getByRole('button', { name: /Text ↔ Background/i });
    fireEvent.click(textBgBtn);

    const roleASelect = screen.getByLabelText('First role to swap') as HTMLSelectElement;
    const roleBSelect = screen.getByLabelText('Second role to swap') as HTMLSelectElement;

    expect(roleASelect.value).toBe('text');
    expect(roleBSelect.value).toBe('background');

    // Invert roles
    const invertBtn = screen.getByLabelText('Invert role selection');
    fireEvent.click(invertBtn);

    expect(roleASelect.value).toBe('background');
    expect(roleBSelect.value).toBe('text');
  });

  it('disables swap button when identical roles are selected', () => {
    renderWithContext(true);

    const roleBSelect = screen.getByLabelText('Second role to swap') as HTMLSelectElement;
    fireEvent.change(roleBSelect, { target: { value: 'primary' } });

    const swapBtn = screen.getByRole('button', { name: /Swap Roles/i });
    expect(swapBtn).toBeDisabled();
    expect(screen.getByText(/Please select two different roles to perform a swap/i)).toBeInTheDocument();
  });

  it('executes role swap and closes modal on confirm', async () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    renderWithContext(true, onClose);

    const swapBtn = screen.getByRole('button', { name: /Swap Roles/i });
    expect(swapBtn).not.toBeDisabled();

    fireEvent.click(swapBtn);

    // Shows swapped status
    expect(screen.getByText('Swapped!')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(450);
    });
    expect(onClose).toHaveBeenCalled();

    vi.useRealTimers();
  });

  it('closes when clicking Cancel or pressing Escape', () => {
    const onClose = vi.fn();
    renderWithContext(true, onClose);

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
