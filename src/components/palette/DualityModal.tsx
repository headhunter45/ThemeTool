import {
    ArrowRight,
    CheckCircle2,
    Moon,
    Sparkles,
    Sun,
    X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { usePalette } from '../../context/PaletteContext';
import { getContrastRatio, hexToOklch } from '../../core/color';
import {
    generateCounterpartPalette,
    getHueDelta,
} from '../../core/palette/duality';
import { PaletteMode, ROLE_METADATA, SEMANTIC_ROLES } from '../../core/palette/types';

export interface DualityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DualityModal: React.FC<DualityModalProps> = ({ isOpen, onClose }) => {
  const {
    activeMode,
    setActiveMode,
    palettes,
    applyDuality,
  } = usePalette();

  const [sourceMode, setSourceMode] = useState<PaletteMode>(activeMode);
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  const targetMode: PaletteMode = sourceMode === 'light' ? 'dark' : 'light';

  // Compute generated counterpart from current source palette
  const generatedTarget = useMemo(() => {
    return generateCounterpartPalette(
      palettes[sourceMode].colors,
      palettes[sourceMode].custom,
      sourceMode
    );
  }, [palettes, sourceMode]);

  // Contrast calculations for source mode
  const sourceContrast = useMemo(() => {
    const c = palettes[sourceMode].colors;
    return {
      textOnBg: getContrastRatio(c.text, c.background),
      primaryOnBg: getContrastRatio(c.primary, c.background),
      secondaryOnBg: getContrastRatio(c.secondary, c.background),
      accentOnBg: getContrastRatio(c.accent, c.background),
    };
  }, [palettes, sourceMode]);

  // Contrast calculations for generated target mode
  const targetContrast = useMemo(() => {
    const c = generatedTarget.colors;
    return {
      textOnBg: getContrastRatio(c.text, c.background),
      primaryOnBg: getContrastRatio(c.primary, c.background),
      secondaryOnBg: getContrastRatio(c.secondary, c.background),
      accentOnBg: getContrastRatio(c.accent, c.background),
    };
  }, [generatedTarget]);

  if (!isOpen) return null;

  const handleApplyDuality = () => {
    applyDuality(sourceMode);
    setAppliedNotification(
      `Successfully applied generated ${targetMode.toUpperCase()} palette!`
    );
    setTimeout(() => {
      setAppliedNotification(null);
    }, 2800);
  };

  const handleApplyAndSwitch = () => {
    applyDuality(sourceMode);
    setActiveMode(targetMode);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="duality-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  id="duality-modal-title"
                  className="text-base font-bold text-slate-900 dark:text-slate-100"
                >
                  Dark Mode Duality Studio
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                  OKLCH Perceptual Math
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Derive high-legibility, reciprocal dark or light palettes preserving hue angles and WCAG contrast.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Duality Studio"
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
          {/* Source Mode Direction Picker */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Derivation Direction
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Choose the source palette to calculate the opposite mode counterpart from.
              </p>
            </div>

            <div className="inline-flex rounded-xl bg-slate-200/70 dark:bg-slate-800 p-1">
              <button
                type="button"
                onClick={() => setSourceMode('light')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  sourceMode === 'light'
                    ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light &rarr; Dark</span>
              </button>
              <button
                type="button"
                onClick={() => setSourceMode('dark')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  sourceMode === 'dark'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark &rarr; Light</span>
              </button>
            </div>
          </div>

          {/* Success Notification */}
          {appliedNotification && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{appliedNotification}</span>
            </div>
          )}

          {/* Side-by-Side Role Matrix */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Role Color Comparison & OKLCH Coordinates
            </h4>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/75 dark:bg-slate-800/75 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                    <th className="py-2.5 px-4 font-bold">Role</th>
                    <th className="py-2.5 px-4 font-bold">
                      {sourceMode === 'light' ? '☀️ Source (Light)' : '🌙 Source (Dark)'}
                    </th>
                    <th className="py-2.5 px-4 font-bold">
                      {targetMode === 'dark' ? '🌙 Generated (Dark)' : '☀️ Generated (Light)'}
                    </th>
                    <th className="py-2.5 px-4 font-bold text-right">Hue &Delta;</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {SEMANTIC_ROLES.map((role) => {
                    const sourceHex = palettes[sourceMode].colors[role];
                    const targetHex = generatedTarget.colors[role];
                    const sourceOklch = hexToOklch(sourceHex);
                    const targetOklch = hexToOklch(targetHex);
                    const hueDelta = getHueDelta(sourceOklch.h, targetOklch.h);

                    return (
                      <tr
                        key={role}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors"
                      >
                        <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                          {ROLE_METADATA[role].label}
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-5 h-5 rounded-md border border-slate-300 dark:border-slate-700 shadow-2xs shrink-0"
                              style={{ backgroundColor: sourceHex }}
                            />
                            <span className="font-mono font-semibold">{sourceHex}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                              L:{(sourceOklch.l * 100).toFixed(0)}% C:{sourceOklch.c.toFixed(2)}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-5 h-5 rounded-md border border-slate-300 dark:border-slate-700 shadow-2xs shrink-0"
                              style={{ backgroundColor: targetHex }}
                            />
                            <span className="font-mono font-semibold">{targetHex}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                              L:{(targetOklch.l * 100).toFixed(0)}% C:{targetOklch.c.toFixed(2)}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold font-mono ${
                              hueDelta <= 2
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                            }`}
                          >
                            {hueDelta.toFixed(1)}&deg;
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Custom slots if any */}
                  {generatedTarget.custom.map((slot, index) => {
                    const sourceSlot = palettes[sourceMode].custom[index];
                    if (!sourceSlot) return null;
                    const sourceOklch = hexToOklch(sourceSlot.hex);
                    const targetOklch = hexToOklch(slot.hex);
                    const hueDelta = getHueDelta(sourceOklch.h, targetOklch.h);

                    return (
                      <tr
                        key={slot.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors"
                      >
                        <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                          {slot.name}
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-5 h-5 rounded-md border border-slate-300 dark:border-slate-700 shadow-2xs shrink-0"
                              style={{ backgroundColor: sourceSlot.hex }}
                            />
                            <span className="font-mono font-semibold">{sourceSlot.hex}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-5 h-5 rounded-md border border-slate-300 dark:border-slate-700 shadow-2xs shrink-0"
                              style={{ backgroundColor: slot.hex }}
                            />
                            <span className="font-mono font-semibold">{slot.hex}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold font-mono bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                            {hueDelta.toFixed(1)}&deg;
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contrast Ratio Audits */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              WCAG Accessibility & Contrast Audits
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Source Mode Contrast Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {sourceMode === 'light' ? '☀️ Source: Light Theme' : '🌙 Source: Dark Theme'}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500">Live</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Text on Background:</span>
                    <span className="font-mono font-bold">
                      {sourceContrast.textOnBg.toFixed(2)}:1{' '}
                      <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                        {sourceContrast.textOnBg >= 7 ? 'AAA' : sourceContrast.textOnBg >= 4.5 ? 'AA' : 'Fail'}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Primary on Background:</span>
                    <span className="font-mono font-bold">
                      {sourceContrast.primaryOnBg.toFixed(2)}:1
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Accent on Background:</span>
                    <span className="font-mono font-bold">
                      {sourceContrast.accentOnBg.toFixed(2)}:1
                    </span>
                  </div>
                </div>
              </div>

              {/* Generated Target Mode Contrast Card */}
              <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                    {targetMode === 'dark' ? '🌙 Generated: Dark Theme' : '☀️ Generated: Light Theme'}
                  </span>
                  <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                    Derived
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Text on Background:</span>
                    <span className="font-mono font-bold">
                      {targetContrast.textOnBg.toFixed(2)}:1{' '}
                      <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                        {targetContrast.textOnBg >= 7 ? 'AAA' : targetContrast.textOnBg >= 4.5 ? 'AA' : 'Fail'}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Primary on Background:</span>
                    <span className="font-mono font-bold">
                      {targetContrast.primaryOnBg.toFixed(2)}:1
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Accent on Background:</span>
                    <span className="font-mono font-bold">
                      {targetContrast.accentOnBg.toFixed(2)}:1
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Active studio mode is currently <strong className="font-bold text-slate-800 dark:text-slate-200 capitalize">{activeMode}</strong>.
          </div>

          <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleApplyDuality}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Apply Generated {targetMode === 'dark' ? 'Dark' : 'Light'} Palette</span>
            </button>

            <button
              type="button"
              onClick={handleApplyAndSwitch}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Apply &amp; Switch Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
