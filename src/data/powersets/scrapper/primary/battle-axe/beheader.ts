/**
 * Beheader
 * Melee, DMG(Lethal), Foe Knockdown, -Defense
 *
 * Source: scrapper_melee/battle_axe/beheader.json
 */

import type { Power } from '@/types';

export const Beheader: Power = {
  "name": "Beheader",
  "internalName": "Beheader",
  "available": 0,
  "description": "This is an attempt to remove your opponent's head from his neck with your Battle Axe. This attack is fairly quick for such a large weapon, and has a chance to cut through your foe's defense and knock them down.",
  "shortHelp": "Melee, DMG(Lethal), Foe Knockdown, -Defense",
  "icon": "battleaxe_chop.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.15,
    "range": 7,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 1
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
    "scale": 1,
    "table": "Melee_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    },
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    }
  }
};
