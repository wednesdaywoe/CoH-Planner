/**
 * Hoarfrost
 * Self Heal, +Max HP, Res(Toxic)
 *
 * Source: brute_defense/ice_armor/hoarfrost.json
 */

import type { Power } from '@/types';

export const Hoarfrost: Power = {
  "name": "Hoarfrost",
  "internalName": "Hoarfrost",
  "available": 0,
  "description": "Activating this power covers you in a thick layer of Hoarfrost. The frost can absorb the impact from enemy attacks, effectively increasing your maximum Hit Points for a short time. Hoarfrost also grants you resistance to Toxic Damage.This power is mutually exclusive from Rime",
  "shortHelp": "Self Heal, +Max HP, Res(Toxic)",
  "icon": "icearmor_hp.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 360,
    "endurance": 14.56,
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
  "damage": {
    "type": "Heal",
    "scale": 4,
    "table": "Melee_HealSelf"
  },
  "effects": {
    "resistance": {
      "toxic": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      }
    },
    "maxHPBuff": {
      "scale": 2,
      "table": "Melee_HealSelf"
    }
  },
  "requires": "!Brute_Defense.Ice_Armor.Rime_Ice"
};
