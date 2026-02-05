/**
 * Ice Shield
 * Ranged, Ally +DEF(Melee, Smash, Lethal), Res(Cold, Fire)
 *
 * Source: corruptor_buff/cold_domination/ice_shield.json
 */

import type { Power } from '@/types';

export const IceShield: Power = {
  "name": "Ice Shield",
  "internalName": "Ice_Shield",
  "available": 0,
  "description": "Casts a rock hard Ice Shield on one of your allies and grants him Defense to Melee, Lethal and Smashing attacks and damage resistance to Cold and Fire damage. You cannot stack multiple Ice Shields on the same target, however the shield can be improved by another ally using the same power. Can also be used in conjunction with your Glacial Shield. You cannot use this power on yourself.Recharge: Very Fast.",
  "shortHelp": "Ranged, Ally +DEF(Melee, Smash, Lethal), Res(Cold, Fire)",
  "icon": "colddomination_iceshield.png",
  "powerType": "Click",
  "targetType": "Ally (Alive)",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 30,
    "recharge": 2,
    "endurance": 7.8,
    "castTime": 1.17,
    "maxTargets": 255
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseBuff": {
      "melee": {
        "scale": 1.5,
        "table": "Ranged_Buff_Def"
      },
      "smashing": {
        "scale": 1.5,
        "table": "Ranged_Buff_Def"
      },
      "lethal": {
        "scale": 1.5,
        "table": "Ranged_Buff_Def"
      }
    },
    "resistance": {
      "cold": {
        "scale": 1.25,
        "table": "Ranged_Res_Dmg"
      },
      "fire": {
        "scale": 1,
        "table": "Ranged_Res_Dmg"
      }
    }
  }
};
