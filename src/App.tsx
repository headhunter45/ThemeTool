import { CheckCircle2, Palette, Sparkles } from 'lucide-react';
import React from 'react';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-2xl space-y-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 mb-2 border border-indigo-500/30">
          <Palette className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          ThemeTool
        </h1>
        <p className="text-slate-400 text-base leading-relaxed">
          Modern color palette generator, format converter, and multi-target theme exporter for web and mobile frameworks.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {['Tailwind', 'React UI', 'Android (XML)', 'iOS (Swift)'].map((target) => (
            <div
              key={target}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-700/50 border border-slate-600/50 text-xs font-medium text-slate-200"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{target}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-700/60 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Scaffolding initialized & ready for development</span>
        </div>
      </div>
    </div>
  );
};

export default App;
