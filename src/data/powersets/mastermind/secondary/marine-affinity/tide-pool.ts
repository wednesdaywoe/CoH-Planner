/**
 * Tide Pool
 * Ranged (Location AoE), Team +DMG, Foe -DMG, -SPD, -Jump, -Stealth, Special
 *
 * Source: mastermind_buff/marine_affinity/tide_pool.json
 */

import type { Power } from '@/types';

export const TidePool: Power = {
  "name": "Tide Pool",
  "internalName": "Tide_Pool",
  "available": 15,
  "description": "You summon a large pool of water at a targeted location to swell the damage that your allies deal, while reducing the damage, movement speeds, and stealth of enemies within the Tide Pool. If an enemy is defeated in the pool, the marine life present will be thrown into a brief frenzy! While frenzied, the Tide Pool has a chance to knock over enemies and the damage buff and debuff is stronger.",
  "shortHelp": "Ranged (Location AoE), Team +DMG, Foe -DMG, -SPD, -Jump, -Stealth, Special",
  "icon": "marineaffinity_tidepool.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 10,
    "endurance": 16.25,
    "castTime": 2.33
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Slow Movement"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": true,
      "displayName": "Tide Pool",
      "powers": [
        "Redirects.Marine_Affinity.TidePool_Aura",
        "Redirects.Marine_Affinity.TidePool_Aura_Debuff"
      ],
      "duration": 240
    }
  }
};
