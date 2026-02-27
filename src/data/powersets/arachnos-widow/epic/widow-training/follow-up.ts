/**
 * Follow Up
 * Melee, DMG(Lethal), Self +DMG
 *
 * Source: widow_training/widow_training/follow_up.json
 */

import type { Power } from '@/types';

export const FollowUp: Power = {
  "name": "Follow Up",
  "available": 7,
  "description": "You perform a feint attack that deals moderate damage. After this attack hits, it gives you a large bonus to your chance to hit and damage for a brief time.  Notes: This power will deal critical damage if used after a successful Placate or while the user is hidden with the Night Widow or Fortunata Mask Presence power, additionally if you select this power, you may not also select Build Up.",
  "shortHelp": "Melee, DMG(Lethal), Self +DMG",
  "icon": "widowtraining_followup.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "ToHit",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee Damage",
    "Soldiers of Arachnos Archetype Sets",
    "To Hit Buff",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 12,
    "endurance": 7.8,
    "castTime": 0.83
  },
  "targetType": "Foe (Alive)",
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.912,
      "table": "Melee_Damage"
    },
    {
      "type": "Lethal",
      "scale": 0.608,
      "table": "Melee_InherentDamage"
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
