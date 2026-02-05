/**
 * Devastating Blow
 * Melee, DMG(Energy/Smash), Foe -Def, Disorient, Special
 *
 * Source: tanker_melee/radiation_melee/devastating_blow.json
 */

import type { Power } from '@/types';

export const DevastatingBlow: Power = {
  "name": "Devastating Blow",
  "internalName": "Devastating_Blow",
  "available": 27,
  "description": "You hammer your foe with a brutal smashing attack charged with a lethal dose of radiation. Your target will suffer Extreme Energy and Smashing damage, will have its defense reduced and will be disoriented for a short time. Affected enemies will be affected by the Contaminated effect. Hitting Contaminated foes with single target Radiation Melee powers cause a small burst of damage to foes near the target.",
  "shortHelp": "Melee, DMG(Energy/Smash), Foe -Def, Disorient, Special",
  "icon": "radiationmelee_devastatingblow.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 7,
    "recharge": 17,
    "endurance": 16.016,
    "castTime": 2.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Melee Damage",
    "Stuns",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.77,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 2.31,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 1.386,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 2,
      "table": "Melee_Debuff_Def"
    },
    "stun": {
      "mag": 3,
      "scale": 10,
      "table": "Melee_Immobilize"
    }
  }
};
