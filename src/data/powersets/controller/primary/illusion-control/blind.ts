/**
 * Blind
 * Ranged (Targeted AoE), DMG(Psionic), Foe Hold/Sleep
 *
 * Source: controller_control/illusion_control/blind.json
 */

import type { Power } from '@/types';

export const Blind: Power = {
  "name": "Blind",
  "internalName": "Blind",
  "available": 0,
  "description": "Painfully Blinds a single targeted foe so severely that they are rendered helpless. Blind is so bright that additional foes may also be blinded, though they will not take any damage, and attacking them will free them from the effects.",
  "shortHelp": "Ranged (Targeted AoE), DMG(Psionic), Foe Hold/Sleep",
  "icon": "illusions_blind.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.1,
    "range": 80,
    "recharge": 9,
    "endurance": 8.528,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Range",
    "Sleep",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Controller Archetype Sets",
    "Holds",
    "Ranged Damage",
    "Sleep",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Psionic",
      "scale": 1,
      "table": "Ranged_Damage"
    },
    {
      "type": "Psionic",
      "scale": 1,
      "table": "Ranged_InherentDamage"
    }
  ],
  "effects": {
    "hold": {
      "mag": 3,
      "scale": 10,
      "table": "Ranged_Immobilize"
    }
  }
};
