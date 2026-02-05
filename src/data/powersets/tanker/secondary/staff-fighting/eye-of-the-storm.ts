/**
 * Eye of the Storm
 * PBAoE Melee, DMG(Smash), Foe Knockdown, Consumes Perfection
 *
 * Source: tanker_melee/staff_fighting/eye_of_the_storm.json
 */

import type { Power } from '@/types';

export const EyeoftheStorm: Power = {
  "name": "Eye of the Storm",
  "internalName": "Eye_of_the_Storm",
  "available": 15,
  "description": "With a lightning fast series of spins of your staff you strike at all nearby foes dealing moderate damage with a chance of knocking foes down. While a form is active, this power will build one level of Perfection if the user has two or less levels, if the user has three levels of Perfection it will consume them and gain some benefit. 3 Levels of Perfection of Body will cause additional smashing damage and reduce damage resistance slightly for a short time. 3 Levels of Perfection of Mind will cause additional psionic damage and reduce attack and movement speed for a short time. 3 Levels of Perfection of Soul will cause additional energy damage and reduce defense for a short time.Notes: Thanks to gauntlet, this power can hit up to 6 targets above its cap at 1/3rd effectiveness.",
  "shortHelp": "PBAoE Melee, DMG(Smash), Foe Knockdown, Consumes Perfection",
  "icon": "stafffighting_eyeofthestorm.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.05,
    "radius": 15,
    "recharge": 17,
    "endurance": 16.016,
    "castTime": 2.57,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee AoE Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
