/**
 * Pummel
 * Melee, Minor DMG(Smash)
 *
 * Source: arachnos-soldier/arachnos-soldier
 */

import type { Power } from '@/types';

export const Pummel: Power = {
  "name": "Pummel",
  "available": 0,
  "description": "You can smash your opponents in close combat with the butt of your sub-machine gun to deal minor smashing damage. Pummel has a high chance to disorient your foe for a brief time. NOTE: This power will deal critical damage if used after a successful Placate or while the user is hidden with the Bane Spider Cloaking Device. Damage: Minor",
  "shortHelp": "Melee, Minor DMG(Smash)",
  "icon": "arachnossoldier_pummel.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [],
  "allowedSetCategories": [],
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 1.17
  },
  "targetType": "Foe (Alive)"
};
