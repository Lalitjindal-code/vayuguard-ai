import React, { useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Leaf,
  IndianRupee,
  Users,
  CheckCircle2,
  TreePine,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { AggregatedImpact } from '../types/airQuality';

interface ImpactVisualizerProps {
  impact: AggregatedImpact;
}

export const ImpactVisualizer: React.FC<ImpactVisualizerProps> = ({ impact }) => {
  const containerRef = useRef<HTMLElement>(null);
  const prevAdoptedRef = useRef<number>(impact.adoptedCount);

  // Trigger confetti burst on new action adoption (guarded for non-canvas / test environments)
  useEffect(() => {
    if (impact.adoptedCount > prevAdoptedRef.current) {
      try {
        if (typeof document !== 'undefined') {
          const testCanvas = document.createElement('canvas');
          if (testCanvas.getContext && testCanvas.getContext('2d')) {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#10B981', '#06B6D4', '#F59E0B'],
            });
          }
        }
      } catch {
        // Ignore canvas environments without 2D support
      }
    }
    prevAdoptedRef.current = impact.adoptedCount;
  }, [impact.adoptedCount]);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.querySelectorAll('.metric-card'),
        { scale: 0.96, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 0.35, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [impact.totalPm25ReductionPct, impact.totalWeeklyCo2SavedKg]);

  return (
    <section
      ref={containerRef}
      aria-label="Quantified Impact and Community Multiplier"
      className="bg-[#0C121B] border-2 border-slate-700 rounded-xl p-5 brutal-shadow space-y-4"
    >
      {/* Top Banner: Adoption Progress & Household Direct KPIs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b-2 border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 brutal-shadow-sm font-mono font-bold">
            <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-extrabold uppercase tracking-wide text-white font-sans">
              Quantified Direct Impact
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              {impact.adoptedCount} of {impact.totalCount} recommendations adopted
            </p>
          </div>
        </div>

        {/* Brutalist Progress Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border-2 border-slate-700 brutal-shadow-sm text-xs">
          <div className="w-24 bg-slate-800 rounded h-2 overflow-hidden border border-slate-700">
            <div
              className="bg-emerald-400 h-2 transition-all duration-500"
              style={{
                width: `${impact.totalCount > 0 ? (impact.adoptedCount / impact.totalCount) * 100 : 0}%`,
              }}
            />
          </div>
          <span className="font-mono font-black text-emerald-400">
            {impact.totalCount > 0
              ? Math.round((impact.adoptedCount / impact.totalCount) * 100)
              : 0}
            %
          </span>
        </div>
      </div>

      {/* 3 Metric Cards - Hard Edged Brutal Style */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Metric 1: PM2.5 Inhalation Reduction */}
        <div className="metric-card p-4 rounded-xl bg-[#111824] border-2 border-emerald-500/60 brutal-shadow-emerald space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono font-bold">
            <span>PM<sub>2.5</sub> EXPOSURE CUT</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">
            -{impact.totalPm25ReductionPct}%
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Cumulative family respiratory inhalation drop
          </p>
        </div>

        {/* Metric 2: Weekly CO2 Offsets */}
        <div className="metric-card p-4 rounded-xl bg-[#111824] border-2 border-cyan-500/60 brutal-shadow-cyan space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono font-bold">
            <span>WEEKLY CARBON SAVED</span>
            <Leaf className="w-4 h-4 text-cyan-400" aria-hidden="true" />
          </div>
          <div className="text-2xl font-black font-mono text-cyan-400">
            {impact.totalWeeklyCo2SavedKg}{' '}
            <span className="text-xs font-bold text-slate-400">kg CO₂</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Avoided via transit & clean habits
          </p>
        </div>

        {/* Metric 3: Monthly Financial Savings */}
        <div className="metric-card p-4 rounded-xl bg-[#111824] border-2 border-amber-500/60 brutal-shadow-amber space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono font-bold">
            <span>MONTHLY SAVINGS</span>
            <IndianRupee className="w-4 h-4 text-amber-400" aria-hidden="true" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-400">
            ₹{impact.totalMonthlySavingsInr.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Fuel, transit & DIY purifier savings
          </p>
        </div>
      </div>

      {/* Community Multiplier Banner (Scales to 100 neighborhood households) */}
      <div className="p-4 rounded-xl bg-[#101726] border-2 border-emerald-400/80 brutal-shadow-emerald space-y-2">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <h3 className="text-xs font-black text-slate-100 tracking-wider uppercase font-mono">
            Community Multiplier (100 Neighborhood Households)
          </h3>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed font-sans">
          If <strong className="text-white font-bold">100 families</strong> in your residential society adopt your active plan, together your community will prevent{' '}
          <strong className="text-emerald-300 font-mono font-bold">
            {impact.communityMultiplier.annualCo2SavedKg.toLocaleString('en-IN')} kg of CO₂
          </strong>{' '}
          per year and keep{' '}
          <strong className="text-cyan-300 font-mono font-bold">
            {impact.communityMultiplier.pm25DustAvoidedGrams.toLocaleString('en-IN')} grams of toxic PM<sub>2.5</sub>
          </strong>{' '}
          out of children's lungs.
        </p>

        <div className="flex items-center gap-4 pt-1 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <TreePine className="w-4 h-4" aria-hidden="true" />
            Equivalent to planting <strong className="text-white">{impact.communityMultiplier.treesEquivalent}</strong> mature urban trees
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-slate-300 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
            RWA Collective Power
          </span>
        </div>
      </div>
    </section>
  );
};
