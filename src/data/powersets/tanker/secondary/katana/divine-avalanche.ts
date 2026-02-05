/**
 * Divine Avalanche
 * Melee, DMG(Lethal), Self +DEF (Melee, Lethal)
 *
 * Source: tanker_melee/katana/parry.json
 */

import type { Power } from '@/types';

export const DivineAvalanche: Power = {
  "name": "Divine Avalanche",
  "internalName": "Parry",
  "available": 15,
  "description": "You can use your katana to parry incoming melee attacks and then quickly return the favor. Divine Avalanche does minor damage, but every successful hit will increase your Defense against melee and lethal attacks for a short while.",
  "shortHelp": "Melee, DMG(Lethal), Self +DEF (Melee, Lethal)",
  "icon": "katana_parry.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 3,
    "endurance": 4.368,
    "castTime": 1.33
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Melee Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.84,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.378,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "defenseBuff": {
      "melee": {
        "scale": 1.5,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 1.5,
        "table": "Melee_Buff_Def"
      }
    }
  }
};
