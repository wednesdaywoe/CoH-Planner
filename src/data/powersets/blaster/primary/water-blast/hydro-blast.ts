/**
 * Hydro Blast
 * Ranged, DMG(Cold/Smash), Foe -Speed, Knockdown, +Wet, Self +Tidal Power
 *
 * Source: blaster_ranged/water_blast/hydro_blast.json
 */

import type { Power } from '@/types';

export const HydroBlast: Power = {
  "name": "Hydro Blast",
  "internalName": "Hydro_Blast",
  "available": 0,
  "description": "You briefly focus before releasing an intense blast of chilling water at your foe that causes Cold and Smashing damage. Affected foes will have their movement speed reduced briefly and have a chance to be knocked down. Hydro Blast builds 1 Tidal Power.",
  "shortHelp": "Ranged, DMG(Cold/Smash), Foe -Speed, Knockdown, +Wet, Self +Tidal Power",
  "icon": "waterblast_hydroblast.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 7,
    "endurance": 7.696,
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
    "Blaster Archetype Sets",
    "Knockback",
    "Ranged Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.37,
      "table": "Ranged_Damage"
    },
    {
      "type": "Cold",
      "scale": 1.11,
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
    "knockback": {
      "scale": 0.67,
      "table": "Ranged_Ones"
    }
  }
};
