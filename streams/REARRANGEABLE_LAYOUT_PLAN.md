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

## Active

- [ ] **LAY1** — add persisted `plannerLayout` slice to `uiStore`: per-view-mode
  ordered array of `{ id, visible, weight? }`. Add to `partialize`; extend
  `merge()` to inject defaults when the key is absent (mirror the `statsConfig`
  default-injection). Reorder/toggle/reset actions modeled on `reorderStats`.
- [ ] **LAY2** — extract a `PlannerSection` registry: `Record<SectionId, { label,
  render }>` so section content is looked up by id rather than hard-coded JSX. The
  existing shared shell + `infoPanelHeader` const becomes the reusable `<Shell>`.
  needs: REARRANGEABLE_LAYOUT_PLAN#LAY1
- [ ] **LAY3** — drive the grid from the layout slice: compute
  `gridTemplateColumns` from visible sections' weights; delete the hard-coded
  `grid-cols-[1fr_1fr_1fr_1fr_1fr]` strings and the `md:`/`lg:` visibility
  duplication (incl. the md-only split columns) in favor of one map over visible
  sections. needs: REARRANGEABLE_LAYOUT_PLAN#LAY2
- [ ] **LAY4** — drag-to-reorder the top-level columns via dnd-kit (new dep; chosen
  for fit with the existing reorderable-stats mental model). needs:
  REARRANGEABLE_LAYOUT_PLAN#LAY3
- [ ] **LAY5** — layout control UI: visibility checklist popover (reuse the
  `statsConfig` control pattern) + a "reset layout" button (the escape hatch that
  makes the feature safe to ship). needs: REARRANGEABLE_LAYOUT_PLAN#LAY1
- [ ] **LAY6** — reconcile InfoPanel's existing `undocked` toggle with section
  visibility: treat undock as a section state — when popped out, the section is
  `visible:false` in the grid and the floating panel renders. One model, no
  special-casing. needs: REARRANGEABLE_LAYOUT_PLAN#LAY2

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
