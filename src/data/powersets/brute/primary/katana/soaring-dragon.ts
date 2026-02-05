/**
 * Soaring Dragon
 * Melee, DMG(Lethal), Foe Knockup, -DEF
 *
 * Source: brute_melee/katana/disembowel.json
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
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Brute Archetype Sets",
    "Defense Debuff",
    "Knockback",
    "Melee Damage",
    "Threat Duration",
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
