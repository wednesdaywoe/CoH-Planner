/**
 * Glue Arrow
 * Ranged (Targeted AoE), DoT(Toxic), Foe -SPD, -Recharge, -Fly, -Jump
 *
 * Source: blaster_support/tactical_arrow/glue_arrow.json
 */

import type { Power } from '@/types';

export const GlueArrow: Power = {
  "name": "Glue Arrow",
  "internalName": "Glue_Arrow",
  "available": 0,
  "description": "This arrow carries a cartridge of intensely sticky glue, which explodes on impact. The glue slows the movement and attack rates of any foes in the area.Recharge: Long.",
  "shortHelp": "Ranged (Targeted AoE), DoT(Toxic), Foe -SPD, -Recharge, -Fly, -Jump",
  "icon": "tacticalarrow_slow.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 45,
    "endurance": 7.8,
    "castTime": 1.16
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Ranged AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_StickyArrow_Blaster"
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
