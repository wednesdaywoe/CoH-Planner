/**
 * Share Pain
 * Ally Strong Heal, Self Moderate DMG(Special), +DMG
 *
 * Source: controller_buff/pain_domination/share_pain.json
 */

import type { Power } from '@/types';

export const SharePain: Power = {
  "name": "Share Pain",
  "internalName": "Share_Pain",
  "available": 3,
  "description": "Share Pain draws away some of an ally's anguish caused by their wounds, but damages the user. The pain caused by this power causes the user to go into a frenzy, briefly increasing their damage output, however the user cannot be healed and will have their regeneration rate greatly diminished for a short time.Recharge: Slow.",
  "shortHelp": "Ally Strong Heal, Self Moderate DMG(Special), +DMG",
  "icon": "paindomination_sharepain.png",
  "powerType": "Click",
  "targetType": "Ally (Alive)",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 15,
    "endurance": 0.52,
    "castTime": 2.27
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
  "damage": [
    {
      "type": "Heal",
      "scale": 4,
      "table": "Ranged_Heal"
    },
    {
      "type": "Special",
      "scale": 2,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "resistance": {
      "heal": {
        "scale": 1,
        "table": "Ranged_Ones"
      }
    },
    "regenDebuff": {
      "scale": 1,
      "table": "Ranged_Ones"
    },
    "damageBuff": {
      "scale": 2.5,
      "table": "Ranged_Buff_Dmg"
    }
  }
};
