import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';

describe('ThemeTool Shell & UI Integration', { timeout: 30000 }, () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('renders the ThemeTool heading and brand in header', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1, name: /ThemeTool/i });
    expect(heading).toBeInTheDocument();
    expect(screen.getByText('Universal Color & Theme Studio')).toBeInTheDocument();
  });

  it('renders export targets preview pills', () => {
    render(<App />);
    expect(screen.getAllByText('Material').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Tailwind').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Android').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('iOS').length).toBeGreaterThanOrEqual(1);
  });

  it('renders the compact hero and theme studio components directly without architecture tabs', () => {
    render(<App />);

    // Verifies the compact hero heading and studio sections render directly
    expect(screen.getByRole('heading', { level: 1, name: /ThemeTool/i })).toBeInTheDocument();
    expect(screen.queryByText('Modern Theme & Design System Studio')).not.toBeInTheDocument();
    expect(screen.getByText('Choose Base Palette')).toBeInTheDocument();
    expect(screen.getByText('Component & Platform Previews')).toBeInTheDocument();

    // System Architecture tab and view should no longer exist in the shell
    expect(screen.queryByRole('button', { name: /System Architecture view/i })).not.toBeInTheDocument();
    expect(screen.queryByText('Core Engine Modules')).not.toBeInTheDocument();
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

  it('opens the Color Math & Shade Studio on demand with conversions and 11 shade swatches', () => {
    render(<App />);
    expect(screen.queryByText('Color Math & Shade Studio')).not.toBeInTheDocument();

    // Click Inspect Shades on the Primary card
    const inspectButtons = screen.getAllByRole('button', { name: /Inspect/i });
    fireEvent.click(inspectButtons[0]);

    expect(screen.getByText('Color Math & Shade Studio')).toBeInTheDocument();
    expect(screen.getByText('HEX')).toBeInTheDocument();
    expect(screen.getByText('RGB')).toBeInTheDocument();
    expect(screen.getByText('HSL')).toBeInTheDocument();
    expect(screen.getByText('OKLCH')).toBeInTheDocument();

    // Check all 11 shade steps inside the inspector
    ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'].forEach((step) => {
      expect(screen.getByText(step)).toBeInTheDocument();
    });
  });

  it('allows clicking presets and toggling anchor modes inside the inspector', () => {
    render(<App />);
    const inspectButtons = screen.getAllByRole('button', { name: /Inspect/i });
    fireEvent.click(inspectButtons[0]);

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

  it('renders the Accessibility & WCAG Contrast Matrix with pairings and badges', () => {
    render(<App />);
    expect(screen.getByText('Accessibility & WCAG Contrast Matrix')).toBeInTheDocument();
    expect(screen.getByText('Text on Background')).toBeInTheDocument();
    expect(screen.getByText('Primary on Background')).toBeInTheDocument();
  });
});
