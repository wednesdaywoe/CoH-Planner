/**
 * Eye of the Storm
 * PBAoE Melee, DMG(Smash), Foe Knockdown, Consumes Perfection
 *
 * Source: scrapper_melee/staff_fighting/eye_of_the_storm.json
 */

import type { Power } from '@/types';

export const EyeoftheStorm: Power = {
  "name": "Eye of the Storm",
  "internalName": "Eye_of_the_Storm",
  "available": 5,
  "description": "With a lightning fast series of spins of your staff you strike at all nearby foes dealing damage with a chance of knocking foes down. While a form is active, this power will build one level of Perfection if the user has two or less levels, if the user has three levels of Perfection it will consume them and gain some benefit. 3 Levels of Perfection of Body will cause additional smashing damage and reduce damage resistance slightly for a short time. 3 Levels of Perfection of Mind will cause additional psionic damage and reduce attack and movement speed for a short time. 3 Levels of Perfection of Soul will cause additional energy damage and reduce defense for a short time. Critical Hit damage isn't enhanced by levels of Perfection.",
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
    "Scrapper Archetype Sets",
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
      "type": "Psionic",
      "scale": 0.492,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.492,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.0923,
      "table": "Melee_Damage",
      "duration": 2.3,
      "tickRate": 0.4
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
    "movement": {
      "jumpHeight": {
        "scale": 0.15,
        "table": "Melee_Slow"
      },
      "runSpeed": {
        "scale": 0.15,
        "table": "Melee_Slow"
      },
      "flySpeed": {
        "scale": 0.15,
        "table": "Melee_Slow"
      },
      "jumpSpeed": {
        "scale": 0.15,
        "table": "Melee_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.15,
      "table": "Melee_Slow"
    },
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    },
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
