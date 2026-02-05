/**
 * Staff Mastery
 * Change Stances/Special
 *
 * Source: brute_melee/staff_fighting/staff_mastery.json
 */

import type { Power } from '@/types';

export const StaffMastery: Power = {
  "name": "Staff Mastery",
  "internalName": "Staff_Mastery",
  "available": 7,
  "description": "By Purchasing this power, you will gain access to the following powers: Form of the Body, Form of the Mind and Form of the Soul. Each of these toggle powers will allow the user to build up levels of Perfection, which grant the user a stacking short duration buff. Each buff is unique to the active form, and only one form can be active at a time. Perfection can be released by executing Eye of the Storm or Sky Splitter. When either of these attacks are empowered with Perfection they will have additional effects that are unique to each form. See Forms for additional details.",
  "shortHelp": "Change Stances/Special",
  "icon": "stafffighting_staffmastery.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1
  },
  "allowedEnhancements": [],
  "maxSlots": 6
};
