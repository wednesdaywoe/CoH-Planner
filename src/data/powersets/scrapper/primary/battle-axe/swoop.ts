/**
 * Swoop
 * Melee, DMG(Lethal), Foe Knockup
 *
 * Source: scrapper_melee/battle_axe/swoop.json
 */

import type { Power } from '@/types';

export const Swoop: Power = {
  "name": "Swoop",
  "internalName": "Swoop",
  "available": 17,
  "description": "A Swoop of your Battle Axe deals a superior amount of damage, and can send your target flying upwards.",
  "shortHelp": "Melee, DMG(Lethal), Foe Knockup",
  "icon": "battleaxe_swoop.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 12,
    "endurance": 11.856,
    "castTime": 1.37
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee Damage",
    "Scrapper Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 2.28,
    "table": "Melee_Damage"
  }
};
