/**
 * Soul Drain
 * PBAoE Light DMG(Negative), Self +DMG, +To Hit
 *
 * Source: blaster_support/darkness_manipulation/soul_drain.json
 */

import type { Power } from '@/types';

export const SoulDrain: Power = {
  "name": "Soul Drain",
  "internalName": "Soul_Drain",
  "available": 15,
  "description": "Using this power, you can drain the essence of all nearby foes' souls, thus increasing your own strength. Each affected foe will lose some Hit Points and add to your Damage and chance to hit.",
  "shortHelp": "PBAoE Light DMG(Negative), Self +DMG, +To Hit",
  "icon": "darknessmanipulation_souldrain.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.2,
    "radius": 10,
    "recharge": 120,
    "endurance": 15.6,
    "castTime": 2.37,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Melee AoE Damage",
    "To Hit Buff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Negative",
    "scale": 1,
    "table": "Melee_Damage"
  },
  "effects": {
    "tohitBuff": {
      "scale": 1,
      "table": "Melee_Buff_ToHit"
    },
    "damageBuff": {
      "scale": 0.063,
      "table": "Melee_Ones"
    }
  }
};
