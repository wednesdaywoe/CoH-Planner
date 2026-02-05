/**
 * Bane Spider Armor Upgrade
 * Auto: Self +Res(All DMG, Status Effects), +HP
 *
 * Source: arachnos-soldier/bane-spider-training
 */

import type { Power } from '@/types';

export const BaneSpiderArmorUpgrade: Power = {
  "name": "Bane Spider Armor Upgrade",
  "available": 0,
  "description": "Your Bane Spider Armor Upgrade improves your overall health, protection to all damage types, as well as increasing your protection against most status effects, including Confuse, Fear, Disorient, Hold, Sleep and Immobilize effects.",
  "shortHelp": "Auto: Self +Res(All DMG, Status Effects), +HP",
  "icon": "banespidertraining_banespiderarmor.png",
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
