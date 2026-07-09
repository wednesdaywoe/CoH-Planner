---
project: coh-sidekick
kind: plan
title: Rearrangeable Planner Layout
id-prefix: LAY
created: 2026-07-09
relates:
  - OPEN_ITEMS.md
---

# Rearrangeable Planner Layout

Source of truth for making the planner's sections user-rearrangeable, so users can
optimize the layout for their own setup. The current layout deliberately trades
space for lower information density (an intentional divergence from Mids); this
feature lets each user resolve that tradeoff themselves instead of it being fixed.

**Scope (decision 2026-07-09, user-chosen):** **Tier 1 — reorder + show/hide**,
**planner columns only**. Users drag the top-level planner sections to reorder
them within the grid, toggle section visibility, and reset to default. Data model
is built so a future Tier 2 (independently resizable/floating dock grid) can grow
on the same persisted slice without a rewrite.

Rejected: Tier 3 "everything floats" — applying the `PopOutInfoPanel`
floating-window model to every section (floating suits *transient/supplementary*
panels like InfoPanel, not the primary workspace; leads to overlap/z-order/lost-
panel support burden). Rejected for now: Tier 2 resizable dock grid (react-grid-
layout style) — higher cost + needs a mobile/reset story; deferred, not designed
out.

## Why this is structurally favorable

The expensive precondition is already met: every planner section is the same
self-contained shell — a full-height flex column, fixed-height header +
`flex-1 overflow-y-auto` body, width driven entirely by the parent grid `1fr`,
receiving no size props. Sections are already width-agnostic and self-scrolling,
so reordering/hiding them is low-risk. State also already persists: `uiStore` saves
~40 UI prefs to the `coh-planner-ui` localStorage key via `persist`, with a
`merge()` that runs schema migrations, and `statsConfig`/`reorderStats` is existing
precedent for user-reorderable UI that survives reload.

Candidate sections (category view): Available Powers, Selected Primary, Selected
Secondary, Pool/Epic/Inherent, Info Panel. Chronological view collapses the middle
three into one — so the layout slice is keyed per view mode.

Key files: [PlannerPage.tsx](../src/pages/PlannerPage.tsx) (the grid + hard-coded
`grid-cols-[…]` strings + `md:`/`lg:` visibility juggling this feature replaces),
[uiStore.ts](../src/stores/uiStore.ts) (persisted UI slice + `merge()` migration +
`reorderStats` precedent), [InfoPanel.tsx](../src/components/info/InfoPanel.tsx) /
[PopOutInfoPanel.tsx](../src/components/info/PopOutInfoPanel.tsx) (existing binary
`undocked` dock toggle).

All Active items shipped 2026-07-09 (commits: LAY1 store slice; LAY2–6 in one
follow-up). Verified in-app via Playwright: drag-reorder persists to the
`coh-planner-ui` key, hiding a column reflows the desktop grid, Reset restores
defaults, chronological keeps its 2fr middle column, and the mobile/md fallback is
unchanged.

**Deviation (decision 2026-07-09):** LAY4 uses native HTML5 drag-and-drop on a
header grip instead of dnd-kit. Rationale: a 5-item reorder doesn't warrant a new
dependency (the repo had zero DnD libs and the stats reorder is toggle-only), and
native DnD keeps the "don't over-engineer" ethos. Rejected: dnd-kit (dependency
weight unjustified at this scale). If a future Tier 2 needs free-form resize/drag,
revisit.

## Active

- [x] **LAY1** — add persisted `plannerLayout` slice to `uiStore`: per-view-mode
  ordered array of `{ id, visible, weight? }`. Added to `partialize`; `merge()`
  reconciles saved layouts against defaults (append new sections, drop unknown
  ids). Reorder/toggle/reset actions modeled on `reorderStats`.
  verify: file:src/stores/uiStore.ts, fn:reorderPlannerSections
- [x] **LAY2** — section content single-sourced via a `getSection()` descriptor
  (`{ title, headerRight, body, bodyClassName }`), reused by both the desktop grid
  and the mobile/md fallback so no body markup is duplicated.
  verify: file:src/pages/PlannerPage.tsx
- [x] **LAY3** — grid driven from the layout slice: `gridTemplateColumns` computed
  from visible sections' fr weights; the hard-coded `grid-cols-[…]` strings and the
  `md:`/`lg:` visibility juggling are gone from the desktop path.
  verify: file:src/pages/PlannerPage.tsx, fn:moveSection
- [x] **LAY4** — drag-to-reorder the desktop columns via native HTML5 DnD on a
  header grip (see Deviation above). verify: file:src/pages/PlannerPage.tsx
- [x] **LAY5** — layout control UI = `PlannerLayoutMenu` (view-aware ordered list
  with up/down reorder + show/hide checkboxes + Reset). Iterated for discoverability
  and form (all 2026-07-09, user-driven): hint-bar "Columns" popover → dashboard
  toolbar modal → **top header dropdown next to Menu/Options** (final). Final form is
  a popover in the same mould as the ActionMenu/SettingsPopover header triggers
  (own open state + click-outside/Escape), not a modal. Column-header drag remains
  a power-user affordance. verify: file:src/components/layout/PlannerLayoutMenu.tsx
- [x] **LAY6** — InfoPanel undock reconciled with visibility: an undocked info
  column leaves the grid regardless of its stored `visible` flag; the Columns menu
  shows it as "floating" and disables its checkbox while undocked.
  verify: file:src/pages/PlannerPage.tsx
- [x] **LAY8** — split the combined Pool column into two independent sections:
  **Pool & Epic Powers** (`pool`) and **Inherent Powers** (`inherent`, the Fitness
  / Basic / Prestige Sprints / archetype-inherent groups). New `InherentPowers`
  component exported from `PoolPowers.tsx` (shares the private `InherentPowerGroup`);
  `PoolPowers` now renders only pools + epic. New `'inherent'` `PlannerSectionId`,
  added to `defaultPlannerLayout.category` after `pool` — the `merge()` reconcile
  appends it for existing users automatically. Section descriptor + label added to
  `PlannerLayoutMenu`; mobile/md fallback renders both. Verified in-app: six clean
  columns, Fitness/Fury live in Inherent, no console errors, reconcile appends for
  saved layouts. verify: file:src/components/powers/PoolPowers.tsx, fn:InherentPowers
- [x] **LAY7** — horizontal column resize (Tier 2, safe axis) on the existing
  `weight` field. Drag a divider between two columns to shift fr-weight from one to
  the other (pair sum constant, other columns untouched); persists per-view via
  `setPlannerSectionWeights`. Grid template is `minmax(260px, …fr)` so no column
  renders below the audited clean floor (`MIN_COL_PX`) — grid overflow-scrolls
  instead of deforming — and the drag clamps both neighbors to ≥260px. Divider is
  suppressed during a header reorder drag so the two gestures don't fight. Existing
  Reset clears weights (defaults carry none → 1fr). Verified in-app: 1:1 tracking up
  to the neighbor's floor, clamp holds, weights persist to `coh-planner-ui`, 6-slot
  rows stay inline at the 260 floor. verify: file:src/pages/PlannerPage.tsx, fn:startColumnResize

## Min-size audit (2026-07-09)

Empirical de-risking for any resize feature (and the "snap to shapes" concern):
drove each populated section down to narrow column widths in-app (Playwright,
forced `gridTemplateColumns`, full Brute/Battle Axe/Bio Armor build with a
6-slotted power). Result — the horizontal axis has hard floors; the **vertical
axis is safe** (every body is `flex-1 overflow-y-auto`, so shrinking height just
scrolls, no render break).

Two floors per section: the **clip floor** (content is cut off / unusable) and the
**clean-render floor** (fits without deforming — no wrap of the ghost slot, no
truncated names, no h-scroll). The snap value is the *clean* floor.

| Section | Clean floor | Clip floor | Binding constraint | How to lower the clean floor |
|---|---|---|---|---|
| **Available Powers** | ~260px | ~200px | internal `grid-cols-2` split (Primary \| Secondary sub-lists) — each sub-col ≈125px at 260, names truncate to "Behea"/"Evolvi Armor" below | make the 2-col split stack to 1 col below a breakpoint (container query) → ~200px |
| **Selected** (Primary / Secondary / Pool) | ~240px | ~200px | the slot row is **6 md-hexes (24px) + ghost + optional toggle** ≈220px content; the ghost is the 7th item and wraps first, floating the bottom-aligned icon onto its own line | drop slot size lg→sm (24→20px) → ~190px |
| **Info Panel** | ~240px | ~240px | fixed multi-col stat tables (POWER EFFECTS `STAT/BASE/ENHANCED/FINAL`, DAMAGE tiles) don't reflow → h-scrollbar below ~240px (scrolls gracefully, not a hard break) | reflow the stat table to stacked rows under a breakpoint |
| **Powers by Level** (chrono) | ~240px (inferred) | ~200px | reuses the same slotted rows grouped by level; shares the Selected floor | same as Selected |

**Verified in-app 2026-07-09:** at a forced `260px / 240px / 230px` column split on a
build with fully 6-slotted powers, Primary (260) and Secondary (240, *with* toggles)
both render the full slot row + ghost inline, icon inline, zero deform. The deform the
user reported was at the 200–220px *clip* floor, below the clean floor.

**Snap-stop conclusion.** Sections are freely reorderable (any section can occupy any
column), so the safe *global* min-width is the max of the clean floors ≈ **260px**.
Clamp/snap columns to ≥260px and free horizontal resize needs **zero** changes to any
section internals — the slot-row deform does not occur at this width. Optional later
unlocks, in order of payoff: (1) make Available's 2-col split responsive → ~240px
global (then Selected + Info are the joint floor); (2) shrink Selected slot size + (3)
reflow Info stat tables → ~200px. Ship **clamp-at-260** first; these are independent
follow-ups, not prerequisites.

## Deferred

- Tier 2 remainder: the *horizontal* axis shipped in LAY7 (column resize on the
  `weight` field). Still deferred: vertical resize / 2D free-form dock grid
  (react-grid-layout-style). The audit found vertical is render-safe (bodies scroll)
  but a 2D grid needs a mobile/reset story and is a larger lift.
- Optional floor-lowering follow-ups (from the audit; independent, not blocking):
  make Available's `grid-cols-2` split responsive (→240px global floor), then shrink
  Selected slot size + reflow Info stat tables (→200px). Only worth it if users hit
  the 260px clamp and want narrower columns.
- Unify the two hand-rolled floating-window implementations
  ([PopOutInfoPanel.tsx](../src/components/info/PopOutInfoPanel.tsx) +
  [SetBonusPopup.tsx](../src/components/info/SetBonusPopup.tsx), which duplicate the
  same drag/resize/portal code with non-persisted positions) into one reusable
  drag/dock primitive. Not required for Tier 1; do not let it creep into this pass.
- Extend rearrangeability to app chrome beyond the planner grid (StatsDashboard as
  a dockable side column, etc.). StatsDashboard assumes a wide-short horizontal
  band — needs layout testing before it's a candidate.
