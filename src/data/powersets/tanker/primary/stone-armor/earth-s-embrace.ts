/**
 * Earth's Embrace
 * Self +HP, Res(Toxic)
 *
 * Source: tanker_defense/stone_armor/earths_embrace.json
 */

import type { Power } from '@/types';

export const EarthsEmbrace: Power = {
  "name": "Earth's Embrace",
  "internalName": "Earths_Embrace",
  "available": 1,
  "description": "You are so connected to the Earth, you can draw upon its power to add to your health. Activating this power increases your maximum Hit Points, and grants you resistance to Toxic Damage.Recharge: Long.",
  "shortHelp": "Self +HP, Res(Toxic)",
  "icon": "stonearmor_earthsembrace.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 120,
    "endurance": 10.4,
    "castTime": 1
  },
  "allowedEnhancements": [
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
    "scale": 1.35,
    "table": "Melee_HealSelf"
  },
  "effects": {
    "maxHPBuff": {
      "scale": 2,
      "table": "Melee_HealSelf"
    },
    "resistance": {
      "toxic": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      }
    }
  }
};
