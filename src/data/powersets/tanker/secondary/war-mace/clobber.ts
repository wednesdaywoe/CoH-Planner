/**
 * Clobber
 * Melee, DMG(Smash), Disorient
 *
 * Source: tanker_melee/war_mace/clobber.json
 */

import type { Power } from '@/types';

export const Clobber: Power = {
  "name": "Clobber",
  "internalName": "Clobber",
  "available": 23,
  "description": "You Clobber your foe with a massive swing of your mace. This attack deals exceptional damage and can leave most opponents disoriented for a period of time.",
  "shortHelp": "Melee, DMG(Smash), Disorient",
  "icon": "mace_clobber.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 1.23
  },
  "allowedEnhancements": [
    "Taunt",
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
      "type": "Smashing",
      "scale": 2.92,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 1.314,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 5,
      "table": "Melee_Stun"
    }
  }
};
