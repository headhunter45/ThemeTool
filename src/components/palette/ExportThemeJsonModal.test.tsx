import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PaletteProvider } from '../../context/PaletteContext';
import { ExportThemeJsonModal } from './ExportThemeJsonModal';

describe('ExportThemeJsonModal (TT-025)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    if (!URL.createObjectURL) {
      URL.createObjectURL = vi.fn().mockReturnValue('blob:http://localhost/mock-blob');
    }
    if (!URL.revokeObjectURL) {
      URL.revokeObjectURL = vi.fn();
    }
  });

  const renderModal = (isOpen = true, onClose = vi.fn()) => {
    return {
      ...render(
        <PaletteProvider>
          <ExportThemeJsonModal isOpen={isOpen} onClose={onClose} />
        </PaletteProvider>
      ),
      onClose,
    };
  };

  it('renders modal dialog with schema validity badge and formatted JSON', () => {
    renderModal(true);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Standard Theme JSON Exporter')).toBeInTheDocument();
    expect(screen.getByText('Schema Valid')).toBeInTheDocument();

    const preview = screen.getByTestId('theme-json-preview');
    expect(preview).toBeInTheDocument();
    expect(preview.textContent).toContain('https://headhunter45.github.io/ThemeTool/schema/themetool.schema.json');
    expect(preview.textContent).toContain('"generator": "ThemeTool"');
    expect(preview.textContent).toContain('"primary":');
  });

  it('does not render when isOpen is false', () => {
    renderModal(false);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('allows editing theme name and updates JSON metadata live', () => {
    renderModal(true);

    const nameInput = screen.getByLabelText('Theme Name') as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'Acme SaaS Dark' } });

    const preview = screen.getByTestId('theme-json-preview');
    expect(preview.textContent).toContain('"name": "Acme SaaS Dark"');
  });

  it('handles copying JSON to clipboard', () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    renderModal(true);

    const copyBtn = screen.getByRole('button', { name: 'Copy Theme JSON' });
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalled();
    expect(screen.getByText('Copied!')).toBeInTheDocument();
  });

  it('triggers file download of theme.json', () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const appendSpy = vi.spyOn(document.body, 'appendChild');
    const removeSpy = vi.spyOn(document.body, 'removeChild');

    renderModal(true);

    const downloadBtn = screen.getByRole('button', { name: 'Download theme.json' });
    fireEvent.click(downloadBtn);

    expect(clickSpy).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
  });

  it('switches to themetool.schema.json viewer tab', () => {
    renderModal(true);

    const schemaTab = screen.getByRole('button', { name: /themetool\.schema\.json/i });
    fireEvent.click(schemaTab);

    const schemaPreview = screen.getByTestId('schema-json-preview');
    expect(schemaPreview).toBeInTheDocument();
    expect(schemaPreview.textContent).toContain('ThemeToolTheme');
    expect(schemaPreview.textContent).toContain('http://json-schema.org/draft-07/schema#');
  });

  it('calls onClose when close button is clicked', () => {
    const { onClose } = renderModal(true);

    const closeBtn = screen.getByLabelText('Close export modal');
    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
