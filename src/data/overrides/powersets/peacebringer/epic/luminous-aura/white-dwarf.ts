/**
 * White Dwarf — OVERRIDES LAYER
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
  "description": "Kheldians are masters of energy and matter. A Peacebringer can transform into a massive unstoppable energy beast known as a White Dwarf. When you choose this power, you will have access to 6 other powers that can only be used while in this form. You will not be able to use any other powers while in White Dwarf form. White Dwarf has awesome resistance to all damage except Psionics, as well as controlling effects. White Dwarf also has improved HP and Endurance Recovery, but is limited to melee attacks.  Recharge: Very Fast.",
  "stats": {},
  "effects": {
    "knockup": {
      "scale": 100,
      "table": "Melee_Ones"
    },
    "knockback": {
      "scale": 100,
      "table": "Melee_Ones"
    },
    "durations": {
      "confuse": 2.03,
      "fear": 2.03,
      "hold": 2.03,
      "immobilize": 2.03,
      "knockback": 2.03,
      "knockup": 2.03,
      "maxHPBuff": 2,
      "movement": 2,
      "protection": 2,
      "recoveryBuff": 2,
      "resistance": 2,
      "sleep": 2.03,
      "stun": 2.03,
      "threatBuff": 2
    }
  }
};
