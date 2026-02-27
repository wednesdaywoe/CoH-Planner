/**
 * Crippling Axe Kick
 * Melee, DMG(Smashing), Foe Immobilize, -SPD, -Fly, -DEF
 *
 * Source: stalker_melee/martial_arts/crippling_axe_kick.json
 */

import type { Power } from '@/types';

export const CripplingAxeKick: Power = {
  "name": "Crippling Axe Kick",
  "internalName": "Crippling_Axe_Kick",
  "available": 1,
  "description": "You can perform a Crippling Axe Kick that deals moderate smashing damage, reduces the targets defense, may Immobilize, and Slowing their run speed. Crippling Axe Kick may also knock some flying entities out of the sky.",
  "shortHelp": "Melee, DMG(Smashing), Foe Immobilize, -SPD, -Fly, -DEF",
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
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 2.12,
    "table": "Melee_Damage"
  },
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
