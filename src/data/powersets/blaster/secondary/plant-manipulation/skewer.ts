/**
 * Skewer
 * Melee, DMG(Lethal), DoT(Toxic), Foe -DEF
 *
 * Source: blaster_support/plant_manipulation/skewer.json
 */

import type { Power } from '@/types';

export const Skewer: Power = {
  "name": "Skewer",
  "internalName": "Skewer",
  "available": 0,
  "description": "You lunge forward with this melee attack and Skewer your foe with the large Thorn on your arm. Deals high damage and poisons your foe. Poison from the Thorns deals additional Toxic damage and can reduce your foes Defense.Damage: Superior.Recharge: Moderate.",
  "shortHelp": "Melee, DMG(Lethal), DoT(Toxic), Foe -DEF",
  "icon": "plantmanipulation_skewer.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1.23
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Blaster Archetype Sets",
    "Defense Debuff",
    "Melee Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1.96,
      "table": "Melee_Damage"
    },
    {
      "type": "Toxic",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 3.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 2,
      "table": "Melee_Debuff_Def"
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
