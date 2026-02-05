/**
 * Smite
 * Melee, Moderate DMG(Smash/Negative), Foe -To Hit
 *
 * Source: dominator_assault/dark_assault/smite.json
 */

import type { Power } from '@/types';

export const Smite: Power = {
  "name": "Smite",
  "internalName": "Smite",
  "available": 0,
  "description": "You wrap your fists with Negative Energy channeled from the Netherworld and Smite your foe with a powerful blow. Smite clouds the target's vision, lowering their chance to hit for a short time.Damage: Moderate.Recharge: Moderate.",
  "shortHelp": "Melee, Moderate DMG(Smash/Negative), Foe -To Hit",
  "icon": "darknessassault_smite.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 8,
    "endurance": 8.528,
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
    "Melee Damage",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.4,
      "table": "Melee_Damage"
    },
    {
      "type": "Negative",
      "scale": 1.24,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "tohitDebuff": {
      "scale": 0.75,
      "table": "Melee_DeBuff_ToHit"
    }
  }
};
