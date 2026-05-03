/**
 * Zapp — OVERRIDES LAYER
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
  "allowedSetCategories": [
    "Endurance Modification",
    "Ranged Damage",
    "Sniper Attacks",
    "Universal Damage Sets"
  ],
  "damage": {
    "type": "Energy",
    "scale": 4.5,
    "table": "Ranged_Damage"
  },
  "effects": {
    "enduranceDrain": {
      "scale": 0.15,
      "table": "Ranged_Ones"
    },
    "recoveryDebuff": {
      "scale": 1,
      "table": "Ranged_Ones"
    },
    "durations": {
      "recoveryDebuff": 4
    },
    "enduranceGain": {
      "scale": 7.2,
      "table": "Ranged_Ones"
    },
    "buffDuration": 4
  }
};
