import React, { useState } from 'react';
import { X, Wrench, Sparkles, Check, ArrowRight } from 'lucide-react';
import { calculatePurifierForRoom } from '../utils/purifierCalculator';

interface PurifierCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PurifierCalculatorModal: React.FC<PurifierCalculatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [length, setLength] = useState<number>(12);
  const [width, setWidth] = useState<number>(14);
  const [height, setHeight] = useState<number>(10);
  const [copiedSteps, setCopiedSteps] = useState<boolean>(false);

  if (!isOpen) return null;

  const result = calculatePurifierForRoom(length, width, height);

  const assemblySteps = `DIY Corsi-Rosenthal Box Air Purifier Build:
1. Materials: 1x 20" Box Fan (₹1,200), ${result.recommendedFilters}x 20x20" MERV-13 Filter (₹${result.recommendedFilters * 750}), 1x Duct Tape roll.
2. Placement: Tape the MERV-13 filter firmly to the back intake of the fan (arrow pointing into fan).
3. Sealing: Seal all four perimeter edges with duct tape to prevent dirty air bypass.
4. Shroud: Cut a circular 14" hole from the fan box cardboard and tape it to the front face to boost air velocity.
5. Operation: Run in a ${result.roomAreaSqFt} sq.ft room for 45 minutes to achieve ${result.achRating} air changes/hr.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(assemblySteps);
    setCopiedSteps(true);
    setTimeout(() => setCopiedSteps(false), 1500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="purifier-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
    >
      <div className="w-full max-w-2xl bg-surface border border-subtle rounded-2xl shadow-2xl p-6 relative my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-elevated transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400"
          aria-label="Close purifier calculator"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Wrench className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 id="purifier-modal-title" className="text-lg font-bold text-slate-100 font-sans">
              DIY Box-Fan & HEPA Purifier CADR Calculator
            </h2>
            <p className="text-xs text-slate-400">
              Corsi-Rosenthal clean air calculations tailored to your room volume
            </p>
          </div>
        </div>

        {/* Room Dimension Inputs */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-elevated/70 border border-subtle mb-5">
          <div>
            <label htmlFor="room-length" className="block text-xs font-semibold text-slate-300 mb-1">
              Length (feet)
            </label>
            <input
              id="room-length"
              type="number"
              min={6}
              max={35}
              value={length}
              onChange={(e) => setLength(Number(e.target.value) || 6)}
              className="w-full px-3 py-1.5 text-xs bg-black/40 border border-subtle rounded-lg text-slate-100 font-mono focus:border-cyan-400 focus-visible:ring-2 focus-visible:ring-cyan-400"
            />
          </div>
          <div>
            <label htmlFor="room-width" className="block text-xs font-semibold text-slate-300 mb-1">
              Width (feet)
            </label>
            <input
              id="room-width"
              type="number"
              min={6}
              max={35}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value) || 6)}
              className="w-full px-3 py-1.5 text-xs bg-black/40 border border-subtle rounded-lg text-slate-100 font-mono focus:border-cyan-400 focus-visible:ring-2 focus-visible:ring-cyan-400"
            />
          </div>
          <div>
            <label htmlFor="room-height" className="block text-xs font-semibold text-slate-300 mb-1">
              Ceiling Height (ft)
            </label>
            <input
              id="room-height"
              type="number"
              min={7}
              max={15}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value) || 8)}
              className="w-full px-3 py-1.5 text-xs bg-black/40 border border-subtle rounded-lg text-slate-100 font-mono focus:border-cyan-400 focus-visible:ring-2 focus-visible:ring-cyan-400"
            />
          </div>
        </div>

        {/* Calculated Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="p-3 rounded-xl bg-elevated border border-subtle text-center">
            <span className="block text-[11px] text-slate-400">Room Volume</span>
            <span className="text-base font-bold font-mono text-slate-100">
              {result.roomVolumeCuFt} <span className="text-xs font-normal">cu.ft</span>
            </span>
          </div>
          <div className="p-3 rounded-xl bg-elevated border border-subtle text-center">
            <span className="block text-[11px] text-slate-400">Required CADR</span>
            <span className="text-base font-bold font-mono text-cyan-400">
              {result.requiredCadrCfm} <span className="text-xs font-normal">CFM</span>
            </span>
          </div>
          <div className="p-3 rounded-xl bg-elevated border border-subtle text-center">
            <span className="block text-[11px] text-slate-400">Target ACH</span>
            <span className="text-base font-bold font-mono text-emerald-400">
              {result.achRating}x / hr
            </span>
          </div>
          <div className="p-3 rounded-xl bg-elevated border border-subtle text-center">
            <span className="block text-[11px] text-slate-400">Filters Needed</span>
            <span className="text-base font-bold font-mono text-amber-400">
              {result.recommendedFilters}x MERV-13
            </span>
          </div>
        </div>

        {/* Cost Comparison: Commercial vs DIY */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 via-elevated to-cyan-950/20 border border-emerald-500/30 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-slate-300 block">
                Cost Comparison for {result.roomAreaSqFt} sq.ft room
              </span>
              <div className="flex items-center gap-4 mt-1 font-mono">
                <span className="text-xs text-red-400 line-through">
                  Commercial: ₹{result.commercialCostInr.toLocaleString('en-IN')}
                </span>
                <span className="text-sm font-bold text-emerald-400">
                  DIY Build: ₹{result.diyCostInr.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              Save ₹{result.savingsInr.toLocaleString('en-IN')} (90% Cheaper!)
            </div>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="p-4 rounded-xl bg-elevated/50 border border-subtle space-y-2 text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200">Assembly Instructions (5 Minutes):</span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 border border-slate-700 transition-colors"
            >
              {copiedSteps ? <Check className="w-3 h-3 text-emerald-400" /> : <ArrowRight className="w-3 h-3" />}
              {copiedSteps ? 'Copied to Clipboard!' : 'Copy Build Specs'}
            </button>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-400 leading-relaxed">
            <li>Buy one 20-inch domestic box fan (~₹1,200) and {result.recommendedFilters} MERV-13 filter(s).</li>
            <li>Place the filter on the rear suction side with airflow arrow pointing into fan blades.</li>
            <li>Use duct tape to seal all 4 perimeter edges so air cannot leak around the frame.</li>
            <li>Cut a 14-inch circular cardboard shroud and tape to the front to boost velocity.</li>
            <li>Run on medium speed in a closed room for 45 minutes to cut indoor PM2.5 by ~55%.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
