/**
 * Poison Gas Arrow
 * Ranged AoE, Foe -DMG, Sleep
 *
 * Source: defender_buff/trick_arrow/poison_gas_arrow.json
 */

import type { Power } from '@/types';

export const PoisonGasArrow: Power = {
  "name": "Poison Gas Arrow",
  "internalName": "Poison_Gas_Arrow",
  "available": 7,
  "description": "This arrow carries a capsule cloud of poisonous gas, which explodes on impact and weakens all foes in its vicinity. Affected foes damage potential will be severely reduced. Some foes will react badly to the poison and choke for a time, though they will react if attacked.Recharge: Slow.",
  "shortHelp": "Ranged AoE, Foe -DMG, Sleep",
  "icon": "trickarrow_debuffdamage.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.5,
    "range": 70,
    "radius": 25,
    "recharge": 45,
    "endurance": 10.4,
    "castTime": 1.16,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Sleep",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Sleep"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": true,
      "displayName": "Poison Gas Arrow",
      "powers": [
        "Redirects.Trick_Arrow.PoisonGasArrow"
      ],
      "duration": 20
    },
    "damageDebuff": {
      "scale": 2,
      "table": "Ranged_Debuff_Dam"
    }
  }
};
