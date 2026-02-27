/**
 * Form of the Mind
 * Toggle: Grants Perfection of Mind levels
 *
 * Source: brute_melee/staff_fighting/form_of_the_mind.json
 */

import type { Power } from '@/types';

export const FormoftheMind: Power = {
  "name": "Form of the Mind",
  "internalName": "Form_of_the_Mind",
  "available": -1,
  "description": "This power is obtained by purchasing Staff Mastery. All Staff Fighting attacks will build a level of Perfection of Mind while this toggle is active. Each level will boost the user's recharge rate slightly. Once the user has built up 3 levels of Perfection of Mind and they execute Eye of the Storm, the attack will slow the targets slightly and will deal additional psychic damage. Executing Sky Splitter with three 3 levels of Perfection of Mind will deal additional psychic damage and grant the user a moderate to hit buff for a short time.",
  "shortHelp": "Toggle: Grants Perfection of Mind levels",
  "icon": "stafffighting_formofthemind.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 4,
    "castTime": 0.63
  },
  "allowedEnhancements": [],
  "maxSlots": 0,
  "mechanicType": "childToggle",
  "requires": "Brute_Melee.Staff_Fighting.Staff_Mastery"
};
