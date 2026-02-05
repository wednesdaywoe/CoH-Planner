/**
 * Confuse
 * Ranged, Target Confuse
 *
 * Source: dominator_control/mind_control/confuse.json
 */

import type { Power } from '@/types';

export const Confuse: Power = {
  "name": "Confuse",
  "internalName": "Confuse",
  "available": 5,
  "description": "You can Confuse an enemy, forcing it to believe their friends are not who they appear to be. If successful, the enemy will ignore you and attack their own allies. If you Confuse a target before they notice you, your presence will continue to be masked. You will not receive any Experience Points for foes defeated entirely by a Confused enemy.",
  "shortHelp": "Ranged, Target Confuse",
  "icon": "mentalcontrol_mindcontrol.png",
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
    "Confuse",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Confuse",
    "Dominator Archetype Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "confuse": {
      "mag": 3,
      "scale": 20,
      "table": "Ranged_Immobilize"
    }
  }
};
