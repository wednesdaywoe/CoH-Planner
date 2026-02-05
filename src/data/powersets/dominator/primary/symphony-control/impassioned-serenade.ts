/**
 * Impassioned Serenade
 * Ranged, DoT(Psionic), Foe Confuse
 *
 * Source: dominator_control/symphony_control/impassioned_serenade.json
 */

import type { Power } from '@/types';

export const ImpassionedSerenade: Power = {
  "name": "Impassioned Serenade",
  "internalName": "Impassioned_Serenade",
  "available": 5,
  "description": "You serenade your target with an impassioned song, charming them into fighting for you.Note: this power inflicts damage over time for up to 30 seconds as long as the target is confused.",
  "shortHelp": "Ranged, DoT(Psionic), Foe Confuse",
  "icon": "symphonycontrol_confusest.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 80,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 2
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Confuse",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Confuse",
    "Dominator Archetype Sets",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Psionic",
      "scale": 0.65,
      "table": "Ranged_Damage"
    },
    {
      "type": "Psionic",
      "scale": 0.04,
      "table": "Ranged_Damage",
      "duration": 30,
      "tickRate": 1
    }
  ]
};
