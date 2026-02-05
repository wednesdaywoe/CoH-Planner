/**
 * Ice Blast
 * Ranged, Light DMG(Cold/Smash), Foe -Recharge, -SPD
 *
 * Source: dominator_assault/icy_assault/ice_blast.json
 */

import type { Power } from '@/types';

export const IceBlast: Power = {
  "name": "Ice Blast",
  "internalName": "Ice_Blast",
  "available": 9,
  "description": "Ice Blast hurls shards of ice at foes and Slows their attacks and movement for a time. Slower recharge than Ice Bolt, but more damage.Damage: Light.Recharge: Fast.",
  "shortHelp": "Ranged, Light DMG(Cold/Smash), Foe -Recharge, -SPD",
  "icon": "iceassault_iceblast.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 6,
    "endurance": 6.864,
    "castTime": 1
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
    "Ranged Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.32,
      "table": "Ranged_Damage"
    },
    {
      "type": "Cold",
      "scale": 1,
      "table": "Ranged_Damage"
    }
  ],
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
