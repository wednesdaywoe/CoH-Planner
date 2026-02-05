/**
 * Surveillance
 * Ranged Foe -DEF, -RES (All)
 *
 * Source: arachnos-soldier/bane-spider-training
 */

import type { Power } from '@/types';

export const Surveillance: Power = {
  "name": "Surveillance",
  "available": 23,
  "description": "When this power is activated, you focus your senses to analyze your targets defensive capabilities and discover their weaknesses. By sharing your knowledge of the targets weaknesses with your team mates, you effectively reduce their defense and resistance to damage.",
  "shortHelp": "Ranged Foe -DEF, -RES (All)",
  "icon": "banespidertraining_surveillance.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense Debuff",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff"
  ],
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 45,
    "endurance": 10.66,
    "castTime": 1.5
  },
  "targetType": "Foe (Alive)"
};
