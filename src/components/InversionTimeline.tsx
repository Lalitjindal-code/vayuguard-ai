import React, { useState, useRef } from 'react';
import {
  Sun,
  Moon,
  AlertTriangle,
  ShieldCheck,
  Activity,
  Flame,
} from 'lucide-react';
import { HourlyForecastPoint } from '../types/airQuality';

interface InversionTimelineProps {
  hourlyForecast?: HourlyForecastPoint[];
}

export const InversionTimeline: React.FC<InversionTimelineProps> = ({
  hourlyForecast = [],
}) => {
  const [selectedHourIdx, setSelectedHourIdx] = useState<number>(13); // Default 1 PM safe window
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const graphRef = useRef<HTMLDivElement>(null);

  if (hourlyForecast.length === 0) return null;

  const activeIdx = hoveredIdx !== null ? hoveredIdx : selectedHourIdx;
  const currentPoint = hourlyForecast[activeIdx] || hourlyForecast[0];

  // Estimated atmospheric boundary mixing layer height (meters above ground level)
  // Reflects real winter meteorological diurnal patterns in northern/central India:
  // Night/early morning cooling squashes mixing height to 130-180m;
  // Strong afternoon solar insolation elevates thermal boundary layer up to 1,200m-1,250m.
  const boundaryHeights = [
    180, 160, 150, 140, 130, 140, 170, 240, 420, 680, 920, 1120, 1220, 1250, 1210, 1080,
    840, 560, 360, 260, 220, 200, 190, 180,
  ];

  const currentHeight = boundaryHeights[activeIdx] || 500;

  // SVG dimensions
  const svgWidth = 800;
  const svgHeight = 160;
  const paddingBottom = 25;
  const paddingTop = 20;
  const usableHeight = svgHeight - paddingTop - paddingBottom;

  // Map 100m to 1400m onto Y coordinates
  const minMeters = 100;
  const maxMeters = 1400;

  const getY = (meters: number) => {
    const fraction = (meters - minMeters) / (maxMeters - minMeters);
    return svgHeight - paddingBottom - fraction * usableHeight;
  };

  const svgPoints = boundaryHeights.map((h, i) => {
    const x = (i / 23) * svgWidth;
    const y = getY(h);
    return { x, y, h, hour: i };
  });

  // Generate silky-smooth cubic Bezier spline
  const getSmoothSpline = (pts: { x: number; y: number }[]): string => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 >= pts.length ? pts.length - 1 : i + 2];

      const cp1x = p1.x + (p2.x - p0.x) / 5.5;
      const cp1y = p1.y + (p2.y - p0.y) / 5.5;
      const cp2x = p2.x - (p3.x - p1.x) / 5.5;
      const cp2y = p2.y - (p3.y - p1.y) / 5.5;

      d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
    return d;
  };

  const curvePath = getSmoothSpline(svgPoints);
  const areaPath = `${curvePath} L ${svgWidth},${svgHeight - paddingBottom} L 0,${svgHeight - paddingBottom} Z`;

  const activePoint = svgPoints[activeIdx] || svgPoints[0];

  // Interactive scrubber pointer handler
  const handlePointer = (clientX: number) => {
    if (!graphRef.current) return;
    const rect = graphRef.current.getBoundingClientRect();
    const relativeX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const idx = Math.round((relativeX / rect.width) * 23);
    if (idx >= 0 && idx < 24) {
      setSelectedHourIdx(idx);
    }
  };

  return (
    <section
      aria-label="24-Hour Diurnal Smog & Inversion Timeline"
      className="bg-[#0A0F17] border-2 border-slate-700 rounded-xl p-5 brutal-shadow space-y-4 relative overflow-hidden"
    >
      {/* Background Decorative Matrix Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b-2 border-slate-800 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 brutal-shadow-sm font-mono font-bold">
            <Activity className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black uppercase tracking-wide text-white font-display">
                Diurnal Boundary Layer Inversion & Ventilation Cycle
              </h2>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/50">
                [LIVE SIMULATION]
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Hover or scrub graph to simulate atmospheric boundary layer height vs toxic surface trapping
            </p>
          </div>
        </div>

        {/* Selected Hour Telemetry Chip */}
        <div
          className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg border-2 text-xs font-bold font-mono transition-all brutal-shadow-sm ${
            currentPoint.isSafeWindow
              ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
              : currentPoint.inversionRisk === 'High'
              ? 'bg-red-950 border-red-500 text-red-300'
              : 'bg-amber-950 border-amber-500 text-amber-300'
          }`}
        >
          {currentPoint.isSafeWindow ? (
            <Sun className="w-4 h-4 text-emerald-400" />
          ) : (
            <Flame className="w-4 h-4 text-red-400" />
          )}
          <span>{currentPoint.time}</span>
          <span className="text-slate-500">|</span>
          <span className="font-black">AQI {currentPoint.aqi}</span>
          <span className="text-slate-500">|</span>
          <span className="text-cyan-300">{currentHeight}m BLH</span>
        </div>
      </div>

      {/* Visual Atmospheric Wave Graph Display */}
      <div className="relative z-10 p-3.5 rounded-xl bg-[#060A10] border-2 border-slate-800 brutal-shadow-sm space-y-2">
        {/* Top Celestial & Zone Markers Bar */}
        <div className="flex items-center justify-between text-[11px] font-mono px-2">
          <div className="flex items-center gap-1.5 text-rose-400 font-bold">
            <Moon className="w-3.5 h-3.5" />
            <span>00 - 06 AM (NIGHT SURFACE TRAP)</span>
          </div>
          <div className="flex items-center gap-1.5 text-red-400 font-bold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>06 - 09 AM (PEAK MORNING INVERSION)</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <Sun className="w-3.5 h-3.5" />
            <span>01 - 04 PM (SAFE SOLAR VENTILATION)</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Moon className="w-3.5 h-3.5" />
            <span>07 - 11 PM (EVENING COOLING)</span>
          </div>
        </div>

        {/* Interactive SVG Canvas with WCAG 2.1 AA Slider Semantics for Keyboard Accessibility */}
        <div
          ref={graphRef}
          role="slider"
          tabIndex={0}
          aria-label="24-Hour Diurnal Atmospheric Inversion Scrubber"
          aria-valuenow={currentPoint.hour}
          aria-valuemin={0}
          aria-valuemax={23}
          aria-valuetext={`${currentPoint.time}, AQI ${currentPoint.aqi}, Mixing Height ${currentHeight} meters, ${
            currentPoint.isSafeWindow
              ? 'Safe Solar Ventilation Window'
              : currentPoint.inversionRisk + ' Inversion Risk'
          }`}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
              e.preventDefault();
              setSelectedHourIdx((prev) => Math.min(23, prev + 1));
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
              e.preventDefault();
              setSelectedHourIdx((prev) => Math.max(0, prev - 1));
            } else if (e.key === 'Home') {
              e.preventDefault();
              setSelectedHourIdx(0);
            } else if (e.key === 'End') {
              e.preventDefault();
              setSelectedHourIdx(23);
            }
          }}
          onPointerDown={(e) => handlePointer(e.clientX)}
          onPointerMove={(e) => {
            if (e.buttons === 1) handlePointer(e.clientX);
          }}
          className="relative w-full h-44 bg-slate-950 rounded-lg overflow-hidden border border-slate-800/90 cursor-crosshair select-none touch-none focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <svg
            className="w-full h-full"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              {/* Spline Area Gradient */}
              <linearGradient id="splineAreaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.5" />
                <stop offset="28%" stopColor="#DC2626" stopOpacity="0.6" />
                <stop offset="48%" stopColor="#10B981" stopOpacity="0.75" />
                <stop offset="68%" stopColor="#10B981" stopOpacity="0.75" />
                <stop offset="85%" stopColor="#F59E0B" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0.5" />
              </linearGradient>

              {/* Vertical Atmospheric Gradient for Elevation */}
              <linearGradient id="verticalHeightGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0F172A" stopOpacity="0.1" />
              </linearGradient>

              {/* Glowing Line Filter */}
              <filter id="neonCurveGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#22D3EE" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* Altitude Zone Guidelines (Y-Axis) */}
            {/* 1,200m Convection Peak Line */}
            <line
              x1="0"
              y1={getY(1200)}
              x2={svgWidth}
              y2={getY(1200)}
              stroke="#10B981"
              strokeDasharray="4 4"
              strokeWidth="1"
              opacity="0.5"
            />
            <text x="10" y={getY(1200) - 4} fill="#10B981" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
              1,200m • SOLAR THERMAL MIXING PEAK (OPTIMAL CROSS-VENTILATION)
            </text>

            {/* 800m Safe Mixing Threshold Line */}
            <line
              x1="0"
              y1={getY(800)}
              x2={svgWidth}
              y2={getY(800)}
              stroke="#06B6D4"
              strokeDasharray="4 4"
              strokeWidth="0.9"
              opacity="0.4"
            />
            <text x="10" y={getY(800) - 4} fill="#06B6D4" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
              800m • SAFE DILUTION THRESHOLD (INDOOR AIR SAFE TO REFRESH)
            </text>

            {/* 200m Ground Trap Hazard Line */}
            <line
              x1="0"
              y1={getY(200)}
              x2={svgWidth}
              y2={getY(200)}
              stroke="#EF4444"
              strokeDasharray="4 4"
              strokeWidth="1"
              opacity="0.6"
            />
            <text x="10" y={getY(200) - 4} fill="#EF4444" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
              200m • NOCTURNAL GROUND COOLING INVERSION TRAP ZONE (DO NOT VENTILATE)
            </text>

            {/* Filled Smooth Area Curve */}
            <path d={areaPath} fill="url(#splineAreaGradient)" />

            {/* Glowing Neon Wave Line */}
            <path
              d={curvePath}
              fill="none"
              stroke="#22D3EE"
              strokeWidth="3"
              filter="url(#neonCurveGlow)"
            />

            {/* Vertical Scanner Laser Beam */}
            <line
              x1={activePoint.x}
              y1="0"
              x2={activePoint.x}
              y2={svgHeight - paddingBottom}
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeDasharray="3 3"
              className="transition-all duration-75"
            />

            {/* Active Radar Pulse Ring */}
            <circle
              cx={activePoint.x}
              cy={activePoint.y}
              r="10"
              fill={currentPoint.isSafeWindow ? '#10B981' : '#EF4444'}
              opacity="0.35"
              className="animate-ping"
            />

            {/* Active Solid Point Dot */}
            <circle
              cx={activePoint.x}
              cy={activePoint.y}
              r="6"
              fill={currentPoint.isSafeWindow ? '#10B981' : '#EF4444'}
              stroke="#FFFFFF"
              strokeWidth="2.5"
              className="transition-all duration-75"
            />

            {/* Hour Ticks on X-Axis Bottom */}
            {svgPoints
              .filter((_, idx) => idx % 2 === 0)
              .map((pt, i) => (
                <text
                  key={i}
                  x={pt.x}
                  y={svgHeight - 8}
                  fill="#94A3B8"
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {pt.hour.toString().padStart(2, '0')}:00
                </text>
              ))}
          </svg>
        </div>
      </div>

      {/* 24-Hour Diurnal Quick Selector Buttons */}
      <div className="space-y-1.5 relative z-10">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="font-bold text-slate-300">Quick 24-Hour Selector:</span>
          <span>Click any hour to lock simulation view</span>
        </div>

        <div className="grid grid-cols-12 sm:grid-cols-24 gap-1 pt-0.5" role="group" aria-label="Hourly diurnal timeline">
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
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`h-10 rounded flex flex-col items-center justify-end pb-1 text-[10px] font-mono font-bold transition-all ${barBg} ${
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

      {/* Dynamic Simulation Insight Banner */}
      <div className="p-4 rounded-lg bg-[#101724] border-2 border-slate-700 flex items-start gap-3 text-xs text-slate-200 relative z-10 brutal-shadow-sm">
        <ShieldCheck className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="leading-relaxed font-sans space-y-1">
          <div className="font-mono text-xs font-bold text-cyan-300 uppercase">
            Meteorological Advisory ({currentPoint.time} • {currentHeight}m Boundary Mixing Height):
          </div>
          <p>
            {currentPoint.isSafeWindow ? (
              <span>
                <strong className="text-emerald-300 font-bold">Safe Ventilation Window Active:</strong> Strong solar convection has elevated the atmospheric boundary layer to <strong className="text-white">{currentHeight}m</strong>, allowing heavy surface particulate toxins to disperse into the upper troposphere. This is your <strong className="text-emerald-300">optimal daily window</strong> to open windows, cross-ventilate your home, run errands, and perform school pickups.
              </span>
            ) : currentPoint.inversionRisk === 'High' ? (
              <span>
                <strong className="text-red-400 font-bold">Severe Atmospheric Inversion Active:</strong> Rapid nocturnal radiational ground cooling has compressed the thermal boundary layer down to a choking <strong className="text-white">{currentHeight}m</strong> ceiling. Diesel exhaust, vehicular soot, and PM2.5 are physically trapped at human breathing height. <strong className="text-red-300">Keep all windows sealed</strong> and avoid outdoor running, cycling, or physical play.
              </span>
            ) : (
              <span>
                <strong className="text-amber-300 font-bold">Transitional Trap Risk:</strong> Boundary mixing layer is at <strong className="text-white">{currentHeight}m</strong>. Outdoor activity is acceptable for healthy adults wearing N95 masks, but sensitive groups (infants, asthmatics, elderly) should remain indoors with purifiers running.
              </span>
            )}
          </p>
        </div>
      </div>
    </section>
  );
};
