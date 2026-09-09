import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PaletteProvider } from '../../context/PaletteContext';
import * as androidExporter from '../../core/exporters/android';
import * as iosExporter from '../../core/exporters/ios';
import { ExportSection } from './ExportSection';

const renderExportSection = () => {
  return render(
    <PaletteProvider>
      <ExportSection />
    </PaletteProvider>
  );
};

describe('ExportSection Component (TT-031)', { timeout: 30000 }, () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
    if (!URL.createObjectURL) {
      URL.createObjectURL = vi.fn().mockReturnValue('blob:http://localhost/mock-blob');
    }
    if (!URL.revokeObjectURL) {
      URL.revokeObjectURL = vi.fn();
    }
  });

  it('renders Step 5 title and all 5 compact export target cards without descriptions or category badges', () => {
    renderExportSection();

    expect(screen.getByText('Step 5')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /^Export$/i })).toBeInTheDocument();

    // Verify 5 platform card titles
    expect(screen.getByText('Web')).toBeInTheDocument();
    expect(screen.getByText('Android')).toBeInTheDocument();
    expect(screen.getByText('iOS')).toBeInTheDocument();
    expect(screen.getByText('Theme JSON')).toBeInTheDocument();
    expect(screen.getByText('Shareable URL')).toBeInTheDocument();

    // Verify removed badges are absent
    expect(screen.queryByText('Web / CSS')).not.toBeInTheDocument();
    expect(screen.queryByText('Mobile / XML')).not.toBeInTheDocument();
    expect(screen.queryByText('Mobile / Swift')).not.toBeInTheDocument();
    expect(screen.queryByText('Tokens / Schema')).not.toBeInTheDocument();
    expect(screen.queryByText('Link / Bookmark')).not.toBeInTheDocument();
  });

  it('opens Web export modal on click', () => {
    renderExportSection();

    const webBtn = screen.getByRole('button', { name: 'Export Web' });
    fireEvent.click(webBtn);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Export Tailwind Theme/i)).toBeInTheDocument();
  });

  it('supports direct Android ZIP download and opening options dialog', async () => {
    const fakeBlob = new Blob(['zip content'], { type: 'application/zip' });
    vi.spyOn(androidExporter, 'generateAndroidZip').mockResolvedValue(fakeBlob);
    const downloadZipSpy = vi.spyOn(androidExporter, 'downloadAndroidZip').mockImplementation(() => {});
    renderExportSection();

    // Test direct ZIP download button
    const downloadBtn = screen.getByRole('button', { name: 'Download Android ZIP' });
    await act(async () => {
      fireEvent.click(downloadBtn);
    });
    expect(downloadZipSpy).toHaveBeenCalledWith(fakeBlob, 'android-theme-resources.zip');

    // Test options dialog
    const optionsBtn = screen.getByRole('button', { name: 'Export Android' });
    fireEvent.click(optionsBtn);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Export Android Material 3 Resources/i)).toBeInTheDocument();
  });

  it('supports direct iOS Assets download, Swift code download, and options dialog', async () => {
    const fakeBlob = new Blob(['zip content'], { type: 'application/zip' });
    vi.spyOn(iosExporter, 'generateIosZip').mockResolvedValue(fakeBlob);
    const downloadIosZipSpy = vi.spyOn(iosExporter, 'downloadIosZip').mockImplementation(() => {});
    const downloadSwiftSpy = vi.spyOn(iosExporter, 'downloadSwiftFile').mockImplementation(() => {});
    renderExportSection();

    // Test direct Assets download
    const assetsBtn = screen.getByRole('button', { name: 'Download iOS Assets' });
    await act(async () => {
      fireEvent.click(assetsBtn);
    });
    expect(downloadIosZipSpy).toHaveBeenCalledWith(fakeBlob, 'ios-theme-assets.zip');

    // Test direct Swift download
    const swiftBtn = screen.getByRole('button', { name: 'Download Swift' });
    fireEvent.click(swiftBtn);
    expect(downloadSwiftSpy).toHaveBeenCalledWith(expect.any(String), 'Theme.swift');

    // Test options dialog
    const optionsBtn = screen.getByRole('button', { name: 'Export iOS' });
    fireEvent.click(optionsBtn);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Export iOS Theme Assets/i)).toBeInTheDocument();
  });

  it('supports direct JSON download and Schema & Docs modal', () => {
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    renderExportSection();

    // Test direct JSON download button
    const downloadBtn = screen.getByRole('button', { name: 'Download JSON' });
    expect(downloadBtn).toBeInTheDocument();
    fireEvent.click(downloadBtn);

    // Test Schema & Docs button
    const docsBtn = screen.getByRole('button', { name: 'Schema & Docs' });
    fireEvent.click(docsBtn);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Standard Theme JSON Exporter/i)).toBeInTheDocument();
  });

  it('copies shareable URL automatically to clipboard on click and shows Copied state', () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
      writable: true,
    });

    renderExportSection();

    const copyBtn = screen.getByRole('button', { name: 'Copy Share URL' });
    expect(copyBtn).toHaveTextContent('Copy Link');

    fireEvent.click(copyBtn);
    expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining('colors='));
    expect(screen.getByText('Copied!')).toBeInTheDocument();
  });
});
