/**
 * Follow Up
 * Melee, DMG(Lethal), Self +DMG
 *
 * Source: arachnos-widow/widow-training
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
  "targetType": "Foe (Alive)"
};
