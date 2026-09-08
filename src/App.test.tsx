import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('ThemeTool Smoke Test', () => {
  it('renders the ThemeTool heading', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1, name: /ThemeTool/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders export targets preview pills', () => {
    render(<App />);
    expect(screen.getByText('Tailwind')).toBeInTheDocument();
    expect(screen.getByText('Android (XML)')).toBeInTheDocument();
    expect(screen.getByText('iOS (Swift)')).toBeInTheDocument();
  });
});
