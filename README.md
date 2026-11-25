# VayuGuard AI — Urban Air Quality & Winter Smog Action Assistant

[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict%20Mode-3178C6?logo=typescript&logoColor=white)](#)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](#)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.4-38BDF8?logo=tailwindcss&logoColor=white)](#)
[![Google Gemini](https://img.shields.io/badge/Google%20GenAI-Gemini%202.5%20Flash-4285F4?logo=google&logoColor=white)](#)
[![CPCB NAQI](https://img.shields.io/badge/Standard-Indian%20CPCB%20NAQI-10B981)](#)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-10B981)](#)
[![Tests Passing](https://img.shields.io/badge/Tests-51%20Passed%20(Vitest)-22C55E)](#)

> **PromptWars Challenge 6 Entry**  
> *"Create a GenAI-powered assistant that helps families and communities navigate severe winter smog and urban air pollution. The application should suggest low-emission daily routines, indoor air quality hacks, and sustainable alternatives tailored to their location and lifestyle, while clearly explaining the direct impact of their choices."*

---

## 1. Executive Overview

During North and Central Indian winters, nocturnal radiative cooling compresses the atmospheric boundary layer to **130–200 meters**, trapping toxic $\text{PM}_{2.5}$ and $\text{PM}_{10}$ near breathing height and driving Air Quality Indices past **400+ (Severe)**.

Traditional weather apps stop at alarming red numbers without offering actionable, low-cost guidance. **VayuGuard AI** translates live meteorological and pollutant telemetry into hyper-localized daily action plans across three mandatory pillars:
1. **Low-Emission Daily Routines** (`routine`)
2. **Indoor Air Quality (IAQ) Hacks** (`indoor_hack`)
3. **Sustainable Alternatives** (`sustainable_alternative`)

Every recommendation quantifies personal respiratory exposure reduction, weekly $\text{CO}_2$ offsets, monthly INR savings, and a plain-language causal explanation (`directExplanation`).

---

## 2. Core Feature Suite

### 2.1 Live Telemetry & Official Indian CPCB NAQI Engine
* Fetches real-time $\text{PM}_{2.5}$ and $\text{PM}_{10}$ readings for any global city via **Open-Meteo Geocoding & Air Quality APIs** (with `AbortController` request cancellation and graceful offline presets for Delhi NCR, Bhopal, Mumbai, and Bengaluru).
* Computes official **Indian National Air Quality Index (CPCB / MoEFCC Gazette 2014)** linear interpolation sub-indices (`calculateIndianCpcbAqi`) instead of relying solely on US AQI scales.

### 2.2 Diurnal Boundary Layer Inversion & Ventilation Timeline
* Interactive 24-hour cubic Bezier spline graph mapping atmospheric mixing height (`130m` nocturnal trap vs. `1,250m` afternoon solar convection).
* Highlights **Morning & Evening Trap Zones** (`06:00–09:30 AM`, `19:00–23:00 PM`) versus the **Safe Solar Ventilation Window** (`1:30–3:30 PM`).
* Full **WCAG 2.1 AA Slider Semantics** (`role="slider"`, `aria-valuetext`, `ArrowLeft`/`ArrowRight`/`Home`/`End` keyboard scrubbing) alongside pointer/touch scrubbing.

### 2.3 Household Context Profiler & Custom Neo-Brutalist Controls
* Custom-built accessible dropdowns (`NeoSelect`) replacing OS-native select popovers with dark glass styling and full keyboard navigation.
* Multi-select vulnerability profiling (**Infants/Toddlers**, **Elderly 60+**, **Asthma/Bronchitis**, **Healthy Adults**), housing elevation, commute mode, and indoor cooking/heating fuel.
* Paired with a sticky **Daily Smog Defense Tracker** (`5` essential household habits with live shield percentage) that tracks cleanly below the header.

### 2.4 Quantified Direct Impact & Berkeley Earth Equivalence
* Models cumulative $\text{PM}_{2.5}$ inhalation reduction using diminishing-returns math (`calculateAggregatedImpact`), capped realistically at 92%.
* Translates ambient $\text{PM}_{2.5}$ into **Berkeley Earth Cigarette Inhalation Equivalence** ($22\ \mu\text{g/m}^3 \approx 1\text{ cigarette/day}$), showing exact daily cigarettes avoided.
* **Community Multiplier:** Scales household adoption across **100 neighborhood families over 52 weeks** (annual $\text{CO}_2$ saved, particulate soot avoided, and equivalent urban trees planted).
* One-click **WhatsApp Share** on every action card.

### 2.5 Full-Width Context-Aware Smog Copilot (`gemini-2.5-flash`)
* Dual-mode GenAI pipeline: uses **Google Gemini 2.5 Flash** with strict JSON schema validation (`validateActionPlan`) when a key is active, and seamlessly falls back to a **deterministic context engine** offline or without a key.
* Supports **BYOK (Bring Your Own Key)** stored strictly in React memory / `sessionStorage` with show/hide key toggle and format hints.

### 2.6 Community & Engineering Toolkits (Modals)
* **DIY Box-Fan / Corsi-Rosenthal Purifier Calculator:** Computes room volume, `4.5 ACH` target CADR in CFM, MERV-13 filter count, and cost savings (~₹2,050 DIY vs ₹14,500 commercial).
* **Shareable RWA & Society Action Kit:** Bilingual (`EN | HI`) one-click copy templates for WhatsApp society notices, night security bonfire bans, and school carpool registries.
* **Head-to-Head Commute Exposure & Emission Evaluator:** Interactive `2–60 km` slider comparing Solo Car, Two-Wheeler, Metro + E-Rickshaw, and EV/WFH.
* All modals support `Escape` key dismissal (`useEscapeKey`) and resilient clipboard fallbacks (`copyToClipboard`).

---

## 3. Architecture & Project Structure

```text
src/
├── __tests__/               # 15 Vitest + React Testing Library suites (51 passing tests)
├── components/
│   ├── ActionPlanGrid.tsx   # Categorized recommendations, micro-tags, WhatsApp sharing
│   ├── ApiKeyModal.tsx      # BYOK Gemini key modal with mask toggle & zero-localStorage policy
│   ├── AqiHeader.tsx        # Two-tier sticky telemetry bar, city search, EN/HI switcher
│   ├── CommuteCompareModal.tsx
│   ├── DailyDefenseChecklist.tsx
│   ├── ErrorBoundary.tsx    # Top-level React error boundary with recovery UI
│   ├── ImpactVisualizer.tsx # Diminishing-returns KPIs, cigarette meter, community multiplier
│   ├── InversionTimeline.tsx# Interactive SVG spline + WCAG slider scrubber
│   ├── ModalShell.tsx       # Shared accessible dialog shell (backdrop + Escape dismissal)
│   ├── NeoSelect.tsx        # Custom Neo-Brutalist accessible dropdown
│   ├── ProfileForm.tsx      # Household context & vulnerability profiler
│   ├── PurifierCalculatorModal.tsx
│   ├── RwaActionKitModal.tsx
│   └── SmogChatCopilot.tsx  # Full-width grounded conversational assistant
├── data/
│   └── cityPresets.ts       # Localized city benchmark presets
├── hooks/
│   ├── useDashboardState.ts # Centralized telemetry, plan, adoption & BYOK state hook
│   └── useEscapeKey.ts      # Shared Escape-key dialog dismissal hook
├── services/
│   ├── aqiService.ts        # Open-Meteo integration & official CPCB NAQI formulas
│   ├── fallbackEngine.ts    # Deterministic offline plan & chat generator
│   └── geminiService.ts     # Gemini 2.5 Flash structured JSON & chat integration
├── types/
│   └── airQuality.ts        # Strict TypeScript interfaces & domain contracts
└── utils/
    ├── cache.ts             # 15-minute TTL sessionStorage + memory cache
    ├── clipboard.ts         # Async Clipboard API + textarea fallback
    ├── commuteCalculator.ts # Commute exposure & emission math
    ├── impactCalculator.ts  # Diminishing-returns & community scaling math
    ├── purifierCalculator.ts# ASHRAE CADR & DIY BOM math
    ├── sanitize.ts          # XSS & prompt-injection sanitizer (fresh RegExp instances)
    └── translations.ts      # Bilingual English & Hindi dictionary
```

---

## 4. Security, Accessibility & Quality Standards

* **Security:** Zero hardcoded secrets; `sessionStorage`-only BYOK keys; XML-sandboxed `<context>` prompts; multi-layer prompt-injection & HTML sanitization (`sanitizeInput`); `rel="noopener noreferrer"` on external links.
* **Accessibility (WCAG 2.1 AA):** Semantic HTML5 landmarks (`<header>`, `<main>`, `<section>`, `<footer>`); multi-modal AQI indicators (icon + severity text + numeric value + color); keyboard-navigable slider & `Escape`-dismissible dialogs; high-contrast `#070B10` / `#0C121B` Neo-Brutalist palette.
* **Performance:** 15-minute TTL response caching; `AbortController` request cancellation; `useMemo` impact aggregation; Vite `manualChunks` vendor splitting (`react-vendor`, `genai-vendor`, `ui-vendor`).

---

## 5. Local Setup & Verification

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Configure Gemini API key in .env
# VITE_GEMINI_API_KEY=AIzaSy...

# 3. Start local dev server
npm run dev

# 4. Run TypeScript strict typecheck
npm run typecheck

# 5. Run automated test suite (51 passing tests across 15 files)
npm test

# 6. Build production bundle (with manual chunk splitting)
npm run build
```
