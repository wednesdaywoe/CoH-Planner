/**
 * Dark Nova Bolt
 * Ranged, Minor DMG(Negative), Foe -Recharge, -SPD
 *
 * Source: warshade/umbral-blast
 */

import type { Power } from '@/types';

export const DarkNovaBolt: Power = {
  "name": "Dark Nova Bolt",
  "available": 3,
  "description": "A very quick, but low damage attack that lowers your target's attack and movement speed. This power is only available while in Dark Nova Form.  Damage: Minor. Recharge: Very Fast.",
  "shortHelp": "Ranged, Minor DMG(Negative), Foe -Recharge, -SPD",
  "icon": "umbralblast_shadowbolt.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Kheldian Archetype Sets",
    "Ranged Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 100,
    "recharge": 1.5,
    "endurance": 3.12,
    "castTime": 1.5
  },
  "targetType": "Foe (Alive)",
  "requires": "Dark Nova"
};
