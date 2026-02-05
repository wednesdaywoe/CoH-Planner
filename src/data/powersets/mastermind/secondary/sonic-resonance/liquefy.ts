/**
 * Liquefy
 * Ranged (Location AoE), Foe Knockback, Hold, -To Hit, -DEF
 *
 * Source: mastermind_buff/sonic_resonance/liquefy.json
 */

import type { Power } from '@/types';

export const Liquefy: Power = {
  "name": "Liquefy",
  "internalName": "Liquefy",
  "available": 29,
  "description": "You unleash a barrage of sonic waves on the Earth itself, generating a powerful, localized earthquake. Most foes that pass through the location will fall down. The violent shaking also reduces their chance to hit and Defense.Recharge: Very Long.",
  "shortHelp": "Ranged (Location AoE), Foe Knockback, Hold, -To Hit, -DEF",
  "icon": "sonicdebuff_dropknockback.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 150,
    "endurance": 23.4,
    "castTime": 2.67
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "ToHit Debuff",
    "Defense Debuff",
    "Damage"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Accurate To-Hit Debuff",
    "Defense Debuff",
    "Holds",
    "Knockback",
    "Ranged AoE Damage",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": true,
      "displayName": "Liquefy",
      "powers": [
        "Pets.ResistAll.ResistAll",
        "Pets.Liquefy.Liquefy"
      ],
      "duration": 30
    }
  }
};
