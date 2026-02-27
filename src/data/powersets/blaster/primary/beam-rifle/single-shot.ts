/**
 * Single Shot
 * Ranged, DMG(Energy), Foe Knockdown, Special
 *
 * Source: blaster_ranged/beam_rifle/single_shot.json
 */

import type { Power } from '@/types';

export const SingleShot: Power = {
  "name": "Single Shot",
  "internalName": "Single_Shot",
  "available": 0,
  "description": "You fire a single blast from your Beam Rifle which deals Moderate Energy damage and has a chance to knock the target down. If the target is suffering from the Disintegrating effect, Single Shot will reduce the target's regeneration rate slightly. In addition, targets already affected by the Disintegrating effect have a chance to spread to 3 nearby targets. This Disintegrate Spread effect can only hit targets that aren't already affected by the Disintegrating effect. Disintegrate Spread causes Minor Energy damage over time.",
  "shortHelp": "Ranged, DMG(Energy), Foe Knockdown, Special",
  "icon": "beamrifle_singleshot.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 80,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 1
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
    "Blaster Archetype Sets",
    "Knockback",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 1,
    "table": "Ranged_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Ranged_Ones"
    },
    "regenDebuff": {
      "scale": 0.75,
      "table": "Ranged_Ones"
    }
  }
};
