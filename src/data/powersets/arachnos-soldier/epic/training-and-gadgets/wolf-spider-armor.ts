/**
 * Wolf Spider Armor
 * Auto: Self +RES(Smash, Lethal, Psionic, Status Effects)
 *
 * Source: arachnos-soldier/training-and-gadgets
 */

import type { Power } from '@/types';

export const WolfSpiderArmor: Power = {
  "name": "Wolf Spider Armor",
  "available": 0,
  "description": "Your Wolf Spider Armor provides good protection to Smashing, Lethal and Psionic damage types, as well as offering basic levels of protection to most status effects, including Confuse, Fear, Disorient, Hold, Sleep and Immobilize effects.",
  "shortHelp": "Auto: Self +RES(Smash, Lethal, Psionic, Status Effects)",
  "icon": "trainingandgadgets_wolfspiderarmor.png",
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
