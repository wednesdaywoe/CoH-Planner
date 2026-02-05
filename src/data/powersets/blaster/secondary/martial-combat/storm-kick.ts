/**
 * Storm Kick
 * Melee, Moderate DMG(Smash), DoT(Lethal), Foe Knockdown
 *
 * Source: blaster_support/martial_manipulation/storm_kick.json
 */

import type { Power } from '@/types';

export const StormKick: Power = {
  "name": "Storm Kick",
  "internalName": "Storm_Kick",
  "available": 0,
  "description": "You can unleash a roundhouse kick that pummels your foe for moderate damage, knocking them down. Storm Kick has an additional chance to cause your target to bleed for Lethal damage over time.Damage: Moderate.Recharge: Fast.",
  "shortHelp": "Melee, Moderate DMG(Smash), DoT(Lethal), Foe Knockdown",
  "icon": "martialmanipulation_stormkick.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 6,
    "endurance": 6.864,
    "castTime": 1.07
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Knockback",
    "Melee Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1.32,
      "table": "Melee_Damage"
    },
    {
      "type": "Lethal",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 1.5,
      "tickRate": 0.5
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    },
    "damageBuff": {
      "scale": 0.071,
      "table": "Melee_Ones"
    }
  }
};
