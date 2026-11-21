import { describe, it, expect } from 'vitest';
import { calculateAggregatedImpact } from '../utils/impactCalculator';
import { ActionRecommendation } from '../types/airQuality';

describe('Impact Calculator & Environmental Science Engine (src/utils/impactCalculator.ts)', () => {
  const sampleRecommendations: ActionRecommendation[] = [
    {
      id: 'rec-1',
      category: 'routine',
      title: 'Inversion Shift',
      description: 'Shift outdoor hours to afternoon',
      timeframe: 'Daily',
      estimatedCostInr: 0,
      impact: {
        pm25ReductionPercent: 30,
        weeklyCo2SavedKg: 2.0,
        monthlySavingsInr: 500,
        directExplanation: 'Avoids ground level smog trap',
      },
    },
    {
      id: 'rec-2',
      category: 'indoor_hack',
      title: 'DIY Purifier',
      description: 'MERV-13 filter with fan',
      timeframe: 'One-time',
      estimatedCostInr: 800,
      impact: {
        pm25ReductionPercent: 50,
        weeklyCo2SavedKg: 1.0,
        monthlySavingsInr: 1000,
        directExplanation: 'Cuts indoor airborne particles by half',
      },
    },
    {
      id: 'rec-3',
      category: 'sustainable_alternative',
      title: 'Metro Transit Swap',
      description: 'Ride metro instead of solo car',
      timeframe: 'Weekly',
      estimatedCostInr: 0,
      impact: {
        pm25ReductionPercent: 20,
        weeklyCo2SavedKg: 15.0,
        monthlySavingsInr: 2500,
        directExplanation: 'Prevents direct tailpipe emissions',
      },
    },
  ];

  it('returns zero impact when zero actions are adopted', () => {
    const result = calculateAggregatedImpact(sampleRecommendations, []);
    expect(result.adoptedCount).toBe(0);
    expect(result.totalCount).toBe(3);
    expect(result.totalPm25ReductionPct).toBe(0);
    expect(result.totalWeeklyCo2SavedKg).toBe(0);
    expect(result.totalMonthlySavingsInr).toBe(0);
    expect(result.communityMultiplier.annualCo2SavedKg).toBe(0);
    expect(result.communityMultiplier.treesEquivalent).toBe(0);
  });

  it('calculates single-action direct metrics accurately', () => {
    const result = calculateAggregatedImpact(sampleRecommendations, ['rec-1']);
    expect(result.adoptedCount).toBe(1);
    expect(result.totalPm25ReductionPct).toBe(30);
    expect(result.totalWeeklyCo2SavedKg).toBe(2.0);
    expect(result.totalMonthlySavingsInr).toBe(500);

    // Community multiplier for 100 households over 52 weeks:
    // 2.0 kg/wk * 52 * 100 = 10,400 kg CO2 / year
    expect(result.communityMultiplier.annualCo2SavedKg).toBe(10400);
    // 10,400 / 21.7 = ~479 trees
    expect(result.communityMultiplier.treesEquivalent).toBeGreaterThan(450);
  });

  it('calculates diminishing returns for multi-action PM2.5 reduction', () => {
    // rec-1 (30%) + rec-2 (50%):
    // Remaining = (1 - 0.3) * (1 - 0.5) = 0.7 * 0.5 = 0.35
    // Reduction = (1 - 0.35) * 100 = 65%
    const result = calculateAggregatedImpact(sampleRecommendations, ['rec-1', 'rec-2']);
    expect(result.totalPm25ReductionPct).toBe(65);
    expect(result.totalWeeklyCo2SavedKg).toBe(3.0);
    expect(result.totalMonthlySavingsInr).toBe(1500);
  });

  it('calculates all actions adopted and bounds cumulative PM2.5 to 92% maximum', () => {
    // 30%, 50%, 20%:
    // Remaining = 0.7 * 0.5 * 0.8 = 0.28
    // Reduction = (1 - 0.28) * 100 = 72%
    const result = calculateAggregatedImpact(sampleRecommendations, ['rec-1', 'rec-2', 'rec-3']);
    expect(result.adoptedCount).toBe(3);
    expect(result.totalPm25ReductionPct).toBe(72);
    expect(result.totalWeeklyCo2SavedKg).toBe(18.0);
    expect(result.totalMonthlySavingsInr).toBe(4000);

    // 18 kg * 52 * 100 = 93,600 kg CO2 / yr
    expect(result.communityMultiplier.annualCo2SavedKg).toBe(93600);
  });

  it('handles invalid or non-existent IDs without throwing errors', () => {
    const result = calculateAggregatedImpact(sampleRecommendations, ['non-existent-id']);
    expect(result.adoptedCount).toBe(0);
    expect(result.totalPm25ReductionPct).toBe(0);
  });
});
