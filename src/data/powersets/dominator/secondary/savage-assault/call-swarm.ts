/**
 * Call Swarm
 * Ranged, DoT (Lethal), Foe -Defense, -Speed, +1 Blood Frenzy
 *
 * Source: dominator_assault/savage_assault/call_swarm.json
 */

import type { Power } from '@/types';

export const CallSwarm: Power = {
  "name": "Call Swarm",
  "internalName": "Call_Swarm",
  "available": 0,
  "description": "You summon a swarm of stinging insects to harass your foe causing Light Lethal damage over time and reducing both their movement speed and defense. This power grants 1 stack of Blood Frenzy.Damage: Light.Recharge: Fast.",
  "shortHelp": "Ranged, DoT (Lethal), Foe -Defense, -Speed, +1 Blood Frenzy",
  "icon": "savagemelee_callswarm.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 4,
    "endurance": 5.46,
    "castTime": 1
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Ranged Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 0.22,
    "table": "Ranged_Damage",
    "duration": 3.1,
    "tickRate": 0.75
  },
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Ranged_Debuff_Def"
    },
    "movement": {
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
      },
      "jumpHeight": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      }
    }
  }
};
