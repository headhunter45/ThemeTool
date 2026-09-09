import { CheckCircle2, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { SystemArchitectureView } from './components/architecture';
import { AppNavTab, AppShell } from './components/layout';
import { BasePaletteWorkflow, PaletteBar } from './components/palette';
import { PreviewSection } from './components/preview';
import { PaletteProvider } from './context/PaletteContext';
import { ThemeProvider } from './context/ThemeContext';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppNavTab>('studio');
  const exportTargets = ['Tailwind', 'React UI', 'Android (XML)', 'iOS (Swift)'];

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'studio' ? (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-transparent border border-indigo-200/50 dark:border-indigo-800/30 p-8 sm:p-10 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Modern Theme & Design System Studio</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              ThemeTool
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Generate perceptually balanced color palettes, compute WCAG contrast ratios, and export ready-to-use theme configurations for web and mobile frameworks.
            </p>

            {/* Export Targets Pills */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
              {exportTargets.map((target) => (
                <div
                  key={target}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{target}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Base Palette Setup Workflow (TT-026) */}
          <BasePaletteWorkflow />

          {/* Step 2: Active Semantic Palette Bar (TT-004 & TT-028) */}
          <PaletteBar />

          {/* Step 3: Component & Target Previews (TT-009) */}
          <PreviewSection />
        </div>
      ) : (
        <SystemArchitectureView />
      )}
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
