import { AlertCircle, Check, Download, ExternalLink, Link2, Sparkles, X } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { usePalette } from '../../context/PaletteContext';
import { generateShadeScale, getRecommendedTextColor, SHADE_STEPS } from '../../core/color';
import { parsePaletteUrl, parseTailwindImport } from '../../core/importers';
import { CustomColorSlot, PaletteColors, ROLE_METADATA, SEMANTIC_ROLES, SemanticRole } from '../../core/palette/types';

interface ImportPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport?: (colors: PaletteColors, custom?: CustomColorSlot[]) => void;
}

const SAMPLE_COOLORS = 'https://coolors.co/palette/6f2dbd-a663cc-b298dc-b8d0eb-b9faf8';
const SAMPLE_COLORKIT = 'https://colorkit.co/palette/eebea0-ff8d83-ffa89f-ffc2bc-aaae80/';
const SAMPLE_REALTIME = 'https://www.realtimecolors.com/?colors=050315-fbfbfe-2f27ce-dedcff-433bff';
const SAMPLE_JSON = `{
  "text": "#050315",
  "background": "#fbfbfe",
  "primary": "#2f27ce",
  "secondary": "#dedcff",
  "accent": "#433bff"
}`;
const SAMPLE_RAW_HEX = '#050315 #fbfbfe #2f27ce #dedcff #433bff';
const SAMPLE_UICOLORS_URL = 'https://uicolors.app/generate/b49c2c?name=lucky';
const SAMPLE_TAILWIND_3 = `'lucky': {
  '50': '#faf9ec',
  '100': '#f4f1ce',
  '200': '#eae3a1',
  '300': '#decf6b',
  '400': '#d2bc40',
  '500': '#b49c2c',
  '600': '#a28425',
  '700': '#806420',
  '800': '#6a5121',
  '900': '#5b4521',
  '950': '#34250f',
}`;
const SAMPLE_TAILWIND_4 = `--color-lucky-50: #faf9ec;
--color-lucky-100: #f4f1ce;
--color-lucky-200: #eae3a1;
--color-lucky-300: #decf6b;
--color-lucky-400: #d2bc40;
--color-lucky-500: #b49c2c;
--color-lucky-600: #a28425;
--color-lucky-700: #806420;
--color-lucky-800: #6a5121;
--color-lucky-900: #5b4521;
--color-lucky-950: #34250f;`;

export const ImportPaletteModal: React.FC<ImportPaletteModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const { importPalette, setColor } = usePalette();
  const [urlInput, setUrlInput] = useState('');
  const [targetRole, setTargetRole] = useState<SemanticRole>('primary');
  const [justImported, setJustImported] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // 1. Try Coolors/ColorKit/ThemeTool/Raw palette
  const parsedPalette = useMemo(() => {
    return parsePaletteUrl(urlInput);
  }, [urlInput]);

  // 2. Try Tailwind 3, Tailwind 4, or UIColors URL
  const parsedTailwind = useMemo(() => {
    if (parsedPalette) return null;
    return parseTailwindImport(urlInput);
  }, [urlInput, parsedPalette]);

  const hasResult = Boolean(parsedPalette || parsedTailwind);

  // Compute live 11-step scale for Tailwind base hex
  const tailwindShadeScale = useMemo(() => {
    if (!parsedTailwind) return null;
    try {
      return generateShadeScale(parsedTailwind.baseHex);
    } catch {
      return null;
    }
  }, [parsedTailwind]);

  if (!isOpen) return null;

  const handleImport = () => {
    if (parsedPalette) {
      if (onImport) {
        onImport(parsedPalette.mapped.colors, parsedPalette.mapped.custom);
      } else {
        importPalette(parsedPalette.mapped.colors, parsedPalette.mapped.custom);
      }
    } else if (parsedTailwind) {
      if (onImport) {
        onImport({ [targetRole]: parsedTailwind.baseHex } as unknown as PaletteColors);
      } else {
        setColor(targetRole, parsedTailwind.baseHex);
      }
    } else {
      return;
    }

    setJustImported(true);
    timerRef.current = setTimeout(() => {
      setJustImported(false);
      onClose();
    }, 500);
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'realtimecolors':
        return 'Realtime Colors Palette';
      case 'json':
        return 'JSON Theme Payload';
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

  const getTailwindFormatLabel = (format: string) => {
    switch (format) {
      case 'tailwind3':
        return 'Tailwind v3 JS Object';
      case 'tailwind4':
        return 'Tailwind v4 CSS Variables';
      case 'uicolors-url':
        return 'UIColors.app URL';
      default:
        return 'Tailwind / UIColors Format';
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
                Import Palette & Themes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paste Coolors, ColorKit, Realtime Colors, Tailwind, UIColors, JSON, or Hex codes
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
              Try Sample Formats:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setUrlInput(SAMPLE_COOLORS)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-indigo-500" />
                Coolors Sample
              </button>
              <button
                type="button"
                onClick={() => setUrlInput(SAMPLE_COLORKIT)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                ColorKit Sample
              </button>
              <button
                type="button"
                onClick={() => setUrlInput(SAMPLE_REALTIME)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-rose-500" />
                Realtime Colors
              </button>
              <button
                type="button"
                onClick={() => setUrlInput(SAMPLE_TAILWIND_3)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-sky-500" />
                Tailwind 3 Sample
              </button>
              <button
                type="button"
                onClick={() => setUrlInput(SAMPLE_TAILWIND_4)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-emerald-500" />
                Tailwind 4 Sample
              </button>
              <button
                type="button"
                onClick={() => setUrlInput(SAMPLE_UICOLORS_URL)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-purple-500" />
                UIColors URL
              </button>
              <button
                type="button"
                onClick={() => setUrlInput(SAMPLE_JSON)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-teal-500" />
                JSON Sample
              </button>
              <button
                type="button"
                onClick={() => setUrlInput(SAMPLE_RAW_HEX)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-orange-500" />
                Raw Hex Sample
              </button>
            </div>
          </div>

          {/* Input field (Textarea for code snippets & URLs) */}
          <div className="space-y-1.5">
            <label
              htmlFor="palette-url-input"
              className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between"
            >
              <span>Paste URL or Code Snippet</span>
              {urlInput && (
                <button
                  type="button"
                  onClick={() => setUrlInput('')}
                  className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </label>
            <div className="relative">
              <textarea
                id="palette-url-input"
                rows={urlInput.includes('\n') ? 5 : 2}
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste Coolors URL, ColorKit URL, UIColors URL, or Tailwind 3/4 snippet..."
                className="w-full pl-8 pr-3 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Parse Failure Feedback */}
          {urlInput.trim() !== '' && !hasResult && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Unrecognized format</p>
                <p className="text-[11px] mt-0.5 text-rose-600 dark:text-rose-400">
                  Please provide a valid Coolors/ColorKit URL, UIColors URL, or Tailwind 3/4 snippet.
                </p>
              </div>
            </div>
          )}

          {/* 1. Standard Palette Result (Coolors, ColorKit, ThemeTool, Raw Hexes) */}
          {parsedPalette && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                  <Check className="w-3 h-3 text-emerald-500" />
                  {getSourceLabel(parsedPalette.source)} ({parsedPalette.colors.length} colors detected)
                </span>
              </div>

              {/* Mapped Role Swatches */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Mapped Semantic Roles:
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {SEMANTIC_ROLES.map((role) => {
                    const hex = parsedPalette.mapped.colors[role];
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

              {/* Custom Extra Slots if > 5 */}
              {parsedPalette.mapped.custom && parsedPalette.mapped.custom.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    Additional Custom Slots ({parsedPalette.mapped.custom.length}):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {parsedPalette.mapped.custom.map((slot) => {
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

          {/* 2. Tailwind / UIColors Result */}
          {parsedTailwind && (
            <div className="space-y-3 pt-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                  <Check className="w-3 h-3 text-indigo-500" />
                  {getTailwindFormatLabel(parsedTailwind.format)}
                  {parsedTailwind.name && ` ("${parsedTailwind.name}")`}
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Base 500: {parsedTailwind.baseHex}
                </span>
              </div>

              {/* Role Target Selector */}
              <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750">
                <label
                  htmlFor="tailwind-role-select"
                  className="text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  Assign base color to role:
                </label>
                <select
                  id="tailwind-role-select"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value as SemanticRole)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-xs"
                >
                  {SEMANTIC_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {ROLE_METADATA[role].label} (Currently {role === 'primary' ? 'Primary' : role})
                    </option>
                  ))}
                </select>
              </div>

              {/* 11-Step OKLCH Preview Scale */}
              {tailwindShadeScale && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span>Generated 11-Step Perceptual OKLCH Scale:</span>
                    <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400">
                      Step 500 = {parsedTailwind.baseHex}
                    </span>
                  </div>
                  <div className="grid grid-cols-11 gap-1">
                    {SHADE_STEPS.map((step) => {
                      const shade = tailwindShadeScale[step];
                      const hex = shade.hex;
                      const textColor = getRecommendedTextColor(hex);
                      const isBase = step === '500';
                      return (
                        <div
                          key={step}
                          className={`rounded-lg p-1 flex flex-col items-center justify-between h-14 text-center transition-all ${
                            isBase ? 'ring-2 ring-indigo-500 shadow-sm' : ''
                          }`}
                          style={{ backgroundColor: hex }}
                          title={`Step ${step}: ${hex}`}
                        >
                          <span
                            className="text-[9px] font-bold"
                            style={{ color: textColor }}
                          >
                            {step}
                          </span>
                          {isBase && (
                            <span
                              className="text-[8px] font-semibold px-1 py-0.2 rounded"
                              style={{
                                backgroundColor: textColor === '#ffffff' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.7)',
                                color: textColor,
                              }}
                            >
                              500
                            </span>
                          )}
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
          <div className="flex items-center gap-3">
            <a
              href="https://uicolors.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <span>UIColors.app</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <a
              href="https://coolors.co"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <span>Coolors</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

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
              disabled={!hasResult || justImported}
              onClick={handleImport}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all ${
                hasResult && !justImported
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
