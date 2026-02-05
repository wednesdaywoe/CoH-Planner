/**
 * Smoke Grenade
 * Ranged (Target AoE), Foe -Perception, -To Hit
 *
 * Source: arachnos-widow/night-widow-training
 */

import type { Power } from '@/types';

export const SmokeGrenade: Power = {
  "name": "Smoke Grenade",
  "available": 11,
  "description": "The Smoke Grenade envelops all those in the affected area in a cloud of smoke. Most villains will not be able to see past normal melee range, although some may have better perception. If the villains are attacked, they will be alerted to your presence, but will suffer a penalty to their chance to hit. ",
  "shortHelp": "Ranged (Target AoE), Foe -Perception, -To Hit",
  "icon": "nightwidowtraining_smokegrenade.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "ToHit Debuff"
  ],
  "allowedSetCategories": [
    "To Hit Debuff"
  ],
  "stats": {
    "accuracy": 1,
    "range": 110,
    "recharge": 15,
    "endurance": 7.8,
    "castTime": 1.37,
    "radius": 35,
    "maxTargets": 16
  },
  "targetType": "Foe (Alive)"
};
