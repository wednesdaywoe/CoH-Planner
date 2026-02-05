/**
 * Stunning Shot
 * Ranged Disorient, Minor DMG(Smashing)
 *
 * Source: corruptor_ranged/archery/stunning_shot.json
 */

import type { Power } from '@/types';

export const StunningShot: Power = {
  "name": "Stunning Shot",
  "internalName": "Stunning_Shot",
  "available": 21,
  "description": "You fire a blunt, weighted arrow at your target's chest. The Stunning Shot has a good chance of stunning your foe.Damage: Minor.Recharge: Slow.",
  "shortHelp": "Ranged Disorient, Minor DMG(Smashing)",
  "icon": "archery_stunarrow.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.155,
    "range": 60,
    "recharge": 20,
    "endurance": 10.192,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Corruptor Archetype Sets",
    "Ranged Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.25,
      "table": "Ranged_Damage"
    },
    {
      "type": "Smashing",
      "scale": 0.25,
      "table": "Ranged_InherentDamage"
    }
  ],
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 10,
      "table": "Ranged_Stun"
    }
  }
};
