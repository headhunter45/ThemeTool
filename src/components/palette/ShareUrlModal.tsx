import {
    Check,
    Copy,
    ExternalLink,
    Globe,
    Info,
    Link2,
    RotateCcw,
    Share2,
    X,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { usePalette } from '../../context/PaletteContext';
import {
    buildShareableUrl,
    DEFAULT_BASE_URL,
    getCurrentOriginBaseUrl,
    getStoredBaseUrl,
    LOCAL_DEV_BASE_URL,
    setStoredBaseUrl,
} from '../../core/exporters/shareUrl';

export interface ShareUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareUrlModal: React.FC<ShareUrlModalProps> = ({ isOpen, onClose }) => {
  const { colors, custom } = usePalette();
  const [baseUrl, setBaseUrl] = useState(DEFAULT_BASE_URL);
  const [copied, setCopied] = useState(false);

  // Initialize from localStorage or fallback on mount/open
  useEffect(() => {
    if (isOpen) {
      setBaseUrl(getStoredBaseUrl());
    }
  }, [isOpen]);

  const handleBaseUrlChange = (newUrl: string) => {
    setBaseUrl(newUrl);
    setStoredBaseUrl(newUrl);
  };

  const handleResetDefault = () => {
    handleBaseUrlChange(DEFAULT_BASE_URL);
  };

  const handleSelectPreset = (presetUrl: string) => {
    handleBaseUrlChange(presetUrl);
  };

  const generatedUrl = useMemo(() => {
    return buildShareableUrl(baseUrl, colors, custom);
  }, [baseUrl, colors, custom]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenNewTab = () => {
    if (typeof window !== 'undefined') {
      window.open(generatedUrl, '_blank');
    }
  };

  const currentOrigin = getCurrentOriginBaseUrl();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-url-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-850/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  id="share-url-modal-title"
                  className="text-base font-bold text-slate-900 dark:text-slate-100"
                >
                  Shareable Palette URL
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Live Synced
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Encode complete palette configuration and custom slots into a bookmarkable link
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

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5">
          {/* Base URL Presets */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Base URL Presets:
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleSelectPreset(DEFAULT_BASE_URL)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  baseUrl === DEFAULT_BASE_URL
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                }`}
              >
                GitHub Pages (Production)
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset(currentOrigin)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  baseUrl === currentOrigin
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                }`}
              >
                Current Domain
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset(LOCAL_DEV_BASE_URL)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  baseUrl === LOCAL_DEV_BASE_URL
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                }`}
              >
                Local Dev (localhost:5173)
              </button>
            </div>
          </div>

          {/* Base URL Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="share-base-url-input"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-500" />
                <span>Configurable Base URL</span>
              </label>
              <button
                type="button"
                onClick={handleResetDefault}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to default</span>
              </button>
            </div>
            <input
              id="share-base-url-input"
              type="text"
              value={baseUrl}
              onChange={(e) => handleBaseUrlChange(e.target.value)}
              placeholder="https://headhunter45.github.io/ThemeTool/"
              aria-label="Base URL"
              className="w-full px-3 py-2 rounded-xl text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Saved automatically in local storage for subsequent exports.
            </p>
          </div>

          {/* Generated Shareable Link Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>Generated Shareable Link</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {generatedUrl.length} characters • 5 core roles {custom.length > 0 && `+ ${custom.length} custom`}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs shadow-inner break-all select-all max-h-32 overflow-y-auto">
              <code data-testid="shareable-url-preview">{generatedUrl}</code>
            </div>
          </div>

          {/* Helpful context */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-bold">
              <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>Instant Restoration</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Anyone opening this URL will immediately load your exact palette colors, contrast scales, and custom slots. No server database required.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/50 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenNewTab}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in New Tab</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Copied Link!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Shareable Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
