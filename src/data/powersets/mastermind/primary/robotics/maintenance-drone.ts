/**
 * Maintenance Drone
 * Summon Maintenance Robot
 *
 * Source: mastermind_summon/robotics/repair.json
 */

import type { Power } from '@/types';

export const MaintenanceDrone: Power = {
  "name": "Maintenance Drone",
  "internalName": "Repair",
  "available": 17,
  "description": "This sturdy Maintenance Drone serves as a health battery reserve for your machines. As your other drones are hurt, it will use its own health to heal other drones. Once all its health is used up, it will self destruct. Maintenance Drone does not regenerate health, and can't be healed.",
  "shortHelp": "Summon Maintenance Robot",
  "icon": "robotics_maintenancebot.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 120,
    "endurance": 16.25,
    "castTime": 2.03
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "MastermindPets_Maintenance_Bot"
    }
  }
};
