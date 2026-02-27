/**
 * Wormhole
 * Ranged (Targeted AoE), Foe Teleport, Disorient, Knockback
 *
 * Source: controller_control/gravity_control/wormhole.json
 */

import type { Power } from '@/types';

export const Wormhole: Power = {
  "name": "Wormhole",
  "internalName": "Wormhole",
  "available": 21,
  "description": "You can open a gravitational Wormhole behind a targeted foe and violently push them, and all nearby foes, through it. The victims are sent flying out the other end of the Wormhole and are left Disoriented. You determine the location of the Wormhole's end, and can place it high in the air if desired. More powerful foes may be resistant to the Wormhole effects.",
  "shortHelp": "Ranged (Targeted AoE), Foe Teleport, Disorient, Knockback",
  "icon": "gravitycontrol_wormhole.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 20,
    "recharge": 90,
    "endurance": 15.6,
    "castTime": 3,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "Knockback",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Controller Archetype Sets",
    "Knockback",
    "Stuns",
    "Teleport",
    "Universal Travel"
  ],
  "maxSlots": 6,
  "effects": {
    "stealth": {
      "translucency": {
        "scale": 0,
        "table": "Ranged_Ones"
      }
    },
    "teleport": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "stun": {
      "mag": 3,
      "scale": 10,
      "table": "Ranged_Stun"
    },
    "knockback": {
      "scale": 7,
      "table": "Ranged_Knockback"
    }
  }
};
