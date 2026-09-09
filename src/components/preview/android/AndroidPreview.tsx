import {
    Battery,
    Bookmark,
    Heart,
    Home,
    Menu,
    MoreVertical,
    Plus,
    Search,
    Settings,
    Share2,
    Smartphone,
    Sparkles,
    Wifi,
} from 'lucide-react';
import React, { useState } from 'react';
import { usePalette } from '../../../context/PaletteContext';
import { computeMaterialTokens } from '../../../core/preview/materialTokens';
import { ExportAndroidModal } from '../../palette/ExportAndroidModal';

export interface AndroidPreviewProps {
  isFocused?: boolean;
}

export const AndroidPreview: React.FC<AndroidPreviewProps> = ({ isFocused = false }) => {
  const { colors } = usePalette();
  const tokens = computeMaterialTokens(colors);

  // Chassis & system bar states
  const [edgeToEdge, setEdgeToEdge] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'saved' | 'settings'>('home');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Screen 1: Feed Dashboard states
  const [selectedChip, setSelectedChip] = useState<string>('Trending');
  const [likesCount, setLikesCount] = useState(42);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [fabCount, setFabCount] = useState(0);
  const [fabToast, setFabToast] = useState(false);

  // Screen 2: Settings & Form states
  const [switchHaptics, setSwitchHaptics] = useState(true);
  const [switchDynamicColors, setSwitchDynamicColors] = useState(true);
  const [selectedRadio, setSelectedRadio] = useState<'tonal' | 'vibrant' | 'expressive'>('vibrant');
  const [textInputValue, setTextInputValue] = useState('android_dev');
  const [sliderValue, setSliderValue] = useState(75);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleFabClick = () => {
    setFabCount((prev) => prev + 1);
    setFabToast(true);
    setTimeout(() => setFabToast(false), 2000);
  };

  const chips = ['All', 'Trending', 'Material 3', 'Compose'];

  return (
    <div
      data-testid="android-preview-container"
      className="flex flex-col items-center justify-center p-2 sm:p-4 transition-colors"
    >
      {/* Top Controls: Edge-to-Edge Switcher & Quick Export */}
      <div className="w-full max-w-sm mb-3 flex items-center justify-between gap-2 px-1">
        {/* Edge-to-Edge Toggle Pill */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            System Bars:
          </span>
          <div className="inline-flex rounded-lg bg-slate-200/80 dark:bg-slate-800 p-0.5 border border-slate-300/70 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setEdgeToEdge(true)}
              aria-pressed={edgeToEdge}
              aria-label="Enable Edge to Edge rendering"
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                edgeToEdge
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Edge-to-Edge (A15)
            </button>
            <button
              type="button"
              onClick={() => setEdgeToEdge(false)}
              aria-pressed={!edgeToEdge}
              aria-label="Disable Edge to Edge rendering"
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                !edgeToEdge
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Solid Bars
            </button>
          </div>
        </div>

        {/* Quick Export Button */}
        <button
          type="button"
          onClick={() => setIsExportModalOpen(true)}
          aria-label="Export Android XML resources"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-all active:scale-95 cursor-pointer"
        >
          <Smartphone className="w-3 h-3" />
          <span>Export XML</span>
        </button>
      </div>

      {/* Android Smartphone Chassis Frame */}
      <div
        data-testid="android-phone-chassis"
        className={`relative w-full ${
          isFocused ? 'max-w-[380px] h-[680px]' : 'max-w-[340px] h-[640px]'
        } rounded-[2.5rem] border-[6px] border-slate-800 dark:border-slate-700 bg-slate-900 shadow-2xl overflow-hidden flex flex-col transition-all ring-1 ring-black/20`}
      >
        {/* Status Bar */}
        <div
          data-testid="android-status-bar"
          className={`h-9 px-6 flex items-center justify-between z-20 transition-colors ${
            edgeToEdge ? 'absolute top-0 inset-x-0 bg-transparent' : 'relative'
          }`}
          style={{
            backgroundColor: edgeToEdge ? 'transparent' : tokens.surfaceContainer,
            color: tokens.onSurface,
          }}
        >
          {/* Time */}
          <span className="text-xs font-bold font-mono tracking-tight select-none">
            9:41
          </span>

          {/* Centered Camera Punch-Hole Cutout */}
          <div
            data-testid="android-camera-punchhole"
            className="w-3.5 h-3.5 rounded-full bg-black border border-slate-700/50 shadow-inner flex items-center justify-center pointer-events-none"
          >
            <div className="w-1 h-1 rounded-full bg-slate-900/80" />
          </div>

          {/* Status Icons */}
          <div className="flex items-center gap-1.5 opacity-90 select-none">
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Scrollable Screen Canvas */}
        <div
          data-testid="android-screen-canvas"
          className={`flex-1 overflow-y-auto flex flex-col transition-colors ${
            edgeToEdge ? 'pt-9 pb-12' : 'pb-2'
          }`}
          style={{
            backgroundColor: tokens.surface,
            color: tokens.onSurface,
          }}
        >
          {activeTab === 'home' && (
            <div className="flex-1 flex flex-col p-4 space-y-4">
              {/* M3 Top App Bar */}
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    aria-label="Navigation drawer"
                    className="p-1.5 rounded-full hover:opacity-80 transition-opacity"
                    style={{ color: tokens.onSurface }}
                  >
                    <Menu className="w-4 h-4" />
                  </button>
                  <h3 className="text-base font-bold tracking-tight">Android Feed</h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="Search feed"
                    className="p-1.5 rounded-full hover:opacity-80 transition-opacity"
                    style={{ color: tokens.onSurface }}
                  >
                    <Search className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Feed options"
                    className="p-1.5 rounded-full hover:opacity-80 transition-opacity"
                    style={{ color: tokens.onSurface }}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Horizontally Scrollable M3 Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {chips.map((chip) => {
                  const isSelected = selectedChip === chip;
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setSelectedChip(chip)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        isSelected ? 'shadow-2xs' : 'border'
                      }`}
                      style={{
                        backgroundColor: isSelected
                          ? tokens.secondaryContainer
                          : tokens.surfaceContainerLow,
                        color: isSelected
                          ? tokens.onSecondaryContainer
                          : tokens.onSurfaceVariant,
                        borderColor: isSelected ? 'transparent' : tokens.outlineVariant,
                      }}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>

              {/* Main Media Feature Card */}
              <div
                className="rounded-2xl overflow-hidden border shadow-xs transition-colors"
                style={{
                  backgroundColor: tokens.surfaceContainerLow,
                  borderColor: tokens.outlineVariant,
                }}
              >
                {/* Hero Banner Visual */}
                <div
                  className="h-28 p-3 flex flex-col justify-between"
                  style={{
                    backgroundColor: tokens.primaryContainer,
                    color: tokens.onPrimaryContainer,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                      style={{
                        backgroundColor: tokens.tertiary,
                        color: tokens.onTertiary,
                      }}
                    >
                      Material 3
                    </span>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold tracking-tight">Jetpack Compose UI</h4>
                    <p className="text-[11px] opacity-90">Adaptive design tokens & layout</p>
                  </div>
                </div>

                {/* Card Body & Interactive Actions */}
                <div className="p-3.5 space-y-3">
                  <p className="text-xs line-clamp-2" style={{ color: tokens.onSurfaceVariant }}>
                    Dynamic theme colors configured in ThemeTool mapped directly to Android Material 3 tokens.
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleLike}
                        aria-label="Like post"
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg transition-colors cursor-pointer hover:opacity-80"
                        style={{
                          color: isLiked ? tokens.primary : tokens.onSurfaceVariant,
                        }}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`}
                        />
                        <span>{likesCount}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        aria-label="Bookmark post"
                        className="p-1 rounded-lg transition-colors cursor-pointer hover:opacity-80"
                        style={{
                          color: isBookmarked ? tokens.primary : tokens.onSurfaceVariant,
                        }}
                      >
                        <Bookmark
                          className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`}
                        />
                      </button>
                    </div>

                    <button
                      type="button"
                      aria-label="Share post"
                      className="p-1 rounded-lg transition-colors cursor-pointer hover:opacity-80"
                      style={{ color: tokens.onSurfaceVariant }}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Secondary Feed List Item */}
              <div
                className="p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors"
                style={{
                  backgroundColor: tokens.surfaceContainerLow,
                  borderColor: tokens.outlineVariant,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-2xs"
                    style={{
                      backgroundColor: tokens.secondary,
                      color: tokens.onSecondary,
                    }}
                  >
                    A15
                  </div>
                  <div>
                    <h5 className="text-xs font-bold" style={{ color: tokens.onSurface }}>
                      Edge-to-Edge Enforced
                    </h5>
                    <p className="text-[10px]" style={{ color: tokens.onSurfaceVariant }}>
                      Transparent system bars default in Android 15
                    </p>
                  </div>
                </div>

                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: tokens.tertiary }}
                />
              </div>

              {/* Extended Floating Action Button (FAB) */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleFabClick}
                  aria-label="Compose new post"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold shadow-md transition-transform active:scale-95 cursor-pointer"
                  style={{
                    backgroundColor: tokens.primaryContainer,
                    color: tokens.onPrimaryContainer,
                  }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Compose ({fabCount})</span>
                </button>
              </div>

              {fabToast && (
                <div
                  className="p-2 rounded-lg text-center text-xs font-semibold animate-in fade-in"
                  style={{
                    backgroundColor: tokens.surfaceVariant,
                    color: tokens.onSurfaceVariant,
                  }}
                >
                  Post created! Counter: {fabCount}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="flex-1 flex flex-col p-4 space-y-4">
              <div className="pb-1 border-b" style={{ borderColor: tokens.outlineVariant }}>
                <h3 className="text-base font-bold tracking-tight">Android Settings</h3>
                <p className="text-[11px]" style={{ color: tokens.onSurfaceVariant }}>
                  Material 3 form controls and preferences
                </p>
              </div>

              {/* M3 Switches */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                  Toggles &amp; Switches
                </span>

                <div
                  className="p-3 rounded-xl border flex items-center justify-between"
                  style={{
                    backgroundColor: tokens.surfaceContainerLow,
                    borderColor: tokens.outlineVariant,
                  }}
                >
                  <div>
                    <div className="text-xs font-semibold">Dynamic Theming</div>
                    <div className="text-[10px]" style={{ color: tokens.onSurfaceVariant }}>
                      Apply palette roles live
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={switchDynamicColors}
                    aria-label="Toggle Dynamic Theming"
                    onClick={() => setSwitchDynamicColors(!switchDynamicColors)}
                    className="w-11 h-6 rounded-full p-0.5 transition-colors relative cursor-pointer"
                    style={{
                      backgroundColor: switchDynamicColors
                        ? tokens.primary
                        : tokens.surfaceVariant,
                    }}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        switchDynamicColors ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div
                  className="p-3 rounded-xl border flex items-center justify-between"
                  style={{
                    backgroundColor: tokens.surfaceContainerLow,
                    borderColor: tokens.outlineVariant,
                  }}
                >
                  <div>
                    <div className="text-xs font-semibold">Haptic Feedback</div>
                    <div className="text-[10px]" style={{ color: tokens.onSurfaceVariant }}>
                      Vibrate on touch events
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={switchHaptics}
                    aria-label="Toggle Haptic Feedback"
                    onClick={() => setSwitchHaptics(!switchHaptics)}
                    className="w-11 h-6 rounded-full p-0.5 transition-colors relative cursor-pointer"
                    style={{
                      backgroundColor: switchHaptics
                        ? tokens.primary
                        : tokens.surfaceVariant,
                    }}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        switchHaptics ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* M3 Radio Group */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                  Palette Harmony Preset
                </span>
                <div
                  className="p-2 rounded-xl border space-y-1.5"
                  style={{
                    backgroundColor: tokens.surfaceContainerLow,
                    borderColor: tokens.outlineVariant,
                  }}
                >
                  {(['tonal', 'vibrant', 'expressive'] as const).map((mode) => (
                    <label
                      key={mode}
                      className="flex items-center justify-between p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                    >
                      <span className="text-xs capitalize font-medium">{mode}</span>
                      <input
                        type="radio"
                        name="m3-radio"
                        value={mode}
                        checked={selectedRadio === mode}
                        onChange={() => setSelectedRadio(mode)}
                        className="accent-indigo-600 cursor-pointer"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* M3 Outlined Text Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                  Outlined Text Field
                </label>
                <div
                  className="rounded-xl border px-3 py-2 transition-colors focus-within:ring-2"
                  style={{
                    backgroundColor: tokens.surfaceContainerLow,
                    borderColor: tokens.outline,
                  }}
                >
                  <input
                    type="text"
                    value={textInputValue}
                    onChange={(e) => setTextInputValue(e.target.value)}
                    aria-label="Android Handle"
                    placeholder="Enter handle..."
                    className="w-full bg-transparent text-xs font-mono outline-none"
                    style={{ color: tokens.onSurface }}
                  />
                </div>
              </div>

              {/* M3 Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                    Volume Slider
                  </span>
                  <span className="font-mono font-bold">{sliderValue}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderValue}
                  onChange={(e) => setSliderValue(Number(e.target.value))}
                  aria-label="Android Volume Slider"
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-2">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs"
                style={{
                  backgroundColor: tokens.secondaryContainer,
                  color: tokens.onSecondaryContainer,
                }}
              >
                <Bookmark className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold" style={{ color: tokens.onSurface }}>
                Saved Collection
              </h4>
              <p className="text-xs max-w-xs" style={{ color: tokens.onSurfaceVariant }}>
                Bookmarked items saved locally in Android Room database.
              </p>
            </div>
          )}
        </div>

        {/* M3 Bottom Navigation Bar */}
        <div
          data-testid="android-bottom-nav"
          className="border-t flex items-center justify-around py-1.5 z-10 transition-colors"
          style={{
            backgroundColor: tokens.surfaceContainer,
            borderColor: tokens.outlineVariant,
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            aria-label="Navigate to Home"
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all cursor-pointer"
          >
            <div
              className="px-3 py-0.5 rounded-full transition-colors"
              style={{
                backgroundColor: activeTab === 'home' ? tokens.primaryContainer : 'transparent',
                color: activeTab === 'home' ? tokens.onPrimaryContainer : tokens.onSurfaceVariant,
              }}
            >
              <Home className="w-4 h-4" />
            </div>
            <span
              className="text-[10px] font-semibold"
              style={{
                color: activeTab === 'home' ? tokens.onSurface : tokens.onSurfaceVariant,
              }}
            >
              Feed
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            aria-label="Navigate to Saved"
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all cursor-pointer"
          >
            <div
              className="px-3 py-0.5 rounded-full transition-colors"
              style={{
                backgroundColor: activeTab === 'saved' ? tokens.primaryContainer : 'transparent',
                color: activeTab === 'saved' ? tokens.onPrimaryContainer : tokens.onSurfaceVariant,
              }}
            >
              <Bookmark className="w-4 h-4" />
            </div>
            <span
              className="text-[10px] font-semibold"
              style={{
                color: activeTab === 'saved' ? tokens.onSurface : tokens.onSurfaceVariant,
              }}
            >
              Saved
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            aria-label="Navigate to Settings"
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all cursor-pointer"
          >
            <div
              className="px-3 py-0.5 rounded-full transition-colors"
              style={{
                backgroundColor: activeTab === 'settings' ? tokens.primaryContainer : 'transparent',
                color: activeTab === 'settings' ? tokens.onPrimaryContainer : tokens.onSurfaceVariant,
              }}
            >
              <Settings className="w-4 h-4" />
            </div>
            <span
              className="text-[10px] font-semibold"
              style={{
                color: activeTab === 'settings' ? tokens.onSurface : tokens.onSurfaceVariant,
              }}
            >
              Settings
            </span>
          </button>
        </div>

        {/* Gesture Navigation Pill */}
        <div
          data-testid="android-gesture-pill-area"
          className={`py-1.5 flex justify-center z-20 ${
            edgeToEdge ? 'absolute bottom-0 inset-x-0 bg-transparent' : 'relative'
          }`}
          style={{
            backgroundColor: edgeToEdge ? 'transparent' : tokens.surfaceContainer,
          }}
        >
          <div
            data-testid="android-gesture-pill"
            className="w-24 h-1 rounded-full opacity-80"
            style={{
              backgroundColor: tokens.onSurface,
            }}
          />
        </div>
      </div>

      <ExportAndroidModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
};
