/**
 * Absorb Pain
 * Ally Strong Heal, Self Moderate DMG(Special)
 *
 * Source: mastermind_buff/empathy/absorb_pain.json
 */

import type { Power } from '@/types';

export const AbsorbPain: Power = {
  "name": "Absorb Pain",
  "internalName": "Absorb_Pain",
  "available": 3,
  "description": "Dramatically heals an ally's wounds. This power has only a tiny Endurance cost, but it requires you to sacrifice some of your Hit Points. Absorbing someone's pain can be quite dramatic, and afterwards you will be briefly unable to heal your own wounds by any means.Recharge: Slow.",
  "shortHelp": "Ally Strong Heal, Self Moderate DMG(Special)",
  "icon": "empathy_absorbpain.png",
  "powerType": "Click",
  "targetType": "Ally (Alive)",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 15,
    "endurance": 0.65,
    "castTime": 2.27
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Heal",
      "scale": 5,
      "table": "Ranged_Heal"
    },
    {
      "type": "Special",
      "scale": 3,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "regenDebuff": {
      "scale": 1,
      "table": "Ranged_Ones"
    },
    "resistance": {
      "heal": {
        "scale": 1,
        "table": "Ranged_Ones"
      }
    }
  }
};
