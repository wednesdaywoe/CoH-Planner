/**
 * Alkaloid
 * Ally Heal, +Res(Toxic)
 *
 * Source: mastermind_buff/poison/alkaloid.json
 */

import type { Power } from '@/types';

export const Alkaloid: Power = {
  "name": "Alkaloid",
  "internalName": "Alkaloid",
  "available": 0,
  "description": "When used correctly, poisons can be used to heal, as well as harm. Alkaloid consists of just the right amount of amino acids to safely heal a single targeted ally. The healed target is also left with some resistance to Toxic Damage (This Toxic Damage Resistance cannot be Enhanced). You cannot use this power to heal yourself.Recharge: Fast.",
  "shortHelp": "Ally Heal, +Res(Toxic)",
  "icon": "poison_alkaloid.png",
  "powerType": "Click",
  "targetType": "Ally (Alive)",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 4,
    "endurance": 16.25,
    "castTime": 1.53
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
  "damage": {
    "type": "Heal",
    "scale": 1.52,
    "table": "Ranged_Heal"
  },
  "effects": {
    "resistance": {
      "toxic": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      }
    }
  }
};
