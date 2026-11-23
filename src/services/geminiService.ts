/**
 * Google Gemini GenAI service for VayuGuard AI.
 * Uses @google/genai (gemini-2.5-flash) with structured JSON schemas
 * and runtime schema validation, backed by the deterministic fallback engine.
 */

import { GoogleGenAI, Type } from '@google/genai';
import {
  HouseholdProfile,
  AirQualityTelemetry,
  PersonalizedActionPlan,
  ActionRecommendation,
} from '../types/airQuality';
import { sanitizeInput } from '../utils/sanitize';
import { generateCacheKey, getCachedPlan, setCachedPlan } from '../utils/cache';
import { generateDeterministicPlan, getDeterministicChatReply } from './fallbackEngine';

/**
 * Runtime schema validator to verify raw LLM outputs match the PersonalizedActionPlan contract.
 * Protects against hallucinated structures or missing direct-impact fields.
 */
export function validateActionPlan(data: unknown): data is PersonalizedActionPlan {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const plan = data as Record<string, unknown>;

  if (typeof plan.summary !== 'string' || plan.summary.trim().length === 0) {
    return false;
  }
  if (typeof plan.winterSmogAdvisory !== 'string' || plan.winterSmogAdvisory.trim().length === 0) {
    return false;
  }
  if (!Array.isArray(plan.recommendations) || plan.recommendations.length < 3) {
    return false;
  }

  const categoriesFound = new Set<string>();

  for (const item of plan.recommendations) {
    if (!item || typeof item !== 'object') return false;
    const rec = item as Partial<ActionRecommendation>;

    if (!rec.id || typeof rec.id !== 'string') return false;
    if (!rec.title || typeof rec.title !== 'string') return false;
    if (!rec.description || typeof rec.description !== 'string') return false;
    if (!rec.category || !['routine', 'indoor_hack', 'sustainable_alternative'].includes(rec.category)) {
      return false;
    }
    categoriesFound.add(rec.category);

    const impact = rec.impact;
    if (!impact || typeof impact !== 'object') return false;
    if (typeof impact.pm25ReductionPercent !== 'number' || isNaN(impact.pm25ReductionPercent)) return false;
    if (typeof impact.weeklyCo2SavedKg !== 'number' || isNaN(impact.weeklyCo2SavedKg)) return false;
    if (typeof impact.monthlySavingsInr !== 'number' || isNaN(impact.monthlySavingsInr)) return false;
    if (typeof impact.directExplanation !== 'string' || impact.directExplanation.trim().length === 0) {
      return false;
    }
  }

  // Must cover all 3 mandatory pillars: routine, indoor_hack, sustainable_alternative
  return (
    categoriesFound.has('routine') &&
    categoriesFound.has('indoor_hack') &&
    categoriesFound.has('sustainable_alternative')
  );
}

/**
 * Resolves the effective Gemini API key from the BYOK argument or the environment variable.
 * Centralised to avoid DRY violations across multiple async service functions.
 */
function resolveApiKey(userApiKey?: string): string | undefined {
  return (
    userApiKey?.trim() ||
    (typeof import.meta !== 'undefined' && import.meta.env
      ? (import.meta.env.VITE_GEMINI_API_KEY as string | undefined)?.trim()
      : undefined)
  );
}

/**
 * Builds the XML-grounded context block for prompt injection defense.
 */
function buildContextPrompt(profile: HouseholdProfile, telemetry: AirQualityTelemetry): string {
  const sanitizedNotes = sanitizeInput(profile.customNotes || '', 200);

  return `
<context>
CITY: ${telemetry.city}
CURRENT_AQI: ${telemetry.aqi} (${telemetry.severity})
PM2_5_LEVEL: ${telemetry.pm25} µg/m³
PM10_LEVEL: ${telemetry.pm10} µg/m³
INVERSION_RISK: ${telemetry.inversionRisk}
SAFE_VENTILATION_WINDOW: ${telemetry.safeVentilationWindow}

HOUSEHOLD_PROFILE:
Housing Type: ${profile.housing}
Family Size: ${profile.familySize}
Vulnerabilities: ${profile.vulnerabilities.join(', ') || 'None'}
Primary Commute: ${profile.commute}
Cooking & Heating Fuel: ${profile.cookingFuel}
Specific Family Context: ${sanitizedNotes || 'Standard urban residence'}
</context>
`.trim();
}

/**
 * Generates a personalized winter smog action plan via Gemini or deterministic fallback.
 * Checks the TTL cache first to prevent redundant API token calls.
 */
export async function generatePersonalizedPlan(
  profile: HouseholdProfile,
  telemetry: AirQualityTelemetry,
  userApiKey?: string
): Promise<PersonalizedActionPlan> {
  // 1. Check TTL Cache
  const cacheKey = generateCacheKey(profile, telemetry);
  const cached = getCachedPlan(cacheKey);
  if (cached) {
    return cached;
  }

  // 2. Resolve API key from argument or environment (DRY: uses shared resolveApiKey helper)
  const effectiveKey = resolveApiKey(userApiKey);

  // If no API key is provided, execute deterministic context engine
  if (!effectiveKey) {
    const fallbackPlan = generateDeterministicPlan(profile, telemetry);
    setCachedPlan(cacheKey, fallbackPlan);
    return fallbackPlan;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: effectiveKey });
    const contextPrompt = buildContextPrompt(profile, telemetry);

    const systemInstruction = `
You are the Chief Environmental Health Engineer for VayuGuard AI, specialized in South Asian winter atmospheric inversion and urban PM2.5 mitigation.
Your task is to analyze the user's family and environmental telemetry in <context> and generate a structured JSON action plan.

MANDATORY RULES:
1. Cover ALL 3 required pillars with 2-3 specific, high-craft recommendations each:
   - 'routine': Low-Emission Daily Routines (inversion-aware timing, wet-mopping dust suppression, commute trip-chaining).
   - 'indoor_hack': Indoor Air Quality Hacks (diurnal ventilation window, DIY Corsi-Rosenthal filter, sealing drafts, cooking exhaust).
   - 'sustainable_alternative': Sustainable Alternatives (electric/metro transit swaps, clean heating, leaf composting).
2. For EVERY recommendation, you MUST provide precise numeric metrics and a plain-language 'directExplanation' explaining exactly why this action cuts lung exposure and local smog.
3. Keep timeframe practical and cost in Indian Rupees (INR).
4. Strictly return valid JSON matching the requested schema.
`.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${contextPrompt}\n\nGenerate the complete personalized winter smog action plan now in JSON.`,
            },
          ],
        },
      ],
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            winterSmogAdvisory: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  category: {
                    type: Type.STRING,
                    enum: ['routine', 'indoor_hack', 'sustainable_alternative'],
                  },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  timeframe: { type: Type.STRING },
                  estimatedCostInr: { type: Type.NUMBER },
                  impact: {
                    type: Type.OBJECT,
                    properties: {
                      pm25ReductionPercent: { type: Type.NUMBER },
                      weeklyCo2SavedKg: { type: Type.NUMBER },
                      monthlySavingsInr: { type: Type.NUMBER },
                      directExplanation: { type: Type.STRING },
                    },
                    required: [
                      'pm25ReductionPercent',
                      'weeklyCo2SavedKg',
                      'monthlySavingsInr',
                      'directExplanation',
                    ],
                  },
                },
                required: [
                  'id',
                  'category',
                  'title',
                  'description',
                  'timeframe',
                  'estimatedCostInr',
                  'impact',
                ],
              },
            },
          },
          required: ['summary', 'winterSmogAdvisory', 'recommendations'],
        },
      },
    });

    const rawText = response.text?.trim() || '{}';
    const parsed = JSON.parse(rawText);

    if (validateActionPlan(parsed)) {
      const validatedPlan: PersonalizedActionPlan = {
        ...parsed,
        generatedBy: 'gemini-ai',
      };
      setCachedPlan(cacheKey, validatedPlan);
      return validatedPlan;
    }

    // Schema validation failed, fallback seamlessly
    const fallback = generateDeterministicPlan(profile, telemetry);
    setCachedPlan(cacheKey, fallback);
    return fallback;
  } catch {
    // API error, network failure, or invalid key -> seamless fallback
    const fallback = generateDeterministicPlan(profile, telemetry);
    setCachedPlan(cacheKey, fallback);
    return fallback;
  }
}

/**
 * Handles conversational inquiries in the Smog Chat Copilot.
 */
export async function askSmogCopilot(
  question: string,
  profile: HouseholdProfile,
  telemetry: AirQualityTelemetry,
  userApiKey?: string
): Promise<string> {
  const sanitized = sanitizeInput(question, 300);
  if (!sanitized) {
    return 'Please enter a question regarding winter smog, indoor air quality, or low-emission routines.';
  }

  const effectiveKey = resolveApiKey(userApiKey);

  if (!effectiveKey) {
    return getDeterministicChatReply(sanitized, profile, telemetry);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: effectiveKey });
    const contextPrompt = buildContextPrompt(profile, telemetry);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${contextPrompt}\n\nUSER QUESTION: ${sanitized}\n\nProvide an empathetic, scientifically rigorous, and highly actionable response tailored to this household's air quality context and vulnerable members. Use markdown bullet points where appropriate.`,
            },
          ],
        },
      ],
    });

    return response.text?.trim() || getDeterministicChatReply(sanitized, profile, telemetry);
  } catch {
    return getDeterministicChatReply(sanitized, profile, telemetry);
  }
}
