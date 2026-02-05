/**
 * Axe Cyclone
 * PBAoE Melee, DMG(Lethal), Foe Knockdown
 *
 * Source: tanker_melee/battle_axe/whirling_axe.json
 */

import type { Power } from '@/types';

export const AxeCyclone: Power = {
  "name": "Axe Cyclone",
  "internalName": "Whirling_Axe",
  "available": 27,
  "description": "You spin your Battle Axe in a huge circle, attacking all nearby foes. This attack deals moderate damage to any foe it hits, draws them into melee range and can knock them down.Notes: Thanks to gauntlet, this power can hit up to 6 targets above its cap at 1/3rd effectiveness.",
  "shortHelp": "PBAoE Melee, DMG(Lethal), Foe Knockdown",
  "icon": "battleaxe_whirlingaxe.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.05,
    "radius": 15,
    "recharge": 18,
    "endurance": 16.848,
    "castTime": 2.1,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee AoE Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "repel": {
      "scale": 2,
      "table": "Ones"
    }
  }
};
