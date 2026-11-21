import React from 'react';
import {
  ShieldCheck,
  Leaf,
  IndianRupee,
  Users,
  CheckCircle2,
  TreePine,
  Sparkles,
} from 'lucide-react';
import { AggregatedImpact } from '../types/airQuality';

interface ImpactVisualizerProps {
  impact: AggregatedImpact;
}

export const ImpactVisualizer: React.FC<ImpactVisualizerProps> = ({ impact }) => {
  return (
    <section
      aria-label="Quantified Impact and Community Multiplier"
      className="bg-surface border border-subtle rounded-2xl p-5 shadow-lg space-y-4"
    >
      {/* Top Banner: Adoption Progress & Household Direct KPIs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-subtle">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 font-sans">
              Quantified Direct Impact
            </h2>
            <p className="text-xs text-slate-400">
              {impact.adoptedCount} of {impact.totalCount} recommendations adopted
            </p>
          </div>
        </div>

        {/* Progress Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-elevated border border-subtle text-xs">
          <div className="w-20 bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-400 h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${impact.totalCount > 0 ? (impact.adoptedCount / impact.totalCount) * 100 : 0}%`,
              }}
            />
          </div>
          <span className="font-mono font-semibold text-emerald-300">
            {impact.totalCount > 0
              ? Math.round((impact.adoptedCount / impact.totalCount) * 100)
              : 0}
            %
          </span>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Metric 1: PM2.5 Inhalation Reduction */}
        <div className="p-3.5 rounded-xl bg-elevated/70 border border-subtle space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>PM<sub>2.5</sub> Exposure Cut</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            -{impact.totalPm25ReductionPct}%
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Cumulative family respiratory inhalation drop
          </p>
        </div>

        {/* Metric 2: Weekly CO2 Offsets */}
        <div className="p-3.5 rounded-xl bg-elevated/70 border border-subtle space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Weekly Carbon Saved</span>
            <Leaf className="w-4 h-4 text-cyan-400" aria-hidden="true" />
          </div>
          <div className="text-xl font-bold font-mono text-cyan-400">
            {impact.totalWeeklyCo2SavedKg}{' '}
            <span className="text-xs font-normal text-slate-400">kg CO₂</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Avoided via transit & clean habits
          </p>
        </div>

        {/* Metric 3: Monthly Financial Savings */}
        <div className="p-3.5 rounded-xl bg-elevated/70 border border-subtle space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Monthly Savings</span>
            <IndianRupee className="w-4 h-4 text-amber-400" aria-hidden="true" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-400">
            ₹{impact.totalMonthlySavingsInr.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Fuel, transit & DIY purifier savings
          </p>
        </div>
      </div>

      {/* Community Multiplier Banner (Scales to 100 neighborhood households) */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 via-elevated to-cyan-950/20 border border-emerald-500/30 space-y-2">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <h3 className="text-xs font-bold text-slate-200 tracking-wide uppercase font-sans">
            Community Multiplier (100 Neighborhood Households)
          </h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          If <strong>100 families</strong> in your residential society adopt your active plan, together your community will prevent{' '}
          <strong className="text-emerald-300 font-mono">
            {impact.communityMultiplier.annualCo2SavedKg.toLocaleString('en-IN')} kg of CO₂
          </strong>{' '}
          per year and keep{' '}
          <strong className="text-cyan-300 font-mono">
            {impact.communityMultiplier.pm25DustAvoidedGrams.toLocaleString('en-IN')} grams of toxic PM<sub>2.5</sub>
          </strong>{' '}
          out of children's lungs.
        </p>

        <div className="flex items-center gap-4 pt-1 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <TreePine className="w-4 h-4" aria-hidden="true" />
            Equivalent to planting <strong>{impact.communityMultiplier.treesEquivalent}</strong> mature urban trees
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
            RWA Collective Power
          </span>
        </div>
      </div>
    </section>
  );
};
