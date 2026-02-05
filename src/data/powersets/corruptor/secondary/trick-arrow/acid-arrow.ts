/**
 * Acid Arrow
 * Ranged AoE Minor DoT(Toxic), Foe -Res(Special), Res(Heal), -DEF
 *
 * Source: corruptor_buff/trick_arrow/acid_arrow.json
 */

import type { Power } from '@/types';

export const AcidArrow: Power = {
  "name": "Acid Arrow",
  "internalName": "Acid_Arrow",
  "available": 19,
  "description": "This arrow explodes in a small shower of acid on impact. This acid eats through armor, causing damage over time, reducing target's Defense as well as their resistance to debuffs, while making it harder for them to be healed.Damage: Minor.Recharge: Slow.",
  "shortHelp": "Ranged AoE Minor DoT(Toxic), Foe -Res(Special), Res(Heal), -DEF",
  "icon": "trickarrow_debuffdefense.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 15,
    "recharge": 20,
    "endurance": 7.8,
    "castTime": 1.83,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Corruptor Archetype Sets",
    "Defense Debuff",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Toxic",
    "scale": 0.01,
    "table": "Ranged_Damage",
    "duration": 20,
    "tickRate": 1
  },
  "effects": {
    "defenseDebuff": {
      "scale": 2,
      "table": "Ranged_Debuff_Def"
    },
    "resistance": {
      "heal": {
        "scale": 4,
        "table": "Ranged_Res_Dmg"
      }
    },
    "enduranceDrain": {
      "scale": 4,
      "table": "Ranged_Res_Dmg"
    },
    "tohitDebuff": {
      "scale": 4,
      "table": "Ranged_Res_Dmg"
    },
    "regenDebuff": {
      "scale": 4,
      "table": "Ranged_Res_Dmg"
    },
    "recoveryDebuff": {
      "scale": 4,
      "table": "Ranged_Res_Dmg"
    },
    "rechargeDebuff": {
      "scale": 4,
      "table": "Ranged_Res_Dmg"
    },
    "enduranceDiscount": {
      "scale": 4,
      "table": "Ranged_Res_Dmg"
    }
  }
};
