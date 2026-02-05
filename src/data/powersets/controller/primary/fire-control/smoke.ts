/**
 * Smoke
 * Ranged (Targeted AoE), Foe -Perception, -To Hit
 *
 * Source: controller_control/fire_control/smoke.json
 */

import type { Power } from '@/types';

export const Smoke: Power = {
  "name": "Smoke",
  "internalName": "Smoke",
  "available": 5,
  "description": "Covers all foes near your target in clouds of Smoke. The villains are so blinded that they can hardly see a thing. Most villains will not be able to see past normal melee range, although some may have better perception. If the villains are attacked, they will be alerted to your presence, but will suffer a penalty to their chance to hit.",
  "shortHelp": "Ranged (Targeted AoE), Foe -Perception, -To Hit",
  "icon": "firetrap_smoke.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 35,
    "recharge": 15,
    "endurance": 7.8,
    "castTime": 1.17,
    "maxTargets": 16
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
    "perceptionDebuff": {
      "scale": 0.9,
      "table": "Ranged_Ones"
    },
    "tohitDebuff": {
      "scale": 0.5,
      "table": "Ranged_Debuff_ToHit"
    }
  }
};
