/**
 * Jacobs Ladder
 * Melee (Cone), DMG(Energy), Foe Sleep, -End
 *
 * Source: stalker_melee/electrical_melee/jacobs_ladder.json
 */

import type { Power } from '@/types';

export const JacobsLadder: Power = {
  "name": "Jacobs Ladder",
  "internalName": "Jacobs_Ladder",
  "available": 1,
  "description": "You are able to generate a strong current between your arms and snap a powerful bolt of electricity in an arc in front of you. This melee attack can electrocute all foes within the arc dealing High energy damage. Jacobs Ladder can drain some Endurance from your target and may overload their synapses, leaving them writhing for a moment. Disturbing an overloaded target will disperse the electrical charge and release him.",
  "shortHelp": "Melee (Cone), DMG(Energy), Foe Sleep, -End",
  "icon": "electricmelee_conemoderatedmg.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "radius": 7,
    "arc": 0.8727,
    "recharge": 9,
    "endurance": 9.36,
    "castTime": 1.67,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Sleep",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Melee AoE Damage",
    "Sleep",
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 1.5233,
    "table": "Melee_Damage"
  },
  "effects": {
    "enduranceDrain": {
      "scale": 0.07,
      "table": "Melee_Ones"
    },
    "recoveryDebuff": {
      "scale": 1,
      "table": "Melee_Ones"
    },
    "sleep": {
      "mag": 2,
      "scale": 6,
      "table": "Melee_Sleep"
    }
  }
};
