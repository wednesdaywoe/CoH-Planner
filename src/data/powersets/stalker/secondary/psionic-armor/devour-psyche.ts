/**
 * Devour Psyche
 * Cone Foe -Regen, -Heal, -Recovery; Self +Regen, +Recovery
 *
 * Source: stalker_defense/psionic_armor/devour_psyche.json
 */

import type { Power } from '@/types';

export const DevourPsyche: Power = {
  "name": "Devour Psyche",
  "internalName": "Devour_Psyche",
  "available": 15,
  "description": "You Devour the Psyche of foes in front of you, weakening their Hit Point Regeneration and Endurance Recovery and boosting your own. Hitting any foe with this power will refresh all existing stacks you currently have.Notes: This power has adaptive recharge. It has a base recharge of 5 seconds and each affected foe will increase the recharge by 5.5 seconds for a maximum total of 60 seconds.",
  "shortHelp": "Cone Foe -Regen, -Heal, -Recovery; Self +Regen, +Recovery",
  "icon": "psionicarmor_devourpsyche.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 40,
    "radius": 40,
    "arc": 1.5708,
    "recharge": 60,
    "endurance": 10.5,
    "castTime": 1,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Healing"
  ],
  "maxSlots": 6
};
