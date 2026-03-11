/**
 * Terrify
 * Ranged (Cone), DMG(Psionic), Foe Fear(Special)
 *
 * Source: controller_control/mind_control/terrify.json
 */

import type { Power } from '@/types';

export const Terrify: Power = {
  "name": "Terrify",
  "internalName": "Terrify",
  "available": 21,
  "description": "This power Terrifies foes within a cone area in front of you, causing them to tremble in Fear uncontrollably. The affect is so frightening and overwhelming, that the target takes real damage from the physiological response to this Psionic attack.",
  "shortHelp": "Ranged (Cone), DMG(Psionic), Foe Fear(Special)",
  "icon": "mentalcontrol_terrify.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "radius": 60,
    "arc": 1.5708,
    "recharge": 40,
    "endurance": 20.8,
    "castTime": 2.03,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Fear",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Controller Archetype Sets",
    "Fear",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 1,
    "table": "Ranged_Damage"
  },
  "effects": {
    "fear": {
      "mag": 3,
      "scale": 15,
      "table": "Ranged_Fear"
    }
  }
};
