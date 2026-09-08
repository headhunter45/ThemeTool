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
      <div data-testid="active-secondary">{colors.secondary}</div>
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

    expect(screen.queryByText('Import Palette & Themes')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Open Modal'));
    expect(screen.getByText('Import Palette & Themes')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Close dialog'));
    expect(screen.queryByText('Import Palette & Themes')).not.toBeInTheDocument();
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

  it('populates Tailwind 3 sample, previews OKLCH scale, and imports into Primary', () => {
    render(
      <PaletteProvider>
        <TestContainer />
      </PaletteProvider>
    );

    fireEvent.click(screen.getByText('Open Modal'));
    fireEvent.click(screen.getByText('Tailwind 3 Sample'));

    expect(screen.getByText(/Tailwind v3 JS Object/i)).toBeInTheDocument();
    expect(screen.getByText(/Base 500: #b49c2c/i)).toBeInTheDocument();

    const importBtn = screen.getByText('Import to Palette');
    fireEvent.click(importBtn);

    expect(screen.getByTestId('active-primary').textContent).toBe('#b49c2c');
  });

  it('populates Tailwind 4 sample, allows role selection, and imports into Secondary', () => {
    render(
      <PaletteProvider>
        <TestContainer />
      </PaletteProvider>
    );

    fireEvent.click(screen.getByText('Open Modal'));
    fireEvent.click(screen.getByText('Tailwind 4 Sample'));

    expect(screen.getByText(/Tailwind v4 CSS Variables/i)).toBeInTheDocument();

    // Select secondary role
    const roleSelect = screen.getByLabelText(/Assign base color to role:/i);
    fireEvent.change(roleSelect, { target: { value: 'secondary' } });

    const importBtn = screen.getByText('Import to Palette');
    fireEvent.click(importBtn);

    expect(screen.getByTestId('active-secondary').textContent).toBe('#b49c2c');
  });

  it('populates UIColors URL sample and imports into active role', () => {
    render(
      <PaletteProvider>
        <TestContainer />
      </PaletteProvider>
    );

    fireEvent.click(screen.getByText('Open Modal'));
    fireEvent.click(screen.getByText('UIColors URL'));

    expect(screen.getByText(/UIColors\.app URL/i)).toBeInTheDocument();
    expect(screen.getByText(/Base 500: #b49c2c/i)).toBeInTheDocument();

    const importBtn = screen.getByText('Import to Palette');
    fireEvent.click(importBtn);

    expect(screen.getByTestId('active-primary').textContent).toBe('#b49c2c');
  });

  it('shows error message on unrecognized URL or snippet', () => {
    render(
      <PaletteProvider>
        <TestContainer />
      </PaletteProvider>
    );

    fireEvent.click(screen.getByText('Open Modal'));
    const input = screen.getByPlaceholderText(/Paste Coolors URL/i);
    fireEvent.change(input, { target: { value: 'https://google.com' } });

    expect(screen.getByText('Unrecognized format')).toBeInTheDocument();
  });
});
