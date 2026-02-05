/**
 * Piercing Beam
 * Narrow Ranged (Cone), DMG(Energy), Foes -Res, Special
 *
 * Source: sentinel_ranged/beam_rifle/piercing_beam.json
 */

import type { Power } from '@/types';

export const PiercingBeam: Power = {
  "name": "Piercing Beam",
  "internalName": "Piercing_Beam",
  "available": 21,
  "description": "You release a supercharged beam in a narrow cone of energy that pierces through up to 3 enemies. Piercing Beam deals High Energy damage and briefly reduces their damage resistance. If a target struck by Piercing Beam is suffering from the Disintegrating effect it will immediately suffer additional damage.",
  "shortHelp": "Narrow Ranged (Cone), DMG(Energy), Foes -Res, Special",
  "icon": "beamrifle_piercingbeam.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.05,
    "range": 60,
    "radius": 60,
    "arc": 0.0873,
    "recharge": 14,
    "endurance": 13.52,
    "castTime": 2.33,
    "maxTargets": 3
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged AoE Damage",
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Energy",
      "scale": 2.17,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.716,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "resistanceDebuff": {
      "smashing": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "lethal": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "fire": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "cold": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "energy": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "negative": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "psionic": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "toxic": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      }
    }
  }
};
