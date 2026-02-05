/**
 * X-Ray Beam
 * Ranged, DMG(Energy), Foe -DEF
 *
 * Source: sentinel_ranged/radiation_blast/x-ray_beam.json
 */

import type { Power } from '@/types';

export const XRayBeam: Power = {
  "name": "X-Ray Beam",
  "internalName": "X-Ray_Beam",
  "available": 0,
  "description": "You can emit a beam of X-Ray energy from your eyes, dealing moderate Energy damage. This attack can bypass some defenses and can reduce the target's Defense.",
  "shortHelp": "Ranged, DMG(Energy), Foe -DEF",
  "icon": "radiationburst_xraybeam.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.1,
    "range": 60,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.67
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
    "Ranged Damage",
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 1.64,
    "table": "Ranged_Damage"
  },
  "effects": {
    "defenseDebuff": {
      "scale": 2,
      "table": "Ranged_Debuff_Def"
    }
  }
};
