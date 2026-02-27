/**
 * Glittering Column
 * Summon Glittering Column: Taunt, -ToHit, AoE DMG (Fire, Energy), Blast Off
 *
 * Source: dominator_control/pyrotechnic_control/glittering_column.json
 */

import type { Power } from '@/types';

export const GlitteringColumn: Power = {
  "name": "Glittering Column",
  "internalName": "Glittering_Column",
  "available": 5,
  "description": "You summon a column of brilliant, glittering energy that is sure to capture foes' attention. The column will reduce the ToHit of any foe within a short range, while also Taunting them, forcing them to direct their attacks in its direction. When the Glittering Column expires, it explodes, Blasting Off nearby enemies into the air.",
  "shortHelp": "Summon Glittering Column: Taunt, -ToHit, AoE DMG (Fire, Energy), Blast Off",
  "icon": "pyrotechnic_glitteringcolumn.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 40,
    "endurance": 7.8,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Ranged AoE Damage",
    "Threat Duration",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": true,
      "displayName": "Glittering Column",
      "powers": [
        "Redirects.Pyrotechnic_Control.GlitteringColumn_Skin",
        "Redirects.Pyrotechnic_Control.GlitteringColumn_Aura",
        "Redirects.Pyrotechnic_Control.GlitteringColumn_SelfDestruct"
      ],
      "duration": 7
    }
  }
};
