/**
 * Remote Bomb
 * Place Bomb: PBAoE, Extreme DMG(Lethal/Fire), Foe Knockback
 *
 * Source: blaster_support/gadgets/time_bomb.json
 */

import type { Power } from '@/types';

export const RemoteBomb: Power = {
  "name": "Remote Bomb",
  "internalName": "Time_Bomb",
  "available": 27,
  "description": "You can place a Remote Bomb on the ground. The Remote Bomb will detonate once the power is activated a second time, resulting in a massive explosion that can devastate all nearby foes and send them flying. If used while targeting an enemy in melee range, you can attach the Remote Bomb to them instead!The Remote Bomb is small, and almost impossible to detect.Damage: Extreme.Recharge: Very Long.",
  "shortHelp": "Place Bomb: PBAoE, Extreme DMG(Lethal/Fire), Foe Knockback",
  "icon": "gadgets_remotebomb.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 2
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Knockback",
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
