/**
 * Black Dwarf Strike
 * Melee, Light DMG(Smash/Negative), Foe -Recharge, -SPD, Knockback
 *
 * Source: warshade_defensive/umbral_aura/black_dwarf_strike.json
 */

import type { Power } from '@/types';

export const BlackDwarfStrike: Power = {
  "name": "Black Dwarf Strike",
  "available": 19,
  "description": "The Black Dwarf Strike is a moderate melee attack that releases Nictus Dark Energy on impact, which can Knock Down foes, and slows a targets attack and movement speed. This power is only available while in Black Dwarf Form.  Damage: Light. Recharge: Very Fast.",
  "shortHelp": "Melee, Light DMG(Smash/Negative), Foe -Recharge, -SPD, Knockback",
  "icon": "umbralaura_blackdwarfstrike.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
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
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 3,
    "endurance": 4.368,
    "castTime": 1.2
  },
  "targetType": "Foe (Alive)",
  "requires": "Black Dwarf",
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.34,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Negative",
      "scale": 0.5,
      "table": "Melee_InherentDamage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
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
