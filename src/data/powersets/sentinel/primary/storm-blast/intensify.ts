/**
 * Intensify
 * Self +To Hit, +DMG, +Range, Special
 *
 * Source: sentinel_ranged/storm_blast/aim.json
 */

import type { Power } from '@/types';

export const Intensify: Power = {
  "name": "Intensify",
  "internalName": "Aim",
  "available": 7,
  "description": "Greatly increases the chance to hit of your attacks, and slightly increases damage and range for a few seconds. Moderately increases the chance for Storm Blast powers to summon high winds and lightning from your Storm Cell and Category Five while active.",
  "shortHelp": "Self +To Hit, +DMG, +Range, Special",
  "icon": "stormblast_aim.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 90,
    "endurance": 5.2,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "ToHit"
  ],
  "allowedSetCategories": [
    "To Hit Buff"
  ],
  "maxSlots": 6,
  "effects": {
    "tohitBuff": {
      "scale": 5,
      "table": "Melee_Buff_ToHit"
    },
    "damageBuff": {
      "scale": 2.5,
      "table": "Melee_Buff_Dmg"
    },
    "rangeBuff": {
      "scale": 0.333,
      "table": "Melee_Ones"
    }
  }
};
