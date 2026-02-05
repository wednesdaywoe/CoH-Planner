/**
 * Damping Bubble
 * Location (PBAoE), Team +Res(Accuracy, Defense, Perception, Recharge, Regen, Speed, ToHit), Foe -Str(Defense, Perception, Regen, Speed, ToHit)
 *
 * Source: mastermind_buff/force_field/force_bubble.json
 */

import type { Power } from '@/types';

export const DampingBubble: Power = {
  "name": "Damping Bubble",
  "internalName": "Force_Bubble",
  "available": 29,
  "description": "Creates a large bubble at your location which protects all allies inside. While active, this power will grant resistance to Accuracy, Defense, Regeneration, Perception, and Slow debuffs on yourself and allies. Foes within this bubble will have the strength of their Accuracy, Defense, Regeneration, Perception, and Speed debuff powers weakened directly.",
  "shortHelp": "Location (PBAoE), Team +Res(Accuracy, Defense, Perception, Recharge, Regen, Speed, ToHit), Foe -Str(Defense, Perception, Regen, Speed, ToHit)",
  "icon": "forcefield_dampeningbubble.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 90,
    "endurance": 6.5,
    "castTime": 1.07
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Defense Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": true,
      "displayName": "Dampening Bubble",
      "powers": [
        "Redirects.Force_Field.Dampening_Bubble",
        "Redirects.Force_Field.Dampening_Bubble_Debuff",
        "Redirects.Force_Field.Dampening_BubbleFX"
      ],
      "duration": 45
    }
  }
};
