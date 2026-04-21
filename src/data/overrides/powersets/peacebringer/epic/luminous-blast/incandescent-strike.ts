/**
 * Incandescent Strike — OVERRIDES LAYER
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
  "description": "Incandescent Strike is an absolutely devastating melee attack that focuses all of the Kheldian's energy and strength into a single massive blow. This slow but incredibly devastating attack can knock out most opponents, leaving them Held. Incandescent Strike can also bring down fliers, Knock Down foes, and reduce their Defense.  Damage: Extreme. Recharge: Slow.",
  "targetType": "Foe (Alive)",
  "effects": {
    "slow": {
      "fly": {
        "scale": 1,
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
