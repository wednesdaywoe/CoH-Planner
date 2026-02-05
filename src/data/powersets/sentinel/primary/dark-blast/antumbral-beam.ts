/**
 * Antumbral Beam
 * Ranged, DMG(Negative), Target -To Hit
 *
 * Source: sentinel_ranged/dark_blast/antumbral_beam.json
 */

import type { Power } from '@/types';

export const AntumbralBeam: Power = {
  "name": "Antumbral Beam",
  "internalName": "Antumbral_Beam",
  "available": 17,
  "description": "An extremely focused beam of Negative Energy that deals tremendous damage and reduces the target's chance to hit.",
  "shortHelp": "Ranged, DMG(Negative), Target -To Hit",
  "icon": "darkcast_heavy.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 60,
    "recharge": 15,
    "endurance": 14.352,
    "castTime": 2.07
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Ranged Damage",
    "Sentinel Archetype Sets",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Negative",
    "scale": 2.76,
    "table": "Ranged_Damage"
  },
  "effects": {
    "tohitDebuff": {
      "scale": 0.75,
      "table": "Ranged_Debuff_ToHit"
    }
  }
};
