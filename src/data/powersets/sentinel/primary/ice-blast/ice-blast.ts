/**
 * Ice Blast
 * Ranged, DMG(Cold), Foe -Recharge, -SPD
 *
 * Source: sentinel_ranged/ice_blast/ice_blast.json
 */

import type { Power } from '@/types';

export const IceBlast: Power = {
  "name": "Ice Blast",
  "internalName": "Ice_Blast",
  "available": 0,
  "description": "Ice Blast hurls shards of ice at foes and Slows their attacks and movement for a time. Slower recharge than Ice Bolt, but more damage.",
  "shortHelp": "Ranged, DMG(Cold), Foe -Recharge, -SPD",
  "icon": "iceblast_iceblast.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 6,
    "endurance": 6.864,
    "castTime": 1.67
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
    "Sentinel Archetype Sets",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Cold",
    "scale": 1.32,
    "table": "Ranged_Damage"
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
