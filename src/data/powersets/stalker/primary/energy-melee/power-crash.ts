/**
 * Power Crash
 * Melee (Cone), DMG(Smash/Energy), Foe Disorient, Special
 *
 * Source: stalker_melee/energy_melee/stun.json
 */

import type { Power } from '@/types';

export const PowerCrash: Power = {
  "name": "Power Crash",
  "internalName": "Stun",
  "available": 17,
  "description": "You focus your internal energy on your fists and release it once you hit your target unleashing an energy wave that hurts and disorients multiple enemies. This power will hit up to 5 additional foes if used while in Energy Focus mode.Notes: Power Crash is unaffected by Arc changes.",
  "shortHelp": "Melee (Cone), DMG(Smash/Energy), Foe Disorient, Special",
  "icon": "powerpunch_powercrash.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 10,
    "radius": 10,
    "arc": 2.0944,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 1.8,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee AoE Damage",
    "Stalker Archetype Sets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.8198,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 1.132,
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
