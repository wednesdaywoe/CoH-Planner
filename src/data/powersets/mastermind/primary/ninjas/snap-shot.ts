/**
 * Snap Shot
 * Ranged, DMG(Lethal)
 *
 * Source: mastermind_summon/ninjas/snap_shot.json
 */

import type { Power } from '@/types';

export const SnapShot: Power = {
  "name": "Snap Shot",
  "internalName": "Snap_Shot",
  "available": 0,
  "description": "A quick attack that fires an arrow at your foe after only minimal aiming. Fast, but little damage.Sensei's Guidance:Hitting with this power will grant your Ninja Henchman +3% Critical Hit chance for 30 seconds. This does not stack from the same power.",
  "shortHelp": "Ranged, DMG(Lethal)",
  "icon": "ninjas_quickshot.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.155,
    "range": 80,
    "recharge": 2,
    "endurance": 4.42,
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
    "scale": 0.68,
    "table": "Ranged_Damage"
  }
};
