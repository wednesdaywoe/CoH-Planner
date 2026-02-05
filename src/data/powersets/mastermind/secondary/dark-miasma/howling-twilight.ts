/**
 * Howling Twilight
 * Ranged (AoE), Minor DMG(Negative), Target Slow, -Recharge, -Regen, Disorient, Ally Rez
 *
 * Source: mastermind_buff/dark_miasma/howling_twilight.json
 */

import type { Power } from '@/types';

export const HowlingTwilight: Power = {
  "name": "Howling Twilight",
  "internalName": "Howling_Twilight",
  "available": 9,
  "description": "Activating this power channels the power of the Netherworld to weaken your foes, in an attempt to revive all nearby fallen allies. You must stand near your defeated allies to revive them, then select a foe. The selected foe and all nearby foes will be Slowed, Disoriented, have their Regeneration rate reduced and drained of some life. Revived allies will have full Hit Points and Endurance and will be protected from XP Debt for 90 seconds.",
  "shortHelp": "Ranged (AoE), Minor DMG(Negative), Target Slow, -Recharge, -Regen, Disorient, Ally Rez",
  "icon": "darkmiasma_howlingtwilight.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 15,
    "recharge": 180,
    "endurance": 32.5,
    "castTime": 3.17,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "Damage"
  ],
  "allowedSetCategories": [
    "Ranged AoE Damage",
    "Slow Movement",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Negative",
    "scale": 0.25,
    "table": "Ranged_Damage"
  },
  "effects": {
    "movement": {
      "runSpeed": {
        "scale": 0.5,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.5,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.5,
        "table": "Ranged_Slow"
      },
      "jumpHeight": {
        "scale": 0.5,
        "table": "Ranged_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.5,
      "table": "Ranged_Slow"
    },
    "fear": {
      "mag": 3,
      "scale": 15,
      "table": "Ranged_Ones"
    },
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_HowlingVillain",
      "duration": 1
    },
    "stun": {
      "mag": 2,
      "scale": 15,
      "table": "Ranged_Ones"
    },
    "regenDebuff": {
      "scale": 5,
      "table": "Ranged_Ones"
    }
  }
};
