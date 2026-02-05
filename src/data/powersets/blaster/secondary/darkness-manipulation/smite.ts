/**
 * Smite
 * Melee, High DMG(Smash/Negative), Foe -To Hit
 *
 * Source: blaster_support/darkness_manipulation/smite.json
 */

import type { Power } from '@/types';

export const Smite: Power = {
  "name": "Smite",
  "internalName": "Smite",
  "available": 0,
  "description": "You wrap your fists with Negative Energy channeled from the Netherworlds, then perform a Smite that deals High negative energy damage. Smite clouds the target's vision, lowering its chance to hit for a short time.",
  "shortHelp": "Melee, High DMG(Smash/Negative), Foe -To Hit",
  "icon": "darknessmanipulation_smite.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 0.97
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Blaster Archetype Sets",
    "Melee Damage",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.49,
      "table": "Melee_Damage"
    },
    {
      "type": "Negative",
      "scale": 1.47,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "tohitDebuff": {
      "scale": 0.75,
      "table": "Melee_DeBuff_ToHit"
    },
    "damageBuff": {
      "scale": 0.064,
      "table": "Melee_Ones"
    }
  }
};
