/**
 * Call Swarm
 * Ranged, Light DoT(Lethal), Foe -Defense, -Speed
 *
 * Source: mastermind_summon/beast_mastery/call_swarm.json
 */

import type { Power } from '@/types';

export const CallSwarm: Power = {
  "name": "Call Swarm",
  "internalName": "Call_Swarm",
  "available": 0,
  "description": "You summon a swarm of stinging insects to harass your foe causing Light Lethal damage over time and reducing both their movement speed and defense. This power has a moderate chance at granting your pets a stack of Pack Mentality.Apex Predator:Using this power will grant you and your summoned beasts an Accuracy and HP buff for 30 seconds. This does not stack from the same power.",
  "shortHelp": "Ranged, Light DoT(Lethal), Foe -Defense, -Speed",
  "icon": "beastmastery_callswarm.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 3,
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
    "scale": 0.1848,
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
