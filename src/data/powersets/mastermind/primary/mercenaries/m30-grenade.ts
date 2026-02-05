/**
 * M30 Grenade
 * Ranged (Targeted AoE), DMG(Lethal/Fire), Knockback
 *
 * Source: mastermind_summon/mercenaries/m30_grenade.json
 */

import type { Power } from '@/types';

export const M30Grenade: Power = {
  "name": "M30 Grenade",
  "internalName": "M30_Grenade",
  "available": 7,
  "description": "Launches a Grenade at long range from beneath the barrel of your Assault Rifle. This explosion affects all within the blast radius, and can knock them back.Focus Fire:The main target struck by this attack will take 3.33% increased damage from any Mercenary Henchmen regardless of their owners for 30 seconds. This does effect does not stack from the same power or from multiple Masterminds.",
  "shortHelp": "Ranged (Targeted AoE), DMG(Lethal/Fire), Knockback",
  "icon": "paramilitary_assaultriflegrenade.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.05,
    "range": 80,
    "radius": 15,
    "recharge": 16,
    "endurance": 18.98,
    "castTime": 1.67,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Fire",
      "scale": 0.602,
      "table": "Ranged_Damage"
    },
    {
      "type": "Lethal",
      "scale": 0.2965,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 2,
      "table": "Ranged_Knockback"
    }
  }
};
