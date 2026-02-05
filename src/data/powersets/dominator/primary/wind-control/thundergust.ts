/**
 * Thundergust
 * Ranged (Cone), Minor DMG(Smashing), Knockdown(Foe), -ToHit(Foe), Pressure Builder (Self)
 *
 * Source: dominator_control/wind_control/thundergust.json
 */

import type { Power } from '@/types';

export const Thundergust: Power = {
  "name": "Thundergust",
  "internalName": "Thundergust",
  "available": 7,
  "description": "You unleash a powerful gust of wind in the direction of your foes. This gust has enough force to deal minor smashing damage to your foes and knock them to the ground. The debris blown at your opponent temporarily blinds them, reducing their chance to hit. This power builds Pressure.Damage: Minor.Recharge: Slow.",
  "shortHelp": "Ranged (Cone), Minor DMG(Smashing), Knockdown(Foe), -ToHit(Foe), Pressure Builder (Self)",
  "icon": "windcontrol_thundergust.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "radius": 60,
    "arc": 0.6981,
    "recharge": 30,
    "endurance": 13,
    "castTime": 2.17,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Knockback",
    "Ranged AoE Damage",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 0.24,
    "table": "Ranged_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Ranged_Ones"
    },
    "tohitDebuff": {
      "scale": 1.5,
      "table": "Ranged_Debuff_ToHit"
    },
    "slow": {
      "fly": {
        "scale": 3,
        "table": "Ranged_Ones"
      }
    }
  },
  "requires": "char>accesslevel >= 0"
};
