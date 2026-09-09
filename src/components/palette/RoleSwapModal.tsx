import { ArrowLeftRight, Check, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { usePalette } from '../../context/PaletteContext';
import { getRecommendedTextColor } from '../../core/color';
import { ROLE_METADATA, SEMANTIC_ROLES, SemanticRole } from '../../core/palette/types';

export interface RoleSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuickSwapPreset {
  label: string;
  roleA: SemanticRole;
  roleB: SemanticRole;
}

const QUICK_PRESETS: QuickSwapPreset[] = [
  { label: 'Primary ↔ Secondary', roleA: 'primary', roleB: 'secondary' },
  { label: 'Text ↔ Background', roleA: 'text', roleB: 'background' },
  { label: 'Primary ↔ Accent', roleA: 'primary', roleB: 'accent' },
  { label: 'Secondary ↔ Accent', roleA: 'secondary', roleB: 'accent' },
];

export const RoleSwapModal: React.FC<RoleSwapModalProps> = ({ isOpen, onClose }) => {
  const { colors, swapRoles } = usePalette();
  const [roleA, setRoleA] = useState<SemanticRole>('primary');
  const [roleB, setRoleB] = useState<SemanticRole>('secondary');
  const [justSwapped, setJustSwapped] = useState(false);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSwap = () => {
    if (roleA === roleB) return;
    swapRoles(roleA, roleB);
    setJustSwapped(true);
    setTimeout(() => {
      setJustSwapped(false);
      onClose();
    }, 400);
  };

  const handleInvertSelection = () => {
    setRoleA(roleB);
    setRoleB(roleA);
  };

  const colorA = colors[roleA];
  const colorB = colors[roleB];
  const textColorA = getRecommendedTextColor(colorA);
  const textColorB = getRecommendedTextColor(colorB);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="role-swap-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h2 id="role-swap-modal-title" className="text-base font-bold text-slate-900 dark:text-slate-100">
                Quick Role Swap
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Immediately exchange hex values between any two semantic roles
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close role swap modal"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Quick Preset Shortcuts */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2">
              Common Role Swaps
            </label>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setRoleA(preset.roleA);
                    setRoleB(preset.roleB);
                  }}
                  className={`px-3 py-2 text-xs font-medium rounded-xl border text-left transition-all flex items-center justify-between ${
                    (roleA === preset.roleA && roleB === preset.roleB) ||
                    (roleA === preset.roleB && roleB === preset.roleA)
                      ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-50/40 dark:bg-slate-850/40'
                  }`}
                >
                  <span>{preset.label}</span>
                  <div className="flex items-center -space-x-1.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white dark:border-slate-900 shadow-2xs"
                      style={{ backgroundColor: colors[preset.roleA] }}
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white dark:border-slate-900 shadow-2xs"
                      style={{ backgroundColor: colors[preset.roleB] }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Role Pickers & Swatches */}
          <div className="bg-slate-50 dark:bg-slate-850/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-5 items-center gap-3">
              {/* Role A Picker */}
              <div className="sm:col-span-2 space-y-1.5">
                <label
                  htmlFor="role-a-select"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 block"
                >
                  Role 1
                </label>
                <select
                  id="role-a-select"
                  aria-label="First role to swap"
                  value={roleA}
                  onChange={(e) => setRoleA(e.target.value as SemanticRole)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer shadow-2xs"
                >
                  {SEMANTIC_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {ROLE_METADATA[role].label} ({colors[role]})
                    </option>
                  ))}
                </select>

                <div
                  className="h-16 rounded-xl p-2.5 flex flex-col justify-between shadow-xs border border-black/5 dark:border-white/5 transition-colors"
                  style={{ backgroundColor: colorA }}
                >
                  <span className="text-[11px] font-bold" style={{ color: textColorA }}>
                    {ROLE_METADATA[roleA].label}
                  </span>
                  <span className="text-xs font-mono" style={{ color: textColorA }}>
                    {colorA}
                  </span>
                </div>
              </div>

              {/* Flip Button */}
              <div className="sm:col-span-1 flex flex-col items-center justify-center pt-5">
                <button
                  type="button"
                  onClick={handleInvertSelection}
                  title="Invert roles"
                  aria-label="Invert role selection"
                  className="p-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-400 shadow-sm transition-all hover:scale-110 active:scale-95 cursor-pointer"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>

              {/* Role B Picker */}
              <div className="sm:col-span-2 space-y-1.5">
                <label
                  htmlFor="role-b-select"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 block"
                >
                  Role 2
                </label>
                <select
                  id="role-b-select"
                  aria-label="Second role to swap"
                  value={roleB}
                  onChange={(e) => setRoleB(e.target.value as SemanticRole)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer shadow-2xs"
                >
                  {SEMANTIC_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {ROLE_METADATA[role].label} ({colors[role]})
                    </option>
                  ))}
                </select>

                <div
                  className="h-16 rounded-xl p-2.5 flex flex-col justify-between shadow-xs border border-black/5 dark:border-white/5 transition-colors"
                  style={{ backgroundColor: colorB }}
                >
                  <span className="text-[11px] font-bold" style={{ color: textColorB }}>
                    {ROLE_METADATA[roleB].label}
                  </span>
                  <span className="text-xs font-mono" style={{ color: textColorB }}>
                    {colorB}
                  </span>
                </div>
              </div>
            </div>

            {/* Validation Notice */}
            {roleA === roleB && (
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium text-center">
                Please select two different roles to perform a swap.
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSwap}
            disabled={roleA === roleB || justSwapped}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed"
          >
            {justSwapped ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Swapped!</span>
              </>
            ) : (
              <>
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Swap Roles</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
