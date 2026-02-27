/**
 * Gash
 * Melee, DMG(Lethal), Foe Knockdown
 *
 * Source: scrapper_melee/battle_axe/gash.json
 */

import type { Power } from '@/types';

export const Gash: Power = {
  "name": "Gash",
  "internalName": "Gash",
  "available": 1,
  "description": "Gashes your opponent with your Battle Axe dealing superior damage. This attack is very slow, but can deal a lot damage and knock the target down.",
  "shortHelp": "Melee, DMG(Lethal), Foe Knockdown",
  "icon": "battleaxe_beheader.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1.27
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Knockback",
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
    "scale": 1.96,
    "table": "Melee_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
