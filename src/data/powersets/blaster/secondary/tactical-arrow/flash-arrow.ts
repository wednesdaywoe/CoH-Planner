/**
 * Flash Arrow
 * Ranged (Targeted AoE), Foe -Perception, -ToHit
 *
 * Source: blaster_support/tactical_arrow/flash_arrow.json
 */

import type { Power } from '@/types';

export const FlashArrow: Power = {
  "name": "Flash Arrow",
  "internalName": "Flash_Arrow",
  "available": 15,
  "description": "This arrow explodes in a dazzling flash of light and sound. The targets are so blinded that they can hardly see a thing. Most villains will not be able to see past normal melee range, although some may have better perception. If the villains are attacked, they will be alerted to your presence, but will suffer a penalty to their chance to hit.Recharge: Slow.",
  "shortHelp": "Ranged (Targeted AoE), Foe -Perception, -ToHit",
  "icon": "tacticalarrow_blind.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 35,
    "recharge": 15,
    "endurance": 7.8,
    "castTime": 1,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "ToHit Debuff",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "To Hit Debuff"
  ],
  "maxSlots": 6,
  "effects": {
    "perceptionDebuff": {
      "scale": 0.9,
      "table": "Ranged_Ones"
    },
    "tohitDebuff": {
      "scale": 0.7,
      "table": "Ranged_Debuff_ToHit"
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
