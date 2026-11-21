import React, { useEffect, useRef } from 'react';
import {
  Calendar,
  Check,
  Clock,
  Zap,
  Home,
  RefreshCw,
  Info,
} from 'lucide-react';
import gsap from 'gsap';
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
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // GSAP card entrance animation when plan or category changes
  useEffect(() => {
    if (cardsContainerRef.current) {
      gsap.fromTo(
        cardsContainerRef.current.querySelectorAll('.action-plan-card'),
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: 'power2.out' }
      );
    }
  }, [plan, activeCategory]);

  if (isLoading) {
    return (
      <section
        aria-label="Action Recommendations Loading"
        aria-live="polite"
        className="space-y-4"
      >
        <div className="p-4 rounded-xl bg-[#0C121B] border-2 border-slate-700 brutal-shadow flex items-center gap-3 text-slate-200 text-xs font-mono">
          <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" aria-hidden="true" />
          <span>Analyzing winter atmospheric inversion and tailoring your family action plan...</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-[#0C121B] border-2 border-slate-800 space-y-3 animate-pulse brutal-shadow-sm"
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
      <div className="p-8 text-center bg-[#0C121B] border-2 border-slate-700 rounded-xl text-slate-400 text-xs font-mono brutal-shadow">
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
          badgeColor: 'bg-indigo-950/80 border-2 border-indigo-500 text-indigo-200',
        };
      case 'indoor_hack':
        return {
          label: 'Indoor Air Hack',
          icon: <Home className="w-3.5 h-3.5" aria-hidden="true" />,
          badgeColor: 'bg-cyan-950/80 border-2 border-cyan-500 text-cyan-200',
        };
      case 'sustainable_alternative':
      default:
        return {
          label: 'Sustainable Swap',
          icon: <Zap className="w-3.5 h-3.5" aria-hidden="true" />,
          badgeColor: 'bg-emerald-950/80 border-2 border-emerald-500 text-emerald-200',
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
      <div className="bg-[#0C121B] border-2 border-slate-700 rounded-xl p-5 brutal-shadow space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b-2 border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 id="plan-section-title" className="text-base font-extrabold uppercase tracking-wide text-white font-sans">
                Tailored Winter Smog Action Plan
              </h2>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-900 text-emerald-300 border border-emerald-500/50">
                [{plan.generatedBy === 'gemini-ai' ? 'GEMINI_2.5_FLASH' : 'DETERMINISTIC_ENGINE'}]
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{plan.summary}</p>
          </div>
        </div>

        {/* Smog Advisory Callout */}
        <div className="p-3.5 rounded-lg bg-amber-950/30 border-2 border-amber-500/50 text-xs text-amber-200 flex items-start gap-2.5 brutal-shadow-sm">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-0.5">
            <span className="font-bold uppercase tracking-wider text-amber-300 font-mono">Winter Boundary Layer Trap Advisory:</span>
            <p className="text-amber-200/90 leading-relaxed font-sans">{plan.winterSmogAdvisory}</p>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter recommendations by category"
          className="flex flex-wrap items-center gap-2 pt-1"
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
                className={`px-3 py-1.5 text-xs font-bold font-mono uppercase rounded-lg border-2 transition-all brutal-btn ${
                  isActive
                    ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 brutal-shadow-emerald'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 brutal-shadow-sm'
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
        ref={cardsContainerRef}
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
              className={`action-plan-card p-5 rounded-xl border-2 transition-all flex flex-col justify-between space-y-4 ${
                isAdopted
                  ? 'bg-[#101726] border-emerald-500 brutal-shadow-emerald'
                  : 'bg-[#0C121B] border-slate-700 hover:border-slate-500 brutal-shadow'
              }`}
            >
              <div className="space-y-2.5">
                {/* Category & Adoption Checkbox Header */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-bold font-mono uppercase ${meta.badgeColor}`}
                  >
                    {meta.icon}
                    {meta.label}
                  </span>

                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={isAdopted}
                    onClick={() => onToggleAdopt(rec.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold font-mono uppercase rounded-lg border-2 transition-all brutal-btn ${
                      isAdopted
                        ? 'bg-emerald-400 text-slate-950 border-emerald-500 hover:bg-emerald-300'
                        : 'bg-slate-900 border-slate-600 text-slate-300 hover:border-emerald-400 hover:text-emerald-400'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 ${isAdopted ? 'stroke-[3]' : 'opacity-40'}`} aria-hidden="true" />
                    <span>{isAdopted ? 'Adopted' : 'Adopt Action'}</span>
                  </button>
                </div>

                {/* Title & Metadata */}
                <div>
                  <h3 className="text-sm font-extrabold text-white font-sans leading-snug">
                    {rec.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" aria-hidden="true" />
                      {rec.timeframe}
                    </span>
                    <span>•</span>
                    <span className="text-cyan-300">
                      {rec.estimatedCostInr === 0 ? 'Zero-Cost / Free' : `Cost: ~₹${rec.estimatedCostInr}`}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{rec.description}</p>
              </div>

              {/* Direct Impact Explanation Box (Mandated by Problem Statement) */}
              <div className="p-3.5 rounded-lg bg-[#111824] border-2 border-slate-700/80 space-y-2 text-xs brutal-shadow-sm">
                <div className="flex items-center justify-between font-mono font-black">
                  <span className="text-emerald-400">
                    -{rec.impact.pm25ReductionPercent}% PM<sub>2.5</sub> INHALED
                  </span>
                  <span className="text-cyan-400">
                    +{rec.impact.weeklyCo2SavedKg} kg CO₂/wk
                  </span>
                </div>

                <div className="pt-2 border-t-2 border-slate-800 text-slate-300 leading-relaxed text-[11px] font-sans">
                  <strong className="text-white uppercase font-mono font-bold block mb-0.5 text-[10px] tracking-wider text-emerald-300">
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
