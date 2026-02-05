/**
 * Energize
 * Self Endurance Discount, Heal, +Regen, Res(Stun)
 *
 * Source: blaster_support/energy_manipulation/conserve_power.json
 */

import type { Power } from '@/types';

export const Energize: Power = {
  "name": "Energize",
  "internalName": "Conserve_Power",
  "available": 15,
  "description": "You can channel a tremendous amount of energy through your body for a short period of time. Doing so will heal some hit points, reduce the endurance cost of your powers, boost your regeneration dramatically, and make you resistant to Stuns for a short time.Recharge: Long.",
  "shortHelp": "Self Endurance Discount, Heal, +Regen, Res(Stun)",
  "icon": "energymanipulation_conservepower.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 120,
    "endurance": 5.2,
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
    "scale": 1,
    "table": "Melee_HealSelf"
  },
  "effects": {
    "enduranceDiscount": {
      "scale": 1,
      "table": "Melee_Stun"
    },
    "regenBuff": {
      "scale": 1.125,
      "table": "Melee_Ones"
    },
    "stun": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "effectDuration": 60
  }
};
