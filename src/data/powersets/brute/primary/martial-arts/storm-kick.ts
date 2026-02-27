/**
 * Storm Kick
 * Melee, DMG(Smash), Self +Defense(Melee, Ranged, AoE)
 *
 * Source: brute_melee/martial_arts/storm_kick.json
 */

import type { Power } from '@/types';

export const StormKick: Power = {
  "name": "Storm Kick",
  "internalName": "Storm_Kick",
  "available": 0,
  "description": "You can unleash a roundhouse kick that pummels your foe for moderate damage. Storm Kick boosts the Tanker's defense against melee, ranged and area of effect damage slightly for a short period of time after hitting their foe. This bonus defense doesn't stack with itself and is unenhanceable.",
  "shortHelp": "Melee, DMG(Smash), Self +Defense(Melee, Ranged, AoE)",
  "icon": "martialarts_stormkick.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 6,
    "endurance": 6.864,
    "castTime": 0.83
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Melee Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1.32,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.594,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "defenseBuff": {
      "ranged": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      },
      "melee": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      },
      "aoe": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      },
      "smashing": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      },
      "fire": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      },
      "cold": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      },
      "energy": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      },
      "negative": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      }
    }
  }
};
