import { CheckCircle2, Cpu, Download, Layers, Link2, Palette, Sparkles, Terminal } from 'lucide-react';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

export const SystemArchitectureView: React.FC = () => {
  const modules = [
    {
      title: 'Infrastructure & Build Engine',
      id: 'TT-001',
      status: 'Production',
      statusColor: 'emerald',
      icon: Terminal,
      description: 'Vite 6, React 19, TypeScript strict mode, Tailwind CSS v4, and Vitest suite with full coverage.',
    },
    {
      title: 'UI Shell & Theme Foundation',
      id: 'TT-024',
      status: 'Production',
      statusColor: 'emerald',
      icon: Layers,
      description: 'Application layout, responsive shell primitives, and persistent light/dark/system theme management.',
    },
    {
      title: 'Color Math & Shade Engine',
      id: 'TT-003',
      status: 'Production',
      statusColor: 'emerald',
      icon: Palette,
      description: 'OKLCH/CIELAB conversions, perceptual 50–950 shade generation with gamut mapping, and WCAG contrast.',
    },
    {
      title: 'Palette State & URL Synchronization',
      id: 'TT-004',
      status: 'Production',
      statusColor: 'emerald',
      icon: Link2,
      description: '5 semantic roles with live bi-directional URL query & hash state synchronization for instant sharing.',
    },
    {
      title: 'Multi-Format Importer Pipeline',
      id: 'TT-005/006/007',
      status: 'Production',
      statusColor: 'emerald',
      icon: Download,
      description: 'Universal parser supporting Coolors, ColorKit, Realtime Colors, UIColors, Tailwind v3/v4, JSON, and Raw Hex.',
    },
    {
      title: 'Contextual Color Inspector',
      id: 'TT-028',
      status: 'Production',
      statusColor: 'emerald',
      icon: Cpu,
      description: 'On-demand modal shade studio with live conversions, anchor toggles, and expandable 11-step tonal scale.',
    },
  ];

  const pipelineSteps = [
    {
      step: '01',
      title: 'Input & Seed Ingestion',
      description: 'Accepts single seed colors, curated presets, external tool URLs, or copy-pasted Tailwind/JSON code snippets.',
    },
    {
      step: '02',
      title: 'Perceptual Math & Gamut Mapping',
      description: 'Calculates monotonic OKLCH lightness, chroma clamping in sRGB gamut, and WCAG AA/AAA contrast ratios.',
    },
    {
      step: '03',
      title: 'Semantic State Synchronization',
      description: 'Maps tokens to Primary, Secondary, Accent, Background, Text roles and serializes live to browser URL hash.',
    },
    {
      step: '04',
      title: 'Target Code Generation',
      description: 'Exports production-ready theme packages for Tailwind CSS, Android XML (ZIP), iOS Swift (xcassets), and JSON.',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-transparent border border-indigo-200/50 dark:border-indigo-800/30 p-8 sm:p-10 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>System Architecture & Engine Registry</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          ThemeTool Architecture
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          High-performance color science engine, bi-directional URL synchronization, and universal multi-platform theme translation pipeline.
        </p>
      </div>

      {/* Foundational Modules Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Core Engine Modules
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Modular components powering ThemeTool's palette generation and export capabilities
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Card key={module.id} className="relative flex flex-col justify-between border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60">
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

      {/* Processing Pipeline Card */}
      <Card className="border-indigo-200/60 dark:border-indigo-900/40 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-500" />
            <span>Theme Processing Pipeline</span>
          </CardTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            End-to-end dataflow from color entry to platform-native theme packaging
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pipelineSteps.map((step) => (
              <div
                key={step.step}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {step.step}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
