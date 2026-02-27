/**
 * Whirling Mace
 * PBAoE Melee, Light DMG(Smash), Minor Disorient
 *
 * Source: tanker_melee/war_mace/whirling_mace.json
 */

import type { Power } from '@/types';

export const WhirlingMace: Power = {
  "name": "Whirling Mace",
  "internalName": "Whirling_Mace",
  "available": 19,
  "description": "You swing your mace in a circle all around you, attacking everyone in melee range. Your Whirling Mace deals moderate damage, and has a chance to Disorient every foe you hit.Notes: Thanks to gauntlet, this power can hit up to 6 targets above its cap at 1/3rd effectiveness.",
  "shortHelp": "PBAoE Melee, Light DMG(Smash), Minor Disorient",
  "icon": "mace_whirlingmace.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.05,
    "radius": 12,
    "recharge": 14,
    "endurance": 13,
    "castTime": 2.67,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee AoE Damage",
    "Stuns",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1.12,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.504,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "stun": {
      "mag": 2,
      "scale": 5,
      "table": "Melee_Stun"
    }
  }
};
