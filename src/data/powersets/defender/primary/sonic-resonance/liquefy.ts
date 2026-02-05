/**
 * Liquefy
 * Ranged (Location AoE), Minor DMG(Smashing/Energy), Foe Hold, Knockdown, -To Hit, -DEF
 *
 * Source: defender_buff/sonic_debuff/liquefy.json
 */

import type { Power } from '@/types';

export const Liquefy: Power = {
  "name": "Liquefy",
  "internalName": "Liquefy",
  "available": 25,
  "description": "You unleash a barrage of sonic waves on the Earth itself, generating a powerful, localized earthquake. The impact of the sonic shockwave may Hold some foes and deal some minor damage. Most foes that pass through the location will fall down. The violent shaking also reduces their chance to hit and Defense.Recharge: Very Long.",
  "shortHelp": "Ranged (Location AoE), Minor DMG(Smashing/Energy), Foe Hold, Knockdown, -To Hit, -DEF",
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
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Accurate To-Hit Debuff",
    "Defender Archetype Sets",
    "Defense Debuff",
    "Holds",
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
