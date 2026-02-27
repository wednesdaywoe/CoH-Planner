/**
 * Combat Flight
 * Toggle: Self Fly, +DEF
 *
 * Source: peacebringer_defensive/luminous_aura/combat_flight.json
 */

import type { Power } from '@/types';

export const CombatFlight: Power = {
  "name": "Combat Flight",
  "available": 9,
  "description": "For hovering and aerial combat. This power is much slower than Energy Flight, but provides some Defense, offers good air control, costs little Endurance, and has none of the penalties associated with Energy Flight. Switch to this mode when fighting other flying foes.  Combat Flight can be active at the same time as other flight toggles, but only the strongest flight speed buff will apply.",
  "shortHelp": "Toggle: Self Fly, +DEF",
  "icon": "luminousaura_combatflight.png",
  "powerType": "Toggle",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Fly",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Flight",
    "Universal Travel"
  ],
  "stats": {
    "accuracy": 1,
    "endurance": 0.0975,
    "castTime": 0.5
  },
  "targetType": "Self",
  "effects": {
    "movement": {
      "fly": {
        "scale": 0.1,
        "table": "Melee_Ones"
      },
      "flySpeed": {
        "scale": 0,
        "table": "Melee_Ones"
      },
      "movementControl": {
        "scale": 25,
        "table": "Melee_Control"
      },
      "movementFriction": {
        "scale": 25,
        "table": "Melee_Friction"
      }
    },
    "defenseBuff": {
      "ranged": {
        "scale": 0.25,
        "table": "Melee_Buff_Def"
      },
      "melee": {
        "scale": 0.25,
        "table": "Melee_Buff_Def"
      },
      "aoe": {
        "scale": 0.25,
        "table": "Melee_Buff_Def"
      },
      "smashing": {
        "scale": 0.25,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 0.25,
        "table": "Melee_Buff_Def"
      },
      "fire": {
        "scale": 0.25,
        "table": "Melee_Buff_Def"
      },
      "cold": {
        "scale": 0.25,
        "table": "Melee_Buff_Def"
      },
      "energy": {
        "scale": 0.25,
        "table": "Melee_Buff_Def"
      },
      "negative": {
        "scale": 0.25,
        "table": "Melee_Buff_Def"
      },
      "psionic": {
        "scale": 0.25,
        "table": "Melee_Buff_Def"
      },
      "toxic": {
        "scale": 0.25,
        "table": "Melee_Buff_Def"
      }
    }
  }
};
