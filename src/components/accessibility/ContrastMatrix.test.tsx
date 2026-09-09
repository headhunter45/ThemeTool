import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PaletteProvider, usePalette } from '../../context/PaletteContext';
import { ContrastMatrix } from './ContrastMatrix';

const MatrixTestWrapper: React.FC = () => {
  return (
    <PaletteProvider>
      <ContrastMatrix />
    </PaletteProvider>
  );
};

// Helper component to add a custom slot for testing custom slots in ContrastMatrix
const MatrixWithCustomSlotWrapper: React.FC = () => {
  const { addCustomSlot } = usePalette();
  return (
    <div>
      <button
        type="button"
        onClick={() => addCustomSlot('Brand Neon', '#22c55e')}
      >
        Add Slot
      </button>
      <ContrastMatrix />
    </div>
  );
};

describe('ContrastMatrix (TT-019)', () => {
  it('renders the Step 4 Accessibility title and WCAG 2.1 badge', () => {
    render(<MatrixTestWrapper />);

    expect(screen.getByText('Step 4')).toBeInTheDocument();
    expect(screen.getByText('Accessibility')).toBeInTheDocument();
    expect(screen.getByText('WCAG 2.1')).toBeInTheDocument();
  });

  it('evaluates and displays all 5 key semantic role pairings', () => {
    render(<MatrixTestWrapper />);

    expect(screen.getByText('Text on Background')).toBeInTheDocument();
    expect(screen.getByText('Primary on Background')).toBeInTheDocument();
    expect(screen.getByText('Text on Primary button')).toBeInTheDocument();
    expect(screen.getByText('Text on Secondary')).toBeInTheDocument();
    expect(screen.getByText('Text on Accent')).toBeInTheDocument();
  });

  it('renders live visual sample swatches and contrast ratios for pairings', () => {
    render(<MatrixTestWrapper />);

    const textBgCard = screen.getByTestId('pairing-card-text-on-bg');
    expect(textBgCard).toBeInTheDocument();

    const swatch = screen.getByTestId('sample-swatch-text-on-bg');
    expect(swatch).toBeInTheDocument();
    expect(swatch).toHaveTextContent('Aa Normal Sample Text');
  });

  it('displays Normal and Large text status badges (AA / AAA / Fail)', () => {
    render(<MatrixTestWrapper />);

    // Text on Background with default slate colors is ~17:1 -> AAA Pass on both
    const textBgCard = screen.getByTestId('pairing-card-text-on-bg');
    expect(textBgCard).toHaveTextContent('AAA Pass');
    expect(textBgCard).toHaveTextContent('Meets WCAG AA standard');
  });

  it('shows Auto-Fix suggestion when a pairing fails AA Normal, and applies the fix on click', () => {
    render(<MatrixTestWrapper />);

    // In default palette, Primary (#3b82f6) on Background (#f8fafc) is ~3.8:1 (fails AA Normal 4.5:1)
    const primaryBgCard = screen.getByTestId('pairing-card-primary-on-bg');
    expect(primaryBgCard).toBeInTheDocument();
    expect(primaryBgCard).toHaveTextContent('OKLCH Auto-Fix Suggestion');

    const autoFixBtn = screen.getByLabelText(/Auto-fix Primary on Background to/i);
    expect(autoFixBtn).toBeInTheDocument();

    // Click Auto-Fix
    fireEvent.click(autoFixBtn);

    // After applying fix, Primary is adjusted to >= 4.5:1, meeting AA standard
    expect(primaryBgCard).toHaveTextContent('Meets WCAG AA standard');
  });

  it('shows Auto-Fix suggestion and applies fix for Text on Secondary pairing', () => {
    render(<MatrixTestWrapper />);

    const secondaryCard = screen.getByTestId('pairing-card-text-on-secondary');
    expect(secondaryCard).toBeInTheDocument();
    expect(secondaryCard).toHaveTextContent('OKLCH Auto-Fix Suggestion');

    const autoFixBtn = screen.getByLabelText(/Auto-fix Text on Secondary to/i);
    expect(autoFixBtn).toBeInTheDocument();

    fireEvent.click(autoFixBtn);

    expect(secondaryCard).toHaveTextContent('Meets WCAG AA standard');
  });

  it('includes custom color slots in the matrix when custom slots are present', () => {
    render(
      <PaletteProvider>
        <MatrixWithCustomSlotWrapper />
      </PaletteProvider>
    );

    const addBtn = screen.getByText('Add Slot');
    fireEvent.click(addBtn);

    expect(screen.getByText('Brand Neon on Background')).toBeInTheDocument();
  });
});
