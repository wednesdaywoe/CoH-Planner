/**
 * Crab Spider Armor Upgrade
 * Auto: Self +RES(Smash, Lethal, Psionic, Status Effects)
 *
 * Source: arachnos-soldier/crab-spider-training
 */

import type { Power } from '@/types';

export const CrabSpiderArmorUpgrade: Power = {
  "name": "Crab Spider Armor Upgrade",
  "available": 0,
  "description": "Your Crab Spider Armor Upgrade improves your protection to Smashing, Lethal and Psionic damage types, as well as increasing your protection against most status effects, including Confuse, Fear, Disorient, Hold, Sleep and Immobilize effects.",
  "shortHelp": "Auto: Self +RES(Smash, Lethal, Psionic, Status Effects)",
  "icon": "crabspidertraining_crabspiderarmor.png",
  "powerType": "Auto",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Resistance"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "stats": {
    "accuracy": 1
  },
  "targetType": "Self"
};
