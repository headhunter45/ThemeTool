import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PaletteProvider } from '../../context/PaletteContext';
import * as androidExporter from '../../core/exporters/android';
import { ExportAndroidModal } from './ExportAndroidModal';

describe('ExportAndroidModal (TT-016)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const renderModal = (isOpen = true, onClose = vi.fn()) => {
    return {
      ...render(
        <PaletteProvider>
          <ExportAndroidModal isOpen={isOpen} onClose={onClose} />
        </PaletteProvider>
      ),
      onClose,
    };
  };

  it('does not render when isOpen is false', () => {
    renderModal(false);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders modal dialog with colors.xml by default', () => {
    renderModal(true);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Export Android Material 3 Resources')).toBeInTheDocument();
    expect(screen.getByText('DayNight Ready')).toBeInTheDocument();
    expect(screen.getByText('res/values/colors.xml')).toBeInTheDocument();

    const preview = screen.getByTestId('android-code-preview');
    expect(preview.textContent).toContain('<resources>');
    expect(preview.textContent).toContain('<color name="primary">');
    expect(preview.textContent).toContain('<color name="md_theme_light_primary">');
    expect(preview.textContent).toContain('<color name="md_theme_dark_primary">');
  });

  it('switches between colors.xml, themes.xml (Light), and themes.xml (Night) tabs', () => {
    renderModal(true);

    // Switch to Light themes.xml
    const themesTab = screen.getByRole('button', { name: /themes\.xml \(Light\)/i });
    fireEvent.click(themesTab);

    expect(screen.getByText('res/values/themes.xml')).toBeInTheDocument();
    const lightPreview = screen.getByTestId('android-code-preview');
    expect(lightPreview.textContent).toContain('parent="Theme.Material3.DayNight.NoActionBar"');
    expect(lightPreview.textContent).toContain('@color/md_theme_light_primary');

    // Switch to Night themes.xml
    const nightThemesTab = screen.getByRole('button', { name: /themes\.xml \(Night\)/i });
    fireEvent.click(nightThemesTab);

    expect(screen.getByText('res/values-night/themes.xml')).toBeInTheDocument();
    const nightPreview = screen.getByTestId('android-code-preview');
    expect(nightPreview.textContent).toContain('parent="Theme.Material3.DayNight.NoActionBar"');
    expect(nightPreview.textContent).toContain('@color/md_theme_dark_primary');
  });

  it('updates theme name dynamically across both light and night themes', () => {
    renderModal(true);

    const themeNameInput = screen.getByLabelText('Android theme name') as HTMLInputElement;
    fireEvent.change(themeNameInput, { target: { value: 'Theme.MySuperApp' } });

    // Switch to Light themes
    const themesTab = screen.getByRole('button', { name: /themes\.xml \(Light\)/i });
    fireEvent.click(themesTab);

    const lightPreview = screen.getByTestId('android-code-preview');
    expect(lightPreview.textContent).toContain('<style name="Theme.MySuperApp"');

    // Switch to Night themes
    const nightThemesTab = screen.getByRole('button', { name: /themes\.xml \(Night\)/i });
    fireEvent.click(nightThemesTab);

    const nightPreview = screen.getByTestId('android-code-preview');
    expect(nightPreview.textContent).toContain('<style name="Theme.MySuperApp"');
  });

  it('toggles 50–950 shade steps checkbox', () => {
    renderModal(true);

    const preview = screen.getByTestId('android-code-preview');
    expect(preview.textContent).toContain('<color name="primary_500">');

    const shadesCheckbox = screen.getByLabelText('50–950 Scales') as HTMLInputElement;
    expect(shadesCheckbox.checked).toBe(true);

    // Uncheck
    fireEvent.click(shadesCheckbox);
    expect(shadesCheckbox.checked).toBe(false);

    expect(preview.textContent).not.toContain('<color name="primary_500">');
    // Base primary remains
    expect(preview.textContent).toContain('<color name="primary">');
  });

  it('copies XML snippet to clipboard with confirmation', () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    renderModal(true);

    const copyBtn = screen.getByRole('button', { name: /Copy XML Snippet/i });
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Copied to Clipboard!')).toBeInTheDocument();
  });

  it('triggers ZIP generation and download of android-theme-resources.zip', async () => {
    const fakeBlob = new Blob(['zip content'], { type: 'application/zip' });
    vi.spyOn(androidExporter, 'generateAndroidZip').mockResolvedValue(fakeBlob);
    const downloadSpy = vi.spyOn(androidExporter, 'downloadAndroidZip').mockImplementation(() => {});

    renderModal(true);

    const downloadZipBtn = screen.getByRole('button', { name: /Download android-theme-resources\.zip/i });
    await act(async () => {
      fireEvent.click(downloadZipBtn);
    });

    expect(downloadSpy).toHaveBeenCalledWith(fakeBlob, 'android-theme-resources.zip');
  });

  it('closes modal when clicking close button or backdrop', () => {
    const { onClose } = renderModal(true);

    const closeBtn = screen.getByLabelText('Close modal');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);

    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
