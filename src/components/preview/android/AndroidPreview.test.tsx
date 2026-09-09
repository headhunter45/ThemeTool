import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PaletteProvider } from '../../../context/PaletteContext';
import { AndroidPreview } from './AndroidPreview';

const renderAndroidPreview = () => {
  return render(
    <PaletteProvider>
      <AndroidPreview />
    </PaletteProvider>
  );
};

describe('AndroidPreview Component (TT-013)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders Android smartphone chassis with status bar, punch-hole, and gesture pill', () => {
    renderAndroidPreview();

    expect(screen.getByTestId('android-preview-container')).toBeInTheDocument();
    expect(screen.getByTestId('android-phone-chassis')).toBeInTheDocument();
    expect(screen.getByTestId('android-status-bar')).toBeInTheDocument();
    expect(screen.getByTestId('android-camera-punchhole')).toBeInTheDocument();
    expect(screen.getByTestId('android-gesture-pill')).toBeInTheDocument();
    expect(screen.getByText('9:41')).toBeInTheDocument();
  });

  it('toggles Edge-to-Edge rendering mode between A15 transparent and solid system bars', () => {
    renderAndroidPreview();

    const edgeToEdgeBtn = screen.getByLabelText('Enable Edge to Edge rendering');
    const solidBarsBtn = screen.getByLabelText('Disable Edge to Edge rendering');
    const statusBar = screen.getByTestId('android-status-bar');

    // Initially Edge-to-Edge ON (Android 15 default): transparent status bar
    expect(edgeToEdgeBtn).toHaveAttribute('aria-pressed', 'true');
    expect(statusBar.style.backgroundColor).toBe('transparent');

    // Switch to Solid Bars
    fireEvent.click(solidBarsBtn);
    expect(solidBarsBtn).toHaveAttribute('aria-pressed', 'true');
    expect(statusBar.style.backgroundColor).not.toBe('transparent');

    // Switch back to Edge-to-Edge
    fireEvent.click(edgeToEdgeBtn);
    expect(edgeToEdgeBtn).toHaveAttribute('aria-pressed', 'true');
    expect(statusBar.style.backgroundColor).toBe('transparent');
  });

  it('interacts with Home feed dashboard: chips, like button, bookmark, and FAB', () => {
    renderAndroidPreview();

    // Verify Top App Bar & Feed title
    expect(screen.getByText('Android Feed')).toBeInTheDocument();

    // Verify filter chips
    const composeChip = screen.getByRole('button', { name: 'Compose' });
    fireEvent.click(composeChip);
    expect(composeChip).toBeInTheDocument();

    // Like button interaction
    const likeBtn = screen.getByLabelText('Like post');
    expect(screen.getByText('42')).toBeInTheDocument();
    fireEvent.click(likeBtn);
    expect(screen.getByText('43')).toBeInTheDocument();
    fireEvent.click(likeBtn);
    expect(screen.getByText('42')).toBeInTheDocument();

    // Bookmark button interaction
    const bookmarkBtn = screen.getByLabelText('Bookmark post');
    fireEvent.click(bookmarkBtn);

    // FAB interaction
    const fabBtn = screen.getByLabelText('Compose new post');
    expect(screen.getByText(/Compose \(0\)/i)).toBeInTheDocument();
    fireEvent.click(fabBtn);
    expect(screen.getByText(/Compose \(1\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Post created! Counter: 1/i)).toBeInTheDocument();
  });

  it('navigates to Settings screen and interacts with switches, radio, input, and slider', () => {
    renderAndroidPreview();

    // Click Settings in bottom navigation
    const settingsNavBtn = screen.getByLabelText('Navigate to Settings');
    fireEvent.click(settingsNavBtn);

    expect(screen.getByText('Android Settings')).toBeInTheDocument();

    // M3 Switches
    const hapticsSwitch = screen.getByLabelText('Toggle Haptic Feedback');
    expect(hapticsSwitch).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(hapticsSwitch);
    expect(hapticsSwitch).toHaveAttribute('aria-checked', 'false');

    const themingSwitch = screen.getByLabelText('Toggle Dynamic Theming');
    expect(themingSwitch).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(themingSwitch);
    expect(themingSwitch).toHaveAttribute('aria-checked', 'false');

    // M3 Radio Group
    const tonalRadio = screen.getByDisplayValue('tonal') as HTMLInputElement;
    expect(tonalRadio.checked).toBe(false);
    fireEvent.click(tonalRadio);
    expect(tonalRadio.checked).toBe(true);

    // M3 Outlined Text Field
    const handleInput = screen.getByLabelText('Android Handle') as HTMLInputElement;
    expect(handleInput.value).toBe('android_dev');
    fireEvent.change(handleInput, { target: { value: 'jetpack_compose' } });
    expect(handleInput.value).toBe('jetpack_compose');

    // M3 Volume Slider
    const slider = screen.getByLabelText('Android Volume Slider') as HTMLInputElement;
    expect(slider.value).toBe('75');
    fireEvent.change(slider, { target: { value: '90' } });
    expect(slider.value).toBe('90');
    expect(screen.getByText('90%')).toBeInTheDocument();
  });

  it('navigates to Saved screen', () => {
    renderAndroidPreview();

    const savedNavBtn = screen.getByLabelText('Navigate to Saved');
    fireEvent.click(savedNavBtn);

    expect(screen.getByText('Saved Collection')).toBeInTheDocument();
    expect(screen.getByText(/Bookmarked items saved locally in Android Room database/i)).toBeInTheDocument();
  });

  it('opens Export Android XML modal when clicking Export XML button', () => {
    renderAndroidPreview();

    const exportBtn = screen.getByLabelText('Export Android XML resources');
    fireEvent.click(exportBtn);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Export Android Material 3 Resources')).toBeInTheDocument();
  });
});
