/**
 * Healing Flames
 * Self Heal, +Res(Toxic)
 *
 * Source: sentinel_defense/fiery_aura/healing_flames.json
 */

import type { Power } from '@/types';

export const HealingFlames: Power = {
  "name": "Healing Flames",
  "internalName": "Healing_Flames",
  "available": 3,
  "description": "You can concentrate for a few moments to heal yourself. The power of the flames can also protect you from Toxic Damage for a while.Recharge: Slow.",
  "shortHelp": "Self Heal, +Res(Toxic)",
  "icon": "flamingshield_healingflames.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 40,
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
  "damage": {
    "type": "Heal",
    "scale": 2.5,
    "table": "Melee_HealSelf"
  },
  "effects": {
    "resistance": {
      "toxic": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      }
    }
  }
};
