/**
 * Parasitic Aura
 * PBAoE, Self +Absorb, +Regeneration, +Recovery, Foe -DMG
 *
 * Source: scrapper_defense/bio_organic_armor/parasitic_aura.json
 */

import type { Power } from '@/types';

export const ParasiticAura: Power = {
  "name": "Parasitic Aura",
  "internalName": "Parasitic_Aura",
  "available": 29,
  "description": "You release a cloud of parasites around you that draw out your enemies' genetic material. These parasites dramatically increase your survivability by gaining damage absorption while boosting your regeneration and recovery rate for a short time. Affected foes will be infected and deal reduced damage for a short while. While Efficient Adaptation is active, this power will grant additional regeneration and recovery per target hit. While Defensive Adaptation is active, this power will grant a small amount of additional damage absorption and increase the effectiveness of this power's damage debuff.Recharge: Very Long.",
  "shortHelp": "PBAoE, Self +Absorb, +Regeneration, +Recovery, Foe -DMG",
  "icon": "bioorganicarmor_parasiticaura.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.5,
    "radius": 15,
    "recharge": 270,
    "endurance": 18.2,
    "castTime": 1.87,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
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
      "scale": 0.125,
      "table": "Melee_Ones"
    },
    "regenBuff": {
      "scale": 0.15,
      "table": "Melee_Ones"
    },
    "absorb": {
      "scale": 1,
      "table": "Melee_Ones"
    },
    "damageDebuff": {
      "scale": 2,
      "table": "Melee_Debuff_Dam"
    }
  }
};
