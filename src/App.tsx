import { CheckCircle2, Layers, Palette, ShieldCheck, Sparkles, Terminal } from 'lucide-react';
import React from 'react';
import { AppShell } from './components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { ThemeProvider } from './context/ThemeContext';

export const AppContent: React.FC = () => {
  const exportTargets = ['Tailwind', 'React UI', 'Android (XML)', 'iOS (Swift)'];

  const modules = [
    {
      title: 'Infrastructure',
      id: 'TT-001',
      status: 'Production',
      statusColor: 'emerald',
      icon: Terminal,
      description: 'Vite 6, React 19, TypeScript strict mode, Tailwind CSS v4, and Vitest suite.',
    },
    {
      title: 'Pages Deployment',
      id: 'TT-002',
      status: 'Production',
      statusColor: 'emerald',
      icon: ShieldCheck,
      description: 'Automated GitHub Pages workflow building and publishing dist on pushes to main.',
    },
    {
      title: 'UI Shell & Theme',
      id: 'TT-024',
      status: 'Active',
      statusColor: 'indigo',
      icon: Layers,
      description: 'Application layout, responsive shell, and light/dark/system theme management.',
    },
    {
      title: 'Color Math & Shade Engine',
      id: 'TT-003',
      status: 'Up Next',
      statusColor: 'amber',
      icon: Palette,
      description: 'OKLCH/CIELAB conversions, perceptual 50–950 shade generation, and WCAG contrast.',
    },
  ];

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-transparent border border-indigo-200/50 dark:border-indigo-800/30 p-8 sm:p-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm">
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{target}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Foundation Modules Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                System Architecture
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Foundational building blocks of ThemeTool
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Card key={module.id} className="relative flex flex-col justify-between">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                          module.statusColor === 'emerald'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                            : module.statusColor === 'indigo'
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60'
                              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
                        }`}
                      >
                        {module.status}
                      </span>
                    </div>
                    <CardTitle className="text-sm flex items-center gap-1.5">
                      <span>{module.title}</span>
                    </CardTitle>
                    <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                      {module.id}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {module.description}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;

