/**
 * Blinding Powder
 * Ranged (Cone), Foe -To Hit, Sleep, Confuse, -Perception
 *
 * Source: blaster_support/ninja_training/blinding_powder.json
 */

import type { Power } from '@/types';

export const BlindingPowder: Power = {
  "name": "Blinding Powder",
  "internalName": "Blinding_Powder",
  "available": 27,
  "description": "You throw a handful of Blinding powder in a wide arc at your foes. Most foes will be blinded, and unable to see. Some affected targets may be overcome by the powder that they may start attacking their own allies. If you attack the blinded foes, they will be alerted to your presence, but will continue to suffer a penalty to their chance to hit.Notes: The Sleep component of this power is Auto Hit against regular enemies, but a To Hit check is required to against AVs and players, as well as to make secondary effects apply.Recharge: Long.",
  "shortHelp": "Ranged (Cone), Foe -To Hit, Sleep, Confuse, -Perception",
  "icon": "ninjatools_blindingpowder.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 0.8,
    "range": 25,
    "radius": 25,
    "arc": 0.7854,
    "recharge": 90,
    "endurance": 7.8,
    "castTime": 1.07,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "ToHit Debuff",
    "Confuse",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Confuse",
    "To Hit Debuff"
  ],
  "maxSlots": 6,
  "effects": {
    "tohitDebuff": {
      "scale": 1,
      "table": "Melee_DeBuff_ToHit"
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    },
    "sleep": {
      "mag": 3,
      "scale": 10,
      "table": "Melee_Sleep"
    },
    "confuse": {
      "mag": 3,
      "scale": 8,
      "table": "Melee_Immobilize"
    },
    "perceptionDebuff": {
      "scale": 0.9,
      "table": "Melee_Ones"
    }
  }
};
