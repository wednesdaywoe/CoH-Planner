/**
 * PlannerHintBar
 *
 * Thin contextual-help strip sandwiched between the dashboard/quickbar and
 * the power column grid. Text comes from the `hoverHint` field of uiStore —
 * components emit a hint string on mouseenter and clear it on mouseleave.
 * When no hint is active the bar shows an idle placeholder so layout stays
 * stable.
 *
 * All hint copy lives here (`HINTS`) so it can be edited in one place. State-
 * dependent messages (slot hints, ghost hints) are selected via small helper
 * functions exported alongside the map.
 */

import { useUIStore } from '@/stores';

// ============================================
// Centralized hint text
// ============================================
//
// Keep all user-facing hint strings here. Components should either reference
// `HINTS.<key>` directly for fixed messages or use a selector helper
// (`getSlotHint`, `getGhostHint`) for state-dependent variants.

export const HINTS = {
  // Shown when nothing is being hovered (fallback in the bar itself).
  idle:
    'Press D to toggle the dashboard. Press T to toggle the responsive info panel. While info panel is open, hold shift to make it persist.',

  // Dashboard-level hover — explains stat tracking + set-bonus highlighting.
  dashboard:
    'Click any stat to Track it. When selecting enhancements, sets that boost Tracked stats are highlighted. Configure your dashboard with the ⛭ button above.',

  // Enhancement slots (TouchableSlot)
  emptySlot: 'Click to add an enhancement',
  emptySlotRemovable:
    'Click to add an enhancement · Right-click to remove slot · Right-click & drag to remove multiple',
  filledSlot: 'Click to change enhancement · Right-click to remove',
  filledSlotRemovable:
    'Click to change enhancement · Right-click to remove · Right-click & drag to remove multiple',

  // Ghost add/remove button (DraggableSlotGhost)
  ghostAddAndRemove:
    'Click to add a slot · Right-click to remove · Click & drag right for multiple',
  ghostAddOnly: 'Click to add a slot · Click & drag right for multiple',
  ghostRemoveOnly: 'Right-click to remove a slot · Right-click & drag for multiple',
} as const;

// ============================================
// Selectors for state-dependent hints
// ============================================

/** Pick the right slot hint given whether the slot is filled and whether the
 *  slot itself is removable (slot 0 is never removable). */
export function getSlotHint(hasEnhancement: boolean, canRemoveSlot: boolean): string {
  if (hasEnhancement) {
    return canRemoveSlot ? HINTS.filledSlotRemovable : HINTS.filledSlot;
  }
  return canRemoveSlot ? HINTS.emptySlotRemovable : HINTS.emptySlot;
}

/** Pick the right ghost-button hint. Both `canAdd` and `canRemove` can be
 *  false simultaneously (e.g., fully-slotted power with no remove callback
 *  wired) — caller should simply not render the button in that case. */
export function getGhostHint(canAdd: boolean, canRemove: boolean): string {
  if (canAdd && canRemove) return HINTS.ghostAddAndRemove;
  if (canAdd) return HINTS.ghostAddOnly;
  return HINTS.ghostRemoveOnly;
}

// ============================================
// Bar component
// ============================================

export function PlannerHintBar() {
  const hint = useUIStore((s) => s.hoverHint);

  return (
    <div className="hidden md:flex border-b border-slate-700 bg-slate-800/60 px-3 py-1 text-[11px] text-slate-300 min-h-[1.75rem] items-center flex-shrink-0">
      {hint ? (
        <span className="truncate">{hint}</span>
      ) : (
        <span className="text-slate-400 italic">{HINTS.idle}</span>
      )}
    </div>
  );
}
