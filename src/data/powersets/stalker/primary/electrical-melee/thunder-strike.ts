/**
 * Thunder Strike
 * Melee (AoE), DMG(Energy), Foe Disorient, Knockback, -End
 *
 * Source: stalker_melee/electrical_melee/lightning_clap.json
 */

import type { Power } from '@/types';

export const ThunderStrike: Power = {
  "name": "Thunder Strike",
  "internalName": "Lightning_Clap",
  "available": 21,
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
    "Stalker Archetype Sets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Energy",
      "scale": 2.6849,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 1.2084,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 2.6849,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Energy",
      "scale": 2.6849,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Energy",
      "scale": 0.3784,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.1703,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.3784,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Energy",
      "scale": 0.3784,
      "table": "Melee_InherentDamage"
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
