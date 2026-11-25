import React, { useState } from 'react';
import { AqiHeader } from './components/AqiHeader';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ProfileForm } from './components/ProfileForm';
import { ImpactVisualizer } from './components/ImpactVisualizer';
import { ActionPlanGrid } from './components/ActionPlanGrid';
import { InversionTimeline } from './components/InversionTimeline';
import { SmogChatCopilot } from './components/SmogChatCopilot';
import { DailyDefenseChecklist } from './components/DailyDefenseChecklist';
import { PurifierCalculatorModal } from './components/PurifierCalculatorModal';
import { RwaActionKitModal } from './components/RwaActionKitModal';
import { CommuteCompareModal } from './components/CommuteCompareModal';
import { useDashboardState } from './hooks/useDashboardState';

export const App: React.FC = () => {
  const {
    language,
    setLanguage,
    selectedCity,
    telemetry,
    isLoadingTelemetry,
    profile,
    setProfile,
    actionPlan,
    isLoadingPlan,
    adoptedIds,
    activeCategory,
    setActiveCategory,
    customApiKey,
    aggregatedImpact,
    handleSaveApiKey,
    handleCityChange,
    handleGeneratePlan,
    handleToggleAdopt,
  } = useDashboardState();

  // Modal visibility state
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);
  const [isPurifierModalOpen, setIsPurifierModalOpen] = useState<boolean>(false);
  const [isRwaModalOpen, setIsRwaModalOpen] = useState<boolean>(false);
  const [isCommuteModalOpen, setIsCommuteModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#070B10] bg-grid-pattern text-slate-100 flex flex-col font-sans selection:bg-emerald-400 selection:text-slate-950">
      {/* Semantic Landmark: Header */}
      <AqiHeader
        telemetry={telemetry}
        selectedCity={selectedCity}
        onCityChange={handleCityChange}
        onPresetSelect={handleCityChange}
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
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 space-y-8">
        {/* 24-Hour Diurnal Inversion & Smog Trap Timeline */}
        <InversionTimeline hourlyForecast={telemetry.hourlyForecast} />

        {/* Responsive 12-Column Layout (stretches column heights so sticky left rail tracks full action plan) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Rail: Household Context & Daily Defense Tracker (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="scroll-mt-36">
              <ProfileForm
                profile={profile}
                onChange={setProfile}
                onSubmit={handleGeneratePlan}
                isLoading={isLoadingPlan}
              />
            </div>

            {/* Daily Winter Smog Defense Tracker - sticks cleanly below header (140px offset) so it never hides behind header */}
            <div className="lg:sticky lg:top-[140px] z-10">
              <DailyDefenseChecklist />
            </div>
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

        {/* Full-Width Neo-Brutalist Smog Copilot Assistant (At very bottom of page) */}
        <SmogChatCopilot
          profile={profile}
          telemetry={telemetry}
          userApiKey={customApiKey}
        />
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
