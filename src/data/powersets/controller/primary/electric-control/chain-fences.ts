/**
 * Chain Fences
 * Ranged AoE, DMG(Energy), Foe Immobilize, -End, -Fly
 *
 * Source: controller_control/electric_control/chain_fences.json
 */

import type { Power } from '@/types';

export const ChainFences: Power = {
  "name": "Chain Fences",
  "internalName": "Chain_Fences",
  "available": 1,
  "description": "You can immobilize multiple foes in a chain of electricity, dealing minor damage to all foes in range and draining some endurance. This power also reduces Flight capacity in targets.",
  "shortHelp": "Ranged AoE, DMG(Energy), Foe Immobilize, -End, -Fly",
  "icon": "electriccontrol_chainfences.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.9,
    "range": 80,
    "radius": 30,
    "recharge": 8,
    "endurance": 15.6,
    "castTime": 1.17,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Controller Archetype Sets",
    "Endurance Modification",
    "Immobilize",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Energy",
      "scale": 0.3,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.1,
      "table": "Ranged_Damage",
      "duration": 5.2,
      "tickRate": 2
    },
    {
      "type": "Energy",
      "scale": 0.3,
      "table": "Ranged_InherentDamage"
    },
    {
      "type": "Energy",
      "scale": 0.1,
      "table": "Ranged_InherentDamage",
      "duration": 5.2,
      "tickRate": 2
    }
  ],
  "effects": {
    "immobilize": {
      "mag": 3,
      "scale": 15,
      "table": "Ranged_Immobilize"
    },
    "enduranceDrain": {
      "scale": 0.1,
      "table": "Ranged_Ones"
    },
    "recoveryDebuff": {
      "scale": 1,
      "table": "Ranged_Ones"
    },
    "slow": {
      "fly": {
        "scale": 1.6,
        "table": "Ranged_Ones"
      }
    }
  }
};
