/**
 * Hack
 * Melee, DMG(Lethal), Foe -DEF
 *
 * Source: stalker_melee/broad_sword/hack.json
 */

import type { Power } from '@/types';

export const Hack: Power = {
  "name": "Hack",
  "internalName": "Hack",
  "available": 0,
  "description": "You Hack your opponent for a high amount of damage. This attack can reduce a target's Defense, making him easier to hit.",
  "shortHelp": "Melee, DMG(Lethal), Foe -DEF",
  "icon": "sword_hack.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 8,
    "endurance": 8.528,
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
    "Defense Debuff",
    "Melee Damage",
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 1.64,
    "table": "Melee_Damage"
  },
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    }
  }
};
