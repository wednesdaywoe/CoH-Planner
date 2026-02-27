/**
 * Thunder Strike
 * Melee (AoE), DMG(Energy), Foe Disorient, Knockback, -End
 *
 * Source: scrapper_melee/electrical_melee/thunder_strike.json
 */

import type { Power } from '@/types';

export const ThunderStrike: Power = {
  "name": "Thunder Strike",
  "internalName": "Thunder_Strike",
  "available": 7,
  "description": "A massive attack. You smash your foes with all the power of a lightning bolt. The pummeled victim takes tremendous damage and may be Disoriented. Any nearby foes may be knocked down and take some damage from the shockwave as well as have some endurance drained.",
  "shortHelp": "Melee (AoE), DMG(Energy), Foe Disorient, Knockback, -End",
  "icon": "electricmelee_targetedaoeheavydmg.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "radius": 10,
    "recharge": 20,
    "endurance": 18.512,
    "castTime": 2.53,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee AoE Damage",
    "Scrapper Archetype Sets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Energy",
      "scale": 2.98,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 2.98,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Energy",
      "scale": 2.98,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Fire",
      "scale": 1.3412,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.42,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.42,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Energy",
      "scale": 0.42,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Fire",
      "scale": 0.189,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "enduranceDrain": {
      "scale": 0.07,
      "table": "Melee_Ones"
    },
    "recoveryDebuff": {
      "scale": 1,
      "table": "Melee_Ones"
    },
    "stun": {
      "mag": 3,
      "scale": 5,
      "table": "Melee_Stun"
    },
    "knockback": {
      "scale": 0.64,
      "table": "Melee_Ones"
    }
  }
};
