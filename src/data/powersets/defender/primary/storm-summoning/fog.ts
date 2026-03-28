/**
 * Freezing Rain
 * Ranged (Location AoE), Minor DoT(Cold), Foe -Speed, -Recharge, -DEF -Res
 *
 * Source: defender_buff/storm_summoning/fog.json
 */

import type { Power } from '@/types';

export const FreezingRain: Power = {
  "name": "Freezing Rain",
  "internalName": "Fog",
  "available": 7,
  "description": "Summons Freezing Rain at a targeted location. Freezing Rain deals minimal Cold damage to anything that passes through the storm. It also Slows the affected foes and severely reduces their Defense and resistance to damage. Many foes may even slip and fall trying to escape the storm.Damage: Minor(DoT).Recharge: Slow.",
  "shortHelp": "Ranged (Location AoE), Minor DoT(Cold), Foe -Speed, -Recharge, -DEF -Res",
  "icon": "stormsummoning_freezingrain.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 60,
    "endurance": 18.2,
    "castTime": 2.03
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defender Archetype Sets",
    "Defense Debuff",
    "Ranged AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": true,
      "displayName": "Freezing Rain",
      "powers": [
        "Pets.Freezing_Rain.FreezingRain",
        "Pets.Freezing_Rain.Avoid"
      ],
      "duration": 15,
      "copyBoosts": true
    }
  }
};
