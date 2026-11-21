# Technical Requirements Document (TRD)
## Project: VayuGuard AI — Architecture, Security, Performance & Testing Spec

---

## 1. System Architecture Overview

VayuGuard AI follows a **modular, client-first Clean Architecture** built with React 19, TypeScript (Strict Mode), and Vite. This architecture eliminates backend server deployment friction during automated AI evaluation while maintaining strict separation between UI presentation, domain business logic, external telemetry APIs, and Generative AI orchestration.

```text
+-----------------------------------------------------------------------+
|                        UI Layer (React 19 + Tailwind)                 |
|  AqiHeader | ProfileForm | ActionPlanGrid | ImpactVisualizer | Chat   |
+-----------------------------------+-----------------------------------+
                                    |
                    +---------------+---------------+
                    v                               v
+-----------------------------------+   +-------------------------------+
|     Service Layer (src/services)  |   |   Utility Layer (src/utils)   |
| - aqiService.ts (Open-Meteo API)  |   | - sanitize.ts (Anti-Injection)|
| - geminiService.ts (GenAI + Schema|   | - cache.ts (TTL Memo Cache)   |
|   + Deterministic Fallback Engine)  |   | - impactCalculator.ts (Math)  |
+-----------------------------------+   +-------------------------------+
```

---

## 2. Technology Stack & Repository Footprint Budget
* **Language:** TypeScript `^5.6` (`"strict": true`, `"noUnusedLocals": true`, `"noImplicitAny": true`)
* **UI Framework:** React `^19.0` + Vite `^6.0`
* **Styling & Icons:** Tailwind CSS `^3.4` + `lucide-react` (Tree-shaken SVG icons only)
* **GenAI SDK:** `@google/genai` (`gemini-2.5-flash` with JSON Schema enforcement)
* **Testing:** `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
* **Repository Size Target:** `< 450 KB` total tracked source code (strictly compliant with PromptWars `< 10 MB` limit; no binary videos, large PNGs, or committed build artifacts).

---

## 3. Directory & File Structure

```text
vayuguard-ai/
├── .github/
│   └── workflows/
│       └── ci.yml                    # Runs lint, typecheck, unit tests, and production build
├── src/
│   ├── components/
│   │   ├── AqiHeader.tsx             # Live AQI telemetry, city switcher, inversion alert
│   │   ├── ApiKeyModal.tsx           # Optional BYOK (Bring Your Own Key) session modal
│   │   ├── ProfileForm.tsx           # Household & lifestyle context configuration
│   │   ├── ActionPlanGrid.tsx        # Tabbed/categorized cards with Direct Impact boxes
│   │   ├── ImpactVisualizer.tsx      # Interactive checklist + PM2.5 / CO2 impact metrics
│   │   └── SmogChatCopilot.tsx       # Context-aware conversational GenAI assistant
│   ├── services/
│   │   ├── aqiService.ts             # Open-Meteo Geocoding & Air Quality API + fallback
│   │   ├── geminiService.ts          # Prompt builder, Gemini API client, schema guard & fallback
│   │   └── fallbackEngine.ts         # Deterministic context-aware generator when offline/no-key
│   ├── types/
│   │   └── airQuality.ts             # Strict TypeScript interfaces & enums
│   ├── utils/
│   │   ├── sanitize.ts               # Input sanitization & prompt-injection defense
│   │   ├── cache.ts                  # TTL-based session cache with deterministic hashing
│   │   └── impactCalculator.ts       # Scientific PM2.5 exposure & CO2 offset formulas
│   ├── __tests__/
│   │   ├── sanitize.test.ts          # Security & prompt-injection test suite
│   │   ├── impactCalculator.test.ts  # Mathematical accuracy test suite
│   │   ├── geminiService.test.ts     # Schema validation & fallback engine tests
│   │   └── App.test.tsx              # Accessibility, rendering, and user flow tests
│   ├── App.tsx                       # Root layout with semantic landmarks & state orchestration
│   ├── main.tsx                      # Entry point
│   └── index.css                     # Tailwind directives + custom focus-visible utilities
├── .env.example                      # Template: VITE_GEMINI_API_KEY=your_key_here
├── .gitignore                        # Ignores node_modules, dist, .env, coverage
├── index.html                        # Accessible HTML5 shell with proper title & lang="en"
├── package.json                      # Clean scripts: dev, build, test, lint, typecheck
├── tsconfig.json                     # Strict TypeScript configuration
└── README.md                         # Comprehensive evaluator-ready documentation
```

---

## 4. Data Contracts & TypeScript Interfaces (`src/types/airQuality.ts`)

```typescript
export type AqiSeverity = 'Good' | 'Moderate' | 'Poor' | 'Severe';

export type HousingType = 'apartment' | 'independent_house' | 'roadside_home';
export type CommuteMode = 'solo_car' | 'two_wheeler' | 'public_transit' | 'ev_or_wfh';
export type CookingFuel = 'lpg_with_chimney' | 'lpg_no_exhaust' | 'electric_induction' | 'biomass_coal';
export type VulnerabilityGroup = 'children' | 'elderly' | 'respiratory_condition' | 'none';

export interface AirQualityTelemetry {
  city: string;
  latitude: number;
  longitude: number;
  aqi: number;
  pm25: number;
  pm10: number;
  severity: AqiSeverity;
  inversionRisk: 'Low' | 'Moderate' | 'High';
  safeVentilationWindow: string;
  updatedAt: string;
  isSimulated?: boolean;
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

export interface ActionRecommendation {
  id: string;
  category: 'routine' | 'indoor_hack' | 'sustainable_alternative';
  title: string;
  description: string;
  timeframe: string;
  estimatedCostInr: number;
  /** Direct impact metrics mandated by Problem Statement */
  impact: {
    pm25ReductionPercent: number;
    weeklyCo2SavedKg: number;
    monthlySavingsInr: number;
    directExplanation: string;
  };
}

export interface PersonalizedActionPlan {
  summary: string;
  winterSmogAdvisory: string;
  recommendations: ActionRecommendation[];
  generatedBy: 'gemini-ai' | 'deterministic-engine';
}
```

---

## 5. Prompt Engineering & GenAI Orchestration (`src/services/geminiService.ts`)

### 5.1 System Prompt Architecture
* **Role Definition:** Environmental Health Engineer & Urban Air Quality Specialist for South Asian winter smog conditions.
* **Grounding Context:** Injects live $\text{PM}_{2.5}$, $\text{PM}_{10}$, AQI severity, housing type, family vulnerabilities, commute mode, and cooking fuel inside XML-delimited `<context>` tags so user text cannot override system rules.
* **Structured Output Enforcement:** Uses Gemini `responseSchema` to guarantee every response contains balanced items across all 3 required categories (`routine`, `indoor_hack`, `sustainable_alternative`) and non-empty `impact.directExplanation` strings.

### 5.2 Dual-Mode Resilience (Zero-Failure Guarantee)
1. **Live GenAI Mode:** Activated when `VITE_GEMINI_API_KEY` is present in `.env` or entered via the UI's session-only API Key modal.
2. **Context-Aware Deterministic Fallback Engine (`fallbackEngine.ts`):** If the automated evaluator runs the app without providing an API key, `geminiService.ts` seamlessly routes to `fallbackEngine.ts`, which dynamically tailors routines, IAQ hacks, sustainable swaps, and impact math based on the user's exact inputs (e.g., recommending chimney/exhaust upgrades if `lpg_no_exhaust` is selected, or metro/carpool shifts if `solo_car` is selected).

---

## 6. Security, Efficiency, Testing & Accessibility Specifications

### 6.1 Security Implementation
* **Zero Secret Exposure:** `.env` is strictly excluded in `.gitignore`. API keys entered in the UI are held in React `useState` / `sessionStorage` only—never `localStorage` or console logs.
* **Prompt Injection Defense (`src/utils/sanitize.ts`):**
  * Strips HTML/script tags (`<[^>]*>`), control characters, and delimiter escape tokens (`</context>`, `SYSTEM:`, `IGNORE PREVIOUS INSTRUCTIONS`).
  * Caps free-text input length at `200` characters.
* **Response Validation:** Every JSON payload returned by Gemini is verified via `isValidActionPlan()` runtime type guard before state hydration.

### 6.2 Efficiency & Performance
* **TTL Cache (`src/utils/cache.ts`):** Generates a deterministic key `vayu_${city}_${aqiBucket}_${profileHash}`. Identical requests return in `< 2ms` without hitting the Gemini API.
* **Request Cancellation:** Uses `AbortController` inside `useEffect` / async handlers so rapid city switching aborts in-flight network requests cleanly.
* **Memoized Aggregations:** `useMemo` computes total $\text{PM}_{2.5}$ reduction, $\text{CO}_2$ offsets, and community multiplier metrics only when selected action IDs change.

### 6.3 Testing Strategy (`npm test`)
* `sanitize.test.ts`: Verifies XSS stripping, prompt-injection phrase neutralization, and max-length truncation.
* `impactCalculator.test.ts`: Verifies $\text{PM}_{2.5}$ exposure math, $\text{CO}_2$ emission offsets, and community scaling edge cases (0 actions selected, maximum actions selected).
* `geminiService.test.ts`: Verifies schema guard rejection of malformed JSON and automatic fallback execution when API key is absent.
* `App.test.tsx`: Verifies semantic landmarks, form label associations, keyboard navigation, and end-to-end plan generation rendering.

### 6.4 Accessibility (WCAG 2.1 AA)
* Semantic landmarks: `<header>`, `<main>`, `<section>`, `<aside>`, `<footer>`.
* Screen reader live announcements: `aria-live="polite"` on AI plan generation status and chat responses.
* Multi-modal severity indicators: AQI badges always render **Icon + Severity Word (`Severe`, `Poor`, `Moderate`, `Good`) + Numeric AQI + Color**, ensuring full usability for color-blind users.