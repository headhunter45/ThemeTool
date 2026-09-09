import {
    CheckCircle2,
    Info,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    Wand2,
} from 'lucide-react';
import React, { useMemo } from 'react';
import { usePalette } from '../../context/PaletteContext';
import {
    getContrastRatio,
    getWcagCompliance,
    suggestAaColor,
    WcagCompliance,
} from '../../core/color/contrast';
import { SemanticRole } from '../../core/palette/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

export interface PairingItem {
  id: string;
  name: string;
  description: string;
  fgColor: string;
  bgColor: string;
  fgRoleName: string;
  bgRoleName: string;
  roleToFix?: SemanticRole;
  customSlotIdToFix?: string;
  compliance: WcagCompliance;
  suggestedHex: string;
  projectedRatio: number;
}

export const ContrastMatrix: React.FC = () => {
  const { colors, custom, setColor, updateCustomSlot } = usePalette();

  const pairings: PairingItem[] = useMemo(() => {
    const items: PairingItem[] = [
      {
        id: 'text-on-bg',
        name: 'Text on Background',
        description: 'Body copy, headings, and core textual content against the canvas',
        fgColor: colors.text,
        bgColor: colors.background,
        fgRoleName: 'Text',
        bgRoleName: 'Background',
        roleToFix: 'text',
        compliance: getWcagCompliance(colors.text, colors.background),
        suggestedHex: suggestAaColor(colors.text, colors.background, 4.5),
        projectedRatio: getContrastRatio(
          suggestAaColor(colors.text, colors.background, 4.5),
          colors.background
        ),
      },
      {
        id: 'primary-on-bg',
        name: 'Primary on Background',
        description: 'Primary interactive buttons, key icons, and prominent cards on canvas',
        fgColor: colors.primary,
        bgColor: colors.background,
        fgRoleName: 'Primary',
        bgRoleName: 'Background',
        roleToFix: 'primary',
        compliance: getWcagCompliance(colors.primary, colors.background),
        suggestedHex: suggestAaColor(colors.primary, colors.background, 4.5),
        projectedRatio: getContrastRatio(
          suggestAaColor(colors.primary, colors.background, 4.5),
          colors.background
        ),
      },
      {
        id: 'text-on-primary',
        name: 'Text on Primary button',
        description: 'Action button labels, pill tags, and chips rendered on primary fill',
        fgColor: colors.text,
        bgColor: colors.primary,
        fgRoleName: 'Text',
        bgRoleName: 'Primary',
        roleToFix: 'primary',
        compliance: getWcagCompliance(colors.text, colors.primary),
        suggestedHex: suggestAaColor(colors.primary, colors.text, 4.5),
        projectedRatio: getContrastRatio(
          suggestAaColor(colors.primary, colors.text, 4.5),
          colors.text
        ),
      },
      {
        id: 'text-on-secondary',
        name: 'Text on Secondary',
        description: 'Secondary callouts, card surfaces, and subtle utility sections',
        fgColor: colors.text,
        bgColor: colors.secondary,
        fgRoleName: 'Text',
        bgRoleName: 'Secondary',
        roleToFix: 'secondary',
        compliance: getWcagCompliance(colors.text, colors.secondary),
        suggestedHex: suggestAaColor(colors.secondary, colors.text, 4.5),
        projectedRatio: getContrastRatio(
          suggestAaColor(colors.secondary, colors.text, 4.5),
          colors.text
        ),
      },
      {
        id: 'text-on-accent',
        name: 'Text on Accent',
        description: 'Notice banners, badges, highlights, and promotional accents',
        fgColor: colors.text,
        bgColor: colors.accent,
        fgRoleName: 'Text',
        bgRoleName: 'Accent',
        roleToFix: 'accent',
        compliance: getWcagCompliance(colors.text, colors.accent),
        suggestedHex: suggestAaColor(colors.accent, colors.text, 4.5),
        projectedRatio: getContrastRatio(
          suggestAaColor(colors.accent, colors.text, 4.5),
          colors.text
        ),
      },
    ];

    // Include custom slots if defined
    custom.forEach((slot) => {
      const comp = getWcagCompliance(slot.hex, colors.background);
      const suggested = suggestAaColor(slot.hex, colors.background, 4.5);
      items.push({
        id: `custom-${slot.id}-bg`,
        name: `${slot.name} on Background`,
        description: `Custom slot "${slot.name}" against background`,
        fgColor: slot.hex,
        bgColor: colors.background,
        fgRoleName: slot.name,
        bgRoleName: 'Background',
        customSlotIdToFix: slot.id,
        compliance: comp,
        suggestedHex: suggested,
        projectedRatio: getContrastRatio(suggested, colors.background),
      });
    });

    return items;
  }, [colors, custom]);

  const failingCount = useMemo(() => {
    return pairings.filter((p) => !p.compliance.aaNormal).length;
  }, [pairings]);

  const handleAutoFix = (item: PairingItem) => {
    if (item.roleToFix) {
      setColor(item.roleToFix, item.suggestedHex);
    } else if (item.customSlotIdToFix) {
      updateCustomSlot(item.customSlotIdToFix, { hex: item.suggestedHex });
    }
  };

  return (
    <Card
      aria-label="Accessibility & WCAG Contrast Matrix"
      className="overflow-hidden border-indigo-200/60 dark:border-indigo-900/40 shadow-md"
    >
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <CardTitle>Accessibility & WCAG Contrast Matrix</CardTitle>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              WCAG 2.1
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time contrast ratio verification and one-click OKLCH auto-fix suggestions across all key semantic pairings.
          </p>
        </div>

        {/* Global Compliance Status */}
        <div className="flex items-center gap-2">
          {failingCount === 0 ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>All {pairings.length} Pairings Meet AA</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 shadow-2xs">
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{failingCount} Needs AA Adjustment</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pairings.map((item) => {
            const { ratio, aaNormal, aaLarge, aaaNormal, aaaLarge } = item.compliance;

            // Ratio styling
            const ratioColorClass =
              ratio >= 7.0
                ? 'text-emerald-600 dark:text-emerald-400'
                : ratio >= 4.5
                ? 'text-indigo-600 dark:text-indigo-400'
                : ratio >= 3.0
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-rose-600 dark:text-rose-400';

            return (
              <div
                key={item.id}
                data-testid={`pairing-card-${item.id}`}
                className="flex flex-col justify-between p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-850/50 border border-slate-200/80 dark:border-slate-800/80 space-y-4 transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-xs"
              >
                {/* Pairing Title & Role Badges */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {item.name}
                    </h4>
                    <span className={`text-base font-extrabold font-mono ${ratioColorClass}`}>
                      {ratio.toFixed(2)}:1
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {item.fgRoleName}
                    </span>
                    <span className="text-slate-400">({item.fgColor})</span>
                    <span className="text-slate-400">on</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {item.bgRoleName}
                    </span>
                    <span className="text-slate-400">({item.bgColor})</span>
                  </div>
                </div>

                {/* Live Visual Sample Swatch */}
                <div
                  data-testid={`sample-swatch-${item.id}`}
                  style={{ backgroundColor: item.bgColor, color: item.fgColor }}
                  className="p-3.5 rounded-xl border border-slate-200/40 dark:border-slate-700/40 transition-colors shadow-2xs space-y-1 flex flex-col justify-center items-center text-center select-none"
                >
                  <span className="text-sm font-bold">Aa Normal Sample Text</span>
                  <span className="text-xs font-medium opacity-90">14pt / 18pt Large Component</span>
                </div>

                {/* Compliance Badges */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                  {/* Normal Text */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Normal Text (4.5:1)
                    </span>
                    <div className="flex items-center gap-1">
                      {aaaNormal ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                          AAA Pass
                        </span>
                      ) : aaNormal ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-800">
                          AA Pass
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800">
                          Fail
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Large Text */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Large / UI (3.0:1)
                    </span>
                    <div className="flex items-center gap-1">
                      {aaaLarge ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                          AAA Pass
                        </span>
                      ) : aaLarge ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-800">
                          AA Pass
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800">
                          Fail
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Auto-Fix Section (if failing AA Normal) */}
                {!aaNormal ? (
                  <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-300/40 dark:border-amber-800/40 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        <span>OKLCH Auto-Fix Suggestion</span>
                      </span>
                      <span className="font-mono text-slate-600 dark:text-slate-400">
                        {item.projectedRatio.toFixed(2)}:1
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-4 h-4 rounded-full border border-black/20 shadow-2xs shrink-0"
                          style={{ backgroundColor: item.suggestedHex }}
                        />
                        <code className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                          {item.suggestedHex}
                        </code>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAutoFix(item)}
                        aria-label={`Auto-fix ${item.name} to ${item.suggestedHex}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                      >
                        <Wand2 className="w-3 h-3" />
                        <span>Auto-Fix for AA</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium py-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Meets WCAG AA standard</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Informational Guidance Footer */}
        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs flex items-start gap-2.5">
          <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-slate-600 dark:text-slate-400 leading-relaxed">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              About WCAG 2.1 Contrast Standards
            </p>
            <p>
              <strong>Level AA</strong> requires a contrast ratio of at least <strong>4.5:1</strong> for normal body text and <strong>3.0:1</strong> for large text (18pt / 14pt bold) and essential graphical UI components. <strong>Level AAA</strong> requires <strong>7.0:1</strong> for normal text and <strong>4.5:1</strong> for large text. The Auto-Fix engine searches the perceptual OKLCH color space for the minimal lightness adjustment required to reach 4.5:1 while keeping original hue and maximizing chroma within the sRGB gamut.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
