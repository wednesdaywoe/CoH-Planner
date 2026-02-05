/**
 * Form of the Soul
 * Toggle: Grants Perfection of Soul levels
 *
 * Source: brute_melee/staff_fighting/form_of_the_soul.json
 */

import type { Power } from '@/types';

export const FormoftheSoul: Power = {
  "name": "Form of the Soul",
  "internalName": "Form_of_the_Soul",
  "available": -1,
  "description": "This power is obtained by purchasing Staff Mastery. All Staff Fighting attacks will build a level of Perfection of Soul while this toggle is active. Each level will grant the user an Endurance Discount. Once the user has built up 3 levels of Perfection of Soul and they execute Eye of the Storm, the attack will reduce targets' defense slightly and will deal additional energy damage. Executing Sky Splitter with three 3 levels of Perfection of Soul will deal additional energy damage and grant the user a moderate regeneration and recovery buff for a short time.",
  "shortHelp": "Toggle: Grants Perfection of Soul levels",
  "icon": "stafffighting_formofthesoul.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 4,
    "castTime": 0.63
  },
  "allowedEnhancements": [],
  "maxSlots": 6,
  "requires": "Brute_Melee.Staff_Fighting.Staff_Mastery"
};
