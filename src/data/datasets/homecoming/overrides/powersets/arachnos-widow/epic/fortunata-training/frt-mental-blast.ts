/**
 * Mental Blast — OVERRIDES LAYER
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
  "internalName": "Frt_Mental_Blast",
  "targetType": "Foe (Alive)",
  "effects": {
    "rechargeDebuff": {
      "scale": 0.3,
      "table": "Ranged_Slow"
    },
    "buffDuration": 6,
    "durations": {
      "rechargeBuff": 6
    }
  }
};
