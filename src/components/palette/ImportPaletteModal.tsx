import { AlertCircle, Check, Download, ExternalLink, Link2, Sparkles, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { usePalette } from '../../context/PaletteContext';
import { getRecommendedTextColor } from '../../core/color';
import { parsePaletteUrl } from '../../core/importers';
import { ROLE_METADATA, SEMANTIC_ROLES } from '../../core/palette/types';

interface ImportPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_COOLORS = 'https://coolors.co/palette/6f2dbd-a663cc-b298dc-b8d0eb-b9faf8';
const SAMPLE_COLORKIT = 'https://colorkit.co/palette/eebea0-ff8d83-ffa89f-ffc2bc-aaae80/';

export const ImportPaletteModal: React.FC<ImportPaletteModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { importPalette } = usePalette();
  const [urlInput, setUrlInput] = useState('');
  const [justImported, setJustImported] = useState(false);

  const parsedResult = useMemo(() => {
    return parsePaletteUrl(urlInput);
  }, [urlInput]);

  if (!isOpen) return null;

  const handleImport = () => {
    if (!parsedResult) return;
    importPalette(parsedResult.mapped.colors, parsedResult.mapped.custom);
    setJustImported(true);
    setTimeout(() => {
      setJustImported(false);
      onClose();
    }, 500);
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'coolors':
        return 'Coolors.co Palette';
      case 'colorkit':
        return 'ColorKit.co Palette';
      case 'themetool':
        return 'ThemeTool Shared URL';
      default:
        return 'Raw Hex Color Set';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/50 dark:border-indigo-800/50">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 id="import-modal-title" className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Import Palette from URL
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paste a Coolors or ColorKit URL to import colors
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
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Quick Samples */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Try Sample URLs:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setUrlInput(SAMPLE_COOLORS)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-indigo-500" />
                Coolors Sample
              </button>
              <button
                type="button"
                onClick={() => setUrlInput(SAMPLE_COLORKIT)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                ColorKit Sample
              </button>
            </div>
          </div>

          {/* URL Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="palette-url-input"
              className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between"
            >
              <span>Palette URL or Hex Codes</span>
              {urlInput && (
                <button
                  type="button"
                  onClick={() => setUrlInput('')}
                  className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </label>
            <div className="relative">
              <input
                id="palette-url-input"
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://coolors.co/palette/... or https://colorkit.co/palette/..."
                className="w-full pl-8 pr-3 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Parse Result Feedback */}
          {urlInput.trim() !== '' && !parsedResult && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Unrecognized URL format</p>
                <p className="text-[11px] mt-0.5 text-rose-600 dark:text-rose-400">
                  Please provide a valid Coolors URL, ColorKit URL, or dash-separated hex string (e.g. 6f2dbd-a663cc-b298dc-b8d0eb-b9faf8).
                </p>
              </div>
            </div>
          )}

          {parsedResult && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                  <Check className="w-3 h-3 text-emerald-500" />
                  {getSourceLabel(parsedResult.source)} ({parsedResult.colors.length} colors detected)
                </span>
              </div>

              {/* Semantic Role Preview Swatches */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Mapped Semantic Roles:
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {SEMANTIC_ROLES.map((role) => {
                    const hex = parsedResult.mapped.colors[role];
                    const textColor = getRecommendedTextColor(hex);
                    return (
                      <div
                        key={role}
                        className="rounded-xl p-2 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between h-18 text-center shadow-xs"
                        style={{ backgroundColor: hex }}
                      >
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider truncate"
                          style={{ color: textColor }}
                        >
                          {ROLE_METADATA[role].label}
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

              {/* Custom extra colors if > 5 */}
              {parsedResult.mapped.custom && parsedResult.mapped.custom.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    Additional Custom Slots ({parsedResult.mapped.custom.length}):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {parsedResult.mapped.custom.map((slot) => {
                      const textColor = getRecommendedTextColor(slot.hex);
                      return (
                        <div
                          key={slot.id}
                          className="px-2 py-1 rounded-lg text-xs font-mono font-medium border border-slate-200/80 dark:border-slate-700"
                          style={{ backgroundColor: slot.hex, color: textColor }}
                        >
                          {slot.name}: {slot.hex}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <a
            href="https://coolors.co"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <span>Browse Coolors</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!parsedResult || justImported}
              onClick={handleImport}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all ${
                parsedResult && !justImported
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer active:scale-98'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              {justImported ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Imported!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Import to Palette</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
