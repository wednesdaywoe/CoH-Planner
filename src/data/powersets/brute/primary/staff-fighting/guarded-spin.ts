/**
 * Guarded Spin
 * Melee (Cone), DMG(Smash), Self +Def(Melee, Lethal)
 *
 * Source: brute_melee/staff_fighting/guarded_spin.json
 */

import type { Power } from '@/types';

export const GuardedSpin: Power = {
  "name": "Guarded Spin",
  "internalName": "Guarded_Spin",
  "available": 1,
  "description": "You spin your staff like a propeller in front of you dealing Smashing damage to enemies in your frontal arc and deflecting any incoming attacks, thus boosting your Melee and Lethal defense briefly. While a form is active, this power will build one level of Perfection.",
  "shortHelp": "Melee (Cone), DMG(Smash), Self +Def(Melee, Lethal)",
  "icon": "stafffighting_guardedspin.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.05,
    "range": 9,
    "radius": 9,
    "arc": 1.5708,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.83,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Defense Sets",
    "Melee AoE Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.2417,
      "table": "Melee_Damage",
      "duration": 1.5,
      "tickRate": 0.3
    },
    {
      "type": "Fire",
      "scale": 0.1043,
      "table": "Melee_Damage",
      "duration": 1.5,
      "tickRate": 0.3
    }
  ],
  "effects": {
    "defenseBuff": {
      "melee": {
        "scale": 1.5,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 1.5,
        "table": "Melee_Buff_Def"
      }
    }
  }
};
