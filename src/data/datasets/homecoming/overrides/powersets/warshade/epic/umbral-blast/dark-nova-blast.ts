/**
 * Dark Nova Blast — OVERRIDES LAYER
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
  "description": "A much more powerful, yet slower version of Dark Nova Bolt. Dark Nova Blast sends focused negative Nictus energy at a foe. This attack can knock down foes and will leave the targets' attack and movement speed slowed. This power is only available while in Dark Nova Form.  Damage: Light. Recharge: Fast.",
  "effects": {
    "rechargeDebuff": {
      "scale": 0.2,
      "table": "Ranged_Slow"
    },
    "buffDuration": 6
  }
};
