/**
 * Painbringer
 * Ally, +Regeneration, +Recovery, +DMG
 *
 * Source: defender_buff/pain_domination/painbringer.json
 */

import type { Power } from '@/types';

export const Painbringer: Power = {
  "name": "Painbringer",
  "internalName": "Painbringer",
  "available": 25,
  "description": "You transform an ally to pain incarnate turning them into an inexhaustible killing machine. While the character is imbued with this power they will benefit from incredible health regeneration, endurance recovery and improved damage potential for a short time.Recharge: Very Long.",
  "shortHelp": "Ally, +Regeneration, +Recovery, +DMG",
  "icon": "paindomination_painbringer.png",
  "powerType": "Click",
  "targetType": "Ally (Alive)",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 300,
    "endurance": 10.4,
    "castTime": 2.27
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "recoveryBuff": {
      "scale": 8,
      "table": "Ranged_Ones"
    },
    "regenBuff": {
      "scale": 5,
      "table": "Ranged_Ones"
    },
    "damageBuff": {
      "scale": 5,
      "table": "Ranged_Buff_Dmg"
    }
  }
};
