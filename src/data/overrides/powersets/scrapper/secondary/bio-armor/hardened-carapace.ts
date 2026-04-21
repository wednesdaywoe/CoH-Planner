/**
 * Hardened Carapace — OVERRIDES LAYER
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
    "resistance": {
      "smashing": {
        "scale": 2.5,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 2.5,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 2.5,
        "table": "Melee_Res_Dmg"
      }
    },
    "durations": {
      "resistance": 0.75,
      "stun": 0.75,
      "sleep": 0.75
    }
  }
};
