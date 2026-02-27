/**
 * Savage Leap
 * PBAoE, DMG(Lethal), Foe DoT (Lethal), Self 1 to 3 Blood Frenzy, Teleport
 *
 * Source: brute_melee/savage_melee/savage_leap.json
 */

import type { Power } from '@/types';

export const SavageLeap: Power = {
  "name": "Savage Leap",
  "internalName": "Savage_Leap",
  "available": 25,
  "description": "You throw yourself at your distant foes while slashing and tearing wildly dealing moderate lethal damage and causing your foes to suffer from additional minor lethal damage over time. The damage of this power can increase based on how far away you leap from, with up to double damage dealt at its strongest. Savage Leap build 1 stacks of Blood Frenzy for every 20 ft in between your target and you, up to 3 stacks.",
  "shortHelp": "PBAoE, DMG(Lethal), Foe DoT (Lethal), Self 1 to 3 Blood Frenzy, Teleport",
  "icon": "savagemelee_savageleap.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "recharge": 40,
    "endurance": 17.58,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Melee AoE Damage",
    "Teleport",
    "Threat Duration",
    "Universal Damage Sets",
    "Universal Travel"
  ],
  "maxSlots": 6,
  "effects": {
    "teleport": {
      "scale": 1,
      "table": "Melee_Ones"
    }
  }
};
