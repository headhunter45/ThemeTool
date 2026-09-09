import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { PaletteProvider, usePalette } from '../../context/PaletteContext';
import { BasePaletteWorkflow } from './BasePaletteWorkflow';

const TestApp: React.FC = () => {
  const { colors } = usePalette();
  return (
    <div>
      <div data-testid="context-primary">{colors.primary}</div>
      <div data-testid="context-secondary">{colors.secondary}</div>
      <div data-testid="context-text">{colors.text}</div>
      <BasePaletteWorkflow />
    </div>
  );
};

describe('BasePaletteWorkflow (TT-026)', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('renders all 3 setup options on one section and does not mutate context without confirmation', () => {
    render(
      <PaletteProvider>
        <TestApp />
      </PaletteProvider>
    );

    expect(screen.getByText('Choose Base Palette')).toBeInTheDocument();
    expect(screen.getByLabelText(/Pick seed color/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Choose curated preset/i)).toBeInTheDocument();
    expect(screen.getByText(/Import URL \/ Code\.\.\./i)).toBeInTheDocument();
    expect(screen.getByText('Apply Palette')).toBeInTheDocument();

    const initialPrimary = screen.getByTestId('context-primary').textContent;

    // Change seed color in input
    const hexInput = screen.getByLabelText(/Seed color hex code/i);
    fireEvent.change(hexInput, { target: { value: '#e11d48' } });

    // Context should NOT have changed yet! (Requires confirmation button)
    expect(screen.getByTestId('context-primary').textContent).toBe(initialPrimary);
  });

  it('applies generated palette from seed color when Apply Palette is clicked and collapses section', async () => {
    render(
      <PaletteProvider>
        <TestApp />
      </PaletteProvider>
    );

    const hexInput = screen.getByLabelText(/Seed color hex code/i);
    fireEvent.change(hexInput, { target: { value: '#10b981' } });

    const applyBtn = screen.getByText('Apply Palette');
    fireEvent.click(applyBtn);

    // Active palette context should now be updated to emerald seed
    expect(screen.getByTestId('context-primary').textContent).toBe('#10b981');

    // Wait for the collapse timeout
    await act(async () => {
      await new Promise((r) => setTimeout(r, 450));
    });

    // The section should now be collapsed, showing 'Change Base'
    expect(screen.getByText('Change Base')).toBeInTheDocument();
    expect(screen.queryByLabelText(/Seed color hex code/i)).not.toBeInTheDocument();

    // Clicking the header expands the section back out
    fireEvent.click(screen.getByRole('button', { name: /Toggle Base Palette Setup/i }));
    expect(screen.getByLabelText(/Seed color hex code/i)).toBeInTheDocument();
  });

  it('loads preset into draft and commits on Apply Palette', () => {
    render(
      <PaletteProvider>
        <TestApp />
      </PaletteProvider>
    );

    const presetSelect = screen.getByLabelText(/Choose curated preset/i);
    fireEvent.change(presetSelect, { target: { value: 'emerald-forest' } });

    // Context shouldn't change yet
    expect(screen.getByTestId('context-primary').textContent).not.toBe('#059669');

    // Click Apply Palette
    fireEvent.click(screen.getByText('Apply Palette'));
    expect(screen.getByTestId('context-primary').textContent).toBe('#059669');
  });

  it('can toggle collapsed state by clicking the header', () => {
    render(
      <PaletteProvider>
        <TestApp />
      </PaletteProvider>
    );

    const header = screen.getByRole('button', { name: /Toggle Base Palette Setup/i });
    expect(screen.getByText('Collapse')).toBeInTheDocument();

    // Collapse
    fireEvent.click(header);
    expect(screen.getByText('Change Base')).toBeInTheDocument();
    expect(screen.queryByLabelText(/Seed color hex code/i)).not.toBeInTheDocument();

    // Expand
    fireEvent.click(header);
    expect(screen.getByText('Collapse')).toBeInTheDocument();
    expect(screen.getByLabelText(/Seed color hex code/i)).toBeInTheDocument();
  });
});
