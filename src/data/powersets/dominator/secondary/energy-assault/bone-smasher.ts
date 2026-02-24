/**
 * Bone Smasher
 * Melee, High DMG(Smash/Energy), Disorient, Special, Chance for Energy Focus
 *
 * Source: dominator_assault/energy_assault/bone_smasher.json
 */

import type { Power } from '@/types';

export const BoneSmasher: Power = {
  "name": "Bone Smasher",
  "internalName": "Bone_Smasher",
  "available": 0,
  "description": "This melee attack can be slow, but it compensates by dealing a good amount of damage and having a good chance to Disorient the target. If used against a Disoriented foe, there is a small chance to enter Energy Focus mode. This power will weaken the target's secondary effects if used while in Energy Focus mode.Damage: High.Recharge: Moderate.",
  "shortHelp": "Melee, High DMG(Smash/Energy), Disorient, Special, Chance for Energy Focus",
  "icon": "energyassault_bonesmasher.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1.5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Dominator Archetype Sets",
    "Melee Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.784,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 1.176,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "regenDebuff": {
      "scale": 0.5,
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
