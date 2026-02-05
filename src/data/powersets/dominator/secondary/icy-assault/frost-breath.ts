/**
 * Frost Breath
 * Close (Cone), Moderate DoT(Cold), Foe -Recharge, -SPD
 *
 * Source: dominator_assault/icy_assault/frost_breath.json
 */

import type { Power } from '@/types';

export const FrostBreath: Power = {
  "name": "Frost Breath",
  "internalName": "Frost_Breath",
  "available": 19,
  "description": "Unleashes a cone of frosty breath that can Slow your opponents' movement and attacks. Very accurate and very deadly at medium range.Damage: Moderate.Recharge: Slow.",
  "shortHelp": "Close (Cone), Moderate DoT(Cold), Foe -Recharge, -SPD",
  "icon": "iceassault_frost.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.2,
    "range": 40,
    "radius": 40,
    "arc": 0.5236,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 2.67,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Cold",
    "scale": 0.7,
    "table": "Ranged_Damage",
    "duration": 0.6,
    "tickRate": 0.5
  },
  "effects": {
    "movement": {
      "jumpHeight": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      },
      "runSpeed": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.2,
      "table": "Ranged_Slow"
    }
  }
};
