import { CheckCircle2, Layers, Maximize2, Smartphone } from 'lucide-react';
import React, { useState } from 'react';
import { usePalette } from '../../context/PaletteContext';
import { getContrastRatio, getRecommendedTextColor } from '../../core/color';
import { TargetMetadata } from '../../core/preview/types';
import { AndroidPreview } from './android/AndroidPreview';
import { MaterialM3Preview } from './material/MaterialM3Preview';
import { TailwindWebPreview } from './tailwind/TailwindWebPreview';

export interface PlatformPreviewCardProps {
  target: TargetMetadata;
  isFocused?: boolean;
  onFocus?: () => void;
}

export const PlatformPreviewCard: React.FC<PlatformPreviewCardProps> = ({
  target,
  isFocused = false,
  onFocus,
}) => {
  const { colors } = usePalette();
  const [inputText, setInputText] = useState('');
  const [isChecked, setIsChecked] = useState(true);

  const primaryTextColor = getRecommendedTextColor(colors.primary);
  const secondaryTextColor = getRecommendedTextColor(colors.secondary);
  const accentTextColor = getRecommendedTextColor(colors.accent);
  const textContrastOnBg = getContrastRatio(colors.text, colors.background);
  const primaryContrastOnBg = getContrastRatio(colors.primary, colors.background);

  return (
    <div
      data-testid={`preview-card-${target.id}`}
      className={`rounded-2xl border transition-all overflow-hidden flex flex-col bg-white dark:bg-slate-900 ${
        isFocused
          ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg'
          : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
      }`}
    >
      {/* Target Card Header */}
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 text-indigo-600 dark:text-indigo-400">
            {target.category === 'mobile' ? (
              <Smartphone className="w-3.5 h-3.5" />
            ) : (
              <Layers className="w-3.5 h-3.5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {target.label}
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-slate-200/70 dark:bg-slate-750 text-slate-600 dark:text-slate-300">
                {target.framework}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
              {target.description}
            </p>
          </div>
        </div>

        {onFocus && !isFocused && (
          <button
            type="button"
            onClick={onFocus}
            title={`Maximize ${target.label} preview`}
            aria-label={`Maximize ${target.label} preview`}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Preview Surface Canvas */}
      {target.id === 'material' ? (
        <div className="p-3 sm:p-4 flex-1">
          <MaterialM3Preview isFocused={isFocused} />
        </div>
      ) : target.id === 'tailwind' ? (
        <div className="p-3 sm:p-4 flex-1">
          <TailwindWebPreview isFocused={isFocused} />
        </div>
      ) : target.id === 'android' ? (
        <div className="p-3 sm:p-4 flex-1 flex justify-center">
          <AndroidPreview isFocused={isFocused} />
        </div>
      ) : (
        <div
          className="p-5 flex-1 space-y-4 transition-colors border-b border-black/5 dark:border-white/5"
          style={{ backgroundColor: colors.background }}
        >
          {/* Themed Header / Hero Banner */}
          <div className="flex items-center justify-between border-b pb-3 border-black/10 dark:border-white/10">
            <div>
              <h4
                className="text-sm font-bold tracking-tight"
                style={{ color: colors.text }}
              >
                Interactive {target.label} Canvas
              </h4>
              <p
                className="text-[11px] opacity-80"
                style={{ color: colors.text }}
              >
                Active background surface ({colors.background})
              </p>
            </div>

            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-bold shadow-2xs"
              style={{ backgroundColor: colors.accent, color: accentTextColor }}
            >
              Accent Badge
            </span>
          </div>

          {/* Themed Interactive Buttons */}
          <div className="space-y-2">
            <div className="text-[10px] font-semibold uppercase tracking-wider opacity-70" style={{ color: colors.text }}>
              Button & Action States
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-transform active:scale-95 cursor-pointer"
                style={{ backgroundColor: colors.primary, color: primaryTextColor }}
              >
                Primary CTA
              </button>

              <button
                type="button"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border shadow-2xs transition-transform active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: colors.secondary,
                  color: secondaryTextColor,
                  borderColor: 'rgba(0,0,0,0.1)',
                }}
              >
                Secondary Action
              </button>

              <button
                type="button"
                className="px-3 py-1.5 rounded-xl text-xs font-medium transition-colors hover:underline"
                style={{ color: colors.primary }}
              >
                Text Link
              </button>
            </div>
          </div>

          {/* Themed Form & Input Controls */}
          <div className="space-y-2">
            <div className="text-[10px] font-semibold uppercase tracking-wider opacity-70" style={{ color: colors.text }}>
              Interactive Form Control
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Enter text in ${target.label}...`}
                aria-label={`Sample input for ${target.label}`}
                className="w-full px-3 py-1.5 rounded-xl text-xs border shadow-2xs outline-none focus:ring-2"
                style={{
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.secondary,
                }}
              />

              <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer shrink-0" style={{ color: colors.text }}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="w-3.5 h-3.5 rounded accent-indigo-600 cursor-pointer"
                />
                <span className="text-[11px]">Active</span>
              </label>
            </div>
          </div>

          {/* Themed Card / Surface Tile */}
          <div
            className="p-3.5 rounded-xl border shadow-xs space-y-1.5"
            style={{
              backgroundColor: colors.background === '#ffffff' ? '#f8fafc' : 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(0,0,0,0.08)',
            }}
          >
            <div className="flex items-center justify-between text-[11px] font-semibold" style={{ color: colors.text }}>
              <span>Surface Card Elevation</span>
              <span className="opacity-70 font-mono text-[10px]">{target.framework}</span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-85" style={{ color: colors.text }}>
              Demonstrating semantic contrast ratios: Text on background ({textContrastOnBg}:1) & Primary CTA ({primaryContrastOnBg}:1).
            </p>
          </div>
        </div>
      )}

      {/* Target Card Footer */}
      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-850 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span className="inline-flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span>Synced to Palette</span>
        </span>
        <span className="font-mono text-[10px] uppercase">
          {target.category}
        </span>
      </div>
    </div>
  );
};
