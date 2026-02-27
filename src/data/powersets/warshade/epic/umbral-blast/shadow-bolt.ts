/**
 * Shadow Bolt
 * Ranged, Minor DMG(Negative), Foe -Recharge, -SPD
 *
 * Source: warshade_offensive/umbral_blast/shadow_bolt.json
 */

import type { Power } from '@/types';

export const ShadowBolt: Power = {
  "name": "Shadow Bolt",
  "available": 0,
  "description": "A very quick, but low damage attack that can lower your target's attack rate and movement speed. This power can be used while in Dwarf form, although only at a reduced range. While in dwarf form, this power will inflict a stronger attack and movement debuff, in addition to taunt its target.  Damage: Minor. Recharge: Very Fast.",
  "shortHelp": "Ranged, Minor DMG(Negative), Foe -Recharge, -SPD",
  "icon": "umbralblast_shadowbolt.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Kheldian Archetype Sets",
    "Ranged Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 1.5,
    "endurance": 3.12,
    "castTime": 1
  },
  "targetType": "Foe (Alive)"
};
