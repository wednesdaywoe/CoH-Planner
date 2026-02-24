/**
 * Ailment Resistance
 * Auto: Self +Max HP, -Res(Heal), Res(-Defense, -Endurance, -Speed, -Regeneration, -Recovery, -Recharge, -Range, -ToHit)
 *
 * Source: brute_defense/regeneration/revive.json
 */

import type { Power } from '@/types';

export const AilmentResistance: Power = {
  "name": "Ailment Resistance",
  "internalName": "Revive",
  "available": 9,
  "description": "Your superior immune system makes you resilient to disease and multiple ailments. Healing techniques also become more effective. This power is always on.",
  "shortHelp": "Auto: Self +Max HP, -Res(Heal), Res(-Defense, -Endurance, -Speed, -Regeneration, -Recovery, -Recharge, -Range, -ToHit)",
  "icon": "regeneration_resiststun.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 360
  },
  "allowedEnhancements": [
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "maxHPBuff": {
      "scale": 1.2,
      "table": "Melee_HealSelf"
    },
    "resistanceDebuff": {
      "heal": {
        "scale": 0.15,
        "table": "Melee_Ones"
      }
    },
    "debuffResistance": {
      "defense": 0.2,
      "endurance": 0.2,
      "tohit": 0.2,
      "movement": 0.2,
      "regeneration": 0.2,
      "recovery": 0.2,
      "recharge": 0.2
    },
    "elusivity": {
      "all": {
        "scale": 0.2,
        "table": "Melee_Ones"
      }
    },
    "enduranceGain": {
      "scale": 0.2,
      "table": "Melee_Ones"
    },
    "tohitBuff": {
      "scale": 0.2,
      "table": "Melee_Ones"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.2,
        "table": "Melee_Ones"
      },
      "flySpeed": {
        "scale": 0.2,
        "table": "Melee_Ones"
      },
      "jumpSpeed": {
        "scale": 0.2,
        "table": "Melee_Ones"
      }
    },
    "regenBuff": {
      "scale": 0.2,
      "table": "Melee_Ones"
    },
    "recoveryBuff": {
      "scale": 0.2,
      "table": "Melee_Ones"
    },
    "rangeBuff": {
      "scale": 0.2,
      "table": "Melee_Ones"
    },
    "rechargeBuff": {
      "scale": 0.2,
      "table": "Melee_Ones"
    }
  }
};
