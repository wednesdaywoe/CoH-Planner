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
import { getIOSetsForPower } from '@/data/io-sets';

/** Minimal slottable-host shape — anything carrying the game's allow-lists. */
export interface EnhancementHostPower {
  allowedEnhancements?: string[];
  allowedSetCategories?: IOSetCategory[];
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
