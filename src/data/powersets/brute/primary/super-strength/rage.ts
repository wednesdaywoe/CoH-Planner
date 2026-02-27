/**
 * Rage
 * Self +DMG, +To Hit, Delayed Self(Weaken, Special)
 *
 * Source: brute_melee/super_strength/rage.json
 */

import type { Power } from '@/types';

export const Rage: Power = {
  "name": "Rage",
  "internalName": "Rage",
  "available": 17,
  "description": "A Rage comes over you, sending you into a berserker fury. While Raging, your damage and chance to hit is dramatically increased. However, when your Rage subsides, you are left with reduced Defense, drained of some of your Endurance, and your attacks are substantially weakened.",
  "shortHelp": "Self +DMG, +To Hit, Delayed Self(Weaken, Special)",
  "icon": "superstrength_rage.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 1,
    "recharge": 240,
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
      "scale": 2,
      "table": "Melee_Buff_ToHit"
    },
    "damageBuff": {
      "scale": 8,
      "table": "Melee_Buff_Dmg"
    },
    "damageDebuff": {
      "scale": 999,
      "table": "Melee_Buff_Dmg"
    },
    "defenseDebuff": {
      "scale": 0.2,
      "table": "Melee_Ones"
    },
    "enduranceDrain": {
      "scale": 0.25,
      "table": "Melee_Ones"
    }
  }
};
