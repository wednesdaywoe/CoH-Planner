/**
 * Tranquilizer
 * Ranged, DMG(Toxic), Foe Sleep, -SPD
 *
 * Source: dominator_control/arsenal_control/tranquilizer.json
 */

import type { Power } from '@/types';

export const Tranquilizer: Power = {
  "name": "Tranquilizer",
  "internalName": "Tranquilizer",
  "available": 0,
  "description": "The Tranquilizing Dart is the perfect tool to sideline a single foe. It deals some toxic damage and can render the target unconscious, allowing you to focus on more important targets. The target remains asleep for some time, but will awaken if attacked.Notes: The Sleep component of this power is Auto Hit against regular enemies, but a To Hit check is required to against AVs and players, as well as to make secondary effects apply.",
  "shortHelp": "Ranged, DMG(Toxic), Foe Sleep, -SPD",
  "icon": "arsenalcontrol_tranquilizer.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.15,
    "range": 80,
    "recharge": 6,
    "endurance": 5.2,
    "castTime": 1.4
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Sleep",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Dominator Archetype Sets",
    "Ranged Damage",
    "Sleep",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Toxic",
      "scale": 1,
      "table": "Ranged_Damage"
    },
    {
      "type": "Toxic",
      "scale": 1,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "movement": {
      "runSpeed": {
        "scale": 0.1,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.1,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.1,
        "table": "Ranged_Slow"
      },
      "jumpHeight": {
        "scale": 0.1,
        "table": "Ranged_Slow"
      }
    },
    "sleep": {
      "mag": 3.5,
      "scale": 30,
      "table": "Ranged_Sleep"
    }
  }
};
