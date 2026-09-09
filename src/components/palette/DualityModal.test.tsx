import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PaletteProvider } from '../../context/PaletteContext';
import { DualityModal } from './DualityModal';

describe('DualityModal Component', () => {
  it('does not render when isOpen is false', () => {
    render(
      <PaletteProvider>
        <DualityModal isOpen={false} onClose={vi.fn()} />
      </PaletteProvider>
    );

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders modal dialog when isOpen is true with comparison matrix', () => {
    render(
      <PaletteProvider>
        <DualityModal isOpen={true} onClose={vi.fn()} />
      </PaletteProvider>
    );

    expect(screen.getByRole('dialog')).toBeDefined();
    expect(screen.getByText('Dark Mode Duality Studio')).toBeDefined();
    expect(screen.getByText('OKLCH Perceptual Math')).toBeDefined();
    expect(screen.getByText('Primary')).toBeDefined();
    expect(screen.getByText('Background')).toBeDefined();
  });

  it('displays WCAG contrast ratio audits for source and target', () => {
    render(
      <PaletteProvider>
        <DualityModal isOpen={true} onClose={vi.fn()} />
      </PaletteProvider>
    );

    expect(screen.getByText('WCAG Accessibility & Contrast Audits')).toBeDefined();
    expect(screen.getByText(/Source: Light Theme/i)).toBeDefined();
    expect(screen.getByText(/Generated: Dark Theme/i)).toBeDefined();
  });

  it('allows switching derivation direction', () => {
    render(
      <PaletteProvider>
        <DualityModal isOpen={true} onClose={vi.fn()} />
      </PaletteProvider>
    );

    const darkToLightBtn = screen.getByRole('button', { name: /Dark → Light/i });
    fireEvent.click(darkToLightBtn);

    expect(screen.getByText(/Source \(Dark\)/i)).toBeDefined();
    expect(screen.getByText(/Generated \(Light\)/i)).toBeDefined();
  });

  it('applies generated duality when clicked', () => {
    render(
      <PaletteProvider>
        <DualityModal isOpen={true} onClose={vi.fn()} />
      </PaletteProvider>
    );

    const applyBtn = screen.getByRole('button', { name: /Apply Generated Dark Palette/i });
    fireEvent.click(applyBtn);

    expect(screen.getByText(/Successfully applied generated DARK palette!/i)).toBeDefined();
  });

  it('applies duality, switches mode and closes when Apply & Switch Mode clicked', () => {
    const handleClose = vi.fn();
    render(
      <PaletteProvider>
        <DualityModal isOpen={true} onClose={handleClose} />
      </PaletteProvider>
    );

    const switchBtn = screen.getByRole('button', { name: /Apply & Switch Mode/i });
    fireEvent.click(switchBtn);

    expect(handleClose).toHaveBeenCalled();
  });

  it('calls onClose when close button or backdrop is clicked', () => {
    const handleClose = vi.fn();
    render(
      <PaletteProvider>
        <DualityModal isOpen={true} onClose={handleClose} />
      </PaletteProvider>
    );

    const closeBtn = screen.getByLabelText('Close Duality Studio');
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
