/**
 * White Dwarf Smite — OVERRIDES LAYER
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
  "description": "White Dwarf Smite is powerful melee attack that can often Disorient or Knock Down opponents. White Dwarf Smite can also bring down fliers, and reduce their defense. This power is only available while in White Dwarf Form.  Damage: Light. Recharge: Fast.",
  "targetType": "Foe (Alive)",
  "requires": "White Dwarf",
  "effects": {
    "slow": {
      "fly": {
        "scale": 1.6,
        "table": "Melee_Ones"
      }
    },
    "buffDuration": 30,
    "durations": {
      "defenseDebuff": 10,
      "slow": 30
    }
  }
};
