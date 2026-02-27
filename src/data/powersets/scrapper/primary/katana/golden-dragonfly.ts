/**
 * Golden Dragonfly
 * Melee, DMG(Lethal), Foe Knockback, -DEF
 *
 * Source: scrapper_melee/katana/head_splitter.json
 */

import type { Power } from '@/types';

export const GoldenDragonfly: Power = {
  "name": "Golden Dragonfly",
  "internalName": "Head_Splitter",
  "available": 25,
  "description": "You perform a devastating Golden Dragonfly attack that deals a massive amount of damage and can even knock a foe down to the ground and reduce their Defense. This attack has an exceptionally good critical hit capability, better than other Katana attacks, that can sometimes deal double damage. The power of this attack can actually extend a short distance through multiple foes.",
  "shortHelp": "Melee, DMG(Lethal), Foe Knockback, -DEF",
  "icon": "katana_headsplitter.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.05,
    "range": 10,
    "radius": 10,
    "arc": 0.3491,
    "recharge": 12,
    "endurance": 11.856,
    "castTime": 1.83,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Knockback",
    "Melee AoE Damage",
    "Scrapper Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 2.28,
      "table": "Melee_Damage"
    },
    {
      "type": "Lethal",
      "scale": 2.28,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Fire",
      "scale": 1.026,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    },
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
