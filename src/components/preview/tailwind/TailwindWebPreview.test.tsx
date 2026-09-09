import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PaletteProvider } from '../../../context/PaletteContext';
import { TailwindWebPreview } from './TailwindWebPreview';

describe('TailwindWebPreview (TT-010)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const renderTailwindPreview = (props = { isFocused: false }) => {
    return render(
      <PaletteProvider>
        <TailwindWebPreview {...props} />
      </PaletteProvider>
    );
  };

  it('renders marketing hero, buttons, alert banner, stats, and form controls', () => {
    renderTailwindPreview();

    expect(screen.getByTestId('tailwind-web-preview')).toBeInTheDocument();
    expect(screen.getByTestId('tailwind-alert-banner')).toBeInTheDocument();
    expect(screen.getByTestId('tailwind-eyebrow-badge')).toHaveTextContent('Tailwind Web UI');

    // Hero buttons
    expect(screen.getByTestId('tailwind-btn-primary')).toBeInTheDocument();
    expect(screen.getByTestId('tailwind-btn-secondary')).toBeInTheDocument();
    expect(screen.getByTestId('tailwind-btn-link')).toBeInTheDocument();

    // Stats
    expect(screen.getByTestId('tailwind-stat-1')).toBeInTheDocument();
    expect(screen.getByTestId('tailwind-stat-2')).toBeInTheDocument();
    expect(screen.getByTestId('tailwind-stat-3')).toBeInTheDocument();

    // Form inputs
    expect(screen.getByTestId('tailwind-input-text')).toBeInTheDocument();
    expect(screen.getByTestId('tailwind-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('tailwind-switch')).toBeInTheDocument();
  });

  it('handles button click counter on primary CTA', () => {
    renderTailwindPreview();

    const primaryBtn = screen.getByTestId('tailwind-btn-primary');
    expect(primaryBtn).toHaveTextContent('Primary CTA');

    fireEvent.click(primaryBtn);
    expect(primaryBtn).toHaveTextContent('Primary CTA (1)');

    fireEvent.click(primaryBtn);
    expect(primaryBtn).toHaveTextContent('Primary CTA (2)');
  });

  it('allows typing into email input field', () => {
    renderTailwindPreview();

    const input = screen.getByTestId('tailwind-input-text') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'user@example.com' } });
    expect(input.value).toBe('user@example.com');
  });

  it('toggles checkbox and switch controls', () => {
    renderTailwindPreview();

    const checkbox = screen.getByTestId('tailwind-checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'false');

    const switchControl = screen.getByTestId('tailwind-switch');
    expect(switchControl).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(switchControl);
    expect(switchControl).toHaveAttribute('aria-checked', 'false');
  });

  it('dismisses and restores alert banner', () => {
    renderTailwindPreview();

    expect(screen.getByTestId('tailwind-alert-banner')).toBeInTheDocument();

    const dismissBtn = screen.getByLabelText('Dismiss alert');
    fireEvent.click(dismissBtn);

    expect(screen.queryByTestId('tailwind-alert-banner')).toBeNull();

    const restoreBtn = screen.getByRole('button', { name: /Show Alert/i });
    fireEvent.click(restoreBtn);

    expect(screen.getByTestId('tailwind-alert-banner')).toBeInTheDocument();
  });

  it('renders Tailwind theme token inspector only when isFocused is true', () => {
    const { rerender } = renderTailwindPreview({ isFocused: false });
    expect(screen.queryByTestId('tailwind-focused-inspector')).toBeNull();

    rerender(
      <PaletteProvider>
        <TailwindWebPreview isFocused={true} />
      </PaletteProvider>
    );

    const inspector = screen.getByTestId('tailwind-focused-inspector');
    expect(inspector).toBeInTheDocument();
    expect(inspector.textContent).toContain('@theme');
    expect(inspector.textContent).toContain('--color-primary:');
  });

  it('copies Tailwind snippet to clipboard in focused mode', () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    renderTailwindPreview({ isFocused: true });

    const copyBtn = screen.getByRole('button', { name: 'Copy CSS' });
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining('@theme'));
    expect(screen.getByText('Copied!')).toBeInTheDocument();
  });
});
