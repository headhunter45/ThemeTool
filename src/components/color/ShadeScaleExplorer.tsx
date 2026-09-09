import { Check, Copy, Info, SlidersHorizontal, Sparkles } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { usePalette } from '../../context/PaletteContext';
import {
    generateShadeScale,
    hexToOklch,
    hexToRgb,
    rgbToHsl,
    SHADE_STEPS,
    ShadeScale,
} from '../../core/color';
import { ROLE_METADATA, SEMANTIC_ROLES } from '../../core/palette';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const PRESETS = [
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Violet', hex: '#8b5cf6' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Deep Navy', hex: '#0f172a' },
  { name: 'Neon', hex: '#22c55e' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Black', hex: '#000000' },
];

export const ShadeScaleExplorer: React.FC = () => {
  const { colors, activeRole, setActiveRole, setColor } = usePalette();
  const [inputHex, setInputHex] = useState(() => colors[activeRole] || '#3b82f6');
  const [force500, setForce500] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sync with active role from PaletteContext
  useEffect(() => {
    if (colors[activeRole]) {
      setInputHex(colors[activeRole]);
    }
  }, [activeRole, colors]);

  const handleColorChange = (newHex: string) => {
    setInputHex(newHex);
    if (/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(newHex.trim())) {
      setColor(activeRole, newHex.startsWith('#') ? newHex : `#${newHex}`);
    }
  };

  // Validate hex for color picker and calculation
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
      luminanceFormatted = (scale['500'] ? scale[force500 ? '500' : '50'].relativeLuminance : 0).toString();
    } catch {
      scale = null;
    }
  }

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Input & Presets Bar */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span>Color Math & Shade Studio</span>
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Enter any base color to inspect perceptual conversions and generate designer-calibrated 50–950 shade steps.
            </p>
          </div>

          {/* Anchor mode toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setForce500(!force500)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                force500
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{force500 ? 'Locked to 500' : 'Natural Anchor (Smart)'}</span>
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Semantic Role Selector */}
          <div className="flex flex-wrap items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-800/80">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
              Active Role:
            </span>
            {SEMANTIC_ROLES.map((role) => {
              const isRoleActive = activeRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setActiveRole(role)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    isRoleActive
                      ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-500'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full border border-black/10 dark:border-white/10"
                    style={{ backgroundColor: colors[role] }}
                  />
                  <span>{ROLE_METADATA[role].label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Native Color Picker Swatch */}
            <div className="relative flex items-center">
              <input
                type="color"
                aria-label="Color picker"
                value={isValidHex ? sanitizedHex : '#3b82f6'}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-12 h-10 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent p-1 shadow-sm"
              />
            </div>

            {/* Hex Input Field */}
            <div className="relative flex-1">
              <input
                type="text"
                value={inputHex}
                onChange={(e) => handleColorChange(e.target.value)}
                placeholder="#3b82f6"
                aria-label="Hex color value"
                className={`w-full px-3.5 py-2 rounded-xl text-sm font-mono border shadow-sm transition-all focus:outline-none focus:ring-2 ${
                  isValidHex
                    ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-indigo-500/20 focus:border-indigo-500'
                    : 'border-rose-400 dark:border-rose-600 bg-rose-50/50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 focus:ring-rose-500/20'
                }`}
              />
              {!isValidHex && (
                <span className="absolute right-3 top-2.5 text-xs text-rose-500">Invalid Hex</span>
              )}
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 sm:pt-0">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleColorChange(preset.hex)}
                  title={preset.name}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    inputHex.toLowerCase() === preset.hex.toLowerCase()
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/10 dark:border-white/10 shrink-0"
                    style={{ backgroundColor: preset.hex }}
                  />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Conversions Readout Grid */}
          {isValidHex && scale && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-2">
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
                  className="group flex flex-col p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-left hover:border-indigo-400 dark:hover:border-indigo-600 transition-all"
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
          )}
        </CardContent>
      </Card>

      {/* 11-Step Shade Swatches Strip */}
      {isValidHex && scale && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Perceptual 50–950 Tonal Scale</span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                (11 steps • Monotonic OKLCH lightness)
              </span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              Click any swatch to copy HEX
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2">
            {SHADE_STEPS.map((step) => {
              const shade = scale![step];
              const isBase = shade.isBaseColor;
              const isCopied = copiedKey === `shade-${step}`;

              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => handleCopy(shade.hex, `shade-${step}`)}
                  className="group relative flex flex-col rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 hover:scale-[1.03] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {/* Color Swatch Area */}
                  <div
                    className="h-24 sm:h-28 w-full p-2.5 flex flex-col justify-between transition-colors relative"
                    style={{ backgroundColor: shade.hex }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-bold"
                        style={{ color: shade.recommendedTextColor }}
                      >
                        {step}
                      </span>
                      {isBase && (
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md flex items-center gap-0.5"
                          style={{
                            backgroundColor: shade.recommendedTextColor === '#ffffff' ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.6)',
                            color: shade.recommendedTextColor,
                          }}
                        >
                          <Sparkles className="w-2.5 h-2.5" />
                          Base
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className="text-[11px] font-mono font-medium"
                        style={{ color: shade.recommendedTextColor }}
                      >
                        {shade.hex}
                      </span>
                      {isCopied ? (
                        <Check
                          className="w-3.5 h-3.5 text-emerald-400"
                          style={{ color: shade.recommendedTextColor }}
                        />
                      ) : (
                        <Copy
                          className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: shade.recommendedTextColor }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Metadata Footer */}
                  <div className="p-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex flex-col gap-0.5 text-left">
                    <div className="flex items-center justify-between">
                      <span>Lightness</span>
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
        </div>
      )}
    </div>
  );
};
