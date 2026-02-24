/**
 * Hypnotizing Lights
 * Ranged (Cone), Foe Sleep, Foe Confuse (Within 20ft), Moderate DoT (Psionic), Foe Deep Sleep
 *
 * Source: controller_control/pyrotechnic_control/hypnotizing_lights.json
 */

import type { Power } from '@/types';

export const HypnotizingLights: Power = {
  "name": "Hypnotizing Lights",
  "internalName": "Hypnotizing_Lights",
  "available": 7,
  "description": "You conjure a whirl of lights with differing effects depending on the distance from which it is viewed. Most all targets within the area will be placed into a sleep like trance. Up to five enemies within 20 feet of the display are Confused and receive Psionic damage over time.Notes: Although this power is Auto Hit, it requires a To Hit check to apply Deep Sleep. If the Hit check is missed, and the target is not an AV, the weaker form of Sleep will be applied.",
  "shortHelp": "Ranged (Cone), Foe Sleep, Foe Confuse (Within 20ft), Moderate DoT (Psionic), Foe Deep Sleep",
  "icon": "pyrotechnic_hypnotizinglights.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "radius": 70,
    "arc": 0.7854,
    "recharge": 45,
    "endurance": 8.582,
    "castTime": 1.67,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Sleep",
    "Recharge",
    "Damage",
    "Confuse",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Confuse",
    "Controller Archetype Sets",
    "Ranged AoE Damage",
    "Sleep",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "sleep": {
      "mag": 3,
      "scale": 12,
      "table": "Ranged_Sleep"
    }
  }
};
