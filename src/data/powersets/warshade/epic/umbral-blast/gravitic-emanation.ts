/**
 * Gravitic Emanation
 * Ranged (Cone), Minor DMG(Negative), Foe Disorient, Knockback, -Recharge, -SPD
 *
 * Source: warshade/umbral-blast
 */

import type { Power } from '@/types';

export const GraviticEmanation: Power = {
  "name": "Gravitic Emanation",
  "available": 19,
  "description": "Gravitic Emanation sends bolts of dark Nictus energy to multiple targets within a cone area in front of the caster. Gravitic Emanation deals only minor Negative Energy damage to each affected foe, but knocks them back, leaving them Disoriented and with reduced attack rate and movement speed.  Damage: Minor. Recharge: Slow.",
  "shortHelp": "Ranged (Cone), Minor DMG(Negative), Foe Disorient, Knockback, -Recharge, -SPD",
  "icon": "umbralblast_graviticemanation.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Kheldian Archetype Sets",
    "Knockback",
    "Ranged AoE Damage",
    "Slow Movement",
    "Stuns",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 40,
    "recharge": 45,
    "endurance": 14.352,
    "castTime": 1,
    "radius": 40,
    "maxTargets": 10
  },
  "targetType": "Foe (Alive)"
};
