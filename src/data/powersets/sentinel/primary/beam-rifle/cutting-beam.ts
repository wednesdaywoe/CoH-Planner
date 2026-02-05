/**
 * Cutting Beam
 * Ranged (Cone), DMG(Energy), Foe -Def(All), Special
 *
 * Source: sentinel_ranged/beam_rifle/cutting_beam.json
 */

import type { Power } from '@/types';

export const CuttingBeam: Power = {
  "name": "Cutting Beam",
  "internalName": "Cutting_Beam",
  "available": 1,
  "description": "You fire a constant stream of energy from your weapon and sweep it in a broad arc blasting all foes in a wide cone in front of you. Cutting beam deals Moderate Energy damage and reduces the targets' Defense. This power will cause Minor Energy damage over time if the target is suffering from the Disintegrating effect.",
  "shortHelp": "Ranged (Cone), DMG(Energy), Foe -Def(All), Special",
  "icon": "beamrifle_cuttingbeam.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.05,
    "range": 40,
    "radius": 40,
    "arc": 0.7854,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1.9,
    "maxTargets": 6
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
      "scale": 0.943,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.101,
      "table": "Ranged_Damage",
      "duration": 2.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Ranged_Debuff_Def"
    }
  }
};
