/**
 * Black Dwarf Drain
 * Melee, Light DMG(Negative), Foe -Recharge, -SPD; Self +HP
 *
 * Source: warshade/umbral-aura
 */

import type { Power } from '@/types';

export const BlackDwarfDrain: Power = {
  "name": "Black Dwarf Drain",
  "available": 19,
  "description": "You tap the primal forces of your Nictus power to create an Essence Draining conduit between a foe and yourself. This will transfer Hit Points from your enemy to yourself. Foes drained in this manner have their attack and movement speed reduced. This power is only available while in Black Dwarf Form.  Damage: Light. Recharge: Slow.",
  "shortHelp": "Melee, Light DMG(Negative), Foe -Recharge, -SPD; Self +HP",
  "icon": "umbralaura_essencedrain.png",
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
  "requires": "Black Dwarf"
};
