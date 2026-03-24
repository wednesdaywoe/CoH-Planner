/**
 * Aura of Madness
 * Toggle: PBAoE, Foe Confuse, Disorient, Sleep, Hold, Fear, -Damage(All), +Special
 *
 * Source: stalker_defense/psionic_armor/aura_of_insanity.json
 */

import type { Power } from '@/types';

export const AuraofMadness: Power = {
  "name": "Aura of Madness",
  "internalName": "Aura_of_Insanity",
  "available": 27,
  "description": "You emit a powerful psychic aura that causes the minds of those around you to become weak and distracted. Foes may be stunned, held, terrified or even confused in your presence, in addition to suffering a debuff derived from the applied control effect. Those that resist these effects will see their damage reduced. This power allows you to use your own Hit Points to keep enemies near you disabled. The power costs no endurance but can be dangerous to use.Notes: Mez enhancements on this power enhance its magnitude instead of its duration.",
  "shortHelp": "Toggle: PBAoE, Foe Confuse, Disorient, Sleep, Hold, Fear, -Damage(All), +Special",
  "icon": "psionicarmor_worldofconfusion.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.8,
    "radius": 8,
    "recharge": 10,
    "castTime": 1.67,
    "activatePeriod": 4,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Hold",
    "Stun",
    "Sleep",
    "Recharge",
    "Fear",
    "Confuse",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Confuse",
    "Fear",
    "Holds",
    "Sleep",
    "Stuns"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Special",
    "scale": -0.05,
    "table": "Melee_HealSelf"
  },
  "effects": {
    "regenDebuff": {
      "scale": 0.75,
      "table": "Melee_Ones"
    },
    "durations": {
      "regenDebuff": 4,
      "resistanceDebuff": 4,
      "defenseDebuff": 4,
      "confuse": 4,
      "stun": 4,
      "sleep": 4,
      "hold": 4,
      "fear": 4
    },
    "resistanceDebuff": {
      "smashing": {
        "scale": 1,
        "table": "Melee_Debuff_Def"
      },
      "lethal": {
        "scale": 1,
        "table": "Melee_Debuff_Def"
      },
      "fire": {
        "scale": 1,
        "table": "Melee_Debuff_Def"
      },
      "cold": {
        "scale": 1,
        "table": "Melee_Debuff_Def"
      },
      "energy": {
        "scale": 1,
        "table": "Melee_Debuff_Def"
      },
      "negative": {
        "scale": 1,
        "table": "Melee_Debuff_Def"
      },
      "psionic": {
        "scale": 1,
        "table": "Melee_Debuff_Def"
      },
      "toxic": {
        "scale": 1,
        "table": "Melee_Debuff_Def"
      }
    },
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    },
    "confuse": {
      "mag": 2,
      "scale": 2,
      "table": "Melee_Ones"
    },
    "effectDuration": 4,
    "stun": {
      "mag": 2,
      "scale": 2,
      "table": "Melee_Ones"
    },
    "sleep": {
      "mag": 2,
      "scale": 2,
      "table": "Melee_Ones"
    },
    "hold": {
      "mag": 2,
      "scale": 2,
      "table": "Melee_Ones"
    },
    "fear": {
      "mag": 2,
      "scale": 2,
      "table": "Melee_Ones"
    },
    "buffDuration": 4
  }
};
