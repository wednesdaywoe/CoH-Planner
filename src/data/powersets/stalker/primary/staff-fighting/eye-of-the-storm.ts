/**
 * Eye of the Storm
 * PBAoE Melee, DMG(Smash), Foe Knockdown, Consumes Perfection
 *
 * Source: stalker_melee/staff_fighting/eye_of_the_storm.json
 */

import type { Power } from '@/types';

export const EyeoftheStorm: Power = {
  "name": "Eye of the Storm",
  "internalName": "Eye_of_the_Storm",
  "available": 17,
  "description": "With a lightning fast series of spins of your staff you strike at all nearby foes dealing damage with a chance of knocking foes down. This power will build one stack of Perfection of Body if the user has two or less stacks, if the user has three stacks of Perfection of Body it will consume them and gain some benefit. 3 stacks of Perfection of Body will cause additional smashing damage and reduce damage resistance slightly for a short time.",
  "shortHelp": "PBAoE Melee, DMG(Smash), Foe Knockdown, Consumes Perfection",
  "icon": "stafffighting_eyeofthestorm.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.05,
    "radius": 10,
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
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
