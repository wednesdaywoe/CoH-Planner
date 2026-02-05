/**
 * Tactical Upgrade
 * Ranged, Upgrade Mercenary Henchman
 *
 * Source: mastermind_summon/mercenaries/tactical_upgrade.json
 */

import type { Power } from '@/types';

export const TacticalUpgrade: Power = {
  "name": "Tactical Upgrade",
  "internalName": "Tactical_Upgrade",
  "available": 25,
  "description": "Permanently Upgrade the most advanced tactical weapons and gear to all of your Mercenary Henchman. The Tactically Upgraded Mercenaries will gain powers, weapons and munitions. The powers gained are unique and dependent upon the type of Mercenary Henchman that is Upgraded.Your Mercenary Henchmen will also become more evasive towards Ranged and AoE attacks. This power only works on your Mercenary Henchmen and you can only Upgrade your Mercenary Henchmen once with this power.",
  "shortHelp": "Ranged, Upgrade Mercenary Henchman",
  "icon": "paramilitary_tacticalupgrade.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 50,
    "radius": 30,
    "recharge": 10,
    "endurance": 11.375,
    "castTime": 2.03,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Defense Sets"
  ],
  "maxSlots": 6
};
