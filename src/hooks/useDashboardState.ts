import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  AirQualityTelemetry,
  HouseholdProfile,
  PersonalizedActionPlan,
  RecommendationCategory,
  Language,
} from '../types/airQuality';
import { fetchCityTelemetry, CITY_PRESETS } from '../services/aqiService';
import { generatePersonalizedPlan } from '../services/geminiService';
import { calculateAggregatedImpact } from '../utils/impactCalculator';

const BYOK_STORAGE_KEY = 'vayuguard_byok_key';

const DEFAULT_PROFILE: HouseholdProfile = {
  city: 'Delhi NCR',
  housing: 'apartment',
  vulnerabilities: ['children'],
  commute: 'solo_car',
  cookingFuel: 'lpg_with_chimney',
  familySize: 4,
  customNotes: 'Toddler has morning coughing fits; school starts at 8:00 AM.',
};

function readInitialApiKey(): string {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return window.sessionStorage.getItem(BYOK_STORAGE_KEY) || '';
    }
  } catch {
    // Ignore restricted sessionStorage access
  }
  return '';
}

/**
 * Encapsulates core telemetry, household profile, GenAI action plan,
 * adoption tracking, and BYOK session-key state for the main dashboard.
 */
export function useDashboardState() {
  const [language, setLanguage] = useState<Language>('en');
  const [selectedCity, setSelectedCity] = useState<string>('Delhi NCR');
  const [telemetry, setTelemetry] = useState<AirQualityTelemetry>(CITY_PRESETS[0].telemetry);
  const [isLoadingTelemetry, setIsLoadingTelemetry] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [profile, setProfile] = useState<HouseholdProfile>(DEFAULT_PROFILE);
  const [actionPlan, setActionPlan] = useState<PersonalizedActionPlan | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState<boolean>(false);
  const [adoptedIds, setAdoptedIds] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<'all' | RecommendationCategory>('all');
  const [customApiKey, setCustomApiKey] = useState<string>(readInitialApiKey);

  const handleSaveApiKey = useCallback((key: string) => {
    setCustomApiKey(key);
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        if (key) {
          window.sessionStorage.setItem(BYOK_STORAGE_KEY, key);
        } else {
          window.sessionStorage.removeItem(BYOK_STORAGE_KEY);
        }
      }
    } catch {
      // Ignore restricted sessionStorage access
    }
  }, []);

  const handleCityChange = useCallback(async (cityName: string) => {
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
  }, []);

  const handleGeneratePlan = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      setIsLoadingPlan(true);

      try {
        const plan = await generatePersonalizedPlan(profile, telemetry, customApiKey);
        setActionPlan(plan);
        setAdoptedIds(new Set(plan.recommendations.slice(0, 2).map((r) => r.id)));
      } catch (err) {
        console.error('Plan generation error:', err);
      } finally {
        setIsLoadingPlan(false);
      }
    },
    [profile, telemetry, customApiKey]
  );

  // Trigger initial & city-change plan generation cleanly
  useEffect(() => {
    handleGeneratePlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [telemetry.city]);

  // Abort pending telemetry fetch if component unmounts
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleToggleAdopt = useCallback((id: string) => {
    setAdoptedIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  }, []);

  const aggregatedImpact = useMemo(() => {
    const recs = actionPlan?.recommendations || [];
    return calculateAggregatedImpact(recs, adoptedIds);
  }, [actionPlan, adoptedIds]);

  return {
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
  };
}
