/**
 * Soul Drain
 * PBAoE Light DMG(Negative), Self +DMG, +To Hit
 *
 * Source: scrapper_melee/dark_melee/soul_drain.json
 */

import type { Power } from '@/types';

export const SoulDrain: Power = {
  "name": "Soul Drain",
  "internalName": "Soul_Drain",
  "available": 21,
  "description": "Using this power, you can drain the essence of all nearby foes' souls, thus increasing your own strength. Each affected foe will lose some Hit Points and add to your Damage and chance to hit.",
  "shortHelp": "PBAoE Light DMG(Negative), Self +DMG, +To Hit",
  "icon": "shadowfighting_stealpower.png",
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
    "ToHit",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee AoE Damage",
    "Scrapper Archetype Sets",
    "To Hit Buff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Negative",
      "scale": 1,
      "table": "Melee_Damage"
    },
    {
      "type": "Negative",
      "scale": 1,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Negative",
      "scale": 1,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Fire",
      "scale": 0.45,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "tohitBuff": {
      "scale": 1,
      "table": "Melee_Buff_ToHit"
    },
    "damageBuff": {
      "scale": 4,
      "table": "Melee_Buff_Dmg"
    }
  }
};
