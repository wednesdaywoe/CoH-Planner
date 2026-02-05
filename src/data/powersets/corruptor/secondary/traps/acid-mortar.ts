/**
 * Acid Mortar
 * Place Trap: Ranged (AoE), DoT(Toxic), Foe -Res(All), -DEF
 *
 * Source: corruptor_buff/traps/acid_mortar.json
 */

import type { Power } from '@/types';

export const AcidMortar: Power = {
  "name": "Acid Mortar",
  "internalName": "Acid_Mortar",
  "available": 9,
  "description": "You can place a small Mortar on the ground. If an enemy passes nearby, the Mortar will fire an Acid grenade at the target. The grenade will explodes in a small shower of acid on impact. This acid eats through armor, causing minor damage over time. It reduces the target's Defense as well as his Damage Resistance. The mortar will last up to 60 seconds and will fire up to 10 grenades. It can be destroyed by your foes.",
  "shortHelp": "Place Trap: Ranged (AoE), DoT(Toxic), Foe -Res(All), -DEF",
  "icon": "traps_droppedaoedebuffdefense.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 90,
    "endurance": 13,
    "castTime": 2.77
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
    "Corruptor Archetype Sets",
    "Defense Debuff",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Traps_Acid_Mortar",
      "duration": 60
    }
  }
};
