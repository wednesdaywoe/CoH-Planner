/**
 * Punch
 * Melee, DMG(Smash), Knockback
 *
 * Source: tanker_melee/super_strength/punch.json
 */

import type { Power } from '@/types';

export const Punch: Power = {
  "name": "Punch",
  "internalName": "Punch",
  "available": 0,
  "description": "Your Super Strength Punch can deal a moderate amount of damage, but most of all can knock your opponent off his feet, unable to attack again until they stand up.",
  "shortHelp": "Melee, DMG(Smash), Knockback",
  "icon": "superstrength_punch.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 1.2
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.45,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
