/**
 * Aqua Bolt
 * Ranged, DMG(Cold/Smash), Foe -Def, +Wet, Self +Tidal Power
 *
 * Source: blaster_ranged/water_blast/aqua_bolt.json
 */

import type { Power } from '@/types';

export const AquaBolt: Power = {
  "name": "Aqua Bolt",
  "internalName": "Aqua_Bolt",
  "available": 0,
  "description": "You strike your foe with a rapid blast of freezing cold water causing Cold and Smashing damage as well as reducing their defense. Aqua Bolt builds 1 Tidal Power.",
  "shortHelp": "Ranged, DMG(Cold/Smash), Foe -Def, +Wet, Self +Tidal Power",
  "icon": "waterblast_aquabolt.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 3,
    "endurance": 4.368,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Blaster Archetype Sets",
    "Defense Debuff",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.21,
      "table": "Ranged_Damage"
    },
    {
      "type": "Cold",
      "scale": 0.63,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Ranged_Debuff_Def"
    }
  }
};
