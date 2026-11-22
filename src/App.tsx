import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  AirQualityTelemetry,
  HouseholdProfile,
  PersonalizedActionPlan,
  RecommendationCategory,
  Language,
} from './types/airQuality';
import { fetchCityTelemetry, CITY_PRESETS } from './services/aqiService';
import { generatePersonalizedPlan } from './services/geminiService';
import { calculateAggregatedImpact } from './utils/impactCalculator';
import { AqiHeader } from './components/AqiHeader';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ProfileForm } from './components/ProfileForm';
import { ImpactVisualizer } from './components/ImpactVisualizer';
import { ActionPlanGrid } from './components/ActionPlanGrid';
import { InversionTimeline } from './components/InversionTimeline';
import { SmogChatCopilot } from './components/SmogChatCopilot';
import { PurifierCalculatorModal } from './components/PurifierCalculatorModal';
import { RwaActionKitModal } from './components/RwaActionKitModal';
import { CommuteCompareModal } from './components/CommuteCompareModal';

export const App: React.FC = () => {
  // Language State
  const [language, setLanguage] = useState<Language>('en');

  // Telemetry & City State
  const [selectedCity, setSelectedCity] = useState<string>('Delhi NCR');
  const [telemetry, setTelemetry] = useState<AirQualityTelemetry>(CITY_PRESETS[0].telemetry);
  const [isLoadingTelemetry, setIsLoadingTelemetry] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Household Profile State
  const [profile, setProfile] = useState<HouseholdProfile>({
    city: 'Delhi NCR',
    housing: 'apartment',
    vulnerabilities: ['children'],
    commute: 'solo_car',
    cookingFuel: 'lpg_with_chimney',
    familySize: 4,
    customNotes: 'Toddler has morning coughing fits; school starts at 8:00 AM.',
  });

  // Action Plan & Adoption State
  const [actionPlan, setActionPlan] = useState<PersonalizedActionPlan | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState<boolean>(false);
  const [adoptedIds, setAdoptedIds] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<'all' | RecommendationCategory>('all');

  // Modals State
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);
  const [isPurifierModalOpen, setIsPurifierModalOpen] = useState<boolean>(false);
  const [isRwaModalOpen, setIsRwaModalOpen] = useState<boolean>(false);
  const [isCommuteModalOpen, setIsCommuteModalOpen] = useState<boolean>(false);

  // API Key (BYOK) State
  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return window.sessionStorage.getItem('vayuguard_byok_key') || '';
    }
    return '';
  });

  // Save BYOK Key to memory / sessionStorage
  const handleSaveApiKey = (key: string) => {
    setCustomApiKey(key);
    if (typeof window !== 'undefined' && window.sessionStorage) {
      if (key) {
        window.sessionStorage.setItem('vayuguard_byok_key', key);
      } else {
        window.sessionStorage.removeItem('vayuguard_byok_key');
      }
    }
  };

  // City Telemetry Fetch with AbortController
  const handleCityChange = async (cityName: string) => {
    setSelectedCity(cityName);
    setProfile((prev) => ({ ...prev, city: cityName }));

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoadingTelemetry(true);
    try {
      const data = await fetchCityTelemetry(cityName, controller.signal);
      setTelemetry(data);
    } catch (err: unknown) {
      if ((err as Error)?.name !== 'AbortError') {
        console.error('Failed to load city telemetry:', err);
      }
    } finally {
      setIsLoadingTelemetry(false);
    }
  };

  // Preset Selection
  const handlePresetSelect = (cityName: string) => {
    handleCityChange(cityName);
  };

  // Action Plan Generator
  const handleGeneratePlan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoadingPlan(true);

    try {
      const plan = await generatePersonalizedPlan(profile, telemetry, customApiKey);
      setActionPlan(plan);
      // Pre-adopt top 2 recommendations for instant feedback
      const initialAdopted = new Set(plan.recommendations.slice(0, 2).map((r) => r.id));
      setAdoptedIds(initialAdopted);
    } catch (err) {
      console.error('Plan generation error:', err);
    } finally {
      setIsLoadingPlan(false);
    }
  };

  // Initial Plan Generation on Mount
  useEffect(() => {
    handleGeneratePlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [telemetry.city, telemetry.severity]);

  // Toggle Action Adoption
  const handleToggleAdopt = (id: string) => {
    setAdoptedIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  // Memoized Aggregated Direct Impact Metrics
  const aggregatedImpact = useMemo(() => {
    const recs = actionPlan?.recommendations || [];
    return calculateAggregatedImpact(recs, adoptedIds);
  }, [actionPlan, adoptedIds]);

  return (
    <div className="min-h-screen bg-[#070B10] bg-grid-pattern text-slate-100 flex flex-col font-sans selection:bg-emerald-400 selection:text-slate-950">
      {/* Semantic Landmark: Header */}
      <AqiHeader
        telemetry={telemetry}
        selectedCity={selectedCity}
        onCityChange={handleCityChange}
        onPresetSelect={handlePresetSelect}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        onOpenPurifierModal={() => setIsPurifierModalOpen(true)}
        onOpenRwaModal={() => setIsRwaModalOpen(true)}
        onOpenCommuteModal={() => setIsCommuteModalOpen(true)}
        language={language}
        onToggleLanguage={setLanguage}
        isLoadingTelemetry={isLoadingTelemetry}
        hasCustomKey={Boolean(customApiKey)}
      />

      {/* Semantic Landmark: Main Content */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 24-Hour Diurnal Inversion & Smog Trap Timeline */}
        <InversionTimeline hourlyForecast={telemetry.hourlyForecast} />

        {/* Responsive 12-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Rail: Household Context & Profile Form (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <ProfileForm
              profile={profile}
              onChange={setProfile}
              onSubmit={handleGeneratePlan}
              isLoading={isLoadingPlan}
            />
          </div>

          {/* Right Workspace: Impact Dashboard & Action Plan (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <ImpactVisualizer impact={aggregatedImpact} pm25={telemetry.pm25} />

            <ActionPlanGrid
              plan={actionPlan}
              adoptedIds={adoptedIds}
              onToggleAdopt={handleToggleAdopt}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              isLoading={isLoadingPlan}
            />
          </div>
        </div>

        {/* Smog Copilot Interactive Conversational Assistant */}
        <div className="pt-2">
          <SmogChatCopilot
            profile={profile}
            telemetry={telemetry}
            userApiKey={customApiKey}
          />
        </div>
      </main>

      {/* Semantic Landmark: Footer */}
      <footer className="border-t-2 border-slate-800 bg-[#06090E]/95 py-6 mt-12 text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <p className="font-bold text-slate-200 uppercase tracking-wider">
              VayuGuard AI — Built for PromptWars Challenge 6 (Urban Air Quality Assistant)
            </p>
            <p className="text-[11px] text-slate-500 font-sans">
              Neo-Brutalist Architecture • TypeScript Strict Mode • WCAG 2.1 AA • CPCB Indian NAQI • Dual-Mode GenAI
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-bold font-mono">
            <span className="text-emerald-400">[CPCB_NAQI_LIVE]</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400">[GEMINI_2.5_FLASH]</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">[CLIENT_SIDE_PRIVACY]</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        currentKey={customApiKey}
        onSaveKey={handleSaveApiKey}
      />

      <PurifierCalculatorModal
        isOpen={isPurifierModalOpen}
        onClose={() => setIsPurifierModalOpen(false)}
      />

      <RwaActionKitModal
        isOpen={isRwaModalOpen}
        onClose={() => setIsRwaModalOpen(false)}
        telemetry={telemetry}
        language={language}
      />

      <CommuteCompareModal
        isOpen={isCommuteModalOpen}
        onClose={() => setIsCommuteModalOpen(false)}
      />
    </div>
  );
};
