import { Check, ChevronDown, ChevronUp, Copy, Eye, SlidersHorizontal, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { usePalette } from '../../context/PaletteContext';
import {
    generateShadeScale,
    getContrastRatio,
    getRecommendedTextColor,
    hexToOklch,
    hexToRgb,
    rgbToHsl,
    SHADE_STEPS,
    ShadeScale,
} from '../../core/color';
import { ROLE_METADATA, SEMANTIC_ROLES, SemanticRole } from '../../core/palette';

export interface ColorInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole?: SemanticRole;
}

const PRESETS = [
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Violet', hex: '#8b5cf6' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Navy', hex: '#0f172a' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Black', hex: '#000000' },
];

export const ColorInspectorModal: React.FC<ColorInspectorModalProps> = ({
  isOpen,
  onClose,
  targetRole,
}) => {
  const { colors, activeRole, setActiveRole, setColor } = usePalette();
  const currentRole = targetRole || activeRole;

  const [inputHex, setInputHex] = useState(() => colors[currentRole] || '#3b82f6');
  const [force500, setForce500] = useState(false);
  const [isTonalScaleExpanded, setIsTonalScaleExpanded] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Synchronize inputHex whenever currentRole or colors change
  useEffect(() => {
    if (colors[currentRole]) {
      setInputHex(colors[currentRole]);
    }
  }, [currentRole, colors]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleColorChange = (newHex: string) => {
    setInputHex(newHex);
    if (/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(newHex.trim())) {
      setColor(currentRole, newHex.startsWith('#') ? newHex : `#${newHex}`);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const isValidHex = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(inputHex.trim());
  const sanitizedHex = inputHex.startsWith('#') ? inputHex : `#${inputHex}`;

  let scale: ShadeScale | null = null;
  let oklchFormatted = '';
  let rgbFormatted = '';
  let hslFormatted = '';
  let luminanceFormatted = '';

  if (isValidHex) {
    try {
      scale = generateShadeScale(sanitizedHex, { force500Anchor: force500 });
      const rgb = hexToRgb(sanitizedHex);
      const hsl = rgbToHsl(rgb);
      const oklch = hexToOklch(sanitizedHex);

      rgbFormatted = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      hslFormatted = `hsl(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)`;
      oklchFormatted = `oklch(${(oklch.l * 100).toFixed(1)}% ${oklch.c.toFixed(3)} ${oklch.h.toFixed(1)}°)`;
      luminanceFormatted = (scale['500'] ? scale[force500 ? '500' : '50'].relativeLuminance : 0).toFixed(3);
    } catch {
      scale = null;
    }
  }

  const activeMeta = ROLE_METADATA[currentRole];
  const textColor = isValidHex ? getRecommendedTextColor(sanitizedHex) : '#ffffff';
  const contrastOnBg = isValidHex && currentRole !== 'background'
    ? getContrastRatio(sanitizedHex, colors.background)
    : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inspector-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/50 dark:border-indigo-800/50">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 id="inspector-modal-title" className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Color Math & Shade Studio</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                  {activeMeta.label}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Perceptual color space conversions, contrast analysis, and calibrated 50–950 tonal scale
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Role Switching Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1.5">
              Inspect Role:
            </span>
            {SEMANTIC_ROLES.map((role) => {
              const isActive = currentRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setActiveRole(role)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-500'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/10 dark:border-white/10"
                    style={{ backgroundColor: colors[role] }}
                  />
                  <span>{ROLE_METADATA[role].label}</span>
                </button>
              );
            })}
          </div>

          {/* Color Preview & Editor Card */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800">
            {/* Color Swatch Display */}
            <div
              className="sm:col-span-5 h-28 sm:h-auto rounded-xl p-3.5 flex flex-col justify-between shadow-inner border border-black/5 dark:border-white/5 transition-colors"
              style={{ backgroundColor: isValidHex ? sanitizedHex : '#3b82f6' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold" style={{ color: textColor }}>
                  {activeMeta.label}
                </span>
                {contrastOnBg !== null && (
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-sm"
                    style={{
                      backgroundColor: textColor === '#ffffff' ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.65)',
                      color: textColor,
                    }}
                  >
                    {contrastOnBg}:1 on bg
                  </span>
                )}
              </div>
              <span className="text-sm font-mono font-bold" style={{ color: textColor }}>
                {isValidHex ? sanitizedHex : 'Invalid'}
              </span>
            </div>

            {/* Inputs & Quick Swatches */}
            <div className="sm:col-span-7 space-y-3">
              <div className="flex items-center gap-2">
                <label className="relative cursor-pointer flex items-center">
                  <input
                    type="color"
                    aria-label="Color picker"
                    value={isValidHex ? sanitizedHex : '#3b82f6'}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-9 h-9 rounded-xl cursor-pointer border border-slate-300 dark:border-slate-700 bg-transparent p-0.5 shadow-2xs"
                  />
                </label>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputHex}
                    onChange={(e) => handleColorChange(e.target.value)}
                    placeholder="#3b82f6"
                    aria-label="Hex color value"
                    className={`w-full px-3 py-1.5 rounded-xl text-xs font-mono border shadow-2xs transition-all focus:outline-none focus:ring-2 ${
                      isValidHex
                        ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-indigo-500/20 focus:border-indigo-500'
                        : 'border-rose-400 dark:border-rose-600 bg-rose-50/50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200'
                    }`}
                  />
                </div>
              </div>

              {/* Quick Swatches */}
              <div className="flex flex-wrap items-center gap-1.5">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleColorChange(preset.hex)}
                    title={preset.name}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                      inputHex.toLowerCase() === preset.hex.toLowerCase()
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-750 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full border border-black/10 dark:border-white/10"
                      style={{ backgroundColor: preset.hex }}
                    />
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Color Math Readouts Grid */}
          {isValidHex && scale && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Color Math Conversions:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {[
                  { label: 'HEX', value: sanitizedHex },
                  { label: 'RGB', value: rgbFormatted },
                  { label: 'HSL', value: hslFormatted },
                  { label: 'OKLCH', value: oklchFormatted },
                  { label: 'Luminance', value: luminanceFormatted },
                ].map((format) => (
                  <button
                    key={format.label}
                    type="button"
                    onClick={() => handleCopy(format.value, format.label)}
                    className="group flex flex-col p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-left hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      <span>{format.label}</span>
                      {copiedKey === format.label ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                    <span className="text-xs font-mono font-medium text-slate-900 dark:text-slate-100 truncate mt-1">
                      {format.value}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Expandable 11-Step Tonal Scale Section */}
          {isValidHex && scale && (
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                    11-Step Tonal Scale
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    (50–950 • Perceptual OKLCH)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Anchor mode toggle */}
                  <button
                    type="button"
                    onClick={() => setForce500(!force500)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      force500
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>{force500 ? 'Locked to 500' : 'Natural Anchor'}</span>
                  </button>

                  {/* Expand / Collapse Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setIsTonalScaleExpanded(!isTonalScaleExpanded)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 transition-all cursor-pointer"
                  >
                    <span>{isTonalScaleExpanded ? 'Hide Scale' : 'Show Scale'}</span>
                    {isTonalScaleExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* 11 Swatches Strip */}
              {isTonalScaleExpanded && (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-1.5 animate-in fade-in duration-150">
                  {SHADE_STEPS.map((step) => {
                    const shade = scale![step];
                    const isBase = shade.isBaseColor;
                    const isCopied = copiedKey === `shade-${step}`;

                    return (
                      <button
                        key={step}
                        type="button"
                        onClick={() => handleCopy(shade.hex, `shade-${step}`)}
                        className="group relative flex flex-col rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-800 hover:scale-[1.03] transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                      >
                        {/* Color Swatch Area */}
                        <div
                          className="h-18 sm:h-20 w-full p-2 flex flex-col justify-between transition-colors relative"
                          style={{ backgroundColor: shade.hex }}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className="text-[11px] font-bold"
                              style={{ color: shade.recommendedTextColor }}
                            >
                              {step}
                            </span>
                            {isBase && (
                              <span
                                className="text-[9px] font-semibold px-1 py-0.2 rounded flex items-center gap-0.5"
                                style={{
                                  backgroundColor: shade.recommendedTextColor === '#ffffff' ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.65)',
                                  color: shade.recommendedTextColor,
                                }}
                              >
                                Base
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <span
                              className="text-[10px] font-mono font-medium"
                              style={{ color: shade.recommendedTextColor }}
                            >
                              {shade.hex}
                            </span>
                            {isCopied ? (
                              <Check
                                className="w-3 h-3 text-emerald-400"
                                style={{ color: shade.recommendedTextColor }}
                              />
                            ) : (
                              <Copy
                                className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ color: shade.recommendedTextColor }}
                              />
                            )}
                          </div>
                        </div>

                        {/* Metadata Footer */}
                        <div className="p-1.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex flex-col gap-0.5 text-left">
                          <div className="flex items-center justify-between">
                            <span>L</span>
                            <span className="font-mono text-slate-700 dark:text-slate-300">
                              {(shade.oklch.l * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Contrast</span>
                            <span className="font-mono text-slate-700 dark:text-slate-300">
                              {shade.recommendedTextColor === '#ffffff'
                                ? `${shade.contrastAgainstWhite}:1`
                                : `${shade.contrastAgainstBlack}:1`}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
