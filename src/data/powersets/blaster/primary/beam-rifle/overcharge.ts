/**
 * Overcharge
 * Ranged (Targeted AoE), DMG(Energy), Foe Minor DoT (Energy), -Def(All), Disorient, Special
 *
 * Source: blaster_ranged/beam_rifle/overcharge.json
 */

import type { Power } from '@/types';

export const Overcharge: Power = {
  "name": "Overcharge",
  "internalName": "Overcharge",
  "available": 25,
  "description": "You overcharge your Beam Rifle and release a massive blast of energy at a group of distant foes causing Extreme Energy damage, causing Minor Energy damage over time, reducing the defense of all affected foes and potentially stunning affected foes. If Overcharge strikes a target suffering from the Disintegrating effect they will be affected by a longer stun.",
  "shortHelp": "Ranged (Targeted AoE), DMG(Energy), Foe Minor DoT (Energy), -Def(All), Disorient, Special",
  "icon": "beamrifle_overcharge.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.4,
    "range": 80,
    "radius": 25,
    "recharge": 125,
    "endurance": 20.8,
    "castTime": 2.9,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Blaster Archetype Sets",
    "Defense Debuff",
    "Ranged AoE Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Energy",
      "scale": 3,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.1,
      "table": "Ranged_Damage",
      "duration": 4.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 1.5,
      "table": "Ranged_Debuff_Def"
    },
    "stun": {
      "mag": 3,
      "scale": 4,
      "table": "Ranged_Stun"
    }
  }
};
