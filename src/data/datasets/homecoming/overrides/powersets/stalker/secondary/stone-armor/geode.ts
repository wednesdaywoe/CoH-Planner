/**
 * Geode — OVERRIDES LAYER
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
  "effects": {
    "regenBuff": {
      "scale": 7.5,
      "table": "Melee_Ones"
    },
    "durations": {
      "regenBuff": 0.2,
      "recoveryBuff": 0.2,
      "mezResistance": 0.2,
      "knockup": 0.2,
      "knockback": 0.2,
      "slow": 0.2,
      "untouchable": 0.2,
      "damageDebuff": 0.2,
      "taunt": 0.2
    },
    "recoveryBuff": {
      "scale": 3,
      "table": "Melee_Ones"
    }
  }
};
