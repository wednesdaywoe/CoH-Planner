/**
 * Proton Stream
 * Ranged, DMG(Energy), Foe -DEF
 *
 * Source: sentinel_ranged/radiation_blast/proton_stream.json
 */

import type { Power } from '@/types';

export const ProtonStream: Power = {
  "name": "Proton Stream",
  "internalName": "Proton_Stream",
  "available": 17,
  "description": "Hurls a volley of alpha particles at your target. Proton Volley is highly accurate and will reduce the target's Defense.",
  "shortHelp": "Ranged, DMG(Energy), Foe -DEF",
  "icon": "radiationburst_heavy.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 60,
    "recharge": 12,
    "endurance": 11.856,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Ranged Damage",
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 0.57,
    "table": "Ranged_Damage",
    "duration": 0.41,
    "tickRate": 0.13
  },
  "effects": {
    "defenseDebuff": {
      "scale": 3,
      "table": "Ranged_Debuff_Def"
    }
  }
};
