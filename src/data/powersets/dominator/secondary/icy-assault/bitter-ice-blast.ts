/**
 * Bitter Ice Blast
 * Ranged, High DMG(Cold/Smash), Foe -Recharge, -SPD, -To Hit
 *
 * Source: dominator_assault/icy_assault/bitter_ice_blast.json
 */

import type { Power } from '@/types';

export const BitterIceBlast: Power = {
  "name": "Bitter Ice Blast",
  "internalName": "Bitter_Ice_Blast",
  "available": 29,
  "description": "A slower yet more powerful version of Ice Blast, Bitter Ice Blast deals much more damage and can also reduce your enemy's chance to hit. Like other Ice Blast powers, Bitter Ice Blast can Slow a target's movement and attack speed.Damage: High.Recharge: Slow.",
  "shortHelp": "Ranged, High DMG(Cold/Smash), Foe -Recharge, -SPD, -To Hit",
  "icon": "iceassault_bitterblast.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 12,
    "endurance": 11.856,
    "castTime": 1.07
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Ranged Damage",
    "Slow Movement",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1,
      "table": "Ranged_Damage"
    },
    {
      "type": "Cold",
      "scale": 1.28,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "tohitDebuff": {
      "scale": 1,
      "table": "Ranged_Debuff_ToHit"
    },
    "movement": {
      "jumpHeight": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      },
      "runSpeed": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.2,
      "table": "Ranged_Slow"
    }
  }
};
