# Session Notes — 2026-03-12

> **Delete this file when no longer needed.** It exists only to transfer context between machines.

## Current Branch: `feat/perma-tracker`

This branch has the perma tracker feature. You mentioned "seeing some problems" but didn't specify what — test it and let Claude know what's wrong.

### How to test perma tracking
1. Pick an archetype with a click buff power (e.g., Dominator → Domination: 90s duration, 200s base recharge)
2. Click the power in the tray to open the info panel
3. Look for the "Track Perma" toggle button (only appears for powers with both recharge and duration)
4. Toggle it on — a ring should appear around the power icon in the tray
5. Slot recharge enhancements and watch the ring fill (red → yellow → green)
6. Hover the ring for a tooltip with stats

### What's on this branch (not yet on main)
- `src/utils/calculations/perma.ts` — perma calculation logic
- `src/components/powers/PermaRing.tsx` — SVG ring component
- Info panel perma section, uiStore permaTrackedPowers state
- PowerCard/PowerRow wiring to render PermaRing
- Fix: inherent powers (Domination) now show execution stats (recharge/duration)
- Fix: `createArchetypeInherentPower` now propagates effects from archetype definition

### What's already on main (deployed)
- powerSet hydration fix (was using display name instead of ID → "Power not found")
- `fixPowerSetIds` in syncBuildDefinitions (fixes existing localStorage builds)
- `resetForNewBuild()` — New button clears all build-dependent UI state
- Domination archetype inherent now has `effects: { recharge: 200, buffDuration: 90 }`
- InherentPower type extended with optional `effects` property

### Discord OAuth status
Backend is on main (edge functions, auth store, header UI). See plan: `.claude/plans/cheeky-hatching-owl.md`. Remaining: claim-builds function, My Builds tab, ExportImport integration.
