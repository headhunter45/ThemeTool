import {
    Apple,
    Archive,
    Check,
    Code2,
    Copy,
    Download,
    FileCode,
    FolderTree,
    Info,
    X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { usePalette } from '../../context/PaletteContext';
import {
    downloadIosZip,
    downloadSwiftFile,
    generateColorsetJson,
    generateIosZip,
    generateSwiftTheme,
    generateXcassetsRootJson,
} from '../../core/exporters/ios';

export interface ExportIosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type IosFileTab = 'swift' | 'xcassets';

export const ExportIosModal: React.FC<ExportIosModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { colors, custom } = usePalette();
  const [activeTab, setActiveTab] = useState<IosFileTab>('swift');
  const [prefix, setPrefix] = useState('theme');
  const [includeShades, setIncludeShades] = useState(true);
  const [includeUiKit, setIncludeUiKit] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const swiftCode = useMemo(() => {
    return generateSwiftTheme(colors, custom, {
      prefix,
      includeShades,
      includeUiKit,
    });
  }, [colors, custom, prefix, includeShades, includeUiKit]);

  const xcassetsPreview = useMemo(() => {
    // Show sample .colorset Contents.json
    const sampleColorset = generateColorsetJson('0.145', '0.388', '0.922');
    const rootJson = generateXcassetsRootJson();

    return `// Colors.xcassets Directory Structure:
// ├── Contents.json
// ├── ThemePrimary.colorset/Contents.json
// ├── ThemeSecondary.colorset/Contents.json
// ├── ThemeAccent.colorset/Contents.json
// ├── ThemeBackground.colorset/Contents.json
// └── ThemeText.colorset/Contents.json

// --- Colors.xcassets/Contents.json ---
${rootJson}

// --- Colors.xcassets/ThemePrimary.colorset/Contents.json ---
${sampleColorset}`;
  }, []);

  const activeCode = activeTab === 'swift' ? swiftCode : xcassetsPreview;
  const activePath = activeTab === 'swift' ? 'Theme.swift' : 'Colors.xcassets';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSwift = () => {
    downloadSwiftFile(swiftCode, 'Theme.swift');
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zipBlob = await generateIosZip(colors, custom, {
        prefix,
        includeShades,
        includeUiKit,
      });
      downloadIosZip(zipBlob, 'ios-theme-assets.zip');
    } catch (err) {
      console.error('Failed to generate iOS ZIP:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-ios-modal-title"
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
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
              <Apple className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  id="export-ios-modal-title"
                  className="text-base font-bold text-slate-900 dark:text-slate-100"
                >
                  Export iOS Theme Assets
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  SwiftUI & xcassets
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Generate native Swift source code and Xcode Asset Catalog (.xcassets) bundle
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
              onClick={() => setActiveTab('swift')}
              aria-pressed={activeTab === 'swift'}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'swift'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Theme.swift</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('xcassets')}
              aria-pressed={activeTab === 'xcassets'}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'xcassets'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>Colors.xcassets</span>
            </button>
          </div>

          {/* Options: Prefix, Shades, UIKit */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <label
                htmlFor="ios-prefix-input"
                className="text-xs font-medium text-slate-600 dark:text-slate-400"
              >
                Prefix:
              </label>
              <input
                id="ios-prefix-input"
                type="text"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="theme"
                aria-label="Swift identifier prefix"
                className="w-20 px-2.5 py-1 rounded-xl text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeShades}
                onChange={(e) => setIncludeShades(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500/20"
              />
              <span>50–950 Scales</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeUiKit}
                onChange={(e) => setIncludeUiKit(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500/20"
              />
              <span>UIKit Extensions</span>
            </label>
          </div>
        </div>

        {/* Code View Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden text-slate-200 font-mono text-xs shadow-inner">
            <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500/80 inline-block" />
                <span className="font-semibold text-slate-300">{activePath}</span>
                <span>•</span>
                <span>{activeCode.split('\n').length} lines</span>
              </div>
              <span className="text-[10px] text-slate-500">
                {activeTab === 'swift' ? 'Swift Source File' : 'Xcode Asset Catalog'}
              </span>
            </div>
            <pre className="p-4 overflow-x-auto max-h-72 leading-relaxed text-slate-200 select-all">
              <code data-testid="ios-code-preview">{activeCode}</code>
            </pre>
          </div>

          {/* Quick Integration Instructions */}
          <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs space-y-2">
            <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-bold">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>
                {activeTab === 'swift'
                  ? 'How to use in SwiftUI & UIKit'
                  : 'How to use in Xcode Asset Catalogs'}
              </span>
            </div>
            {activeTab === 'swift' ? (
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Add <code className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-blue-200/60 dark:border-blue-800 font-semibold text-blue-700 dark:text-blue-300">Theme.swift</code> to your Xcode target. In SwiftUI, access colors via <code className="text-slate-800 dark:text-slate-200 font-semibold">Color.{prefix || 'theme'}Primary</code> or <code className="text-slate-800 dark:text-slate-200 font-semibold">.background(Color.{prefix || 'theme'}Background)</code>. In UIKit, use <code className="text-slate-800 dark:text-slate-200 font-semibold">UIColor.{prefix || 'theme'}Primary</code>.
              </p>
            ) : (
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Extract <code className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-blue-200/60 dark:border-blue-800 font-semibold text-blue-700 dark:text-blue-300">Colors.xcassets</code> directly into your Xcode project navigator. You can then reference colors in Interface Builder / Storyboards, or programmatically via <code className="text-slate-800 dark:text-slate-200 font-semibold">Color("ThemePrimary")</code> and <code className="text-slate-800 dark:text-slate-200 font-semibold">UIColor(named: "ThemePrimary")</code>.
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Archive className="w-4 h-4 text-slate-400" />
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

            {activeTab === 'swift' && (
              <button
                type="button"
                onClick={handleDownloadSwift}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <FileCode className="w-3.5 h-3.5 text-blue-500" />
                <span>Download Theme.swift</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isZipping ? 'Generating ZIP...' : 'Download Assets ZIP'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
