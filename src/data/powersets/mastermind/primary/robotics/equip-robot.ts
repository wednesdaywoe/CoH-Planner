/**
 * Equip Robot
 * Ranged, Equip Robot Henchman
 *
 * Source: mastermind_summon/robotics/equip_robot.json
 */

import type { Power } from '@/types';

export const EquipRobot: Power = {
  "name": "Equip Robot",
  "internalName": "Equip_Robot",
  "available": 5,
  "description": "Equip your Robots with the latest gear and weaponry. This power permanently bestows new powers and abilities to all of your Robot Henchman. The powers gained are unique and dependent upon the type of Robot Henchman that is Equipped.Your Robot Henchmen will also become more resistant to damage. This power only works on your Robot Henchmen and you can only Equip your Robot Henchmen once with this power.",
  "shortHelp": "Ranged, Equip Robot Henchman",
  "icon": "robotics_equiprobot.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 50,
    "radius": 30,
    "recharge": 6,
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
    "Resist Damage"
  ],
  "maxSlots": 6
};
