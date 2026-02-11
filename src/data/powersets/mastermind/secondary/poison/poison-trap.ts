/**
 * Poison Trap
 * Place Trap: PBAoE Foe Hold, -END, -Recovery, Chance to Hold, Minor DoT(Toxic)
 *
 * Source: mastermind_buff/poison/poison_trap.json
 */

import type { Power } from '@/types';

export const PoisonTrap: Power = {
  "name": "Poison Trap",
  "internalName": "Poison_Trap",
  "available": 27,
  "description": "You can build a Poison Trap on the ground. Any foes that pass near the Poison Trap will cause it to detonate and release its toxic vapors. The poison is a highly toxic nerve gas, and any foes in the affected area may be drained of much of their Endurance and quickly Held or begin choking while suffering a minor amount of Toxic damage over time. The trap is almost impossible to detect, but it is fragile and may be set off by an enemy's explosion. Even if destroyed, the Trap will detonate.Recharge: Slow.",
  "shortHelp": "Place Trap: PBAoE Foe Hold, -END, -Recovery, Chance to Hold, Minor DoT(Toxic)",
  "icon": "poison_poison_trap.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 60,
    "endurance": 13,
    "castTime": 1
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Holds",
    "Melee AoE Damage",
    "Universal Damage Sets",
    "Mastermind Archetype Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Poison_Trap",
      "duration": 260
    }
  }
};
