/**
 * Aura of Madness
 * Toggle: PBAoE, Foe Confuse, Disorient, Sleep, Hold, Fear, -Damage(All), +Special
 *
 * Source: sentinel_defense/psionic_armor/aura_of_insanity.json
 */

import type { Power } from '@/types';

export const AuraofMadness: Power = {
  "name": "Aura of Madness",
  "internalName": "Aura_of_Insanity",
  "available": 27,
  "description": "You emit a powerful psychic aura that causes the minds of those around you to become weak and distracted. Foes may be stunned, held, terrified or even confused in your presence, in addition to suffering a debuff derived from the applied control effect. Those that resist these effects will see their damage reduced. This power allows you to use your own Hit Points to keep enemies near you disabled. The power costs no endurance but can be dangerous to use.Notes: Mez enhancements on this power enhance its magnitude instead of its duration.",
  "shortHelp": "Toggle: PBAoE, Foe Confuse, Disorient, Sleep, Hold, Fear, -Damage(All), +Special",
  "icon": "psionicarmor_worldofconfusion.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.8,
    "radius": 8,
    "recharge": 10,
    "castTime": 1.67,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Hold",
    "Stun",
    "Sleep",
    "Recharge",
    "Fear",
    "Confuse",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Confuse",
    "Fear",
    "Holds",
    "Sleep",
    "Stuns"
  ],
  "maxSlots": 6
};
