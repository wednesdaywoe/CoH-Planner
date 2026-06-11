/**
 * White Dwarf — OVERRIDES LAYER
 *
 * Hand-written deltas applied on top of the generated power object via
 * `withOverrides()`. The generated layer is now sourced from the live HC
 * binary (exported_powers/), so the legacy numeric pins that used to live
 * here were stale CoD2 values and have been retired (2026-06 override audit).
 * Any remaining entries are display fixes or planner-only enrichments the
 * parser doesn't emit yet — prefer fixing the parser/converter over re-adding
 * an override. See GAME-DATA-PRINCIPLES.md §13 and src/data/README.md.
 */
import type { Power } from '@/types';

export const overrides: Partial<Power> = {
  "description": "Kheldians are masters of energy and matter. A Peacebringer can transform into a massive unstoppable energy beast known as a White Dwarf. When you choose this power, you will have access to 6 other powers that can only be used while in this form. You will not be able to use any other powers while in White Dwarf form. White Dwarf has awesome resistance to all damage except Psionics, as well as controlling effects. White Dwarf also has improved HP and Endurance Recovery, but is limited to melee attacks.  Recharge: Very Fast."
};
