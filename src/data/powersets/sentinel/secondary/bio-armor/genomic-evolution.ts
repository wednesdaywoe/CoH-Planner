/**
 * Genomic Evolution
 * Auto: +Res(All), +Special
 *
 * Source: sentinel_defense/bio_organic_armor/genomic_evolution.json
 */

import type { Power } from '@/types';

export const GenomicEvolution: Power = {
  "name": "Genomic Evolution",
  "internalName": "Genomic_Evolution",
  "available": 27,
  "description": "Your body has evolved to protect you from all damage types. As a result you receive a moderate bonus to damage resistance against all types.*While Offensive Adaptation is active you gain increased range buff.*While Defensive Adaptation is active you gain a bonus to damage resistance.*While Efficient Adaptation is active you gain a power bonus to your max endurance.Bonuses granted from Adaptations are unenhanceable.This power is always active and cost no endurance.",
  "shortHelp": "Auto: +Res(All), +Special",
  "icon": "bioorganicarmor_genomicevolution.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1
  },
  "allowedEnhancements": [
    "Resistance"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "resistance": {
      "smashing": {
        "scale": 0.225,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 0.225,
        "table": "Melee_Res_Dmg"
      },
      "fire": {
        "scale": 0.15,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 0.15,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 0.15,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 0.15,
        "table": "Melee_Res_Dmg"
      },
      "psionic": {
        "scale": 0.18,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 0.3,
        "table": "Melee_Res_Dmg"
      }
    },
    "rangeBuff": {
      "scale": 0.15,
      "table": "Melee_Ones"
    },
    "maxEndBuff": {
      "scale": 5,
      "table": "Melee_Ones"
    }
  }
};
