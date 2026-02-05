/**
 * Aimed Shot
 * Ranged, DMG(Lethal)
 *
 * Source: mastermind_summon/ninjas/aimed_shot.json
 */

import type { Power } from '@/types';

export const AimedShot: Power = {
  "name": "Aimed Shot",
  "internalName": "Aimed_Shot",
  "available": 1,
  "description": "Though it takes longer to execute, your Aimed Shot deals greater damage than Snap Shot.Sensei's Guidance:Hitting with this power will grant your Ninja Henchman +3% Critical Hit chance for 30 seconds. This does not stack from the same power.",
  "shortHelp": "Ranged, DMG(Lethal)",
  "icon": "ninjas_standardshot.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.155,
    "range": 80,
    "recharge": 4,
    "endurance": 6.5,
    "castTime": 1
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
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 1,
    "table": "Ranged_Damage"
  }
};
