import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { PaletteProvider, usePalette } from '../../context/PaletteContext';
import { ImportPaletteModal } from './ImportPaletteModal';

const TestContainer: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { colors } = usePalette();

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <div data-testid="active-primary">{colors.primary}</div>
      <div data-testid="active-text">{colors.text}</div>
      <ImportPaletteModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

describe('ImportPaletteModal', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('renders modal when open and can be closed', () => {
    render(
      <PaletteProvider>
        <TestContainer />
      </PaletteProvider>
    );

    expect(screen.queryByText('Import Palette from URL')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Open Modal'));
    expect(screen.getByText('Import Palette from URL')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Close dialog'));
    expect(screen.queryByText('Import Palette from URL')).not.toBeInTheDocument();
  });

  it('populates Coolors sample and previews detected colors', () => {
    render(
      <PaletteProvider>
        <TestContainer />
      </PaletteProvider>
    );

    fireEvent.click(screen.getByText('Open Modal'));
    fireEvent.click(screen.getByText('Coolors Sample'));

    expect(screen.getByText(/Coolors\.co Palette/i)).toBeInTheDocument();
    expect(screen.getByText(/5 colors detected/i)).toBeInTheDocument();
    expect(screen.getByText('#6f2dbd')).toBeInTheDocument();
  });

  it('imports Coolors palette on submit and updates active context', () => {
    render(
      <PaletteProvider>
        <TestContainer />
      </PaletteProvider>
    );

    fireEvent.click(screen.getByText('Open Modal'));
    fireEvent.click(screen.getByText('Coolors Sample'));

    const importBtn = screen.getByText('Import to Palette');
    fireEvent.click(importBtn);

    expect(screen.getByTestId('active-text').textContent).toBe('#6f2dbd');
    expect(screen.getByTestId('active-primary').textContent).toBe('#b298dc');
  });

  it('populates ColorKit sample URL and imports successfully', () => {
    render(
      <PaletteProvider>
        <TestContainer />
      </PaletteProvider>
    );

    fireEvent.click(screen.getByText('Open Modal'));
    fireEvent.click(screen.getByText('ColorKit Sample'));

    expect(screen.getByText(/ColorKit\.co Palette/i)).toBeInTheDocument();

    const importBtn = screen.getByText('Import to Palette');
    fireEvent.click(importBtn);

    expect(screen.getByTestId('active-text').textContent).toBe('#eebea0');
  });

  it('shows error message on unrecognized URL', () => {
    render(
      <PaletteProvider>
        <TestContainer />
      </PaletteProvider>
    );

    fireEvent.click(screen.getByText('Open Modal'));
    const input = screen.getByPlaceholderText(/https:\/\/coolors\.co\/palette/i);
    fireEvent.change(input, { target: { value: 'https://google.com' } });

    expect(screen.getByText('Unrecognized URL format')).toBeInTheDocument();
  });
});
