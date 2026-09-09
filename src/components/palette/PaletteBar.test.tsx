import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PaletteProvider } from '../../context/PaletteContext';
import { PaletteBar } from './PaletteBar';

const renderPaletteBar = () => {
  return render(
    <PaletteProvider>
      <PaletteBar />
    </PaletteProvider>
  );
};

describe('PaletteBar (TT-008)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders toolbar with Undo, Redo, and Swap Roles buttons', () => {
    renderPaletteBar();

    const undoBtn = screen.getByLabelText('Undo palette action');
    const redoBtn = screen.getByLabelText('Redo palette action');
    const swapBtn = screen.getByLabelText('Quick role swap');

    expect(undoBtn).toBeInTheDocument();
    expect(undoBtn).toBeDisabled(); // Initially disabled at origin

    expect(redoBtn).toBeInTheDocument();
    expect(redoBtn).toBeDisabled(); // Initially disabled

    expect(swapBtn).toBeInTheDocument();
    expect(swapBtn).not.toBeDisabled();
  });

  it('enables Undo button after color edit and restores color upon click', () => {
    renderPaletteBar();

    const primaryHexInput = screen.getByLabelText('Primary hex code') as HTMLInputElement;
    const originalHex = primaryHexInput.value;

    // Change primary color
    fireEvent.change(primaryHexInput, { target: { value: '#e11d48' } });
    expect(primaryHexInput.value).toBe('#e11d48');

    const undoBtn = screen.getByLabelText('Undo palette action');
    expect(undoBtn).not.toBeDisabled();

    // Click Undo
    fireEvent.click(undoBtn);
    expect(primaryHexInput.value).toBe(originalHex);

    // Redo button is now enabled
    const redoBtn = screen.getByLabelText('Redo palette action');
    expect(redoBtn).not.toBeDisabled();

    // Click Redo
    fireEvent.click(redoBtn);
    expect(primaryHexInput.value).toBe('#e11d48');
  });

  it('opens Role Swap modal when clicking Swap Roles button', () => {
    renderPaletteBar();

    const swapBtn = screen.getByLabelText('Quick role swap');
    fireEvent.click(swapBtn);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Quick Role Swap')).toBeInTheDocument();
  });

  it('manages custom extra color slots: add, rename, pick color, lock, and delete', () => {
    renderPaletteBar();

    // Initially no custom color slots
    expect(screen.getByText(/No custom color slots added yet/i)).toBeInTheDocument();

    // Click Add Color Slot
    const addSlotBtn = screen.getByLabelText('Add custom color slot');
    fireEvent.click(addSlotBtn);

    // Empty state should disappear, custom slot card appears
    expect(screen.queryByText(/No custom color slots added yet/i)).toBeNull();

    // Rename slot
    const slotNameInput = screen.getByDisplayValue('Custom 1') as HTMLInputElement;
    fireEvent.change(slotNameInput, { target: { value: 'Brand Purple' } });
    expect(slotNameInput.value).toBe('Brand Purple');

    // Change slot hex code
    const slotHexInput = screen.getByLabelText('Brand Purple hex code') as HTMLInputElement;
    fireEvent.change(slotHexInput, { target: { value: '#9333ea' } });
    expect(slotHexInput.value).toBe('#9333ea');

    // Toggle lock
    const lockBtn = screen.getByLabelText('Toggle lock for Brand Purple');
    fireEvent.click(lockBtn);
    expect(lockBtn).toHaveAttribute('title', 'Locked (will not change on randomize)');

    // Delete slot
    const deleteBtn = screen.getByLabelText('Delete Brand Purple');
    fireEvent.click(deleteBtn);

    // Should return to empty state
    expect(screen.getByText(/No custom color slots added yet/i)).toBeInTheDocument();
  });

  it('opens Export Theme JSON modal when clicking Export JSON button', () => {
    renderPaletteBar();

    const exportBtn = screen.getByLabelText('Export Theme JSON');
    fireEvent.click(exportBtn);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Standard Theme JSON Exporter')).toBeInTheDocument();
  });

  it('opens Export Tailwind modal when clicking Export Tailwind button', () => {
    renderPaletteBar();

    const exportTailwindBtn = screen.getByLabelText(/Export Tailwind Theme/i);
    fireEvent.click(exportTailwindBtn);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Export Tailwind Theme')).toBeInTheDocument();
  });
});
