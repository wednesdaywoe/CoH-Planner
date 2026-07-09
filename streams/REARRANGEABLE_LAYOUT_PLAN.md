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
- [x] **LAY9** — lower the global column floor 260→**240px** by removing Available's
  binding constraint: its internal Primary\|Secondary `grid-cols-2` split is now a
  **Tailwind v4 container query** (`@container` wrapper + `grid-cols-1
  @min-[280px]:grid-cols-2`) keyed off the *column's own* width (not the viewport —
  columns resize independently), so below ~280px the two sub-lists stack full-width
  instead of truncating. Available's clean floor drops to ~200px; the new binding
  floors are Selected + Info at ~240px, so `MIN_COL_PX = 240`. This fits all six
  columns in ~1455px (vs 1560px before). Verified in-app: at a 205px Available column
  the split stacks with zero name truncation; at 240px every column (6-slot rows,
  info tables) renders clean, no deform. Going below 240 needs the two remaining
  audit unlocks (Info table reflow + Selected slot-shrink) — deferred as
  disproportionate for the last 40px. verify: file:src/pages/PlannerPage.tsx, fn:MIN_COL_PX
- [x] **LAY9b** — validate the 240 floor for *toggled* powers. In-app the audit's
  240 "clean" was optimistic: a 6-slot power **with a toggle** (defense sets like
  Bio Armor) actually needed ~262px because the toggle shared the slot row's width,
  so the ghost slot wrapped onto a 3rd line and the bottom-aligned icon dropped with
  it (user-reported on DNA Siphon). Fix: in the stacked `PowerRow`, the toggle moved
  from beside the slots into the name row (next to the info/compare/remove buttons),
  so the slot row gets the full column width. Measured: the slot run went 1 row of 7
  items at 240px (was wrapping to 2), row height 86→60px. Toggles now group with the
  other row controls — a consistency win at all widths, not just narrow. Inline
  layout (chronological) unchanged — it's a single wide column, rarely squeezed.
  verify: file:src/components/powers/PowerRow.tsx, fn:renderNameRow

- [x] **LAY10** — unify the two hand-rolled floating windows
  ([PopOutInfoPanel.tsx](../src/components/info/PopOutInfoPanel.tsx) +
  [SetBonusPopup.tsx](../src/components/info/SetBonusPopup.tsx)) into one reusable
  `FloatingWindow` primitive. Both duplicated the *same* drag/resize/portal code —
  identical `DEFAULT_WIDTH`/`MIN_WIDTH` constants, `onDragStart`/`onResizeStart`, the
  global `mousemove`/`mouseup` clamp math, the `createPortal(...document.body)` shell,
  and the corner-handle SVG. Extracted `<FloatingWindow title headerRight={…}
  defaultWidth defaultHeight minWidth minHeight defaultY persistKey?>` which owns
  position/size + the drag/resize listeners; each caller is now ~10 lines of body + a
  header action. New capability earned cheaply: **persist position & size** to
  `uiStore.floatingWindows` (keyed by `persistKey` — `info-panel` / `set-bonus-totals`;
  added to `partialize`, defaults `{}`) — positions were non-persisted before.
  `SetBonusPopup`'s touch branch (Modal sheet) is untouched; only the desktop floating
  branch moved into the primitive. **Implementation gotcha found in-app:** the persist
  write on `mouseup` must read geometry from a ref updated *synchronously in the move
  handler*, not one synced during render — the initial ref-per-render approach
  persisted a stale (pre-final-move) position because `mouseup` fires before React
  commits the last `mousemove`'s `setState`. Verified in-app (Playwright): both windows
  open at defaults, drag + corner-resize track 1:1, geometry persists to
  `coh-planner-ui` under independent keys, a reload + re-pop restores the saved
  position/size, Dock/Close still work, zero console errors, store tests + tsc green.
  verify: file:src/components/ui/FloatingWindow.tsx

## Planned

- [x] **LAY11** — 2D dock grid (vertical stacking). SHIPPED 2026-07-09. The
  desktop grid was a **single row** of `minmax(240px, Nfr)` columns with horizontal
  resize (LAY7); a column can now hold 2+ sections stacked vertically, making the
  workspace a true 2D grid. Shape = **"stacked cells in columns", NOT free-form**
  (a power tray is a tall column by convention; the one wide-short panel,
  StatsDashboard, is deliberately not a grid member), so column-stacking adds zero
  dependency, reuses the LAY7 divider rotated to Y, degrades to the single-column
  mobile fallback for free, and inherits Reset — the same "no new dep unless it
  earns its weight" call LAY4 made vs dnd-kit. Rejected: free-form
  react-grid-layout (dep weight + bespoke mobile fallback + collision/compaction +
  spanning tiles these panels don't want).
  **Open sub-decisions — settled at build (2026-07-09, user-chosen):**
  (a) **data shape = flat `column` index + `rowWeight` on each `PlannerSectionConfig`**
  (chosen over nested `columns[]`): keeps the persisted slice one flat array per
  view and is a *superset* of the pre-LAY11 type, so `merge()`'s filter-known /
  append-missing reconcile is nearly unchanged (`reconcilePlannerColumns` just
  backfills `column` for legacy entries → the historical single row, and appends
  new sections in fresh trailing columns).
  (b) **reorder DnD gains a vertical axis** (chosen over menu-only): dropping a
  header on the top/bottom quarter of a cell stacks above/below; the middle
  splits left/right into a new column before/after target — a colored 3px edge bar
  marks the live zone. The Layout menu stays as the accessible fallback (its
  up/down became **left/right column shift** via `shiftColumn`, since array-swap
  no-ops under `column` pinning; creating stacks is drag-only).
  (c) **per-cell min-height floor = 120px** (`MIN_CELL_PX`; the audit found the
  vertical axis render-safe — bodies scroll — so this is a UX floor, not a clip
  constraint; the vertical resize clamps both neighbors to it).
  **Content-first default split (refined 2026-07-09, user-raised):** a fresh stack
  does NOT split 50/50. Until the user drags a divider, a column is *content-driven*
  (`flex: 1 1 auto` → each cell sizes to its own contents, shrinking proportionally
  only when the column can't fit everything), so a tall upper cell keeps its height
  instead of being forced to half + a scrollbar. Dragging a divider converts the
  whole column to *weight-driven* (`flex-basis: 0` + per-cell `rowWeight`), seeded
  from the cells' *measured px heights* so the transition is seamless (no jump);
  `startRowResize` reads live DOM heights, not stored weights. `applyDrop` clears
  the receiving column's `rowWeight`s on a stack so it re-defaults to content-first
  (invariant: a column's cells are all-or-nothing on `rowWeight`, never mixed).
  **Implementation:** new pure `src/utils/planner-layout.ts`
  (`toColumns`/`fromColumns`/`applyDrop`/`shiftColumn`/`reconcilePlannerColumns`,
  shared by the store migration + page + menu; 17 unit tests) — every mutation
  renormalizes `column` dense (0..N-1) column-major so the flat list is always
  canonical. Store gains `setPlannerSectionRowWeights` (vertical twin of
  `setPlannerSectionWeights`). `startColumnResize` rewired to columns (writes the
  topmost section's `weight`); new `startRowResize` is its Y-axis twin. **Weight
  ambiguity accepted (v1):** a column's horizontal weight lives on its *topmost*
  section, so restacking can reset a custom column width to 1fr — documented,
  Reset fixes it. Verified in-app (Playwright): stacked render is clean (Available+
  Inherent / Primary+Secondary), DnD drop-zone marker + stacking work, vertical
  resize shifts + persists `rowWeight` (500/200 split), horizontal resize still
  tracks, menu shows column grouping ("6/6 shown in 4 columns") + Reset restores
  the 6-column row, and the stack survives reload (migration/reconcile). tsc clean
  (LAY11 files), 20 store+util tests green.
  **Height-chain gotcha found in-app:** a stacked column needs a *definite* height
  for `flexGrow`/`rowWeight` to split — but the desktop grid was never actually
  bounded: `main` is a `display:block` box, so the grid's long-standing `flex-1`
  was inert and the grid sized to *content*. Once cells got `flexBasis:0` +
  `minHeight:120`, that content contribution collapsed to 120px and clipped the
  power lists (user-reported: whole lower half blank). Fix: wrap the desktop
  workspace in `lg:absolute lg:inset-0 lg:flex lg:flex-col` (main is already
  `relative`) so the grid fills `main` with a real height — columns now scroll
  internally instead of growing the page, and split/resize work without a forced
  height. Kept a plain block below `lg` so the mobile fallback's original page-grow
  flow is untouched. (Also fixes a latent pre-existing clip for very tall builds.)
  verify: file:src/utils/planner-layout.ts, file:src/pages/PlannerPage.tsx, fn:startRowResize

- [ ] **LAY12** — adjustability affordance. Problem (user-raised 2026-07-09): the
  rearrange/resize handles are undiscoverable — the LAY7 column-resize divider is
  `bg-transparent` until hover ([PlannerPage.tsx](../src/pages/PlannerPage.tsx),
  the `group-hover/resize` rule ~line 431) and the header reorder grip is a faint
  low-contrast grey, so a user with no visual cue won't know the layout moves. Give
  the container borders a *persistent* (not hover-only) signal that they're
  adjustable. Covers **both** axes — the existing horizontal dividers and LAY11's
  future vertical ones — so factor the divider into a shared styled element rather
  than restyling each call site. Design sub-decisions (settle at build): resting
  treatment (e.g. a faint always-on seam that brightens on hover, vs. a small grip
  dot/handle centered on the divider), whether to lift the header grip's resting
  contrast to match, and whether the cue should be dampened once a user has
  interacted (a "you've found it" fade) or stay always-on. Keep it subtle enough not
  to clutter a 6-column row. Related: LAY4 (grip), LAY7 (horizontal divider), LAY11
  (vertical dividers inherit whatever this establishes).
  verify: file:src/pages/PlannerPage.tsx

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
| **Available Powers** | ~200px (was ~260) | ~200px | ~~internal `grid-cols-2` split truncates sub-col names~~ **FIXED (LAY9):** split is now container-query responsive, stacks to 1 col below ~280px | done |
| **Selected** (Primary / Secondary / Pool) | ~240px (toggled: was ~262 pre-fix) | ~200px | slot row = **6 md-hexes + ghost** (~180px) + a toggle that *shared the row*; on toggled powers (defense sets) the toggle stole ~24px so the ghost wrapped, dragging the bottom-aligned icon to a 3rd line. **FIXED (LAY9b): toggle moved into the name row**, freeing the full width for slots → toggled powers now hold one slot row at 240 | drop slot size lg→sm (24→20px) → ~190px |
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
  `weight` field); the *vertical* axis (2D dock grid / stacking) **shipped as LAY11**
  (2026-07-09; flat `column`+`rowWeight` shape, vertical-DnD stacking, Y-axis resize
  divider). The full 2D workspace is now in place.
- Floor-lowering: **240px is the final floor (decision 2026-07-09).** Available
  split responsive shipped (LAY9, →240) and the toggled-slot wrap fixed (LAY9b), so
  240 is clean for every section. The push to ~200 was scoped and **declined** — it
  needs (a) container-responsive slot sizing in TouchableSlot (a core component;
  size is a mix of CSS classes + JS pixel numbers → broad blast radius) and (b)
  reflowing ~8 shared info stat-table grids, and in-app measurement showed the Info
  panel below 240 only *h-scrolls* (~16px over at 210px, graceful — not a deform).
  Disproportionate for the last 40px, **especially since narrow-screen users already
  have the escape hatch: hide a column** (5×240 = 1200px fits a 1366px laptop). Only
  revisit if a real user complaint lands. (A CSS-`zoom`-based density shrink was
  identified as the cheap way to hit ~205 if ever wanted.)
- Unifying the two hand-rolled floating windows into one reusable drag/dock
  primitive **shipped as LAY10** (2026-07-09; `FloatingWindow` + optional geometry
  persistence). Was correctly kept out of the Tier-1 pass; it is independent of the
  dock grid (floating panels ≠ the docked workspace), so LAY10 and LAY11 carried no
  dependency between them.
- Extend rearrangeability to app chrome beyond the planner grid (StatsDashboard as
  a dockable side column, etc.). StatsDashboard assumes a wide-short horizontal
  band — needs layout testing before it's a candidate.
