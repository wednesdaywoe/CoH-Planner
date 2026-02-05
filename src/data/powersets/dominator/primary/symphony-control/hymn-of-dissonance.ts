/**
 * Hymn of Dissonance
 * Ranged, DMG(Psionic), Foe Hold, -Recharge
 *
 * Source: dominator_control/symphony_control/hymn_of_dissonance.json
 */

import type { Power } from '@/types';

export const HymnofDissonance: Power = {
  "name": "Hymn of Dissonance",
  "internalName": "Hymn_of_Dissonance",
  "available": 0,
  "description": "Hymn of Dissonance causes pain on its listener, disruptive enough to hold them in place. Stronger foes might persist, but will still attack at a reduced speed.",
  "shortHelp": "Ranged, DMG(Psionic), Foe Hold, -Recharge",
  "icon": "symphonycontrol_holdst.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 80,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.67
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
    "rechargeDebuff": {
      "scale": 0.2,
      "table": "Ranged_Slow"
    },
    "hold": {
      "mag": 3,
      "scale": 12,
      "table": "Melee_Immobilize"
    }
  }
};
