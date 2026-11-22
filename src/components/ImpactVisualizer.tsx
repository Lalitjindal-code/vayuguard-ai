import React, { useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Leaf,
  IndianRupee,
  Users,
  CheckCircle2,
  TreePine,
  Sparkles,
  Cigarette,
  HeartPulse,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { AggregatedImpact } from '../types/airQuality';

interface ImpactVisualizerProps {
  impact: AggregatedImpact;
  pm25?: number;
}

export const ImpactVisualizer: React.FC<ImpactVisualizerProps> = ({ impact, pm25 = 285 }) => {
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

  // Scientific Equivalence: Berkeley Earth (22 µg/m³ PM2.5 ≈ 1 cigarette/day inhaled)
  const baselineCigsPerDay = Math.max(1, Math.round((pm25 / 22) * 10) / 10);
  const reductionFraction = impact.totalPm25ReductionPct / 100;
  const mitigatedCigsPerDay = Math.max(
    0.2,
    Math.round(baselineCigsPerDay * (1 - reductionFraction) * 10) / 10
  );
  const cigsAvoidedPerDay = Math.max(
    0,
    Math.round((baselineCigsPerDay - mitigatedCigsPerDay) * 10) / 10
  );

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
            <h2 className="text-base font-black uppercase tracking-wide text-white font-display">
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

      {/* Visceral Health Benchmark: Cigarette Smoke Equivalence Meter */}
      <div className="p-4 rounded-xl bg-[#130E18] border-2 border-rose-500/60 brutal-shadow space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <Cigarette className="w-4 h-4" aria-hidden="true" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-wider text-rose-300 font-display">
              Visceral Respiratory Health Equivalent (Berkeley Earth Scientific Benchmark)
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-black/60 text-slate-400 border border-slate-700">
            [22 µg/m³ PM2.5 ≈ 1 Cigarette/Day]
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center pt-1">
          {/* Baseline Exposure */}
          <div className="p-3 rounded-lg bg-black/40 border border-rose-500/40 text-center space-y-0.5">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Current City Air Exposure</div>
            <div className="text-xl font-black font-mono text-rose-400">
              ~{baselineCigsPerDay} <span className="text-xs font-bold text-slate-400">cigs/day</span>
            </div>
            <div className="text-[10px] text-slate-500">Every family member inhaling unpurified air</div>
          </div>

          {/* Action Impact Arrow */}
          <div className="flex flex-col items-center justify-center text-center px-2 py-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400 text-emerald-300 font-mono text-xs font-black mb-1 brutal-shadow-sm">
              <HeartPulse className="w-3.5 h-3.5" />
              <span>SAVING ~{cigsAvoidedPerDay} CIGS/DAY</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              {impact.totalPm25ReductionPct}% respiratory toxin cut <ArrowRight className="w-3 h-3 text-emerald-400" />
            </span>
          </div>

          {/* Mitigated Protected Exposure */}
          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-center space-y-0.5">
            <div className="text-[11px] font-mono text-emerald-400 uppercase">With VayuGuard Action Plan</div>
            <div className="text-xl font-black font-mono text-emerald-300">
              ~{mitigatedCigsPerDay} <span className="text-xs font-bold text-slate-400">cigs/day</span>
            </div>
            <div className="text-[10px] text-emerald-400/80">Filtered indoor air & peak trap avoidance</div>
          </div>
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
      <div className="p-4 rounded-xl bg-[#131127] border-2 border-purple-500/80 brutal-shadow-purple space-y-2">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-400" aria-hidden="true" />
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
