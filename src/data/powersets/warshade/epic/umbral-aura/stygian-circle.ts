/**
 * Stygian Circle
 * PBAoE Self +HP (Special), +End
 *
 * Source: warshade/umbral-aura
 */

import type { Power } from '@/types';

export const StygianCircle: Power = {
  "name": "Stygian Circle",
  "available": 21,
  "description": "You can tap into your Nictus power to drain the remaining essence of all nearby defeated foes to heal yourself, and recover Endurance. The more defeated foes affected, the more you will be healed. Additionally, the more powerful the defeated foes you drain, the more health you will recover.  Recharge: Slow.",
  "shortHelp": "PBAoE Self +HP (Special), +End",
  "icon": "umbralaura_stygiancircle.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Healing"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 30,
    "endurance": 15.6,
    "castTime": 1.17,
    "radius": 20,
    "maxTargets": 10
  },
  "targetType": "Self"
};
