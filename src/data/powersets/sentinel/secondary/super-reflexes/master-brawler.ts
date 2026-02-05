/**
 * Master Brawler
 * Self +Absorb +Special
 *
 * Source: sentinel_defense/super_reflexes/master_brawler.json
 */

import type { Power } from '@/types';

export const MasterBrawler: Power = {
  "name": "Master Brawler",
  "internalName": "Master_Brawler",
  "available": 9,
  "description": "Your are a master brawler, as such you have learned when its best to block an attack and absorb damage the most effectively. Using this power when you have the highest amount of endurance but the lowest amount of health will result in the most powerful effect possible. Owning this power will also improve your Focused Fighting and Focused Senses abilities. This power can not be taken if you take Practiced Brawler.Recharge: Slow.",
  "shortHelp": "Self +Absorb +Special",
  "icon": "superreflexes_block.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 60,
    "endurance": 5.2,
    "castTime": 1.53
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "absorb": {
      "scale": 4,
      "table": "Melee_HealSelf"
    }
  },
  "requires": "!Sentinel_Defense.Super_Reflexes.Practiced_Brawler"
};
