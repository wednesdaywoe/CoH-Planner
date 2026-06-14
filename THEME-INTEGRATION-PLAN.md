# Theme Integration Plan — chrome alignment

Status: **planned, not started** (2026-06-14). Picks up from the theme work that
added Hamidon / Resistance / Carnival and the shelved `imperial-light`.

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

- **Phase 0 — define tokens.** Add Family-2 tokens to `@theme` with current
  default hexes (green-600/yellow-600/red-600/blue-600 equivalents). No visual
  change yet. Wire light-theme darker variants where needed.
- **Phase 1 — primitives** (`src/components/ui/`). Migrate Button/Toggle/Badge/
  Slider/Toast/Input/Select variants onto Family-1 (action) and Family-2 (status)
  tokens. Biggest cascade for least edits. Toggle: make the default "on" colour
  `--color-primary`; keep a `warning` variant on `--color-warning` for Bonus Cap.
- **Phase 2 — header/chrome** (`layout/Header.tsx`, `MobileBottomNav.tsx`).
  Shared Builds inline `#4f46e5` → `--color-primary`; "Menu"/Level-Up emerald
  "active/ready" states — **decision needed** (see below); AT-mechanic `sky/purple`
  selector states → `--color-primary` / `--color-primary-subtle`.
- **Phase 3 — modals** (`ExportImportModal`, `EnhancementPicker`, `FeedbackModal`,
  `WelcomeModal`, `SetBonusLookupModal`). Map success/valid → `--color-success`,
  primary actions/selection → `--color-primary`, info boxes → `--color-info`.
- **Phase 4 — info panels** (`EnhancementInfoContent`, `PowerInfoTooltip`,
  `DamageBlock`). Mostly bucket 3 (stat-adjacent) — verify each accent is truly
  chrome before migrating; leave anything that encodes a stat/damage type.

## Decisions to settle before/while doing this

1. **"Active/ready" green (emerald) — Family 1 or 2?** The Level-Up and "Menu"
   active states use emerald as "go/ready," not "success." Recommend: treat
   selection/active as **Family 1 (theme primary)** so active states match the
   theme; reserve green strictly for true success/validation.
2. **Toggle "on" color.** Default on = `--color-primary`; keep an explicit
   `warning` variant (Bonus Cap Alert) on `--color-warning`. Confirm that's the
   intended semantic split.
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
