/**
 * Genetic Corruption
 * Toggle: PBAoE, Foe Sleep, -Damage(All), Self +Special
 *
 * Source: stalker_defense/bio_organic_armor/genetic_corruption.json
 */

import type { Power } from '@/types';

export const GeneticCorruption: Power = {
  "name": "Genetic Corruption",
  "internalName": "Genetic_Corruption",
  "available": 27,
  "description": "Your Bio Armor is capable of corrupting the genetic code of nearby foes, reducing the damage they deal. Lesser foes may be put to sleep for a short time. While Efficiency Adaptation is active, this power grants a moderate bonus to Regeneration. While Defensive Adaptation is active you gain a minor bonus to all types of damage resistance and increase the potency of this power's damage debuff. If Offensive Adaptation is active enemies are more likely to fall asleep. These special bonuses are unenhanceable.Recharge: Fast.",
  "shortHelp": "Toggle: PBAoE, Foe Sleep, -Damage(All), Self +Special",
  "icon": "bioorganicarmor_geneticcorruption.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 8,
    "recharge": 4,
    "endurance": 2.08,
    "castTime": 1.07,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Sleep",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Sleep"
  ],
  "maxSlots": 6,
  "effects": {
    "sleep": {
      "mag": 2,
      "scale": 6,
      "table": "Melee_Stun"
    },
    "regenBuff": {
      "scale": 0.3,
      "table": "Melee_Ones"
    },
    "resistance": {
      "smashing": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      },
      "fire": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      },
      "psionic": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      }
    },
    "damageDebuff": {
      "scale": 1.995,
      "table": "Melee_Debuff_Dam"
    }
  }
};
