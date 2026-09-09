import {
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  Copy,
  FileCode,
  RotateCcw,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { usePalette } from '../../../context/PaletteContext';
import {
  generateShadeScale,
  getContrastRatio,
  getRecommendedTextColor,
  getRelativeLuminance,
} from '../../../core/color';
import { ExportTailwindModal } from '../../palette/ExportTailwindModal';

export interface TailwindWebPreviewProps {
  isFocused?: boolean;
}

export const TailwindWebPreview: React.FC<TailwindWebPreviewProps> = ({ isFocused = false }) => {
  const { colors } = usePalette();

  // Interactive UI states
  const [emailInput, setEmailInput] = useState('developer@company.com');
  const [isChecked, setIsChecked] = useState(true);
  const [isToggled, setIsToggled] = useState(true);
  const [showAlert, setShowAlert] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [btnClickCount, setBtnClickCount] = useState(0);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Derived color tokens & text contrasts
  const primaryText = getRecommendedTextColor(colors.primary);
  const secondaryText = getRecommendedTextColor(colors.secondary);
  const accentText = getRecommendedTextColor(colors.accent);

  const isDarkBg = getRelativeLuminance(colors.background) < 0.5;
  const bgScale = generateShadeScale(colors.background);
  const primaryScale = generateShadeScale(colors.primary);

  const cardBg = isDarkBg ? bgScale['900'].hex : '#ffffff';
  const cardBorder = isDarkBg ? bgScale['800'].hex : 'rgba(0, 0, 0, 0.08)';
  const subtleBg = isDarkBg ? bgScale['800'].hex : bgScale['50'].hex;

  const textContrast = getContrastRatio(colors.text, colors.background);
  const primaryContrast = getContrastRatio(colors.primary, colors.background);

  const tailwindSnippet = `@theme {
  --color-primary: ${colors.primary};
  --color-secondary: ${colors.secondary};
  --color-accent: ${colors.accent};
  --color-background: ${colors.background};
  --color-text: ${colors.text};
}`;

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(tailwindSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div
      data-testid="tailwind-web-preview"
      className="rounded-2xl transition-colors space-y-5 p-4 sm:p-6 border shadow-xs"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        borderColor: cardBorder,
      }}
    >
      {/* 1. Dismissable Accent Alert Banner */}
      {showAlert ? (
        <div
          data-testid="tailwind-alert-banner"
          className="p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all animate-in fade-in duration-150"
          style={{
            backgroundColor: isDarkBg ? 'rgba(255, 255, 255, 0.04)' : subtleBg,
            borderColor: colors.accent,
            borderLeftWidth: '4px',
          }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className="p-1 rounded-lg shrink-0"
              style={{ backgroundColor: colors.accent, color: accentText }}
            >
              <Bell className="w-3.5 h-3.5" />
            </span>
            <div className="text-xs truncate">
              <span className="font-bold">Palette Synced:</span>{' '}
              <span className="opacity-85">
                Tailwind CSS v4 theme variables compiled in real-time.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAlert(false)}
            aria-label="Dismiss alert"
            className="p-1 rounded-lg hover:opacity-80 transition-opacity shrink-0 cursor-pointer"
            style={{ color: colors.text }}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowAlert(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer opacity-70 hover:opacity-100"
            style={{ borderColor: cardBorder, color: colors.text }}
          >
            <RotateCcw className="w-3 h-3" />
            <span>Show Alert</span>
          </button>
        </div>
      )}

      {/* 2. Marketing Hero Section */}
      <div
        className="p-6 rounded-3xl border transition-all space-y-4"
        style={{
          backgroundColor: cardBg,
          borderColor: cardBorder,
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Eyebrow badge */}
          <span
            data-testid="tailwind-eyebrow-badge"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold shadow-2xs"
            style={{
              backgroundColor: isDarkBg ? primaryScale['950'].hex : primaryScale['100'].hex,
              color: colors.primary,
              border: `1px solid ${colors.primary}33`,
            }}
          >
            <Sparkles className="w-3 h-3" />
            <span>Tailwind Web UI</span>
          </span>

          <span className="text-[11px] font-mono opacity-60">
            Ratio {textContrast}:1
          </span>
        </div>

        <div className="space-y-2">
          <h3
            className="text-xl sm:text-2xl font-black tracking-tight"
            style={{ color: colors.text }}
          >
            Design system built with atomic utility classes.
          </h3>
          <p
            className="text-xs sm:text-sm leading-relaxed max-w-xl opacity-80"
            style={{ color: colors.text }}
          >
            Experience dynamic Tailwind styling reacting immediately to semantic roles, tonal contrast thresholds, and theme toggling.
          </p>
        </div>

        {/* Buttons Suite */}
        <div className="pt-1 flex flex-wrap items-center gap-2.5">
          {/* Primary CTA */}
          <button
            type="button"
            data-testid="tailwind-btn-primary"
            onClick={() => setBtnClickCount((c) => c + 1)}
            className="px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            style={{
              backgroundColor: colors.primary,
              color: primaryText,
            }}
          >
            <span>Primary CTA{btnClickCount > 0 ? ` (${btnClickCount})` : ''}</span>
          </button>

          {/* Secondary Action */}
          <button
            type="button"
            data-testid="tailwind-btn-secondary"
            className="px-4 py-2 rounded-xl text-xs font-semibold border transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            style={{
              backgroundColor: colors.secondary,
              color: secondaryText,
              borderColor: 'rgba(0,0,0,0.1)',
            }}
          >
            Secondary Action
          </button>

          {/* Text link */}
          <button
            type="button"
            data-testid="tailwind-btn-link"
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold hover:underline cursor-pointer"
            style={{ color: colors.primary }}
          >
            <span>Documentation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Metric / Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Stat 1 */}
        <div
          data-testid="tailwind-stat-1"
          className="p-4 rounded-2xl border space-y-1 transition-all"
          style={{
            backgroundColor: cardBg,
            borderColor: cardBorder,
          }}
        >
          <div className="flex items-center justify-between text-[11px] font-semibold opacity-70">
            <span>Primary Contrast</span>
            <span
              className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded"
              style={{
                backgroundColor: isDarkBg ? '#064e3b' : '#dcfce7',
                color: isDarkBg ? '#6ee7b7' : '#15803d',
              }}
            >
              <TrendingUp className="w-3 h-3" />
              <span>{primaryContrast >= 4.5 ? 'AA Pass' : 'Low'}</span>
            </span>
          </div>
          <div className="text-xl font-extrabold tracking-tight" style={{ color: colors.primary }}>
            {primaryContrast}:1
          </div>
          <p className="text-[10px] opacity-60">Contrast ratio on background</p>
        </div>

        {/* Stat 2 */}
        <div
          data-testid="tailwind-stat-2"
          className="p-4 rounded-2xl border space-y-1 transition-all"
          style={{
            backgroundColor: cardBg,
            borderColor: cardBorder,
          }}
        >
          <div className="flex items-center justify-between text-[11px] font-semibold opacity-70">
            <span>Text Legibility</span>
            <span
              className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded"
              style={{
                backgroundColor: isDarkBg ? '#064e3b' : '#dcfce7',
                color: isDarkBg ? '#6ee7b7' : '#15803d',
              }}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>{textContrast >= 7.0 ? 'AAA Pass' : 'AA Pass'}</span>
            </span>
          </div>
          <div className="text-xl font-extrabold tracking-tight" style={{ color: colors.text }}>
            {textContrast}:1
          </div>
          <p className="text-[10px] opacity-60">WCAG standard contrast ratio</p>
        </div>

        {/* Stat 3 */}
        <div
          data-testid="tailwind-stat-3"
          className="p-4 rounded-2xl border space-y-1 transition-all"
          style={{
            backgroundColor: cardBg,
            borderColor: cardBorder,
          }}
        >
          <div className="flex items-center justify-between text-[11px] font-semibold opacity-70">
            <span>Accent Highlight</span>
            <span
              className="text-[10px] font-bold px-1.5 py-0.2 rounded"
              style={{ backgroundColor: colors.accent, color: accentText }}
            >
              Active
            </span>
          </div>
          <div className="text-xl font-extrabold tracking-tight" style={{ color: colors.accent }}>
            {colors.accent.toUpperCase()}
          </div>
          <p className="text-[10px] opacity-60">Tertiary & badge accent token</p>
        </div>
      </div>

      {/* 4. Interactive Form & Toggles Suite */}
      <div
        className="p-4 sm:p-5 rounded-2xl border space-y-3"
        style={{
          backgroundColor: subtleBg,
          borderColor: cardBorder,
        }}
      >
        <div className="text-[11px] font-bold uppercase tracking-wider opacity-70">
          Interactive Form Controls
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Text Input with Focus Ring */}
          <div className="w-full sm:flex-1 relative">
            <input
              type="text"
              data-testid="tailwind-input-text"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter email address..."
              aria-label="Email Input"
              className="w-full px-3.5 py-2 rounded-xl text-xs border outline-none font-medium shadow-2xs transition-all"
              style={{
                backgroundColor: cardBg,
                color: colors.text,
                borderColor: cardBorder,
              }}
            />
          </div>

          {/* Controls: Checkbox & Toggle */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            {/* Custom Checkbox */}
            <label
              data-testid="tailwind-checkbox-label"
              className="inline-flex items-center gap-2 cursor-pointer select-none"
            >
              <button
                type="button"
                role="checkbox"
                data-testid="tailwind-checkbox"
                aria-checked={isChecked}
                onClick={() => setIsChecked(!isChecked)}
                className="w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer"
                style={{
                  backgroundColor: isChecked ? colors.primary : 'transparent',
                  borderColor: isChecked ? colors.primary : cardBorder,
                  color: primaryText,
                }}
              >
                {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
              <span className="text-xs font-semibold" style={{ color: colors.text }}>
                Subscribe
              </span>
            </label>

            {/* Custom Pill Toggle Switch */}
            <label
              data-testid="tailwind-switch-label"
              className="inline-flex items-center gap-2 cursor-pointer select-none"
            >
              <button
                type="button"
                role="switch"
                data-testid="tailwind-switch"
                aria-checked={isToggled}
                onClick={() => setIsToggled(!isToggled)}
                className="w-11 h-6 rounded-full p-0.5 border transition-colors relative flex items-center cursor-pointer"
                style={{
                  backgroundColor: isToggled ? colors.primary : 'rgba(0,0,0,0.1)',
                  borderColor: isToggled ? colors.primary : cardBorder,
                }}
              >
                <div
                  className="w-4 h-4 rounded-full shadow-sm transition-transform"
                  style={{
                    backgroundColor: isToggled ? primaryText : '#ffffff',
                    transform: isToggled ? 'translateX(20px)' : 'translateX(2px)',
                  }}
                />
              </button>
              <span className="text-xs font-semibold" style={{ color: colors.text }}>
                Notifications
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* 5. Focused Mode Tailwind Utility Inspector */}
      {isFocused && (
        <div
          data-testid="tailwind-focused-inspector"
          className="p-4 rounded-2xl border space-y-3 font-mono text-xs animate-in fade-in duration-150"
          style={{
            backgroundColor: cardBg,
            borderColor: cardBorder,
          }}
        >
          <div className="flex items-center justify-between font-sans">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Tailwind CSS Theme Token Mappings
              </h4>
              <p className="text-[11px] opacity-70">
                Copyable v4 @theme directive block matching active palette.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                style={{ borderColor: cardBorder, color: colors.text }}
                title="Open full Tailwind exporter with v3/v4 downloads and config options"
              >
                <FileCode className="w-3.5 h-3.5 text-cyan-500" />
                <span>Full Exporter</span>
              </button>
              <button
                type="button"
                onClick={handleCopySnippet}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                style={{ borderColor: cardBorder, color: colors.text }}
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy CSS</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-100 overflow-x-auto text-[11px] leading-relaxed">
            <code>{tailwindSnippet}</code>
          </pre>
        </div>
      )}

      <ExportTailwindModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
};
