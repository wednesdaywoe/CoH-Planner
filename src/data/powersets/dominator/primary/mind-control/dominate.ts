/**
 * Dominate
 * Ranged, Light DMG(Psionic), Foe Hold
 *
 * Source: dominator_control/mind_control/dominate.json
 */

import type { Power } from '@/types';

export const Dominate: Power = {
  "name": "Dominate",
  "internalName": "Dominate",
  "available": 1,
  "description": "Painfully tears at the mind of a single foe. Dominate deals Psionic damage and renders a foe helpless, lost in their own mind and unable to defend themself.",
  "shortHelp": "Ranged, Light DMG(Psionic), Foe Hold",
  "icon": "mentalcontrol_command.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 80,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.1
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Dominator Archetype Sets",
    "Holds",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 1,
    "table": "Ranged_Damage"
  },
  "effects": {
    "hold": {
      "mag": 3,
      "scale": 12,
      "table": "Ranged_Immobilize"
    }
  }
};
