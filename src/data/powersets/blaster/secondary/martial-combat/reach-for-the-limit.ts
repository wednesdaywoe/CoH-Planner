/**
 * Reach for the Limit
 * All Attacks: Chance for +ToHit, +DMG(All)
 *
 * Source: blaster_support/martial_manipulation/reach_for_the_limit.json
 */

import type { Power } from '@/types';

export const ReachfortheLimit: Power = {
  "name": "Reach for the Limit",
  "internalName": "Reach_for_the_Limit",
  "available": 3,
  "description": "You are constantly looking for vulnerabilities in your foes' stances and positioning. Whenever you attack, you have a chance to gain a moderate +ToHit and +Damage bonus for a short duration.",
  "shortHelp": "All Attacks: Chance for +ToHit, +DMG(All)",
  "icon": "martialmanipulation_reachforthelimit.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1
  },
  "allowedEnhancements": [],
  "maxSlots": 6
};
