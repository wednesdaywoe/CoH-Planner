/**
 * Radiant Strike — OVERRIDES LAYER
 *
 * Hand-written deltas applied on top of the generated power object via
 * `withOverrides()`. Each field below is a value the previously-committed
 * composed file carried that the current CoD2-raw extraction does not.
 * Keep them — the CoD2 archive we convert from is a snapshot, and these
 * overrides are where current HC values live when they've drifted from
 * that snapshot. See src/data/README.md.
 */
import type { Power } from '@/types';

export const overrides: Partial<Power> = {
  "description": "The Radiant Strike is a slow melee attack, but makes up for it with superior damage. Radiant Strike releases Kheldian light on impact, which can Knock Back foes, bring down fliers, and reduce a target's Defense.  Damage: High. Recharge: Moderate.",
  "targetType": "Foe (Alive)",
  "effects": {
    "slow": {
      "fly": {
        "scale": 1,
        "table": "Melee_Ones"
      }
    },
    "buffDuration": 30,
    "durations": {
      "defenseDebuff": 6,
      "slow": 30
    }
  }
};
