import { Check, Copy, Dices, Download, Lock, RotateCcw, Share2, Unlock } from 'lucide-react';
import React, { useState } from 'react';
import { usePalette } from '../../context/PaletteContext';
import { getContrastRatio, getRecommendedTextColor } from '../../core/color';
import { PALETTE_PRESETS } from '../../core/palette/presets';
import { ROLE_METADATA, SEMANTIC_ROLES } from '../../core/palette/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { ImportPaletteModal } from './ImportPaletteModal';

export const PaletteBar: React.FC = () => {
  const {
    colors,
    locks,
    setColor,
    toggleLock,
    randomizeUnlocked,
    applyPreset,
    resetToDefault,
    shareableUrl,
    activeRole,
    setActiveRole,
  } = usePalette();

  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <Card className="overflow-hidden border-indigo-200/60 dark:border-indigo-900/40 shadow-md">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
        <div>
          <CardTitle className="flex items-center gap-2">
            <span>Active Semantic Palette</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 font-semibold">
              TT-004 URL Synced
            </span>
          </CardTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            5 core semantic roles synced live to URL hash & parameters. Bookmark or share any state instantly.
          </p>
        </div>

        {/* Global Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Presets Dropdown */}
          <select
            onChange={(e) => {
              if (e.target.value) applyPreset(e.target.value);
            }}
            defaultValue=""
            aria-label="Palette presets"
            className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer shadow-sm"
          >
            <option value="" disabled>
              Load Preset...
            </option>
            {PALETTE_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>

          {/* Import URL Button */}
          <button
            type="button"
            onClick={() => setIsImportOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Import palette from Coolors or ColorKit URL"
          >
            <Download className="w-3.5 h-3.5 text-indigo-500" />
            <span>Import</span>
          </button>

          {/* Randomize Button */}
          <button
            type="button"
            onClick={randomizeUnlocked}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Randomize unlocked color slots"
          >
            <Dices className="w-3.5 h-3.5" />
            <span>Randomize</span>
          </button>

          {/* Share / Copy URL Button */}
          <button
            type="button"
            onClick={handleCopyUrl}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm transition-all"
            title="Copy shareable link with current palette"
          >
            {copiedUrl ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied URL!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Share URL</span>
              </>
            )}
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={resetToDefault}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset palette to default"
            aria-label="Reset palette"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {/* 5 Semantic Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {SEMANTIC_ROLES.map((role) => {
            const hex = colors[role];
            const meta = ROLE_METADATA[role];
            const isLocked = locks[role];
            const isSelected = activeRole === role;
            const textContrast = role !== 'background' ? getContrastRatio(hex, colors.background) : null;
            const textColor = getRecommendedTextColor(hex);

            return (
              <div
                key={role}
                className={`relative flex flex-col rounded-2xl border transition-all overflow-hidden bg-white dark:bg-slate-900 ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                    : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Role Header */}
                <div className="p-3 pb-2 flex items-center justify-between gap-1 border-b border-slate-100 dark:border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => setActiveRole(role)}
                    className="flex items-center gap-1.5 text-left focus:outline-none"
                  >
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {meta.label}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" title="Active role" />
                    )}
                  </button>

                  {/* Lock Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleLock(role)}
                    aria-label={`Toggle lock for ${meta.label}`}
                    title={isLocked ? 'Locked (will not change on randomize)' : 'Unlocked'}
                    className={`p-1 rounded-lg text-xs transition-colors ${
                      isLocked
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  >
                    {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Swatch & Input Area */}
                <div className="p-3 space-y-2.5">
                  <div className="relative h-20 w-full rounded-xl overflow-hidden shadow-inner flex flex-col justify-between p-2.5 transition-colors border border-black/5 dark:border-white/5" style={{ backgroundColor: hex }}>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[11px] font-semibold"
                        style={{ color: textColor }}
                      >
                        {meta.label}
                      </span>
                      {textContrast !== null && (
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded backdrop-blur-sm"
                          style={{
                            backgroundColor: textColor === '#ffffff' ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.6)',
                            color: textColor,
                          }}
                        >
                          {textContrast}:1 on bg
                        </span>
                      )}
                    </div>

                    {/* Native Color Picker Input Overlay */}
                    <input
                      type="color"
                      value={hex}
                      aria-label={`${meta.label} color picker`}
                      onChange={(e) => setColor(role, e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />

                    <span
                      className="text-xs font-mono font-medium"
                      style={{ color: textColor }}
                    >
                      {hex}
                    </span>
                  </div>

                  {/* Manual Hex Input */}
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={hex}
                      onChange={(e) => setColor(role, e.target.value)}
                      aria-label={`${meta.label} hex code`}
                      className="w-full px-2.5 py-1 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(hex)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Copy hex code"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>

      <ImportPaletteModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      />
    </Card>
  );
};
