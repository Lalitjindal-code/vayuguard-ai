import React, { useState } from 'react';
import { Clock, Sun, AlertTriangle, ShieldCheck } from 'lucide-react';
import { HourlyForecastPoint } from '../types/airQuality';

interface InversionTimelineProps {
  hourlyForecast?: HourlyForecastPoint[];
}

export const InversionTimeline: React.FC<InversionTimelineProps> = ({
  hourlyForecast = [],
}) => {
  const [selectedHourIdx, setSelectedHourIdx] = useState<number>(13); // Default 1 PM safe window

  if (hourlyForecast.length === 0) return null;

  const currentPoint = hourlyForecast[selectedHourIdx] || hourlyForecast[0];

  return (
    <section
      aria-label="24-Hour Diurnal Smog & Inversion Timeline"
      className="bg-surface border border-subtle rounded-2xl p-5 shadow-lg space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-subtle">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Clock className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 font-sans">
              24-Hour Diurnal Inversion & Smog Trap Cycle
            </h2>
            <p className="text-xs text-slate-400">
              Atmospheric boundary layer trapping vs safe midday ventilation window
            </p>
          </div>
        </div>

        {/* Selected Hour Pill */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${
            currentPoint.isSafeWindow
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
              : currentPoint.inversionRisk === 'High'
              ? 'bg-red-950/40 border-red-500/50 text-red-300'
              : 'bg-amber-950/40 border-amber-500/50 text-amber-300'
          }`}
        >
          {currentPoint.isSafeWindow ? (
            <Sun className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          )}
          <span>{currentPoint.time}:</span>
          <span className="font-mono">AQI {currentPoint.aqi}</span>
          <span>({currentPoint.inversionRisk} Trap Risk)</span>
        </div>
      </div>

      {/* Visual Diurnal Bar Grid */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>12 AM (Night Trap)</span>
          <span className="text-red-400 font-semibold">06 - 09 AM (Peak Morning Trap)</span>
          <span className="text-emerald-400 font-semibold">01 - 04 PM (Safe Solar Window)</span>
          <span className="text-red-400 font-semibold">07 - 11 PM (Evening Trap)</span>
        </div>

        {/* Interactive 24-Hour Pills */}
        <div className="grid grid-cols-12 sm:grid-cols-24 gap-1 pt-1" role="group" aria-label="Hourly diurnal timeline">
          {hourlyForecast.slice(0, 24).map((pt, idx) => {
            const isSelected = selectedHourIdx === idx;
            const barBg = pt.isSafeWindow
              ? 'bg-emerald-500 hover:bg-emerald-400'
              : pt.inversionRisk === 'High'
              ? 'bg-red-500/80 hover:bg-red-400'
              : 'bg-amber-500/80 hover:bg-amber-400';

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedHourIdx(idx)}
                className={`h-10 rounded flex flex-col items-center justify-end pb-1 text-[9px] font-mono transition-all focus-visible:ring-2 focus-visible:ring-emerald-400 ${barBg} ${
                  isSelected ? 'ring-2 ring-white scale-105 z-10' : 'opacity-80 hover:opacity-100'
                }`}
                title={`${pt.time}: AQI ${pt.aqi} (Inversion: ${pt.inversionRisk})`}
                aria-pressed={isSelected}
              >
                <span className="text-white font-bold">{pt.hour}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Simulation Insight */}
      <div className="p-3.5 rounded-xl bg-elevated/70 border border-subtle flex items-start gap-2.5 text-xs text-slate-300">
        <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="leading-relaxed">
          {currentPoint.isSafeWindow ? (
            <span>
              <strong className="text-emerald-300">Safe Ventilation Active:</strong> Solar heating has broken the thermal boundary layer. This is the optimal window to cross-ventilate your home, complete outdoor school pickups, and run errands.
            </span>
          ) : currentPoint.inversionRisk === 'High' ? (
            <span>
              <strong className="text-red-400">Atmospheric Inversion Active ({currentPoint.time}):</strong> Cold ground air traps toxic diesel soot and PM2.5 below 200m. Keep all windows sealed and avoid outdoor aerobic exercise.
            </span>
          ) : (
            <span>
              <strong className="text-amber-300">Moderate Trap Risk:</strong> Outdoor activity is acceptable for healthy adults, but sensitive groups (infants, asthmatics) should stay indoors.
            </span>
          )}
        </p>
      </div>
    </section>
  );
};
