import React, { useState } from 'react';
import { Clock, Sun, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
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

  // Estimated atmospheric boundary mixing layer height (meters above ground)
  // Solar convection pushes mixing height >1000m at midday; nocturnal ground cooling compresses to <200m
  const boundaryHeights = [
    180, 160, 150, 140, 130, 140, 160, 220, 380, 580, 820, 1050, 1200, 1250, 1200, 1050,
    800, 550, 350, 260, 220, 200, 190, 180,
  ];

  const currentHeight = boundaryHeights[selectedHourIdx] || 500;

  // Generate SVG path points for the boundary curve (viewBox 0 0 720 90)
  // Height ranges from 120m (y=75) to 1300m (y=10)
  const svgPoints = boundaryHeights.map((h, i) => {
    const x = (i / 23) * 720;
    // Map 120m-1300m to y=75-10
    const y = 80 - ((h - 120) / (1300 - 120)) * 65;
    return { x, y, h };
  });

  const pathD = `M 0,85 L 0,${svgPoints[0].y} ` +
    svgPoints.map((p) => `L ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') +
    ` L 720,85 Z`;

  const selectedPoint = svgPoints[selectedHourIdx] || svgPoints[0];

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
          <span>({currentPoint.inversionRisk} RISK • {currentHeight}m BLH)</span>
        </div>
      </div>

      {/* Visual Atmospheric Boundary Layer Altitude Wave */}
      <div className="p-3 rounded-lg bg-[#070D14] border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <Activity className="w-3.5 h-3.5" />
            Atmospheric Boundary Mixing Layer Height (m)
          </span>
          <span className="text-slate-500">
            Selected: <strong className="text-white">{currentHeight} meters</strong> above ground
          </span>
        </div>

        {/* SVG Wave Visualization */}
        <div className="relative w-full h-20 bg-slate-950/60 rounded overflow-hidden border border-slate-800">
          <svg
            className="w-full h-full"
            viewBox="0 0 720 90"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="boundaryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.4" />
                <stop offset="25%" stopColor="#DC2626" stopOpacity="0.5" />
                <stop offset="45%" stopColor="#10B981" stopOpacity="0.6" />
                <stop offset="65%" stopColor="#10B981" stopOpacity="0.6" />
                <stop offset="85%" stopColor="#F59E0B" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Inversion Safety Threshold Reference Line at 800m (y=35) */}
            <line x1="0" y1="35" x2="720" y2="35" stroke="#334155" strokeDasharray="3 3" strokeWidth="1" />
            <text x="8" y="32" fill="#64748B" fontSize="9" fontFamily="JetBrains Mono">Safe Convection Threshold (800m+)</text>

            {/* Filled Boundary Curve */}
            <path d={pathD} fill="url(#boundaryGradient)" />
            {/* Outline Curve */}
            <path
              d={svgPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
              fill="none"
              stroke="#22D3EE"
              strokeWidth="2"
            />

            {/* Selected Hour Vertical Line & Scrubber Dot */}
            <line
              x1={selectedPoint.x}
              y1="0"
              x2={selectedPoint.x}
              y2="90"
              stroke="#F8FAFC"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
            <circle
              cx={selectedPoint.x}
              cy={selectedPoint.y}
              r="4.5"
              fill={currentPoint.isSafeWindow ? '#10B981' : '#EF4444'}
              stroke="#FFFFFF"
              strokeWidth="2"
            />
          </svg>
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
                title={`${pt.time}: AQI ${pt.aqi} (Inversion: ${pt.inversionRisk}, Mixing Height: ${boundaryHeights[idx]}m)`}
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
              <strong className="text-emerald-300 font-bold">Safe Ventilation Active:</strong> Solar convection has elevated the thermal boundary layer to {currentHeight} meters. This is the optimal window to cross-ventilate your home, complete outdoor school pickups, and run errands.
            </span>
          ) : currentPoint.inversionRisk === 'High' ? (
            <span>
              <strong className="text-red-400 font-bold">Atmospheric Inversion Active ({currentPoint.time}):</strong> Ground cooling traps toxic diesel soot and PM2.5 below {currentHeight}m. Keep all windows sealed and avoid outdoor aerobic exercise.
            </span>
          ) : (
            <span>
              <strong className="text-amber-300 font-bold">Moderate Trap Risk ({currentPoint.time}):</strong> Boundary mixing layer is at {currentHeight}m. Outdoor activity is acceptable for healthy adults, but sensitive groups (infants, asthmatics) should stay indoors.
            </span>
          )}
        </p>
      </div>
    </section>
  );
};
