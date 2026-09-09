import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PaletteProvider } from '../../context/PaletteContext';
import * as iosExporter from '../../core/exporters/ios';
import { ExportIosModal } from './ExportIosModal';

describe('ExportIosModal (TT-017)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const renderModal = (isOpen = true, onClose = vi.fn()) => {
    return {
      ...render(
        <PaletteProvider>
          <ExportIosModal isOpen={isOpen} onClose={onClose} />
        </PaletteProvider>
      ),
      onClose,
    };
  };

  it('does not render when isOpen is false', () => {
    renderModal(false);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders modal dialog with Theme.swift by default', () => {
    renderModal(true);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Export iOS Theme Assets')).toBeInTheDocument();
    expect(screen.getByText('SwiftUI & xcassets')).toBeInTheDocument();
    expect(screen.getAllByText('Theme.swift').length).toBeGreaterThan(0);

    const preview = screen.getByTestId('ios-code-preview');
    expect(preview.textContent).toContain('import SwiftUI');
    expect(preview.textContent).toContain('public extension Color');
    expect(preview.textContent).toContain('static let themePrimary = Color(');
    expect(preview.textContent).toContain('#if canImport(UIKit)');
    expect(preview.textContent).toContain('public extension UIColor');
  });

  it('switches between Theme.swift and Colors.xcassets tabs', () => {
    renderModal(true);

    const xcassetsTab = screen.getByRole('button', { name: /Colors\.xcassets/i });
    fireEvent.click(xcassetsTab);

    expect(screen.getAllByText('Colors.xcassets').length).toBeGreaterThan(0);
    const preview = screen.getByTestId('ios-code-preview');
    expect(preview.textContent).toContain('Colors.xcassets Directory Structure');
    expect(preview.textContent).toContain('"color-space": "srgb"');
    expect(preview.textContent).toContain('"author": "xcode"');

    // Switch back to Theme.swift
    const swiftTab = screen.getByRole('button', { name: /Theme\.swift/i });
    fireEvent.click(swiftTab);
    expect(screen.getByTestId('ios-code-preview').textContent).toContain('import SwiftUI');
  });

  it('updates token prefix dynamically in Swift code', () => {
    renderModal(true);

    const prefixInput = screen.getByLabelText('Swift identifier prefix') as HTMLInputElement;
    fireEvent.change(prefixInput, { target: { value: 'brand' } });

    const preview = screen.getByTestId('ios-code-preview');
    expect(preview.textContent).toContain('static let brandPrimary = Color(');
    expect(preview.textContent).toContain('static let brandSecondary = Color(');
  });

  it('toggles 50–950 shade scales on and off', () => {
    renderModal(true);

    const preview = screen.getByTestId('ios-code-preview');
    expect(preview.textContent).toContain('themePrimary500');

    const shadesCheckbox = screen.getByLabelText('50–950 Scales') as HTMLInputElement;
    expect(shadesCheckbox.checked).toBe(true);

    fireEvent.click(shadesCheckbox);
    expect(shadesCheckbox.checked).toBe(false);

    expect(preview.textContent).not.toContain('themePrimary500');
    expect(preview.textContent).toContain('static let themePrimary = Color(');
  });

  it('toggles UIKit extensions on and off', () => {
    renderModal(true);

    const preview = screen.getByTestId('ios-code-preview');
    expect(preview.textContent).toContain('#if canImport(UIKit)');
    expect(preview.textContent).toContain('public extension UIColor');

    const uikitCheckbox = screen.getByLabelText('UIKit Extensions') as HTMLInputElement;
    expect(uikitCheckbox.checked).toBe(true);

    fireEvent.click(uikitCheckbox);
    expect(uikitCheckbox.checked).toBe(false);

    expect(preview.textContent).not.toContain('#if canImport(UIKit)');
    expect(preview.textContent).not.toContain('public extension UIColor');
  });

  it('copies code snippet to clipboard with confirmation', () => {
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

  it('triggers single Theme.swift download', () => {
    const downloadSwiftSpy = vi.spyOn(iosExporter, 'downloadSwiftFile').mockImplementation(() => {});

    renderModal(true);

    const downloadSwiftBtn = screen.getByRole('button', { name: /Download Theme\.swift/i });
    fireEvent.click(downloadSwiftBtn);

    expect(downloadSwiftSpy).toHaveBeenCalledWith(
      expect.stringContaining('import SwiftUI'),
      'Theme.swift'
    );
  });

  it('triggers ZIP generation and download of ios-theme-assets.zip', async () => {
    const fakeBlob = new Blob(['zip'], { type: 'application/zip' });
    vi.spyOn(iosExporter, 'generateIosZip').mockResolvedValue(fakeBlob);
    const downloadZipSpy = vi.spyOn(iosExporter, 'downloadIosZip').mockImplementation(() => {});

    renderModal(true);

    const downloadZipBtn = screen.getByRole('button', { name: /Download Assets ZIP/i });
    await act(async () => {
      fireEvent.click(downloadZipBtn);
    });

    expect(downloadZipSpy).toHaveBeenCalledWith(fakeBlob, 'ios-theme-assets.zip');
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
