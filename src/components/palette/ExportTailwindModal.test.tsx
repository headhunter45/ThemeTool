import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PaletteProvider } from '../../context/PaletteContext';
import * as tailwindExporter from '../../core/exporters/tailwind';
import { ExportTailwindModal } from './ExportTailwindModal';

describe('ExportTailwindModal (TT-015)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const renderModal = (isOpen = true, onClose = vi.fn()) => {
    return {
      ...render(
        <PaletteProvider>
          <ExportTailwindModal isOpen={isOpen} onClose={onClose} />
        </PaletteProvider>
      ),
      onClose,
    };
  };

  it('does not render when isOpen is false', () => {
    renderModal(false);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders modal dialog with Tailwind v4 by default', () => {
    renderModal(true);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Export Tailwind Theme')).toBeInTheDocument();
    expect(screen.getByText('v3 & v4 Ready')).toBeInTheDocument();
    expect(screen.getAllByText('theme.css').length).toBeGreaterThan(0);

    // Contains Tailwind v4 @theme directive
    expect(screen.getByText(/@theme\s*\{/)).toBeInTheDocument();
    expect(screen.getByText(/--color-primary:/)).toBeInTheDocument();
  });

  it('switches to Tailwind v3 JS config tab and changes filename & instructions', () => {
    renderModal(true);

    const v3Tab = screen.getByRole('button', { name: /Tailwind v3 \(JS Config\)/i });
    fireEvent.click(v3Tab);

    expect(screen.getAllByText('tailwind.config.js').length).toBeGreaterThan(0);
    expect(screen.getByText(/module\.exports\s*=/)).toBeInTheDocument();
    expect(screen.getByText(/How to use in Tailwind CSS v3/i)).toBeInTheDocument();

    // Format selector is now visible for v3
    const formatSelect = screen.getByLabelText('Tailwind v3 format');
    expect(formatSelect).toBeInTheDocument();
  });

  it('updates token prefix dynamically in generated code', () => {
    renderModal(true);

    const prefixInput = screen.getByLabelText('Color token prefix') as HTMLInputElement;
    fireEvent.change(prefixInput, { target: { value: 'brand-' } });

    // In v4, variables should now have brand- prefix
    expect(screen.getByText(/--color-brand-primary:/)).toBeInTheDocument();

    // Switch to v3 tab and check keys
    const v3Tab = screen.getByRole('button', { name: /Tailwind v3 \(JS Config\)/i });
    fireEvent.click(v3Tab);

    const codePreview = screen.getByTestId('tailwind-code-preview');
    expect(codePreview.textContent).toContain('"brand-primary":');
  });

  it('toggles 50–950 shade steps checkbox', () => {
    renderModal(true);

    const shadesCheckbox = screen.getByLabelText('50–950 Scales') as HTMLInputElement;
    expect(shadesCheckbox.checked).toBe(true);

    // Uncheck 50-950 scales
    fireEvent.click(shadesCheckbox);
    expect(shadesCheckbox.checked).toBe(false);

    // Primary 500 should not be present as an explicit scale step now
    expect(screen.queryByText(/--color-primary-500:/)).toBeNull();
    // But base primary should still exist
    expect(screen.getByText(/--color-primary:/)).toBeInTheDocument();
  });

  it('changes v3 format between CommonJS, ESM, and colors snippet', () => {
    renderModal(true);

    const v3Tab = screen.getByRole('button', { name: /Tailwind v3 \(JS Config\)/i });
    fireEvent.click(v3Tab);

    const formatSelect = screen.getByLabelText('Tailwind v3 format') as HTMLSelectElement;
    const codePreview = screen.getByTestId('tailwind-code-preview');

    // Default CommonJS
    expect(codePreview.textContent).toContain('module.exports =');

    // Switch to ESM
    fireEvent.change(formatSelect, { target: { value: 'esm' } });
    expect(codePreview.textContent).toContain('export default {');

    // Switch to snippet
    fireEvent.change(formatSelect, { target: { value: 'snippet' } });
    expect(codePreview.textContent).toContain('colors: {');
    expect(codePreview.textContent).not.toContain('export default');
  });

  it('copies active code to clipboard and updates button state', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    renderModal(true);

    const copyBtn = screen.getByRole('button', { name: /Copy Code/i });
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Copied to Clipboard!')).toBeInTheDocument();
  });

  it('triggers downloadTailwindFile on download button click', () => {
    const downloadSpy = vi.spyOn(tailwindExporter, 'downloadTailwindFile').mockImplementation(() => {});

    renderModal(true);

    const downloadBtn = screen.getByRole('button', { name: /Download theme\.css/i });
    fireEvent.click(downloadBtn);

    expect(downloadSpy).toHaveBeenCalledWith(
      expect.stringContaining('@theme'),
      'theme.css',
      'text/css;charset=utf-8'
    );

    // Switch to v3 tab and test download
    const v3Tab = screen.getByRole('button', { name: /Tailwind v3 \(JS Config\)/i });
    fireEvent.click(v3Tab);

    const downloadV3Btn = screen.getByRole('button', { name: /Download tailwind\.config\.js/i });
    fireEvent.click(downloadV3Btn);

    expect(downloadSpy).toHaveBeenCalledWith(
      expect.stringContaining('module.exports'),
      'tailwind.config.js',
      'application/javascript;charset=utf-8'
    );
  });

  it('invokes onClose when clicking close button or background overlay', () => {
    const { onClose } = renderModal(true);

    const closeBtn = screen.getByLabelText('Close modal');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);

    const overlay = screen.getByRole('dialog');
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
