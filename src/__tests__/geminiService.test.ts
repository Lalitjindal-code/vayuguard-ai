import { describe, it, expect, beforeEach } from 'vitest';
import { validateActionPlan, generatePersonalizedPlan, askSmogCopilot } from '../services/geminiService';
import { clearCache } from '../utils/cache';
import { HouseholdProfile, AirQualityTelemetry } from '../types/airQuality';

describe('Gemini Service & Dual-Mode Fallback Engine (src/services/geminiService.ts)', () => {
  beforeEach(() => {
    clearCache();
  });

  const testProfile: HouseholdProfile = {
    city: 'Delhi NCR',
    housing: 'apartment',
    vulnerabilities: ['children', 'elderly'],
    commute: 'solo_car',
    cookingFuel: 'lpg_no_exhaust',
    familySize: 4,
    customNotes: 'Toddler has mild asthma',
  };

  const testTelemetry: AirQualityTelemetry = {
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
    isSimulated: true,
  };

  it('validates a well-formed PersonalizedActionPlan with validateActionPlan()', () => {
    const validPlan = {
      summary: 'Personalized high smog plan',
      winterSmogAdvisory: 'Keep windows shut during morning inversion',
      recommendations: [
        {
          id: 'rec-1',
          category: 'routine',
          title: 'Shift Morning Walk',
          description: 'Move walks to afternoon',
          timeframe: 'Daily',
          estimatedCostInr: 0,
          impact: {
            pm25ReductionPercent: 35,
            weeklyCo2SavedKg: 2.0,
            monthlySavingsInr: 0,
            directExplanation: 'Avoids ground-level boundary layer trapping',
          },
        },
        {
          id: 'rec-2',
          category: 'indoor_hack',
          title: 'DIY Box Fan Filter',
          description: 'Attach MERV-13 filter to fan',
          timeframe: 'One-time',
          estimatedCostInr: 750,
          impact: {
            pm25ReductionPercent: 50,
            weeklyCo2SavedKg: 0.5,
            monthlySavingsInr: 800,
            directExplanation: 'Filters ultrafine particles at low cost',
          },
        },
        {
          id: 'rec-3',
          category: 'sustainable_alternative',
          title: 'Metro Carpool Swap',
          description: 'Swap solo car trips with metro',
          timeframe: '3 days/week',
          estimatedCostInr: 0,
          impact: {
            pm25ReductionPercent: 20,
            weeklyCo2SavedKg: 12.0,
            monthlySavingsInr: 1500,
            directExplanation: 'Eliminates commute tailpipe emissions',
          },
        },
      ],
    };

    expect(validateActionPlan(validPlan)).toBe(true);
  });

  it('rejects malformed plans with missing required pillars', () => {
    // Missing 'sustainable_alternative'
    const incompletePlan = {
      summary: 'Incomplete plan',
      winterSmogAdvisory: 'Some advisory',
      recommendations: [
        {
          id: '1',
          category: 'routine',
          title: 'Routine 1',
          description: 'Desc',
          timeframe: 'Daily',
          estimatedCostInr: 0,
          impact: {
            pm25ReductionPercent: 10,
            weeklyCo2SavedKg: 1,
            monthlySavingsInr: 0,
            directExplanation: 'Reason',
          },
        },
        {
          id: '2',
          category: 'indoor_hack',
          title: 'Hack 1',
          description: 'Desc',
          timeframe: 'Daily',
          estimatedCostInr: 0,
          impact: {
            pm25ReductionPercent: 10,
            weeklyCo2SavedKg: 1,
            monthlySavingsInr: 0,
            directExplanation: 'Reason',
          },
        },
      ],
    };

    expect(validateActionPlan(incompletePlan)).toBe(false);
  });

  it('rejects plans with missing or NaN impact metrics', () => {
    const invalidImpactPlan = {
      summary: 'Plan',
      winterSmogAdvisory: 'Advisory',
      recommendations: [
        {
          id: '1',
          category: 'routine',
          title: 'Routine',
          description: 'Desc',
          timeframe: 'Daily',
          estimatedCostInr: 0,
          impact: {
            pm25ReductionPercent: NaN, // Invalid!
            weeklyCo2SavedKg: 1,
            monthlySavingsInr: 0,
            directExplanation: 'Reason',
          },
        },
      ],
    };

    expect(validateActionPlan(invalidImpactPlan)).toBe(false);
  });

  it('automatically runs the deterministic fallback engine when no API key is configured', async () => {
    // Calling without API key should seamlessly produce a valid, tailored plan
    const plan = await generatePersonalizedPlan(testProfile, testTelemetry);

    expect(plan).toBeDefined();
    expect(plan.generatedBy).toBe('deterministic-engine');
    expect(plan.recommendations.length).toBeGreaterThanOrEqual(4);

    // Verify all 3 pillars are present
    const categories = new Set(plan.recommendations.map((r) => r.category));
    expect(categories.has('routine')).toBe(true);
    expect(categories.has('indoor_hack')).toBe(true);
    expect(categories.has('sustainable_alternative')).toBe(true);

    // Verify tailored recommendations based on profile inputs
    // profile has lpg_no_exhaust -> should recommend kitchen exhaust
    const hasExhaustHack = plan.recommendations.some((r) =>
      r.title.toLowerCase().includes('exhaust')
    );
    expect(hasExhaustHack).toBe(true);

    // Verify direct impact explanations exist for all items
    for (const rec of plan.recommendations) {
      expect(rec.impact.directExplanation).toBeTruthy();
      expect(rec.impact.directExplanation.length).toBeGreaterThan(15);
      expect(rec.impact.pm25ReductionPercent).toBeGreaterThan(0);
    }
  });

  it('serves answers for Smog Copilot queries deterministically without an API key', async () => {
    const childReply = await askSmogCopilot('Can my child play outside today?', testProfile, testTelemetry);
    expect(childReply.toLowerCase()).toContain('advisory for children');
    expect(childReply).toContain(testTelemetry.safeVentilationWindow);

    const diyReply = await askSmogCopilot('How do I build a DIY purifier?', testProfile, testTelemetry);
    expect(diyReply).toContain('Corsi-Rosenthal');
    expect(diyReply).toContain('MERV-13');

    const rwaReply = await askSmogCopilot('Give me a WhatsApp message for our RWA to stop burning leaves', testProfile, testTelemetry);
    expect(rwaReply).toContain('WhatsApp Message');
    expect(rwaReply.toLowerCase()).toContain('leaf burning');
  });
});
