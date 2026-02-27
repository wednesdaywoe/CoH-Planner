/**
 * Empty Clips
 * Ranged (Cone), Knockback
 *
 * Source: mastermind_summon/thugs/empty_clips.json
 */

import type { Power } from '@/types';

export const EmptyClips: Power = {
  "name": "Empty Clips",
  "internalName": "Empty_Clips",
  "available": 7,
  "description": "You empty the clips of both your pistols in a arc of suppression fire. This attack can blast multiple foes in the affected cone area, and has a small chance of knocking some foes down.Street Cred:If you own Gang War and are at least level 18, activating this power will grant a stack of Street Cred and summon a Pose to fight by your side for 30 up to seconds. Each stack of Street Cred owned will increase the chances to summon all 13 Posse when using Gang War. Enhancements in this power will also enhance the stats of Posse summoned with this attack. You may only have build Street Cred with this power once every 30 seconds.",
  "shortHelp": "Ranged (Cone), Knockback",
  "icon": "thugs_conerangedmoderatedmg.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.1,
    "range": 40,
    "radius": 40,
    "arc": 0.5236,
    "recharge": 8,
    "endurance": 18.98,
    "castTime": 1.83,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 0.2633,
    "table": "Ranged_Damage",
    "duration": 0.7,
    "tickRate": 0.3
  },
  "effects": {
    "knockback": {
      "scale": 0.64,
      "table": "Ranged_Knockback"
    }
  }
};
