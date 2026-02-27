/**
 * Black Dwarf Mire
 * PBAoE, Light DMG(Negative), Foe -Recharge, -SPD; Self +DMG, +ACC
 *
 * Source: warshade_defensive/umbral_aura/black_dwarf_mire.json
 */

import type { Power } from '@/types';

export const BlackDwarfMire: Power = {
  "name": "Black Dwarf Mire",
  "available": 19,
  "description": "Black Dwarf Mire can drain the essence of all nearby foes, thus increasing your own strength. Each affected foe will lose some Hit Points and add to your Damage and Accuracy.  Damage: Light. Recharge: Slow.",
  "shortHelp": "PBAoE, Light DMG(Negative), Foe -Recharge, -SPD; Self +DMG, +ACC",
  "icon": "umbralaura_blackdwarfmire.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Kheldian Archetype Sets",
    "Melee AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1.2,
    "recharge": 20,
    "endurance": 15.6,
    "castTime": 0.73,
    "radius": 15,
    "maxTargets": 10
  },
  "targetType": "Self",
  "requires": "Black Dwarf",
  "damage": {
    "type": "Negative",
    "scale": 1,
    "table": "Melee_InherentDamage"
  },
  "effects": {
    "movement": {
      "jumpHeight": {
        "scale": 0.2,
        "table": "Melee_Slow"
      },
      "runSpeed": {
        "scale": 0.2,
        "table": "Melee_Slow"
      },
      "flySpeed": {
        "scale": 0.2,
        "table": "Melee_Slow"
      },
      "jumpSpeed": {
        "scale": 0.2,
        "table": "Melee_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.2,
      "table": "Melee_Slow"
    },
    "tohitBuff": {
      "scale": 0.5,
      "table": "Melee_Buff_ToHit"
    },
    "damageBuff": {
      "scale": 1.25,
      "table": "Melee_Buff_Dmg"
    }
  }
};
