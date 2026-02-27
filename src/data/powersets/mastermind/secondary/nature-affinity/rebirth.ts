/**
 * Rebirth
 * Ranged, Ally Rez, +Heal Over Time, Special, +3 Bloom
 *
 * Source: mastermind_buff/nature_affinity/rebirth.json
 */

import type { Power } from '@/types';

export const Rebirth: Power = {
  "name": "Rebirth",
  "internalName": "Rebirth",
  "available": 23,
  "description": "Rebirth can either greatly heal a conscious ally for a large amount of health over time or it can revive a fallen ally with a large amount of health and endurance and cause them to recover health over time. This power also grants 3 stacks of Bloom.Recharge: Long.",
  "shortHelp": "Ranged, Ally Rez, +Heal Over Time, Special, +3 Bloom",
  "icon": "natureaffinity_rebirth.png",
  "powerType": "Click",
  "targetType": "Teammate",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 45,
    "recharge": 180,
    "endurance": 16.25,
    "castTime": 3
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Healing"
  ],
  "maxSlots": 6
};
