import {
  Apple,
  Check,
  Download,
  FileCode,
  FileJson,
  Info,
  PackageCheck,
  Share2,
  SlidersHorizontal,
  Smartphone,
} from 'lucide-react';
import React, { useState } from 'react';
import { usePalette } from '../../context/PaletteContext';
import {
  downloadAndroidZip,
  generateAndroidZip,
} from '../../core/exporters/android';
import {
  downloadIosZip,
  downloadSwiftFile,
  generateIosZip,
  generateSwiftTheme,
} from '../../core/exporters/ios';
import {
  buildShareableUrl,
  getCurrentOriginBaseUrl,
} from '../../core/exporters/shareUrl';
import { generateThemeJson } from '../../core/exporters/themeJson';
import { ExportAndroidModal } from '../palette/ExportAndroidModal';
import { ExportIosModal } from '../palette/ExportIosModal';
import { ExportTailwindModal } from '../palette/ExportTailwindModal';
import { ExportThemeJsonModal } from '../palette/ExportThemeJsonModal';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

export const ExportSection: React.FC = () => {
  const { colors, custom } = usePalette();

  const [isExportJsonOpen, setIsExportJsonOpen] = useState(false);
  const [isTailwindExportOpen, setIsTailwindExportOpen] = useState(false);
  const [isAndroidExportOpen, setIsAndroidExportOpen] = useState(false);
  const [isIosExportOpen, setIsIosExportOpen] = useState(false);

  const [isAndroidZipping, setIsAndroidZipping] = useState(false);
  const [isIosZipping, setIsIosZipping] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // 1. Direct Share URL Copy
  const handleCopyShareUrl = () => {
    const url = buildShareableUrl(getCurrentOriginBaseUrl(), colors, custom);
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // 2. Direct JSON Download
  const handleDownloadThemeJson = () => {
    const jsonExport = generateThemeJson(colors, custom);
    const jsonString = JSON.stringify(jsonExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    const url = typeof URL.createObjectURL === 'function'
      ? URL.createObjectURL(blob)
      : `data:application/json;charset=utf-8,${encodeURIComponent(jsonString)}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = 'theme.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (typeof URL.revokeObjectURL === 'function') {
      URL.revokeObjectURL(url);
    }
  };

  // 3. Direct Android ZIP Download
  const handleDownloadAndroidZip = async () => {
    try {
      setIsAndroidZipping(true);
      const zipBlob = await generateAndroidZip(colors, custom);
      downloadAndroidZip(zipBlob, 'android-theme-resources.zip');
    } catch (err) {
      console.error('Failed to generate Android ZIP:', err);
    } finally {
      setIsAndroidZipping(false);
    }
  };

  // 4. Direct iOS Swift Download
  const handleDownloadIosSwift = () => {
    const swiftCode = generateSwiftTheme(colors, custom);
    downloadSwiftFile(swiftCode, 'Theme.swift');
  };

  // 5. Direct iOS Asset Catalog ZIP Download
  const handleDownloadIosAssets = async () => {
    try {
      setIsIosZipping(true);
      const zipBlob = await generateIosZip(colors, custom);
      downloadIosZip(zipBlob, 'ios-theme-assets.zip');
    } catch (err) {
      console.error('Failed to generate iOS ZIP:', err);
    } finally {
      setIsIosZipping(false);
    }
  };

  return (
    <Card
      aria-label="Step 5: Export"
      className="overflow-hidden border-indigo-200/60 dark:border-indigo-900/40 shadow-md"
    >
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Step 5
            </span>
            <div className="p-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
              <Download className="w-4 h-4" />
            </div>
            <CardTitle>Export</CardTitle>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Save, export, and share your theme across web, mobile, and design tokens
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {/* 1. Web Card */}
          <div className="flex flex-col justify-between p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all shadow-2xs gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center shadow-2xs shrink-0">
                <FileCode className="w-4 h-4 text-cyan-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                Web
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsTailwindExportOpen(true)}
                aria-label="Export Web"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:border-indigo-700 text-slate-700 dark:text-slate-300 shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <PackageCheck className="w-3.5 h-3.5 text-cyan-500" />
                <span>Export Web</span>
              </button>
            </div>
          </div>

          {/* 2. Android Card */}
          <div className="flex flex-col justify-between p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all shadow-2xs gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center shadow-2xs shrink-0">
                <Smartphone className="w-4 h-4 text-emerald-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                Android
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={handleDownloadAndroidZip}
                disabled={isAndroidZipping}
                aria-label="Download Android ZIP"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:border-emerald-700 text-slate-700 dark:text-slate-300 shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-emerald-500" />
                <span>{isAndroidZipping ? 'Zipping...' : 'Download ZIP'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAndroidExportOpen(true)}
                aria-label="Export Android"
                className="inline-flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                title="Configure and preview Android XML options"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Options</span>
              </button>
            </div>
          </div>

          {/* 3. iOS Card */}
          <div className="flex flex-col justify-between p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all shadow-2xs gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center shadow-2xs shrink-0">
                <Apple className="w-4 h-4 text-blue-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                iOS
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={handleDownloadIosAssets}
                disabled={isIosZipping}
                aria-label="Download iOS Assets"
                className="inline-flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:border-blue-700 text-slate-700 dark:text-slate-300 shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-blue-500" />
                <span>{isIosZipping ? 'Zipping...' : 'Assets'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadIosSwift}
                aria-label="Download Swift"
                className="inline-flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:border-blue-700 text-slate-700 dark:text-slate-300 shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-500" />
                <span>Swift</span>
              </button>
              <button
                type="button"
                onClick={() => setIsIosExportOpen(true)}
                aria-label="Export iOS"
                className="inline-flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                title="Configure and preview iOS Swift and Asset Catalog options"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Options</span>
              </button>
            </div>
          </div>

          {/* 4. Theme JSON Card */}
          <div className="flex flex-col justify-between p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all shadow-2xs gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center shadow-2xs shrink-0">
                <FileJson className="w-4 h-4 text-purple-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                Theme JSON
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={handleDownloadThemeJson}
                aria-label="Download JSON"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-purple-600 dark:hover:text-purple-400 border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:border-purple-700 text-slate-700 dark:text-slate-300 shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-purple-500" />
                <span>Download JSON</span>
              </button>
              <button
                type="button"
                onClick={() => setIsExportJsonOpen(true)}
                aria-label="Schema & Docs"
                className="inline-flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                title="View JSON Schema specification and integration docs"
              >
                <Info className="w-3.5 h-3.5 text-purple-500" />
                <span>Schema & Docs</span>
              </button>
            </div>
          </div>

          {/* 5. Shareable URL Card */}
          <div className="flex flex-col justify-between p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all shadow-2xs gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center shadow-2xs shrink-0">
                <Share2 className="w-4 h-4 text-amber-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                Shareable URL
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyShareUrl}
                aria-label="Copy Share URL"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                  copiedUrl
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                    : 'bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/50 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:border-amber-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {copiedUrl ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-amber-500" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Export Modals */}
      <ExportThemeJsonModal
        isOpen={isExportJsonOpen}
        onClose={() => setIsExportJsonOpen(false)}
      />

      <ExportTailwindModal
        isOpen={isTailwindExportOpen}
        onClose={() => setIsTailwindExportOpen(false)}
      />

      <ExportAndroidModal
        isOpen={isAndroidExportOpen}
        onClose={() => setIsAndroidExportOpen(false)}
      />

      <ExportIosModal
        isOpen={isIosExportOpen}
        onClose={() => setIsIosExportOpen(false)}
      />
    </Card>
  );
};
