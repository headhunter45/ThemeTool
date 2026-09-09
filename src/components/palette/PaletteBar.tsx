import {
  ArrowLeftRight,
  Check,
  Copy,
  Dices,
  Eye,
  Lock,
  Moon,
  Plus,
  Redo2,
  RotateCcw,
  Sparkles,
  Sun,
  Trash2,
  Undo2,
  Unlock,
} from 'lucide-react';
import React, { useState } from 'react';
import { usePalette } from '../../context/PaletteContext';
import { getContrastRatio, getRecommendedTextColor } from '../../core/color';
import { ROLE_METADATA, SEMANTIC_ROLES, SemanticRole } from '../../core/palette/types';
import { ColorInspectorModal } from '../color';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { DualityModal } from './DualityModal';
import { RoleSwapModal } from './RoleSwapModal';

export const PaletteBar: React.FC = () => {
  const {
    colors,
    locks,
    custom,
    setColor,
    toggleLock,
    randomizeUnlocked,
    undo,
    redo,
    resetToDefault,
    activeRole,
    setActiveRole,
    canUndo,
    canRedo,
    addCustomSlot,
    updateCustomSlot,
    removeCustomSlot,
    toggleCustomSlotLock,
    activeMode,
    setActiveMode,
  } = usePalette();

  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [inspectorRole, setInspectorRole] = useState<SemanticRole>('primary');
  const [inspectorCustomSlotId, setInspectorCustomSlotId] = useState<string | null>(null);
  const [isSwapOpen, setIsSwapOpen] = useState(false);
  const [isDualityOpen, setIsDualityOpen] = useState(false);
  const [copiedCardKey, setCopiedCardKey] = useState<string | null>(null);

  const handleCopyHex = (key: string, hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedCardKey(key);
    setTimeout(() => setCopiedCardKey(null), 1800);
  };

  return (
    <Card className="overflow-hidden border-indigo-200/60 dark:border-indigo-900/40 shadow-md">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Step 2
            </span>
            <CardTitle className="flex items-center gap-2">
              <span>Experiment</span>
            </CardTitle>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Adjust semantic color roles, explore dark mode duality, swap roles, and fine-tune palette shades
          </p>
        </div>

        {/* Global Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Active Mode Switcher (☀️ Light / 🌙 Dark) */}
          <div className="inline-flex items-center rounded-xl bg-slate-200/80 dark:bg-slate-800 p-0.5 border border-slate-300/70 dark:border-slate-700 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveMode('light')}
              aria-label="Switch to Light mode palette"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeMode === 'light'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('dark')}
              aria-label="Switch to Dark mode palette"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeMode === 'dark'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>
          </div>

          {/* Duality Studio Button */}
          <button
            type="button"
            onClick={() => setIsDualityOpen(true)}
            aria-label="Dark Mode Duality"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            title="Open Dark Mode Duality Studio to compare and derive counterpart palettes"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Duality</span>
          </button>

          {/* Undo Button */}
          <button
            type="button"
            onClick={undo}
            disabled={!canUndo}
            className={`p-1.5 rounded-xl transition-all ${
              canUndo
                ? 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
                : 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50'
            }`}
            title="Undo (Cmd/Ctrl+Z)"
            aria-label="Undo palette action"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          {/* Redo Button */}
          <button
            type="button"
            onClick={redo}
            disabled={!canRedo}
            className={`p-1.5 rounded-xl transition-all ${
              canRedo
                ? 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
                : 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50'
            }`}
            title="Redo (Cmd/Ctrl+Shift+Z, Cmd/Ctrl+Y)"
            aria-label="Redo palette action"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          {/* Swap Roles Button */}
          <button
            type="button"
            onClick={() => setIsSwapOpen(true)}
            aria-label="Quick role swap"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            title="Swap colors between two semantic roles"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-500" />
            <span>Swap Roles</span>
          </button>

          {/* Add Color Slot Button */}
          <button
            type="button"
            onClick={() => addCustomSlot()}
            aria-label="Add custom color slot"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            title="Add a custom color slot to the palette"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-500" />
            <span>Add Color Slot</span>
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
        {/* Unified Cards Grid: 5 Semantic Roles + Custom Color Slots */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {SEMANTIC_ROLES.map((role) => {
            const hex = colors[role];
            const meta = ROLE_METADATA[role];
            const isLocked = locks[role];
            const isSelected = activeRole === role;
            const textContrast = role !== 'background' ? getContrastRatio(hex, colors.background) : null;
            const textColor = getRecommendedTextColor(hex);
            const isCopied = copiedCardKey === role;

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
                    className={`p-1 rounded-lg text-xs transition-colors cursor-pointer ${
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
                  <div
                    className="relative h-20 w-full rounded-xl overflow-hidden shadow-inner flex flex-col justify-between p-2.5 transition-colors border border-black/5 dark:border-white/5"
                    style={{ backgroundColor: hex }}
                  >
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

                  {/* Manual Hex Input with HEX badge & Copy Feedback */}
                  <div className="flex items-center gap-1.5">
                    <div className="relative flex-1 flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 overflow-hidden shadow-2xs">
                      <span className="pl-2 pr-1 text-[10px] font-semibold tracking-wider uppercase text-slate-600 dark:text-slate-400 select-none">
                        HEX:
                      </span>
                      <input
                        type="text"
                        value={hex}
                        onChange={(e) => setColor(role, e.target.value)}
                        placeholder="#000000"
                        aria-label={`${meta.label} hex code`}
                        className="w-full py-1 pr-2 text-xs font-mono font-semibold bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none focus:text-slate-900 dark:focus:text-slate-100"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyHex(role, hex)}
                      aria-label={`Copy ${meta.label} hex code`}
                      title={isCopied ? 'Copied to clipboard!' : 'Copy hex code'}
                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700'
                          : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                      }`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Contextual Inspect Action */}
                  <button
                    type="button"
                    onClick={() => {
                      setInspectorRole(role);
                      setInspectorCustomSlotId(null);
                      setActiveRole(role);
                      setIsInspectorOpen(true);
                    }}
                    aria-label={`Inspect ${meta.label} shades and color math`}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/80 dark:border-slate-750 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Eye className="w-3 h-3 text-indigo-500" />
                    <span>Inspect Shades</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Custom Color Slots rendered inside the same primary grid */}
          {custom.map((slot) => {
            const hex = slot.hex;
            const isLocked = !!slot.locked;
            const textColor = getRecommendedTextColor(hex);
            const textContrast = getContrastRatio(hex, colors.background);
            const isCopied = copiedCardKey === slot.id;

            return (
              <div
                key={slot.id}
                className="relative flex flex-col rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all overflow-hidden bg-white dark:bg-slate-900 shadow-xs"
              >
                {/* Slot Header */}
                <div className="p-3 pb-2 flex items-center justify-between gap-1 border-b border-slate-100 dark:border-slate-800/80">
                  <input
                    type="text"
                    value={slot.name}
                    aria-label={`Custom slot ${slot.id} name`}
                    onChange={(e) => updateCustomSlot(slot.id, { name: e.target.value })}
                    className="text-xs font-bold text-slate-900 dark:text-slate-100 bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-indigo-500 focus:outline-none px-0.5 w-28 truncate"
                  />

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Lock Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleCustomSlotLock(slot.id)}
                      aria-label={`Toggle lock for ${slot.name}`}
                      title={isLocked ? 'Locked (will not change on randomize)' : 'Unlocked'}
                      className={`p-1 rounded-lg text-xs transition-colors cursor-pointer ${
                        isLocked
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                      }`}
                    >
                      {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    </button>

                    {/* Delete Slot Button */}
                    <button
                      type="button"
                      onClick={() => removeCustomSlot(slot.id)}
                      aria-label={`Delete ${slot.name}`}
                      title="Delete slot"
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Swatch & Input Area */}
                <div className="p-3 space-y-2.5">
                  <div
                    className="relative h-20 w-full rounded-xl overflow-hidden shadow-inner flex flex-col justify-between p-2.5 transition-colors border border-black/5 dark:border-white/5"
                    style={{ backgroundColor: hex }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[11px] font-semibold truncate max-w-[90px]"
                        style={{ color: textColor }}
                      >
                        {slot.name}
                      </span>
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded backdrop-blur-sm"
                        style={{
                          backgroundColor: textColor === '#ffffff' ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.6)',
                          color: textColor,
                        }}
                      >
                        {textContrast}:1 on bg
                      </span>
                    </div>

                    {/* Native Color Picker Input Overlay */}
                    <input
                      type="color"
                      value={hex}
                      aria-label={`${slot.name} color picker`}
                      onChange={(e) => updateCustomSlot(slot.id, { hex: e.target.value })}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />

                    <span
                      className="text-xs font-mono font-medium"
                      style={{ color: textColor }}
                    >
                      {hex}
                    </span>
                  </div>

                  {/* Manual Hex Input with HEX badge & Copy Feedback */}
                  <div className="flex items-center gap-1.5">
                    <div className="relative flex-1 flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 overflow-hidden shadow-2xs">
                      <span className="pl-2 pr-1 text-[10px] font-semibold tracking-wider uppercase text-slate-600 dark:text-slate-400 select-none">
                        HEX:
                      </span>
                      <input
                        type="text"
                        value={hex}
                        onChange={(e) => updateCustomSlot(slot.id, { hex: e.target.value })}
                        placeholder="#000000"
                        aria-label={`${slot.name} hex code`}
                        className="w-full py-1 pr-2 text-xs font-mono font-semibold bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none focus:text-slate-900 dark:focus:text-slate-100"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyHex(slot.id, hex)}
                      aria-label={`Copy ${slot.name} hex code`}
                      title={isCopied ? 'Copied to clipboard!' : 'Copy hex code'}
                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700'
                          : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                      }`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Contextual Inspect Action for Custom Slot */}
                  <button
                    type="button"
                    onClick={() => {
                      setInspectorCustomSlotId(slot.id);
                      setIsInspectorOpen(true);
                    }}
                    aria-label={`Inspect ${slot.name} shades and color math`}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/80 dark:border-slate-750 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Eye className="w-3 h-3 text-indigo-500" />
                    <span>Inspect Shades</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>

      <ColorInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => {
          setIsInspectorOpen(false);
          setInspectorCustomSlotId(null);
        }}
        targetRole={inspectorRole}
        targetCustomSlotId={inspectorCustomSlotId}
      />

      <RoleSwapModal
        isOpen={isSwapOpen}
        onClose={() => setIsSwapOpen(false)}
      />

      <DualityModal
        isOpen={isDualityOpen}
        onClose={() => setIsDualityOpen(false)}
      />
    </Card>
  );
};
