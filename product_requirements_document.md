# Product Requirements Document (PRD)
## Project: VayuGuard AI — Urban Air Quality & Winter Smog Action Assistant
**Challenge:** PromptWars Challenge 6 (Urban Air Quality Assistant)  
**Version:** 1.0  
**Target Evaluation:** Automated AI Code & Semantic Rubric Evaluator  

---

## 1. Executive Summary & Problem Statement Alignment
### 1.1 Official Problem Statement
> *"Create a GenAI-powered assistant that helps families and communities navigate severe winter smog and urban air pollution. The application should suggest low-emission daily routines, indoor air quality hacks, and sustainable alternatives tailored to their location and lifestyle, while clearly explaining the direct impact of their choices."*

### 1.2 Product Vision
**VayuGuard AI** is a hyper-local, context-aware Generative AI assistant built specifically for urban households and residential communities experiencing severe winter smog (thermal inversion trapping particulate matter $\text{PM}_{2.5}$ and $\text{PM}_{10}$). Rather than displaying passive air quality numbers, VayuGuard translates real-time meteorological and pollution telemetry into **personalized, low-cost, actionable daily plans** while quantifying the **direct health and environmental impact** of every single choice.

### 1.3 Target Personas
1. **The Protective Parent (Primary Household User):** Lives in an apartment or independent house with young children or elderly parents; needs immediate, practical indoor air quality (IAQ) hacks and safe outdoor timing without spending ₹30,000+ on commercial air purifiers.
2. **The Daily Urban Commuter:** Drives a petrol/diesel vehicle or rides a two-wheeler; wants low-emission commute alternatives and route/timing shifts that reduce personal $\text{PM}_{2.5}$ inhalation and community carbon footprint.
3. **The Community / RWA Coordinator:** Wants shareable neighborhood-level smog mitigation actions (e.g., halting dry leaf burning, carpooling pools, dust suppression via wet sweeping).

---

## 2. Functional Requirements & User Stories

### Feature 1: Hyper-Local AQI & Winter Smog Telemetry Engine
* **Description:** Fetches real-time air quality metrics ($\text{PM}_{2.5}$, $\text{PM}_{10}$, US/Indian AQI equivalent, and diurnal thermal inversion risk) for any user-selected city, plus instant one-click demo presets for major Indian smog-affected cities (*Delhi NCR*, *Bhopal*, *Indore*, *Mumbai*, *Bengaluru*) and severity tiers (*Severe Smog 420*, *Poor 240*, *Moderate 110*).
* **User Story:** *As a resident, I want to select my city or test a severe winter smog scenario so the AI understands the exact pollution severity outside my window.*
* **Acceptance Criteria:**
  * Live fetch via Open-Meteo Air Quality API with graceful offline/rate-limit fallback.
  * Displays $\text{PM}_{2.5}$ ($\mu\text{g/m}^3$), $\text{PM}_{10}$ ($\mu\text{g/m}^3$), AQI Category Badge (with icon + text + color), and **Winter Inversion Advisory** (e.g., peak smog trap between 6:00 AM – 9:30 AM and 7:00 PM – 11:00 PM).

### Feature 2: Family & Lifestyle Context Profiler
* **Description:** Captures structured household context to ensure recommendations are genuinely tailored rather than generic.
* **Inputs:**
  * **Location & Housing Type:** City name + Housing (`High-rise Apartment`, `Ground-floor / Independent House`, `Near Main Road / Construction`).
  * **Household Vulnerability Profile:** Multi-select (`Infants / Toddlers`, `Elderly (60+)`, `Asthma / Respiratory Sensitivity`, `Healthy Adults`).
  * **Primary Commute Mode:** `Solo Car (Petrol/Diesel)`, `Two-Wheeler`, `Public Metro / Bus`, `EV / Cycle / WFH`.
  * **Indoor Cooking & Heating Fuel:** `LPG / PNG with Chimney`, `LPG without Exhaust`, `Electric / Induction`, `Wood / Coal / Coil Heater`.
  * **Budget Preference:** `Zero-Cost / DIY Hacks`, `Low Budget (< ₹1,500)`, `Standard`.

### Feature 3: GenAI Personalized Action Plan (3 Core Pillars + Direct Impact)
* **Description:** Generates a structured, deterministic JSON action plan via Google Gemini (`gemini-2.5-flash`)—backed by a smart rule-based fallback engine if no API key is configured—organized into the exact three categories mandated by the problem statement:
  1. **Low-Emission Daily Routines (`lowEmissionRoutines`):**
     * Time-optimized outdoor exercise/school commute schedules avoiding morning/evening inversion peaks.
     * Household cleaning shifts (wet mopping vs. dry broom sweeping to prevent $\text{PM}_{10}$ resuspension).
     * Smart errand batching and carpool/transit swaps.
  2. **Indoor Air Quality (IAQ) Hacks (`indoorAirHacks`):**
     * Diurnal cross-ventilation windows (opening windows strictly between 1:00 PM – 4:00 PM when boundary layer rises).
     * DIY Corsi-Rosenthal / box-fan HEPA filter assembly guide, wet towel door-draft sealing, and kitchen exhaust protocols.
     * High-efficiency indoor phytoremediation plants (Areca Palm, Snake Plant, Spider Plant) matched to room count.
  3. **Sustainable Alternatives (`sustainableAlternatives`):**
     * Actionable swaps for heating (oil-filled radiator / layered thermal wear over biomass/open burning), transport (metro + e-rickshaw last-mile), and waste (composting dry garden leaves instead of burning).
* **Mandatory "Direct Impact Explanation" on Every Card:**
  * Every single recommendation card MUST include:
    * **Exposure Reduction (%):** Estimated drop in family $\text{PM}_{2.5}$ inhalation.
    * **Emission Offset ($\text{g}$ or $\text{kg}$ $\text{CO}_2\text{/week}$):** Direct environmental reduction.
    * **Plain-Language Causal Explanation (`whyItWorks`):** Clear scientific yet simple explanation of *how* this choice protects lungs and lowers local smog.

### Feature 4: Quantified Family & Community Impact Dashboard
* **Description:** Aggregates the user's selected/checked actions into real-time impact KPIs:
  * **Total Weekly $\text{PM}_{2.5}$ Inhalation Avoided ($\mu\text{g}$)**
  * **Community $\text{CO}_2$ Emissions Prevented ($\text{kg/month}$)**
  * **Estimated Monthly Fuel / Healthcare Savings ($\text{₹}$)**
  * **Community Multiplier:** Shows what happens if 100 families in the same neighborhood adopt the plan.

### Feature 5: Context-Aware Smog & Lifestyle AI Copilot (Interactive Chat)
* **Description:** A conversational follow-up assistant pre-seeded with the user's active city, AQI, and family profile.
* **Sample Quick Prompts:**
  * *"Is it safe for my 4-year-old to play outside at 4 PM today?"*
  * *"How do I make a ₹800 DIY air purifier for a 12x12 bedroom?"*
  * *"Draft a WhatsApp message for our RWA to stop morning leaf burning."*

---

## 3. Non-Functional Requirements (Mapped to PromptWars Rubric)
| Rubric Parameter | Impact Tier | Target Requirement |
| :--- | :--- | :--- |
| **Problem Statement Alignment** | **High** | Explicit coverage of winter smog, families/communities, low-emission routines, IAQ hacks, sustainable swaps, and direct impact explanations. |
| **Code Quality** | **High** | Modular TypeScript (`strict: true`), zero `any`, clean separation of UI/services/utils, comprehensive JSDoc & `README.md`. |
| **Security** | **Medium** | Zero hardcoded API keys, strict prompt-injection sanitization, XSS prevention, schema validation on LLM outputs. |
| **Efficiency** | **Medium** | `sessionStorage` TTL response caching, `AbortController` request deduplication, memoized calculations, repo size $< 1\text{ MB}$ (limit $< 10\text{ MB}$). |
| **Testing** | **Low** | Automated unit & integration tests via Vitest + React Testing Library covering math, sanitization, services, and UI flows. |
| **Accessibility** | **Low** | WCAG AA contrast, semantic HTML5 landmarks, ARIA labels/live regions, keyboard navigation, non-color-dependent AQI badges. |