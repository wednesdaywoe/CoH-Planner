/**
 * Psionic Lance
 * Sniper, DMG(Psionic), Target -Recharge
 *
 * Source: corruptor_ranged/psychic_blast/psionic_lance.json
 */

import type { Power } from '@/types';

export const PsionicLance: Power = {
  "name": "Psionic Lance",
  "internalName": "Psionic_Lance",
  "available": 11,
  "description": "This extremely long range Psionic attack has a bonus to Accuracy, and can Slow a target's attack rate. This is a sniper attack, and is best fired from a distance as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.",
  "shortHelp": "Sniper, DMG(Psionic), Target -Recharge",
  "icon": "psychicblast_psioniclance.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 175,
    "recharge": 12,
    "endurance": 14.352,
    "castTime": 1.33
  },
  "allowedEnhancements": [
    "Interrupt",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Corruptor Archetype Sets",
    "Ranged Damage",
    "Sniper Attacks",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
