import { fireEvent, render, screen } from '@testing-library/react';
import React, { useState } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { PaletteProvider } from '../../context/PaletteContext';
import { SemanticRole } from '../../core/palette';
import { ColorInspectorModal } from './ColorInspectorModal';

const TestInspectorHarness: React.FC<{ initialRole?: SemanticRole }> = ({ initialRole = 'primary' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Inspector</button>
      <ColorInspectorModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        targetRole={initialRole}
      />
    </div>
  );
};

describe('ColorInspectorModal (TT-028)', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('renders modal when open and can be closed via close button', () => {
    render(
      <PaletteProvider>
        <TestInspectorHarness />
      </PaletteProvider>
    );

    expect(screen.queryByText('Color Math & Shade Studio')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Open Inspector'));
    expect(screen.getByText('Color Math & Shade Studio')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Close dialog'));
    expect(screen.queryByText('Color Math & Shade Studio')).not.toBeInTheDocument();
  });

  it('closes on Escape key press', () => {
    render(
      <PaletteProvider>
        <TestInspectorHarness />
      </PaletteProvider>
    );

    fireEvent.click(screen.getByText('Open Inspector'));
    expect(screen.getByText('Color Math & Shade Studio')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByText('Color Math & Shade Studio')).not.toBeInTheDocument();
  });

  it('displays color conversions and allows editing color', () => {
    render(
      <PaletteProvider>
        <TestInspectorHarness />
      </PaletteProvider>
    );

    fireEvent.click(screen.getByText('Open Inspector'));

    expect(screen.getByText('HEX')).toBeInTheDocument();
    expect(screen.getByText('RGB')).toBeInTheDocument();
    expect(screen.getByText('HSL')).toBeInTheDocument();
    expect(screen.getByText('OKLCH')).toBeInTheDocument();
    expect(screen.getByText('Luminance')).toBeInTheDocument();

    // Edit color via hex input
    const hexInput = screen.getByLabelText(/Hex color value/i);
    fireEvent.change(hexInput, { target: { value: '#10b981' } });
    expect(hexInput).toHaveValue('#10b981');
  });

  it('allows switching inspected role inside modal', () => {
    render(
      <PaletteProvider>
        <TestInspectorHarness />
      </PaletteProvider>
    );

    fireEvent.click(screen.getByText('Open Inspector'));

    // Switch to Secondary
    const secondaryBtn = screen.getByRole('button', { name: /Secondary/i });
    fireEvent.click(secondaryBtn);

    // Header badge updates
    expect(screen.getAllByText('Secondary').length).toBeGreaterThanOrEqual(1);
  });

  it('toggles anchor mode between natural and locked to 500', () => {
    render(
      <PaletteProvider>
        <TestInspectorHarness />
      </PaletteProvider>
    );

    fireEvent.click(screen.getByText('Open Inspector'));

    const anchorBtn = screen.getByText('Natural Anchor');
    fireEvent.click(anchorBtn);
    expect(screen.getByText('Locked to 500')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Locked to 500'));
    expect(screen.getByText('Natural Anchor')).toBeInTheDocument();
  });

  it('toggles tonal scale expansion on and off', () => {
    render(
      <PaletteProvider>
        <TestInspectorHarness />
      </PaletteProvider>
    );

    fireEvent.click(screen.getByText('Open Inspector'));

    // By default tonal scale is expanded
    expect(screen.getByText('Hide Scale')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();

    // Click Hide Scale
    fireEvent.click(screen.getByText('Hide Scale'));
    expect(screen.getByText('Show Scale')).toBeInTheDocument();
    expect(screen.queryByText('500')).not.toBeInTheDocument();

    // Click Show Scale
    fireEvent.click(screen.getByText('Show Scale'));
    expect(screen.getByText('Hide Scale')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
  });
});
