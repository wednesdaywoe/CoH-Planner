/**
 * Bone Smasher
 * Melee, DMG(Smash/Energy), Disorient
 *
 * Source: brute_melee/energy_melee/bone_smasher.json
 */

import type { Power } from '@/types';

export const BoneSmasher: Power = {
  "name": "Bone Smasher",
  "internalName": "Bone_Smasher",
  "available": 1,
  "description": "This melee attack deals a good amount of damage and has a good chance to Disorient the target.",
  "shortHelp": "Melee, DMG(Smash/Energy), Disorient",
  "icon": "powerpunch_bonesmasher.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.27
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Melee Damage",
    "Stuns",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Energy",
      "scale": 1,
      "table": "Melee_Damage"
    },
    {
      "type": "Smashing",
      "scale": 0.64,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.738,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 8,
      "table": "Melee_Stun"
    }
  }
};
