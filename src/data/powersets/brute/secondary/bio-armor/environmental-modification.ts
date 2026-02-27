/**
 * Environmental Modification
 * Self Toggle, +Res(Hold, Knockdown, Immobilize), +Def(Energy, Negative, Fire, Cold, Psionic), +Special
 *
 * Source: brute_defense/bio_organic_armor/environmental_adaptation.json
 */

import type { Power } from '@/types';

export const EnvironmentalModification: Power = {
  "name": "Environmental Modification",
  "internalName": "Environmental_Adaptation",
  "available": 3,
  "description": "Your body can spontaneously adapt to its surroundings and your mind has learned to shield itself from harmful effects by constant exposure to these dangers. While active you gain moderate defense to Fire, Cold, Energy and Negative Energy damage, and a small amount of defense to Psionic damage. Additionally you are protected against hold, knockdown and immobilize effects. While Defensive Adaptation is active you gain a minor amount of Lethal, Smashing, Fire, Cold, Energy, Negative Energy and Psionic defense, as well as a minor amount of maximum hit points. If Offensive Adaptation is active you'll gain a moderate To Hit bonus. These special bonuses are unenhanceable.Recharge: Very Fast.",
  "shortHelp": "Self Toggle, +Res(Hold, Knockdown, Immobilize), +Def(Energy, Negative, Fire, Cold, Psionic), +Special",
  "icon": "bioorganicarmor_environmentalmodification.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 2,
    "endurance": 0.13,
    "castTime": 0.73
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseBuff": {
      "fire": {
        "scale": 0.45,
        "table": "Melee_Buff_Def"
      },
      "cold": {
        "scale": 0.45,
        "table": "Melee_Buff_Def"
      },
      "energy": {
        "scale": 0.45,
        "table": "Melee_Buff_Def"
      },
      "negative": {
        "scale": 0.45,
        "table": "Melee_Buff_Def"
      },
      "psionic": {
        "scale": 0.225,
        "table": "Melee_Buff_Def"
      },
      "smashing": {
        "scale": 0.45,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 0.45,
        "table": "Melee_Buff_Def"
      }
    },
    "maxHPBuff": {
      "scale": 0.45,
      "table": "Melee_HealSelf"
    },
    "tohitBuff": {
      "scale": 0.75,
      "table": "Melee_Buff_ToHit"
    },
    "hold": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "effectDuration": 0.75,
    "knockup": {
      "scale": 10,
      "table": "Melee_Ones"
    },
    "knockback": {
      "scale": 10,
      "table": "Melee_Ones"
    },
    "immobilize": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    }
  }
};
