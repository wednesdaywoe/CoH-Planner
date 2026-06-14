# Theme Integration Plan — chrome alignment

Status: **All phases (0–4) done** (2026-06-14). Tokens defined, `src/components/ui/`
primitives migrated, the Rule-of-5 / Bonus-Cap warning highlights moved onto
`--color-warning`, header/mobile chrome + power-selection/slot states + stat-tile
rings migrated onto the Family-1 accent, the five flat themes retuned so their
action accent contrasts the ramp (Resistance/Imperial formula), and the Phase-3
modals + Phase-4 info panels migrated. Typecheck + build clean throughout.
**Remaining/optional:** Light-theme (`imperial-light`) Family-2 `-fg` contrast
overrides (decision #3 below) when that shelved theme is revived. Picks up from
the theme work that added Hamidon / Resistance / Carnival.

## Goal

Make UI **chrome** (buttons, toggles, cards/panels, selection + focus states,
menu pills) adopt the active color theme, so a build under Carnival doesn't have
stray Tailwind-blue buttons. Do this **without** breaking the meaning users read
from color.

## Guiding principle — three color families, not one

The single most important decision: **not everything should adopt the theme.**
Color in this app falls into three buckets, and only one of them re-hues per theme.

1. **Action / brand — ADOPTS the theme.**
   Primary buttons, primary toggles, selected/active rows, links, focus rings,
   "compare/special" highlights. Already tokenized: `--color-primary`,
   `--color-primary-hover`, `--color-primary-fg`, `--color-link`,
   `--color-sk-magenta`. The job here is mostly *migrating hardcoded blues/indigos
   onto these existing tokens.*

2. **Semantic status — STAYS STABLE across themes (tokenized for consistency only).**
   success = green, danger/error = red, warning = yellow/amber, info = blue.
   These mean something; a purple "success" toast is as wrong as purple "damage".
   Tokenize them so they're consistent and light-theme-tunable, but do **not**
   override them per `[data-theme]` (except contrast tweaks on light themes).

3. **Stat / category color — GLOBAL, OUT OF SCOPE.**
   `src/data/core/stat-colors.ts`, the `.stat-*` classes, stat-value coloring, and
   the stat-category dots in `StatsConfigModal.tsx` (which mirror stat hues).
   **Do not touch.** Already settled in prior discussion.

## Current state (audit 2026-06-14)

- **Panels & cards are already themed** — containers use `bg-gray-800/*` /
  `border-slate-700` which ride the ramp. Little to do here beyond stray pills.
- **Chrome accents are pervasively hardcoded** — ~285 saturated-accent utilities
  across ~68 files. Concentrated: `StatsConfigModal` (61, mostly category dots =
  bucket 3, skip), `EnhancementPicker` (38), `ExportImportModal` (37),
  `Header.tsx` (22), `EnhancementInfoContent` (17), `Badge` (10), `FeedbackModal`
  (10), `WelcomeModal` (9), `PowerInfoTooltip` (9).
- **Primitives carry hardcoded variants** — fixing these cascades to many call
  sites, so they're the high-ROI start:
  - `ui/Button.tsx` — `primary` already on tokens ✓; `danger` = `bg-red-600` → bucket 2.
  - `ui/Toggle.tsx` — `blue` / `orange` variants hardcoded (`peer-checked:bg-blue-600`, `bg-orange-500`).
  - `ui/Badge.tsx` — blue/green/yellow/red/purple/cyan `/20` variants → buckets 1+2.
  - `ui/Slider.tsx` — `bg-blue-600` track, `bg-emerald-600` thumb.
  - `ui/Toast.tsx` — success/warning/error = green/yellow/red → bucket 2.
  - `ui/Input.tsx`, `ui/Select.tsx` — `focus:ring-blue-500` → focus-ring token.

## Token plan

Add to the `@theme` block in `src/index.css` (defaults), and decide per family
whether `[data-theme]` blocks override them:

```
/* Family 1 — action/brand: ALREADY EXIST, just extend usage.
   Optionally add: */
--color-primary-subtle   /* the "bg-blue-900/30 + text-blue-400" tinted-pill pattern */
--color-ring             /* focus rings; default = --color-primary */

/* Family 2 — semantic status: NEW, defined once, NOT overridden per dark theme.
   (Light themes may override for contrast only.) */
--color-success  /* greens */
--color-warning  /* yellows/ambers */
--color-danger   /* reds — also Button danger variant */
--color-info     /* blues/indigos used for informational boxes */
```

Per-theme `[data-theme]` blocks override **only Family 1** (already do). Family 2
lives in `@theme` and stays put. This keeps green=success everywhere.

## Phased migration (high ROI first)

- **Phase 0 — define tokens. ✅ DONE.** Added to `@theme`: `--color-ring`
  (Family-1, `var(--color-primary)` so focus rings follow the accent) and the
  Family-2 status set, each as a solid base (-600) + lighter `-fg` (-400) so
  migrations reproduce the existing two-shade `bg-600/20 + text-400` look
  exactly: `--color-success(-fg)`, `--color-warning(-fg)`, `--color-danger(-fg)`,
  `--color-info(-fg)`. Status tokens live in `@theme` only — NOT re-skinned per
  dark `[data-theme]`. Light-theme `-fg` contrast overrides still TODO (Phase 4 /
  light-theme work).
- **Phase 1 — primitives** (`src/components/ui/`). **✅ DONE.** Button `danger` →
  `bg-danger`/`focus:ring-danger` (`hover:brightness-90`). Toggle variants
  renamed `blue|orange` → `primary|warning` (default `primary` → accent;
  `warning` → `--color-warning` for Bonus Cap; Header call site updated). Badge
  `primary`→primary/link, `success|warning|danger`→status tokens (`purple|cyan`
  decorative + `RarityBadge` game-semantic, left alone). Slider thumb →
  `--color-primary`(+`-hover`), ring → `--color-ring`. Toast info/success/warning
  borders+icons → status tokens, action button → primary. Input/Select focus
  rings → `--color-ring`; Input error → danger tokens.
- **Phase 2 — header/chrome** (`layout/Header.tsx`, `MobileBottomNav.tsx`).
  **✅ DONE.** Shared Builds inline `#4f46e5`/`#6366f1` → `--color-primary`;
  "Menu" trigger + Level-Up mode pill / advance button / level-stepper emerald
  "active/ready" → `--color-primary` (+ `--color-link` for accent text/values);
  AT-mechanic `sky` pills (Fury/Team/etc.), Options button, Content-mode +
  Kheldian-form selector active states, the mobile active-tab indicator, and the
  capped/tracked stat-tile rings → `--color-primary` family (`bg-primary/20`
  pill tint, `border-primary/40`, `text-link` labels, `ring-[var(--color-ring)]`
  focus). Used `text-link` for accent text/numbers and `bg-[var(--color-primary)]`
  for solid fills. **Left as-is (out of scope):** the decorative File/Menu
  dropdown item icons (per-item color variety, bucket-3-like), the Discord brand
  `#5865F2`, the share-popup `innerHTML` spinner (detached document — CSS vars
  won't resolve there), the SKMagenta identity-nudge literal (paired with a
  fixed-magenta keyframe), and the exemplar/amber + "picks pending" amber
  (warning-ish, not accent). Skipped adding `--color-primary-subtle` — the
  `bg-[var(--color-primary)]/20` alpha pattern auto-derives the tint and
  re-hues per theme without a separate token.
- **Phase 3 — modals** (`ExportImportModal`, `EnhancementPicker`, `FeedbackModal`,
  `WelcomeModal`, `SetBonusLookupModal`). **✅ DONE.** Success/valid →
  `--color-success`, primary actions/selection/tabs/toggles/file-inputs →
  `--color-primary`/`--color-link`, focus rings → `--color-ring`, info notes →
  `--color-info`, caution notes (Mids "PLEASE READ") → `--color-warning`,
  WelcomeModal status badges → danger/success/info/warning tokens. **Unified
  selection sets that were partially color-coded:** the 3 top tabs
  (Save/Load/Share = blue/amber/green), the 3-way import-source toggle +
  file-buttons (Local/Mids/Game = blue/amber/cyan), and the FeedbackModal
  feedback-type chips (bug/suggestion/other = red/blue/purple) all collapse to
  the theme accent when active (labels carry the wayfinding). **Left as-is:**
  `EnhancementPicker` is almost entirely stat/category/rarity color (out of
  scope — only its type-filter tab + IO A-Z/Level sort toggles migrated); the
  WelcomeModal `new` purple badge (no semantic token); one ambiguous
  `text-emerald-300` popmenu description line; RarityBadge + aspect/category
  colors everywhere.
- **Phase 4 — info panels** (`EnhancementInfoContent`, `PowerInfoTooltip`,
  `DamageBlock`). **✅ DONE.** As expected, almost everything here is bucket 3 and
  was LEFT: the effect-aspect color map (Endurance/Heal/Absorb/Control…),
  green="enhanced value", green="set bonus active" (matches the untouched
  `SetBonusDisplay` convention), proc-type colors, indigo pet indicators/box,
  and the cyan damage-viz bar + ArcanaTime/proc value colors. Only genuine chrome
  migrated → `--color-link`/`--color-primary`: the enhancement/power **name
  headings** (the blue `<h3>` title accent + the proc-piece name), the
  `DamageBlock` display-mode **toggle** active state, and the `PowerInfoTooltip`
  **"Pinned (Shift)"** ring + label.

## Decisions to settle before/while doing this

1. **"Active/ready" green (emerald) — Family 1 or 2?** The Level-Up and "Menu"
   active states use emerald as "go/ready," not "success." Recommend: treat
   selection/active as **Family 1 (theme primary)** so active states match the
   theme; reserve green strictly for true success/validation. **✅ SETTLED →
   Family 1.** Applied in Phase 2: Level-Up / Menu / selectors now adopt
   `--color-primary`; green kept only for genuine success/validation.
2. **Toggle "on" color.** Default on = `--color-primary`; keep an explicit
   `warning` variant (Bonus Cap Alert) on `--color-warning`. Confirm that's the
   intended semantic split. **✅ SETTLED + DONE.** Also migrated the whole
   Rule-of-5 / Bonus-Cap *highlight* system onto `--color-warning` so the toggle
   and the highlights it controls match: the offending-power ring (`PowerRow`),
   the capped dashboard stat-tile ring + strikethrough breakdown entries
   (`StatsDashboard`, `DetailedTotalsModal`, `EnhancementInfoContent`,
   `SetBonusDisplay`, `PowerSlot`, `EnhancementPicker`), the `RuleOf5Banner`, the
   `StatsConfigModal` legend swatch, and the user-facing copy (Header toggle
   title, help-topics) reworded off the literal word "orange" → "highlight". The
   to-hit 95% cap and damage-cap indicators are a *different* cap concept (left
   on their own amber/orange) and the `ring-blue-500` "tracked-stat" tile ring is
   a Family-1 item deferred to Phase 2.
3. **Light-theme contrast.** Family-2 status colors at `-600` need darker
   variants on `imperial-light` (same scoped-override trick already used for
   stat accents). Folds into the shelved light-theme work.

## Effort & sequencing

Large overall (~68 files), but front-loaded value: **Phase 0+1 (tokens +
primitives) is a day and covers a big fraction via cascade.** Phases 2–3 are the
bulk of hand-edits. Phase 4 is small and mostly verification. Excluding bucket 3
(stat/category color) removes the single largest file (`StatsConfigModal`, 61)
from scope.

## Explicit exclusions (do NOT migrate)

`src/data/core/stat-colors.ts`, `.stat-*` classes in `index.css`, stat/effect
value coloring, and stat-category indicator dots. These are intentionally global
and consistent across every theme.
```
