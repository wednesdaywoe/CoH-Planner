/**
 * Glue Arrow
 * Ranged (Location AoE), Foe -Speed, -Recharge
 *
 * Source: defender_buff/trick_arrow/glue_arrow.json
 */

import type { Power } from '@/types';

export const GlueArrow: Power = {
  "name": "Glue Arrow",
  "internalName": "Glue_Arrow",
  "available": 1,
  "description": "This arrow carries a cartridge of intensely sticky glue, which explodes on impact. The glue slows the movement and attack rates of any foes in the area.Recharge: Slow.",
  "shortHelp": "Ranged (Location AoE), Foe -Speed, -Recharge",
  "icon": "trickarrow_slow.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "radius": 25,
    "recharge": 60,
    "endurance": 7.8,
    "castTime": 1.16,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Slow Movement"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": true,
      "displayName": "Glue Arrow",
      "powers": [
        "Redirects.Trick_Arrow.GlueArrow"
      ],
      "duration": 60
    }
  }
};
