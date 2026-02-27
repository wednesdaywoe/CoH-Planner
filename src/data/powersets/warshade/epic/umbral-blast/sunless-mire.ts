/**
 * Sunless Mire
 * PBAoE, Light DMG(Negative), Foe -Recharge, -SPD; Self +DMG, +To Hit
 *
 * Source: warshade_offensive/umbral_blast/sunless_mire.json
 */

import type { Power } from '@/types';

export const SunlessMire: Power = {
  "name": "Sunless Mire",
  "available": 9,
  "description": "Sunless Mire can drain the essence of all nearby foes, thus increasing your own strength. Each affected foe will lose some Hit Points and add to your Damage and chance to hit.  Damage: Light. Recharge: Long.",
  "shortHelp": "PBAoE, Light DMG(Negative), Foe -Recharge, -SPD; Self +DMG, +To Hit",
  "icon": "umbralblast_sunlessmire.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "ToHit",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Kheldian Archetype Sets",
    "Melee AoE Damage",
    "Slow Movement",
    "To Hit Buff",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1.2,
    "recharge": 120,
    "endurance": 15.6,
    "castTime": 2.37,
    "radius": 15,
    "maxTargets": 10
  },
  "targetType": "Self",
  "damage": {
    "type": "Negative",
    "scale": 1,
    "table": "Melee_Damage"
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
