import { Check, Heart, Home, Menu, MoreVertical, Plus, Search, Settings, Smartphone } from 'lucide-react';
import React, { useState } from 'react';
import { usePalette } from '../../../context/PaletteContext';
import { computeMaterialTokens } from '../../../core/preview/materialTokens';
import { ExportAndroidModal } from '../../palette/ExportAndroidModal';

export interface MaterialM3PreviewProps {
  isFocused?: boolean;
}

export const MaterialM3Preview: React.FC<MaterialM3PreviewProps> = ({ isFocused = false }) => {
  const { colors } = usePalette();
  const tokens = computeMaterialTokens(colors);

  // Interactive component states
  const [activeNav, setActiveNav] = useState<'home' | 'saved' | 'settings'>('home');
  const [activeChips, setActiveChips] = useState<Record<string, boolean>>({
    Elevation: true,
    Adaptive: true,
    Tokens: false,
  });
  const [switchChecked, setSwitchChecked] = useState(true);
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [selectedRadio, setSelectedRadio] = useState<'radio1' | 'radio2'>('radio1');
  const [filledInput, setFilledInput] = useState('Dynamic M3 Material');
  const [outlinedInput, setOutlinedInput] = useState('Live reactive colors');
  const [fabCount, setFabCount] = useState(0);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const toggleChip = (label: string) => {
    setActiveChips((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <div
      data-testid="material-m3-preview"
      className="rounded-xl overflow-hidden flex flex-col transition-colors border shadow-xs"
      style={{
        backgroundColor: tokens.surface,
        borderColor: tokens.outlineVariant,
        color: tokens.onSurface,
      }}
    >
      {/* 1. M3 Top App Bar */}
      <div
        data-testid="m3-top-app-bar"
        className="px-4 py-3 flex items-center justify-between border-b transition-colors"
        style={{
          backgroundColor: tokens.surfaceContainer,
          borderColor: tokens.outlineVariant,
        }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Navigation Menu"
            className="p-1.5 rounded-full hover:opacity-80 transition-opacity"
            style={{ color: tokens.onSurface }}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h4 className="text-sm font-semibold tracking-tight" style={{ color: tokens.onSurface }}>
              Material Design 3
            </h4>
            <p className="text-[10px] font-mono opacity-70" style={{ color: tokens.onSurfaceVariant }}>
              {tokens.isDark ? 'Dark Theme' : 'Light Theme'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Search"
            className="p-1.5 rounded-full hover:opacity-80 transition-opacity"
            style={{ color: tokens.onSurfaceVariant }}
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="More Options"
            className="p-1.5 rounded-full hover:opacity-80 transition-opacity"
            style={{ color: tokens.onSurfaceVariant }}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas Container */}
      <div className="p-4 sm:p-5 space-y-6">
        {/* 2. Button Showcase & Floating Action Button (FAB) */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span
              className="text-[11px] font-bold uppercase tracking-wider"
              style={{ color: tokens.onSurfaceVariant }}
            >
              Buttons & Action Controls
            </span>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{
                backgroundColor: tokens.tertiaryContainer,
                color: tokens.onTertiaryContainer,
              }}
            >
              6 Variants
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filled Button */}
            <button
              type="button"
              data-testid="m3-btn-filled"
              className="px-5 py-2 rounded-full text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer hover:opacity-90"
              style={{
                backgroundColor: tokens.primary,
                color: tokens.onPrimary,
              }}
            >
              Filled
            </button>

            {/* Elevated Button */}
            <button
              type="button"
              data-testid="m3-btn-elevated"
              className="px-5 py-2 rounded-full text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer hover:opacity-90"
              style={{
                backgroundColor: tokens.surfaceContainerHigh,
                color: tokens.primary,
              }}
            >
              Elevated
            </button>

            {/* Tonal Button */}
            <button
              type="button"
              data-testid="m3-btn-tonal"
              className="px-5 py-2 rounded-full text-xs font-semibold transition-all active:scale-95 cursor-pointer hover:opacity-90"
              style={{
                backgroundColor: tokens.secondaryContainer,
                color: tokens.onSecondaryContainer,
              }}
            >
              Tonal
            </button>

            {/* Outlined Button */}
            <button
              type="button"
              data-testid="m3-btn-outlined"
              className="px-5 py-2 rounded-full text-xs font-semibold border transition-all active:scale-95 cursor-pointer hover:opacity-90"
              style={{
                borderColor: tokens.outline,
                color: tokens.primary,
                backgroundColor: 'transparent',
              }}
            >
              Outlined
            </button>

            {/* Text Button */}
            <button
              type="button"
              data-testid="m3-btn-text"
              className="px-4 py-2 rounded-full text-xs font-semibold transition-all active:scale-95 cursor-pointer hover:opacity-80"
              style={{
                color: tokens.primary,
                backgroundColor: 'transparent',
              }}
            >
              Text
            </button>

            {/* Floating Action Button (FAB) */}
            <button
              type="button"
              data-testid="m3-btn-fab"
              onClick={() => setFabCount((c) => c + 1)}
              aria-label="Floating Action Button"
              className="px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer hover:opacity-90"
              style={{
                backgroundColor: tokens.primaryContainer,
                color: tokens.onPrimaryContainer,
              }}
            >
              <Plus className="w-4 h-4" />
              <span>FAB{fabCount > 0 ? ` (${fabCount})` : ''}</span>
            </button>
          </div>
        </section>

        {/* 3. Cards Showcase: Elevated, Filled, Outlined */}
        <section className="space-y-2.5">
          <span
            className="text-[11px] font-bold uppercase tracking-wider"
            style={{ color: tokens.onSurfaceVariant }}
          >
            M3 Cards (Elevated, Filled, Outlined)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Elevated Card */}
            <div
              data-testid="m3-card-elevated"
              className="p-4 rounded-2xl shadow-md space-y-2 transition-all"
              style={{
                backgroundColor: tokens.surfaceContainerLow,
                color: tokens.onSurface,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">Elevated</span>
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: tokens.tertiaryContainer,
                    color: tokens.onTertiaryContainer,
                  }}
                >
                  Surface Low
                </span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-80" style={{ color: tokens.onSurfaceVariant }}>
                Shadow elevation with subtle tonal container tinting.
              </p>
            </div>

            {/* Filled Card */}
            <div
              data-testid="m3-card-filled"
              className="p-4 rounded-2xl space-y-2 transition-all"
              style={{
                backgroundColor: tokens.surfaceContainer,
                color: tokens.onSurface,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">Filled</span>
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: tokens.secondaryContainer,
                    color: tokens.onSecondaryContainer,
                  }}
                >
                  Container
                </span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-80" style={{ color: tokens.onSurfaceVariant }}>
                Flat surface container with distinguishable background tone.
              </p>
            </div>

            {/* Outlined Card */}
            <div
              data-testid="m3-card-outlined"
              className="p-4 rounded-2xl border space-y-2 transition-all"
              style={{
                backgroundColor: tokens.surface,
                borderColor: tokens.outlineVariant,
                color: tokens.onSurface,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">Outlined</span>
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full border"
                  style={{
                    borderColor: tokens.outline,
                    color: tokens.onSurfaceVariant,
                  }}
                >
                  Outline
                </span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-80" style={{ color: tokens.onSurfaceVariant }}>
                Clear structural boundary using derived outline variant tokens.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Text Fields (Filled & Outlined) */}
        <section className="space-y-2.5">
          <span
            className="text-[11px] font-bold uppercase tracking-wider"
            style={{ color: tokens.onSurfaceVariant }}
          >
            Text Fields (Filled & Outlined)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Filled Field */}
            <div
              className="rounded-t-lg px-3.5 pt-2 pb-1.5 border-b-2 transition-colors"
              style={{
                backgroundColor: tokens.surfaceContainerHigh,
                borderColor: tokens.primary,
              }}
            >
              <label
                htmlFor="m3-input-filled"
                className="block text-[10px] font-semibold"
                style={{ color: tokens.primary }}
              >
                Filled Text Field
              </label>
              <input
                id="m3-input-filled"
                type="text"
                data-testid="m3-field-filled"
                value={filledInput}
                onChange={(e) => setFilledInput(e.target.value)}
                aria-label="Filled Text Field"
                className="w-full text-xs bg-transparent outline-none font-medium mt-0.5"
                style={{ color: tokens.onSurface }}
              />
            </div>

            {/* Outlined Field */}
            <div
              className="rounded-xl px-3.5 py-2 border transition-colors relative"
              style={{
                backgroundColor: tokens.surface,
                borderColor: tokens.outline,
              }}
            >
              <label
                htmlFor="m3-input-outlined"
                className="block text-[10px] font-semibold"
                style={{ color: tokens.onSurfaceVariant }}
              >
                Outlined Text Field
              </label>
              <input
                id="m3-input-outlined"
                type="text"
                data-testid="m3-field-outlined"
                value={outlinedInput}
                onChange={(e) => setOutlinedInput(e.target.value)}
                aria-label="Outlined Text Field"
                className="w-full text-xs bg-transparent outline-none font-medium mt-0.5"
                style={{ color: tokens.onSurface }}
              />
            </div>
          </div>
        </section>

        {/* 5. Selectors: Filter Chips, Switch, Checkbox, Radio */}
        <section className="space-y-2.5">
          <span
            className="text-[11px] font-bold uppercase tracking-wider"
            style={{ color: tokens.onSurfaceVariant }}
          >
            Selectors & Toggles
          </span>

          <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-2xl"
            style={{ backgroundColor: tokens.surfaceContainerLow }}
          >
            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-2">
              {Object.keys(activeChips).map((label) => {
                const isSelected = activeChips[label];
                return (
                  <button
                    key={label}
                    type="button"
                    data-testid={`m3-chip-${label.toLowerCase()}`}
                    onClick={() => toggleChip(label)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border"
                    style={{
                      backgroundColor: isSelected ? tokens.secondaryContainer : 'transparent',
                      color: isSelected ? tokens.onSecondaryContainer : tokens.onSurfaceVariant,
                      borderColor: isSelected ? 'transparent' : tokens.outline,
                    }}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Switch, Checkbox, Radio */}
            <div className="flex flex-wrap items-center gap-4">
              {/* M3 Switch */}
              <label
                data-testid="m3-switch"
                className="inline-flex items-center gap-2 cursor-pointer select-none"
              >
                <div
                  onClick={() => setSwitchChecked((v) => !v)}
                  className="w-12 h-7 rounded-full p-0.5 transition-colors relative flex items-center cursor-pointer border"
                  style={{
                    backgroundColor: switchChecked ? tokens.primary : tokens.surfaceVariant,
                    borderColor: switchChecked ? tokens.primary : tokens.outline,
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full shadow-sm transition-transform flex items-center justify-center"
                    style={{
                      backgroundColor: switchChecked ? tokens.onPrimary : tokens.outline,
                      transform: switchChecked ? 'translateX(20px)' : 'translateX(2px)',
                    }}
                  >
                    {switchChecked && (
                      <Check className="w-3 h-3" style={{ color: tokens.primary }} />
                    )}
                  </div>
                </div>
                <span className="text-xs font-medium" style={{ color: tokens.onSurface }}>
                  Switch
                </span>
              </label>

              {/* Checkbox */}
              <label
                data-testid="m3-checkbox-label"
                className="inline-flex items-center gap-2 cursor-pointer select-none"
              >
                <button
                  type="button"
                  data-testid="m3-checkbox"
                  role="checkbox"
                  aria-checked={checkboxChecked}
                  onClick={() => setCheckboxChecked((v) => !v)}
                  className="w-5 h-5 rounded-md flex items-center justify-center transition-colors cursor-pointer border"
                  style={{
                    backgroundColor: checkboxChecked ? tokens.primary : 'transparent',
                    borderColor: checkboxChecked ? tokens.primary : tokens.outline,
                    color: tokens.onPrimary,
                  }}
                >
                  {checkboxChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
                <span className="text-xs font-medium" style={{ color: tokens.onSurface }}>
                  Checkbox
                </span>
              </label>

              {/* Radio Buttons */}
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                  <button
                    type="button"
                    data-testid="m3-radio-1"
                    role="radio"
                    aria-checked={selectedRadio === 'radio1'}
                    onClick={() => setSelectedRadio('radio1')}
                    className="w-4 h-4 rounded-full border flex items-center justify-center cursor-pointer"
                    style={{
                      borderColor: selectedRadio === 'radio1' ? tokens.primary : tokens.outline,
                    }}
                  >
                    {selectedRadio === 'radio1' && (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: tokens.primary }}
                      />
                    )}
                  </button>
                  <span className="text-xs" style={{ color: tokens.onSurface }}>R1</span>
                </label>

                <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                  <button
                    type="button"
                    data-testid="m3-radio-2"
                    role="radio"
                    aria-checked={selectedRadio === 'radio2'}
                    onClick={() => setSelectedRadio('radio2')}
                    className="w-4 h-4 rounded-full border flex items-center justify-center cursor-pointer"
                    style={{
                      borderColor: selectedRadio === 'radio2' ? tokens.primary : tokens.outline,
                    }}
                  >
                    {selectedRadio === 'radio2' && (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: tokens.primary }}
                      />
                    )}
                  </button>
                  <span className="text-xs" style={{ color: tokens.onSurface }}>R2</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Focused mode extra details */}
        {isFocused && (
          <section
            data-testid="m3-token-specs"
            className="p-3.5 rounded-2xl border space-y-2 text-xs"
            style={{
              backgroundColor: tokens.surfaceContainerHigh,
              borderColor: tokens.outlineVariant,
            }}
          >
            <div className="font-bold flex items-center justify-between flex-wrap gap-2" style={{ color: tokens.onSurface }}>
              <div className="flex items-center gap-2">
                <span>Material 3 Token Derivations</span>
                <span className="text-[10px] font-mono opacity-70">
                  Primary: {tokens.primary} | Container: {tokens.primaryContainer}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsExportModalOpen(true)}
                aria-label="Export Android XML"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-2xs hover:opacity-90 transition-opacity cursor-pointer"
                style={{
                  backgroundColor: tokens.primary,
                  color: tokens.onPrimary,
                }}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Export Android XML</span>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px]">
              <div className="p-2 rounded-lg border" style={{ backgroundColor: tokens.primaryContainer, color: tokens.onPrimaryContainer, borderColor: tokens.outlineVariant }}>
                <div>primaryContainer</div>
                <div className="font-bold">{tokens.primaryContainer}</div>
              </div>
              <div className="p-2 rounded-lg border" style={{ backgroundColor: tokens.secondaryContainer, color: tokens.onSecondaryContainer, borderColor: tokens.outlineVariant }}>
                <div>secondaryContainer</div>
                <div className="font-bold">{tokens.secondaryContainer}</div>
              </div>
              <div className="p-2 rounded-lg border" style={{ backgroundColor: tokens.tertiaryContainer, color: tokens.onTertiaryContainer, borderColor: tokens.outlineVariant }}>
                <div>tertiaryContainer</div>
                <div className="font-bold">{tokens.tertiaryContainer}</div>
              </div>
              <div className="p-2 rounded-lg border" style={{ backgroundColor: tokens.surfaceContainer, color: tokens.onSurface, borderColor: tokens.outlineVariant }}>
                <div>surfaceContainer</div>
                <div className="font-bold">{tokens.surfaceContainer}</div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* 6. M3 Bottom Navigation Bar */}
      <div
        data-testid="m3-bottom-nav"
        className="px-6 py-2.5 border-t flex items-center justify-around transition-colors"
        style={{
          backgroundColor: tokens.surfaceContainer,
          borderColor: tokens.outlineVariant,
        }}
      >
        {/* Nav 1: Home */}
        <button
          type="button"
          data-testid="m3-nav-home"
          onClick={() => setActiveNav('home')}
          className="flex flex-col items-center gap-1 cursor-pointer transition-all"
        >
          <div
            className="px-5 py-1 rounded-full flex items-center justify-center transition-all"
            style={{
              backgroundColor: activeNav === 'home' ? tokens.secondaryContainer : 'transparent',
              color: activeNav === 'home' ? tokens.onSecondaryContainer : tokens.onSurfaceVariant,
            }}
          >
            <Home className="w-5 h-5" />
          </div>
          <span
            className="text-[11px] font-medium"
            style={{
              color: activeNav === 'home' ? tokens.onSurface : tokens.onSurfaceVariant,
              fontWeight: activeNav === 'home' ? 700 : 500,
            }}
          >
            Explore
          </span>
        </button>

        {/* Nav 2: Saved / Favorites with badge */}
        <button
          type="button"
          data-testid="m3-nav-saved"
          onClick={() => setActiveNav('saved')}
          className="flex flex-col items-center gap-1 cursor-pointer transition-all relative"
        >
          <div
            className="px-5 py-1 rounded-full flex items-center justify-center transition-all relative"
            style={{
              backgroundColor: activeNav === 'saved' ? tokens.secondaryContainer : 'transparent',
              color: activeNav === 'saved' ? tokens.onSecondaryContainer : tokens.onSurfaceVariant,
            }}
          >
            <Heart className="w-5 h-5" />
            <span
              className="absolute -top-0.5 right-3 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center shadow-xs"
              style={{
                backgroundColor: tokens.tertiary,
                color: tokens.onTertiary,
              }}
            >
              3
            </span>
          </div>
          <span
            className="text-[11px] font-medium"
            style={{
              color: activeNav === 'saved' ? tokens.onSurface : tokens.onSurfaceVariant,
              fontWeight: activeNav === 'saved' ? 700 : 500,
            }}
          >
            Saved
          </span>
        </button>

        {/* Nav 3: Settings */}
        <button
          type="button"
          data-testid="m3-nav-settings"
          onClick={() => setActiveNav('settings')}
          className="flex flex-col items-center gap-1 cursor-pointer transition-all"
        >
          <div
            className="px-5 py-1 rounded-full flex items-center justify-center transition-all"
            style={{
              backgroundColor: activeNav === 'settings' ? tokens.secondaryContainer : 'transparent',
              color: activeNav === 'settings' ? tokens.onSecondaryContainer : tokens.onSurfaceVariant,
            }}
          >
            <Settings className="w-5 h-5" />
          </div>
          <span
            className="text-[11px] font-medium"
            style={{
              color: activeNav === 'settings' ? tokens.onSurface : tokens.onSurfaceVariant,
              fontWeight: activeNav === 'settings' ? 700 : 500,
            }}
          >
            Settings
          </span>
        </button>
      </div>

      <ExportAndroidModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
};
