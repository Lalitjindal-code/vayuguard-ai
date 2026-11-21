import React, { useState } from 'react';
import { X, Car, Info } from 'lucide-react';
import { compareCommuteModes } from '../utils/commuteCalculator';

interface CommuteCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommuteCompareModal: React.FC<CommuteCompareModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [distanceKm, setDistanceKm] = useState<number>(14);

  if (!isOpen) return null;

  const comparison = compareCommuteModes(distanceKm);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="commute-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
    >
      <div className="w-full max-w-3xl bg-surface border border-subtle rounded-2xl shadow-2xl p-6 relative my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-elevated transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400"
          aria-label="Close commute comparison"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Car className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 id="commute-modal-title" className="text-lg font-bold text-slate-100 font-sans">
              Head-to-Head Commute Exposure & Emission Evaluator
            </h2>
            <p className="text-xs text-slate-400">
              Personal respiratory risk vs vehicular carbon footprint across urban transit options
            </p>
          </div>
        </div>

        {/* Distance Slider */}
        <div className="p-4 rounded-xl bg-elevated/70 border border-subtle mb-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Daily Round-Trip Commute Distance:</span>
            <span className="font-mono text-cyan-400 text-sm">{distanceKm} km / day</span>
          </div>
          <input
            type="range"
            min={2}
            max={60}
            step={1}
            value={distanceKm}
            onChange={(e) => setDistanceKm(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>2 km (Short local run)</span>
            <span>30 km (City cross-transit)</span>
            <span>60 km (Long suburban)</span>
          </div>
        </div>

        {/* Comparison Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
          {comparison.map((item) => {
            const isHighRisk = item.pm25ExposureIndex > 70;
            const isClean = item.pm25ExposureIndex <= 20;

            return (
              <div
                key={item.mode}
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                  isClean
                    ? 'bg-emerald-950/20 border-emerald-500/40 ring-1 ring-emerald-500/20'
                    : isHighRisk
                    ? 'bg-red-950/20 border-red-500/40'
                    : 'bg-elevated/70 border-subtle'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-100">{item.label}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                        isClean
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : isHighRisk
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {item.pm25ExposureIndex}/100 Exposure
                    </span>
                  </div>

                  {/* Exposure Bar */}
                  <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        isClean ? 'bg-emerald-400' : isHighRisk ? 'bg-red-400' : 'bg-amber-400'
                      }`}
                      style={{ width: `${item.pm25ExposureIndex}%` }}
                    />
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-subtle/60 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Daily Carbon</span>
                      <span className="text-cyan-300 font-semibold">{item.dailyCo2Kg} kg CO₂</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Monthly Fuel/Fare</span>
                      <span className="text-amber-300 font-semibold">₹{item.monthlyCostInr}</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 leading-relaxed bg-black/30 p-2.5 rounded-lg border border-subtle/50">
                  <Info className="w-3 h-3 inline mr-1 text-slate-400" aria-hidden="true" />
                  {item.healthAdvice}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
