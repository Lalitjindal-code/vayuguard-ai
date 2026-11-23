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

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(assemblySteps);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = assemblySteps;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedSteps(true);
      setTimeout(() => setCopiedSteps(false), 1500);
    } catch {
      // Fallback: indicate copy attempted
      setCopiedSteps(true);
      setTimeout(() => setCopiedSteps(false), 1500);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="purifier-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
    >
      <div className="w-full max-w-2xl bg-[#0C121B] border-2 border-slate-700 rounded-xl brutal-shadow p-6 relative my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400"
          aria-label="Close purifier calculator"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 brutal-shadow-sm font-bold">
            <Wrench className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
          </div>
          <div>
            <h2 id="purifier-modal-title" className="text-base font-black uppercase tracking-wide text-white font-display">
              DIY Box-Fan & HEPA Purifier CADR Calculator
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Corsi-Rosenthal clean air calculations tailored to your room volume
            </p>
          </div>
        </div>

        {/* Room Dimension Inputs */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#111824] border-2 border-slate-800 mb-5">
          <div>
            <label htmlFor="room-length" className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1 font-mono">
              Length (feet)
            </label>
            <input
              id="room-length"
              type="number"
              min={6}
              max={35}
              value={length}
              onChange={(e) => setLength(Number(e.target.value) || 6)}
              className="w-full px-3 py-1.5 text-xs font-mono font-bold bg-slate-900 border-2 border-slate-700 rounded-lg text-white focus:border-cyan-400 brutal-shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="room-width" className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1 font-mono">
              Width (feet)
            </label>
            <input
              id="room-width"
              type="number"
              min={6}
              max={35}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value) || 6)}
              className="w-full px-3 py-1.5 text-xs font-mono font-bold bg-slate-900 border-2 border-slate-700 rounded-lg text-white focus:border-cyan-400 brutal-shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="room-height" className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1 font-mono">
              Ceiling (feet)
            </label>
            <input
              id="room-height"
              type="number"
              min={7}
              max={15}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value) || 8)}
              className="w-full px-3 py-1.5 text-xs font-mono font-bold bg-slate-900 border-2 border-slate-700 rounded-lg text-white focus:border-cyan-400 brutal-shadow-sm"
            />
          </div>
        </div>

        {/* Calculated Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 font-mono">
          <div className="p-3 rounded-lg bg-slate-900 border-2 border-slate-700 text-center brutal-shadow-sm">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Room Volume</span>
            <span className="text-base font-black text-white">
              {result.roomVolumeCuFt} <span className="text-xs font-normal">cu.ft</span>
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border-2 border-cyan-500/60 text-center brutal-shadow-cyan">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Required CADR</span>
            <span className="text-base font-black text-cyan-400">
              {result.requiredCadrCfm} <span className="text-xs font-normal">CFM</span>
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border-2 border-emerald-500/60 text-center brutal-shadow-emerald">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Target ACH</span>
            <span className="text-base font-black text-emerald-400">
              {result.achRating}x / hr
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border-2 border-amber-500/60 text-center brutal-shadow-amber">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Filters Needed</span>
            <span className="text-base font-black text-amber-400">
              {result.recommendedFilters}x MERV-13
            </span>
          </div>
        </div>

        {/* Cost Comparison: Commercial vs DIY */}
        <div className="p-4 rounded-xl bg-[#101726] border-2 border-emerald-400/80 brutal-shadow-emerald mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block font-mono">
                Cost Comparison for {result.roomAreaSqFt} sq.ft room
              </span>
              <div className="flex items-center gap-4 mt-1 font-mono">
                <span className="text-xs text-red-400 line-through font-bold">
                  Commercial: ₹{result.commercialCostInr.toLocaleString('en-IN')}
                </span>
                <span className="text-sm font-black text-emerald-400">
                  DIY Build: ₹{result.diyCostInr.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 text-xs font-extrabold font-mono brutal-shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              SAVE ₹{result.savingsInr.toLocaleString('en-IN')} (90% CHEAPER)
            </div>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="p-4 rounded-xl bg-slate-900 border-2 border-slate-700 space-y-2 text-xs text-slate-300 brutal-shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-extrabold uppercase tracking-wider text-white font-mono text-[11px]">Assembly Instructions (5 Minutes):</span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold font-mono uppercase text-white border-2 border-slate-600 brutal-btn"
            >
              {copiedSteps ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ArrowRight className="w-3.5 h-3.5" />}
              {copiedSteps ? 'COPIED!' : 'COPY SPECS'}
            </button>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-400 leading-relaxed font-sans">
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
