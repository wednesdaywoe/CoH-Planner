/**
 * Tactical Training: Leadership — OVERRIDES LAYER
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
  "stats": {},
  "effects": {
    "confuse": {
      "mag": 1,
      "scale": 1.75,
      "table": "Ranged_Res_Boolean"
    },
    "fear": {
      "mag": 1,
      "scale": 1.75,
      "table": "Ranged_Res_Boolean"
    },
    "durations": {
      "confuse": 2.25,
      "fear": 2.25,
      "perceptionBuff": 2.25,
      "tohitBuff": 2.25
    }
  }
};
