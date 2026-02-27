/**
 * Arc of Destruction
 * Melee (Cone), DMG(Smashing), Foe Knockback
 *
 * Source: brute_melee/titan_weapons/arc_of_destruction.json
 */

import type { Power } from '@/types';

export const ArcofDestruction: Power = {
  "name": "Arc of Destruction",
  "internalName": "Arc_of_Destruction",
  "available": 25,
  "description": "You swing your weapon in a devastating Arc of Destruction that deals Superior Smashing damage and has a good chance to knock foes down. Arc of Destruction may only be used while on the ground.Notes: Arc of Destruction is unaffected by Arc changes.",
  "shortHelp": "Melee (Cone), DMG(Smashing), Foe Knockback",
  "icon": "titanweapons_arcofdestruction.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 10,
    "radius": 10,
    "arc": 2.0944,
    "recharge": 16,
    "endurance": 15.6395,
    "castTime": 2.7,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Knockback",
    "Melee AoE Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
