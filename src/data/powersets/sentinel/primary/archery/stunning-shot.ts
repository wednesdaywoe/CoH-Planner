/**
 * Stunning Shot
 * Ranged Disorient, Moderate DMG(Smashing)
 *
 * Source: sentinel_ranged/archery/stunning_shot.json
 */

import type { Power } from '@/types';

export const StunningShot: Power = {
  "name": "Stunning Shot",
  "internalName": "Stunning_Shot",
  "available": 5,
  "description": "You fire a blunt, weighted arrow at your target's chest. The Stunning Shot inflicts high damage and has a good chance of stunning your foe.Damage: Moderate.Recharge: Moderate.",
  "shortHelp": "Ranged Disorient, Moderate DMG(Smashing)",
  "icon": "archery_stunarrow.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.155,
    "range": 60,
    "recharge": 8,
    "endurance": 8.53,
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
    "Ranged Damage",
    "Sentinel Archetype Sets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 1.64,
    "table": "Ranged_Damage"
  },
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 4,
      "table": "Ranged_Stun"
    }
  }
};
