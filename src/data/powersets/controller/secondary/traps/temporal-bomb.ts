/**
 * Temporal Bomb
 * Place Bomb: PBAoE, DMG(Lethal/Fire), Foe Knockback, Special
 *
 * Source: controller_buff/traps/time_bomb.json
 */

import type { Power } from '@/types';

export const TemporalBomb: Power = {
  "name": "Temporal Bomb",
  "internalName": "Time_Bomb",
  "available": 29,
  "description": "You can place a Temporal Bomb on the ground. The Temporal Bomb will detonate once the power is activated a second time, resulting in a massive explosion that can damage all nearby foes and send them flying, as well as create a Temporal Bubble that speeds up yourself and allies, while slowing down all enemies inside. If used while targeting an enemy in melee range, you can attach the Temporal Bomb to them instead!The Temporal Bomb is small, and almost impossible to detect.",
  "shortHelp": "Place Bomb: PBAoE, DMG(Lethal/Fire), Foe Knockback, Special",
  "icon": "traps_remotebomb.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 2
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Knockback",
    "Melee AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
