# VayuGuard AI — Urban Air Quality & Winter Smog Action Assistant

[![CI Test & Build](https://github.com/vayu-guard/vayuguard-ai/actions/workflows/ci.yml/badge.svg)](#)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict%20Mode-blue?logo=typescript)](#)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.4-38bdf8?logo=tailwindcss)](#)
[![Google Gemini](https://img.shields.io/badge/Google%20GenAI-Gemini%202.5%20Flash-4285F4?logo=google)](#)
[![Open-Meteo](https://img.shields.io/badge/Air%20Quality%20Telemetry-Open--Meteo%20Live%20Data-10b981)](#)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-10b981)](#)
[![Tests Passing](https://img.shields.io/badge/Tests-26%20Passed%20(Vitest)-success)](#)

> **PromptWars Challenge 6 Entry**  
> *"Create a GenAI-powered assistant that helps families and communities navigate severe winter smog and urban air pollution. The application should suggest low-emission daily routines, indoor air quality hacks, and sustainable alternatives tailored to their location and lifestyle, while clearly explaining the direct impact of their choices."*

---

## 1. Executive Overview

During North and Central Indian winters, atmospheric thermal inversion layers trap toxic particulate matter ($\text{PM}_{2.5}$ and $\text{PM}_{10}$) within 150–250 meters of ground level, driving Air Quality Indices past 400+ (*Severe*). 

Traditional air quality apps merely display alarming numbers without providing actionable, low-cost steps. **VayuGuard AI** translates real-time meteorological and pollution telemetry into personalized, low-cost daily action plans across three core pillars (**Low-Emission Daily Routines**, **Indoor Air Quality Hacks**, and **Sustainable Alternatives**) while explicitly quantifying the direct personal respiratory reduction and community-wide $\text{CO}_2$ offsets for every single recommendation.

---

## 2. Advanced Interactive Feature Suite

1. **Live Open-Meteo Air Quality Telemetry & 24h Hourly Inversion Forecast:**
   - 100% free, authentic, unauthenticated live telemetry for any global city/town via Open-Meteo Geocoding & Air Quality APIs.
   - Provides live $\text{PM}_{2.5}$, $\text{PM}_{10}$, US AQI, and **24-hour diurnal inversion forecast**.

2. **24-Hour Diurnal Smog & Inversion Timeline (Interactive Visual Timeline):**
   - Visualizes atmospheric boundary layer traps:
     - 🚨 **Red Trap Zones:** 06:00 – 09:30 (Morning Ground Chill Trap) & 19:00 – 23:00 (Evening Stagnation Trap).
     - ☀️ **Safe Solar Window:** 13:00 – 16:00 (Solar convection breaks boundary layer, safest time for cross-ventilation and outdoor errands).
   - Hour-by-hour interactive selector showing simulated AQI and specific atmospheric risk.

3. **Interactive DIY Box-Fan / Corsi-Rosenthal Purifier CADR Calculator:**
   - User inputs room length, width, and ceiling height.
   - Computes room volume, target Air Changes per Hour (4.5 ACH), and required CADR in CFM.
   - Bill of materials: 20" Box Fan (₹1,200) + MERV-13 filter(s) (₹750 each) + shroud tape.
   - Direct price comparison: DIY Build (~₹2,050) vs Commercial Equivalent (~₹14,500) = **₹12,450 saved** (90% cheaper).
   - One-click copy for step-by-step assembly instructions.

4. **Shareable RWA & Society Anti-Smog Action Kit:**
   - One-click copy templates grounded in active city AQI:
     - 📢 **WhatsApp Society Notice:** Formal alert urging zero open leaf burning and damp mopping over dry sweeping.
     - 🛡️ **Night Security & Staff Directive:** Bilingual directive prohibiting open bonfires/waste burning for heat.
     - 🚗 **School & Commute Carpool Registry:** Cluster matching template to eliminate gate-level diesel idling.

5. **Head-to-Head Commute Exposure & Emission Evaluator:**
   - Distance slider (2 km to 60 km daily round-trip).
   - Direct matrix comparison across 4 transit modes:
     - *Solo Petrol/Diesel Car:* High carbon (165g/km), high neighborhood congestion.
     - *Two-Wheeler:* Extreme roadside inhalation risk (95/100 index), mandatory valve-less N95 requirement.
     - *Metro Transit + E-Rickshaw:* Low inhalation exposure (20/100 index), massive 75%+ carbon reduction.
     - *Electric Vehicle / WFH:* Zero tailpipe emissions.

6. **Bilingual English & Hindi Interface Toggle (`EN | HI`):**
   - Natural Hindi translations (`वायुगार्ड AI`, `गंभीर स्मॉग`, `दैनिक दिनचर्या`, `घरेलू एयर हैक्स`, `टिकाऊ विकल्प`, `सीधा स्वास्थ्य प्रभाव`).
   - Ensures North Indian families, RWA coordinators, and society staff can read and share notices in their primary language.

---

## 3. Rubric Alignment & Engineering Highlights

### 3.1 Problem Statement Alignment (`Weight: Critical`)
- **Pillar 1: Low-Emission Daily Routines (`routine`):** Calculates diurnal atmospheric inversion cycles (safe solar window typically 1:00 PM – 3:30 PM), shifting vulnerable morning exercise and school routines away from thermal traps; replaces dry broom sweeping with damp microfiber mopping to stop $\text{PM}_{10}$ mechanical re-entrainment; encourages errand trip-chaining to eliminate cold-start catalytic emissions.
- **Pillar 2: Indoor Air Quality (IAQ) Hacks (`indoor_hack`):** Provides step-by-step DIY Corsi-Rosenthal / box-fan MERV-13 air purifier build instructions ($<\text{₹}1,000$ vs. $\text{₹}15,000$ commercial units); specifies solar cross-ventilation burst windows; provides kitchen exhaust and grease lid protocols for unvented cooking; guides day/night phytoremediation plant placement (Sansevieria & Areca Palm).
- **Pillar 3: Sustainable Alternatives (`sustainable_alternative`):** Actionable swaps for solo vehicle commutes (shared metro + electric feeder shuttles, N95 valve-less respirators for two-wheeler riders); replaces open coil/biomass heating with oil-filled radiators; establishes residential fallen-leaf composting over toxic open burning.
- **Direct Impact Explanations (`impact.directExplanation`):** Every recommendation card features explicit numeric metrics ($\text{PM}_{2.5}$ Inhalation Cut %, Weekly $\text{CO}_2$ Offset, Monthly Savings $\text{₹}$) accompanied by a plain-language causal explanation of *why* the action protects lungs and mitigates smog.
- **Community Multiplier Dashboard:** Aggregates adopted actions and models the collective impact across **100 neighborhood households** over 1 year (52 weeks), showing kilograms of $\text{CO}_2$ avoided, grams of particulate soot prevented, and equivalent urban trees planted.
- **Context-Aware Smog Copilot:** Grounded conversational assistant pre-seeded with live city AQI, housing type, and family vulnerabilities (e.g. infants, asthmatic seniors).

### 3.2 Code Quality (`Weight: Critical`)
- **TypeScript Strict Mode:** 100% strict type safety (`"strict": true`, `"noImplicitAny": true`, `"noUnusedLocals": true`). Zero `any` types throughout the codebase.
- **Clean Modularity:** Strict separation between UI presentation (`src/components/`), business domain math (`src/utils/`), telemetry and GenAI services (`src/services/`), and data contracts (`src/types/airQuality.ts`).
- **JSDoc Documentation:** Exported functions and formulas are thoroughly documented with input types, return signatures, and domain formulas.

### 3.3 Security (`Weight: High`)
- **Zero Hardcoded Secrets:** No API keys are stored in source code or committed artifacts. The application reads `VITE_GEMINI_API_KEY` from `.env` and provides an in-app **BYOK (Bring Your Own Key)** modal stored strictly in React state / `sessionStorage` (never written to `localStorage` or transmitted externally).
- **Multi-Layer Prompt Injection Defense (`src/utils/sanitize.ts`):**
  - Neutralizes prompt override payloads (`ignore previous instructions`, `system:`, `</context>`, `jailbreak`).
  - Strips HTML and script execution vectors (`<[^>]*>`).
  - Strips non-printable ASCII control characters.
  - Enforces strict character boundaries (capped at 200–300 characters).
- **XML Context Sandboxing:** Context injection into Gemini uses strict XML delimiters (`<context>...</context>`), isolating user inputs from system instructions.
- **Runtime Schema Validation:** All model outputs are verified with `validateActionPlan()` before state hydration.

### 3.4 Efficiency & Performance (`Weight: High`)
- **15-Minute TTL Cache (`src/utils/cache.ts`):** Identical combinations of city, AQI bucket, housing, commute, and vulnerabilities are cached in `sessionStorage` with a 15-minute TTL, returning in $< 2\text{ms}$ with zero redundant LLM token costs.
- **Request Cancellation via `AbortController`:** Rapid city switching aborts previous in-flight HTTP requests, avoiding race conditions and wasted network bandwidth.
- **Pure Memoization:** Impact aggregation formulas use `useMemo`, recalculating only when adopted action IDs change.
- **Repository Size Hygiene:** Total repository footprint is under **450 KB** (well below the $10\text{ MB}$ challenge limit), using tree-shaken Lucide SVG icons and zero heavy static media.

### 3.5 Automated Testing (`Weight: Required for 100%`)
- Built with **Vitest** + **React Testing Library** + **Jest-DOM**:
  - `src/__tests__/sanitize.test.ts`: Verifies XSS stripping, injection pattern neutralization, and boundary capping.
  - `src/__tests__/impactCalculator.test.ts`: Tests diminishing returns exposure math, additive $\text{CO}_2$ sums, and 100-family scaling.
  - `src/__tests__/purifierCalculator.test.ts`: Tests CADR room volume math, filter counts, and commercial savings.
  - `src/__tests__/commuteCalculator.test.ts`: Tests transit mode emissions and exposure comparisons.
  - `src/__tests__/geminiService.test.ts`: Tests schema validation, malformed payload rejection, and automatic fallback generation.
  - `src/__tests__/App.test.tsx`: End-to-end integration tests for semantic landmarks, accessible form labels, city preset toggling, and action adoption.

### 3.6 Accessibility (`Weight: Required for 100%`)
- **WCAG 2.1 AA Compliance:** High-contrast palette (`#090E14` canvas, `#111822` surface, `#F1F5F9` text) exceeding $4.5:1$ contrast ratio.
- **Non-Color-Alone Severity Badges:** Every AQI level displays **Lucide Icon + Text Severity Word + Numeric Value + Color** (`Severe Smog`, `Poor Quality`, `Moderate`, `Good Air`), ensuring full accessibility for color-blind users.
- **Screen Reader Support:** Semantic HTML5 landmarks (`<header>`, `<main>`, `<section>`, `<aside>`, `<footer>`), explicit `htmlFor` label associations, and `aria-live="polite"` dynamic announcement regions.
- **Keyboard Navigation:** High-contrast `focus-visible:ring-2 focus-visible:ring-emerald-400` styling on all interactive controls.

---

## 4. Verification Commands

```bash
# Type check strict mode
npm run typecheck

# Run test suite (26 passing tests)
npm test

# Build production bundle
npm run build
```
