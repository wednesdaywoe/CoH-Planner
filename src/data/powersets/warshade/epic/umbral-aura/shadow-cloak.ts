/**
 * Shadow Cloak
 * Toggle: Self Stealth, +DEF, +Perception, Res (Immobilize)
 *
 * Source: warshade_defensive/umbral_aura/shadow_cloak.json
 */

import type { Power } from '@/types';

export const ShadowCloak: Power = {
  "name": "Shadow Cloak",
  "available": 13,
  "description": "You surround yourself with shadowy particles that bend the light around you, making you difficult to spot at a distance. You can be seen only at close range, or if you attack a target. Even if seen, the Shadow Cloak grants you a bonus to Defense and some protection from Immobilization. Shadow Cloak also allows you to see things in a new light, allowing you to better see stealthy foes.",
  "shortHelp": "Toggle: Self Stealth, +DEF, +Perception, Res (Immobilize)",
  "icon": "umbralaura_shadowcloak.png",
  "powerType": "Toggle",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 2,
    "endurance": 0.13,
    "castTime": 1.17
  },
  "targetType": "Self",
  "effects": {
    "defenseBuff": {
      "ranged": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "melee": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "aoe": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "smashing": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "fire": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "cold": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "energy": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "negative": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "psionic": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "toxic": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      }
    },
    "perceptionBuff": {
      "scale": 0.6,
      "table": "Melee_Ones"
    },
    "immobilize": {
      "mag": 1,
      "scale": 10,
      "table": "Melee_Res_Boolean"
    },
    "stealth": {
      "translucency": {
        "scale": 0,
        "table": "Melee_Ones"
      },
      "stealthPvP": {
        "scale": 390,
        "table": "Melee_Ones"
      },
      "stealthPvE": {
        "scale": 35.5,
        "table": "Melee_Ones"
      }
    },
    "effectDuration": 0.75
  }
};
