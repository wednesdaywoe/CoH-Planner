/**
 * Parasitic Leech
 * PBAoE, Self +Absorb, +Regeneration, +Recovery, Foe -DMG
 *
 * Source: sentinel_defense/bio_organic_armor/parasitic_leech.json
 */

import type { Power } from '@/types';

export const ParasiticLeech: Power = {
  "name": "Parasitic Leech",
  "internalName": "Parasitic_Leech",
  "available": 29,
  "description": "You release a wave of parasites around you that draw out your enemies' genetic material. These parasites dramatically increase your survivability by gaining damage absorption while boosting your regeneration and recovery rate for a short time. Affected foes will be infected and have reduced regeneration for a short while.*While Offensive Adaptation is active, this power will apply a stronger regeneration debuff.*While Defensive Adaptation is active, this power will grant a small amount of additional damage absorption and inflict a damage debuff.*While Efficient Adaptation is active, this power will grant additional regeneration and recovery per target hit.",
  "shortHelp": "PBAoE, Self +Absorb, +Regeneration, +Recovery, Foe -DMG",
  "icon": "bioorganicarmor_parasiticleech.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.5,
    "range": 40,
    "radius": 90,
    "arc": 1.5708,
    "recharge": 270,
    "endurance": 18.2,
    "castTime": 1.87,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "Recharge",
    "Healing",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Healing",
    "Endurance Modification",
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "recoveryBuff": {
      "scale": 0.129,
      "table": "Melee_Ones"
    },
    "regenBuff": {
      "scale": 0.214,
      "table": "Melee_Ones"
    },
    "absorb": {
      "scale": 0.043,
      "table": "Melee_Ones"
    },
    "regenDebuff": {
      "scale": 1.3,
      "table": "Melee_Ones"
    },
    "damageDebuff": {
      "scale": 2.66,
      "table": "Melee_Debuff_Dam"
    }
  }
};
