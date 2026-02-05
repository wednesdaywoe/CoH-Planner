/**
 * Refractor Beam
 * Chain, DMG(Energy), Special
 *
 * Source: sentinel_ranged/beam_rifle/refractor_beam.json
 */

import type { Power } from '@/types';

export const RefractorBeam: Power = {
  "name": "Refractor Beam",
  "internalName": "Refractor_Beam",
  "available": 17,
  "description": "You carefully calibrate your rifle and shoot a refractor beam that will split up on impact, dealing moderate energy damage and reducing the defense of your target and 9 nearby foes. The beam has a high chance to split again off the secondary targets, hitting up to 10 foes. If the target is also suffering from the Disintegrating effect it will suffer additional damage over time.",
  "shortHelp": "Chain, DMG(Energy), Special",
  "icon": "beamrifle_refractorbeam.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.05,
    "range": 40,
    "radius": 15,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 1.67,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Ranged AoE Damage",
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Energy",
      "scale": 0.9,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.099,
      "table": "Ranged_Damage",
      "duration": 3.1,
      "tickRate": 1.5
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 0.5,
      "table": "Ranged_Debuff_Def"
    }
  }
};
