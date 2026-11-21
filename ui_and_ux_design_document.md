# UI/UX Design Document (`DESIGN.md`)
## Project: VayuGuard AI — Atmospheric Defense Grid (Neo-Brutalist Edition)

---

## 1. Design Philosophy & Aesthetic Direction
* **Theme Concept:** **"Neo-Brutalist Atmospheric Defense Grid"** — A high-contrast, tactile command-center interface designed for severe winter smog crises. Combines raw high-contrast geometric panels, deep tactile drop-shadows, and unmistakable hazard telemetry with crisp, breathable typography.
* **Core Principles:**
  1. **Maximum Contrast & Legibility:** Bold solid black borders (`2px solid #334155` / `#000000`) and high-contrast text ratios exceeding **WCAG 2.1 AA** (up to 15.8:1 AAA).
  2. **Tactile Physicality:** Interactive buttons and cards exhibit tactile physical depth via hard drop-shadow offsets (`box-shadow: 4px 4px 0px #000000`) that physically compress (`translate(2px, 2px)`) upon click.
  3. **Multi-Modal Severity:** Never rely on color alone — every AQI indicator integrates **Icon + Severity Label + CPCB Numeric Value + Hazard Hue**.
* **Responsive Strategy:** Mobile-first fluid CSS Grid (`1 column` on mobile `< 768px`, `12-column asymmetric split` on desktop `>= 1024px`).

---

## 2. Color Palette & WCAG AA Accessibility Tokens

All foreground/background pairs strictly comply with or exceed **WCAG 2.1 AA (4.5:1 minimum)**:

| Token Name | Hex Value | Usage | Contrast vs Canvas |
| :--- | :--- | :--- | :--- |
| `--bg-canvas` | `#060A0F` | Deep tactical command background with technical grid | Base |
| `--bg-surface` | `#0B111A` | Cards, panels, and form containers | $1.4:1$ elevation |
| `--bg-elevated` | `#121A27` | Interactive hover states & nested impact callouts | $1.8:1$ elevation |
| `--border-brutal` | `#334155` | High-contrast geometric 2px card borders | Structural |
| `--text-primary` | `#F8FAFC` | Primary headings & body copy | **$16.2:1$ (AAA)** |
| `--text-secondary` | `#94A3B8` | Subtitles, labels, and technical metadata | **$7.1:1$ (AA)** |
| `--brutal-emerald` | `#10B981` | Safe air, verified impact metrics, CTAs, safe ventilation | **$8.6:1$ (AAA)** |
| `--brutal-cyan` | `#06B6D4` | Diurnal telemetry, hourly cycle, DIY purifier tool | **$9.4:1$ (AAA)** |
| `--brutal-amber` | `#F59E0B` | Moderate air, diurnal trap cautions, commute comparisons | **$8.2:1$ (AAA)** |
| `--brutal-orange` | `#F97316` | Poor air quality alert, health warnings | **$6.8:1$ (AA)** |
| `--brutal-crimson` | `#EF4444` | Severe smog hazard, peak thermal inversion warning | **$5.9:1$ (AA)** |
| `--brutal-purple` | `#A855F7` | 100-family civic community multiplier banner | **$6.4:1$ (AA)** |

---

## 3. Typography & Hierarchy

A triple-font typographical system pairing aggressive geometric display fonts with precision technical monospace and hyper-legible body sans:

* **Display Font (Headings & Brand):** `'Space Grotesk', 'Plus Jakarta Sans', sans-serif`
  * Hero Brand (`h1`): `1.5rem` (`24px`), Weight `900`, Uppercase, Tracking `-0.02em`
  * Section Headers (`h2`): `1.0rem–1.125rem` (`16–18px`), Weight `800`, Uppercase, Tracking `0.025em`
  * Action Titles (`h3`): `0.875rem–1.0rem` (`14–16px`), Weight `700`
* **Body Font (Prose & Interface):** `'Plus Jakarta Sans', 'Inter', system-ui, sans-serif`
  * Explanations & Advice: `0.8125rem` (`13px`), Line-height `1.6`, Regular/Medium
* **Telemetry & Numeric Font:** `'JetBrains Mono', monospace`
  * Live CPCB AQI readout, PM2.5 concentrations (`µg/m³`), diurnal timestamps (`06:00 AM`), and carbon offsets (`kg CO2/wk`).

---

## 4. Neo-Brutalist Hard Shadow & Tactile Tokens

* `.brutal-shadow`: `box-shadow: 4px 4px 0px 0px #000000;`
* `.brutal-shadow-lg`: `box-shadow: 6px 6px 0px 0px #000000;`
* `.brutal-shadow-sm`: `box-shadow: 2px 2px 0px 0px #000000;`
* `.brutal-shadow-emerald`: `box-shadow: 4px 4px 0px 0px #10B981;`
* `.brutal-shadow-cyan`: `box-shadow: 4px 4px 0px 0px #06B6D4;`
* `.brutal-shadow-amber`: `box-shadow: 4px 4px 0px 0px #F59E0B;`
* `.brutal-shadow-red`: `box-shadow: 4px 4px 0px 0px #EF4444;`
* `.brutal-shadow-purple`: `box-shadow: 4px 4px 0px 0px #A855F7;`

### Tactile Button Mechanics:
```css
.brutal-btn {
  transition: transform 0.12s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.12s cubic-bezier(0.4, 0, 0.2, 1);
}
.brutal-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0px 0px #000000;
}
.brutal-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0px 0px #000000;
}
```

---

## 5. Micro-Interactions & Accessibility
1. **Dynamic GSAP Staggering:** Action plan recommendation cards animate on load with a fast 0.35s stagger to provide immediate, energetic visual responsiveness without delaying user interaction.
2. **Confetti Burst on Adoption:** Adopting a recommendation triggers a targeted particle celebration (guarded against headless/test environments).
3. **Accessibility Rings:** Dual-ring focus outline (`focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2`) guaranteeing complete keyboard navigability.
