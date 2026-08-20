/**
 * Whether a specific enhancement is legal in a specific power.
 *
 * This composes the SAME authoritative sources the Enhancement Picker uses to
 * build its lists, so "can I slot X here?" always agrees with "does X appear in
 * the picker for this power?":
 *   - IO sets        → `getIOSetsForPower(power.allowedSetCategories)`
 *   - generic / SO   → `power.allowedEnhancements` (Homecoming's boosts_allowed)
 *   - special (Hami) → at least one aspect in `power.allowedEnhancements`
 *     (mirrors `filterSpecialEnhancements` in the enhancement registry)
 *
 * Used by the "move slot to another power" flow to decide whether a slotted
 * enhancement can travel with its slot or must be dropped at the destination.
 */
import type { Enhancement } from '@/types/enhancement';
import type { IOSetCategory } from '@/types/common';
import type { IOSet, IOSetPiece } from '@/types/enhancement';
import { getIOSetsForPower } from '@/data/io-sets';

/** Minimal slottable-host shape — anything carrying the game's allow-lists. */
export interface EnhancementHostPower {
  allowedEnhancements?: string[];
  allowedSetCategories?: IOSetCategory[];
}

/**
 * Whether a set piece may be PLACED into a power's slots right now — the rule
 * the picker's rows render as their disabled state, factored out so the bulk
 * placement paths (drag-range, multi-select) can re-ask it per piece. A drag
 * range sweeps every piece between its endpoints, disabled or not: without this
 * check a Superior ATO with its 2nd piece already slotted got that piece placed
 * AGAIN by a 1st→3rd drag — impossible slotting (2026-08-17 report).
 *
 * `compareMode` (Compare Slotting's virtual configuration) skips the build-wide
 * unique check, exactly as the render does — each configuration is independent.
 * Purple/ATO stay category-unique even where a fork ships `unique: 0` on a
 * piece (the tspy Primalist ATO); Event uniqueness lives in the per-piece flag.
 */
export function pieceSlottableNow(
  set: IOSet,
  piece: IOSetPiece,
  currentSlots: readonly (unknown | null)[],
  opts: { compareMode: boolean; isUniqueSlotted: (setId: string, pieceNum: number) => boolean },
): boolean {
  const setId = set.id || set.name;
  const inPower = currentSlots.some((enh) => {
    if (!enh || typeof enh !== 'object') return false;
    const io = enh as { type?: string; setId?: string; pieceNum?: number };
    return io.type === 'io-set' && io.setId === setId && io.pieceNum === piece.num;
  });
  if (inPower) return false;
  if (!opts.compareMode) {
    const isSpecialRarity = set.category === 'purple' || set.category === 'ato';
    if ((piece.unique || isSpecialRarity) && opts.isUniqueSlotted(setId, piece.num)) {
      return false;
    }
  }
  return true;
}

export function enhancementAllowedInPower(
  enh: Enhancement,
  power: EnhancementHostPower,
): boolean {
  const allowed = power.allowedEnhancements ?? [];
  switch (enh.type) {
    case 'io-set':
      // A set piece is legal iff its parent set is among the sets the power
      // surfaces — same filter the picker applies for its set list.
      return getIOSetsForPower(power.allowedSetCategories ?? []).some(
        (s) => s.id === enh.setId,
      );
    case 'io-generic':
    case 'origin':
      // Single-aspect enhancers: the aspect must be in the allow-list.
      return allowed.includes(enh.stat);
    case 'special':
      // Multi-aspect specials (Hamidon/Titan/…): legal if ANY aspect is allowed,
      // matching the registry's `filterSpecialEnhancements`.
      return enh.aspects.some((a) => allowed.includes(a.stat));
  }
}
