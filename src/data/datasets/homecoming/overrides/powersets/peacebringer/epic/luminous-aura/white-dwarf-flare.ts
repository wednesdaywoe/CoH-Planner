/**
 * White Dwarf Flare — OVERRIDES LAYER
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
  "description": "You channel the might of your Kheldian energy into the very Earth itself. The ground erupts and cracks with luminous energy, blasting all nearby foes, knocking them back and reducing their defense. This power is only available while in White Dwarf Form.  Damage: Light. Recharge: Slow."
};
