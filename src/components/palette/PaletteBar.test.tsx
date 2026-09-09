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

  it('manages custom extra color slots in unified grid: add, rename, pick color, inspect, lock, and delete', () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
      writable: true,
    });

    renderPaletteBar();

    // 5 core semantic roles are initially rendered in the grid
    expect(screen.getAllByText('Primary').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Secondary').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Accent').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Background').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Text').length).toBeGreaterThanOrEqual(1);

    // Click Add Color Slot
    const addSlotBtn = screen.getByLabelText('Add custom color slot');
    fireEvent.click(addSlotBtn);

    // Custom slot card appears directly in the unified grid
    const slotNameInput = screen.getByDisplayValue('Custom 1') as HTMLInputElement;
    expect(slotNameInput).toBeInTheDocument();

    // Rename slot
    fireEvent.change(slotNameInput, { target: { value: 'Brand Purple' } });
    expect(slotNameInput.value).toBe('Brand Purple');

    // Change slot hex code
    const slotHexInput = screen.getByLabelText('Brand Purple hex code') as HTMLInputElement;
    fireEvent.change(slotHexInput, { target: { value: '#9333ea' } });
    expect(slotHexInput.value).toBe('#9333ea');

    // Copy hex code with feedback
    const copyBtn = screen.getByLabelText('Copy Brand Purple hex code');
    fireEvent.click(copyBtn);
    expect(writeTextMock).toHaveBeenCalledWith('#9333ea');
    expect(copyBtn).toHaveAttribute('title', 'Copied to clipboard!');

    // Toggle lock
    const lockBtn = screen.getByLabelText('Toggle lock for Brand Purple');
    fireEvent.click(lockBtn);
    expect(lockBtn).toHaveAttribute('title', 'Locked (will not change on randomize)');

    // Inspect Shades for custom slot opens Shade Studio
    const inspectBtn = screen.getByLabelText('Inspect Brand Purple shades and color math');
    fireEvent.click(inspectBtn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Shade Studio')).toBeInTheDocument();
    expect(screen.getAllByText('Brand Purple').length).toBeGreaterThanOrEqual(1);

    // Close modal
    fireEvent.click(screen.getByLabelText('Close dialog'));

    // Delete slot
    const deleteBtn = screen.getByLabelText('Delete Brand Purple');
    fireEvent.click(deleteBtn);

    // Should be removed from document
    expect(screen.queryByDisplayValue('Brand Purple')).toBeNull();
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
