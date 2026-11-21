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
      className="bg-[#0C121B] border-2 border-slate-700 rounded-xl p-5 brutal-shadow space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b-2 border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 brutal-shadow-sm font-mono font-bold">
            <Clock className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-wide text-white font-display">
              24-Hour Diurnal Inversion & Smog Trap Cycle
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Boundary layer trapping vs safe midday solar ventilation
            </p>
          </div>
        </div>

        {/* Selected Hour Pill */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border-2 text-xs font-bold font-mono ${
            currentPoint.isSafeWindow
              ? 'bg-emerald-950 border-emerald-500 text-emerald-300 brutal-shadow-emerald'
              : currentPoint.inversionRisk === 'High'
              ? 'bg-red-950 border-red-500 text-red-300 brutal-shadow-red'
              : 'bg-amber-950 border-amber-500 text-amber-300 brutal-shadow'
          }`}
        >
          {currentPoint.isSafeWindow ? (
            <Sun className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-400" />
          )}
          <span>{currentPoint.time}:</span>
          <span className="font-mono font-black">AQI {currentPoint.aqi}</span>
          <span>({currentPoint.inversionRisk} RISK)</span>
        </div>
      </div>

      {/* Visual Diurnal Bar Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>12 AM (NIGHT TRAP)</span>
          <span className="text-red-400 font-bold">06 - 09 AM (PEAK MORNING TRAP)</span>
          <span className="text-emerald-400 font-bold">01 - 04 PM (SAFE SOLAR WINDOW)</span>
          <span className="text-red-400 font-bold">07 - 11 PM (EVENING TRAP)</span>
        </div>

        {/* Interactive 24-Hour Pills */}
        <div className="grid grid-cols-12 sm:grid-cols-24 gap-1.5 pt-1" role="group" aria-label="Hourly diurnal timeline">
          {hourlyForecast.slice(0, 24).map((pt, idx) => {
            const isSelected = selectedHourIdx === idx;
            const barBg = pt.isSafeWindow
              ? 'bg-emerald-500 border-2 border-emerald-400 text-slate-950'
              : pt.inversionRisk === 'High'
              ? 'bg-red-600 border-2 border-red-500 text-white'
              : 'bg-amber-500 border-2 border-amber-400 text-slate-950';

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedHourIdx(idx)}
                className={`h-11 rounded-lg flex flex-col items-center justify-end pb-1 text-[10px] font-mono font-bold transition-all ${barBg} ${
                  isSelected
                    ? 'ring-2 ring-white scale-110 z-10 brutal-shadow'
                    : 'opacity-85 hover:opacity-100 hover:scale-105'
                }`}
                title={`${pt.time}: AQI ${pt.aqi} (Inversion: ${pt.inversionRisk})`}
                aria-pressed={isSelected}
              >
                <span>{pt.hour}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Simulation Insight */}
      <div className="p-3.5 rounded-lg bg-[#111824] border-2 border-slate-700 flex items-start gap-2.5 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="leading-relaxed font-sans">
          {currentPoint.isSafeWindow ? (
            <span>
              <strong className="text-emerald-300 font-bold">Safe Ventilation Active:</strong> Solar convection has elevated the thermal boundary layer past 1,000 meters. This is the optimal window to cross-ventilate your home, complete outdoor school pickups, and run errands.
            </span>
          ) : currentPoint.inversionRisk === 'High' ? (
            <span>
              <strong className="text-red-400 font-bold">Atmospheric Inversion Active ({currentPoint.time}):</strong> Ground cooling traps toxic diesel soot and PM2.5 below 200m. Keep all windows sealed and avoid outdoor aerobic exercise.
            </span>
          ) : (
            <span>
              <strong className="text-amber-300 font-bold">Moderate Trap Risk:</strong> Outdoor activity is acceptable for healthy adults, but sensitive groups (infants, asthmatics) should stay indoors.
            </span>
          )}
        </p>
      </div>
    </section>
  );
};
