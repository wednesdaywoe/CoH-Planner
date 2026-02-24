/**
 * Barrage
 * Melee, DMG(Smash/Energy), Foe Disorient, Special
 *
 * Source: tanker_melee/energy_melee/barrage.json
 */

import type { Power } from '@/types';

export const Barrage: Power = {
  "name": "Barrage",
  "internalName": "Barrage",
  "available": 0,
  "description": "You perform a quick punch that deals moderate damage. Coupled with other energy punches, Barrage can Disorient a foe. This power will have a 100% chance to stun and weaken the target's secondary effects and regeneration rate if used while in Energy Focus mode.",
  "shortHelp": "Melee, DMG(Smash/Energy), Foe Disorient, Special",
  "icon": "powerpunch_quick.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 6,
    "endurance": 6.864,
    "castTime": 1.33
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee Damage",
    "Stuns",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Energy",
      "scale": 0.5,
      "table": "Melee_Damage",
      "duration": 0.3,
      "tickRate": 0.25
    },
    {
      "type": "Smashing",
      "scale": 0.16,
      "table": "Melee_Damage",
      "duration": 0.3,
      "tickRate": 0.25
    },
    {
      "type": "Fire",
      "scale": 0.297,
      "table": "Melee_Damage",
      "duration": 0.3,
      "tickRate": 0.25
    }
  ],
  "effects": {
    "regenDebuff": {
      "scale": 1,
      "table": "Melee_Ones"
    },
    "stun": {
      "mag": 3,
      "scale": 8,
      "table": "Melee_Stun"
    },
    "damageDebuff": {
      "scale": 0.25,
      "table": "Melee_Stun"
    },
    "absorb": {
      "scale": 0.25,
      "table": "Melee_Stun"
    },
    "enduranceDrain": {
      "scale": 0.25,
      "table": "Melee_Stun"
    },
    "slow": {
      "runSpeed": {
        "scale": 0.25,
        "table": "Melee_Stun"
      },
      "flySpeed": {
        "scale": 0.25,
        "table": "Melee_Stun"
      }
    },
    "confuse": {
      "mag": 1,
      "scale": 0.25,
      "table": "Melee_Stun"
    },
    "fear": {
      "mag": 1,
      "scale": 0.25,
      "table": "Melee_Stun"
    },
    "hold": {
      "mag": 1,
      "scale": 0.25,
      "table": "Melee_Stun"
    },
    "immobilize": {
      "mag": 1,
      "scale": 0.25,
      "table": "Melee_Stun"
    },
    "sleep": {
      "mag": 1,
      "scale": 0.25,
      "table": "Melee_Stun"
    },
    "defenseDebuff": {
      "scale": 0.25,
      "table": "Melee_Stun"
    },
    "tohitDebuff": {
      "scale": 0.25,
      "table": "Melee_Stun"
    },
    "effectDuration": 15
  }
};
