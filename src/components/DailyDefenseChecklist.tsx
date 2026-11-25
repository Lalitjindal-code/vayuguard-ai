import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Circle,
  Clock,
  Info,
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  timeframe: string;
  title: string;
  impact: string;
  defaultChecked?: boolean;
}

const DEFAULT_PROTOCOLS: ChecklistItem[] = [
  {
    id: 'seal_windows',
    timeframe: '06:00 - 09:30 AM',
    title: 'Seal Windows During Morning Inversion',
    impact: 'Halts cold-air ground smog penetration',
    defaultChecked: true,
  },
  {
    id: 'hepa_purge',
    timeframe: '09:00 - 10:30 PM',
    title: 'Run Bedroom Purifier / Box Fan Purge',
    impact: 'Lowers PM2.5 to <25 µg/m³ for restorative sleep',
    defaultChecked: true,
  },
  {
    id: 'n95_commute',
    timeframe: 'During Transit',
    title: 'N95 Respirator for Roadside / Metro Commute',
    impact: 'Filters 95% of toxic ultra-fine diesel soot',
    defaultChecked: false,
  },
  {
    id: 'damp_mopping',
    timeframe: 'Daily Housework',
    title: 'Damp Mopping Only (Strictly No Dry Sweeping)',
    impact: 'Prevents aerosolizing toxic lead & heavy road dust',
    defaultChecked: true,
  },
  {
    id: 'kitchen_vent',
    timeframe: 'Cooking Hours',
    title: 'Active Chimney / Cross Vent During Cooking',
    impact: 'Flushes out NO2 and carcinogenic combustion fumes',
    defaultChecked: false,
  },
];

export const DailyDefenseChecklist: React.FC = () => {
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    new Set(DEFAULT_PROTOCOLS.filter((p) => p.defaultChecked).map((p) => p.id))
  );

  const toggleItem = (id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const progressPercent = Math.round((completedIds.size / DEFAULT_PROTOCOLS.length) * 100);

  return (
    <div className="bg-[#0C121B] border-2 border-slate-700 rounded-xl p-5 brutal-shadow space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 brutal-shadow-sm font-mono font-bold">
            <ShieldCheck className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wide text-white font-display flex items-center gap-2">
              Daily Smog Defense Tracker
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              5 Essential Household Habits for Severe NAQI
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-black text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40">
            {completedIds.size}/{DEFAULT_PROTOCOLS.length} ACTIVE
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Household Shield Level</span>
          <span className="font-bold text-white">{progressPercent}% Protected</span>
        </div>
        <div className="w-full h-2.5 bg-slate-900 border border-slate-700 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist Items */}
      <ul className="space-y-2 pt-1" aria-label="Winter Smog Defense Protocols">
        {DEFAULT_PROTOCOLS.map((protocol) => {
          const isDone = completedIds.has(protocol.id);
          return (
            <li key={protocol.id}>
              <button
                type="button"
                aria-pressed={isDone}
                onClick={() => toggleItem(protocol.id)}
                className={`w-full p-2.5 rounded-lg border-2 text-left transition-all brutal-btn flex items-start gap-2.5 ${
                  isDone
                    ? 'bg-emerald-950/20 border-emerald-500/50 text-slate-100 brutal-shadow-emerald'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-600 brutal-shadow-sm'
                }`}
              >
                <div className="pt-0.5 flex-shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[2.5]" aria-hidden="true" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-600 stroke-[2]" aria-hidden="true" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span
                      className={`text-xs font-mono font-bold leading-tight ${
                        isDone ? 'text-white' : 'text-slate-300'
                      }`}
                    >
                      {protocol.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="text-cyan-400 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" aria-hidden="true" />
                      {protocol.timeframe}
                    </span>
                    <span className="text-slate-500" aria-hidden="true">•</span>
                    <span className="text-slate-400 truncate">{protocol.impact}</span>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Footnote */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-500 font-mono">
        <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
        <span>Grounded in AIIMS & CPCB Winter Indoor Guidelines</span>
      </div>
    </div>
  );
};
