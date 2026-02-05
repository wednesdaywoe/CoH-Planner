/**
 * Consume Psyche
 * PBAoE Foe -Regen, -Heal, -Recovery; Self +Regen, +Recovery
 *
 * Source: tanker_defense/psionic_armor/consume_psyche.json
 */

import type { Power } from '@/types';

export const ConsumePsyche: Power = {
  "name": "Consume Psyche",
  "internalName": "Consume_Psyche",
  "available": 5,
  "description": "You Consume the Psyche of nearby foes, thus weakening their Hit Point Regeneration and Endurance Recovery and boosting your own. Hitting any foe with this power will refresh all existing stacks you currently have.Notes: This power has adaptive recharge. It has a base recharge of 5 seconds and each affected foe will increase the recharge by 5.5 seconds for a maximum total of 60 seconds.",
  "shortHelp": "PBAoE Foe -Regen, -Heal, -Recovery; Self +Regen, +Recovery",
  "icon": "psionicarmor_consumepsyche.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 20,
    "recharge": 60,
    "endurance": 10.5,
    "castTime": 1.33,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Healing",
    "Threat Duration"
  ],
  "maxSlots": 6
};
