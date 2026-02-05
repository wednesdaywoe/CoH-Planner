/**
 * Heart of Darkness
 * PBAoE, Foe Disorient, -To Hit, Minor DoT(Negative)
 *
 * Source: dominator_control/darkness_control/heart_of_darkness.json
 */

import type { Power } from '@/types';

export const HeartofDarkness: Power = {
  "name": "Heart of Darkness",
  "internalName": "Heart_of_Darkness",
  "available": 11,
  "description": "In a burst of negative energy you overwhelm the minds of those around you causing them to be disoriented and suffer minor negative energy damage over a short time. Affected targets will also have their chance to hit reduced.Damage: Minor.Recharge: Long.",
  "shortHelp": "PBAoE, Foe Disorient, -To Hit, Minor DoT(Negative)",
  "icon": "darknesscontrol_heartofdarkness.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.8,
    "radius": 25,
    "recharge": 90,
    "endurance": 15.6,
    "castTime": 1.67,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Dominator Archetype Sets",
    "Melee AoE Damage",
    "Stuns",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Negative",
    "scale": 0.07,
    "table": "Ranged_Damage",
    "duration": 4.1,
    "tickRate": 1
  },
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 10,
      "table": "Ranged_Stun"
    },
    "tohitDebuff": {
      "scale": 0.75,
      "table": "Ranged_Debuff_ToHit"
    }
  }
};
