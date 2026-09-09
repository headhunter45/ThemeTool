import { Check, ChevronDown, ChevronUp, Download, Palette, Sparkles, Wand2 } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { usePalette } from '../../context/PaletteContext';
import { getRecommendedTextColor } from '../../core/color';
import { generatePaletteFromSeed, PALETTE_PRESETS, PaletteColors, SEMANTIC_ROLES } from '../../core/palette';
import { CustomColorSlot } from '../../core/palette/types';
import { Card } from '../ui/Card';
import { ImportPaletteModal } from './ImportPaletteModal';

type SetupMode = 'seed' | 'preset' | 'import';

export const BasePaletteWorkflow: React.FC = () => {
  const { colors, importPalette } = usePalette();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMode, setActiveMode] = useState<SetupMode>('seed');
  const [seedColor, setSeedColor] = useState(colors.primary || '#3b82f6');
  const [selectedPresetId, setSelectedPresetId] = useState(PALETTE_PRESETS[0]?.id || 'modern-minimalist');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [justApplied, setJustApplied] = useState(false);
  const [appliedLabel, setAppliedLabel] = useState<string>('Seed Color (#3b82f6)');

  // Local draft colors that haven't been committed to PaletteContext yet
  const [customDraft, setCustomDraft] = useState<PaletteColors | null>(null);
  const [draftCustomSlots, setDraftCustomSlots] = useState<CustomColorSlot[] | undefined>(undefined);

  // Compute draft palette based on mode
  const currentDraft: PaletteColors = useMemo(() => {
    if (activeMode === 'seed') {
      try {
        return generatePaletteFromSeed(seedColor);
      } catch {
        return colors;
      }
    }
    if (activeMode === 'preset') {
      const preset = PALETTE_PRESETS.find((p) => p.id === selectedPresetId);
      return preset?.colors || colors;
    }
    if (activeMode === 'import' && customDraft) {
      return customDraft;
    }
    return colors;
  }, [activeMode, seedColor, selectedPresetId, customDraft, colors]);

  const handleSeedChange = (hex: string) => {
    setSeedColor(hex);
    setActiveMode('seed');
    setCustomDraft(null);
  };

  const handlePresetSelect = (presetId: string) => {
    setSelectedPresetId(presetId);
    setActiveMode('preset');
    setCustomDraft(null);
  };

  const handleImportSuccess = (imported: PaletteColors, custom?: CustomColorSlot[]) => {
    setCustomDraft(imported);
    setDraftCustomSlots(custom);
    setActiveMode('import');
  };

  const handleApply = () => {
    importPalette(currentDraft, draftCustomSlots);

    if (activeMode === 'seed') {
      setAppliedLabel(`Seed Color (${seedColor.toLowerCase()})`);
    } else if (activeMode === 'preset') {
      const p = PALETTE_PRESETS.find((preset) => preset.id === selectedPresetId);
      setAppliedLabel(`Preset: ${p?.name || 'Curated'}`);
    } else {
      setAppliedLabel('Imported Palette');
    }

    setJustApplied(true);
    setTimeout(() => {
      setJustApplied(false);
      setIsCollapsed(true);
    }, 400);
  };

  return (
    <Card className="overflow-hidden border-indigo-200/70 dark:border-indigo-900/50 shadow-sm transition-all">
      {/* Collapsible Header Banner */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={!isCollapsed}
        aria-label="Toggle Base Palette Setup"
        onClick={() => setIsCollapsed(!isCollapsed)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsCollapsed(!isCollapsed);
          }
        }}
        className="w-full flex items-center justify-between p-4 cursor-pointer select-none bg-slate-50/70 dark:bg-slate-900/70 hover:bg-slate-100/70 dark:hover:bg-slate-850/70 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/50 dark:border-indigo-800/50">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Step 1
              </span>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Choose Base
              </h2>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60">
                {appliedLabel}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Start with a single seed color, load a curated preset, or import from external tools
            </p>
          </div>
        </div>

        {/* Right side: Mini swatches preview + expand/collapse chevron */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
            {SEMANTIC_ROLES.map((role) => (
              <span
                key={role}
                className="w-4 h-4 rounded-full border border-black/10 dark:border-white/10"
                style={{ backgroundColor: colors[role] }}
                title={`${role}: ${colors[role]}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <span>{isCollapsed ? 'Change Base' : 'Collapse'}</span>
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expanded Workflow Controls */}
      {!isCollapsed && (
        <div className="p-4 sm:p-5 border-t border-slate-200/70 dark:border-slate-800 space-y-4 bg-white dark:bg-slate-900 animate-in fade-in duration-150">
          {/* Controls Row: Single Color, Preset, Import, and Apply Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800">
            {/* 1. Single Seed Color Picker */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>Single Color:</span>
              </span>

              <div className="flex items-center gap-1.5">
                <label className="relative cursor-pointer flex items-center">
                  <input
                    type="color"
                    value={seedColor.startsWith('#') && seedColor.length === 7 ? seedColor : '#3b82f6'}
                    onChange={(e) => handleSeedChange(e.target.value)}
                    aria-label="Pick seed color"
                    className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0 bg-transparent"
                  />
                </label>
                <input
                  type="text"
                  value={seedColor}
                  onChange={(e) => handleSeedChange(e.target.value)}
                  placeholder="#3b82f6"
                  maxLength={7}
                  aria-label="Seed color hex code"
                  className="w-20 px-2 py-1 rounded-lg text-xs font-mono font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* 2. Curated Presets Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-500" />
                <span>Presets:</span>
              </span>
              <select
                value={activeMode === 'preset' ? selectedPresetId : ''}
                onChange={(e) => handlePresetSelect(e.target.value)}
                aria-label="Choose curated preset"
                className="px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="" disabled>
                  Select Preset...
                </option>
                {PALETTE_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Import Button */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-emerald-500" />
                <span>Import:</span>
              </span>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 shadow-2xs transition-all"
              >
                <span>Import URL / Code...</span>
              </button>
            </div>

            {/* 4. Confirmation Button */}
            <div>
              <button
                type="button"
                onClick={handleApply}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                {justApplied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Applied!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Apply Palette</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Draft Preview Swatches Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <span>Preview Selection (Uncommitted):</span>
              <span className="font-mono lowercase text-[10px] text-slate-400">
                Mode: {activeMode}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {SEMANTIC_ROLES.map((role) => {
                const hex = currentDraft[role];
                const textColor = getRecommendedTextColor(hex);
                return (
                  <div
                    key={role}
                    className="rounded-xl p-2 border border-slate-200/80 dark:border-slate-750 flex flex-col justify-between h-14 text-center shadow-2xs transition-colors"
                    style={{ backgroundColor: hex }}
                  >
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider truncate"
                      style={{ color: textColor }}
                    >
                      {role}
                    </span>
                    <span
                      className="text-[10px] font-mono"
                      style={{ color: textColor }}
                    >
                      {hex}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      <ImportPaletteModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportSuccess}
      />
    </Card>
  );
};
