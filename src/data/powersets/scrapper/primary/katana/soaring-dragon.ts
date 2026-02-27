/**
 * Soaring Dragon
 * Melee, DMG(Lethal), Foe Knockup, -DEF
 *
 * Source: scrapper_melee/katana/disembowel.json
 */

import type { Power } from '@/types';

export const SoaringDragon: Power = {
  "name": "Soaring Dragon",
  "internalName": "Disembowel",
  "available": 21,
  "description": "You perform a powerful Soaring Dragon maneuver that deals a great amount of damage, and can knock a target up into the air. This attack can reduce a target's Defense, making them easier to hit.",
  "shortHelp": "Melee, DMG(Lethal), Foe Knockup, -DEF",
  "icon": "katana_disembowel.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 9,
    "endurance": 9.36,
    "castTime": 1.33
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Knockback",
    "Melee Damage",
    "Scrapper Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1.8,
      "table": "Melee_Damage"
    },
    {
      "type": "Lethal",
      "scale": 1.8,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Lethal",
      "scale": 1.8,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Fire",
      "scale": 0.81,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "knockup": {
      "scale": 2,
      "table": "Melee_Knockback"
    },
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    }
  }
};
