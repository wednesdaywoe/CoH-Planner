/**
 * Blinding Powder
 * Ranged (Cone), Foe -To Hit, Sleep, Confuse, -Perception
 *
 * Source: sentinel_defense/ninjitsu/blinding_powder.json
 */

import type { Power } from '@/types';

export const BlindingPowder: Power = {
  "name": "Blinding Powder",
  "internalName": "Blinding_Powder",
  "available": 27,
  "description": "You throw a handful of Blinding powder in a wide arc at your foes. Most foes will be blinded, and unable to see. Some affected targets may be overcome by the powder that they may start attacking their own allies. If you attack the blinded foes, they will be alerted to your presence, but will continue to suffer a penalty to their chance to hit.Recharge: Long.",
  "shortHelp": "Ranged (Cone), Foe -To Hit, Sleep, Confuse, -Perception",
  "icon": "ninjitsu_blindingpowder.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 25,
    "radius": 25,
    "arc": 0.7854,
    "recharge": 120,
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
    "sleep": {
      "mag": 2,
      "scale": 10,
      "table": "Melee_Sleep"
    }
  }
};
