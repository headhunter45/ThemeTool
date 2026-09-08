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
});

