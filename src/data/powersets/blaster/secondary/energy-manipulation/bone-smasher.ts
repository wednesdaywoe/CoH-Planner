/**
 * Bone Smasher
 * Melee, Superior DMG(Smash/Energy), Foe Disorient
 *
 * Source: blaster_support/energy_manipulation/bone_smasher.json
 */

import type { Power } from '@/types';

export const BoneSmasher: Power = {
  "name": "Bone Smasher",
  "internalName": "Bone_Smasher",
  "available": 9,
  "description": "The Bone Smasher is a slow attack, but makes up for it with a good amount of damage. Has a greater chance to Disorient than Energy Punch.Damage: Superior.Recharge: Slow.",
  "shortHelp": "Melee, Superior DMG(Smash/Energy), Foe Disorient",
  "icon": "energymanipulation_bonesmasher.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 14,
    "endurance": 13.52,
    "castTime": 1.5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Melee Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1.82,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.78,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 8,
      "table": "Melee_Stun"
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
