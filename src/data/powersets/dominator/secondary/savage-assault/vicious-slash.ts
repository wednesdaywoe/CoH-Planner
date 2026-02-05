/**
 * Vicious Slash
 * Melee, DMG(Lethal), Foe DoT (Lethal), Knockdown, Self +2 Blood Frenzy
 *
 * Source: dominator_assault/savage_assault/vicious_slash.json
 */

import type { Power } from '@/types';

export const ViciousSlash: Power = {
  "name": "Vicious Slash",
  "internalName": "Vicious_Slash",
  "available": 3,
  "description": "You tear at your foe with both hands dealing high lethal damage and causing minor lethal damage over time. Foes struck by this attack have a high chance to be knocked down. Vicious Slash grants 2 stacks of Blood Frenzy.Damage: Superior.Recharge: Slow.",
  "shortHelp": "Melee, DMG(Lethal), Foe DoT (Lethal), Knockdown, Self +2 Blood Frenzy",
  "icon": "savagemelee_viciousslash.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 11,
    "endurance": 11.024,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Dominator Archetype Sets",
    "Knockback",
    "Melee Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 2.12,
      "table": "Melee_Damage"
    },
    {
      "type": "Lethal",
      "scale": 0.3816,
      "table": "Melee_Damage",
      "duration": 3.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
