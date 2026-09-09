import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PaletteProvider } from '../../../context/PaletteContext';
import { MaterialM3Preview } from './MaterialM3Preview';

const renderM3Preview = (props = { isFocused: false }) => {
  return render(
    <PaletteProvider>
      <MaterialM3Preview {...props} />
    </PaletteProvider>
  );
};

describe('MaterialM3Preview (TT-012)', () => {
  it('renders top app bar, cards, text fields, selectors, buttons, and bottom navigation', () => {
    renderM3Preview();

    expect(screen.getByTestId('material-m3-preview')).toBeInTheDocument();
    expect(screen.getByTestId('m3-top-app-bar')).toBeInTheDocument();
    expect(screen.getByText('Material Design 3')).toBeInTheDocument();

    // 6 Button variants
    expect(screen.getByTestId('m3-btn-filled')).toBeInTheDocument();
    expect(screen.getByTestId('m3-btn-elevated')).toBeInTheDocument();
    expect(screen.getByTestId('m3-btn-tonal')).toBeInTheDocument();
    expect(screen.getByTestId('m3-btn-outlined')).toBeInTheDocument();
    expect(screen.getByTestId('m3-btn-text')).toBeInTheDocument();
    expect(screen.getByTestId('m3-btn-fab')).toBeInTheDocument();

    // 3 Cards
    expect(screen.getByTestId('m3-card-elevated')).toBeInTheDocument();
    expect(screen.getByTestId('m3-card-filled')).toBeInTheDocument();
    expect(screen.getByTestId('m3-card-outlined')).toBeInTheDocument();

    // Text fields
    expect(screen.getByTestId('m3-field-filled')).toBeInTheDocument();
    expect(screen.getByTestId('m3-field-outlined')).toBeInTheDocument();

    // Selectors
    expect(screen.getByTestId('m3-switch')).toBeInTheDocument();
    expect(screen.getByTestId('m3-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('m3-radio-1')).toBeInTheDocument();
    expect(screen.getByTestId('m3-radio-2')).toBeInTheDocument();

    // Bottom Navigation
    expect(screen.getByTestId('m3-bottom-nav')).toBeInTheDocument();
    expect(screen.getByTestId('m3-nav-home')).toBeInTheDocument();
    expect(screen.getByTestId('m3-nav-saved')).toBeInTheDocument();
    expect(screen.getByTestId('m3-nav-settings')).toBeInTheDocument();
  });

  it('handles interactive button clicks including FAB counter', () => {
    renderM3Preview();

    const fab = screen.getByTestId('m3-btn-fab');
    expect(fab).toHaveTextContent('FAB');

    fireEvent.click(fab);
    expect(fab).toHaveTextContent('FAB (1)');

    fireEvent.click(fab);
    expect(fab).toHaveTextContent('FAB (2)');
  });

  it('supports typing in filled and outlined text fields', () => {
    renderM3Preview();

    const filledInput = screen.getByTestId('m3-field-filled') as HTMLInputElement;
    fireEvent.change(filledInput, { target: { value: 'Custom Filled Text' } });
    expect(filledInput.value).toBe('Custom Filled Text');

    const outlinedInput = screen.getByTestId('m3-field-outlined') as HTMLInputElement;
    fireEvent.change(outlinedInput, { target: { value: 'Custom Outlined Text' } });
    expect(outlinedInput.value).toBe('Custom Outlined Text');
  });

  it('toggles filter chips on click', () => {
    renderM3Preview();

    const elevationChip = screen.getByTestId('m3-chip-elevation');
    expect(elevationChip).toBeInTheDocument();

    // Toggle chip off
    fireEvent.click(elevationChip);
    // Toggle chip back on
    fireEvent.click(elevationChip);
  });

  it('toggles switch, checkbox, and selects radio options', () => {
    renderM3Preview();

    const switchElem = screen.getByTestId('m3-switch');
    fireEvent.click(switchElem);

    const checkbox = screen.getByTestId('m3-checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'false');

    const radio2 = screen.getByTestId('m3-radio-2');
    fireEvent.click(radio2);
    expect(radio2).toHaveAttribute('aria-checked', 'true');
  });

  it('navigates bottom bar destinations', () => {
    renderM3Preview();

    const savedTab = screen.getByTestId('m3-nav-saved');
    fireEvent.click(savedTab);
    expect(screen.getByText('Saved')).toBeInTheDocument();

    const settingsTab = screen.getByTestId('m3-nav-settings');
    fireEvent.click(settingsTab);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders token specification grid when isFocused is true', () => {
    const { rerender } = renderM3Preview({ isFocused: false });
    expect(screen.queryByTestId('m3-token-specs')).toBeNull();

    rerender(
      <PaletteProvider>
        <MaterialM3Preview isFocused={true} />
      </PaletteProvider>
    );
    expect(screen.getByTestId('m3-token-specs')).toBeInTheDocument();
    expect(screen.getByText('Material 3 Token Derivations')).toBeInTheDocument();

    const exportBtn = screen.getByRole('button', { name: 'Export Android XML' });
    expect(exportBtn).toBeInTheDocument();
    fireEvent.click(exportBtn);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Export Android Material 3 Resources')).toBeInTheDocument();
  });
});
