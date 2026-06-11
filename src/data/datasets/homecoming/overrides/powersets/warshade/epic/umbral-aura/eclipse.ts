/**
 * Eclipse — OVERRIDES LAYER
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
  "description": "The dark Nictus power allows you to tap the essence of your foe's soul and transfer it to yourself. This will drain the Endurance of all nearby enemies and add to your own. It will also increase your resistance to all damage. The more foes affected, the more Endurance and Damage Resistance you will gain. Affected foes are unable to recover Endurance for a short while.  Recharge: Very Long."
};
