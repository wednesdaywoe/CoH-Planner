/**
 * Mud Pots
 * Toggle: PBAoE, Minor DoT(Fire), Foe Immobilize, -SPD
 *
 * Source: brute_defense/stone_armor/mud_pots.json
 */

import type { Power } from '@/types';

export const MudPots: Power = {
  "name": "Mud Pots",
  "internalName": "Mud_Pots",
  "available": 9,
  "description": "While this power is active, you draw upon the geothermal power of the Earth to create a bubbling pool of hot mud around you. All foes in melee range will become snared and entrapped in the mud, Immobilizing some and slowing others. The boiling heat from Mud Pots may also deal some damage over time to the snared foes.Damage: Minor(DoT).Recharge: Fast.",
  "shortHelp": "Toggle: PBAoE, Minor DoT(Fire), Foe Immobilize, -SPD",
  "icon": "stonearmor_clay.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 8,
    "recharge": 4,
    "endurance": 1.04,
    "castTime": 2.03,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Slow",
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Melee AoE Damage",
    "Slow Movement",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Fire",
    "scale": 0.18,
    "table": "Melee_Damage"
  },
  "effects": {
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
      "runSpeed": {
        "scale": 1,
        "table": "Melee_SpeedRunning"
      }
    },
    "immobilize": {
      "mag": 2,
      "scale": 2.25,
      "table": "Melee_Ones"
    }
  }
};
