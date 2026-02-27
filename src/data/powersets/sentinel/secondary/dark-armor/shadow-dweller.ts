/**
 * Shadow Dweller
 * Auto: Self +Regen, +DEF(All but Toxic and Psionic), +Res(Immobilize), +Perception
 *
 * Source: sentinel_defense/dark_armor/tenebrous_regeneration.json
 */

import type { Power } from '@/types';

export const ShadowDweller: Power = {
  "name": "Shadow Dweller",
  "internalName": "Tenebrous_Regeneration",
  "available": 0,
  "description": "You are a true Shadow Dweller of the Netherworld. Your affinity for the shadows grants you an inherent bonus to all Defense, as well as an increased regeneration, Perception and a resistance to Immobilization. Your Perception bonus and resistance to Immobilization improves over level. Shadow Dweller is an Auto power. It is always on and costs no Endurance.",
  "shortHelp": "Auto: Self +Regen, +DEF(All but Toxic and Psionic), +Res(Immobilize), +Perception",
  "icon": "darkarmor_selfbuffdefense.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1
  },
  "allowedEnhancements": [
    "Healing",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseBuff": {
      "smashing": {
        "scale": 0.25,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 0.25,
        "table": "Melee_Buff_Def"
      },
      "fire": {
        "scale": 0.25,
        "table": "Melee_Buff_Def"
      },
      "cold": {
        "scale": 0.25,
        "table": "Melee_Buff_Def"
      },
      "energy": {
        "scale": 0.25,
        "table": "Melee_Buff_Def"
      },
      "negative": {
        "scale": 0.25,
        "table": "Melee_Buff_Def"
      }
    },
    "regenBuff": {
      "scale": 1,
      "table": "Melee_Ones"
    }
  }
};
