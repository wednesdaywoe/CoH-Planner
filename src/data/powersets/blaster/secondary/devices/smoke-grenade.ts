/**
 * Smoke Grenade
 * Ranged (Target AoE), Foe -Perception, -To Hit
 *
 * Source: blaster_support/gadgets/smoke_grenade.json
 */

import type { Power } from '@/types';

export const SmokeGrenade: Power = {
  "name": "Smoke Grenade",
  "internalName": "Smoke_Grenade",
  "available": 15,
  "description": "The Smoke Grenade envelops all those in the affected area in a cloud of smoke. Most villains will not be able to see past normal melee range, although some may have better perception. If the villains are attacked, they will be alerted to your presence, but will suffer a penalty to their chance to hit.Recharge: Slow.",
  "shortHelp": "Ranged (Target AoE), Foe -Perception, -To Hit",
  "icon": "gadgets_smokegrenade.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 35,
    "recharge": 15,
    "endurance": 7.8,
    "castTime": 1.37,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "ToHit Debuff",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "To Hit Debuff"
  ],
  "maxSlots": 6,
  "effects": {
    "tohitDebuff": {
      "scale": 0.7,
      "table": "Melee_DeBuff_ToHit"
    },
    "perceptionDebuff": {
      "scale": 0.9,
      "table": "Melee_Ones"
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
