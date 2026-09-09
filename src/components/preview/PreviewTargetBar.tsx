import { Check, LayoutGrid } from 'lucide-react';
import React from 'react';
import { PreviewMode, PreviewTargetId, TargetMetadata } from '../../core/preview/types';

export interface PreviewTargetBarProps {
  mode: PreviewMode;
  onModeChange: (mode: PreviewMode) => void;
  visibleTargets: Record<PreviewTargetId, boolean>;
  onToggleTarget: (id: PreviewTargetId) => void;
  onShowAll: () => void;
  onHideAll: () => void;
  allTargets: TargetMetadata[];
  visibleCount: number;
}

export const PreviewTargetBar: React.FC<PreviewTargetBarProps> = ({
  mode,
  onModeChange,
  visibleTargets,
  onToggleTarget,
  onShowAll,
  onHideAll,
  allTargets,
  visibleCount,
}) => {
  const isAllMode = mode === 'all';

  return (
    <div className="space-y-3">
      {/* Primary Segmented Target Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
          {/* All Targets Tab */}
          <button
            type="button"
            onClick={() => onModeChange('all')}
            aria-pressed={isAllMode}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isAllMode
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>All Targets</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                isAllMode
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {visibleCount}/{allTargets.length}
            </span>
          </button>

          <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-700 mx-0.5" />

          {/* Single-Platform Focus Tabs */}
          {allTargets.map((target) => {
            const isSelected = mode === target.id;
            return (
              <button
                key={target.id}
                type="button"
                onClick={() => onModeChange(target.id)}
                aria-pressed={isSelected}
                aria-label={`Focus ${target.label} tab`}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{target.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Help Label */}
        <div className="text-[11px] text-slate-500 dark:text-slate-400 px-1 hidden md:block">
          {isAllMode ? (
            <span>Showing {visibleCount} of {allTargets.length} platforms</span>
          ) : (
            <span>Single-platform focus mode</span>
          )}
        </div>
      </div>

      {/* "All" Mode: Interactive Toggle Pills Row */}
      {isAllMode && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
              <span>Show / Hide:</span>
            </span>

            {allTargets.map((target) => {
              const isVisible = !!visibleTargets[target.id];
              return (
                <button
                  key={target.id}
                  type="button"
                  onClick={() => onToggleTarget(target.id)}
                  aria-pressed={isVisible}
                  aria-label={`Toggle ${target.label} visibility`}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                    isVisible
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 shadow-2xs font-semibold'
                      : 'bg-slate-50 dark:bg-slate-850/60 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${
                      isVisible
                        ? 'bg-indigo-600 text-white'
                        : 'border border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isVisible && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </span>
                  <span>{target.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Bulk Actions */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={onShowAll}
              className="text-[11px] font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Show All
            </button>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <button
              type="button"
              onClick={onHideAll}
              className="text-[11px] font-medium text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 px-2 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Hide All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
