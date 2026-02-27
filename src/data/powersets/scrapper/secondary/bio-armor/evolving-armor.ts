/**
 * Evolving Armor
 * Self Toggle, +Res(All), Foe -Res(All), Taunt, +Special
 *
 * Source: scrapper_defense/bio_organic_armor/adaptation.json
 */

import type { Power } from '@/types';

export const EvolvingArmor: Power = {
  "name": "Evolving Armor",
  "internalName": "Adaptation",
  "available": 3,
  "description": "When faced with danger, your Bio Armor reacts by becoming incredibly durable as well as infecting nearby enemies, lowering their resistance to damage. While active, Evolving Armor will grant you small amount of damage resistance, plus an additional amount for each nearby target. Nearby foes will also be taunted and have their damage resistance reduced. While Efficient Adaptation is active, this power grants a moderate bonus to Regeneration and Recovery plus a tiny amount of both for each nearby foe up to 10 foes. While Defensive Adaptation is active you gain a very minor amount of defense and damage resistance for each nearby foe, however you lose the benefit of this power's resistance debuff. If Offensive Adaptation is active this power's damage resistance debuff is increased. These special bonuses are unenhanceable.Recharge: Moderate.",
  "shortHelp": "Self Toggle, +Res(All), Foe -Res(All), Taunt, +Special",
  "icon": "bioorganicarmor_evolution.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 8,
    "recharge": 10,
    "endurance": 0.26,
    "castTime": 2.93,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Resistance",
    "Taunt",
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Resist Damage",
    "Threat Duration"
  ],
  "maxSlots": 6,
  "effects": {
    "resistanceDebuff": {
      "smashing": {
        "scale": 1.33,
        "table": "Melee_Debuff_Res_Dmg"
      },
      "lethal": {
        "scale": 1.33,
        "table": "Melee_Debuff_Res_Dmg"
      },
      "fire": {
        "scale": 1.33,
        "table": "Melee_Debuff_Res_Dmg"
      },
      "cold": {
        "scale": 1.33,
        "table": "Melee_Debuff_Res_Dmg"
      },
      "energy": {
        "scale": 1.33,
        "table": "Melee_Debuff_Res_Dmg"
      },
      "negative": {
        "scale": 1.33,
        "table": "Melee_Debuff_Res_Dmg"
      },
      "psionic": {
        "scale": 1.33,
        "table": "Melee_Debuff_Res_Dmg"
      },
      "toxic": {
        "scale": 1.33,
        "table": "Melee_Debuff_Res_Dmg"
      }
    },
    "regenBuff": {
      "scale": 0.06,
      "table": "Melee_Ones"
    },
    "recoveryBuff": {
      "scale": 0.03,
      "table": "Melee_Ones"
    },
    "resistance": {
      "fire": {
        "scale": 0.0114,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 0.0114,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 0.0114,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 0.0114,
        "table": "Melee_Res_Dmg"
      },
      "psionic": {
        "scale": 0.009,
        "table": "Melee_Res_Dmg"
      },
      "smashing": {
        "scale": 0.015,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 0.015,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 0.015,
        "table": "Melee_Res_Dmg"
      }
    },
    "defenseBuff": {
      "smashing": {
        "scale": 0.045,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 0.045,
        "table": "Melee_Buff_Def"
      },
      "fire": {
        "scale": 0.0336,
        "table": "Melee_Buff_Def"
      },
      "cold": {
        "scale": 0.0336,
        "table": "Melee_Buff_Def"
      },
      "energy": {
        "scale": 0.0336,
        "table": "Melee_Buff_Def"
      },
      "negative": {
        "scale": 0.0336,
        "table": "Melee_Buff_Def"
      },
      "psionic": {
        "scale": 0.024,
        "table": "Melee_Buff_Def"
      }
    }
  }
};
