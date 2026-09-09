import {
    Archive,
    Check,
    Copy,
    Download,
    FileCode2,
    FolderTree,
    Info,
    Layers,
    Smartphone,
    X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { usePalette } from '../../context/PaletteContext';
import {
    downloadAndroidZip,
    generateAndroidColorsXml,
    generateAndroidNightThemesXml,
    generateAndroidThemesXml,
    generateAndroidZip,
} from '../../core/exporters/android';

export interface ExportAndroidModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AndroidFileTab = 'colors' | 'themes' | 'nightThemes';

export const ExportAndroidModal: React.FC<ExportAndroidModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { colors, custom } = usePalette();
  const [activeTab, setActiveTab] = useState<AndroidFileTab>('colors');
  const [themeName, setThemeName] = useState('Theme.ThemeTool');
  const [includeShades, setIncludeShades] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const colorsXml = useMemo(() => {
    return generateAndroidColorsXml(colors, custom, { includeShades });
  }, [colors, custom, includeShades]);

  const themesXml = useMemo(() => {
    return generateAndroidThemesXml(themeName);
  }, [themeName]);

  const nightThemesXml = useMemo(() => {
    return generateAndroidNightThemesXml(themeName);
  }, [themeName]);

  const activeCode = useMemo(() => {
    switch (activeTab) {
      case 'colors':
        return colorsXml;
      case 'themes':
        return themesXml;
      case 'nightThemes':
        return nightThemesXml;
    }
  }, [activeTab, colorsXml, themesXml, nightThemesXml]);

  const activePath = useMemo(() => {
    switch (activeTab) {
      case 'colors':
        return 'res/values/colors.xml';
      case 'themes':
        return 'res/values/themes.xml';
      case 'nightThemes':
        return 'res/values-night/themes.xml';
    }
  }, [activeTab]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zipBlob = await generateAndroidZip(colors, custom, {
        themeName,
        includeShades,
      });
      downloadAndroidZip(zipBlob, 'android-theme-resources.zip');
    } catch (err) {
      console.error('Failed to generate Android ZIP:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-android-modal-title"
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
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  id="export-android-modal-title"
                  className="text-base font-bold text-slate-900 dark:text-slate-100"
                >
                  Export Android Material 3 Resources
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  DayNight Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Generate native Android XML resources & downloadable res/ ZIP archive
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
          {/* File Tabs */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('colors')}
              aria-pressed={activeTab === 'colors'}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'colors'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>colors.xml</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('themes')}
              aria-pressed={activeTab === 'themes'}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'themes'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>themes.xml (Light)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('nightThemes')}
              aria-pressed={activeTab === 'nightThemes'}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'nightThemes'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>themes.xml (Night)</span>
            </button>
          </div>

          {/* Options: Theme Name & Include Shades */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <label
                htmlFor="android-theme-name-input"
                className="text-xs font-medium text-slate-600 dark:text-slate-400"
              >
                Theme Name:
              </label>
              <input
                id="android-theme-name-input"
                type="text"
                value={themeName}
                onChange={(e) => setThemeName(e.target.value)}
                placeholder="Theme.MyApp"
                aria-label="Android theme name"
                className="w-36 px-2.5 py-1 rounded-xl text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeShades}
                onChange={(e) => setIncludeShades(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500/20"
              />
              <span>50–950 Scales</span>
            </label>
          </div>
        </div>

        {/* Code View Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden text-slate-200 font-mono text-xs shadow-inner">
            <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                <span className="font-semibold text-slate-300">{activePath}</span>
                <span>•</span>
                <span>{activeCode.split('\n').length} lines</span>
              </div>
              <span className="text-[10px] text-slate-500">Android XML Resource</span>
            </div>
            <pre className="p-4 overflow-x-auto max-h-72 leading-relaxed text-slate-200 select-all">
              <code data-testid="android-code-preview">{activeCode}</code>
            </pre>
          </div>

          {/* Quick Integration Instructions */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold">
              <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>How to use in your Android Studio project</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Extract <code className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-emerald-200/60 dark:border-emerald-800 font-semibold text-emerald-700 dark:text-emerald-300">android-theme-resources.zip</code> directly into your app's <code className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-emerald-200/60 dark:border-emerald-800 font-semibold text-emerald-700 dark:text-emerald-300">app/src/main/res/</code> directory. In <code className="text-slate-800 dark:text-slate-200 font-semibold">AndroidManifest.xml</code>, specify <code className="text-slate-800 dark:text-slate-200 font-semibold">android:theme="@style/{themeName || 'Theme.ThemeTool'}"</code> on your <code className="text-slate-800 dark:text-slate-200 font-semibold">&lt;application&gt;</code> or <code className="text-slate-800 dark:text-slate-200 font-semibold">&lt;activity&gt;</code>.
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Archive className="w-4 h-4 text-slate-400" />
            <span>Preserves exact res/values and res/values-night folder tree</span>
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
                  <span>Copy XML Snippet</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isZipping ? 'Generating ZIP...' : 'Download android-theme-resources.zip'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
