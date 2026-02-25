/**
 * Upgrade Robot
 * Ranged, Upgrade Robot Henchman
 *
 * Source: mastermind_summon/robotics/upgrade_robot.json
 */

import type { Power } from '@/types';

export const UpgradeRobot: Power = {
  "name": "Upgrade Robot",
  "internalName": "Upgrade_Robot",
  "available": 25,
  "description": "Upgrade Robot will permanently bestow the most powerful and high-tech gear and weaponry to all of your Robot Henchman. The Upgraded Robot will gain new abilities, powers and weapons. The powers gained are unique and dependent upon the type of Robot Henchmen that is Upgraded.Your Protector Bot Henchmen will also gain the ability to Repair other Robot Henchmen. This power only works on your Robot Henchmen and you can only Upgrade your Robot Henchman once with this power.",
  "shortHelp": "Ranged, Upgrade Robot Henchman",
  "icon": "robotics_upgraderobot.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 50,
    "radius": 30,
    "recharge": 0.5,
    "endurance": 11.375,
    "castTime": 2.03,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6
};
