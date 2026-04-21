/**
 * Smoke Grenade — OVERRIDES LAYER
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
  "internalName": "Nw_Smoke_Grenade",
  "description": "The Smoke Grenade envelops all those in the affected area in a cloud of smoke. Most villains will not be able to see past normal melee range, although some may have better perception. If the villains are attacked, they will be alerted to your presence, but will suffer a penalty to their chance to hit. ",
  "targetType": "Foe (Alive)",
  "effects": {
    "tohitDebuff": {
      "scale": 0.5,
      "table": "Melee_DeBuff_ToHit"
    },
    "durations": {
      "perceptionDebuff": 60,
      "tohitDebuff": 60
    }
  }
};
