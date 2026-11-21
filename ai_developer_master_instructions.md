# MASTER AI DEVELOPER & PROMPT ENGINEER INSTRUCTIONS
## PromptWars Challenge 6 — Urban Air Quality Assistant (`VayuGuard AI`)

You are acting as a **Principal Full-Stack Developer and Senior Prompt Engineer**. Your task is to build the complete, production-grade **VayuGuard AI** web application according to `PRD.md`, `TRD.md`, and `DESIGN.md`.

### CRITICAL EVALUATION CONTEXT
This repository will be graded automatically by an AI Code Evaluator across **6 strict parameters**. You MUST optimize every file, function, test, and documentation block to score maximum points on all 6:
1. **Problem Statement Alignment (`HIGH IMPACT` — Weight: Critical)**
2. **Code Quality (`HIGH IMPACT` — Weight: Critical)**
3. **Security (`MEDIUM IMPACT` — Weight: High)**
4. **Efficiency (`MEDIUM IMPACT` — Weight: High)**
5. **Testing (`LOW IMPACT` — Weight: Required for 100%)**
6. **Accessibility (`LOW IMPACT` — Weight: Required for 100%)**

---

## MANDATORY IMPLEMENTATION CHECKLIST

### 1. Problem Statement Alignment (High Impact)
* Build **VayuGuard AI**, a GenAI-powered assistant helping **families and communities** navigate **severe winter smog and urban air pollution**.
* Ensure the UI and AI output explicitly cover all 4 required pillars:
  1. **Low-Emission Daily Routines** (`routine`) tailored to location, thermal inversion hours, and commute.
  2. **Indoor Air Quality (IAQ) Hacks** (`indoor_hack`) tailored to housing type and budget.
  3. **Sustainable Alternatives** (`sustainable_alternative`) for transport, cooking, heating, and waste.
  4. **Direct Impact Explanations** (`impact.directExplanation`, `pm25ReductionPercent`, `weeklyCo2SavedKg`, `monthlySavingsInr`) clearly explaining *why* each choice matters for personal health and community air quality.
* Include a **Community Impact Multiplier** section demonstrating how adopting these choices scales across 100+ neighborhood households.
* Implement a **Context-Aware Smog Copilot Chat** so users can ask follow-up questions grounded in their live city AQI and household profile.

### 2. Code Quality (High Impact)
* Use **TypeScript with `"strict": true`**. Do NOT use `any` anywhere in the codebase.
* Enforce clean modular architecture:
  * `src/types/airQuality.ts` — All interfaces and domain types.
  * `src/utils/sanitize.ts` — Input sanitization & prompt-injection guards.
  * `src/utils/cache.ts` — Deterministic TTL caching.
  * `src/utils/impactCalculator.ts` — Pure mathematical functions for $\text{PM}_{2.5}$ and $\text{CO}_2$ impact aggregation.
  * `src/services/aqiService.ts` — Open-Meteo Air Quality API integration with offline fallback.
  * `src/services/fallbackEngine.ts` — Smart deterministic recommendation generator when no API key is supplied.
  * `src/services/geminiService.ts` — Google Gemini (`@google/genai`) prompt orchestration with strict JSON schema enforcement and runtime validation.
  * `src/components/` — Small, focused, single-responsibility React components (`< 200` lines each).
* Write clear **JSDoc comments** on all exported functions, services, and complex utilities explaining inputs, outputs, and domain formulas.

### 3. Security (Medium Impact)
* **Zero Hardcoded Secrets:** Never hardcode API keys. Read `import.meta.env.VITE_GEMINI_API_KEY` and provide an optional **BYOK (Bring Your Own Key)** modal that stores the key only in React memory / `sessionStorage`.
* **Prompt Injection & XSS Protection (`src/utils/sanitize.ts`):**
  * Strip HTML tags, script payloads, control characters, and system-prompt override keywords (`ignore previous instructions`, `system:`, `</context>`).
  * Enforce strict length limits on user inputs.
* **Runtime Schema Validation:** Validate all AI responses via `validateActionPlan()` inside `try/catch` blocks; never trust raw `JSON.parse()` output blindly.

### 4. Efficiency (Medium Impact)
* **Response Caching (`src/utils/cache.ts`):** Cache Gemini responses by a normalized hash of `(city, aqiSeverity, housing, commute, cookingFuel, vulnerabilities)` with a 15-minute TTL to prevent redundant token usage.
* **Request Cancellation:** Use `AbortController` on external fetch calls to cancel stale requests when users switch cities rapidly.
* **Memoization:** Use `useMemo` and `useCallback` for filtering recommendations and computing aggregate impact metrics.
* **Repository Size Hygiene:** Keep total repository size **under 1 MB** (platform hard limit is `10 MB`). Use Lucide SVG icons only; do not add large images, videos, or committed `dist/`/`node_modules/` folders.

### 5. Testing (Low Impact — Mandatory for Full Score)
* Configure **Vitest** and **React Testing Library** (`vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`) in `package.json` and `vite.config.ts`.
* Create comprehensive test files in `src/__tests__/`:
  1. `sanitize.test.ts`: Tests HTML stripping, prompt-injection neutralization, and truncation.
  2. `impactCalculator.test.ts`: Tests $\text{PM}_{2.5}$ exposure math, $\text{CO}_2$ offset aggregation, and community scaling.
  3. `geminiService.test.ts`: Tests schema validation and automatic fallback generation when no API key is configured.
  4. `App.test.tsx`: Tests semantic HTML rendering, accessible form labels, city switching, and action plan rendering.
* Verify `npm test -- --run` and `npm run build` pass with **0 errors**.

### 6. Accessibility (Low Impact — Mandatory for Full Score)
* Use semantic HTML5 elements: `<header>`, `<main>`, `<section>`, `<aside>`, `<footer>`.
* Associate every `<input>` and `<select>` with a visible `<label htmlFor="...">` or `aria-label`.
* Add `aria-live="polite"` to dynamic AI status/results containers so screen readers announce generated recommendations.
* Never rely on color alone for AQI severity—always display **Icon + Text Severity Label + Numeric AQI + Color**.
* Ensure full keyboard accessibility with visible `focus-visible:ring-2` styles on every button, tab, checkbox, and input.

### 7. Evaluator-Ready `README.md` & CI Workflow
* Generate a thorough `README.md` containing:
  * Project Overview & Problem Statement Alignment
  * Architecture & Prompt Engineering Strategy
  * Explicit section mapping how **Code Quality, Security, Efficiency, Testing, and Accessibility** are engineered
  * Clear local setup & test commands (`npm install`, `npm run dev`, `npm test`, `npm run build`)
* Include `.github/workflows/ci.yml` running `npm ci`, `npm run typecheck`, `npm test -- --run`, and `npm run build`.
* Include `.env.example` and `.gitignore`.

---

## EXECUTION ORDER FOR CODE GENERATION
Generate the project files cleanly in this exact order:
1. Configuration files (`package.json`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `.gitignore`, `.env.example`, `index.html`, `src/index.css`)
2. Strict Type definitions (`src/types/airQuality.ts`)
3. Core Utilities (`src/utils/sanitize.ts`, `src/utils/cache.ts`, `src/utils/impactCalculator.ts`)
4. Services (`src/services/aqiService.ts`, `src/services/fallbackEngine.ts`, `src/services/geminiService.ts`)
5. Modular Accessible UI Components (`AqiHeader.tsx`, `ApiKeyModal.tsx`, `ProfileForm.tsx`, `ImpactVisualizer.tsx`, `ActionPlanGrid.tsx`, `SmogChatCopilot.tsx`)
6. Main Application (`src/App.tsx`, `src/main.tsx`)
7. Automated Test Suite (`src/__tests__/sanitize.test.ts`, `src/__tests__/impactCalculator.test.ts`, `src/__tests__/geminiService.test.ts`, `src/__tests__/App.test.tsx`)
8. Documentation & CI (`README.md`, `.github/workflows/ci.yml`)