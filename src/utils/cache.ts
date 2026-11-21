/**
 * TTL-based deterministic caching utility using sessionStorage.
 * Reduces redundant Gemini API token usage and latency by caching action plans
 * keyed by normalized household profile attributes and AQI severity buckets.
 */

import { HouseholdProfile, AirQualityTelemetry, PersonalizedActionPlan } from '../types/airQuality';

const DEFAULT_TTL_MS = 15 * 60 * 1000; // 15 minutes

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

// In-memory fallback for environments where sessionStorage is not available (e.g. tests or SSR)
const memoryCache = new Map<string, CacheEntry<unknown>>();

/**
 * Generates a deterministic cache key from the household profile and AQI telemetry.
 */
export function generateCacheKey(
  profile: HouseholdProfile,
  telemetry: AirQualityTelemetry
): string {
  const vulnSorted = [...profile.vulnerabilities].sort().join(',');
  const aqiBucket = Math.floor(telemetry.aqi / 25) * 25; // 25-point AQI buckets
  const normalizedCity = (profile.city || telemetry.city || 'default').toLowerCase().trim();

  return `vayuguard_cache_${normalizedCity}_aqi${aqiBucket}_sev${telemetry.severity}_house${profile.housing}_commute${profile.commute}_fuel${profile.cookingFuel}_vuln[${vulnSorted}]`;
}

/**
 * Retrieves a valid cached item if it exists and has not expired.
 *
 * @param key - Unique cache key
 * @returns Cached data or null if absent/expired
 */
export function getCachedPlan(key: string): PersonalizedActionPlan | null {
  try {
    const raw = typeof window !== 'undefined' && window.sessionStorage
      ? window.sessionStorage.getItem(key)
      : null;

    if (raw) {
      const entry: CacheEntry<PersonalizedActionPlan> = JSON.parse(raw);
      if (Date.now() < entry.expiresAt) {
        return entry.data;
      }
      // Expired: Clean up
      window.sessionStorage.removeItem(key);
    }
  } catch {
    // Session storage read failure; fall back to memory
  }

  const memEntry = memoryCache.get(key) as CacheEntry<PersonalizedActionPlan> | undefined;
  if (memEntry) {
    if (Date.now() < memEntry.expiresAt) {
      return memEntry.data;
    }
    memoryCache.delete(key);
  }

  return null;
}

/**
 * Stores an item in the cache with a specified TTL.
 *
 * @param key - Unique cache key
 * @param data - The PersonalizedActionPlan to store
 * @param ttlMs - Time-to-live in milliseconds (defaults to 15 minutes)
 */
export function setCachedPlan(
  key: string,
  data: PersonalizedActionPlan,
  ttlMs: number = DEFAULT_TTL_MS
): void {
  const expiresAt = Date.now() + ttlMs;
  const entry: CacheEntry<PersonalizedActionPlan> = { data, expiresAt };

  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem(key, JSON.stringify(entry));
    }
  } catch {
    // Quota exceeded or private browsing restriction
  }

  memoryCache.set(key, entry);
}

/**
 * Clears all VayuGuard cache entries from sessionStorage and memory.
 */
export function clearCache(): void {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.sessionStorage.length; i++) {
        const key = window.sessionStorage.key(i);
        if (key && key.startsWith('vayuguard_cache_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => window.sessionStorage.removeItem(k));
    }
  } catch {
    // Ignore storage clear error
  }
  memoryCache.clear();
}
