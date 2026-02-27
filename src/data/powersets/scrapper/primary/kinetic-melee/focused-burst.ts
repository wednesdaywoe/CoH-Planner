/**
 * Focused Burst
 * Ranged, DMG(Smash/Energy), Foe Knockdown
 *
 * Source: scrapper_melee/kinetic_attack/focused_burst.json
 */

import type { Power } from '@/types';

export const FocusedBurst: Power = {
  "name": "Focused Burst",
  "internalName": "Focused_Burst",
  "available": 21,
  "description": "Projects a burst of focused power over a short distance. Focused Burst deals high damage and can possibly knock down your foe.",
  "shortHelp": "Ranged, DMG(Smash/Energy), Foe Knockdown",
  "icon": "kineticattack_focusedburst.png",
  "powerType": "Click",
  "effectArea": "Chain",
  "stats": {
    "accuracy": 1,
    "range": 40,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 2,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Ranged Damage",
    "Scrapper Archetype Sets",
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
    },
    {
      "type": "Energy",
      "scale": 1.64,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Energy",
      "scale": 1.64,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Fire",
      "scale": 0.738,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.335,
      "table": "Melee_Ones"
    },
    "damageDebuff": {
      "scale": 0.7,
      "table": "Melee_Debuff_Dam"
    }
  }
};
