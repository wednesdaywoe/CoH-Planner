/**
 * Form of the Body
 * Toggle: Grants Perfection of Body levels
 *
 * Source: scrapper_melee/staff_fighting/form_of_the_body.json
 */

import type { Power } from '@/types';

export const FormoftheBody: Power = {
  "name": "Form of the Body",
  "internalName": "Form_of_the_Body",
  "available": -1,
  "description": "This power is obtained by purchasing Staff Mastery. All Staff Fighting attacks will build a level of Perfection of Body while this toggle is active. Each level will boost the user's damage output slightly. Once the user has built up 3 levels of Perfection of Body and they execute Eye of the Storm, the attack will reduce the targets' damage resistance slightly and will deal additional smashing damage. Executing Sky Splitter with three 3 levels of Perfection of Body will deal additional smashing damage and grant the user a moderate resistance buff for a short time.",
  "shortHelp": "Toggle: Grants Perfection of Body levels",
  "icon": "stafffighting_formofthebody.png",
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
  "requires": "Scrapper_Melee.Staff_Fighting.Staff_Mastery"
};
