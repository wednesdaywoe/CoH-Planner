/**
 * Shinobi-Iri
 * Toggle: Self Stealth, +DEF(Melee, Ranged, AoE), +Special
 *
 * Source: sentinel_defense/ninjitsu/shinobi-iri.json
 */

import type { Power } from '@/types';

export const ShinobiIri: Power = {
  "name": "Shinobi-Iri",
  "internalName": "Shinobi-Iri",
  "available": 3,
  "description": "Shinobi Iri are the ninjitsu techniques of silent movement and avoidance, granting you stealth and defense against all positional attacks. While stealthed, the strength of your next attack will be more powerful; however, you can only attempt this after spending 8 seconds without attacking.Recharge: Very Fast.",
  "shortHelp": "Toggle: Self Stealth, +DEF(Melee, Ranged, AoE), +Special",
  "icon": "ninjitsu_hide.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 2,
    "endurance": 0.13
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Defense Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseBuff": {
      "ranged": {
        "scale": 0.45,
        "table": "Melee_Buff_Def"
      },
      "melee": {
        "scale": 0.45,
        "table": "Melee_Buff_Def"
      },
      "aoe": {
        "scale": 0.45,
        "table": "Melee_Buff_Def"
      }
    },
    "damageBuff": {
      "scale": 4,
      "table": "Melee_Buff_Dmg"
    },
    "stealth": {
      "stealthPvE": {
        "scale": 35.5,
        "table": "Melee_Ones"
      },
      "stealthPvP": {
        "scale": 390,
        "table": "Melee_Ones"
      },
      "translucency": {
        "scale": 0.3,
        "table": "Melee_Ones"
      }
    }
  }
};
