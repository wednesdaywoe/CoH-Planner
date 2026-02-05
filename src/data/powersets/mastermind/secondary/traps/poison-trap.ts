/**
 * Poison Trap
 * Place Trap: PBAoE Foe Choke, Vomit, -Regen, -Recharge
 *
 * Source: mastermind_buff/traps/poison_trap.json
 */

import type { Power } from '@/types';

export const PoisonTrap: Power = {
  "name": "Poison Trap",
  "internalName": "Poison_Trap",
  "available": 19,
  "description": "You can build a Poison Gas Trap on the ground. Any foes that pass near the Poison Trap will cause it to detonate and release its toxic vapors. The poison is a very noxious gas, and any foes in the affected area may start to choke or even vomit. Affected Foes Regeneration rate and attack rate will be reduced as well. The trap is almost impossible to detect, but it is fragile and may be set off by an enemy's explosion. Even if destroyed, the Trap will detonate.Recharge: Long.",
  "shortHelp": "Place Trap: PBAoE Foe Choke, Vomit, -Regen, -Recharge",
  "icon": "traps_droppedaoedebuffattackspeed.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 90,
    "endurance": 16.25,
    "castTime": 2.77
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Holds"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Traps_Poison_Trap",
      "duration": 260
    }
  }
};
