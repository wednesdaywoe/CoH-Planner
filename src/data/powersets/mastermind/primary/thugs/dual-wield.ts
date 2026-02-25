/**
 * Dual Wield
 * Ranged, DMG(Lethal), Foe Knockback
 *
 * Source: mastermind_summon/thugs/dual_wield.json
 */

import type { Power } from '@/types';

export const DualWield: Power = {
  "name": "Dual Wield",
  "internalName": "Dual_Wield",
  "available": 1,
  "description": "Fires both pistols at once at a time target. Firing both pistols at once is slower than a single shot, but deals more damage, and the target may get knocked down by the force of the impact.Street Cred:If you own Gang War and are at least level 18, activating this power will grant a stack of Street Cred and summon a Pose to fight by your side for 30 up to seconds. Each stack of Street Cred owned will increase the chances to summon all 13 Posse when using Gang War. Enhancements in this power will also enhance the stats of Posse summoned with this attack. You may only have build Street Cred with this power once every 30 seconds.",
  "shortHelp": "Ranged, DMG(Lethal), Foe Knockback",
  "icon": "thugs_targetedrangedheavydmg.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.1,
    "range": 80,
    "recharge": 6,
    "endurance": 8.58,
    "castTime": 1.2
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 0.66,
    "table": "Ranged_Damage",
    "duration": 0.3,
    "tickRate": 0.25
  },
  "effects": {
    "knockback": {
      "scale": 0.64,
      "table": "Ranged_Knockback"
    }
  }
};
