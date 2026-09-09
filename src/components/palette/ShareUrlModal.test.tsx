import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PaletteProvider } from '../../context/PaletteContext';
import { DEFAULT_BASE_URL, LOCAL_DEV_BASE_URL, STORAGE_KEY_BASE_URL } from '../../core/exporters/shareUrl';
import { ShareUrlModal } from './ShareUrlModal';

const renderModal = (props: { isOpen: boolean; onClose: () => void }) => {
  return render(
    <PaletteProvider>
      <ShareUrlModal {...props} />
    </PaletteProvider>
  );
};

describe('ShareUrlModal (TT-018)', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    onClose.mockClear();
  });

  it('does not render when isOpen is false', () => {
    renderModal({ isOpen: false, onClose });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders correctly when isOpen is true with default GitHub Pages base URL', () => {
    renderModal({ isOpen: true, onClose });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Shareable Palette URL')).toBeInTheDocument();

    const input = screen.getByLabelText('Base URL') as HTMLInputElement;
    expect(input.value).toBe(DEFAULT_BASE_URL);

    const preview = screen.getByTestId('shareable-url-preview');
    expect(preview.textContent).toContain(DEFAULT_BASE_URL);
    expect(preview.textContent).toContain('colors=');
  });

  it('loads base URL from localStorage if present', () => {
    localStorage.setItem(STORAGE_KEY_BASE_URL, 'https://mysite.com/theme/');
    renderModal({ isOpen: true, onClose });

    const input = screen.getByLabelText('Base URL') as HTMLInputElement;
    expect(input.value).toBe('https://mysite.com/theme/');

    const preview = screen.getByTestId('shareable-url-preview');
    expect(preview.textContent).toContain('https://mysite.com/theme/?');
  });

  it('allows clicking preset buttons to switch base URL and persists to localStorage', () => {
    renderModal({ isOpen: true, onClose });

    const input = screen.getByLabelText('Base URL') as HTMLInputElement;

    // Click Local Dev preset
    const localDevBtn = screen.getByText(/Local Dev/i);
    fireEvent.click(localDevBtn);

    expect(input.value).toBe(LOCAL_DEV_BASE_URL);
    expect(localStorage.getItem(STORAGE_KEY_BASE_URL)).toBe(LOCAL_DEV_BASE_URL);

    const preview = screen.getByTestId('shareable-url-preview');
    expect(preview.textContent).toContain(LOCAL_DEV_BASE_URL);

    // Click GitHub Pages preset
    const ghPagesBtn = screen.getByText(/GitHub Pages/i);
    fireEvent.click(ghPagesBtn);

    expect(input.value).toBe(DEFAULT_BASE_URL);
    expect(localStorage.getItem(STORAGE_KEY_BASE_URL)).toBe(DEFAULT_BASE_URL);
  });

  it('allows manual editing of the base URL and clicking reset to default', () => {
    renderModal({ isOpen: true, onClose });

    const input = screen.getByLabelText('Base URL') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'https://staging.mytool.app/' } });

    expect(input.value).toBe('https://staging.mytool.app/');
    expect(localStorage.getItem(STORAGE_KEY_BASE_URL)).toBe('https://staging.mytool.app/');

    const preview = screen.getByTestId('shareable-url-preview');
    expect(preview.textContent).toContain('https://staging.mytool.app/?');

    // Click Reset to default
    const resetBtn = screen.getByText('Reset to default');
    fireEvent.click(resetBtn);

    expect(input.value).toBe(DEFAULT_BASE_URL);
    expect(localStorage.getItem(STORAGE_KEY_BASE_URL)).toBe(DEFAULT_BASE_URL);
  });

  it('copies generated URL to clipboard when clicking Copy button', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    renderModal({ isOpen: true, onClose });

    const copyBtn = screen.getByText('Copy Shareable Link');
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledTimes(1);
    expect(writeTextMock.mock.calls[0][0]).toContain(DEFAULT_BASE_URL);
    expect(writeTextMock.mock.calls[0][0]).toContain('colors=');

    // Feedback state shows Copied Link!
    expect(screen.getByText('Copied Link!')).toBeInTheDocument();
  });

  it('opens URL in new tab when clicking Open in New Tab button', () => {
    const openMock = vi.fn();
    vi.stubGlobal('open', openMock);

    renderModal({ isOpen: true, onClose });

    const openBtn = screen.getByText('Open in New Tab');
    fireEvent.click(openBtn);

    expect(openMock).toHaveBeenCalledTimes(1);
    expect(openMock.mock.calls[0][0]).toContain(DEFAULT_BASE_URL);
    expect(openMock.mock.calls[0][1]).toBe('_blank');
  });

  it('calls onClose when clicking close button or backdrop', () => {
    renderModal({ isOpen: true, onClose });

    const closeBtn = screen.getByLabelText('Close modal');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);

    const footerCloseBtn = screen.getByRole('button', { name: /^Close$/ });
    fireEvent.click(footerCloseBtn);
    expect(onClose).toHaveBeenCalledTimes(2);

    const dialogBackdrop = screen.getByRole('dialog');
    fireEvent.click(dialogBackdrop);
    expect(onClose).toHaveBeenCalledTimes(3);
  });
});
