/**
 * Pistols
 * Ranged, DMG(Lethal)
 *
 * Source: mastermind_summon/thugs/pistols.json
 */

import type { Power } from '@/types';

export const Pistols: Power = {
  "name": "Pistols",
  "internalName": "Pistols",
  "available": 0,
  "description": "Quickly fires a round from one of your heavy automatic pistols. Damage is average, but the fire rate is very fast.Street Cred:If you own Gang War and are at least level 18, activating this power will grant a stack of Street Cred and summon a Pose to fight by your side for 30 up to seconds. Each stack of Street Cred owned will increase the chances to summon all 13 Posse when using Gang War. Enhancements in this power will also enhance the stats of Posse summoned with this attack. You may only have build Street Cred with this power once every 30 seconds.",
  "shortHelp": "Ranged, DMG(Lethal)",
  "icon": "thugs_targetedrangedminordmg.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.1,
    "range": 80,
    "recharge": 3,
    "endurance": 6.5,
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
