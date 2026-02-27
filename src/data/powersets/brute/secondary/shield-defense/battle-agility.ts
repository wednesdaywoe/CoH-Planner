/**
 * Battle Agility
 * Toggle: Self +DEF(Ranged, AoE), +Res(Defense Debuff)
 *
 * Source: brute_defense/shield_defense/deflection.json
 */

import type { Power } from '@/types';

export const BattleAgility: Power = {
  "name": "Battle Agility",
  "internalName": "Deflection",
  "available": 0,
  "description": "Your incredible agility allows you to position your shield to protect yourself from incoming ranged damage. While Battle Agility is active you will benefit from increased Ranged and AoE defense as well as some moderate protection from Defense Debuffs. Battle Agility also adds an Elusivity defense bonus to Ranged and AOE Attacks in PVP zones.Recharge: Fast.",
  "shortHelp": "Toggle: Self +DEF(Ranged, AoE), +Res(Defense Debuff)",
  "icon": "shielddefense_deflection.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 4,
    "endurance": 0.104,
    "castTime": 1.5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseBuff": {
      "ranged": {
        "scale": 1.5,
        "table": "Melee_Buff_Def"
      },
      "aoe": {
        "scale": 1.5,
        "table": "Melee_Buff_Def"
      }
    },
    "elusivity": {
      "all": {
        "scale": 0.4,
        "table": "Melee_Res_Boolean"
      }
    }
  },
  "requires": "!(Brute_Melee.Claws || Brute_Melee.Dual_Blades || Brute_Melee.Katana || Brute_Melee.Spines || Brute_Melee.Staff_Fighting || Brute_Melee.Titan_Weapons)"
};
