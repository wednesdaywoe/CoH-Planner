/**
 * Athletic Regulation — OVERRIDES LAYER
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
    "movement": {
      "runSpeed": {
        "scale": 0.075,
        "table": "Melee_SpeedRunning"
      },
      "flySpeed": {
        "scale": 0.075,
        "table": "Melee_SpeedFlying"
      }
    },
    "debuffResistance": {
      "defense": {
        "scale": 0.75,
        "table": "Melee_Res_Boolean"
      }
    }
  }
};
