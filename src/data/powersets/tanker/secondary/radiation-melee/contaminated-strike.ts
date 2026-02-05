/**
 * Contaminated Strike
 * Melee, DMG(Energy/Smash), Foe -Def, Special
 *
 * Source: tanker_melee/radiation_melee/contaminated_strike.json
 */

import type { Power } from '@/types';

export const ContaminatedStrike: Power = {
  "name": "Contaminated Strike",
  "internalName": "Contaminated_Strike",
  "available": 0,
  "description": "You charge your fist with harmful radioactive particles and quickly strike your foe dealing Light Energy and Smashing damage as well as reducing their defense. Affected enemies have a small chance to be affected by the Contaminated effect. Hitting Contaminated foes with single target Radiation Melee powers cause a small burst of damage to foes near the target.",
  "shortHelp": "Melee, DMG(Energy/Smash), Foe -Def, Special",
  "icon": "radiationmelee_contaminatedstrike.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 3,
    "endurance": 4.368,
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
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.21,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.63,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.378,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    }
  }
};
