/**
 * Follow Up
 * Melee, DMG(Lethal), Self +DMG +To-hit
 *
 * Source: tanker_melee/claws/follow_up.json
 */

import type { Power } from '@/types';

export const FollowUp: Power = {
  "name": "Follow Up",
  "internalName": "Follow_Up",
  "available": 19,
  "description": "You perform a feint attack that deals moderate damage. After this attack hits, it gives you a large bonus Damage and chance to hit for a brief time.",
  "shortHelp": "Melee, DMG(Lethal), Self +DMG +To-hit",
  "icon": "claws_feint.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 12,
    "endurance": 7.8,
    "castTime": 0.83
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "To Hit Buff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.8,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.36,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "tohitBuff": {
      "scale": 1,
      "table": "Melee_Buff_ToHit"
    },
    "damageBuff": {
      "scale": 3,
      "table": "Melee_Buff_Dmg"
    }
  }
};
