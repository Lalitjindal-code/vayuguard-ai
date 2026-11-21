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
      <div className="w-full max-w-3xl bg-[#0C121B] border-2 border-slate-700 rounded-xl brutal-shadow p-6 relative my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400"
          aria-label="Close commute comparison"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 brutal-shadow-sm font-bold">
            <Car className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
          </div>
          <div>
            <h2 id="commute-modal-title" className="text-base font-extrabold uppercase tracking-wide text-white font-sans">
              Head-to-Head Commute Exposure & Emission Evaluator
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Personal respiratory risk vs vehicular carbon footprint across urban transit options
            </p>
          </div>
        </div>

        {/* Distance Slider */}
        <div className="p-4 rounded-xl bg-[#111824] border-2 border-slate-800 mb-5 space-y-2 brutal-shadow-sm font-mono">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300">
            <span>Daily Round-Trip Commute Distance:</span>
            <span className="text-cyan-400 text-sm font-black">{distanceKm} km / day</span>
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
          <div className="flex justify-between text-[10px] text-slate-500 font-bold">
            <span>2 KM (SHORT LOCAL)</span>
            <span>30 KM (TRANSIT CROSS)</span>
            <span>60 KM (SUBURBAN)</span>
          </div>
        </div>

        {/* Comparison Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5 font-mono">
          {comparison.map((item) => {
            const isHighRisk = item.pm25ExposureIndex > 70;
            const isClean = item.pm25ExposureIndex <= 20;

            return (
              <div
                key={item.mode}
                className={`p-4 rounded-xl border-2 flex flex-col justify-between space-y-3 ${
                  isClean
                    ? 'bg-[#101726] border-emerald-400 brutal-shadow-emerald'
                    : isHighRisk
                    ? 'bg-red-950/40 border-red-500 brutal-shadow-red'
                    : 'bg-[#111824] border-slate-700 brutal-shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-white">{item.label}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isClean
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : isHighRisk
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {item.pm25ExposureIndex}/100 RISK
                    </span>
                  </div>

                  {/* Exposure Bar */}
                  <div className="w-full bg-slate-900 rounded h-2 mt-2.5 overflow-hidden border border-slate-700">
                    <div
                      className={`h-2 ${
                        isClean ? 'bg-emerald-400' : isHighRisk ? 'bg-red-500' : 'bg-amber-400'
                      }`}
                      style={{ width: `${item.pm25ExposureIndex}%` }}
                    />
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t-2 border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Daily Carbon</span>
                      <span className="text-cyan-300 font-black">{item.dailyCo2Kg} kg CO₂</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Monthly Fuel/Fare</span>
                      <span className="text-amber-300 font-black">₹{item.monthlyCostInr}</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 leading-relaxed bg-black/40 p-2.5 rounded-lg border border-slate-700 font-sans">
                  <Info className="w-3.5 h-3.5 inline mr-1 text-slate-400" aria-hidden="true" />
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
