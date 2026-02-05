/**
 * Mercurial Blow
 * Melee, DMG(Smash), Foe -Def
 *
 * Source: stalker_melee/staff_fighting/mercurial_blow.json
 */

import type { Power } from '@/types';

export const MercurialBlow: Power = {
  "name": "Mercurial Blow",
  "internalName": "Mercurial_Blow",
  "available": 0,
  "description": "You strike your foe with a lightning fast blow from your staff dealing Smashing damage. The attack is so unexpected that the target's defenses are reduced slightly for a short time. This power grants one stack of Perfection of Body.",
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
    "Defense Debuff",
    "Melee Damage",
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.84,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Smashing",
      "scale": 0.84,
      "table": "Melee_InherentDamage"
    }
  ],
  "requires": "!Stalker_Defense.Shield_Defense"
};
