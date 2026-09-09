import { CheckCircle2 } from 'lucide-react';
import React from 'react';
import { ContrastMatrix } from './components/accessibility';
import { ExportSection } from './components/export';
import { AppShell } from './components/layout';
import { BasePaletteWorkflow, PaletteBar } from './components/palette';
import { PreviewSection } from './components/preview';
import { PaletteProvider } from './context/PaletteContext';
import { ThemeProvider } from './context/ThemeContext';

export const AppContent: React.FC = () => {
  const exportTargets = ['Android', 'iOS', 'Material', 'Tailwind'];

  return (
    <AppShell>
      <div className="space-y-8 animate-in fade-in duration-200">
        {/* Compact Hero Section (TT-030) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-transparent border border-indigo-200/50 dark:border-indigo-800/30 p-4 sm:p-5 text-center space-y-2">
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-normal">
            Generate perceptually balanced color palettes, compute WCAG contrast ratios, and export ready-to-use theme configurations for web and mobile frameworks.
          </p>

          {/* Export Targets Pills */}
          <div className="pt-1 flex flex-wrap items-center justify-center gap-2">
            {exportTargets.map((target) => (
              <div
                key={target}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{target}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Choose Base (TT-026 & TT-031) */}
        <BasePaletteWorkflow />

        {/* Step 2: Experiment (TT-004, TT-028, & TT-031) */}
        <PaletteBar />

        {/* Step 3: Preview (TT-009 & TT-031) */}
        <PreviewSection />

        {/* Step 4: Accessibility (TT-019 & TT-031) */}
        <ContrastMatrix />

        {/* Step 5: Export (TT-031) */}
        <ExportSection />
      </div>
    </AppShell>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <PaletteProvider>
        <AppContent />
      </PaletteProvider>
    </ThemeProvider>
  );
};

export default App;
