/**
 * Microburst
 * Ranged (Targeted AoE), Variable DMG(Smashing), Stun(Foe), -Speed(Foe, All), -Fly(Foe), -Rech(Foe), Chance for -DEF(Foe, All), Consumes Pressure
 *
 * Source: dominator_control/wind_control/microburst.json
 */

import type { Power } from '@/types';

export const Microburst: Power = {
  "name": "Microburst",
  "internalName": "Microburst",
  "available": 11,
  "description": "You release all available Pressure to create an extremely powerful blast of air that descends from the skies and spreads out over a large radius. Any foes caught within the burst are immediately stunned by the force of the wind and suffer smashing damage.Flying foes are knocked out of the sky, while all foes suffer reduced movement speed that lingers for some time. The damage done increases in proportion to the amount of Pressure released when using this power. Also, Microburst can reduce your target's defenses at the when the highest levels of Pressure are released.Damage: Variable.Recharge: Long.",
  "shortHelp": "Ranged (Targeted AoE), Variable DMG(Smashing), Stun(Foe), -Speed(Foe, All), -Fly(Foe), -Rech(Foe), Chance for -DEF(Foe, All), Consumes Pressure",
  "icon": "windcontrol_microburst.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "radius": 25,
    "recharge": 90,
    "endurance": 19.5,
    "castTime": 2.37,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Dominator Archetype Sets",
    "Ranged AoE Damage",
    "Slow Movement",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 0.2,
    "table": "Ranged_Damage"
  },
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 8,
      "table": "Ranged_Stun"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      },
      "jumpHeight": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.3,
      "table": "Ranged_Slow"
    },
    "slow": {
      "fly": {
        "scale": 2,
        "table": "Ranged_Ones"
      }
    },
    "defenseDebuff": {
      "scale": 2.5,
      "table": "Ranged_Debuff_Def"
    }
  },
  "requires": "char>accesslevel >= 0"
};
