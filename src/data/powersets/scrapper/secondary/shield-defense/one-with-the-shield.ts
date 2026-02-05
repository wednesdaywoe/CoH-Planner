/**
 * One with the Shield
 * Self, +Res(Disorient, Sleep, Hold, Immobilize, Repel, Knockback, All DMG but Psi), +Recovery, +Max HP
 *
 * Source: scrapper_defense/shield_defense/one_with_the_shield.json
 */

import type { Power } from '@/types';

export const OnewiththeShield: Power = {
  "name": "One with the Shield",
  "internalName": "One_with_the_Shield",
  "available": 29,
  "description": "When you activate this power, you gain strong resistance against most types of damage and also to Disorient, Immobilization, Hold, Knockback, Repel and Sleep effects. One with the Shield costs little Endurance to activate and increases your recovery and maximum hit points for its duration, but when it wears off you are left exhausted, and substantially drained of Endurance.Notes: One with the Shield is unaffected by Recharge Time changes.Recharge: Very Long.",
  "shortHelp": "Self, +Res(Disorient, Sleep, Hold, Immobilize, Repel, Knockback, All DMG but Psi), +Recovery, +Max HP",
  "icon": "shielddefense_onewiththeshield.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 360,
    "endurance": 2.6,
    "castTime": 2.5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Healing"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Healing",
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "resistance": {
      "smashing": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      },
      "fire": {
        "scale": 1.5,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 1.5,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 1.5,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 1.5,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 1.5,
        "table": "Melee_Res_Dmg"
      }
    },
    "maxHPBuff": {
      "scale": 2,
      "table": "Melee_HealSelf"
    },
    "knockup": {
      "scale": 10,
      "table": "Melee_Ones"
    },
    "knockback": {
      "scale": 10,
      "table": "Melee_Ones"
    },
    "repel": {
      "scale": 10,
      "table": "Melee_Ones"
    },
    "recoveryBuff": {
      "scale": 0.3,
      "table": "Melee_Ones"
    },
    "enduranceDrain": {
      "scale": 0.6,
      "table": "Melee_Ones"
    },
    "hold": {
      "mag": 1,
      "scale": 50,
      "table": "Melee_Res_Boolean"
    },
    "effectDuration": 120,
    "immobilize": {
      "mag": 1,
      "scale": 50,
      "table": "Melee_Res_Boolean"
    },
    "stun": {
      "mag": 1,
      "scale": 50,
      "table": "Melee_Res_Boolean"
    },
    "sleep": {
      "mag": 1,
      "scale": 50,
      "table": "Melee_Res_Boolean"
    }
  }
};
