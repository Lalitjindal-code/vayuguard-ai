import React from 'react';
import {
  Calendar,
  Check,
  Clock,
  Zap,
  Home,
  RefreshCw,
  Info,
} from 'lucide-react';
import {
  PersonalizedActionPlan,
  RecommendationCategory,
} from '../types/airQuality';

interface ActionPlanGridProps {
  plan: PersonalizedActionPlan | null;
  adoptedIds: Set<string>;
  onToggleAdopt: (id: string) => void;
  activeCategory: 'all' | RecommendationCategory;
  onCategoryChange: (category: 'all' | RecommendationCategory) => void;
  isLoading: boolean;
}

export const ActionPlanGrid: React.FC<ActionPlanGridProps> = ({
  plan,
  adoptedIds,
  onToggleAdopt,
  activeCategory,
  onCategoryChange,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <section
        aria-label="Action Recommendations Loading"
        aria-live="polite"
        className="space-y-4"
      >
        <div className="p-4 rounded-xl bg-surface border border-subtle flex items-center gap-3 text-slate-300 text-xs">
          <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" aria-hidden="true" />
          <span>Analyzing winter atmospheric inversion and tailoring your family action plan...</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-surface border border-subtle/80 space-y-3 animate-pulse"
            >
              <div className="h-4 bg-slate-800 rounded w-1/3" />
              <div className="h-5 bg-slate-800 rounded w-3/4" />
              <div className="h-12 bg-slate-800/60 rounded" />
              <div className="h-20 bg-slate-800/40 rounded-xl" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!plan || plan.recommendations.length === 0) {
    return (
      <div className="p-8 text-center bg-surface border border-subtle rounded-2xl text-slate-400 text-xs">
        No active recommendations. Click "Generate Personalized Plan" to analyze your household profile.
      </div>
    );
  }

  const filteredRecommendations = plan.recommendations.filter((rec) => {
    if (activeCategory === 'all') return true;
    return rec.category === activeCategory;
  });

  const getCategoryMeta = (cat: RecommendationCategory) => {
    switch (cat) {
      case 'routine':
        return {
          label: 'Daily Routine',
          icon: <Clock className="w-3.5 h-3.5" aria-hidden="true" />,
          badgeColor: 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300',
        };
      case 'indoor_hack':
        return {
          label: 'Indoor Air Hack',
          icon: <Home className="w-3.5 h-3.5" aria-hidden="true" />,
          badgeColor: 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300',
        };
      case 'sustainable_alternative':
      default:
        return {
          label: 'Sustainable Swap',
          icon: <Zap className="w-3.5 h-3.5" aria-hidden="true" />,
          badgeColor: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300',
        };
    }
  };

  const counts = {
    all: plan.recommendations.length,
    routine: plan.recommendations.filter((r) => r.category === 'routine').length,
    indoor_hack: plan.recommendations.filter((r) => r.category === 'indoor_hack').length,
    sustainable_alternative: plan.recommendations.filter((r) => r.category === 'sustainable_alternative').length,
  };

  return (
    <section aria-labelledby="plan-section-title" className="space-y-4">
      {/* Plan Header & Winter Smog Advisory Alert */}
      <div className="bg-surface border border-subtle rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-subtle">
          <div>
            <div className="flex items-center gap-2">
              <h2 id="plan-section-title" className="text-base font-bold text-slate-100 font-sans">
                Tailored Winter Smog Action Plan
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                {plan.generatedBy === 'gemini-ai' ? 'Gemini 2.5 Flash' : 'Deterministic Engine'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{plan.summary}</p>
          </div>
        </div>

        {/* Smog Advisory Callout */}
        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-0.5">
            <span className="font-semibold text-amber-300">Winter Boundary Layer Trap Advisory:</span>
            <p className="text-amber-200/90 leading-relaxed">{plan.winterSmogAdvisory}</p>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter recommendations by category"
          className="flex flex-wrap items-center gap-1.5 pt-1"
        >
          {[
            { id: 'all', label: `All Actions (${counts.all})` },
            { id: 'routine', label: `Daily Routines (${counts.routine})` },
            { id: 'indoor_hack', label: `Indoor Hacks (${counts.indoor_hack})` },
            { id: 'sustainable_alternative', label: `Sustainable Swaps (${counts.sustainable_alternative})` },
          ].map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                onClick={() => onCategoryChange(tab.id as 'all' | RecommendationCategory)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  isActive
                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-semibold shadow-sm'
                    : 'bg-elevated/70 border border-subtle text-slate-400 hover:text-slate-200 hover:border-slate-600'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div
        id={`tabpanel-${activeCategory}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeCategory}`}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {filteredRecommendations.map((rec) => {
          const isAdopted = adoptedIds.has(rec.id);
          const meta = getCategoryMeta(rec.category);

          return (
            <article
              key={rec.id}
              className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-4 shadow-sm ${
                isAdopted
                  ? 'bg-surface border-emerald-500/50 ring-1 ring-emerald-500/30'
                  : 'bg-surface border-subtle hover:border-slate-600'
              }`}
            >
              <div className="space-y-2.5">
                {/* Category & Adoption Checkbox Header */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${meta.badgeColor}`}
                  >
                    {meta.icon}
                    {meta.label}
                  </span>

                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={isAdopted}
                    onClick={() => onToggleAdopt(rec.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg font-semibold transition-all focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                      isAdopted
                        ? 'bg-emerald-400 text-slate-950 hover:bg-emerald-300'
                        : 'bg-elevated border border-subtle text-slate-300 hover:border-emerald-500/50 hover:text-emerald-400'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 ${isAdopted ? 'stroke-[3]' : 'opacity-40'}`} aria-hidden="true" />
                    <span>{isAdopted ? 'Adopted' : 'Adopt Action'}</span>
                  </button>
                </div>

                {/* Title & Metadata */}
                <div>
                  <h3 className="text-sm font-bold text-slate-100 font-sans leading-snug">
                    {rec.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" aria-hidden="true" />
                      {rec.timeframe}
                    </span>
                    <span>•</span>
                    <span>
                      {rec.estimatedCostInr === 0 ? 'Zero-Cost / Free' : `Cost: ~₹${rec.estimatedCostInr}`}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed">{rec.description}</p>
              </div>

              {/* Direct Impact Explanation Box (Mandated by Problem Statement) */}
              <div className="p-3.5 rounded-xl bg-elevated/90 border border-subtle/90 space-y-2 text-xs">
                <div className="flex items-center justify-between font-mono font-semibold">
                  <span className="text-emerald-400">
                    -{rec.impact.pm25ReductionPercent}% PM<sub>2.5</sub> Inhaled
                  </span>
                  <span className="text-cyan-400">
                    +{rec.impact.weeklyCo2SavedKg} kg CO₂/wk
                  </span>
                </div>

                <div className="pt-1.5 border-t border-subtle/60 text-slate-300 leading-relaxed text-[11px]">
                  <strong className="text-slate-100 font-sans block mb-0.5">
                    Direct Impact Explanation:
                  </strong>
                  {rec.impact.directExplanation}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
