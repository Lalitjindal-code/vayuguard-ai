/**
 * Domain data contracts and strict TypeScript interfaces for VayuGuard AI.
 * strictly adhering to TRD.md and PRD.md.
 */

export type AqiSeverity = 'Good' | 'Moderate' | 'Poor' | 'Severe';

export type HousingType = 'apartment' | 'independent_house' | 'roadside_home';

export type CommuteMode = 'solo_car' | 'two_wheeler' | 'public_transit' | 'ev_or_wfh';

export type CookingFuel =
  | 'lpg_with_chimney'
  | 'lpg_no_exhaust'
  | 'electric_induction'
  | 'biomass_coal';

export type VulnerabilityGroup =
  | 'children'
  | 'elderly'
  | 'respiratory_condition'
  | 'none';

export type RecommendationCategory =
  | 'routine'
  | 'indoor_hack'
  | 'sustainable_alternative';

export type Language = 'en' | 'hi';

export interface HourlyForecastPoint {
  time: string;
  hour: number;
  aqi: number;
  pm25: number;
  inversionRisk: 'Low' | 'Moderate' | 'High';
  isSafeWindow: boolean;
}

export interface AirQualityTelemetry {
  city: string;
  latitude: number;
  longitude: number;
  aqi: number;
  pm25: number;
  pm10: number;
  severity: AqiSeverity;
  cpcbCategory?: string;
  dominantPollutant?: string;
  inversionRisk: 'Low' | 'Moderate' | 'High';
  safeVentilationWindow: string;
  updatedAt: string;
  isSimulated?: boolean;
  hourlyForecast?: HourlyForecastPoint[];
}

export interface HouseholdProfile {
  city: string;
  housing: HousingType;
  vulnerabilities: VulnerabilityGroup[];
  commute: CommuteMode;
  cookingFuel: CookingFuel;
  familySize: number;
  customNotes: string;
}

export interface DirectImpactMetrics {
  /** Estimated percentage drop in personal/household PM2.5 inhalation */
  pm25ReductionPercent: number;
  /** Estimated weekly community carbon emission offset in kg CO2 */
  weeklyCo2SavedKg: number;
  /** Estimated monthly financial or healthcare savings in INR */
  monthlySavingsInr: number;
  /** Plain-language causal explanation of how this action protects health and cuts smog */
  directExplanation: string;
}

export interface ActionRecommendation {
  id: string;
  category: RecommendationCategory;
  title: string;
  description: string;
  timeframe: string;
  estimatedCostInr: number;
  /** Direct impact metrics mandated by Problem Statement */
  impact: DirectImpactMetrics;
}

export interface PersonalizedActionPlan {
  summary: string;
  winterSmogAdvisory: string;
  recommendations: ActionRecommendation[];
  generatedBy: 'gemini-ai' | 'deterministic-engine';
}

export interface AggregatedImpact {
  totalPm25ReductionPct: number;
  totalWeeklyCo2SavedKg: number;
  totalMonthlySavingsInr: number;
  adoptedCount: number;
  totalCount: number;
  communityMultiplier: {
    householdCount: number;
    annualCo2SavedKg: number;
    pm25DustAvoidedGrams: number;
    treesEquivalent: number;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface PurifierRoomCalculation {
  lengthFt: number;
  widthFt: number;
  heightFt: number;
  roomAreaSqFt: number;
  roomVolumeCuFt: number;
  requiredCadrCfm: number;
  recommendedFilters: number;
  diyCostInr: number;
  commercialCostInr: number;
  savingsInr: number;
  achRating: number;
}

export interface CommuteComparisonItem {
  mode: CommuteMode;
  label: string;
  dailyCo2Kg: number;
  monthlyCostInr: number;
  pm25ExposureIndex: number; // 0 - 100 relative exposure scale
  healthAdvice: string;
}
