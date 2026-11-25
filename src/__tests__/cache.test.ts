import { describe, it, expect, beforeEach, vi } from 'vitest';
import { generateCacheKey, getCachedPlan, setCachedPlan, clearCache } from '../utils/cache';
import { HouseholdProfile, AirQualityTelemetry, PersonalizedActionPlan } from '../types/airQuality';

describe('TTL Cache Utility (src/utils/cache.ts)', () => {
  const mockProfile: HouseholdProfile = {
    city: 'Delhi NCR',
    housing: 'apartment',
    vulnerabilities: ['children', 'respiratory_condition'],
    commute: 'solo_car',
    cookingFuel: 'lpg_with_chimney',
    familySize: 4,
    customNotes: 'Morning school commute',
  };

  const mockTelemetry: AirQualityTelemetry = {
    city: 'Delhi NCR',
    latitude: 28.6139,
    longitude: 77.209,
    aqi: 435,
    pm25: 295,
    pm10: 440,
    severity: 'Severe',
    inversionRisk: 'High',
    safeVentilationWindow: '1:30 PM - 3:30 PM',
    updatedAt: '12:00 PM',
  };

  const mockPlan: PersonalizedActionPlan = {
    summary: 'Test summary for Delhi winter smog',
    winterSmogAdvisory: 'High inversion trap alert',
    recommendations: [
      {
        id: 'rec-1',
        category: 'routine',
        title: 'Midday Shift',
        description: 'Shift activity',
        timeframe: 'Daily',
        estimatedCostInr: 0,
        impact: {
          pm25ReductionPercent: 30,
          weeklyCo2SavedKg: 1.5,
          monthlySavingsInr: 0,
          directExplanation: 'Avoids ground layer smog',
        },
      },
    ],
    generatedBy: 'deterministic-engine',
  };

  beforeEach(() => {
    clearCache();
  });

  it('generates deterministic and normalized cache keys', () => {
    const key1 = generateCacheKey(mockProfile, mockTelemetry);
    const key2 = generateCacheKey(
      { ...mockProfile, vulnerabilities: ['respiratory_condition', 'children'] },
      mockTelemetry
    );
    expect(key1).toBe(key2); // Sorted vulnerabilities should produce identical key
    expect(key1).toContain('delhi ncr');
    expect(key1).toContain('sevSevere');
  });

  it('stores and retrieves items within TTL window', () => {
    const key = generateCacheKey(mockProfile, mockTelemetry);
    setCachedPlan(key, mockPlan, 10000); // 10s TTL

    const cached = getCachedPlan(key);
    expect(cached).not.toBeNull();
    expect(cached?.summary).toBe(mockPlan.summary);
    expect(cached?.recommendations.length).toBe(1);
  });

  it('returns null and purges expired entries when TTL has elapsed', () => {
    const key = generateCacheKey(mockProfile, mockTelemetry);
    const now = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(now);

    setCachedPlan(key, mockPlan, 1000); // 1s TTL

    // Advance time by 2 seconds
    vi.spyOn(Date, 'now').mockReturnValue(now + 2000);

    const cached = getCachedPlan(key);
    expect(cached).toBeNull();

    vi.restoreAllMocks();
  });

  it('clears all cached entries when clearCache is called', () => {
    const key = generateCacheKey(mockProfile, mockTelemetry);
    setCachedPlan(key, mockPlan);
    expect(getCachedPlan(key)).not.toBeNull();

    clearCache();
    expect(getCachedPlan(key)).toBeNull();
  });
});
