/**
 * Psionic Strike
 * Ranged, Superior DMG(Psionic), Target -Recharge
 *
 * Source: sentinel_ranged/psychic_blast/psionic_strike.json
 */

import type { Power } from '@/types';

export const PsionicStrike: Power = {
  "name": "Psionic Strike",
  "internalName": "Psionic_Strike",
  "available": 11,
  "description": "This extremely accurate attack does moderate Psionic damage and can Slow a target's attack rate.Damage: Superior.Recharge: Slow.",
  "shortHelp": "Ranged, Superior DMG(Psionic), Target -Recharge",
  "icon": "psychicblast_heavy.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 75,
    "recharge": 14,
    "endurance": 13.52,
    "castTime": 2.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged Damage",
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 2.6,
    "table": "Ranged_Damage"
  },
  "effects": {
    "rechargeDebuff": {
      "scale": 0.15,
      "table": "Ranged_Slow"
    }
  }
};
