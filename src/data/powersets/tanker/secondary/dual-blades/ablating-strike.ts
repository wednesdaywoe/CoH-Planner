/**
 * Ablating Strike
 * Melee, DMG(Lethal), Foe -DEF
 *
 * Source: tanker_melee/dual_blades/moderate_bridge.json
 */

import type { Power } from '@/types';

export const AblatingStrike: Power = {
  "name": "Ablating Strike",
  "internalName": "Moderate_Bridge",
  "available": 3,
  "description": "You Slash at your foe with your blades, dealing a good amount of lethal damage. This attack can reduce a target's Defense, making him easier to hit. This power is needed for the Empower and Weaken combination attacks, and is the beginning of the Attack Vitals combination attack.Empower: Nimble Slash > Ablating Strike > Blinding Feint.Weaken: Nimble Slash > Ablating Strike > Typhoon's Edge.Attack Vitals: Ablating Strike > Vengeful Slice > Sweeping Strike.",
  "shortHelp": "Melee, DMG(Lethal), Foe -DEF",
  "icon": "dualblades_moderatebridge.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 6,
    "endurance": 6.864,
    "castTime": 1.03
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Melee Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.66,
      "table": "Melee_Damage",
      "duration": 0.6,
      "tickRate": 0.4
    },
    {
      "type": "Fire",
      "scale": 0.297,
      "table": "Melee_Damage",
      "duration": 0.6,
      "tickRate": 0.4
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    }
  }
};
