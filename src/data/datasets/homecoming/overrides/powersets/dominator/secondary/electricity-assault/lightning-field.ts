/**
 * Lightning Bolt — OVERRIDES LAYER
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
    "Universal Damage Sets"
  ],
  "damage": {
    "type": "Energy",
    "scale": 1.64,
    "table": "Ranged_Damage"
  },
  "effects": {
    "enduranceDrain": {
      "scale": 0.1,
      "table": "Ranged_Ones"
    }
  }
};
