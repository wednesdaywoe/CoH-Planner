/**
 * Power Burst
 * Ranged, DMG(Energy/Smash), Foe Knockback
 *
 * Source: blaster_ranged/energy_blast/power_burst.json
 */

import type { Power } from '@/types';

export const PowerBurst: Power = {
  "name": "Power Burst",
  "internalName": "Power_Burst",
  "available": 5,
  "description": "A devastating attack, Power Burst unleashes a massive amount of energy dealing very high damage at short distances. The impact from this burst often knocks back most foes.",
  "shortHelp": "Ranged, DMG(Energy/Smash), Foe Knockback",
  "icon": "powerblast_powerburst.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 10,
    "endurance": 10.4,
    "castTime": 2
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Knockback",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 1.12,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 2,
      "table": "Ranged_Knockback"
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
