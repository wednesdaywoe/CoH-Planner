/**
 * Build Momentum
 * Self +DMG, +To Hit, +Momentum
 *
 * Source: brute_melee/titan_weapons/build_up.json
 */

import type { Power } from '@/types';

export const BuildMomentum: Power = {
  "name": "Build Momentum",
  "internalName": "Build_Up",
  "available": 5,
  "description": "Grants you momentum, moderately increases the amount of damage you deal for a few seconds and slightly increases your chance to hit. Build Momentum grants you Momentum for 10 seconds and it replaces any remaining Momentum you may still have.",
  "shortHelp": "Self +DMG, +To Hit, +Momentum",
  "icon": "titanweapons_buildup.png",
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
    "Recharge"
  ],
  "allowedSetCategories": [
    "To Hit Buff"
  ],
  "maxSlots": 6,
  "effects": {
    "tohitBuff": {
      "scale": 2,
      "table": "Melee_Buff_ToHit"
    },
    "damageBuff": {
      "scale": 5,
      "table": "Melee_Buff_Dmg"
    }
  }
};
