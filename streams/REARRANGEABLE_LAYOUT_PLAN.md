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
- [x] **LAY5** — layout control UI. First shipped as a "Columns" popover in the
  hint bar, then relabeled "Layout" and moved to the dashboard toolbar (next to
  Configure/Controls) as `LayoutModal` — a view-aware ordered list with up/down
  reorder + show/hide checkboxes + Reset (decision 2026-07-09, user-chosen: the
  hint-bar popover risked going unnoticed and the toolbar row's `overflow-x-auto`
  would clip an inline popover, so a modal matches the row's other buttons).
  Column-header drag still works as a power-user affordance.
  verify: file:src/components/modals/LayoutModal.tsx, fn:openLayoutModal
- [x] **LAY6** — InfoPanel undock reconciled with visibility: an undocked info
  column leaves the grid regardless of its stored `visible` flag; the Columns menu
  shows it as "floating" and disables its checkbox while undocked.
  verify: file:src/pages/PlannerPage.tsx

## Deferred

- Tier 2: independently resizable / free-form dock grid on the same `plannerLayout`
  slice (react-grid-layout-style). Grows from LAY1's data model.
- Unify the two hand-rolled floating-window implementations
  ([PopOutInfoPanel.tsx](../src/components/info/PopOutInfoPanel.tsx) +
  [SetBonusPopup.tsx](../src/components/info/SetBonusPopup.tsx), which duplicate the
  same drag/resize/portal code with non-persisted positions) into one reusable
  drag/dock primitive. Not required for Tier 1; do not let it creep into this pass.
- Extend rearrangeability to app chrome beyond the planner grid (StatsDashboard as
  a dockable side column, etc.). StatsDashboard assumes a wide-short horizontal
  band — needs layout testing before it's a candidate.
