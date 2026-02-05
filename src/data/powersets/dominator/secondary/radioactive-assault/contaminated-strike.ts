/**
 * Contaminated Strike
 * Melee, High DMG(Energy/Smash), Foe -Def, Special
 *
 * Source: dominator_assault/radioactive_assault/contaminated_strike.json
 */

import type { Power } from '@/types';

export const ContaminatedStrike: Power = {
  "name": "Contaminated Strike",
  "internalName": "Contaminated_Strike",
  "available": 0,
  "description": "You charge your fist with harmful radioactive particles and quickly strike your foe dealing Light Energy and Smashing damage as well as reducing their defense. Affected enemies have a small chance to be affected by the Contaminated effect. Hitting Contaminated foes with single target Radioactive Assault powers cause a small burst of damage to foes near the target.Damage: High.Recharge: Moderate.",
  "shortHelp": "Melee, High DMG(Energy/Smash), Foe -Def, Special",
  "icon": "radioactiveassault_contaminatedstrike.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 0.83
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Melee Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.41,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 1.23,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 1.39,
      "table": "Melee_Debuff_Def"
    }
  }
};
