/**
 * Energize
 * Self Endurance Discount, Heal, +Regen
 *
 * Source: sentinel_defense/energy_aura/energize.json
 */

import type { Power } from '@/types';

export const Energize: Power = {
  "name": "Energize",
  "internalName": "Energize",
  "available": 9,
  "description": "You can channel a tremendous amount of energy through your body for a short period of time. Doing so will heal some hit points, reduce the endurance cost of your powers and boost your regeneration for a short time.",
  "shortHelp": "Self Endurance Discount, Heal, +Regen",
  "icon": "energyaura_energize.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 90,
    "endurance": 10.4,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Heal",
    "scale": 2.5,
    "table": "Melee_HealSelf"
  },
  "effects": {
    "enduranceDiscount": {
      "scale": 0.5,
      "table": "Melee_Stun"
    },
    "regenBuff": {
      "scale": 1,
      "table": "Melee_Ones"
    }
  }
};
