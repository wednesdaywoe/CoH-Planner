/**
 * Power Surge — OVERRIDES LAYER
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
    "durations": {
      "resistance": 30,
      "recoveryBuff": 30,
      "regenBuff": 30,
      "knockup": 30,
      "knockback": 30,
      "repel": 30,
      "mezResistance": 30,
      "debuffResistance": 30,
      "stealth": 29,
      "hold": 30,
      "immobilize": 30,
      "stun": 30,
      "sleep": 30
    },
    "hold": {
      "mag": 1,
      "scale": 50,
      "table": "Melee_Res_Boolean"
    }
  }
};
