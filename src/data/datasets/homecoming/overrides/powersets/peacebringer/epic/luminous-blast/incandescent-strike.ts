/**
 * Incandescent Strike — OVERRIDES LAYER
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
  "description": "Incandescent Strike is an absolutely devastating melee attack that focuses all of the Kheldian's energy and strength into a single massive blow. This slow but incredibly devastating attack can knock out most opponents, leaving them Held. Incandescent Strike can also bring down fliers, Knock Down foes, and reduce their Defense.  Damage: Extreme. Recharge: Slow.",
  "targetType": "Foe (Alive)"
};
