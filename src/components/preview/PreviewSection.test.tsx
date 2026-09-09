import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PaletteProvider } from '../../context/PaletteContext';
import { PreviewSection } from './PreviewSection';

const renderPreviewSection = () => {
  return render(
    <PaletteProvider>
      <PreviewSection />
    </PaletteProvider>
  );
};

describe('PreviewSection & Visibility Controls (TT-009)', { timeout: 30000 }, () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders Step 3 title, segmented controls, and all 6 platform cards initially', () => {
    renderPreviewSection();

    expect(screen.getByText('Component & Platform Previews')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /All Targets/i })).toBeInTheDocument();

    // Verify all 6 cards rendered
    expect(screen.getByTestId('preview-card-tailwind')).toBeInTheDocument();
    expect(screen.getByTestId('preview-card-react')).toBeInTheDocument();
    expect(screen.getByTestId('preview-card-angular')).toBeInTheDocument();
    expect(screen.getByTestId('preview-card-material')).toBeInTheDocument();
    expect(screen.getByTestId('preview-card-android')).toBeInTheDocument();
    expect(screen.getByTestId('preview-card-ios')).toBeInTheDocument();
  });

  it('toggles visibility of individual platform cards via toggle pills in "All" mode', () => {
    renderPreviewSection();

    // In All mode, toggle pills are rendered
    const toggleReactBtn = screen.getByLabelText('Toggle React UI visibility');
    expect(toggleReactBtn).toBeInTheDocument();
    expect(screen.getByTestId('preview-card-react')).toBeInTheDocument();

    // Click toggle to hide React
    fireEvent.click(toggleReactBtn);
    expect(screen.queryByTestId('preview-card-react')).toBeNull();
    // Others remain visible
    expect(screen.getByTestId('preview-card-tailwind')).toBeInTheDocument();

    // Click toggle to show React again
    fireEvent.click(toggleReactBtn);
    expect(screen.getByTestId('preview-card-react')).toBeInTheDocument();
  });

  it('switches to single-platform focus mode when clicking a platform tab', () => {
    renderPreviewSection();

    const angularTab = screen.getByRole('button', { name: 'Focus Angular tab' });
    fireEvent.click(angularTab);

    // Only Angular card visible
    expect(screen.getByTestId('preview-card-angular')).toBeInTheDocument();
    expect(screen.queryByTestId('preview-card-tailwind')).toBeNull();
    expect(screen.queryByTestId('preview-card-react')).toBeNull();

    // "Back to All Targets" button is displayed
    const backBtn = screen.getByRole('button', { name: /Back to All Targets/i });
    expect(backBtn).toBeInTheDocument();

    // Click back to all
    fireEvent.click(backBtn);
    expect(screen.getByTestId('preview-card-tailwind')).toBeInTheDocument();
    expect(screen.getByTestId('preview-card-react')).toBeInTheDocument();
  });

  it('displays empty state when all targets are hidden and restores with Show All', () => {
    renderPreviewSection();

    const hideAllBtn = screen.getByRole('button', { name: /Hide All/i });
    fireEvent.click(hideAllBtn);

    // Empty state should be visible
    expect(screen.getByText('No preview targets visible')).toBeInTheDocument();
    expect(screen.queryByTestId('preview-card-tailwind')).toBeNull();

    // Click "Show All Targets" button in empty state
    const showAllBtn = screen.getByRole('button', { name: 'Show All Targets' });
    fireEvent.click(showAllBtn);

    expect(screen.getByTestId('preview-card-tailwind')).toBeInTheDocument();
    expect(screen.getByTestId('preview-card-ios')).toBeInTheDocument();
  });
});
