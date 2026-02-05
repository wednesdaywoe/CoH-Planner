/**
 * Chop
 * Melee, DMG(Lethal), Foe Knockdown, -Defense
 *
 * Source: scrapper_melee/battle_axe/chop.json
 */

import type { Power } from '@/types';

export const Chop: Power = {
  "name": "Chop",
  "internalName": "Chop",
  "available": 0,
  "description": "Chop deals heavy damage with your Battle Axe, although it is much slower than Gash. This attack has a chance to cut through your target's defense and knock them down.",
  "shortHelp": "Melee, DMG(Lethal), Foe Knockdown, -Defense",
  "icon": "battleaxe_gash.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.15,
    "range": 7,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.2
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
    "Knockback",
    "Melee Damage",
    "Scrapper Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 1.64,
    "table": "Melee_Damage"
  }
};
