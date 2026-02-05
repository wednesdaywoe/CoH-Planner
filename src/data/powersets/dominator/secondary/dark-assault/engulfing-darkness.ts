/**
 * Engulfing Darkness
 * PBAoE, Light DMG(Negative), Foe -To Hit, Minor DoT(Negative)
 *
 * Source: dominator_assault/dark_assault/moonbeam.json
 */

import type { Power } from '@/types';

export const EngulfingDarkness: Power = {
  "name": "Engulfing Darkness",
  "internalName": "Moonbeam",
  "available": 19,
  "description": "You release a burst of negative energy to foes around you dealing moderate Negative Energy damage, reducing their chance to hit and sapping their health over time.Damage: Light.Recharge: Slow.",
  "shortHelp": "PBAoE, Light DMG(Negative), Foe -To Hit, Minor DoT(Negative)",
  "icon": "darknessassault_deathshroud.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 15,
    "recharge": 18,
    "endurance": 16.848,
    "castTime": 2,
    "maxTargets": 10
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
    "Melee AoE Damage",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Negative",
      "scale": 1,
      "table": "Melee_Damage"
    },
    {
      "type": "Negative",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 3.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "tohitDebuff": {
      "scale": 0.75,
      "table": "Melee_DeBuff_ToHit"
    }
  }
};
