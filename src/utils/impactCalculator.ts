/**
 * Pure mathematical functions for personal air pollution exposure reduction,
 * carbon emissions offsets, and community-wide scaling.
 *
 * Formulas:
 * 1. Personal Inhalation Reduction (%):
 *    Combined efficiency using diminishing returns model:
 *    Reduction = (1 - PRODUCT(1 - r_i / 100)) * 100, capped at realistic 92%.
 *
 * 2. Community CO2 Savings (kg/week):
 *    Additive sum of direct weekly offsets across adopted actions:
 *    Total CO2 = SUM(action.weeklyCo2SavedKg).
 *
 * 3. Community Multiplier:
 *    Scales household achievements to 100 neighborhood families over 52 weeks (1 year).
 *    1 mature urban tree absorbs approximately 21.7 kg CO2 per year.
 */

import { ActionRecommendation, AggregatedImpact } from '../types/airQuality';

const NEIGHBORHOOD_HOUSEHOLDS = 100;
const WEEKS_PER_YEAR = 52;
const KG_CO2_PER_TREE_PER_YEAR = 21.7;

/**
 * Calculates aggregated personal health and environmental impact metrics
 * based on the user's currently adopted/selected actions.
 *
 * @param recommendations - All available recommendations in the current plan
 * @param adoptedIds - Set or array of recommendation IDs selected by the user
 * @returns AggregatedImpact object containing personal and community scaled metrics
 */
export function calculateAggregatedImpact(
  recommendations: ActionRecommendation[],
  adoptedIds: string[] | Set<string>
): AggregatedImpact {
  const adoptedSet = adoptedIds instanceof Set ? adoptedIds : new Set(adoptedIds);

  const adoptedActions = recommendations.filter((rec) => adoptedSet.has(rec.id));

  if (adoptedActions.length === 0) {
    return {
      totalPm25ReductionPct: 0,
      totalWeeklyCo2SavedKg: 0,
      totalMonthlySavingsInr: 0,
      adoptedCount: 0,
      totalCount: recommendations.length,
      communityMultiplier: {
        householdCount: NEIGHBORHOOD_HOUSEHOLDS,
        annualCo2SavedKg: 0,
        pm25DustAvoidedGrams: 0,
        treesEquivalent: 0,
      },
    };
  }

  // 1. Calculate Combined Exposure Reduction using diminishing returns
  // Remaining exposure fraction = product of (1 - individual reduction)
  let remainingExposureFraction = 1.0;
  for (const action of adoptedActions) {
    const rawReduction = Math.max(0, Math.min(action.impact.pm25ReductionPercent, 95));
    remainingExposureFraction *= 1 - rawReduction / 100;
  }
  const combinedReduction = (1 - remainingExposureFraction) * 100;
  // Cap at 92% maximum realistic indoor/routine cumulative reduction
  const totalPm25ReductionPct = Math.min(Math.round(combinedReduction * 10) / 10, 92);

  // 2. Additive weekly CO2 savings in kg
  const totalWeeklyCo2 = adoptedActions.reduce(
    (sum, action) => sum + (Number(action.impact.weeklyCo2SavedKg) || 0),
    0
  );
  const totalWeeklyCo2SavedKg = Math.round(totalWeeklyCo2 * 10) / 10;

  // 3. Additive monthly financial savings in INR
  const totalMonthlySavingsInr = adoptedActions.reduce(
    (sum, action) => sum + (Number(action.impact.monthlySavingsInr) || 0),
    0
  );

  // 4. Community Multiplier calculations (100 households x 52 weeks)
  const annualCo2SavedKg = Math.round(
    totalWeeklyCo2SavedKg * WEEKS_PER_YEAR * NEIGHBORHOOD_HOUSEHOLDS
  );

  // Estimated neighborhood PM2.5 dust/soot avoided (approx 35 grams per household weekly routine shift)
  const pm25DustAvoidedGrams = Math.round(
    adoptedActions.length * 35 * WEEKS_PER_YEAR * (NEIGHBORHOOD_HOUSEHOLDS / 10)
  );

  // Trees equivalent
  const treesEquivalent = Math.round(annualCo2SavedKg / KG_CO2_PER_TREE_PER_YEAR);

  return {
    totalPm25ReductionPct,
    totalWeeklyCo2SavedKg,
    totalMonthlySavingsInr,
    adoptedCount: adoptedActions.length,
    totalCount: recommendations.length,
    communityMultiplier: {
      householdCount: NEIGHBORHOOD_HOUSEHOLDS,
      annualCo2SavedKg,
      pm25DustAvoidedGrams,
      treesEquivalent,
    },
  };
}
