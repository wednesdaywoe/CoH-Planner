/**
 * Frozen Fists
 * Melee, DMG(Cold/Smash), Foe -Recharge, -SPD
 *
 * Source: stalker_melee/ice_melee/frozen_fists.json
 */

import type { Power } from '@/types';

export const FrozenFists: Power = {
  "name": "Frozen Fists",
  "internalName": "Frozen_Fists",
  "available": 0,
  "description": "Frozen Fists encrusts your hands in ice, giving them the ability to quickly inflict minor damage on villains. The foe's attack and movement speed is Slowed, due to the chills caused by the cold blows.",
  "shortHelp": "Melee, DMG(Cold/Smash), Foe -Recharge, -SPD",
  "icon": "icyonslaught_frozenfist.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 3,
    "endurance": 4.368,
    "castTime": 1.33
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee Damage",
    "Slow Movement",
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 0.3,
      "tickRate": 0.25
    },
    {
      "type": "Cold",
      "scale": 0.4,
      "table": "Melee_Damage",
      "duration": 0.3,
      "tickRate": 0.25
    }
  ],
  "effects": {
    "movement": {
      "runSpeed": {
        "scale": 0.1,
        "table": "Melee_Slow"
      },
      "flySpeed": {
        "scale": 0.1,
        "table": "Melee_Slow"
      },
      "jumpSpeed": {
        "scale": 0.1,
        "table": "Melee_Slow"
      },
      "jumpHeight": {
        "scale": 0.1,
        "table": "Melee_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.1,
      "table": "Melee_Slow"
    }
  }
};
