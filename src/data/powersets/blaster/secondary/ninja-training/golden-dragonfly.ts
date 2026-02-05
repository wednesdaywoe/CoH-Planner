/**
 * Golden Dragonfly
 * Melee, Extreme DMG(Lethal), Foe Knockback, -DEF
 *
 * Source: blaster_support/ninja_training/golden_dragonfly.json
 */

import type { Power } from '@/types';

export const GoldenDragonfly: Power = {
  "name": "Golden Dragonfly",
  "internalName": "Golden_Dragonfly",
  "available": 29,
  "description": "You perform a devastating Golden Dragonfly attack that deals a massive amount of damage and can even knock a foe down to the ground and reduce their Defense. The power of this attack can actually extend a short distance through multiple foes.Damage: Extreme.Recharge: Slow.",
  "shortHelp": "Melee, Extreme DMG(Lethal), Foe Knockback, -DEF",
  "icon": "ninjatools_goldendragonfly.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.05,
    "range": 10,
    "radius": 10,
    "arc": 0.3491,
    "recharge": 20,
    "endurance": 11.856,
    "castTime": 1.83,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Blaster Archetype Sets",
    "Defense Debuff",
    "Knockback",
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 3.56,
    "table": "Melee_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    },
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
