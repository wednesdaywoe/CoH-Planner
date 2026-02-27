/**
 * Black Dwarf Smite
 * Melee, Light DMG(Negative/Smash), Foe -Recharge, -SPD, -Fly, Disorient
 *
 * Source: warshade_defensive/umbral_aura/black_dwarf_smite.json
 */

import type { Power } from '@/types';

export const BlackDwarfSmite: Power = {
  "name": "Black Dwarf Smite",
  "available": 19,
  "description": "Black Dwarf Smite is powerful melee attack that can often Disorient or Knock Down opponents. Black Dwarf Smite can also bring down fliers, and slows a targets attack and movement speed. This power is only available while in Black Dwarf Form.  Damage: Light. Recharge: Fast.",
  "shortHelp": "Melee, Light DMG(Negative/Smash), Foe -Recharge, -SPD, -Fly, Disorient",
  "icon": "umbralaura_blackdwarfsmite.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Kheldian Archetype Sets",
    "Knockback",
    "Melee Damage",
    "Slow Movement",
    "Stuns",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1.2,
    "range": 7,
    "recharge": 6,
    "endurance": 6.864,
    "castTime": 1.5
  },
  "targetType": "Foe (Alive)",
  "requires": "Black Dwarf",
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.32,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Negative",
      "scale": 1,
      "table": "Melee_InherentDamage"
    }
  ],
  "effects": {
    "stun": {
      "mag": 2,
      "scale": 6,
      "table": "Melee_Immobilize"
    },
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    },
    "slow": {
      "fly": {
        "scale": 1.6,
        "table": "Melee_Ones"
      }
    },
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
    }
  }
};
