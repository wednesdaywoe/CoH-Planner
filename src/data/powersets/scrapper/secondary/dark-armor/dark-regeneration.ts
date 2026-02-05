/**
 * Dark Regeneration
 * PBAoE DMG(Negative), Self +HP
 *
 * Source: scrapper_defense/dark_armor/dark_regeneration.json
 */

import type { Power } from '@/types';

export const DarkRegeneration: Power = {
  "name": "Dark Regeneration",
  "internalName": "Dark_Regeneration",
  "available": 15,
  "description": "You can tap the dark essence of the Netherworld to drain a small amount of life from all enemies nearby, thus healing yourself. The more foes affected, the more you will be healed.This power is mutually exclusive from Obscure Sustenance.",
  "shortHelp": "PBAoE DMG(Negative), Self +HP",
  "icon": "darkarmor_darkregeneration.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 20,
    "recharge": 30,
    "endurance": 33.8,
    "castTime": 1.17,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Healing",
    "Healing",
    "Melee AoE Damage",
    "Scrapper Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Negative",
      "scale": 0.2,
      "table": "Melee_Damage"
    },
    {
      "type": "Heal",
      "scale": 3,
      "table": "Melee_HealSelf"
    }
  ],
  "requires": "!Scrapper_Defense.Dark_Armor.Obscure_Sustenance"
};
