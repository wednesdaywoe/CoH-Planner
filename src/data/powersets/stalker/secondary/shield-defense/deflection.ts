/**
 * Deflection
 * Toggle: Self +DEF(Melee), +Res(Lethal, Smashing)
 *
 * Source: stalker_defense/shield_defense/active_defense.json
 */

import type { Power } from '@/types';

export const Deflection: Power = {
  "name": "Deflection",
  "internalName": "Active_Defense",
  "available": 0,
  "description": "Your mastery of the shield allows you to easily deflect melee attacks, and attacks that do get through your ironclad defenses tend to do less damage. While Deflection is active the user will gain defense to melee attacks and some minor resistance to lethal and smashing damage.Recharge: Fast.",
  "shortHelp": "Toggle: Self +DEF(Melee), +Res(Lethal, Smashing)",
  "icon": "shielddefense_activedefense.png",
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
    "Recharge"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseBuff": {
      "melee": {
        "scale": 1.5,
        "table": "Melee_Buff_Def"
      }
    },
    "resistance": {
      "smashing": {
        "scale": 1.5,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 1.5,
        "table": "Melee_Res_Dmg"
      }
    }
  },
  "requires": "!(Stalker_Melee.Claws || Stalker_Melee.Dual_Blades || Stalker_Melee.Ninja_Sword || Stalker_Melee.Spines || Stalker_Melee.Staff_Fighting)"
};
