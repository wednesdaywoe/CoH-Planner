/**
 * Tranquilizer
 * Ranged, DMG(Toxic), Foe Deep Sleep, -SPD
 *
 * Source: controller_control/arsenal_control/tranquilizer.json
 */

import type { Power } from '@/types';

export const Tranquilizer: Power = {
  "name": "Tranquilizer",
  "internalName": "Tranquilizer",
  "available": 0,
  "description": "The Tranquilizing Dart is the perfect tool to sideline a single foe. It deals some toxic damage and can render the target unconscious, allowing you to focus on more important targets. The target remains asleep for some time, but will awaken if attacked.Notes: Although this power is Auto Hit, it requires a To Hit check to apply Deep Sleep. If The Hit check is missed, and the target is not an AV, the weaker form of Sleep will be applied.",
  "shortHelp": "Ranged, DMG(Toxic), Foe Deep Sleep, -SPD",
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
    "Controller Archetype Sets",
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
      "table": "Ranged_InherentDamage"
    },
    {
      "type": "Toxic",
      "scale": 1,
      "table": "Ranged_Damage"
    },
    {
      "type": "Toxic",
      "scale": 1,
      "table": "Ranged_InherentDamage"
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
