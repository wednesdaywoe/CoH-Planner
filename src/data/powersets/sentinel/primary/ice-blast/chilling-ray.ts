/**
 * Chilling Ray
 * Ranged, DMG(Cold), Foe Sleep
 *
 * Source: sentinel_ranged/ice_blast/chilling_ray.json
 */

import type { Power } from '@/types';

export const ChillingRay: Power = {
  "name": "Chilling Ray",
  "internalName": "Chilling_Ray",
  "available": 5,
  "description": "Chilling Ray encases your foe in a frail block of ice, holding them helpless in place for a while. The block of ice will break if attacked.Notes: The Sleep component of this power is Auto Hit against regular enemies, but a To Hit check is required to against AVs and players, as well as to make secondary effects apply.",
  "shortHelp": "Ranged, DMG(Cold), Foe Sleep",
  "icon": "iceblast_freezeray.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Sleep",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged Damage",
    "Sentinel Archetype Sets",
    "Sleep",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Cold",
      "scale": 1.64,
      "table": "Ranged_Damage"
    },
    {
      "type": "Cold",
      "scale": 1.64,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "sleep": {
      "mag": 3,
      "scale": 8,
      "table": "Ranged_Sleep"
    },
    "movement": {
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
      },
      "jumpHeight": {
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
