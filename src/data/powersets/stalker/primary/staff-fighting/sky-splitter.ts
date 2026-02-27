/**
 * Sky Splitter
 * Melee, DMG(Smash), Foe Knock Up, Disorient, -Fly, Consumes Perfection
 *
 * Source: stalker_melee/staff_fighting/sky_splitter.json
 */

import type { Power } from '@/types';

export const SkySplitter: Power = {
  "name": "Sky Splitter",
  "internalName": "Sky_Splitter",
  "available": 25,
  "description": "You leap into the air and hammer your foe with an overhead bash from your staff. Sky Splitter deals Smashing damage, will knock the target into the air and will briefly disorient your target. This power will build one stack of Perfection of Body if the user has two or less stacks, if the user has three stacks of Perfection of Body it will consume them and gain some benefit. 3 Levels of Perfection of Body will cause additional smashing damage and grant the user a bonus to damage resistance a short time. Critical Hit damage isn't enhanced by levels of Perfection.",
  "shortHelp": "Melee, DMG(Smash), Foe Knock Up, Disorient, -Fly, Consumes Perfection",
  "icon": "stafffighting_skysplitter.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 9,
    "recharge": 15,
    "endurance": 14.352,
    "castTime": 2.83
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee Damage",
    "Stalker Archetype Sets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1.38,
      "table": "Melee_Damage",
      "duration": 1.9,
      "tickRate": 1
    },
    {
      "type": "Smashing",
      "scale": 1.656,
      "table": "Melee_Damage"
    },
    {
      "type": "Smashing",
      "scale": 2.76,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Smashing",
      "scale": 2.76,
      "table": "Melee_InherentDamage"
    }
  ],
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 5,
      "table": "Melee_Stun"
    },
    "knockup": {
      "scale": 0.67,
      "table": "Melee_Ones"
    },
    "slow": {
      "fly": {
        "scale": 1.6,
        "table": "Melee_Ones"
      }
    },
    "resistance": {
      "smashing": {
        "scale": 1.33,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 1.33,
        "table": "Melee_Res_Dmg"
      },
      "fire": {
        "scale": 1.33,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 1.33,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 1.33,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 1.33,
        "table": "Melee_Res_Dmg"
      },
      "psionic": {
        "scale": 1.33,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 1.33,
        "table": "Melee_Res_Dmg"
      }
    }
  }
};
