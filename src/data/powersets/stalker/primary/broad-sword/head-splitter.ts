/**
 * Head Splitter
 * Melee, DMG(Lethal), Foe Knockback, -DEF
 *
 * Source: stalker_melee/broad_sword/head_splitter.json
 */

import type { Power } from '@/types';

export const HeadSplitter: Power = {
  "name": "Head Splitter",
  "internalName": "Head_Splitter",
  "available": 25,
  "description": "You perform a devastating Head Splitter attack that deals a massive amount of damage and can even knock a foe down to the ground and reduce its Defense. This attack has an exceptionally good critical hit capability, better than other Broadsword attacks, that can sometimes deal double damage. The power of this attack can actually extend a short distance through multiple foes.",
  "shortHelp": "Melee, DMG(Lethal), Foe Knockback, -DEF",
  "icon": "sword_headsplitter.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.05,
    "range": 10,
    "radius": 10,
    "arc": 1.5708,
    "recharge": 14,
    "endurance": 13.52,
    "castTime": 2.33,
    "maxTargets": 3
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Knockback",
    "Melee AoE Damage",
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 2.6,
    "table": "Melee_Damage"
  },
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    }
  }
};
