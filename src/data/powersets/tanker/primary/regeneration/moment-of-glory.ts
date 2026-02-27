/**
 * Moment of Glory
 * Self +DMG, +Res(All DMG, Knock Back, Repel, Stun, Hold, Sleep, Immobilize), +DEF(All DMG), +Recovery
 *
 * Source: tanker_defense/regeneration/moment_of_glory.json
 */

import type { Power } from '@/types';

export const MomentofGlory: Power = {
  "name": "Moment of Glory",
  "internalName": "Moment_of_Glory",
  "available": 25,
  "description": "When you activate this power, you deal increased damage, recover Endurance more quickly, gain Resistance and Defense to all damage types, and are highly resistant to Knock Back, Sleep, Disorient, Immobilization, and Hold effects.",
  "shortHelp": "Self +DMG, +Res(All DMG, Knock Back, Repel, Stun, Hold, Sleep, Immobilize), +DEF(All DMG), +Recovery",
  "icon": "regeneration_momentofglory.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 240,
    "endurance": 2.6,
    "castTime": 1.5
  },
  "allowedEnhancements": [
    "Resistance",
    "EnduranceModification",
    "EnduranceReduction",
    "Recharge",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Endurance Modification",
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "recoveryBuff": {
      "scale": 1,
      "table": "Melee_Ones"
    },
    "defenseBuff": {
      "smashing": { "scale": 9.5, "table": "Melee_Buff_Def" },
      "lethal": { "scale": 9.5, "table": "Melee_Buff_Def" },
      "fire": { "scale": 9.5, "table": "Melee_Buff_Def" },
      "cold": { "scale": 9.5, "table": "Melee_Buff_Def" },
      "energy": { "scale": 9.5, "table": "Melee_Buff_Def" },
      "negative": { "scale": 9.5, "table": "Melee_Buff_Def" },
      "psionic": { "scale": 1, "table": "Melee_Buff_Def" },
      "toxic": { "scale": 1, "table": "Melee_Buff_Def" }
    },
    "resistance": {
      "smashing": { "scale": 9.5, "table": "Melee_Res_Dmg" },
      "lethal": { "scale": 9.5, "table": "Melee_Res_Dmg" },
      "fire": { "scale": 9.5, "table": "Melee_Res_Dmg" },
      "cold": { "scale": 9.5, "table": "Melee_Res_Dmg" },
      "energy": { "scale": 9.5, "table": "Melee_Res_Dmg" },
      "negative": { "scale": 9.5, "table": "Melee_Res_Dmg" },
      "psionic": { "scale": 1, "table": "Melee_Res_Dmg" },
      "toxic": { "scale": 1, "table": "Melee_Res_Dmg" }
    },
    "hold": { "mag": 1, "scale": 50, "table": "Melee_Res_Boolean" },
    "effectDuration": 15,
    "immobilize": { "mag": 1, "scale": 50, "table": "Melee_Res_Boolean" },
    "stun": { "mag": 1, "scale": 50, "table": "Melee_Res_Boolean" },
    "sleep": { "mag": 1, "scale": 50, "table": "Melee_Res_Boolean" },
    "knockup": { "scale": 1, "table": "Melee_Ones" },
    "knockback": { "scale": 1, "table": "Melee_Ones" },
    "repel": { "scale": 1, "table": "Melee_Ones" },
    "damageBuff": { "scale": 0.5, "table": "Melee_Buff_Dmg" }
  }
};
