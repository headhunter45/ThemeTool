import { ArrowLeft, Eye, LayoutGrid, Monitor } from 'lucide-react';
import React from 'react';
import { usePreviewTargets } from '../../core/preview';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { PlatformPreviewCard } from './PlatformPreviewCard';
import { PreviewTargetBar } from './PreviewTargetBar';

export const PreviewSection: React.FC = () => {
  const {
    mode,
    setMode,
    visibleTargets,
    toggleTargetVisibility,
    showAllTargets,
    hideAllTargets,
    allTargets,
    visibleCount,
    isTargetVisible,
  } = usePreviewTargets();

  const isAllMode = mode === 'all';
  const focusedTarget = !isAllMode ? allTargets.find((t) => t.id === mode) : null;
  const visibleCardTargets = allTargets.filter((t) => isTargetVisible(t.id));

  return (
    <Card className="border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
      <CardHeader className="flex flex-col gap-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Step 3
              </span>
              <CardTitle className="text-base flex items-center gap-2">
                <Monitor className="w-4 h-4 text-indigo-500" />
                <span>Component & Platform Previews</span>
              </CardTitle>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live preview of your theme applied to interactive components and multi-target mobile/web frames
            </p>
          </div>

          {!isAllMode && (
            <button
              type="button"
              onClick={() => setMode('all')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Targets</span>
            </button>
          )}
        </div>

        {/* Target Selection & Visibility Bar */}
        <PreviewTargetBar
          mode={mode}
          onModeChange={setMode}
          visibleTargets={visibleTargets}
          onToggleTarget={toggleTargetVisibility}
          onShowAll={showAllTargets}
          onHideAll={hideAllTargets}
          allTargets={allTargets}
          visibleCount={visibleCount}
        />
      </CardHeader>

      <CardContent className="p-6">
        {isAllMode ? (
          visibleCardTargets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-in fade-in duration-200">
              {visibleCardTargets.map((target) => (
                <PlatformPreviewCard
                  key={target.id}
                  target={target}
                  isFocused={false}
                  onFocus={() => setMode(target.id)}
                />
              ))}
            </div>
          ) : (
            /* Empty State when all targets toggled off */
            <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30 space-y-3">
              <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  No preview targets visible
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  All preview platforms are currently toggled off. Select individual pills above or show all platforms.
                </p>
              </div>
              <button
                type="button"
                onClick={showAllTargets}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Show All Targets</span>
              </button>
            </div>
          )
        ) : (
          /* Focused Single-Platform View */
          focusedTarget && (
            <div className="max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-200">
              <PlatformPreviewCard
                target={focusedTarget}
                isFocused={true}
              />
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};
