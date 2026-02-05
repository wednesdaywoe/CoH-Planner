/**
 * Foresight
 * Auto: Self Res (Disorient, Hold, Immobilize, Sleep, Fear, Confuse, Psionics, Special), +Def (all)
 *
 * Source: arachnos-widow/teamwork
 */

import type { Power } from '@/types';

export const Foresight: Power = {
  "name": "Foresight",
  "available": 21,
  "description": "Widows who possess Foresight are resistant to Psionic Damage, as well as Sleep, Hold, Immobilization, Disorient, Confuse and Fear effects. Their precognition becomes clearer in times of duress, providing resistance to all damage types based on their current health, as well. They also have improved Defense, due to being able to see attacks slightly before they actually occur.",
  "shortHelp": "Auto: Self Res (Disorient, Hold, Immobilize, Sleep, Fear, Confuse, Psionics, Special), +Def (all)",
  "icon": "teamwork_foresight.png",
  "powerType": "Auto",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Resistance",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Resist Damage"
  ],
  "stats": {
    "accuracy": 1
  },
  "targetType": "Self"
};
