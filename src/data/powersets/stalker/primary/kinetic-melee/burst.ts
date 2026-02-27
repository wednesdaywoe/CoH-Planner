/**
 * Burst
 * PBAoE Melee, DMG(Smash/Energy), Foe Knockdown
 *
 * Source: stalker_melee/kinetic_attack/burst.json
 */

import type { Power } from '@/types';

export const Burst: Power = {
  "name": "Burst",
  "internalName": "Burst",
  "available": 17,
  "description": "By focusing your energy into the muscles in your arms, you can launch a dizzying flurry of attacks against every foe in melee range. Some foes may be hit hard enough to be knocked down as well.",
  "shortHelp": "PBAoE Melee, DMG(Smash/Energy), Foe Knockdown",
  "icon": "kineticattack_burst.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 8,
    "recharge": 15,
    "endurance": 14.352,
    "castTime": 2.53,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee AoE Damage",
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.5,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.75,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "damageDebuff": {
      "scale": 1.2,
      "table": "Melee_Debuff_Dam"
    },
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
