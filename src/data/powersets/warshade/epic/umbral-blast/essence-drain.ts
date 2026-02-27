/**
 * Essence Drain
 * Melee, Light DMG(Negative), Foe -Recharge, -SPD; Self +HP
 *
 * Source: warshade_offensive/umbral_blast/essence_drain.json
 */

import type { Power } from '@/types';

export const EssenceDrain: Power = {
  "name": "Essence Drain",
  "available": 17,
  "description": "You tap the primal forces of your Nictus power to create an Essence Draining conduit between a foe and yourself. This will transfer Hit Points from your enemy to you. Foes drained in this manner have their attack rate and movement speed reduced.  Damage: Light. Recharge: Slow.",
  "shortHelp": "Melee, Light DMG(Negative), Foe -Recharge, -SPD; Self +HP",
  "icon": "umbralblast_essencedrain.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Recharge",
    "Healing",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Healing",
    "Healing",
    "Kheldian Archetype Sets",
    "Melee Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 15,
    "endurance": 15.6,
    "castTime": 1.93
  },
  "targetType": "Foe (Alive)",
  "damage": [
    {
      "type": "Negative",
      "scale": 1,
      "table": "Melee_Damage"
    },
    {
      "type": "Heal",
      "scale": 1,
      "table": "Melee_HealSelf"
    }
  ],
  "effects": {
    "movement": {
      "jumpHeight": {
        "scale": 0.2,
        "table": "Melee_Slow"
      },
      "runSpeed": {
        "scale": 0.2,
        "table": "Melee_Slow"
      },
      "flySpeed": {
        "scale": 0.2,
        "table": "Melee_Slow"
      },
      "jumpSpeed": {
        "scale": 0.2,
        "table": "Melee_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.2,
      "table": "Melee_Slow"
    }
  }
};
