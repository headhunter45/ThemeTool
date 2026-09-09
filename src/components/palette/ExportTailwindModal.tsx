import {
    Check,
    Code2,
    Copy,
    Download,
    FileCode,
    Info,
    Layers,
    Sparkles,
    X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { usePalette } from '../../context/PaletteContext';
import {
    downloadTailwindFile,
    generateTailwindV3,
    generateTailwindV4,
} from '../../core/exporters/tailwind';

export interface ExportTailwindModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportTailwindModal: React.FC<ExportTailwindModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { colors, custom } = usePalette();
  const [activeTab, setActiveTab] = useState<'v4' | 'v3'>('v4');
  const [prefix, setPrefix] = useState('');
  const [includeShades, setIncludeShades] = useState(true);
  const [v3Format, setV3Format] = useState<'cjs' | 'esm' | 'snippet'>('cjs');
  const [copied, setCopied] = useState(false);

  // Generate code dynamically based on options
  const v4Code = useMemo(() => {
    return generateTailwindV4(colors, custom, {
      prefix,
      includeShades,
    });
  }, [colors, custom, prefix, includeShades]);

  const v3Code = useMemo(() => {
    return generateTailwindV3(colors, custom, {
      prefix,
      includeShades,
      format: v3Format,
    });
  }, [colors, custom, prefix, includeShades, v3Format]);

  const activeCode = activeTab === 'v4' ? v4Code : v3Code;
  const activeFilename = activeTab === 'v4' ? 'theme.css' : 'tailwind.config.js';
  const activeMimeType = activeTab === 'v4' ? 'text/css;charset=utf-8' : 'application/javascript;charset=utf-8';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadTailwindFile(activeCode, activeFilename, activeMimeType);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-tailwind-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-850/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-200/60 dark:border-cyan-800/60">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  id="export-tailwind-modal-title"
                  className="text-base font-bold text-slate-900 dark:text-slate-100"
                >
                  Export Tailwind Theme
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                  v3 & v4 Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Generate production Tailwind v4 CSS variables or Tailwind v3 JavaScript config
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector & Controls Bar */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
          {/* Version Tabs */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('v4')}
              aria-pressed={activeTab === 'v4'}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'v4'
                  ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tailwind v4 (@theme CSS)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('v3')}
              aria-pressed={activeTab === 'v3'}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'v3'
                  ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Tailwind v3 (JS Config)</span>
            </button>
          </div>

          {/* Configuration Options */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Prefix Input */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="tailwind-prefix-input" className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Prefix:
              </label>
              <input
                id="tailwind-prefix-input"
                type="text"
                placeholder="e.g. brand-"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                aria-label="Color token prefix"
                className="w-24 px-2.5 py-1 rounded-xl text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>

            {/* Include Shades Checkbox */}
            <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeShades}
                onChange={(e) => setIncludeShades(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-cyan-600 focus:ring-cyan-500/20"
              />
              <span>50–950 Scales</span>
            </label>

            {/* v3 Format Selector */}
            {activeTab === 'v3' && (
              <select
                value={v3Format}
                onChange={(e) => setV3Format(e.target.value as 'cjs' | 'esm' | 'snippet')}
                aria-label="Tailwind v3 format"
                className="px-2.5 py-1 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 cursor-pointer"
              >
                <option value="cjs">CommonJS (module.exports)</option>
                <option value="esm">ESM (export default)</option>
                <option value="snippet">Colors snippet only</option>
              </select>
            )}
          </div>
        </div>

        {/* Code Content Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden text-slate-200 font-mono text-xs shadow-inner">
            <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500/80 inline-block" />
                <span className="font-semibold text-slate-300">{activeFilename}</span>
                <span>•</span>
                <span>{activeCode.split('\n').length} lines</span>
              </div>
              <span className="text-[10px] text-slate-500">
                {activeTab === 'v4' ? 'CSS Theme Variables' : 'Tailwind Config Module'}
              </span>
            </div>
            <pre className="p-4 overflow-x-auto max-h-72 leading-relaxed text-slate-200 select-all">
              <code data-testid="tailwind-code-preview">{activeCode}</code>
            </pre>
          </div>

          {/* Quick Integration Instructions */}
          <div className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-900/40 text-xs space-y-2">
            <div className="flex items-center gap-2 text-cyan-900 dark:text-cyan-300 font-bold">
              <Info className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span>
                {activeTab === 'v4'
                  ? 'How to use in Tailwind CSS v4'
                  : 'How to use in Tailwind CSS v3'}
              </span>
            </div>
            {activeTab === 'v4' ? (
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Save as <code className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-cyan-200/60 dark:border-cyan-800 font-semibold text-cyan-700 dark:text-cyan-300">theme.css</code> in your styles folder, then add <code className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-cyan-200/60 dark:border-cyan-800 font-semibold text-cyan-700 dark:text-cyan-300">@import "./theme.css";</code> right after <code className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-cyan-200/60 dark:border-cyan-800 font-semibold text-cyan-700 dark:text-cyan-300">@import "tailwindcss";</code>. All classes (e.g. <code className="text-slate-800 dark:text-slate-200 font-semibold">bg-primary-500</code>, <code className="text-slate-800 dark:text-slate-200 font-semibold">text-accent</code>) will be available automatically.
              </p>
            ) : (
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Save as or paste into your <code className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-cyan-200/60 dark:border-cyan-800 font-semibold text-cyan-700 dark:text-cyan-300">tailwind.config.js</code> file under <code className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-cyan-200/60 dark:border-cyan-800 font-semibold text-cyan-700 dark:text-cyan-300">theme.extend.colors</code>. You can now use classes like <code className="text-slate-800 dark:text-slate-200 font-semibold">bg-primary</code>, <code className="text-slate-800 dark:text-slate-200 font-semibold">bg-primary-600</code>, and <code className="text-slate-800 dark:text-slate-200 font-semibold">text-text</code>.
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Layers className="w-4 h-4 text-slate-400" />
            <span>Includes 5 core semantic roles + {custom.length} custom color slots</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {activeFilename}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
