/**
 * Gambler's Cut
 * Melee, DMG(Lethal), Foe -Def
 *
 * Source: scrapper_melee/katana/slash.json
 */

import type { Power } from '@/types';

export const GamblersCut: Power = {
  "name": "Gambler's Cut",
  "internalName": "Slash",
  "available": 0,
  "description": "You perform a quick slash with your katana. This attack is very fast, but deals only minor damage. This attack can reduce a target's Defense, making them easier to hit.",
  "shortHelp": "Melee, DMG(Lethal), Foe -Def",
  "icon": "katana_slash.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 3,
    "endurance": 4.368,
    "castTime": 0.67
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
    "Scrapper Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.42,
      "table": "Melee_Damage",
      "duration": 0.3,
      "tickRate": 0.25
    },
    {
      "type": "Lethal",
      "scale": 0.84,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Lethal",
      "scale": 0.84,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Fire",
      "scale": 0.189,
      "table": "Melee_Damage",
      "duration": 0.3,
      "tickRate": 0.25
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    }
  },
  "requires": "!Scrapper_Defense.Shield_Defense"
};
