/**
 * Evolving Armor
 * Self Toggle, +Res(All), Foe -Res(All), Taunt, +Special
 *
 * Source: brute_defense/bio_organic_armor/adaptation.json
 */

import type { Power } from '@/types';

export const Adaptation: Power = {
  "name": "Adaptation",
  "internalName": "Adaptation",
  "available": 9,
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
    "activatePeriod": 1,
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
    "resistance": {
      "fire": {
        "scale": 0.5368999999999999,
        "table": "Melee_Res_Dmg",
        "perTarget": 0.0494
      },
      "cold": {
        "scale": 0.5368999999999999,
        "table": "Melee_Res_Dmg",
        "perTarget": 0.0494
      },
      "energy": {
        "scale": 0.5368999999999999,
        "table": "Melee_Res_Dmg",
        "perTarget": 0.0494
      },
      "negative": {
        "scale": 0.5368999999999999,
        "table": "Melee_Res_Dmg",
        "perTarget": 0.0494
      },
      "psionic": {
        "scale": 0.429,
        "table": "Melee_Res_Dmg",
        "perTarget": 0.039
      },
      "smashing": {
        "scale": 0.7150000000000001,
        "table": "Melee_Res_Dmg",
        "perTarget": 0.065
      },
      "lethal": {
        "scale": 0.7150000000000001,
        "table": "Melee_Res_Dmg",
        "perTarget": 0.065
      },
      "toxic": {
        "scale": 0.7150000000000001,
        "table": "Melee_Res_Dmg",
        "perTarget": 0.065
      }
    },
    "durations": {
      "resistance": 1
    },
    "taunt": {
      "scale": 1,
      "table": "Melee_InherentTaunt"
    },
    "buffDuration": 1,
    "regenBuff": {
      "scale": 0.36,
      "table": "Melee_Ones",
      "perTarget": 0.06
    },
    "recoveryBuff": {
      "scale": 0.18,
      "table": "Melee_Ones",
      "perTarget": 0.03
    },
    "defenseBuff": {
      "smashing": {
        "scale": 0.42,
        "table": "Melee_Buff_Def",
        "perTarget": 0.045
      },
      "lethal": {
        "scale": 0.42,
        "table": "Melee_Buff_Def",
        "perTarget": 0.045
      },
      "fire": {
        "scale": 0.31360000000000005,
        "table": "Melee_Buff_Def",
        "perTarget": 0.0336
      },
      "cold": {
        "scale": 0.31360000000000005,
        "table": "Melee_Buff_Def",
        "perTarget": 0.0336
      },
      "energy": {
        "scale": 0.31360000000000005,
        "table": "Melee_Buff_Def",
        "perTarget": 0.0336
      },
      "negative": {
        "scale": 0.31360000000000005,
        "table": "Melee_Buff_Def",
        "perTarget": 0.0336
      },
      "psionic": {
        "scale": 0.224,
        "table": "Melee_Buff_Def",
        "perTarget": 0.024
      }
    }
  }
};
