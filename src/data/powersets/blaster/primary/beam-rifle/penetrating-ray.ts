/**
 * Penetrating Ray
 * Sniper, DMG(Energy), Self +Range, Foe Knockdown, Special
 *
 * Source: blaster_ranged/beam_rifle/penetrating_ray.json
 */

import type { Power } from '@/types';

export const PenetratingRay: Power = {
  "name": "Penetrating Ray",
  "internalName": "Penetrating_Ray",
  "available": 17,
  "description": "You take careful aim at your target and deliver a punishing supercharged shot from your Beam Rifle. This causes Extreme Energy damage and may knock the target off their feet. If the target is also suffering from the Disintegrating effect it will also suffer additional damage over time. Like all Sniper attacks it will be interrupted if you're attacked. In addition, targets already affected by the Disintegrating effect will cause this effect to spread to 3 nearby targets. This Disintegrate Spread effect can only hit targets that aren't already affected by the Disintegrating effect. Disintegrate Spread causes Minor Energy damage over time. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.",
  "shortHelp": "Sniper, DMG(Energy), Self +Range, Foe Knockdown, Special",
  "icon": "beamrifle_penetratingray.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 150,
    "recharge": 12,
    "endurance": 14.352,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "Interrupt",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Knockback",
    "Ranged Damage",
    "Sniper Attacks",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
