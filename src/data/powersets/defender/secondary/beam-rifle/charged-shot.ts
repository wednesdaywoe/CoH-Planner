/**
 * Charged Shot
 * Ranged, DMG(Energy), Foe Knockdown, Special
 *
 * Source: defender_ranged/beam_rifle/charged_shot.json
 */

import type { Power } from '@/types';

export const ChargedShot: Power = {
  "name": "Charged Shot",
  "internalName": "Charged_Shot",
  "available": 0,
  "description": "By charging up your Beam Rifle, you're able to launch a concentrated blast of energy at your foe to cause High Energy damage. The impact strikes with such force that it can knock your target off of their feet. Charge Shot causes additional damage if the target is suffering from the Disintegrating effect. In addition, targets already affected by the Disintegrating effect have a chance to spread to 3 nearby targets. This Disintegrate Spread effect can only hit targets that aren't already affected by the Disintegrating effect. Disintegrate Spread causes Minor Energy damage over time.",
  "shortHelp": "Ranged, DMG(Energy), Foe Knockdown, Special",
  "icon": "beamrifle_chargedshot.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 80,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.67
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
    "Defender Archetype Sets",
    "Knockback",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Energy",
      "scale": 1.64,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.246,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Ranged_Ones"
    }
  }
};
