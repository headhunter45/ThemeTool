import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';

describe('ThemeTool Shell & UI Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('renders the ThemeTool heading and brand in header', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1, name: /ThemeTool/i });
    expect(heading).toBeInTheDocument();
    expect(screen.getByText('Universal Color & Theme Engine')).toBeInTheDocument();
  });

  it('renders export targets preview pills', () => {
    render(<App />);
    expect(screen.getByText('Tailwind')).toBeInTheDocument();
    expect(screen.getByText('Android (XML)')).toBeInTheDocument();
    expect(screen.getByText('iOS (Swift)')).toBeInTheDocument();
  });

  it('renders architecture modules including TT-024 and TT-003', () => {
    render(<App />);
    expect(screen.getByText('UI Shell & Theme')).toBeInTheDocument();
    expect(screen.getByText('Color Math & Shade Engine')).toBeInTheDocument();
  });

  it('interacts with the theme toggle and switches themes', () => {
    render(<App />);
    const darkButton = screen.getByRole('button', { name: /switch to dark theme/i });
    const lightButton = screen.getByRole('button', { name: /switch to light theme/i });

    expect(darkButton).toBeInTheDocument();
    expect(lightButton).toBeInTheDocument();

    fireEvent.click(darkButton);
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    fireEvent.click(lightButton);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('renders the Color Math & Shade Studio with conversions and 11 shade swatches', () => {
    render(<App />);
    expect(screen.getByText('Color Math & Shade Studio')).toBeInTheDocument();
    expect(screen.getByText('HEX')).toBeInTheDocument();
    expect(screen.getByText('RGB')).toBeInTheDocument();
    expect(screen.getByText('HSL')).toBeInTheDocument();
    expect(screen.getByText('OKLCH')).toBeInTheDocument();

    // Check all 11 shade steps
    ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'].forEach((step) => {
      expect(screen.getByText(step)).toBeInTheDocument();
    });
  });

  it('allows clicking presets and toggling anchor modes', () => {
    render(<App />);
    const emeraldPreset = screen.getAllByRole('button', { name: /Emerald/i })[0];
    fireEvent.click(emeraldPreset);

    const input = screen.getByLabelText(/Hex color value/i) as HTMLInputElement;
    expect(input.value).toBe('#10b981');

    const anchorButton = screen.getByRole('button', { name: /Natural Anchor|Locked to 500/i });
    expect(anchorButton).toBeInTheDocument();
    fireEvent.click(anchorButton);
    expect(screen.getByText('Locked to 500')).toBeInTheDocument();
  });

  it('renders the 5 semantic roles in PaletteBar and supports randomize and lock', () => {
    render(<App />);
    expect(screen.getByText('Active Semantic Palette')).toBeInTheDocument();

    // Check roles
    expect(screen.getAllByText('Text').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Background').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Primary').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Secondary').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Accent').length).toBeGreaterThanOrEqual(1);

    // Check action buttons
    expect(screen.getByRole('button', { name: /Randomize/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Share URL/i })).toBeInTheDocument();

    // Toggle lock for Primary
    const primaryLockBtn = screen.getByRole('button', { name: /Toggle lock for Primary/i });
    fireEvent.click(primaryLockBtn);
    expect(primaryLockBtn).toHaveAttribute('title', 'Locked (will not change on randomize)');
  });
});
