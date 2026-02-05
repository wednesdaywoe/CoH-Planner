/**
 * Granite Armor
 * Self, +Res(All but Psionics), +DEF(All but Psionics), -SPD, -Recharge, -DMG, -Special
 *
 * Source: tanker_defense/stone_armor/granite_armor.json
 */

import type { Power } from '@/types';

export const GraniteArmor: Power = {
  "name": "Granite Armor",
  "internalName": "Granite_Armor",
  "available": 25,
  "description": "When you activate this power, you are transformed into a massive bulk of unyielding Granite. Your incredible mass makes you almost completely invulnerable and resistant to most effects, including Defense DeBuffs. However, you also become quite heavy, cannot fly, your attack and movement speed are Slowed and you do less damage.Cannot be active at the same time as other Armors in this set, Fly powers, Sprint, Super Speed, or Jump powers.Recharge: Moderate.",
  "shortHelp": "Self, +Res(All but Psionics), +DEF(All but Psionics), -SPD, -Recharge, -DMG, -Special",
  "icon": "stonearmor_granite.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 10,
    "endurance": 0.13,
    "castTime": 0.73
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "elusivity": {
      "all": {
        "scale": 1,
        "table": "Melee_Res_Boolean"
      }
    },
    "resistance": {
      "smashing": {
        "scale": 5,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 5,
        "table": "Melee_Res_Dmg"
      },
      "fire": {
        "scale": 4,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 4,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 4,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 4,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 4,
        "table": "Melee_Res_Dmg"
      }
    },
    "defenseBuff": {
      "smashing": {
        "scale": 1.5,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 1.5,
        "table": "Melee_Buff_Def"
      },
      "fire": {
        "scale": 1.5,
        "table": "Melee_Buff_Def"
      },
      "cold": {
        "scale": 1.5,
        "table": "Melee_Buff_Def"
      },
      "energy": {
        "scale": 1.5,
        "table": "Melee_Buff_Def"
      },
      "negative": {
        "scale": 1.5,
        "table": "Melee_Buff_Def"
      }
    },
    "hold": {
      "mag": 1,
      "scale": 50,
      "table": "Melee_Res_Boolean"
    },
    "effectDuration": 0.75,
    "immobilize": {
      "mag": 1,
      "scale": 50,
      "table": "Melee_Res_Boolean"
    },
    "stun": {
      "mag": 1,
      "scale": 50,
      "table": "Melee_Res_Boolean"
    },
    "sleep": {
      "mag": 1,
      "scale": 50,
      "table": "Melee_Res_Boolean"
    },
    "knockup": {
      "scale": 10,
      "table": "Melee_Ones"
    },
    "knockback": {
      "scale": 10,
      "table": "Melee_Ones"
    },
    "repel": {
      "scale": 10,
      "table": "Melee_Ones"
    },
    "rechargeDebuff": {
      "scale": 0.65,
      "table": "Melee_Ones"
    },
    "damageDebuff": {
      "scale": 0.3,
      "table": "Melee_Ones"
    },
    "slow": {
      "runSpeed": {
        "scale": 0.7,
        "table": "Melee_Ones"
      },
      "jumpSpeed": {
        "scale": 1.893,
        "table": "Melee_Ones"
      },
      "jumpHeight": {
        "scale": 1.7851,
        "table": "Melee_Leap"
      },
      "fly": {
        "scale": 10000,
        "table": "Melee_Ones"
      }
    }
  }
};
