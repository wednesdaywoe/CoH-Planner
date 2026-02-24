/**
 * Vicious Slash
 * Melee, DMG(Lethal), Foe DoT (Lethal), Knockdown, Self +2 Blood Frenzy
 *
 * Source: brute_melee/savage_melee/vicious_slash.json
 */

import type { Power } from '@/types';

export const ViciousSlash: Power = {
  "name": "Vicious Slash",
  "internalName": "Vicious_Slash",
  "available": 7,
  "description": "You tear at your foe with both hands dealing high lethal damage and causing minor lethal damage over time. Foes struck by this attack have a high chance to be knocked down.",
  "shortHelp": "Melee, DMG(Lethal), Foe DoT (Lethal), Knockdown, Self +2 Blood Frenzy",
  "icon": "savagemelee_viciousslash.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 9,
    "endurance": 9.36,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Knockback",
    "Melee Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1.8,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.81,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
