/**
 * Distortion Field
 * Ranged (Location AoE), Foe(-Recharge, -Speed), Chance for Hold
 *
 * Source: defender_buff/time_manipulation/distortion_field.json
 */

import type { Power } from '@/types';

export const DistortionField: Power = {
  "name": "Distortion Field",
  "internalName": "Distortion_Field",
  "available": 7,
  "description": "You can choose an area to slow the flow of time down to a crawl. Enemies who enter the field will have their attack rate and speed slowed dramatically. In addition, affected enemies might become held as they are frozen in time. Targets affected by Time Crawl will have the chance to be held increased.Recharge: Slow.",
  "shortHelp": "Ranged (Location AoE), Foe(-Recharge, -Speed), Chance for Hold",
  "icon": "timemanipulation_distortionfield.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "recharge": 60,
    "endurance": 14.56,
    "castTime": 2.03
  },
  "allowedEnhancements": [
    "Hold",
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Holds",
    "Slow Movement"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_DistortionField_Defender",
      "duration": 45
    }
  }
};
