/**
 * Maiming Slash
 * Melee, DMG(Lethal), DoT (Lethal), Foe -Speed, +1 Blood Frenzy
 *
 * Source: dominator_assault/savage_assault/maiming_slash.json
 */

import type { Power } from '@/types';

export const MaimingSlash: Power = {
  "name": "Maiming Slash",
  "internalName": "Maiming_Slash",
  "available": 0,
  "description": "You execute a savage slash at your foe's lower body causing moderate lethal damage and minor damage over time. The foe will also have their movement speed reduced moderately. Maiming Slash grants 1 stack of Blood Frenzy.Damage: Moderate.Recharge: Fast.",
  "shortHelp": "Melee, DMG(Lethal), DoT (Lethal), Foe -Speed, +1 Blood Frenzy",
  "icon": "savagemelee_maimingslash.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 5,
    "endurance": 6.03,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1.16,
      "table": "Melee_Damage"
    },
    {
      "type": "Lethal",
      "scale": 0.209,
      "table": "Melee_Damage",
      "duration": 3.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "movement": {
      "runSpeed": {
        "scale": 0.7,
        "table": "Melee_Slow"
      },
      "jumpSpeed": {
        "scale": 0.7,
        "table": "Melee_Slow"
      },
      "jumpHeight": {
        "scale": 0.7,
        "table": "Melee_Slow"
      }
    }
  }
};
