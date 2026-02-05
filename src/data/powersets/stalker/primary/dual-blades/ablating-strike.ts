/**
 * Ablating Strike
 * Melee, DMG(Lethal), Foe -DEF
 *
 * Source: stalker_melee/dual_blades/moderate_bridge.json
 */

import type { Power } from '@/types';

export const AblatingStrike: Power = {
  "name": "Ablating Strike",
  "internalName": "Moderate_Bridge",
  "available": 1,
  "description": "You Slash at your foe with your blades, dealing a good amount of lethal damage. This attack can reduce a target's Defense, making them easier to hit. This power is the finishing move of the Sweep combination attack.Sweep: Build Up > Assassin’s Blades > Ablating Strike.",
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
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 0.66,
    "table": "Melee_Damage",
    "duration": 0.6,
    "tickRate": 0.4
  },
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    }
  }
};
