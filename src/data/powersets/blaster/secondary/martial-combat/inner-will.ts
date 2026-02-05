/**
 * Inner Will
 * Self Heal, Special
 *
 * Source: blaster_support/martial_manipulation/inner_will.json
 */

import type { Power } from '@/types';

export const InnerWill: Power = {
  "name": "Inner Will",
  "internalName": "Inner_Will",
  "available": 23,
  "description": "When pushed to your limit, you can tap into an inner reserve of power, allowing you to overcome impossible odds. When you are below half health, below half endurance, or the victim of any status effect, you may activate Inner Will. Inner Will cancels any status effects currently affecting you, increases your resistance to status effects by 100%, and increases the power of your own status effect-inducing powers. Inner Will also heals you for a moderate amount when activated.Recharge: Long.",
  "shortHelp": "Self Heal, Special",
  "icon": "martialmanipulation_innerwill.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 180,
    "castTime": 1.03
  },
  "allowedEnhancements": [
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Heal",
      "scale": 0.075,
      "table": "Melee_Ones"
    },
    {
      "type": "Heal",
      "scale": 0.075,
      "table": "Melee_Ones"
    }
  ],
  "effects": {
    "stun": {
      "mag": 1,
      "scale": 1,
      "table": "Melee_Ones"
    },
    "effectDuration": 30,
    "sleep": {
      "mag": 1,
      "scale": 1,
      "table": "Melee_Ones"
    },
    "immobilize": {
      "mag": 1,
      "scale": 1,
      "table": "Melee_Ones"
    },
    "hold": {
      "mag": 1,
      "scale": 1,
      "table": "Melee_Ones"
    },
    "confuse": {
      "mag": 1,
      "scale": 1,
      "table": "Melee_Ones"
    },
    "fear": {
      "mag": 1,
      "scale": 1,
      "table": "Melee_Ones"
    }
  }
};
