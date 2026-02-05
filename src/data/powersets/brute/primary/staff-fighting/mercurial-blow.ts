/**
 * Mercurial Blow
 * Melee, DMG(Smash), Foe -Def
 *
 * Source: brute_melee/staff_fighting/mercurial_blow.json
 */

import type { Power } from '@/types';

export const MercurialBlow: Power = {
  "name": "Mercurial Blow",
  "internalName": "Mercurial_Blow",
  "available": 0,
  "description": "You strike your foe with a lightning fast blow from your staff dealing Smashing damage. The attack is so unexpected that the target's defenses are reduced slightly for a short time. While a form is active, this power will build one level of Perfection.",
  "shortHelp": "Melee, DMG(Smash), Foe -Def",
  "icon": "stafffighting_mercurialblow.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 9,
    "recharge": 3,
    "endurance": 4.368,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Brute Archetype Sets",
    "Defense Debuff",
    "Melee Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "requires": "!Brute_Defense.Shield_Defense"
};
