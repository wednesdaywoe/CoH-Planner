/**
 * Siphon Life
 * Melee, DMG(Negative), Foe -To Hit, Self +HP
 *
 * Source: tanker_melee/dark_melee/siphon_life.json
 */

import type { Power } from '@/types';

export const SiphonLife: Power = {
  "name": "Siphon Life",
  "internalName": "Siphon_Life",
  "available": 15,
  "description": "You tap the power of the Netherworld and create a life transferring conduit between a foe and yourself. This will transfer Hit Points from your enemy to yourself. Foes Siphoned in this manner have their chance to hit reduced.",
  "shortHelp": "Melee, DMG(Negative), Foe -To Hit, Self +HP",
  "icon": "shadowfighting_siphonlife.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1.93
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Healing",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Healing",
    "Accurate To-Hit Debuff",
    "Healing",
    "Melee Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Negative",
      "scale": 1.96,
      "table": "Melee_Damage"
    },
    {
      "type": "Heal",
      "scale": 1,
      "table": "Melee_HealSelf"
    },
    {
      "type": "Fire",
      "scale": 0.882,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "tohitDebuff": {
      "scale": 0.75,
      "table": "Melee_DeBuff_ToHit"
    }
  }
};
