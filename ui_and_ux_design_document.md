# UI/UX Design Document (`DESIGN.md`)
## Project: VayuGuard AI — Atmospheric Clarity Interface

---

## 1. Design Philosophy & Aesthetic Direction
* **Theme Concept:** **"Atmospheric Clarity"** — A calm, clinical-grade dark slate interface paired with crisp breathable typography and unmistakable air-quality hazard indicators. Designed to reduce cognitive load during stressful high-smog days while making environmental impact immediately tangible.
* **Responsive Strategy:** Mobile-first fluid CSS Grid (`1 column` on mobile `< 768px`, `12-column asymmetric split` on desktop `>= 1024px`).

---

## 2. Color System & WCAG AA Accessibility Tokens

All foreground/background pairs exceed the **WCAG 2.1 AA contrast ratio of $4.5:1$**.

| Token Name | Hex Value | Usage | Contrast vs Surface |
| :--- | :--- | :--- | :--- |
| `--bg-canvas` | `#090E14` | Primary page background | Base |
| `--bg-surface` | `#111822` | Cards, panels, and form containers | $1.3:1$ elevation |
| `--bg-elevated` | `#192332` | Interactive hover states & nested impact callouts | $1.7:1$ elevation |
| `--border-subtle` | `#263447` | Hairline card borders (`1px solid`) | Structural |
| `--text-primary` | `#F1F5F9` | Primary headings & body copy | **$15.8:1$ (AAA)** |
| `--text-secondary` | `#94A3B8` | Subtitles, labels, and metadata | **$6.7:1$ (AA)** |
| `--accent-emerald` | `#10B981` | Positive impact metrics, sustainable swaps, CTAs | **$8.4:1$ (AAA)** |
| `--accent-cyan` | `#38BDF8` | Indoor air hacks & ventilation window highlights | **$9.6:1$ (AAA)** |

### AQI Severity Semantic Scale (Never Color-Alone)
Every AQI indicator combines **Color + Lucide Icon + Text Label + Numeric Value**:
* **Good (`0–50`):** `#10B981` (Emerald) + `ShieldCheck` icon + `"Good Air"`
* **Moderate (`51–150`):** `#F59E0B` (Amber) + `Wind` icon + `"Moderate"`
* **Poor (`151–300`):** `#F97316` (Orange) + `AlertTriangle` icon + `"Poor Quality"`
* **Severe Smog (`301+`):** `#EF4444` (Crimson) + `Skull` / `Flame` icon + `"Severe Smog"`

---

## 3. Typography & Hierarchy
* **Primary UI Font:** `'Plus Jakarta Sans', 'Inter', system-ui, sans-serif`
  * Page Title (`h1`): `1.5rem` (`24px`), Weight `700`, Tracking `-0.02em`
  * Section Headings (`h2`): `1.125rem` (`18px`), Weight `600`
  * Card Titles (`h3`): `1rem` (`16px`), Weight `600`
  * Body Copy: `0.875rem` (`14px`), Line-height `1.6`
* **Telemetry & Metrics Font:** `'JetBrains Mono', monospace`
  * Used for live $\text{PM}_{2.5}$ readings (`342 µg/m³`), AQI numbers (`418`), percentage reductions (`-38% PM2.5`), and $\text{CO}_2$ savings (`14.2 kg/wk`).

---

## 4. Wireframe & Component Layout Architecture

```text
+-----------------------------------------------------------------------------------+
| [HEADER] VayuGuard AI | City Selector [Delhi v] | Quick Presets [Severe 420] [Key] |
+-----------------------------------------------------------------------------------+
| [TELEMETRY STRIP]                                                                 |
|  AQI: 418 (SEVERE SMOG) | PM2.5: 285 µg/m³ | Safe Window: 1:30 PM - 3:45 PM       |
+-----------------------------------+-----------------------------------------------+
| [LEFT RAIL - 4 COLS]              | [RIGHT WORKSPACE - 8 COLS]                    |
| Household & Lifestyle Profile     | Quantified Direct Impact Banner               |
|                                   | [-42% Exposure] [18.5 kg CO2/wk] [₹1,450/mo]  |
| - Housing Type (Select)           |-----------------------------------------------|
| - Family Vulnerabilities (Pills)  | Filter Tabs: [All (6)] [Routines] [IAQ] [Swaps]|
| - Primary Commute (Select)        |-----------------------------------------------|
| - Cooking / Heating (Select)      | +-------------------------------------------+ |
| - Specific Notes (Sanitized Input)| | [BADGE: INDOOR AIR HACK]     [✓ Adopted]  | |
|                                   | | DIY Box-Fan MERV-13 / HEPA Filter Setup   | |
| [Generate Action Plan Button]     | | Action steps & timing...                  | |
|                                   | | +---------------------------------------+ | |
|-----------------------------------| | | DIRECT IMPACT EXPLANATION:            | | |
| [COMMUNITY MULTIPLIER CARD]       | | | Cuts indoor PM2.5 by ~55% in 45 mins; | | |
| If 100 families adopt your plan:  | | | protects children from nocturnal cough. | | |
| 1,850 kg CO2 prevented / week     | | +---------------------------------------+ | |
+-----------------------------------+ +-------------------------------------------+ |
| [COLLAPSIBLE SMOG COPILOT CHAT]                                                   |
| Ask follow-up questions grounded in your family profile & live AQI...             |
+-----------------------------------------------------------------------------------+
```

---

## 5. Micro-Interactions & States
1. **Loading Skeletons:** While Gemini generates a plan, display structured pulsing skeleton cards (no jarring layout shifts) with an `aria-live="polite"` status message: *"Analyzing winter inversion patterns and tailoring your family action plan..."*.
2. **Interactive Action Adoption:** Each recommendation card has an accessible checkbox (`role="checkbox"`, `aria-checked`). Toggling an action smoothly recalculates the top **Quantified Direct Impact Banner** and **Community Multiplier** in real time.
3. **Keyboard & Focus UX:** Custom `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090E14]` on all interactive elements.