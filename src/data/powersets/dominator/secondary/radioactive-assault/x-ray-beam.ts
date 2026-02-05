/**
 * X-Ray Beam
 * Ranged, Superior DMG(Energy), Foe -DEF
 *
 * Source: dominator_assault/radioactive_assault/x-ray_beam.json
 */

import type { Power } from '@/types';

export const XRayBeam: Power = {
  "name": "X-Ray Beam",
  "internalName": "X-Ray_Beam",
  "available": 3,
  "description": "You can emit a beam of X-Ray energy from your eyes, dealing moderate Energy damage. This attack can bypass some defenses and can reduce the target's Defense. Affected enemies have a small chance to be affected by the Contaminated effect. Hitting Contaminated foes with single target Radioactive Assault powers cause a small burst of damage to foes near the target.Damage: Superior.Recharge: Slow.",
  "shortHelp": "Ranged, Superior DMG(Energy), Foe -DEF",
  "icon": "radioactiveassault_xraybeam.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 11,
    "endurance": 11.024,
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
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 2.12,
    "table": "Ranged_Damage"
  },
  "effects": {
    "defenseDebuff": {
      "scale": 2,
      "table": "Ranged_Debuff_Def"
    }
  }
};
