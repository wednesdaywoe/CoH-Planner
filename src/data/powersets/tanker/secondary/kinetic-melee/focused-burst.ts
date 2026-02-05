/**
 * Focused Burst
 * Ranged, DMG(Smash/Energy), Foe Knockdown
 *
 * Source: tanker_melee/kinetic_attack/focused_burst.json
 */

import type { Power } from '@/types';

export const FocusedBurst: Power = {
  "name": "Focused Burst",
  "internalName": "Focused_Burst",
  "available": 27,
  "description": "Projects a burst of focused power over a short distance. Focused Burst deals high damage and can possibly knock down your foe.",
  "shortHelp": "Ranged, DMG(Smash/Energy), Foe Knockdown",
  "icon": "kineticattack_focusedburst.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 40,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 2
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Ranged Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1.23,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.41,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.738,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    },
    "damageDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Dam"
    }
  }
};
