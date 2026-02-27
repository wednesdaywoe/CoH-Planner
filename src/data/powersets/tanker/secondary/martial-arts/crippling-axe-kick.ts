/**
 * Crippling Axe Kick
 * Melee, DMG(Smash), Foe Immobilize, -SPD, -Fly, -DEF
 *
 * Source: tanker_melee/martial_arts/crippling_axe_kick.json
 */

import type { Power } from '@/types';

export const CripplingAxeKick: Power = {
  "name": "Crippling Axe Kick",
  "internalName": "Crippling_Axe_Kick",
  "available": 27,
  "description": "You can perform a Crippling Axe Kick that deals superior smashing damage, reduces the targets defense, may Immobilize, and Slowing their run speed. Crippling Axe Kick may also knock some flying entities out of the sky.",
  "shortHelp": "Melee, DMG(Smash), Foe Immobilize, -SPD, -Fly, -DEF",
  "icon": "martialarts_cripplinghookkick.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 11,
    "endurance": 11.024,
    "castTime": 1.6
  },
  "allowedEnhancements": [
    "Slow",
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Immobilize",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Immobilize",
    "Melee Damage",
    "Slow Movement",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 2.12,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.954,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "immobilize": {
      "mag": 2,
      "scale": 10,
      "table": "Melee_Immobilize"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.5,
        "table": "Melee_Slow"
      },
      "jumpSpeed": {
        "scale": 0.5,
        "table": "Melee_Slow"
      },
      "jumpHeight": {
        "scale": 0.5,
        "table": "Melee_Slow"
      }
    },
    "slow": {
      "fly": {
        "scale": 1.6,
        "table": "Melee_Ones"
      }
    },
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    }
  }
};
