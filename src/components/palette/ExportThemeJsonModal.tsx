import {
    Check,
    CheckCircle2,
    Copy,
    Download,
    ExternalLink,
    FileCode,
    FileJson,
    X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { usePalette } from '../../context/PaletteContext';
import { generateThemeJson, THEME_JSON_SCHEMA_URL } from '../../core/exporters';
import { validateThemeJson } from '../../core/exporters/themeJsonValidator';

export interface ExportThemeJsonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Inlined formal schema string for the Schema viewer tab
import schemaJson from '../../../schema/themetool.schema.json';

export const ExportThemeJsonModal: React.FC<ExportThemeJsonModalProps> = ({ isOpen, onClose }) => {
  const { colors, custom } = usePalette();
  const [themeName, setThemeName] = useState('ThemeTool Palette');
  const [activeTab, setActiveTab] = useState<'theme' | 'schema'>('theme');
  const [copiedTheme, setCopiedTheme] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  const exportedTheme = useMemo(() => {
    return generateThemeJson(colors, custom, { name: themeName });
  }, [colors, custom, themeName]);

  const validation = useMemo(() => {
    return validateThemeJson(exportedTheme);
  }, [exportedTheme]);

  const themeJsonString = useMemo(() => {
    return JSON.stringify(exportedTheme, null, 2);
  }, [exportedTheme]);

  const schemaJsonString = useMemo(() => {
    return JSON.stringify(schemaJson, null, 2);
  }, []);

  if (!isOpen) return null;

  const handleCopyTheme = () => {
    navigator.clipboard.writeText(themeJsonString);
    setCopiedTheme(true);
    setTimeout(() => setCopiedTheme(false), 2000);
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(schemaJsonString);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const handleDownloadTheme = () => {
    const blob = new Blob([themeJsonString], { type: 'application/json;charset=utf-8' });
    const url = typeof URL.createObjectURL === 'function'
      ? URL.createObjectURL(blob)
      : `data:application/json;charset=utf-8,${encodeURIComponent(themeJsonString)}`;
    const link = document.createElement('a');
    link.href = url;
    const safeName = themeName.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    link.download = `${safeName || 'theme'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (typeof URL.revokeObjectURL === 'function') {
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-json-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-850/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  id="export-json-modal-title"
                  className="text-base font-bold text-slate-900 dark:text-slate-100"
                >
                  Standard Theme JSON Exporter
                </h3>
                {validation.valid ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>Schema Valid</span>
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                    Validation Error
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Full theme definition conforming to the formal JSON Schema specification.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close export modal"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs & Theme Name Configuration */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
          {/* Tabs */}
          <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setActiveTab('theme')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'theme'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>theme.json</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('schema')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'schema'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>themetool.schema.json</span>
            </button>
          </div>

          {/* Theme Name input if on theme tab */}
          {activeTab === 'theme' && (
            <div className="flex items-center gap-2">
              <label htmlFor="theme-name-input" className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Name:
              </label>
              <input
                id="theme-name-input"
                type="text"
                value={themeName}
                onChange={(e) => setThemeName(e.target.value)}
                placeholder="Theme name..."
                aria-label="Theme Name"
                className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 font-mono text-xs">
          {activeTab === 'theme' ? (
            <div className="space-y-3">
              {/* Feature Highlights Banner */}
              <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-[11px] font-sans text-slate-600 dark:text-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">Roles:</span>
                  5 Core + {custom.length} Custom
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">Shade Scale:</span>
                  11 Steps (50–950)
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">Color Models:</span>
                  HEX, RGB, HSL, OKLCH
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">WCAG Contrast:</span>
                  AA / AAA Matrix
                </div>
              </div>

              {/* JSON Code Viewer */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100">
                <pre
                  data-testid="theme-json-preview"
                  className="p-4 overflow-x-auto max-h-[350px] leading-relaxed text-xs selection:bg-indigo-500/30"
                >
                  <code>{themeJsonString}</code>
                </pre>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Schema Info Card */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 text-[11px] font-sans text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">Formal URI:</span>{' '}
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 break-all">{THEME_JSON_SCHEMA_URL}</span>
                </div>
                <a
                  href={THEME_JSON_SCHEMA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
                >
                  <span>Open URL</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Schema Code Viewer */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100">
                <pre
                  data-testid="schema-json-preview"
                  className="p-4 overflow-x-auto max-h-[350px] leading-relaxed text-xs selection:bg-indigo-500/30"
                >
                  <code>{schemaJsonString}</code>
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/50 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {activeTab === 'theme' ? (
              <span>Conforms to Draft-07 JSON Schema standard.</span>
            ) : (
              <span>Standard schema for automated pipelines & CI validators.</span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {activeTab === 'theme' ? (
              <>
                {/* Copy Theme Button */}
                <button
                  type="button"
                  onClick={handleCopyTheme}
                  aria-label="Copy Theme JSON"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-xs transition-all cursor-pointer"
                >
                  {copiedTheme ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>

                {/* Download Theme Button */}
                <button
                  type="button"
                  onClick={handleDownloadTheme}
                  aria-label="Download theme.json"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download theme.json</span>
                </button>
              </>
            ) : (
              /* Copy Schema Button */
              <button
                type="button"
                onClick={handleCopySchema}
                aria-label="Copy JSON Schema"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-xs transition-all cursor-pointer"
              >
                {copiedSchema ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copied Schema!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Schema</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
