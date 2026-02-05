/**
 * Cosmic Burst
 * Ranged, DMG(Energy), Foe Disorient, -DEF
 *
 * Source: corruptor_ranged/radiation_blast/cosmic_burst.json
 */

import type { Power } from '@/types';

export const CosmicBurst: Power = {
  "name": "Cosmic Burst",
  "internalName": "Cosmic_Burst",
  "available": 17,
  "description": "Cosmic Burst smashes the target with cosmic particles. The attack is devastating and can leave most targets Disoriented and with reduced Defense.",
  "shortHelp": "Ranged, DMG(Energy), Foe Disorient, -DEF",
  "icon": "radiationburst_cosmicburst.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 10,
    "endurance": 10.4,
    "castTime": 2.07
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Corruptor Archetype Sets",
    "Defense Debuff",
    "Ranged Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Energy",
      "scale": 2.12,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 2.12,
      "table": "Ranged_InherentDamage"
    }
  ],
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 8,
      "table": "Ranged_Stun"
    },
    "defenseDebuff": {
      "scale": 3,
      "table": "Ranged_Debuff_Def"
    }
  }
};
