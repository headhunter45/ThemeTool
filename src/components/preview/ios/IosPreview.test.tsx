import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PaletteProvider } from '../../../context/PaletteContext';
import { IosPreview } from './IosPreview';

const renderIosPreview = (isFocused = false) => {
  return render(
    <PaletteProvider>
      <IosPreview isFocused={isFocused} />
    </PaletteProvider>
  );
};

describe('IosPreview Component (TT-014)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders iPhone smartphone chassis with status bar, Dynamic Island, status icons, and home indicator', () => {
    renderIosPreview();

    expect(screen.getByTestId('ios-preview-container')).toBeInTheDocument();
    expect(screen.getByTestId('ios-phone-chassis')).toBeInTheDocument();
    expect(screen.getByTestId('ios-status-bar')).toBeInTheDocument();
    expect(screen.getByTestId('ios-dynamic-island')).toBeInTheDocument();
    expect(screen.getByTestId('ios-cellular-signal')).toBeInTheDocument();
    expect(screen.getByTestId('ios-battery')).toBeInTheDocument();
    expect(screen.getByTestId('ios-home-indicator')).toBeInTheDocument();
    expect(screen.getByText('9:41')).toBeInTheDocument();
  });

  it('displays iOS appearance mode badge indicating light or dark iOS environment', () => {
    renderIosPreview();

    const badge = screen.getByTestId('ios-appearance-badge');
    expect(badge).toBeInTheDocument();
    expect(badge.textContent).toMatch(/iOS 18 (Dark|Light)/i);
  });

  it('interacts with Featured view: segmented control, hero card, GET/OPEN button, and like counter', () => {
    renderIosPreview();

    // Verify initial Featured screen elements
    expect(screen.getByTestId('ios-hero-card')).toBeInTheDocument();
    expect(screen.getByText('ThemeStudio Pro')).toBeInTheDocument();

    // Segmented control interaction
    const topChartsSeg = screen.getByRole('button', { name: 'Top Charts' });
    expect(topChartsSeg).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(topChartsSeg);
    expect(topChartsSeg).toHaveAttribute('aria-pressed', 'true');

    // GET / OPEN button interaction
    const getBtn = screen.getByTestId('ios-get-button');
    expect(getBtn).toHaveTextContent('GET');
    fireEvent.click(getBtn);
    expect(getBtn).toHaveTextContent('OPEN');
    fireEvent.click(getBtn);
    expect(getBtn).toHaveTextContent('GET');

    // Heart / Like counter interaction
    const likeBtn = screen.getByText(/128 Likes/i);
    fireEvent.click(likeBtn);
    expect(screen.getByText(/129 Likes/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/129 Likes/i));
    expect(screen.getByText(/128 Likes/i)).toBeInTheDocument();
  });

  it('navigates to Search view and allows searching with clear button and tags', () => {
    renderIosPreview();

    // Navigate to Search tab
    const searchTabBtn = screen.getByTestId('ios-tab-search');
    fireEvent.click(searchTabBtn);

    expect(screen.getByTestId('ios-search-bar')).toBeInTheDocument();

    // Type query
    const searchInput = screen.getByLabelText('Search iOS App Store') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'SwiftUI' } });
    expect(searchInput.value).toBe('SwiftUI');

    // Clear query
    const clearBtn = screen.getByLabelText('Clear search');
    fireEvent.click(clearBtn);
    expect(searchInput.value).toBe('');

    // Select a discovery tag
    const cupertinoTag = screen.getByRole('button', { name: 'Cupertino' });
    fireEvent.click(cupertinoTag);
    expect(screen.getAllByText('Cupertino')).toHaveLength(2);
  });

  it('navigates to Settings view and interacts with Cupertino switches, brightness slider, and system info', () => {
    renderIosPreview();

    // Navigate to Settings tab
    const settingsTabBtn = screen.getByTestId('ios-tab-settings');
    fireEvent.click(settingsTabBtn);

    expect(screen.getByText('Theme & Appearance')).toBeInTheDocument();

    // Cupertino Switches
    const hapticsSwitch = screen.getByTestId('ios-switch-haptics');
    expect(hapticsSwitch).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(hapticsSwitch);
    expect(hapticsSwitch).toHaveAttribute('aria-checked', 'false');

    const trueToneSwitch = screen.getByTestId('ios-switch-truetone');
    expect(trueToneSwitch).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(trueToneSwitch);
    expect(trueToneSwitch).toHaveAttribute('aria-checked', 'false');

    const notifSwitch = screen.getByTestId('ios-switch-notifications');
    expect(notifSwitch).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(notifSwitch);
    expect(notifSwitch).toHaveAttribute('aria-checked', 'true');

    // Brightness Slider
    const slider = screen.getByTestId('ios-slider') as HTMLInputElement;
    expect(slider.value).toBe('72');
    fireEvent.change(slider, { target: { value: '85' } });
    expect(slider.value).toBe('85');
    expect(screen.getByText('85%')).toBeInTheDocument();

    // System info row
    expect(screen.getByText('About ThemeTool iOS')).toBeInTheDocument();
    expect(screen.getByText(/v1.4.0/i)).toBeInTheDocument();
  });

  it('opens and closes the ExportIosModal via the quick export button', () => {
    renderIosPreview();

    const quickExportBtn = screen.getByTestId('ios-quick-export-button');
    fireEvent.click(quickExportBtn);

    // Modal opens
    expect(screen.getByRole('heading', { name: /Export iOS Theme/i })).toBeInTheDocument();

    // Modal close button
    const closeBtn = screen.getByLabelText(/Close modal/i);
    fireEvent.click(closeBtn);

    // Modal closes
    expect(screen.queryByRole('heading', { name: /Export iOS Theme/i })).not.toBeInTheDocument();
  });

  it('adjusts chassis max-width and height when isFocused is true', () => {
    const { unmount } = renderIosPreview(false);
    const chassisNormal = screen.getByTestId('ios-phone-chassis');
    expect(chassisNormal.className).toContain('max-w-[340px]');
    expect(chassisNormal.className).toContain('h-[640px]');

    unmount();

    renderIosPreview(true);
    const chassisFocused = screen.getByTestId('ios-phone-chassis');
    expect(chassisFocused.className).toContain('max-w-[380px]');
    expect(chassisFocused.className).toContain('h-[680px]');
  });
});
