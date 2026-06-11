/**
 * Galvanic Sentinel — OVERRIDES LAYER
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
  "description": "Summons a Galvanic Sentinel to your aid. The Galvanic Sentinel shocks and weakens your foes, draining some endurance and reducing their regeneration, recovery, and damage output. The Galvanic Sentinel can be buffed and healed, and may be targeted with your Circuit powers.Recharge: Slow.",
  "allowedSetCategories": [
    "Endurance Modification"
  ],
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_GalvanicSentinel",
      "duration": 120,
      "copyBoosts": true
    }
  }
};
