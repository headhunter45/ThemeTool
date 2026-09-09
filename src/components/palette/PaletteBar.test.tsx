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

  it('renders Step 2: Experiment header title and has decoupled export buttons', () => {
    renderPaletteBar();

    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Experiment')).toBeInTheDocument();

    // Export buttons are decoupled from PaletteBar (moved to ExportSection)
    expect(screen.queryByLabelText('Export Theme JSON')).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Export Tailwind Theme/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Export Android Resources/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Export iOS Assets/i)).not.toBeInTheDocument();
  });

  it('switches between Light and Dark mode using mode switcher in toolbar', () => {
    renderPaletteBar();

    const lightBtn = screen.getByLabelText('Switch to Light mode palette');
    const darkBtn = screen.getByLabelText('Switch to Dark mode palette');

    expect(lightBtn).toBeInTheDocument();
    expect(darkBtn).toBeInTheDocument();

    // Click Dark mode
    fireEvent.click(darkBtn);
    // Background hex in dark mode should be dark surface (not #f8fafc)
    const bgInput = screen.getByLabelText('Background hex code') as HTMLInputElement;
    expect(bgInput.value).not.toBe('#f8fafc');

    // Click Light mode
    fireEvent.click(lightBtn);
    expect(bgInput.value).toBe('#f8fafc');
  });

  it('opens Dark Mode Duality Studio modal when clicking Duality button', () => {
    renderPaletteBar();

    const dualityBtn = screen.getByLabelText('Dark Mode Duality');
    fireEvent.click(dualityBtn);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Dark Mode Duality Studio')).toBeInTheDocument();
  });
});
