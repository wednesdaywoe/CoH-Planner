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
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee AoE Damage",
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.205,
      "table": "Melee_Damage",
      "duration": 2.3,
      "tickRate": 0.4
    },
    {
      "type": "Smashing",
      "scale": 0.492,
      "table": "Melee_Damage"
    },
    {
      "type": "Smashing",
      "scale": 1.23,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Smashing",
      "scale": 1.23,
      "table": "Melee_InherentDamage"
    }
  ],
  "effects": {
    "resistanceDebuff": {
      "smashing": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      },
      "fire": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      },
      "psionic": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      }
    },
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
