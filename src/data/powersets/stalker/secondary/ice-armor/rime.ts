/**
 * Rime
 * Self +Regen, +Absorb, Res(Toxic)
 *
 * Source: stalker_defense/ice_armor/rime_ice.json
 */

import type { Power } from '@/types';

export const Rime: Power = {
  "name": "Rime",
  "internalName": "Rime_Ice",
  "available": 3,
  "description": "Activating this power covers you in a thick layer of rime. The rime can absorb the impact of a limited number of enemy attacks, the lingering moisture increasing your regeneration rate. Rime also grants you resistance to Toxic Damage.This power is mutually exclusive from Hoarfrost",
  "shortHelp": "Self +Regen, +Absorb, Res(Toxic)",
  "icon": "icearmor_rime.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 90,
    "endurance": 10.4,
    "castTime": 0.73
  },
  "allowedEnhancements": [
    "Resistance",
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing",
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "resistance": {
      "toxic": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      }
    },
    "absorb": {
      "scale": 3,
      "table": "Melee_HealSelf"
    },
    "regenBuff": {
      "scale": 1,
      "table": "Melee_Ones"
    }
  },
  "requires": "!Stalker_Defense.Ice_Armor.Hoarfrost"
};
